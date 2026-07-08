import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";

import { geocodeSearchLocation, type GeocodingProvider } from "../src/location-discovery.js";
import { PrismaGeocodingCacheRepository } from "../src/prisma-location-discovery-repository.js";

process.env.DATABASE_URL ??= "postgresql://tasteapp:tasteapp@localhost:5432/tasteapp_dev";

const runDatabaseIntegrationTests = process.env.TASTEAPP_RUN_DB_INTEGRATION_TESTS === "1";
const prisma = runDatabaseIntegrationTests ? new PrismaClient() : null;
const repository = prisma ? new PrismaGeocodingCacheRepository(prisma) : null;
const providerId = `fake-maps-${randomUUID()}`;

describe.skipIf(!runDatabaseIntegrationTests)("PrismaGeocodingCacheRepository", () => {
  it("reuses cached geocoding results without calling the provider again", async () => {
    if (!prisma || !repository) {
      throw new Error("Database integration test repository was not initialized.");
    }

    const providerCalls: string[] = [];
    const provider: GeocodingProvider = {
      id: providerId,
      geocode: (query) => {
        providerCalls.push(query);

        return Promise.resolve({
          displayLabel: "Chicago, IL",
          latitude: 41.8781,
          longitude: -87.6298,
          providerPlaceId: "chicago-il"
        });
      }
    };

    const firstResult = await geocodeSearchLocation("Chicago", provider, repository);
    const secondResult = await geocodeSearchLocation(" chicago ", provider, repository);

    expect(secondResult).toEqual(firstResult);
    expect(providerCalls).toEqual(["chicago"]);
  });
});

afterAll(async () => {
  if (!prisma) {
    return;
  }

  await prisma.geocodingCacheEntry.deleteMany({
    where: {
      providerId
    }
  });

  await prisma.$disconnect();
});
