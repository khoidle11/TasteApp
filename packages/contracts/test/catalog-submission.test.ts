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
