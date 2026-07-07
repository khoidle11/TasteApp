# TST-7 User-Submitted Restaurants and Locations Implementation Guide

Linear issue: https://linear.app/khoile11/issue/TST-7/create-user-submitted-restaurants-and-locations

## Goal

Let signed-in users submit a Restaurant and its first Location as unverified catalog data, with persistence, explicit DTOs, Zod validation, a thin typed API boundary, focused tests, and a minimal confirmation UI.

Keep this slice catalog-focused. Do not build public Restaurant pages, a full contribution history, moderation screens, signed-out review behavior, food truck schedules, or AI/fuzzy verification in TST-7.

## Existing Decisions To Respect

- A Restaurant is a food business that serves Menu Items at one or more Locations.
- A new Restaurant must be created with its first Location in one application use case so the system does not create Restaurants with zero Locations.
- Additional Locations can be added to existing Restaurants later.
- User-created Restaurants and Locations start with `unverified` Verification State.
- Unverified Restaurants and Locations must be excluded from normal public catalog, search, list, detail, and ranking truth by default. See `docs/adr/0021-hide-unverified-catalog-submissions-from-public-catalog.md`.
- Trusted admin-created or prelaunch seeded catalog records may start verified through explicit trusted paths, but ordinary Catalog Contributions do not.
- Restaurant submitter provenance is for admin, moderation, audit, and abuse review only. It is not public credit, a ranking signal, or contributor gamification in TST-7.
- Use a `locationKind` enum for MVP rather than separate Food Truck or Canteen models.
- Use **URL handle** rather than `slug` in delivery/product language for stable readable URL identifiers.

No new ADR is needed for this issue unless implementation changes one of those decisions.

## Domain Scope

TST-7 should introduce the minimum catalog model needed for Restaurants and Locations:

- `Restaurant`
- `Location`
- `VerificationState`
- `LocationKind`
- provenance fields or audit events for submission/review history

Recommended `LocationKind` values for MVP:

- `STANDALONE`
- `FOOD_TRUCK`
- `CANTEEN`

Food Trucks are Restaurants with flexible/mobile Locations. TST-7 may designate Food Trucks and allow them to become rankable once verified, but should not solve schedules, routes, live availability, or recurring stops.

Canteen Locations are restaurants inside shared venues such as malls, markets, or food halls. User-facing display should read like `Taco Palace at North Mall`, while implementation may preserve shared venue context as plain text for now. Do not model Shared Venue as its own entity in TST-7.

## Data Model Guidance

Keep the first model explicit and boring:

- `Restaurant`
  - stable ID
  - display name
  - URL handle
  - verification state
  - provenance / created-by kind
  - timestamps
- `Location`
  - stable ID
  - restaurant ID
  - location kind
  - display label or place name
  - address fields where applicable
  - Google Maps URL when supplied
  - website URL when supplied
  - optional service area for Food Trucks
  - verification state
  - provenance / created-by kind
  - timestamps

For MVP, put `VerificationState` directly on Restaurant and Location for query simplicity. Add audit/provenance fields or events so future verification workflows can inspect who submitted or changed a record.

Use nullable `submittedByTasteAppUserId` only where trusted admin, seed, or system-created records need no submitting user. Pair it with an explicit created-by/source marker such as `USER`, `ADMIN`, `SEED`, or `SYSTEM` so agents do not infer trust from nullability.

## URL Handles

Generate stable URL handles for Restaurants now, even though unverified records are not public. URL handles are future public-path identifiers, not proof that the record can be publicly routed today.

Do not expose public Restaurant detail routes for unverified records in TST-7. Public catalog services should default to verified records only.

## API and Application Boundary

Implement one application use case for creating a Restaurant and first Location together, for example `submitRestaurantWithFirstLocation`.

The API transport should:

- validate input with Zod,
- require a current TasteApp User,
- call the application use case,
- return a confirmation DTO,
- avoid owning catalog rules inside the route/procedure handler.

The use case should:

- validate that a first Location exists,
- set both Restaurant and Location to `unverified`,
- record submitter/admin provenance,
- run only a basic exact-ish duplicate check,
- return a confirmation result rather than a public catalog object.

Keep fuzzy duplicate detection, AI Verification Assist, rich Submission Nudges, moderation queues, and signed-out Missing Place Suggestions out of TST-7. Those are tracked separately.

## Input Rules

Signed-in Restaurant + first Location creation:

- Restaurant name is required.
- First Location is required.
- Website is optional.
- Google Maps link is encouraged but not required when a usable address is present.
- If address and Google Maps link conflict, accept the submission but mark it for review; do not auto-resolve until a later scaled verification workflow.

Location-kind specific notes:

- Standalone Locations should include a usable address.
- Canteen Locations should include the restaurant name and shared venue context. A shared venue maps link is acceptable for MVP.
- Food Trucks should include name plus website, social, or maps link, with optional service area. Do not require a stable street address.

## Response DTO

After submission, return a confirmation DTO rather than a full public Restaurant/Location DTO.

The confirmation DTO should include enough for the success UI:

- submission ID or tracking ID
- submitted restaurant name
- submitted location label/address
- verification state: `unverified`
- confirmation copy explaining that TasteApp will review the submission before it appears publicly

Do not return a DTO that encourages the frontend to route to a public Restaurant page before verification.

## UI Scope

Build the smallest UI needed to prove the flow:

- signed-in form for Restaurant + first Location
- validation errors
- submitted confirmation page/card

Do not build a full `My Suggestions`, contribution history, public Restaurant page, moderation queue, or signed-out suggestion intake in TST-7.

If both web and mobile are too much for this slice, build one real UI path first and expose shared DTOs/contracts for the other client. Mobile is the preferred first real path because food contribution is often in-the-moment.

## Tests

Add focused tests for:

- anonymous users cannot create Restaurant or Location catalog records,
- signed-in users can submit a Restaurant with first Location,
- submission without first Location is rejected,
- new Restaurant and Location start unverified,
- public catalog queries exclude unverified records by default,
- confirmation DTO is returned instead of public catalog DTO,
- basic exact-ish duplicate detection runs without blocking legitimate review flow,
- Food Truck and Canteen location kinds persist correctly.

## Migration Guidance

TST-7 should include generated Prisma migration files for the Restaurant and Location persistence changes. Generate migrations with the Prisma CLI from the reviewed Prisma schema; do not hand-write migration SQL as an AI-authored artifact.

Before opening a PR, verify the generated migration matches the intended schema change and does not include unrelated drift.

## Related Follow-Up Work

- TST-82: catalog submission verification workflow.
- TST-83: feature-flagged prelaunch catalog seeding.
- TST-84: rank Locations within a Chain Candidate after MVP.
- TST-85: detect suspicious Restaurant and Location identity changes.
- TST-86: feature flags for signed-in and signed-out product surfaces.
- TST-87: signed-out Missing Place Suggestion intake.
- TST-88: signed-out review and check-in growth-loop spike.

## Suggested PR Checklist

- Restaurant + first Location creation happens through one application use case.
- API transport remains thin and replaceable.
- DTOs and Zod schemas are explicit.
- Verification State defaults protect public catalog and ranking truth.
- Submitter provenance is admin/audit-only for Restaurants.
- Location kind covers standalone, Food Truck, and Canteen cases without over-modeling.
- URL handles are generated but unverified public routes are not exposed.
- Confirmation UI does not imply the Restaurant is public.
- Tests cover anonymous, signed-in, verification, and public-query behavior.
