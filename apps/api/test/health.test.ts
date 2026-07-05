import { describe, expect, it } from "vitest";

import { routeRequest } from "../src/http.js";

describe("API health routes", () => {
  it("returns the liveness response for GET /health", () => {
    expect(routeRequest("GET", "/health")).toEqual({
      body: {
        service: "tasteapp",
        status: "ok"
      },
      statusCode: 200
    });
  });

  it("returns the readiness response for GET /health/ready", () => {
    expect(routeRequest("GET", "/health/ready")).toEqual({
      body: {
        checks: [],
        ready: true,
        service: "tasteapp"
      },
      statusCode: 200
    });
  });

  it("returns a not found response for unknown routes", () => {
    expect(routeRequest("GET", "/missing")).toEqual({
      body: {
        error: "Not found"
      },
      statusCode: 404
    });
  });
});
