import { describe, expect, it } from "vitest";

import { SearchLocationInputSchema } from "../src/location-discovery.js";

describe("location discovery contracts", () => {
  it("accepts device coordinates as a Search Location", () => {
    expect(
      SearchLocationInputSchema.parse({
        latitude: 29.7604,
        longitude: -95.3698,
        source: "device"
      })
    ).toEqual({
      latitude: 29.7604,
      longitude: -95.3698,
      source: "device"
    });
  });

  it("accepts typed Search Location fallback", () => {
    expect(
      SearchLocationInputSchema.parse({
        query: "Chicago",
        source: "typed"
      })
    ).toEqual({
      query: "Chicago",
      source: "typed"
    });
  });

  it("rejects empty typed Search Location fallback", () => {
    const result = SearchLocationInputSchema.safeParse({
      query: "   ",
      source: "typed"
    });

    expect(result.success).toBe(false);
  });
});
