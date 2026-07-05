import type { IncomingMessage, ServerResponse } from "node:http";

import { CurrentTasteAppUserResponseSchema } from "@tasteapp/contracts";

import { getClerkAuthContextFromAuthorization } from "./clerk-auth.js";
import { getHealthResponse, getReadinessResponse } from "./health.js";
import {
  resolveCurrentTasteAppUser,
  type AuthenticatedRequestContext,
  type TasteAppUserRepository
} from "./identity.js";
import { prismaTasteAppUserRepository } from "./prisma-tasteapp-user-repository.js";

type JsonResponse = {
  body: unknown;
  statusCode: number;
};

type RouteRequestOptions = {
  accountRepository?: TasteAppUserRepository;
  authContext?: AuthenticatedRequestContext;
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
    authContext: authContext ?? undefined
  });

  writeJsonResponse(response, result);
}

function requiresAuthContext(method: string | undefined, url: string | undefined): boolean {
  return method === "GET" && url === "/account/me";
}

function writeJsonResponse(response: ServerResponse, result: JsonResponse): void {
  response.writeHead(result.statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(result.body));
}
