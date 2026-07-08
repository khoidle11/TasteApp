import { describe, expect, it } from "vitest";

import {
  createGoogleGeocodingProvider,
  GoogleGeocodingProviderError
} from "../src/google-geocoding-provider.js";

describe("GoogleGeocodingProvider", () => {
  it("geocodes typed Search Locations through Google Geocoding response fields", async () => {
    const requestedUrls: string[] = [];
    const provider = createGoogleGeocodingProvider("test-api-key", (url) => {
      requestedUrls.push(url);

      return Promise.resolve({
        json: () =>
          Promise.resolve({
            results: [
              {
                formatted_address: "Houston, TX, USA",
                geometry: {
                  location: {
                    lat: 29.7604,
                    lng: -95.3698
                  }
                },
                place_id: "houston-tx"
              }
            ],
            status: "OK"
          }),
        ok: true
      });
    });

    await expect(provider.geocode("Houston Heights")).resolves.toEqual({
      displayLabel: "Houston, TX, USA",
      latitude: 29.7604,
      longitude: -95.3698,
      providerPlaceId: "houston-tx"
    });
    expect(requestedUrls).toHaveLength(1);
    expect(requestedUrls[0]).toContain("address=Houston+Heights");
    expect(requestedUrls[0]).toContain("key=test-api-key");
  });

  it("surfaces HTTP failure status for internal logging", async () => {
    const provider = createGoogleGeocodingProvider("test-api-key", () =>
      Promise.resolve({
        json: () => Promise.resolve({}),
        ok: false,
        status: 403
      })
    );

    await expect(provider.geocode("Houston Heights")).rejects.toThrow(GoogleGeocodingProviderError);
    await expect(provider.geocode("Houston Heights")).rejects.toThrow(
      "Google geocoding failed with HTTP 403."
    );
  });
});
