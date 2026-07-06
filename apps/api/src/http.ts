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
};

export async function routeRequest(
  method: string | undefined,
  url: string | undefined,
  options: RouteRequestOptions = {}
): Promise<JsonResponse> {
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
      } catch {
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

  if (method === "POST" && url === "/catalog/submissions") {
    if (!options.authContext) {
      return {
        body: {
          error: "Authentication required"
        },
        statusCode: 401
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
  void handleRequestAsync(request, response).catch(() => {
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
    (method === "POST" && url === "/catalog/submissions")
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

  for await (const chunk of request as AsyncIterable<Buffer | string>) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return undefined;
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
}
