# TST-8 Geocode Locations and Show List-First Distance Labels Implementation Guide

Linear issue: https://linear.app/khoile11/issue/TST-8/geocode-locations-and-show-list-first-distance-labels

## Goal

Store coordinates for Locations, cache geocoding results, and let list-first discovery surfaces show approximate distance labels from a user-provided Search Location.

Keep this slice list-first. Do not build map browsing, route planning, travel-time estimates, Convenience Mode reordering, food-truck schedules, or broad location history.

## Existing Decisions To Respect

- TasteApp ranks RestaurantDishes, not Restaurants.
- Locations are physical places where Restaurants serve food.
- MVP location UX is list-first with distance labels rather than map-first.
- Distance must not silently reorder food-quality rankings. Food-quality rank remains visible even when distance labels or filters are shown.
- A Search Location may come from device location permission or typed search input.
- Typed search is the fallback when device location permission is declined or unavailable.
- Unverified Restaurants and Locations remain excluded from normal public catalog, search, list, detail, and ranking truth by default.

No new ADR is needed for provider-neutral ports, durable geocode caching, or straight-line miles unless implementation intentionally changes these decisions.

## Domain Scope

TST-8 should introduce the minimum location-discovery model needed for MVP:

- `Location` coordinates for verified/trusted public Locations.
- `GeocodingResult` or equivalent cache record keyed by provider and normalized query.
- `SearchLocation` input for distance calculations.
- Distance labels on list-first view models.
- A public list endpoint that can return verified Restaurant results with optional distance labels.

A Search Location is not the same thing as a stored Restaurant Location. It is a user-provided reference point for discovery, and it may be precise device coordinates or coordinates resolved from typed search.

## Data Model Guidance

Extend `Location` with nullable latitude and longitude fields. Keep them nullable because Food Trucks, incomplete submissions, and ungeocodable records may not have stable coordinates.

Add a durable geocoding cache keyed by:

- provider identifier,
- normalized geocoding query,
- optional provider place ID or result identity when available.

The cache should store:

- latitude,
- longitude,
- normalized display label or formatted address if provided,
- provider result metadata needed for debugging or refresh,
- timestamps.

Cache entries should be reused for repeated identical lookups. They should not expire on a short TTL; refresh when the source address, Google Maps URL, provider identity, or trusted Location facts change.

## Geocoding Boundary

Use a provider-neutral application service or port so API transport and domain/application code do not depend directly on one geocoding vendor.

Provider lookup failures should not block Restaurant and Location submission. For public discovery, Locations without coordinates can still appear in food-quality lists, but they should not show distance labels or participate in distance filtering until geocoded.

## Device Location And Typed Fallback

For MVP, clients may ask for device location permission when a Search Location is needed. If permission is declined, unavailable, or unsupported, show typed Search Location input.

Do not persist device coordinates as user profile location history in TST-8. Treat device coordinates as request-time discovery input unless a later issue explicitly designs saved places or location history.

Typed Search Locations may be city, neighborhood, ZIP code, or full street address inputs. They should be geocoded through the same cache boundary as stored Location addresses, with a separate query namespace if needed to avoid confusing user search inputs with Restaurant Location facts.

If a typed Search Location is broad, such as `Chicago`, calculate distance from the provider-resolved centroid or representative point and make the UI label approximate. Do not force users into full street address precision before showing useful distance labels.

## Distance Labels

Use straight-line distance in miles for MVP. Display it as approximate user-facing copy such as `0.8 mi` or `~3 mi` depending on UI convention.

Do not calculate driving distance, walking time, transit time, or route-aware convenience in TST-8.

Distance labels belong on discovery/list view models. They are not Core Ranking Truth and should not become part of RestaurantDish food-quality scoring.

## Ranking And Filtering Rules

TST-8 should add distance labels first. Add radius filtering only if it is cheap once distance labels exist. It should not reorder the default Dish Ranking by distance.

If a radius filter is applied, preserve visible food-quality rank context so users can tell when the highest-ranked RestaurantDish is outside the chosen radius.

Convenience Mode reordering should remain future work unless a later issue explicitly scopes it.

## Food Truck And Canteen Notes

Food Trucks without a stable current stop or trusted service point should not show precise distance labels. A broad service area is not enough to imply exact proximity.

Canteen Locations may use the shared venue address or maps link for geocoding in MVP, while preserving the Restaurant's own Location display label.

## API and Application Boundary

The API transport should:

- validate Search Location and geocoding inputs with Zod,
- call an application service for geocoding and distance-label view models,
- keep provider-specific errors out of public DTOs,
- avoid putting distance math or provider calls directly in route handlers.

The first public API surface is `GET /v1/catalog/restaurants`. It may accept `searchLatitude` and `searchLongitude` for device-coordinate Search Locations, or `searchQuery` for typed Search Location fallback when a geocoding provider is configured behind the application seam.

The application service should:

- resolve or reuse geocoding cache entries,
- attach coordinates to trusted Locations when appropriate,
- calculate straight-line distances from a Search Location,
- return list-first DTOs with distance labels and food-quality rank context.

For MVP, geocoding can happen synchronously in trusted seeding or admin verification paths. Keep the boundary narrow enough that the same work can move behind a background job later without changing API contracts or discovery view models.

## Tests

Add focused tests for:

- Locations can persist nullable latitude and longitude.
- Repeated geocoding of the same normalized query reuses the cache and does not call the provider again.
- Provider failures do not block catalog submission.
- A Search Location from device coordinates can produce distance labels.
- Device coordinates are treated as request-time input rather than persisted user location history.
- A typed Search Location can be geocoded and used after permission is declined.
- Broad typed Search Locations, such as city or ZIP inputs, produce approximate labels.
- Distance labels use straight-line distance and do not reorder food-quality rankings.
- Locations without coordinates omit distance labels.
- Food Trucks without a trusted point omit precise distance labels.

## Suggested Vertical Slices

### 1. Store trusted Location coordinates and cache geocoding

Add nullable coordinates to Locations, introduce a durable geocoding cache, and prove a trusted Location can be geocoded once and reused on repeat lookup.

Blocked by: TST-7.

### 2. Return list-first distance labels from a Search Location

Add request-time Search Location input and return list-first discovery DTOs with approximate straight-line distance labels while preserving food-quality rank order.

Blocked by: slice 1.

### 3. Add typed Search Location fallback

Let clients submit typed city, neighborhood, ZIP, or street-address Search Locations, geocode them through the cache boundary, and show approximate labels for broad inputs.

Blocked by: slice 2.

### 4. Ask for device location permission without storing history

Add the mobile permission path for device coordinates, use them as request-time Search Location input, and fall back to typed search when permission is declined or unavailable.

Blocked by: slice 2.

### 5. Add radius filtering without distance reordering

Add optional radius filtering only after labels exist, preserving visible food-quality rank context and keeping Convenience Mode reordering out of scope.

Blocked by: slices 2 and 3.

## Suggested PR Checklist

- Location coordinates are nullable and scoped to Location facts.
- Geocoding provider access is behind a narrow port.
- Cache identity is provider plus normalized query, not only Location ID.
- Device location has typed fallback and does not create location history.
- Distance labels are list-first view-model data, not ranking truth.
- Default Dish Ranking order remains food-quality first.
- Tests prove cached geocoding behavior.
