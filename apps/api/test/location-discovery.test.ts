import { describe, expect, it } from "vitest";

import {
  geocodeSearchLocation,
  InMemoryGeocodingCacheRepository,
  withDistanceLabels,
  type GeocodingProvider
} from "../src/location-discovery.js";

describe("Search Location geocoding", () => {
  it("reuses a cached geocoding result for the same typed Search Location", async () => {
    const cache = new InMemoryGeocodingCacheRepository();
    const providerCalls: string[] = [];
    const provider: GeocodingProvider = {
      id: "fake-maps",
      geocode: (query) => {
        providerCalls.push(query);

        return Promise.resolve({
          displayLabel: "Chicago, IL",
          latitude: 41.8781,
          longitude: -87.6298,
          providerPlaceId: "chicago-il"
        });
      }
    };

    const firstResult = await geocodeSearchLocation(" Chicago ", provider, cache);
    const secondResult = await geocodeSearchLocation("chicago", provider, cache);

    expect(firstResult).toEqual(secondResult);
    expect(firstResult).toMatchObject({
      displayLabel: "Chicago, IL",
      latitude: 41.8781,
      longitude: -87.6298
    });
    expect(providerCalls).toEqual(["chicago"]);
  });

  it("adds approximate distance labels without reordering food-quality results", () => {
    const results = withDistanceLabels(
      {
        latitude: 29.7604,
        longitude: -95.3698
      },
      [
        {
          foodQualityRank: 1,
          location: {
            latitude: 29.742,
            longitude: -95.391
          },
          restaurantDishId: "restaurant-dish-1"
        },
        {
          foodQualityRank: 2,
          location: {
            latitude: 29.7599,
            longitude: -95.3584
          },
          restaurantDishId: "restaurant-dish-2"
        }
      ]
    );

    expect(results.map((result) => result.restaurantDishId)).toEqual([
      "restaurant-dish-1",
      "restaurant-dish-2"
    ]);
    expect(results).toMatchObject([
      {
        distance: {
          label: "~2 mi",
          miles: 1.8
        },
        foodQualityRank: 1
      },
      {
        distance: {
          label: "~1 mi",
          miles: 0.68
        },
        foodQualityRank: 2
      }
    ]);
  });

  it("keeps ungeocoded Locations in the list without distance labels", () => {
    const results = withDistanceLabels(
      {
        latitude: 29.7604,
        longitude: -95.3698
      },
      [
        {
          foodQualityRank: 1,
          location: {},
          restaurantDishId: "restaurant-dish-1"
        }
      ]
    );

    expect(results).toEqual([
      {
        foodQualityRank: 1,
        location: {},
        restaurantDishId: "restaurant-dish-1"
      }
    ]);
  });
});
