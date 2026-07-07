import { describe, expect, it } from "vitest";

import {
  buildCatalogSubmissionPayload,
  createEmptyCatalogSubmissionForm
} from "../src/catalog-submission";

describe("buildCatalogSubmissionPayload", () => {
  it("builds a Restaurant and first Location submission from signed-in mobile form state", () => {
    expect(
      buildCatalogSubmissionPayload({
        address: " 123 Pho Lane, Houston, TX ",
        googleMapsUrl: "https://maps.google.com/?q=Pho+Real",
        locationKind: "STANDALONE",
        locationName: " Pho Real - Midtown ",
        restaurantName: " Pho Real ",
        websiteUrl: "https://phoreal.example"
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

  it("allows a Food Truck submission without a stable street address", () => {
    expect(
      buildCatalogSubmissionPayload({
        ...createEmptyCatalogSubmissionForm(),
        locationKind: "FOOD_TRUCK",
        locationName: "Rolling Ramen Truck",
        restaurantName: "Rolling Ramen",
        websiteUrl: "https://rollingramen.example"
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

  it("requires an address for non-Food Truck submissions", () => {
    expect(() =>
      buildCatalogSubmissionPayload({
        ...createEmptyCatalogSubmissionForm(),
        locationKind: "CANTEEN",
        locationName: "Taco Palace at North Mall",
        restaurantName: "Taco Palace"
      })
    ).toThrow("Address is required unless this is a Food Truck.");
  });
});
