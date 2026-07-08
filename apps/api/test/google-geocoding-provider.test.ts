import { describe, expect, it } from "vitest";

import { createGoogleGeocodingProvider } from "../src/google-geocoding-provider.js";

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
});
