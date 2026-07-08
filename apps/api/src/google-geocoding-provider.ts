import type { GeocodedPoint, GeocodingProvider } from "./location-discovery.js";

type FetchLike = (url: string) => Promise<{
  json(): Promise<unknown>;
  ok: boolean;
  status?: number;
}>;

type GoogleGeocodingResponse = {
  results?: {
    formatted_address?: unknown;
    geometry?: {
      location?: {
        lat?: unknown;
        lng?: unknown;
      };
    };
    place_id?: unknown;
  }[];
  status?: unknown;
};

export class GoogleGeocodingProviderError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GoogleGeocodingProviderError";
  }
}

export function createGoogleGeocodingProvider(
  apiKey: string,
  fetchGeocoding: FetchLike = fetchWithTimeout
): GeocodingProvider {
  return {
    id: "google-geocoding",
    async geocode(query: string): Promise<GeocodedPoint | null> {
      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.searchParams.set("address", query);
      url.searchParams.set("key", apiKey);

      const response = await fetchGeocoding(url.toString());

      if (!response.ok) {
        throw new GoogleGeocodingProviderError(
          `Google geocoding failed with HTTP ${String(response.status ?? "unknown")}.`
        );
      }

      return googleGeocodingPointFromResponse(await response.json());
    }
  };
}

export function createGoogleGeocodingProviderFromEnvironment(
  apiKey = process.env.GOOGLE_MAPS_GEOCODING_API_KEY
): GeocodingProvider | null {
  return apiKey ? createGoogleGeocodingProvider(apiKey) : null;
}

function googleGeocodingPointFromResponse(responseBody: unknown): GeocodedPoint | null {
  const response = responseBody as GoogleGeocodingResponse;
  const firstResult = response.results?.[0];
  const latitude = firstResult?.geometry?.location?.lat;
  const longitude = firstResult?.geometry?.location?.lng;

  if (
    typeof firstResult?.formatted_address !== "string" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    if (response.status && response.status !== "ZERO_RESULTS") {
      throw new GoogleGeocodingProviderError(
        `Google geocoding returned status ${googleStatusLabel(response.status)}.`
      );
    }

    return null;
  }

  return {
    displayLabel: firstResult.formatted_address,
    latitude,
    longitude,
    providerPlaceId: typeof firstResult.place_id === "string" ? firstResult.place_id : undefined
  };
}

function googleStatusLabel(status: unknown): string {
  return typeof status === "string" || typeof status === "number" ? String(status) : "unknown";
}

async function fetchWithTimeout(url: string): Promise<{
  json(): Promise<unknown>;
  ok: boolean;
  status?: number;
}> {
  const abortController = new AbortController();
  const timeout = setTimeout(() => {
    abortController.abort();
  }, googleGeocodingTimeoutMs);

  try {
    return await fetch(url, {
      signal: abortController.signal
    });
  } finally {
    clearTimeout(timeout);
  }
}

const googleGeocodingTimeoutMs = 2500;
