import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";

import { submitRestaurantWithFirstLocation } from "../src/catalog-submission.js";
import { PrismaCatalogSubmissionRepository } from "../src/prisma-catalog-submission-repository.js";

process.env.DATABASE_URL ??= "postgresql://tasteapp:tasteapp@localhost:5432/tasteapp_dev";

const runDatabaseIntegrationTests = process.env.TASTEAPP_RUN_DB_INTEGRATION_TESTS === "1";
const prisma = runDatabaseIntegrationTests ? new PrismaClient() : null;
const repository = prisma ? new PrismaCatalogSubmissionRepository(prisma) : null;
const createdSubmitterIds: string[] = [];

describe.skipIf(!runDatabaseIntegrationTests)("PrismaCatalogSubmissionRepository", () => {
  it("persists a signed-in Restaurant and first Location submission as unverified catalog data", async () => {
    if (!prisma || !repository) {
      throw new Error("Database integration test repository was not initialized.");
    }

    const submitter = await prisma.tasteAppUser.create({
      data: {
        displayName: "Khoi Le",
        primaryEmail: `khoi-${randomUUID()}@example.com`
      }
    });
    createdSubmitterIds.push(submitter.id);

    const confirmation = await submitRestaurantWithFirstLocation(
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
        id: submitter.id
      },
      repository
    );

    expect(confirmation).toMatchObject({
      location: {
        address: "123 Pho Lane, Houston, TX",
        name: "Pho Real - Midtown"
      },
      restaurantName: "Pho Real",
      verificationState: "unverified"
    });
    await expect(repository.listPublicRestaurants()).resolves.toEqual([]);
  });
});

afterAll(async () => {
  if (!prisma) {
    return;
  }

  await prisma.location.deleteMany({
    where: {
      restaurant: {
        submittedByTasteAppUserId: {
          in: createdSubmitterIds
        }
      }
    }
  });
  await prisma.restaurant.deleteMany({
    where: {
      submittedByTasteAppUserId: {
        in: createdSubmitterIds
      }
    }
  });
  await prisma.tasteAppUser.deleteMany({
    where: {
      id: {
        in: createdSubmitterIds
      }
    }
  });

  await prisma.$disconnect();
});
