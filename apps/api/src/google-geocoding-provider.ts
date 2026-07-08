import type { GeocodedPoint, GeocodingProvider } from "./location-discovery.js";

type FetchLike = (url: string) => Promise<{
  json(): Promise<unknown>;
  ok: boolean;
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

export function createGoogleGeocodingProvider(
  apiKey: string,
  fetchGeocoding: FetchLike = fetch
): GeocodingProvider {
  return {
    id: "google-geocoding",
    async geocode(query: string): Promise<GeocodedPoint | null> {
      const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
      url.searchParams.set("address", query);
      url.searchParams.set("key", apiKey);

      const response = await fetchGeocoding(url.toString());

      if (!response.ok) {
        return null;
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
    response.status !== "OK" ||
    typeof firstResult?.formatted_address !== "string" ||
    typeof latitude !== "number" ||
    typeof longitude !== "number"
  ) {
    return null;
  }

  return {
    displayLabel: firstResult.formatted_address,
    latitude,
    longitude,
    providerPlaceId: typeof firstResult.place_id === "string" ? firstResult.place_id : undefined
  };
}
