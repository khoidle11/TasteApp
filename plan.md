# TasteApp PRD: Dish-First Food Review App

## Problem Statement

People often search food apps for a specific craving, but most restaurant review products rank restaurants as a whole. A restaurant's service, ambiance, location, popularity, brand reputation, and other non-food factors can distort whether it is actually the best place for a specific dish. Users who want the best ramen, fries, birria tacos, dumplings, or tiramisu near them need a dish-first way to compare food quality.

The existing TasteDB class project proves the core domain idea with users, restaurants, dishes, restaurant addresses, and reviews, but it is a class-project Express/Handlebars/MySQL prototype. TasteApp should become a fresh, monetizable product with mobile, web, backend, data, search, and AI foundations designed for long-term growth.

## Solution

Build TasteApp as a fresh monorepo for a dish-first food review app. The product will let users create restaurants, dishes, restaurant-dish links, and dish-focused reviews. Ratings and rankings should emphasize food quality signals rather than general restaurant sentiment.

The first product should support a cross-platform mobile app and an SEO-capable web UI. The architecture should keep the MVP buildable while leaving clean paths for AWS data tooling, Lucene/Nrtsearch-inspired search, LLM-powered query understanding, review highlights, and Kubernetes-based scaling later.

Core stack decisions:

- Mobile app: Expo React Native with TypeScript.
- Web app: Next.js with TypeScript.
- API: TypeScript backend with tRPC or typed REST as the MVP client API.
- Database: PostgreSQL with Prisma.
- Local infrastructure: Docker from day one.
- Production cloud: AWS, starting with S3 and RDS Postgres.
- Data roadmap: S3 data lake, Athena, Glue, and Redshift-style warehouse workflows.
- Search roadmap: Postgres search first, Lucene/Nrtsearch-inspired search service later.
- AI roadmap: LLM-powered query understanding, review highlights, query segmentation, spell correction, canonicalization, and recommendation intelligence.
- Scaling roadmap: Kubernetes/operator-style infrastructure later, especially for search/indexing workloads.
- Experience factors: service, ambiance, popularity, convenience, and general restaurant sentiment should be optional user-controlled ranking/filter inputs, not default food-quality drivers.
- Data quality: user-submitted restaurants, locations, canonical dishes, menu items, restaurant-dish links, and reviews should start unverified, with AI-assisted duplicate detection and verification workflows.
- AI verification visibility: internal confidence scores, duplicate queues, and merge decisions are moderator-facing; normal users only see lightweight submission nudges such as "Did you mean...?".
- Chain detection: flag a Restaurant as a chain candidate when it has multiple Locations within a 50-mile radius; use that flag to keep Menu Item quality location-aware.
- Distance handling: distance can filter the listings shown, but default rankings remain food-quality-first. Convenience Mode can prioritize nearby options while still displaying each listing's original food-quality rank.
- Group Dish Match: MVP should let users select two or more Canonical Dishes, such as pizza plus fried chicken, and find Restaurants or Locations where every selected dish has strong dish-specific evidence. This is a bounded algorithmic match, not broad open-ended AI recommendations.
- Group Dish Match algorithm exploration: before implementation, create a short product/spec decision that tests simple scoring scenarios. The MVP should start with full matches first, prefer the result whose weakest selected dish is strongest, and use average rank and confidence as tie-breakers while labeling Partial Matches clearly.
- Location UX: MVP is list-first with distance labels, not map-first. Store latitude/longitude for Locations, cache geocoding results, and defer map-heavy UI to Phase 2.
- Ranking confidence: show rankings immediately, but label RestaurantDishes with fewer than five Dish Reviews as Emerging in the MVP. Treat the threshold as configurable so it can scale with product growth.
- Review trust: do not require proof-of-visit in the MVP. Treat photos, recent visit claims, review history, account age, location check-ins, community reports, and contributor badges as post-MVP trust/gamification signals.
- Monetization boundary: keep core dish search, rankings, reviews, review creation, basic filters, and profile gamification free. Premium should improve discovery through AI/power features rather than hiding the basic ranking truth.
- Restaurant owner boundary: Claimed Restaurants may correct factual menu/location/profile information later, but they must not control Dish Rankings or suppress Dish Reviews.
- Review integrity: require accounts for review creation; require taste, value, portion, temperature, and ingredient quality inputs; support dish-specific auxiliary qualities; and design abuse controls for Coordinated Review Attacks.
- Quality taxonomy: start with a small curated set of dish-specific auxiliary qualities. AI and trusted contributors can suggest additions, but approved prompts should remain controlled by the app.
- MVP boundary: the first usable version includes accounts, core entity creation, structured Dish Reviews, Canonical Dish search, RestaurantDish rankings, Group Dish Match for explicit selected dishes, distance filtering, Emerging labels, and basic reporting. Open-ended AI, badges, photos, premium, claimed restaurants, repeat-visit review layers, and advanced search/data infrastructure belong to Phase 2 or later.
- Native iOS path: use Expo React Native for the MVP, but reserve Swift/SwiftUI for later iOS-native enhancements such as widgets, Apple Maps polish, Live Activities, haptics, native modules, or a future iOS-first rewrite if product traction justifies it.
- Infrastructure as Code: MVP local development uses Docker Compose only. The first real AWS deployment should use AWS CDK with TypeScript; Terraform/OpenTofu remains a later alternative if cloud-agnostic infrastructure practice becomes a priority.
- Authentication: use Clerk for MVP auth with email code plus Google/Apple login. Avoid SMS early to reduce cost; keep TasteApp profile, badge, moderation, and review data in the app database linked to Clerk identity.
- Architecture style: use domain-driven design, bounded contexts, and modular application boundaries so TasteApp remains readable, scalable, and testable as the product grows.
- Object-oriented design: use encapsulation and polymorphism where they clarify domain behavior. Use inheritance sparingly; prefer composition unless a true domain hierarchy appears.
- Monorepo tooling: use pnpm workspaces and Turborepo for package management, task orchestration, and caching.
- API style: use a typed API layer, favoring tRPC or typed REST for MVP. Keep product behavior in application services so REST, tRPC, or future GraphQL remain replaceable delivery layers.

## User Stories

1. As a food seeker, I want to search for a specific dish, so that I can find the best place to eat that dish.
2. As a food seeker, I want dish rankings to focus on food quality, so that service or ambiance does not dominate my decision.
3. As a food seeker, I want to view a dish page, so that I can compare restaurants that serve that dish.
4. As a food seeker, I want to view a restaurant page, so that I can see which dishes the restaurant is actually known for.
5. As a food seeker planning with another person, I want to choose multiple dishes and find places where all of them are strong, so that one person can want pizza and another can want fried chicken without settling blindly.
6. As a food seeker, I want Group Dish Match results to show the per-dish tradeoffs, so that a combined match does not hide that one dish is great and another is only Emerging.
7. As a food seeker, I want to filter by cuisine, location, price, and dietary preferences, so that I can narrow results to what I want right now.
8. As a food seeker, I want to save dishes and restaurants, so that I can return to them later.
9. As a food seeker, I want to see review highlights, so that I can quickly understand why people like or dislike a dish.
10. As a food seeker, I want spell correction and dish name canonicalization, so that searches still work when I misspell or use alternate dish names.
11. As a food seeker, I want AI dish recommendations, so that I can ask natural questions like "best spicy ramen near me".
12. As a food seeker, I want to turn service, ambiance, popularity, and convenience factors on or off, so that I can decide when non-food experience matters.
13. As a food seeker, I want default rankings to prioritize food quality signals, so that the app does not silently recreate restaurant-first ranking bias.
14. As a food seeker, I want distance filters to narrow listings without changing their food-quality rank, so that I can see the best food inside my acceptable travel range.
15. As a food seeker, I want Convenience Mode, so that I can prioritize closer options when ease matters more than absolute food quality.
16. As a food seeker, I want Convenience Mode results to still show each listing's food-quality rank, so that I understand the tradeoff I am making.
17. As a food seeker, I want list-first search results with clear distance labels, so that I can compare food quality before needing a map.
18. As a product owner, I want geocoding results cached, so that location features do not create unnecessary API cost.
19. As a food seeker, I want low-sample rankings labeled as Emerging, so that I do not over-trust a dish with only a few reviews.
20. As a product owner, I want the Emerging threshold to be configurable, so that ranking confidence can scale as TasteApp grows.
21. As a reviewer, I want to create an account, so that my reviews and saved items belong to me.
22. As a reviewer, I want to add a restaurant, so that I can review food from places not yet in the app.
23. As a reviewer, I want to add a canonical dish, so that the app can compare the same kind of food across restaurants.
24. As a reviewer, I want to add a restaurant-specific menu item, so that reviews describe the actual food served by one restaurant.
25. As a reviewer, I want to connect a restaurant-specific menu item to a canonical dish, so that search and ranking work at both levels.
26. As a reviewer, I want to review a RestaurantDish, so that reviews are attached to a specific restaurant's version of a dish.
27. As a reviewer, I want to rate taste, value, portion, temperature, and ingredient quality, so that MVP Dish Reviews capture food-specific signals.
28. As a reviewer, I want dish-specific auxiliary quality prompts, so that fried foods can ask about crispiness while ice cream can ask about qualities that actually apply.
29. As a repeat reviewer, I want second-or-later visits to unlock deeper review prompts, so that I can rate qualities like consistency that require multiple experiences.
30. As a reviewer, I want to optionally rate service and ambiance separately, so that experience factors can exist without polluting default food rankings.
31. As a reviewer, I want to leave written comments, so that I can explain my experience in more detail.
32. As a reviewer, I want to upload photos later, so that dish pages have visual evidence.
33. As a reviewer, I want to edit or delete my review, so that I can correct mistakes.
34. As a reviewer, I want to report incorrect restaurants, dishes, or reviews, so that the app data stays trustworthy.
35. As a reviewer, I want the app to flag restaurants with multiple nearby locations, so that I understand when a restaurant may behave like a chain.
36. As a reviewer, I want to attach a photo later, so that my review can have a stronger trust signal.
37. As a reviewer, I want to optionally indicate I visited recently later, so that freshness can become a trust signal.
38. As a reviewer, I want future location check-ins to be optional, so that trust can improve without blocking MVP reviews.
39. As a contributor, I want future profile badges to be free, so that helpful reviewing and reporting can fuel community growth.
40. As a food seeker, I want core dish search, rankings, and reviews to stay free, so that I can trust and participate in the community before paying.
41. As a premium user, I want paid features to improve discovery convenience, so that premium feels like extra power rather than hidden truth.
42. As a premium user, I want a future Food Crawl planner, so that I can build multi-stop eating plans around ranked dishes, distance, hours, budget, and preferences.
43. As a food seeker, I want chain locations to be ranked separately by dish quality, so that one strong location does not inflate another location's food ranking.
44. As a moderator, I want new user-submitted restaurants, locations, canonical dishes, menu items, and restaurant-dish links to start unverified, so that messy input does not become trusted product truth immediately.
45. As a moderator, I want AI-assisted duplicate and misspelling suggestions, so that I can identify merge candidates faster.
46. As a moderator, I want a merge workflow for duplicate restaurants, locations, canonical dishes, menu items, and restaurant-dish links, so that the product can recover from messy user input.
47. As a submitting user, I want lightweight "did you mean" suggestions, so that I can avoid creating accidental duplicates without learning internal moderation details.
48. As a moderator, I want a queue of reported content, so that harmful or low-quality content can be reviewed.
49. As a moderator, I want audit trails for moderation decisions, so that trust and safety actions are traceable.
50. As a product owner, I want public web pages for dishes and restaurants, so that TasteApp can gain search-engine traffic.
51. As a product owner, I want mobile apps for iOS and Android, so that users can discover and review food while out in the world.
52. As a product owner, I want analytics events captured, so that product usage and search quality can be measured.
53. As a product owner, I want subscription entitlements modeled early, so that premium AI features can be monetized later.
54. As a product owner, I want AWS data exports, so that analytics and recommendation workflows can grow beyond the transactional database.
55. As a developer, I want Docker-based local development, so that the app can run predictably from a clean checkout.
56. As a developer, I want shared TypeScript schemas, so that mobile, web, and API contracts stay aligned.
57. As a developer, I want API tests against a real test database, so that product behavior is validated at the highest useful seam.
58. As a developer, I want the search system behind an interface, so that Postgres search can later be replaced or augmented by Lucene/Nrtsearch.
59. As a developer, I want AI recommendation logic behind a service boundary, so that LLM features can evolve without rewriting the core API.
60. As a developer, I want Kubernetes deferred until scale justifies it, so that the MVP avoids unnecessary operational complexity.
61. As a data analyst, I want app events and review data exported to S3, so that Athena/Glue/warehouse workflows can analyze product behavior later.
62. As a data analyst, I want search interaction data captured, so that query understanding and ranking quality can improve over time.
63. As a premium user, I want AI-powered dish finding, so that paid features feel meaningfully better than basic search.
64. As a premium user, I want personalized recommendations based on my taste profile, so that the app learns what I like.
65. As a restaurant owner, I want to claim a Restaurant later, so that I can correct factual profile, Location, hours, and menu information.
66. As a food seeker, I want Claimed Restaurants to be unable to suppress reviews or alter Dish Rankings, so that business tools do not undermine trust.
67. As a reviewer, I want profiles and badges to make reviewing feel fun, so that account-based reviewing feels like a benefit instead of only a gate.
68. As a reviewer, I want Dish Reviews to require structured Food Quality Signal inputs, so that reviews stay focused on the food.
69. As a moderator, I want signals for Coordinated Review Attacks, so that suspicious bursts of reviews can be slowed, queued, or down-weighted.
70. As a product owner, I want a curated Quality Taxonomy, so that auxiliary review prompts stay relevant and consistent.
71. As a trusted contributor, I want to suggest new auxiliary qualities later, so that the review model can improve as the community discovers useful dish-specific signals.
72. As a moderator, I want AI-suggested auxiliary qualities to require approval, so that the app avoids messy or irrelevant review prompts.

## Implementation Decisions

- Build a fresh repository named TasteApp rather than incrementally refactoring the TasteDBCS340 class project.
- Treat the class project as domain reference only. Its useful nouns are users, restaurants, restaurant addresses, dishes, restaurant-dish links, reviews, taste ratings, and presentation ratings.
- Model both canonical dishes and restaurant-specific menu items. Reviews and rankings attach to RestaurantDishes, which represent one restaurant's version of a canonical dish.
- For MVP menu changes, give Menu Items an active/inactive state, optional last-known price or price range, and a last-seen timestamp. Do not build full Menu Item version history until Phase 2 or later.
- Model Restaurants with one or more Locations. If a Restaurant has multiple Locations within a 50-mile radius, flag it as a chain candidate and keep dish rankings location-specific.
- Model user-created restaurants, locations, canonical dishes, menu items, restaurant-dish links, and reviews with a verification state.
- Use AI Verification Assist to propose duplicate matches, canonical names, misspelling corrections, suspicious submissions, and merge candidates, but do not let AI mark data verified by itself.
- Keep AI Verification Assist moderator-facing. User-facing submission flows may show Submission Nudges, but should not expose confidence scores, merge queues, or internal moderation decisions.
- Use a monorepo with separate mobile, web, API, and shared package areas.
- Use pnpm workspaces plus Turborepo. Keep domain modularity inside the API bounded contexts rather than creating a separate package for every domain concept.
- Use Expo React Native with TypeScript for the mobile app because the product should support iOS and Android without maintaining two separate native clients.
- Do not start with SwiftUI for the MVP. Keep Swift/SwiftUI as a later native enhancement path after the core product, API, and ranking model have traction.
- Use Next.js with TypeScript for the web app because public dish and restaurant pages should be SEO-friendly and monetization/landing pages should be natural to build.
- Use a TypeScript API as the main backend because it keeps the app, web, API, schemas, validation, and tests in one language family for solo-development speed.
- Use tRPC or typed REST for the MVP client API because TasteApp is TypeScript-first and AI-dev driven; the compiler, explicit DTOs, and Zod schemas should catch contract drift for agents.
- Use REST-style route handlers where they are simpler for public pages, operational endpoints, health checks, webhooks, auth callbacks, and future upload signing.
- Use Zod schemas plus TypeScript DTOs/view models for typed client/server contracts shared by mobile, web, and API development. Add OpenAPI only if REST client generation becomes useful.
- Keep API handlers, tRPC procedures, REST handlers, and any future GraphQL resolvers thin: validate and authorize at the boundary, call bounded-context application use cases, map results to the client-facing DTO/schema, and return.
- Do not put domain decisions, ranking logic, verification workflows, review-integrity rules, or AI recommendation logic directly in controllers, route handlers, tRPC procedures, or GraphQL resolvers. Those belong in bounded-context application services and domain modules.
- Defer GraphQL until multi-client data composition becomes valuable enough to justify resolver, caching, auth, and query-complexity overhead. If GraphQL is introduced later, add cursor pagination, query depth/complexity limits, auth checks at resolver/use-case boundaries, and batching/data-loader patterns before the schema grows.
- Avoid generic Manager classes as a default naming pattern. Prefer use cases, application services, domain services, policies, repositories, and adapters with names that describe the actual domain responsibility.
- Keep business logic in the TypeScript codebase, not in database stored procedures. The database should enforce integrity constraints and persistence, while domain decisions live in bounded-context code.
- Use Clerk for MVP authentication. The API should map Clerk identities to local TasteApp Users, and Dish Review creation requires a signed-in TasteApp User.
- Start with passwordless email code plus Google/Apple login. Do not make SMS auth the primary path in MVP because SMS adds production cost.
- Organize backend code around Bounded Contexts rather than database tables or HTTP routes. Initial contexts should be Identity, Catalog, Reviews, Discovery, Moderation, and Monetization.
- Keep domain rules inside context-level application services/use cases, with HTTP handlers, Prisma access, Clerk integration, and external APIs treated as adapters.
- Prefer clear module boundaries and explicit interfaces over shared global utilities. Shared packages should contain cross-context contracts and primitives only when multiple contexts genuinely need them.
- Treat the API as a replaceable delivery layer, not the domain model. PostgreSQL stores product data; application services own product behavior; tRPC, REST, or future GraphQL compose client-facing reads and mutations across bounded contexts.
- Use PostgreSQL as the source-of-truth database for users, restaurants, locations, dishes, restaurant-dish links, reviews, ratings, saved items, moderation state, subscription entitlements, and analytics-friendly product events.
- Use Prisma for database migrations and typed database access. Prisma models are persistence infrastructure, not the domain model; domain rules should live in bounded-context application/domain modules.
- Use code-first Prisma schema and migrations for database evolution. Schema changes should be reviewed as code, then applied through migrations rather than manual database-first edits.
- Use database constraints for data integrity, such as required fields, foreign keys, uniqueness, and referential behavior. Do not hide ranking, verification, moderation, entitlement, or review-integrity logic inside stored procedures.
- Use Prisma Client as the default application query interface. LINQ does not apply because TasteApp is not using C#/.NET; raw SQL remains acceptable for advanced queries that Prisma cannot express cleanly.
- Use Docker Compose for local development with API, Postgres, test database, and future service containers.
- Treat GitHub Actions as a staged delivery roadmap rather than one oversized infrastructure ticket.
- Keep `CI` as the required pull-request and `main` status check. That workflow should install dependencies with a frozen lockfile, generate Prisma Client when `prisma/schema.prisma` exists, apply committed Prisma migrations against disposable PostgreSQL, and then run format, lint, typecheck, test, and build checks.
- Keep `Deploy` as a guarded manual `workflow_dispatch` placeholder that only runs from `main` until real AWS rollout steps exist.
- Keep committed Prisma migration verification in the base CI workflow and split optional drift detection, production rollout, preview deploys, mobile builds, security scans, and release automation into separate follow-up issues rather than growing one umbrella CI/CD task.
- Do not introduce Terraform for the local MVP. Use AWS CDK with TypeScript for the first real AWS deployment because TasteApp is AWS-first and TypeScript-first.
- Use AWS for production infrastructure, starting with RDS Postgres and S3.
- Use S3 for media uploads, data exports, structured logs, and eventual data lake storage.
- Add Athena/Glue/Redshift-style workflows as later data-platform milestones, not MVP blockers.
- Start search with PostgreSQL indexes/full-text search so the MVP ships quickly.
- Put search behind a SearchService boundary so Lucene/Nrtsearch-inspired search can be introduced later.
- Keep service, ambiance, popularity, convenience, and general restaurant sentiment as optional experience factors that users can include or exclude from ranking/filtering.
- Treat distance as a filter by default rather than a food-quality ranking input. Convenience Mode may reorder listings by closeness, but should preserve visible food-quality rank in the interface.
- Implement Group Dish Match as a Discovery application service that accepts explicit Canonical Dish selections and returns Restaurants or Locations with per-dish RestaurantDish evidence, confidence labels, and a deterministic Match Score. Do not use broad AI ranking for this MVP slice. Do not implement the production behavior until the simple MVP scoring scenarios are specified.
- Keep MVP location UX list-first. Store latitude/longitude on Locations, cache geocoding results, and defer map-heavy UI until Phase 2.
- Show Dish Rankings immediately, but label RestaurantDishes with fewer than five Dish Reviews as Emerging in the MVP. Store the confidence threshold as configuration rather than hard-coding it into the ranking model.
- Evaluate Nrtsearch later because Yelp's open-source Nrtsearch is a high-performance gRPC server on Apache Lucene with S3-backed/stateless container deployment patterns.
- Keep open-ended AI out of the MVP implementation but reserve a recommendation/query-understanding service boundary. Group Dish Match is the exception only because it is a bounded deterministic matching algorithm over selected Canonical Dishes.
- Add LLM features in Phase 2: query segmentation, spell correction, dish canonicalization, review highlights, and recommendation ranking.
- Defer Kubernetes/EKS/operator-style infrastructure until service count, scaling needs, or search/indexing operations justify it.
- Use Python later only if AI, recommendation, or data jobs become complex enough to deserve a separate service. The main product should remain TypeScript for speed and consistency.
- Avoid ads and restaurant-paid placement early because they can weaken trust in unbiased dish-first recommendations.
- Design monetization around consumer freemium: free search/reviews first, premium AI dish discovery and power-search features later.
- Do not paywall Core Ranking Truth or Contributor Badges. Keep gamified profiles free because they support contribution, sharing, retention, and top-of-funnel growth.
- Treat Food Crawl planning as a later premium discovery feature, not an MVP requirement.
- Model trust and moderation early because user-generated reviews and public content need reporting, blocking, moderation states, and auditability.
- Model merge workflows early enough that duplicate user submissions can be consolidated without losing reviews, rankings, or attribution.
- Keep Dish Review creation low-friction in the MVP. Do not require photos, receipts, location check-ins, or proof-of-visit before a user can review.
- Reserve trust signals and contributor badges for post-MVP ranking quality, abuse prevention, and gamification work.
- Require an account to create Dish Reviews. Make profiles and badges feel rewarding so account-based reviewing supports growth rather than feeling like pure friction.
- Require taste, value, portion, temperature, and ingredient quality inputs for MVP Dish Reviews so low-effort, non-food-driven pile-ons are harder to submit and less useful to rankings.
- Support dish-specific Auxiliary Dish Qualities so the review form can ask relevant second-layer questions, such as crispiness for fried foods, without forcing irrelevant prompts onto every dish.
- Manage Auxiliary Dish Qualities through a curated Quality Taxonomy. AI and trusted contributor suggestions can feed a moderation workflow, but should not immediately become public prompts.
- Treat Repeat-Visit Signals as a future/pro-style review layer. Consistency is the first known signal, but this area should remain open for continued brainstorming as the product learns what repeat reviewers notice.
- Detect Coordinated Review Attacks with product and moderation signals such as sudden review bursts, low-account-age clusters, repeated text patterns, abnormal rating swings, and report spikes.
- Claimed Restaurant features are post-MVP and limited to factual corrections, owner responses, and analytics. Claimed Restaurants must not edit rankings, remove criticism, or pay for ranking influence.

## MVP Implementation

The first usable MVP should include:

- Account creation and login.
- Creation flows for Restaurants, Locations, Canonical Dishes, Menu Items, and RestaurantDishes.
- Dish Review creation with required taste, value, portion, temperature, and ingredient quality inputs.
- Canonical Dish search.
- RestaurantDish ranking pages.
- Group Dish Match for two or more selected Canonical Dishes, with visible per-dish tradeoffs.
- Distance filters that narrow listings without changing food-quality rank.
- List-first results with distance labels.
- Emerging labels for RestaurantDishes below the configured review threshold.
- Basic report flow for incorrect, harmful, duplicate, or low-quality content.
- Basic moderation states for reports and User Submissions.
- Docker-based local development.
- GitHub Actions CI with the `Install, lint, typecheck, test, and build` job required before merging to `main`.
- API integration tests against a real test database.

The MVP should not include open-ended AI recommendations, profile badges, photo upload, premium subscriptions, Claimed Restaurants, Food Crawl planning, repeat-visit review layers, map-heavy UI, Nrtsearch, Kubernetes, or AWS analytics warehouse workflows.

## Phase 2 Implementation

Phase 2 should build on product traction and real usage data rather than trying to ship every advanced system upfront.

Candidate Phase 2 areas:

- AI dish finder for natural-language prompts like "best spicy ramen near me".
- AI Verification Assist for duplicate detection, canonicalization, suspicious submissions, and quality taxonomy suggestions.
- Review highlights and dish summaries generated from Dish Reviews.
- Profile gamification, Contributor Badges, and trusted-contributor workflows.
- Photo upload and photo-based Trust Signals.
- Review Photo uploads through signed S3 upload URLs, with image metadata stored in PostgreSQL and moderation before public display.
- Map UI and richer location browsing.
- Optional location check-ins and other proof-of-visit experiments.
- Repeat-visit review layers, starting with consistency and other signals discovered through continued brainstorming.
- Premium discovery features such as personalized taste profiles, power filters, saved food maps, and Food Crawl planning.
- Swift/SwiftUI enhancements for iOS-native polish, such as widgets, Apple Maps, Live Activities, haptics, and native modules.
- Menu Item version history for recipe/name/price changes if menu churn becomes important.
- Claimed Restaurant profiles for factual corrections, owner responses, and analytics without ranking control.
- Dedicated search service evaluation, including Lucene/Nrtsearch-style indexing.
- S3 data lake exports, Athena/Glue analytics workflows, and later Redshift-style warehouse workflows.
- Kubernetes/EKS/operator-style infrastructure if service count, scale, or search operations justify it.

## Testing Decisions

Good tests should verify external behavior and product outcomes rather than internal implementation details. The highest-value seam for the MVP is the API behavior against a real test database because that validates the domain model, validation, persistence, ranking, and product flows without coupling tests to UI internals.

Testing decisions:

- API integration tests should cover account-required flows, restaurant creation, dish creation, restaurant-dish linking, review creation, search, ranking, saved items, moderation state changes, and entitlement checks.
- Context tests should exercise application use cases at each Bounded Context boundary without reaching through adapters or testing implementation details.
- Domain behavior tests should cover encapsulated business rules in TypeScript, not database stored procedure behavior.
- API handler/procedure tests should verify transport wiring, authorization, validation, and handler-to-use-case mapping, while domain/application tests should cover business behavior without requiring the HTTP or API transport.
- API performance tests should cover pagination/list limits and prevent obvious N+1 query regressions on dish ranking and review-list queries.
- API security tests should verify unauthorized users cannot access private profile, moderation, entitlement, or mutation paths.
- REST endpoint tests should cover public/operational endpoints such as public SEO page data, health checks, webhooks, auth callbacks, and future file upload signing.
- Shared schema tests should verify request/response validation and API contract compatibility.
- Mobile journey tests should cover sign-in, dish search, review creation, dish detail, and saved dishes.
- Web smoke tests should cover public landing pages, dish pages, restaurant pages, and SEO metadata.
- Ranking tests should verify that dish-specific review data drives dish rankings and that restaurant-level metadata does not override food-specific signals.
- Ranking tests should verify that optional experience factors can be toggled into ranking/filtering without changing the default food-first ranking behavior.
- Distance tests should verify that distance filters narrow the result set without changing food-quality rank, and that Convenience Mode keeps food-quality rank visible when ordering by convenience.
- Group Dish Match tests should verify that multiple selected Canonical Dishes produce deterministic Restaurant or Location matches, preserve per-dish ranks/confidence labels, handle missing or Emerging dishes clearly, and do not collapse into a generic restaurant-wide score.
- Geocoding tests should verify that Location coordinates are stored and cached so repeated location lookups do not require repeated external geocoding calls.
- Ranking confidence tests should verify that RestaurantDishes with fewer than the configured review threshold are labeled Emerging and that changing the threshold does not require schema changes.
- Verification tests should verify that user submissions start unverified, that AI suggestions do not automatically verify records, and that merged records preserve attached reviews and rankings.
- Submission nudge tests should verify that users can accept, ignore, or continue past suggestions without seeing internal AI confidence or moderation state.
- Chain candidate tests should verify that multiple Locations within 50 miles flag a Restaurant for chain handling and that each Location's RestaurantDish ranking remains separate.
- Search relevance tests should start simple with Postgres search and expand when a dedicated search service exists.
- Review integrity tests should verify that Dish Reviews require an account plus taste, value, portion, temperature, and ingredient quality inputs.
- Auxiliary quality tests should verify that dish-specific prompts appear only for relevant Canonical Dishes or Menu Items.
- Quality taxonomy tests should verify that unapproved AI or contributor suggestions do not appear as public review prompts.
- Repeat-visit tests should verify that second-or-later visits can unlock consistency or other repeat-only prompts without making them required for MVP reviews.
- Abuse-control tests should verify that suspicious bursts can be flagged without deleting legitimate Dish Reviews automatically.
- AI tests should be added in Phase 2 around query parsing, canonicalization, highlight generation, and recommendation response shape.
- Data pipeline checks should verify that events can be exported to S3 without blocking core app behavior.
- Docker verification should ensure the repo can run from a clean checkout using documented commands.
- Menu item tests should verify active/inactive state, last-seen tracking, and last-known price fields without requiring full version history.

## Out of Scope

- Publishing this PRD to Linear.
- Building the full app implementation in this planning artifact.
- Migrating or reusing the existing Express/Handlebars/MySQL code directly.
- Open-ended AI recommendations in the first MVP implementation.
- Lucene/Nrtsearch production deployment in the first MVP.
- Map-heavy UI in the first MVP.
- Kubernetes/EKS deployment in the first MVP.
- Athena, Glue, and Redshift-style warehouse implementation in the first MVP.
- Restaurant-paid placement, ads, reservations, delivery ordering, or influencer/social-feed mechanics in the first MVP.
- Proof-of-visit requirements, location check-ins, trust scoring, and contributor badge gamification in the first MVP.
- Claimed Restaurant owner tools in the first MVP.
- Food Crawl planning and premium AI-powered itinerary building in the first MVP.
- Repeat-visit/pro review layers, including consistency scoring, in the first MVP.
- Full Menu Item version history in the first MVP.
- Review Photo upload and public image display in the first MVP.
- Native SwiftUI-only implementation.
- Swift/SwiftUI mobile implementation in the first MVP.
- GraphQL as the main client API in the first MVP.

## Further Notes

The API should be understood as a delivery layer, not the domain model or database. PostgreSQL stores product data. Bounded-context application services own product behavior. tRPC or typed REST should expose MVP use cases through explicit DTOs and Zod validation; GraphQL can be added later only if flexible multi-client graph-shaped reads become valuable enough to outweigh agent-execution and operational complexity.

Yelp can use Python heavily because large companies are polyglot and can afford specialized services for backend, data, ML, and search. TasteApp should start simpler: TypeScript for mobile, web, and API; Python only later if AI/data complexity warrants it.

The Yelp-inspired infrastructure should be treated as a roadmap, not an MVP checklist. The immediate goal is to build a clean, monetizable, dish-first product foundation that can grow toward serious search, AI, data, and cloud infrastructure over time.

The delivery roadmap should stay split into focused follow-up issues instead of turning `TST-35` into one oversized implementation ticket. The current baseline is the required `CI` workflow plus a guarded manual `Deploy` placeholder, and contributor-facing rules should continue to live in `docs/delivery/workflow.md`.

- [`TST-72`](https://linear.app/khoile11/issue/TST-72/add-prisma-migration-checks-to-cicd-pipeline) keeps committed Prisma migration verification scoped to the core CI pipeline.
- [`TST-74`](https://linear.app/khoile11/issue/TST-74/add-production-deploy-workflow-for-main) covers production deploy automation for `main`.
- [`TST-75`](https://linear.app/khoile11/issue/TST-75/add-web-preview-deploys-for-pull-requests) covers web preview deploys for pull requests.
- [`TST-76`](https://linear.app/khoile11/issue/TST-76/add-mobile-eas-build-workflow-for-ios-and-android) covers mobile EAS builds for iOS and Android.
- [`TST-77`](https://linear.app/khoile11/issue/TST-77/add-security-and-dependency-scanning-guardrails) covers security and dependency scanning guardrails.
- [`TST-78`](https://linear.app/khoile11/issue/TST-78/add-optional-prisma-migration-drift-check) covers optional Prisma migration drift checks without expanding the base CI path.
- [`TST-79`](https://linear.app/khoile11/issue/TST-79/add-release-tagging-and-changelog-workflow) covers release tagging and changelog automation.
