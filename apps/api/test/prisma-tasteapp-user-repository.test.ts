import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";
import { afterAll, describe, expect, it } from "vitest";

import { resolveCurrentTasteAppUser } from "../src/identity.js";
import { PrismaTasteAppUserRepository } from "../src/prisma-tasteapp-user-repository.js";

process.env.DATABASE_URL ??= "postgresql://tasteapp:tasteapp@localhost:5432/tasteapp_dev";

const createdProviderSubjects: string[] = [];
const runDatabaseIntegrationTests = process.env.TASTEAPP_RUN_DB_INTEGRATION_TESTS === "1";
const prisma = runDatabaseIntegrationTests ? new PrismaClient() : null;
const repository = prisma ? new PrismaTasteAppUserRepository(prisma) : null;

describe.skipIf(!runDatabaseIntegrationTests)("PrismaTasteAppUserRepository", () => {
  it("maps a Clerk identity to one reusable local TasteApp User", async () => {
    if (!repository) {
      throw new Error("Database integration test repository was not initialized.");
    }

    const providerSubject = `user_${randomUUID()}`;
    createdProviderSubjects.push(providerSubject);

    const firstUser = await resolveCurrentTasteAppUser(
      {
        displayName: "Khoi Le",
        email: "khoi@example.com",
        provider: "clerk",
        providerSubject
      },
      repository
    );

    const secondUser = await resolveCurrentTasteAppUser(
      {
        displayName: "Khoi Updated",
        email: "updated@example.com",
        provider: "clerk",
        providerSubject
      },
      repository
    );

    expect(secondUser).toEqual({
      displayName: "Khoi Updated",
      id: firstUser.id,
      primaryEmail: "updated@example.com"
    });
    expect(firstUser).toMatchObject({
      displayName: "Khoi Le",
      primaryEmail: "khoi@example.com"
    });
  });
});

afterAll(async () => {
  if (!prisma) {
    return;
  }

  const identities = await prisma.externalAuthIdentity.findMany({
    select: {
      tasteAppUserId: true
    },
    where: {
      providerSubject: {
        in: createdProviderSubjects
      }
    }
  });

  await prisma.externalAuthIdentity.deleteMany({
    where: {
      providerSubject: {
        in: createdProviderSubjects
      }
    }
  });

  await prisma.tasteAppUser.deleteMany({
    where: {
      id: {
        in: identities.map((identity) => identity.tasteAppUserId)
      }
    }
  });

  await prisma.$disconnect();
});
