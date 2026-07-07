import { Prisma, PrismaClient } from "@prisma/client";
import { randomUUID } from "node:crypto";

import type { SubmitRestaurantWithFirstLocationInput } from "@tasteapp/contracts";

import {
  nextRestaurantUrlHandle,
  toRestaurantUrlHandle,
  type CatalogSubmissionRepository,
  type PublicCatalogRestaurant,
  type Submitter
} from "./catalog-submission.js";

export class PrismaCatalogSubmissionRepository implements CatalogSubmissionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async createRestaurantWithFirstLocation(
    input: SubmitRestaurantWithFirstLocationInput,
    submitter: Submitter,
    submissionFingerprint: string,
    submissionFingerprintBucket: string
  ): Promise<{ submissionId: string }> {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        return await this.createRestaurantWithFirstLocationAttempt(
          input,
          submitter,
          submissionFingerprint,
          submissionFingerprintBucket
        );
      } catch (error) {
        if (isUniqueSubmissionFingerprintError(error)) {
          const existingSubmission = await this.findSubmissionByFingerprint(
            submitter,
            submissionFingerprint,
            submissionFingerprintBucket
          );

          if (existingSubmission) {
            return existingSubmission;
          }
        }

        if (!isUniqueUrlHandleError(error)) {
          throw error;
        }
      }
    }

    throw new Error("Unable to allocate a unique Restaurant URL handle.");
  }

  async findRecentRestaurantWithFirstLocationSubmission(
    submitter: Submitter,
    submissionFingerprint: string,
    submittedAfter: Date
  ): Promise<{ submissionId: string } | null> {
    const restaurant = await this.prisma.restaurant.findFirst({
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true
      },
      where: {
        createdAt: {
          gte: submittedAfter
        },
        submissionFingerprint,
        submittedByTasteAppUserId: submitter.id,
        verificationState: "unverified"
      }
    });

    return restaurant ? { submissionId: restaurant.id } : null;
  }

  private async createRestaurantWithFirstLocationAttempt(
    input: SubmitRestaurantWithFirstLocationInput,
    submitter: Submitter,
    submissionFingerprint: string,
    submissionFingerprintBucket: string
  ): Promise<{ submissionId: string }> {
    const restaurantId = randomUUID();
    const readableUrlHandle = toRestaurantUrlHandle(input.restaurantName);
    const existingRestaurants = await this.prisma.restaurant.findMany({
      select: {
        urlHandle: true
      },
      where: readableUrlHandle
        ? {
            OR: [
              {
                urlHandle: readableUrlHandle
              },
              {
                urlHandle: {
                  startsWith: `${readableUrlHandle}-`
                }
              }
            ]
          }
        : {
            urlHandle: {
              startsWith: "restaurant-"
            }
          }
    });
    const restaurant = await this.prisma.restaurant.create({
      data: {
        createdByKind: "USER",
        displayName: input.restaurantName,
        id: restaurantId,
        locations: {
          create: {
            address: input.firstLocation.address,
            createdByKind: "USER",
            displayName: input.firstLocation.name,
            googleMapsUrl: input.firstLocation.googleMapsUrl,
            kind: input.firstLocation.kind,
            serviceArea:
              input.firstLocation.kind === "FOOD_TRUCK" ? input.firstLocation.address : undefined,
            submittedByTasteAppUserId: submitter.id,
            verificationState: "unverified",
            websiteUrl: input.firstLocation.websiteUrl
          }
        },
        submissionFingerprint,
        submissionFingerprintBucket,
        submittedByTasteAppUserId: submitter.id,
        urlHandle: nextRestaurantUrlHandle(
          input.restaurantName,
          existingRestaurants.map((existingRestaurant) => existingRestaurant.urlHandle),
          restaurantId
        ),
        verificationState: "unverified"
      },
      select: {
        id: true
      }
    });

    return {
      submissionId: restaurant.id
    };
  }

  private async findSubmissionByFingerprint(
    submitter: Submitter,
    submissionFingerprint: string,
    submissionFingerprintBucket: string
  ): Promise<{ submissionId: string } | null> {
    const restaurant = await this.prisma.restaurant.findUnique({
      select: {
        id: true
      },
      where: {
        submittedByTasteAppUserId_submissionFingerprint_submissionFingerprintBucket: {
          submissionFingerprint,
          submissionFingerprintBucket,
          submittedByTasteAppUserId: submitter.id
        }
      }
    });

    return restaurant ? { submissionId: restaurant.id } : null;
  }

  async listPublicRestaurants(): Promise<PublicCatalogRestaurant[]> {
    const restaurants = await this.prisma.restaurant.findMany({
      orderBy: {
        displayName: "asc"
      },
      select: {
        displayName: true,
        id: true,
        urlHandle: true
      },
      where: {
        verificationState: "verified"
      }
    });

    return restaurants.map((restaurant) => ({
      id: restaurant.id,
      name: restaurant.displayName,
      urlHandle: restaurant.urlHandle
    }));
  }
}

function isUniqueUrlHandleError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes("urlHandle")
  );
}

function isUniqueSubmissionFingerprintError(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes("submittedByTasteAppUserId") &&
    error.meta.target.includes("submissionFingerprint") &&
    error.meta.target.includes("submissionFingerprintBucket")
  );
}

const prisma = new PrismaClient();

export const prismaCatalogSubmissionRepository = new PrismaCatalogSubmissionRepository(prisma);
