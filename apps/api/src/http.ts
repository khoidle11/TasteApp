import type { IncomingMessage, ServerResponse } from "node:http";

import { getHealthResponse, getReadinessResponse } from "./health.js";

type JsonResponse = {
  body: unknown;
  statusCode: number;
};

export function routeRequest(method: string | undefined, url: string | undefined): JsonResponse {
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

  return {
    body: {
      error: "Not found"
    },
    statusCode: 404
  };
}

export function handleRequest(request: IncomingMessage, response: ServerResponse): void {
  const result = routeRequest(request.method, request.url);

  response.writeHead(result.statusCode, {
    "content-type": "application/json; charset=utf-8"
  });
  response.end(JSON.stringify(result.body));
}
