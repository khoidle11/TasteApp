import { describe, expect, it } from "vitest";

import { PublicCatalogRestaurantListResponseSchema } from "../src/public-catalog.js";

describe("public catalog contracts", () => {
  it("accepts Restaurant list results with optional distance labels", () => {
    expect(
      PublicCatalogRestaurantListResponseSchema.parse({
        restaurants: [
          {
            distance: {
              label: "~2 mi",
              miles: 1.8
            },
            id: "00000000-0000-4000-8000-000000000001",
            location: {
              latitude: 29.742,
              longitude: -95.391,
              name: "Pho Real - Midtown"
            },
            name: "Pho Real",
            urlHandle: "pho-real"
          }
        ]
      })
    ).toEqual({
      restaurants: [
        {
          distance: {
            label: "~2 mi",
            miles: 1.8
          },
          id: "00000000-0000-4000-8000-000000000001",
          location: {
            latitude: 29.742,
            longitude: -95.391,
            name: "Pho Real - Midtown"
          },
          name: "Pho Real",
          urlHandle: "pho-real"
        }
      ]
    });
  });
});
