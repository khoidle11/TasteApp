import { describe, expect, it } from "vitest";

import {
  catalogSubmissionFingerprint,
  catalogSubmissionFingerprintBucket,
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

  it("rejects whitespace-only Restaurant and Location names at the API boundary", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await expect(
      submitRestaurantWithFirstLocation(
        {
          firstLocation: {
            address: "123 Pho Lane, Houston, TX",
            kind: "STANDALONE",
            name: "   "
          },
          restaurantName: "   "
        },
        {
          id: "00000000-0000-4000-8000-000000000101"
        },
        repository
      )
    ).rejects.toThrow("Location name is required.");
  });

  it("rejects Standalone and Canteen submissions without an address at the API boundary", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();

    await expect(
      submitRestaurantWithFirstLocation(
        {
          firstLocation: {
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
    ).rejects.toThrow("Address is required unless this is a Food Truck.");
  });

  it("reuses a recent exact duplicate submission from the same TasteApp User", async () => {
    const repository = new InMemoryCatalogSubmissionRepository();
    const input = {
      firstLocation: {
        address: "123 Pho Lane, Houston, TX",
        kind: "STANDALONE" as const,
        name: "Pho Real - Midtown"
      },
      restaurantName: "Pho Real"
    };
    const submitter = {
      id: "00000000-0000-4000-8000-000000000101"
    };

    const firstConfirmation = await submitRestaurantWithFirstLocation(input, submitter, repository);
    const secondConfirmation = await submitRestaurantWithFirstLocation(
      input,
      submitter,
      repository
    );

    expect(secondConfirmation.submissionId).toBe(firstConfirmation.submissionId);
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
      routeRequest("POST", "/v1/catalog/submissions", {
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
      routeRequest("POST", "/v1/catalog/submissions", {
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
      routeRequest("POST", "/v1/catalog/submissions", {
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

  it("logs unexpected submission failures while returning a generic server error", async () => {
    const loggedErrors: [string, { error: unknown }][] = [];

    await expect(
      routeRequest("POST", "/v1/catalog/submissions", {
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
        catalogSubmissionRepository: {
          createRestaurantWithFirstLocation: () =>
            Promise.reject(new Error("database unavailable")),
          findRecentRestaurantWithFirstLocationSubmission: () => Promise.resolve(null),
          listPublicRestaurants: () => Promise.resolve([])
        },
        logger: {
          error: (message: string, context: { error: unknown }) => {
            loggedErrors.push([message, context]);
          }
        }
      })
    ).resolves.toEqual({
      body: {
        error: "Internal server error"
      },
      statusCode: 500
    });

    expect(loggedErrors).toHaveLength(1);
    expect(loggedErrors[0]?.[0]).toBe("Catalog submission route failed");
    expect(loggedErrors[0]?.[1].error).toBeInstanceOf(Error);
  });

  it("does not expose the unversioned Restaurant and first Location submission route", async () => {
    await expect(routeRequest("POST", "/catalog/submissions")).resolves.toEqual({
      body: {
        error: "Not found"
      },
      statusCode: 404
    });
  });

  it("rate limits authenticated Restaurant and first Location submissions", async () => {
    const rateLimiter = {
      consume: () => false
    };

    await expect(
      routeRequest("POST", "/v1/catalog/submissions", {
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
        catalogSubmissionRepository: new InMemoryCatalogSubmissionRepository(),
        rateLimiter
      })
    ).resolves.toEqual({
      body: {
        error: "Too many requests"
      },
      statusCode: 429
    });
  });
});

describe("Restaurant URL handles", () => {
  it("keeps repeated Restaurant names from colliding", () => {
    expect(
      nextRestaurantUrlHandle(
        "Pho Real",
        ["pho-real", "pho-real-2"],
        "00000000-0000-4000-8000-000000000123"
      )
    ).toBe("pho-real-3");
  });

  it("falls back to a Restaurant ID handle when the readable name has no ASCII handle", () => {
    expect(nextRestaurantUrlHandle("🍜🍜", [], "00000000-0000-4000-8000-000000000123")).toBe(
      "restaurant-000000000123"
    );
  });
});

describe("Catalog submission fingerprints", () => {
  it("keeps the normalized payload stable while bucketing deduplication windows", () => {
    const input = {
      firstLocation: {
        address: "123 Pho Lane, Houston, TX",
        kind: "STANDALONE" as const,
        name: "Pho Real - Midtown"
      },
      restaurantName: "Pho Real"
    };

    expect(catalogSubmissionFingerprint(input)).toBe(catalogSubmissionFingerprint(input));
    expect(catalogSubmissionFingerprintBucket(new Date("2026-07-07T00:00:00.000Z"))).toBe(
      catalogSubmissionFingerprintBucket(new Date("2026-07-07T00:04:59.999Z"))
    );
    expect(catalogSubmissionFingerprintBucket(new Date("2026-07-07T00:00:00.000Z"))).not.toBe(
      catalogSubmissionFingerprintBucket(new Date("2026-07-07T00:05:00.000Z"))
    );
  });
});
