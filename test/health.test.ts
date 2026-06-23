import { describe, expect, it } from "vitest";

import { getHealthStatus } from "../src/health.js";

describe("getHealthStatus", () => {
  it("returns the baseline TasteApp health payload", () => {
    expect(getHealthStatus()).toEqual({
      service: "tasteapp",
      status: "ok"
    });
  });
});
