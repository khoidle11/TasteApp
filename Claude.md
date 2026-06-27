---
id: tasteapp-agent-context
purpose: Provide comprehensive project context for AI agents working on the TasteApp repository.
---

# TasteApp Agent Context

## Project Overview

TasteApp is a dish-first food review app that helps people find the best place for a specific dish, rather than ranking restaurants as monoliths. The product centers on canonical dishes, restaurant-specific menu items, dish reviews, and dish-quality rankings.

**Key Product Philosophy:**

- Food quality is the default truth
- Restaurants are not ranked as monoliths; specific dishes at specific locations earn their own reputation
- Service, ambiance, convenience, and popularity can matter, but should be explicit user-controlled factors
- Core ranking truth should stay free
- Community contribution should feel rewarding, not bureaucratic
- Trust and moderation should protect useful criticism without letting restaurants control rankings

## Branch Naming Convention

When creating branches for Linear issues, use the format:

```
feat-XXXX
```

Where `XXXX` is the Linear issue identifier (e.g., `feat-TST-34`).

Note: Git does not allow parentheses in branch names, so use the format `feat-XXXX` rather than `(feat): XXXX`.

## Commit Message Convention

When committing changes for Linear issues, use the format:

```
XXXX: <issue title>
```

Where `XXXX` is the Linear issue identifier and `<issue title>` is the full issue title (e.g., `TST-34: Create Claude.md/Agent.md`).

## Pull Request Description Convention

Every pull request for Linear work should link back to the Linear issue in the PR description. Use the full Linear URL, not only the issue key, so Linear and future readers can reliably connect the PR to the source ticket.

For this branch:

```md
Linear: https://linear.app/khoile11/issue/TST-34/create-claudemdagentmd
```

PR descriptions should include:

- **Linear**: full issue URL.
- **Summary**: 3-5 high-impact bullet points outlining exactly what changed and why.
- **What I changed**: brief technical breakdown of the implementation or documentation changes.
- **Test Plan**: step-by-step checklist or commands the reviewer can use to verify the change, such as test scripts, local run instructions, or deployment checks.
- **Edge Cases Considered**: edge cases, regressions, or follow-up risks addressed by the change. For docs-only work, state the relevant scope limits instead of inventing runtime edge cases.
- **SWE checklist**: 4-5 checkboxes covering good engineering practice for the change.

Suggested PR description template:

```md
Linear: <full Linear issue URL>

## Summary

- <High-impact change and why it matters>
- <High-impact change and why it matters>
- <High-impact change and why it matters>

## What I changed

<Brief technical breakdown of the files, modules, flows, or docs changed.>

## Test Plan

- [ ] <Command or reviewer verification step>
- [ ] <Manual or product verification step>

## Edge Cases Considered

- <Edge case, regression, or scope limit considered>
- <Edge case, regression, or scope limit considered>

## SWE checklist

- [ ] Scope stays aligned with the linked Linear issue.
- [ ] Product/domain language matches `CONTEXT.md`.
- [ ] Durable architecture decisions are documented or do not require an ADR.
- [ ] Relevant tests or checks were run, or the PR explains why they were not applicable.
- [ ] User-facing behavior, docs, and follow-up risks are called out clearly.
```

Short checklist only:

```md
## SWE checklist

- [ ] Scope stays aligned with the linked Linear issue.
- [ ] Product/domain language matches `CONTEXT.md`.
- [ ] Durable architecture decisions are documented or do not require an ADR.
- [ ] Relevant tests or checks were run, or the PR explains why they were not applicable.
- [ ] User-facing behavior, docs, and follow-up risks are called out clearly.
```

## Domain Language

**Canonical Dish**: A reusable food concept that can be served by many restaurants (e.g., tonkotsu ramen, birria tacos, tiramisu). Avoid: Dish, generic dish, dish category

**Menu Item**: A restaurant-specific version of a Canonical Dish (e.g., a named ramen bowl on one restaurant's menu). Avoid: Dish, offering

**RestaurantDish**: The relationship between a Restaurant and a Menu Item that represents one restaurant's specific version of a Canonical Dish. This is the core unit that reviews and rankings compare. Avoid: Restaurant, dish, restaurant rating

**Restaurant**: A food business that serves Menu Items at one or more Locations. Avoid: Venue, place

**Claimed Restaurant**: A Restaurant profile managed by an authorized business owner or representative. Claimed Restaurants may correct factual business, menu, or Location information but must not control Dish Rankings or suppress Dish Reviews. Avoid: Business account, owner account

**Location**: A physical place where a Restaurant serves food. Avoid: Address, branch

**Geocoded Location**: A Location with latitude and longitude coordinates resolved from its address or user input. Geocoded Locations support distance filters and Convenience Mode. Avoid: Map pin, coordinates

**Chain Candidate**: A Restaurant with multiple Locations within a 50-mile radius. Chain Candidates should be flagged for review or special handling because Menu Items, prices, availability, and food quality may vary by Location. Avoid: Chain, franchise

**Dish Review**: A review of a RestaurantDish, focused on food-specific qualities rather than the overall restaurant experience. Avoid: Restaurant review, general review

**Trust Signal**: Evidence that can increase confidence in a Dish Review or contributor, such as an attached photo, recent visit claim, review history, account age, location check-in, or community reports. Trust Signals are roadmap inputs, not MVP requirements for creating a Dish Review. Avoid: Proof, verification

**Review Photo**: An image attached to a Dish Review. Review Photos are a Phase 2 Trust Signal stored in object storage with metadata in the application database. Avoid: Upload, image

**Verified Account**: A user account with enough account-quality checks to reduce spam and coordinated abuse. Verified Accounts are a review-integrity tool, not proof that every Dish Review from the account is true. Avoid: Verified reviewer, trusted user

**TasteApp User**: The local product profile linked to an external authentication identity. TasteApp User owns reviews, saved items, profile gamification, moderation history, and contributor activity inside TasteApp. Avoid: Clerk user, account

**Bounded Context**: A coherent domain area with its own language, rules, and ownership boundary. TasteApp should use Bounded Contexts to keep review, discovery, moderation, identity, and monetization concerns from collapsing into one large application model. Avoid: Module, folder

**Review Integrity**: The product discipline of keeping Dish Reviews useful, food-specific, resistant to spam, and resistant to coordinated pile-ons. Review Integrity uses structured inputs, account quality, moderation, and abuse detection without letting Restaurants control criticism. Avoid: Review moderation, anti-cancel-culture

**Coordinated Review Attack**: A sudden cluster of low-quality or suspicious Dish Reviews aimed at harming or inflating a RestaurantDish, Restaurant, or Location for reasons unrelated to the food experience. Avoid: Cancel culture, review bomb

**Contributor Badge**: A profile-level recognition earned through useful or trustworthy activity, such as consistently helpful Dish Reviews, photos, reports, or verified location activity. Contributor Badges are a gamification idea for later, not an MVP ranking dependency. Avoid: Achievement, trophy

**Food Crawl**: A multi-stop food itinerary built around specific RestaurantDishes, such as a dumpling crawl or chicken sandwich crawl. Food Crawls are a later discovery feature that can combine rankings, distance, open hours, budget, and taste preferences. Avoid: Tour, itinerary

**Core Ranking Truth**: The basic Dish Ranking, Dish Reviews, and food-quality evidence that explain which RestaurantDishes are best. Core Ranking Truth should remain free so TasteApp can earn trust and grow its community. Avoid: Premium ranking, hidden ranking

**Food Quality Signal**: A rating or observation about the food itself. MVP Dish Reviews require taste, value, portion, temperature, and ingredient quality. Avoid: Rating, score

**Auxiliary Dish Quality**: A dish-specific Food Quality Signal that applies only to certain kinds of food, such as crispiness for fried food, chew for noodles, melt for ice cream, or broth richness for soup. Auxiliary Dish Qualities should be prompted only when relevant to the Canonical Dish or Menu Item. Avoid: Optional rating, extra quality

**Quality Taxonomy**: The curated set of Food Quality Signals and Auxiliary Dish Qualities that TasteApp can prompt for a Canonical Dish or Menu Item. AI and trusted contributors may suggest taxonomy additions, but additions should be approved before becoming product prompts. Avoid: Rating schema, review fields

**Repeat-Visit Signal**: A Food Quality Signal that only becomes meaningful after a user has reviewed the same Restaurant, Location, RestaurantDish, or related Menu Item more than once. Consistency is the first expected Repeat-Visit Signal, but this area needs continued product brainstorming. Avoid: Consistency rating, loyalty signal

**Experience Factor**: An optional non-food signal such as service, ambiance, brand popularity, convenience, or general restaurant sentiment. Experience Factors can be turned on or off by users and should not dominate default dish rankings. Avoid: Bias, auxiliary feature, vibe

**Dish Ranking**: An ordered comparison of RestaurantDishes for a Canonical Dish, based primarily on Food Quality Signals. Avoid: Restaurant ranking, overall ranking

**Emerging Ranking**: A Dish Ranking entry based on fewer than the current confidence threshold of Dish Reviews. The MVP threshold is five Dish Reviews, but the threshold should be treated as configurable as TasteApp grows. Avoid: Low-confidence ranking, new ranking

**Convenience Mode**: An optional user-selected mode that prioritizes closer or easier-to-reach RestaurantDishes. Convenience Mode can change the browsing order, but the interface should still show each RestaurantDish's Food Quality rank. Avoid: Distance ranking, nearby mode

**User Submission**: A Restaurant, Location, Canonical Dish, Menu Item, RestaurantDish, or Dish Review created by a user. User Submissions are accepted quickly but should not be treated as verified product truth by default. Avoid: User data, crowd data

**Verification State**: The trust state of a User Submission, such as unverified, AI-suggested, verified, rejected, or merged. Avoid: Status, moderation status

**Merge Candidate**: A possible duplicate or near-duplicate record that may represent the same real-world Restaurant, Location, Canonical Dish, Menu Item, or RestaurantDish. Avoid: Duplicate, match

**AI Verification Assist**: An AI-supported suggestion that helps identify likely duplicates, canonical naming, misspellings, suspicious submissions, or missing context. AI Verification Assist informs human or system decisions but does not make user-submitted data verified by itself. Avoid: AI verification, auto-verification

**Submission Nudge**: A lightweight user-facing suggestion shown while a user creates a User Submission, such as "Did you mean tonkotsu ramen?". Submission Nudges help prevent duplicates without exposing internal verification confidence, merge queues, or moderation decisions. Avoid: AI warning, verification prompt

## Tech Stack

**Planned MVP stack:**

- **Monorepo:** pnpm workspaces + Turborepo
- **Mobile:** Expo React Native + TypeScript
- **Web:** Next.js + TypeScript
- **API:** Fastify + GraphQL
- **GraphQL contracts:** GraphQL Code Generator
- **Auth:** Clerk with email code plus Google/Apple login
- **Database:** PostgreSQL
- **ORM/migrations:** Prisma with code-first migrations
- **Local development:** Docker Compose
- **Infrastructure:** AWS CDK with TypeScript for the first AWS deployment
- **Initial AWS services:** RDS Postgres and S3
- **Testing:** API integration tests against a real test database, plus context/domain tests

**Planned later stack additions:**

- S3 signed uploads for review photos
- Dedicated search service evaluation, including Lucene/Nrtsearch-style indexing
- AI services for query understanding, review highlights, canonicalization, and recommendations
- Athena/Glue/Redshift-style analytics workflows
- Kubernetes/EKS only if scale or service operations justify it
- Swift/SwiftUI for later iOS-native enhancements if product traction justifies it

## Architecture Direction

TasteApp is planned as a TypeScript-first monorepo:

- `apps/mobile`: Expo React Native mobile app.
- `apps/web`: Next.js web app.
- `apps/api`: Fastify backend with GraphQL as the main client API.
- `packages/shared`: shared contracts and primitives when genuinely cross-context.
- `infra`: AWS CDK infrastructure when the first AWS deployment is needed.

**Key decisions:**

- Use pnpm workspaces and Turborepo.
- Use DDD bounded contexts for backend modularity.
- Use PostgreSQL with code-first Prisma migrations.
- Keep business logic in TypeScript, not stored procedures.
- Treat Prisma as persistence infrastructure, not the domain model.
- Use Clerk for MVP authentication.
- Use GraphQL for mobile/web clients and REST only for operational endpoints.
- Use Docker Compose for local development.
- Use AWS CDK for the first AWS deployment.

## Engineering Philosophy

- Prefer domain-driven design over table-driven or route-driven architecture.
- Organize backend behavior around bounded contexts: Identity, Catalog, Reviews, Discovery, Moderation, and Monetization.
- Keep GraphQL resolvers and REST handlers thin. They should call application use cases, not own business logic.
- Keep business logic in TypeScript code, not database stored procedures.
- Treat Prisma as persistence infrastructure, not the domain model.
- Use encapsulation and polymorphism where they clarify domain behavior; prefer composition over inheritance unless a real domain hierarchy emerges.
- Avoid generic `Manager` classes. Prefer precise names such as use cases, policies, rankers, detectors, repositories, and adapters.
- Add operational complexity only when the product needs it. Docker belongs in MVP; Kubernetes does not.
- Preserve testability at the bounded-context/application-service level.

## MVP Scope

The first usable MVP should include:

- Account creation and login.
- Creation flows for Restaurants, Locations, Canonical Dishes, Menu Items, and RestaurantDishes.
- Dish Review creation with structured food-quality inputs.
- Canonical Dish search.
- RestaurantDish ranking pages.
- Distance filters and list-first results with distance labels.
- Emerging labels for low-sample rankings.
- Basic report and moderation flows.
- Docker-based local development.
- API integration tests against a real test database.

**Not in MVP:** AI recommendations, profile badges, photo upload, premium subscriptions, claimed restaurant tools, Food Crawl planning, repeat-visit review layers, map-heavy UI, dedicated search infrastructure, Kubernetes, and analytics warehouse workflows.

## Important Constraints

- **Ranking Philosophy:** Default rankings are food-quality-first. Distance, service, ambiance, convenience, and other experience factors can be filters or optional modes, but they should not silently override food quality.
- **Restaurant Owner Boundary:** Claimed Restaurants may correct factual menu/location/profile information later, but they must not edit rankings, remove criticism, or pay for ranking influence.
- **Review Integrity:** Require accounts for review creation; require taste, value, portion, temperature, and ingredient quality inputs; support dish-specific auxiliary qualities; and design abuse controls for Coordinated Review Attacks.
- **Verification:** User submissions start unverified, with AI-assisted duplicate detection and verification workflows. AI suggestions do not automatically verify records.
- **Chain Detection:** Flag a Restaurant as a chain candidate when it has multiple Locations within a 50-mile radius; use that flag to keep Menu Item quality location-aware.
- **Distance Handling:** Distance can filter the listings shown, but default rankings remain food-quality-first. Convenience Mode can prioritize nearby options while still displaying each listing's original food-quality rank.
- **Location UX:** MVP is list-first with distance labels, not map-first. Store latitude/longitude for Locations, cache geocoding results, and defer map-heavy UI to Phase 2.
- **Ranking Confidence:** Show rankings immediately, but label RestaurantDishes with fewer than five Dish Reviews as Emerging in the MVP. Treat the threshold as configurable so it can scale with product growth.
- **Review Trust:** Do not require proof-of-visit in the MVP. Treat photos, recent visit claims, review history, account age, location check-ins, community reports, and contributor badges as post-MVP trust/gamification signals.
- **Monetization Boundary:** Keep core dish search, rankings, reviews, review creation, basic filters, and profile gamification free. Premium should improve discovery through AI/power features rather than hiding the basic ranking truth.

## Documentation Structure

- `plan.md` - PRD and product plan
- `CONTEXT.md` - Domain glossary and language
- `docs/adr/` - Architecture Decision Records
- `README.md` - Project overview and setup
- `Claude.md` - This file - AI agent context

## Testing Philosophy

Good tests should verify external behavior and product outcomes rather than internal implementation details. The highest-value seam for the MVP is the API behavior against a real test database because that validates the domain model, validation, persistence, ranking, and product flows without coupling tests to UI internals.

**Key testing areas:**

- API integration tests should cover account-required flows, restaurant creation, dish creation, restaurant-dish linking, review creation, search, ranking, saved items, moderation state changes, and entitlement checks.
- Context tests should exercise application use cases at each Bounded Context boundary without reaching through adapters or testing implementation details.
- Domain behavior tests should cover encapsulated business rules in TypeScript, not database stored procedure behavior.
- GraphQL resolver tests should verify schema wiring, authorization, and resolver-to-use-case mapping, while domain/application tests should cover business behavior without requiring Fastify or GraphQL execution.
- Ranking tests should verify that dish-specific review data drives dish rankings and that restaurant-level metadata does not override food-specific signals.
- Distance tests should verify that distance filters narrow the result set without changing food-quality rank, and that Convenience Mode keeps food-quality rank visible when ordering by convenience.
