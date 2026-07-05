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
  void getClerkAuthContextFromAuthorization(
    request.headers.authorization,
    process.env.CLERK_SECRET_KEY
  )
    .then((authContext) =>
      routeRequest(request.method, request.url, {
        authContext: authContext ?? undefined
      })
    )
    .then((result) => {
      response.writeHead(result.statusCode, {
        "content-type": "application/json; charset=utf-8"
      });
      response.end(JSON.stringify(result.body));
    });
}
