import type { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientConstructor } from "@prisma/client";

import type { GeocodedPoint, GeocodingCacheRepository } from "./location-discovery.js";

export class PrismaGeocodingCacheRepository implements GeocodingCacheRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async find(providerId: string, normalizedQuery: string): Promise<GeocodedPoint | null> {
    const cacheEntry = await this.prisma.geocodingCacheEntry.findUnique({
      select: {
        displayLabel: true,
        latitude: true,
        longitude: true,
        providerPlaceId: true
      },
      where: {
        providerId_normalizedQuery: {
          normalizedQuery,
          providerId
        }
      }
    });

    return cacheEntry
      ? {
          displayLabel: cacheEntry.displayLabel,
          latitude: cacheEntry.latitude,
          longitude: cacheEntry.longitude,
          providerPlaceId: cacheEntry.providerPlaceId ?? undefined
        }
      : null;
  }

  async save(providerId: string, normalizedQuery: string, result: GeocodedPoint): Promise<void> {
    await this.prisma.geocodingCacheEntry.upsert({
      create: {
        displayLabel: result.displayLabel,
        latitude: result.latitude,
        longitude: result.longitude,
        normalizedQuery,
        providerId,
        providerPlaceId: result.providerPlaceId
      },
      update: {
        displayLabel: result.displayLabel,
        latitude: result.latitude,
        longitude: result.longitude,
        providerPlaceId: result.providerPlaceId
      },
      where: {
        providerId_normalizedQuery: {
          normalizedQuery,
          providerId
        }
      }
    });
  }
}

const prisma = new PrismaClientConstructor();

export const prismaGeocodingCacheRepository = new PrismaGeocodingCacheRepository(prisma);
