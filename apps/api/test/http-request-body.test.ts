import { Readable } from "node:stream";
import type { IncomingHttpHeaders, IncomingMessage, ServerResponse } from "node:http";

import { describe, expect, it } from "vitest";

import { handleRequest } from "../src/http.js";

describe("HTTP request body handling", () => {
  it("rejects oversized JSON request bodies before routing", async () => {
    const response = await handleJsonRequest({
      body: "x".repeat(65_537),
      headers: {},
      method: "POST",
      url: "/v1/catalog/submissions"
    });

    expect(response).toEqual({
      body: {
        error: "Request body too large"
      },
      statusCode: 413
    });
  });

  it("rejects malformed JSON request bodies as client input", async () => {
    const response = await handleJsonRequest({
      body: "{not valid json",
      headers: {},
      method: "POST",
      url: "/v1/catalog/submissions"
    });

    expect(response).toEqual({
      body: {
        error: "Invalid JSON request body"
      },
      statusCode: 400
    });
  });
});

type JsonRequestOptions = {
  body: string;
  headers: IncomingHttpHeaders;
  method: string;
  url: string;
};

type CapturedJsonResponse = {
  body: unknown;
  statusCode: number;
};

function handleJsonRequest(options: JsonRequestOptions): Promise<CapturedJsonResponse> {
  const request = Readable.from([options.body]) as IncomingMessage;
  request.headers = options.headers;
  request.method = options.method;
  request.url = options.url;

  let statusCode = 0;

  return new Promise((resolve) => {
    const response = {
      end: (body: string) => {
        resolve({
          body: JSON.parse(body) as unknown,
          statusCode
        });
      },
      writeHead: (nextStatusCode: number) => {
        statusCode = nextStatusCode;
      }
    } as ServerResponse;

    handleRequest(request, response);
  });
}
