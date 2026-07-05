import { describe, expect, it } from "vitest";

import { getWebHealthStatus } from "../src/health.js";

describe("getWebHealthStatus", () => {
  it("returns the shared health contract", () => {
    expect(getWebHealthStatus()).toEqual({
      service: "tasteapp",
      status: "ok"
    });
  });
});
