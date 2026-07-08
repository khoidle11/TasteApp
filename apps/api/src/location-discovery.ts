import type { SearchLocationInput } from "@tasteapp/contracts";

import type { CatalogSubmissionRepository, PublicCatalogRestaurant } from "./catalog-submission.js";

export type GeocodedPoint = {
  displayLabel: string;
  latitude: number;
  longitude: number;
  providerPlaceId?: string;
};

export type SearchLocationPoint = {
  latitude: number;
  longitude: number;
};

export type DistanceLabel = {
  label: string;
  miles: number;
};

export type DistanceLabelCandidate = {
  foodQualityRank: number;
  location: {
    latitude?: number | null;
    longitude?: number | null;
  };
  restaurantDishId: string;
};

export type DistanceLabeledResult<T extends DistanceLabelCandidate> = T & {
  distance?: DistanceLabel;
};

export type GeocodingProvider = {
  id: string;
  geocode(query: string): Promise<GeocodedPoint | null>;
};

export type GeocodingCacheRepository = {
  find(providerId: string, normalizedQuery: string): Promise<GeocodedPoint | null>;
  save(providerId: string, normalizedQuery: string, result: GeocodedPoint): Promise<void>;
};

export type LocationDiscoveryLogger = Pick<Console, "error">;

export type ListPublicRestaurantsForDiscoveryOptions = {
  geocodingCacheRepository?: GeocodingCacheRepository;
  geocodingProvider?: GeocodingProvider | null;
  logger?: LocationDiscoveryLogger;
  repository: CatalogSubmissionRepository;
  searchLocationInput?: SearchLocationInput | null;
};

export class InMemoryGeocodingCacheRepository implements GeocodingCacheRepository {
  private readonly results = new Map<string, GeocodedPoint>();

  find(providerId: string, normalizedQuery: string): Promise<GeocodedPoint | null> {
    return Promise.resolve(
      this.results.get(geocodingCacheKey(providerId, normalizedQuery)) ?? null
    );
  }

  save(providerId: string, normalizedQuery: string, result: GeocodedPoint): Promise<void> {
    this.results.set(geocodingCacheKey(providerId, normalizedQuery), result);

    return Promise.resolve();
  }
}

export async function geocodeSearchLocation(
  query: string,
  provider: GeocodingProvider,
  cache: GeocodingCacheRepository
): Promise<GeocodedPoint | null> {
  const normalizedQuery = normalizeGeocodingQuery(query);
  const cachedResult = await cache.find(provider.id, normalizedQuery);

  if (cachedResult) {
    return cachedResult;
  }

  const providerResult = await provider.geocode(normalizedQuery);

  if (providerResult) {
    await cache.save(provider.id, normalizedQuery, providerResult);
  }

  return providerResult;
}

export function normalizeGeocodingQuery(query: string): string {
  return query.trim().toLowerCase().replace(/\s+/g, " ");
}

export async function listPublicRestaurantsForDiscovery({
  geocodingCacheRepository,
  geocodingProvider,
  logger = console,
  repository,
  searchLocationInput
}: ListPublicRestaurantsForDiscoveryOptions): Promise<PublicCatalogRestaurant[]> {
  const restaurants = await repository.listPublicRestaurants();
  const searchLocation = await resolveSearchLocation(searchLocationInput, {
    geocodingCacheRepository,
    geocodingProvider,
    logger
  });

  if (!searchLocation) {
    return restaurants;
  }

  return withDistanceLabels(
    searchLocation,
    restaurants.map((restaurant, index) => ({
      ...restaurant,
      foodQualityRank: index + 1,
      restaurantDishId: restaurant.id
    }))
  ).map(({ distance, id, location, name, urlHandle }) => ({
    ...(distance ? { distance } : {}),
    id,
    location,
    name,
    urlHandle
  }));
}

export function withDistanceLabels<T extends DistanceLabelCandidate>(
  searchLocation: SearchLocationPoint,
  results: T[]
): DistanceLabeledResult<T>[] {
  return results.map((result) => {
    const { latitude, longitude } = result.location;

    if (latitude == null || longitude == null) {
      return result;
    }

    const miles = distanceInMiles(searchLocation, {
      latitude,
      longitude
    });

    return {
      ...result,
      distance: {
        label: approximateMilesLabel(miles),
        miles
      }
    };
  });
}

function geocodingCacheKey(providerId: string, normalizedQuery: string): string {
  return `${providerId}:${normalizedQuery}`;
}

async function resolveSearchLocation(
  searchLocationInput: SearchLocationInput | null | undefined,
  {
    geocodingCacheRepository,
    geocodingProvider,
    logger
  }: {
    geocodingCacheRepository?: GeocodingCacheRepository;
    geocodingProvider?: GeocodingProvider | null;
    logger: LocationDiscoveryLogger;
  }
): Promise<SearchLocationPoint | null> {
  if (!searchLocationInput) {
    return null;
  }

  if (searchLocationInput.source === "device") {
    return {
      latitude: searchLocationInput.latitude,
      longitude: searchLocationInput.longitude
    };
  }

  if (!geocodingProvider || !geocodingCacheRepository) {
    return null;
  }

  try {
    return await geocodeSearchLocation(
      searchLocationInput.query,
      geocodingProvider,
      geocodingCacheRepository
    );
  } catch (error) {
    logger.error("Typed Search Location geocoding failed", { error });

    return null;
  }
}

function distanceInMiles(from: SearchLocationPoint, to: SearchLocationPoint): number {
  const earthRadiusMiles = 3958.8;
  const latitudeDelta = degreesToRadians(to.latitude - from.latitude);
  const longitudeDelta = degreesToRadians(to.longitude - from.longitude);
  const fromLatitude = degreesToRadians(from.latitude);
  const toLatitude = degreesToRadians(to.latitude);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(fromLatitude) * Math.cos(toLatitude) * Math.sin(longitudeDelta / 2) ** 2;
  const miles = 2 * earthRadiusMiles * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));

  return Math.round(miles * 100) / 100;
}

function approximateMilesLabel(miles: number): string {
  return `~${String(Math.max(1, Math.round(miles)))} mi`;
}

function degreesToRadians(value: number): number {
  return (value * Math.PI) / 180;
}
