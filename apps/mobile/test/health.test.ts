import { describe, expect, it } from "vitest";

import { getMobileHealthStatus } from "../src/health";

describe("getMobileHealthStatus", () => {
  it("returns the shared health contract", () => {
    expect(getMobileHealthStatus()).toEqual({
      service: "tasteapp",
      status: "ok"
    });
  });
});
