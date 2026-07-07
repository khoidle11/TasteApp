import type { IncomingMessage, ServerResponse } from "node:http";

import {
  CatalogSubmissionConfirmationSchema,
  CurrentTasteAppUserResponseSchema
} from "@tasteapp/contracts";

import {
  CatalogSubmissionValidationError,
  submitRestaurantWithFirstLocation,
  type CatalogSubmissionRepository
} from "./catalog-submission.js";
import { getClerkAuthContextFromAuthorization } from "./clerk-auth.js";
import { getHealthResponse, getReadinessResponse } from "./health.js";
import {
  resolveCurrentTasteAppUser,
  type AuthenticatedRequestContext,
  type TasteAppUserRepository
} from "./identity.js";
import { prismaTasteAppUserRepository } from "./prisma-tasteapp-user-repository.js";
import { prismaCatalogSubmissionRepository } from "./prisma-catalog-submission-repository.js";

type JsonResponse = {
  body: unknown;
  statusCode: number;
};

type RouteRequestOptions = {
  accountRepository?: TasteAppUserRepository;
  authContext?: AuthenticatedRequestContext;
  body?: unknown;
  catalogSubmissionRepository?: CatalogSubmissionRepository;
  logger?: Pick<Console, "error">;
  rateLimiter?: RateLimiter;
};

class RequestBodyTooLargeError extends Error {
  constructor() {
    super("Request body too large");
    this.name = "RequestBodyTooLargeError";
  }
}

class InvalidJsonRequestBodyError extends Error {
  constructor() {
    super("Invalid JSON request body");
    this.name = "InvalidJsonRequestBodyError";
  }
}

type RateLimiter = {
  consume(key: string, limit: number, windowMs: number): boolean;
};

const maxJsonBodyBytes = 64 * 1024;
const catalogSubmissionPath = "/v1/catalog/submissions";
const catalogSubmissionRateLimit = 10;
const catalogSubmissionRateLimitWindowMs = 60 * 1000;

export async function routeRequest(
  method: string | undefined,
  url: string | undefined,
  options: RouteRequestOptions = {}
): Promise<JsonResponse> {
  const logger = options.logger ?? console;
  const rateLimiter = options.rateLimiter ?? inMemoryRateLimiter;

  if (method === "GET" && url === "/health") {
    return {
      body: getHealthResponse(),
      statusCode: 200
    };
  }

  if (method === "GET" && url === "/health/ready") {
    return {
      body: getReadinessResponse(),
      statusCode: 200
    };
  }

  if (method === "GET" && url === "/account/me") {
    if (options.authContext) {
      try {
        const user = await resolveCurrentTasteAppUser(
          options.authContext,
          options.accountRepository ?? prismaTasteAppUserRepository
        );

        return {
          body: CurrentTasteAppUserResponseSchema.parse({
            user
          }),
          statusCode: 200
        };
      } catch (error) {
        logger.error("Account route failed", { error });

        return {
          body: {
            error: "Internal server error"
          },
          statusCode: 500
        };
      }
    }

    return {
      body: {
        error: "Authentication required"
      },
      statusCode: 401
    };
  }

  if (method === "POST" && url === catalogSubmissionPath) {
    if (!options.authContext) {
      return {
        body: {
          error: "Authentication required"
        },
        statusCode: 401
      };
    }

    if (
      !rateLimiter.consume(
        catalogSubmissionRateLimitKey(options.authContext),
        catalogSubmissionRateLimit,
        catalogSubmissionRateLimitWindowMs
      )
    ) {
      return {
        body: {
          error: "Too many requests"
        },
        statusCode: 429
      };
    }

    try {
      const currentUser = await resolveCurrentTasteAppUser(
        options.authContext,
        options.accountRepository ?? prismaTasteAppUserRepository
      );
      const confirmation = await submitRestaurantWithFirstLocation(
        options.body,
        { id: currentUser.id },
        options.catalogSubmissionRepository ?? prismaCatalogSubmissionRepository
      );

      return {
        body: CatalogSubmissionConfirmationSchema.parse(confirmation),
        statusCode: 201
      };
    } catch (error) {
      if (error instanceof CatalogSubmissionValidationError) {
        return {
          body: {
            error: error.message
          },
          statusCode: 400
        };
      }

      logger.error("Catalog submission route failed", { error });

      return {
        body: {
          error: "Internal server error"
        },
        statusCode: 500
      };
    }
  }

  return {
    body: {
      error: "Not found"
    },
    statusCode: 404
  };
}

export function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  void handleRequestAsync(request, response).catch((error: unknown) => {
    if (error instanceof RequestBodyTooLargeError) {
      writeJsonResponse(response, {
        body: {
          error: error.message
        },
        statusCode: 413
      });
      return;
    }

    if (error instanceof InvalidJsonRequestBodyError) {
      writeJsonResponse(response, {
        body: {
          error: error.message
        },
        statusCode: 400
      });
      return;
    }

    console.error("HTTP request failed", { error });
    writeJsonResponse(response, {
      body: {
        error: "Internal server error"
      },
      statusCode: 500
    });
  });
}

async function handleRequestAsync(
  request: IncomingMessage,
  response: ServerResponse
): Promise<void> {
  const authContext = requiresAuthContext(request.method, request.url)
    ? await getClerkAuthContextFromAuthorization(
        request.headers.authorization,
        process.env.CLERK_SECRET_KEY
      )
    : null;

  const result = await routeRequest(request.method, request.url, {
    authContext: authContext ?? undefined,
    body: request.method === "POST" ? await readJsonBody(request) : undefined
  });

  writeJsonResponse(response, result);
}

function requiresAuthContext(method: string | undefined, url: string | undefined): boolean {
  return (
    (method === "GET" && url === "/account/me") ||
    (method === "POST" && url === catalogSubmissionPath)
  );
}

function writeJsonResponse(response: ServerResponse, result: JsonResponse): void {
  response.writeHead(result.statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(result.body));
}

async function readJsonBody(request: IncomingMessage): Promise<unknown> {
  const chunks: Uint8Array[] = [];
  let byteLength = 0;

  for await (const chunk of request as AsyncIterable<Buffer | string>) {
    const buffer = typeof chunk === "string" ? Buffer.from(chunk) : chunk;
    byteLength += buffer.byteLength;

    if (byteLength > maxJsonBodyBytes) {
      throw new RequestBodyTooLargeError();
    }

    chunks.push(buffer);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } catch {
    throw new InvalidJsonRequestBodyError();
  }
}

function catalogSubmissionRateLimitKey(authContext: AuthenticatedRequestContext): string {
  return `catalog-submissions:${authContext.provider}:${authContext.providerSubject}`;
}

class InMemoryRateLimiter implements RateLimiter {
  private readonly requestsByKey = new Map<string, number[]>();

  consume(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const windowStart = now - windowMs;
    const recentRequests = (this.requestsByKey.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart
    );

    if (recentRequests.length >= limit) {
      this.requestsByKey.set(key, recentRequests);
      return false;
    }

    recentRequests.push(now);
    this.requestsByKey.set(key, recentRequests);
    return true;
  }
}

const inMemoryRateLimiter = new InMemoryRateLimiter();
