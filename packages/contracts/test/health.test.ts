import { describe, expect, it } from "vitest";

import { HealthResponseSchema, ReadinessResponseSchema } from "../src/index.js";

describe("health contracts", () => {
  it("accepts the liveness health response", () => {
    expect(
      HealthResponseSchema.parse({
        service: "tasteapp",
        status: "ok"
      })
    ).toEqual({
      service: "tasteapp",
      status: "ok"
    });
  });

  it("accepts the readiness response with dependency checks", () => {
    expect(
      ReadinessResponseSchema.parse({
        checks: [
          {
            name: "postgres",
            status: "ok"
          }
        ],
        ready: true,
        service: "tasteapp"
      })
    ).toEqual({
      checks: [
        {
          name: "postgres",
          status: "ok"
        }
      ],
      ready: true,
      service: "tasteapp"
    });
  });
});
