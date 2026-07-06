import { PrismaClient } from "@prisma/client";

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
    submitter: Submitter
  ): Promise<{ submissionId: string }> {
    const baseUrlHandle = toRestaurantUrlHandle(input.restaurantName);
    const existingRestaurants = await this.prisma.restaurant.findMany({
      select: {
        urlHandle: true
      },
      where: {
        OR: [
          {
            urlHandle: baseUrlHandle
          },
          {
            urlHandle: {
              startsWith: `${baseUrlHandle}-`
            }
          }
        ]
      }
    });
    const restaurant = await this.prisma.restaurant.create({
      data: {
        createdByKind: "USER",
        displayName: input.restaurantName,
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
        submittedByTasteAppUserId: submitter.id,
        urlHandle: nextRestaurantUrlHandle(
          input.restaurantName,
          existingRestaurants.map((existingRestaurant) => existingRestaurant.urlHandle)
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

const prisma = new PrismaClient();

export const prismaCatalogSubmissionRepository = new PrismaCatalogSubmissionRepository(prisma);
