import { describe, expect, it } from "vitest";

import {
  InMemoryCatalogSubmissionRepository,
  listPublicCatalogRestaurants,
  nextRestaurantUrlHandle,
  submitRestaurantWithFirstLocation
} from "../src/catalog-submission.js";
import { routeRequest } from "../src/http.js";
import { InMemoryTasteAppUserRepository } from "../src/identity.js";

describe("submitRestaurantWithFirstLocation", () => {
  it("returns an unverified confirmation when a signed-in TasteApp User submits a Restaurant with its first Location", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await expect(
      submitRestaurantWithFirstLocation(
        {
          firstLocation: {
            address: "123 Pho Lane, Houston, TX",
            googleMapsUrl: "https://maps.google.com/?q=Pho+Real",
            kind: "STANDALONE",
            name: "Pho Real - Midtown",
            websiteUrl: "https://phoreal.example"
          },
          restaurantName: "Pho Real"
        },
        {
          id: "00000000-0000-4000-8000-000000000101"
        },
        repository
      )
    ).resolves.toEqual({
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

  it("rejects a Restaurant submission without its first Location", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await expect(
      submitRestaurantWithFirstLocation(
        {
          restaurantName: "Pho Real"
        },
        {
          id: "00000000-0000-4000-8000-000000000101"
        },
        repository
      )
    ).rejects.toThrow("First Location is required.");
  });

  it("excludes unverified Restaurant submissions from the public catalog", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await submitRestaurantWithFirstLocation(
      {
        firstLocation: {
          address: "123 Pho Lane, Houston, TX",
          kind: "STANDALONE",
          name: "Pho Real - Midtown"
        },
        restaurantName: "Pho Real"
      },
      {
        id: "00000000-0000-4000-8000-000000000101"
      },
      repository
    );

    await expect(listPublicCatalogRestaurants(repository)).resolves.toEqual([]);
  });

  it("accepts Food Truck submissions without a stable street address", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await expect(
      submitRestaurantWithFirstLocation(
        {
          firstLocation: {
            kind: "FOOD_TRUCK",
            name: "Rolling Ramen Truck",
            websiteUrl: "https://rollingramen.example"
          },
          restaurantName: "Rolling Ramen"
        },
        {
          id: "00000000-0000-4000-8000-000000000101"
        },
        repository
      )
    ).resolves.toMatchObject({
      location: {
        name: "Rolling Ramen Truck"
      },
      restaurantName: "Rolling Ramen",
      verificationState: "unverified"
    });
  });

  it("accepts Canteen submissions with shared venue context", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await expect(
      submitRestaurantWithFirstLocation(
        {
          firstLocation: {
            address: "North Mall, Houston, TX",
            googleMapsUrl: "https://maps.google.com/?q=North+Mall",
            kind: "CANTEEN",
            name: "Taco Palace at North Mall"
          },
          restaurantName: "Taco Palace"
        },
        {
          id: "00000000-0000-4000-8000-000000000101"
        },
        repository
      )
    ).resolves.toMatchObject({
      location: {
        address: "North Mall, Houston, TX",
        name: "Taco Palace at North Mall"
      },
      restaurantName: "Taco Palace",
      verificationState: "unverified"
    });
  });
});

describe("API catalog submission routes", () => {
  it("requires authentication for Restaurant and first Location submissions", async () => {
    await expect(
      routeRequest("POST", "/catalog/submissions", {
        body: {
          firstLocation: {
            address: "123 Pho Lane, Houston, TX",
            kind: "STANDALONE",
            name: "Pho Real - Midtown"
          },
          restaurantName: "Pho Real"
        },
        catalogSubmissionRepository: new InMemoryCatalogSubmissionRepository()
      })
    ).resolves.toEqual({
      body: {
        error: "Authentication required"
      },
      statusCode: 401
    });
  });

  it("returns a confirmation for an authenticated Restaurant and first Location submission", async () => {
    await expect(
      routeRequest("POST", "/catalog/submissions", {
        accountRepository: new InMemoryTasteAppUserRepository(),
        authContext: {
          displayName: "Khoi Le",
          email: "khoi@example.com",
          provider: "clerk",
          providerSubject: "user_123"
        },
        body: {
          firstLocation: {
            address: "123 Pho Lane, Houston, TX",
            kind: "STANDALONE",
            name: "Pho Real - Midtown"
          },
          restaurantName: "Pho Real"
        },
        catalogSubmissionRepository: new InMemoryCatalogSubmissionRepository()
      })
    ).resolves.toEqual({
      body: {
        location: {
          address: "123 Pho Lane, Houston, TX",
          name: "Pho Real - Midtown"
        },
        message: "Thanks, we'll review this before it appears in TasteApp.",
        restaurantName: "Pho Real",
        submissionId: "00000000-0000-4000-8000-000000000001",
        verificationState: "unverified"
      },
      statusCode: 201
    });
  });

  it("returns a validation error when the authenticated submission is missing its first Location", async () => {
    await expect(
      routeRequest("POST", "/catalog/submissions", {
        accountRepository: new InMemoryTasteAppUserRepository(),
        authContext: {
          displayName: "Khoi Le",
          email: "khoi@example.com",
          provider: "clerk",
          providerSubject: "user_123"
        },
        body: {
          restaurantName: "Pho Real"
        },
        catalogSubmissionRepository: new InMemoryCatalogSubmissionRepository()
      })
    ).resolves.toEqual({
      body: {
        error: "First Location is required."
      },
      statusCode: 400
    });
  });
});

describe("Restaurant URL handles", () => {
  it("keeps repeated Restaurant names from colliding", () => {
    expect(nextRestaurantUrlHandle("Pho Real", ["pho-real", "pho-real-2"])).toBe("pho-real-3");
  });
});
