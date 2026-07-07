import { describe, expect, it } from "vitest";

import {
  CatalogSubmissionConfirmationSchema,
  SubmitRestaurantWithFirstLocationInputSchema
} from "../src/catalog-submission.js";

describe("catalog submission contracts", () => {
  it("accepts a Restaurant and first Location submission payload", () => {
    expect(
      SubmitRestaurantWithFirstLocationInputSchema.parse({
        firstLocation: {
          address: "123 Pho Lane, Houston, TX",
          googleMapsUrl: "https://maps.google.com/?q=Pho+Real",
          kind: "STANDALONE",
          name: "Pho Real - Midtown",
          websiteUrl: "https://phoreal.example"
        },
        restaurantName: "Pho Real"
      })
    ).toEqual({
      firstLocation: {
        address: "123 Pho Lane, Houston, TX",
        googleMapsUrl: "https://maps.google.com/?q=Pho+Real",
        kind: "STANDALONE",
        name: "Pho Real - Midtown",
        websiteUrl: "https://phoreal.example"
      },
      restaurantName: "Pho Real"
    });
  });

  it("rejects whitespace-only Restaurant and Location names", () => {
    const result = SubmitRestaurantWithFirstLocationInputSchema.safeParse({
      firstLocation: {
        address: "123 Pho Lane, Houston, TX",
        kind: "STANDALONE",
        name: "   "
      },
      restaurantName: "   "
    });

    expect(result.success).toBe(false);
  });

  it("requires an address unless the Location is a Food Truck", () => {
    const result = SubmitRestaurantWithFirstLocationInputSchema.safeParse({
      firstLocation: {
        kind: "CANTEEN",
        name: "Taco Palace at North Mall"
      },
      restaurantName: "Taco Palace"
    });

    expect(result.success).toBe(false);
  });

  it("allows Food Truck submissions without a stable address", () => {
    expect(
      SubmitRestaurantWithFirstLocationInputSchema.parse({
        firstLocation: {
          kind: "FOOD_TRUCK",
          name: "Rolling Ramen Truck",
          websiteUrl: "https://rollingramen.example"
        },
        restaurantName: "Rolling Ramen"
      })
    ).toEqual({
      firstLocation: {
        kind: "FOOD_TRUCK",
        name: "Rolling Ramen Truck",
        websiteUrl: "https://rollingramen.example"
      },
      restaurantName: "Rolling Ramen"
    });
  });

  it("uses confirmation DTOs instead of public Restaurant DTOs", () => {
    expect(
      CatalogSubmissionConfirmationSchema.parse({
        location: {
          address: "123 Pho Lane, Houston, TX",
          name: "Pho Real - Midtown"
        },
        message: "Thanks, we'll review this before it appears in TasteApp.",
        restaurantName: "Pho Real",
        submissionId: "00000000-0000-4000-8000-000000000001",
        verificationState: "unverified"
      })
    ).toEqual({
      location: {
        address: "123 Pho Lane, Houston, TX",
        name: "Pho Real - Midtown"
      },
      message: "Thanks, we'll review this before it appears in TasteApp.",
      restaurantName: "Pho Real",
      submissionId: "00000000-0000-4000-8000-000000000001",
      verificationState: "unverified"
    });
  });
});
