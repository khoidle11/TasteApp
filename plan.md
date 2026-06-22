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
- API: TypeScript backend, initially REST/OpenAPI.
- Database: PostgreSQL with Prisma.
- Local infrastructure: Docker from day one.
- Production cloud: AWS, starting with S3 and RDS Postgres.
- Data roadmap: S3 data lake, Athena, Glue, and Redshift-style warehouse workflows.
- Search roadmap: Postgres search first, Lucene/Nrtsearch-inspired search service later.
- AI roadmap: LLM-powered query understanding, review highlights, query segmentation, spell correction, canonicalization, and recommendation intelligence.
- Scaling roadmap: Kubernetes/operator-style infrastructure later, especially for search/indexing workloads.

## User Stories

1. As a food seeker, I want to search for a specific dish, so that I can find the best place to eat that dish.
2. As a food seeker, I want dish rankings to focus on food quality, so that service or ambiance does not dominate my decision.
3. As a food seeker, I want to view a dish page, so that I can compare restaurants that serve that dish.
4. As a food seeker, I want to view a restaurant page, so that I can see which dishes the restaurant is actually known for.
5. As a food seeker, I want to filter by cuisine, location, price, and dietary preferences, so that I can narrow results to what I want right now.
6. As a food seeker, I want to save dishes and restaurants, so that I can return to them later.
7. As a food seeker, I want to see review highlights, so that I can quickly understand why people like or dislike a dish.
8. As a food seeker, I want spell correction and dish name canonicalization, so that searches still work when I misspell or use alternate dish names.
9. As a food seeker, I want AI dish recommendations, so that I can ask natural questions like "best spicy ramen near me".
10. As a reviewer, I want to create an account, so that my reviews and saved items belong to me.
11. As a reviewer, I want to add a restaurant, so that I can review food from places not yet in the app.
12. As a reviewer, I want to add a dish, so that the app can track food at dish granularity.
13. As a reviewer, I want to connect a dish to a restaurant, so that reviews are attached to the correct restaurant-dish combination.
14. As a reviewer, I want to rate taste, presentation, value, portion, and consistency, so that reviews capture food-specific signals.
15. As a reviewer, I want to leave written comments, so that I can explain my experience in more detail.
16. As a reviewer, I want to upload photos later, so that dish pages have visual evidence.
17. As a reviewer, I want to edit or delete my review, so that I can correct mistakes.
18. As a reviewer, I want to report incorrect restaurants, dishes, or reviews, so that the app data stays trustworthy.
19. As a moderator, I want a queue of reported content, so that harmful or low-quality content can be reviewed.
20. As a moderator, I want audit trails for moderation decisions, so that trust and safety actions are traceable.
21. As a product owner, I want public web pages for dishes and restaurants, so that TasteApp can gain search-engine traffic.
22. As a product owner, I want mobile apps for iOS and Android, so that users can discover and review food while out in the world.
23. As a product owner, I want analytics events captured, so that product usage and search quality can be measured.
24. As a product owner, I want subscription entitlements modeled early, so that premium AI features can be monetized later.
25. As a product owner, I want AWS data exports, so that analytics and recommendation workflows can grow beyond the transactional database.
26. As a developer, I want Docker-based local development, so that the app can run predictably from a clean checkout.
27. As a developer, I want shared TypeScript schemas, so that mobile, web, and API contracts stay aligned.
28. As a developer, I want API tests against a real test database, so that product behavior is validated at the highest useful seam.
29. As a developer, I want the search system behind an interface, so that Postgres search can later be replaced or augmented by Lucene/Nrtsearch.
30. As a developer, I want AI recommendation logic behind a service boundary, so that LLM features can evolve without rewriting the core API.
31. As a developer, I want Kubernetes deferred until scale justifies it, so that the MVP avoids unnecessary operational complexity.
32. As a data analyst, I want app events and review data exported to S3, so that Athena/Glue/warehouse workflows can analyze product behavior later.
33. As a data analyst, I want search interaction data captured, so that query understanding and ranking quality can improve over time.
34. As a premium user, I want AI-powered dish finding, so that paid features feel meaningfully better than basic search.
35. As a premium user, I want personalized recommendations based on my taste profile, so that the app learns what I like.

## Implementation Decisions

- Build a fresh repository named TasteApp rather than incrementally refactoring the TasteDBCS340 class project.
- Treat the class project as domain reference only. Its useful nouns are users, restaurants, restaurant addresses, dishes, restaurant-dish links, reviews, taste ratings, and presentation ratings.
- Use a monorepo with separate mobile, web, API, and shared package areas.
- Use Expo React Native with TypeScript for the mobile app because the product should support iOS and Android without maintaining two separate native clients.
- Use Next.js with TypeScript for the web app because public dish and restaurant pages should be SEO-friendly and monetization/landing pages should be natural to build.
- Use a TypeScript API as the main backend because it keeps the app, web, API, schemas, validation, and tests in one language family for solo-development speed.
- Use REST/OpenAPI for the first API surface. GraphQL is not a PostgreSQL replacement; it is an API query layer that may be added later if mobile and web clients need flexible nested reads across dishes, reviews, rankings, recommendations, and search results.
- Use PostgreSQL as the source-of-truth database for users, restaurants, locations, dishes, restaurant-dish links, reviews, ratings, saved items, moderation state, subscription entitlements, and analytics-friendly product events.
- Use Prisma for database migrations and typed database access.
- Use Docker Compose for local development with API, Postgres, test database, and future service containers.
- Use AWS for production infrastructure, starting with RDS Postgres and S3.
- Use S3 for media uploads, data exports, structured logs, and eventual data lake storage.
- Add Athena/Glue/Redshift-style workflows as later data-platform milestones, not MVP blockers.
- Start search with PostgreSQL indexes/full-text search so the MVP ships quickly.
- Put search behind a SearchService boundary so Lucene/Nrtsearch-inspired search can be introduced later.
- Evaluate Nrtsearch later because Yelp's open-source Nrtsearch is a high-performance gRPC server on Apache Lucene with S3-backed/stateless container deployment patterns.
- Keep AI out of the MVP implementation but reserve a recommendation/query-understanding service boundary.
- Add LLM features in Phase 2: query segmentation, spell correction, dish canonicalization, review highlights, and recommendation ranking.
- Defer Kubernetes/EKS/operator-style infrastructure until service count, scaling needs, or search/indexing operations justify it.
- Use Python later only if AI, recommendation, or data jobs become complex enough to deserve a separate service. The main product should remain TypeScript for speed and consistency.
- Avoid ads and restaurant-paid placement early because they can weaken trust in unbiased dish-first recommendations.
- Design monetization around consumer freemium: free search/reviews first, premium AI dish discovery and power-search features later.
- Model trust and moderation early because user-generated reviews and public content need reporting, blocking, moderation states, and auditability.

## Testing Decisions

Good tests should verify external behavior and product outcomes rather than internal implementation details. The highest-value seam for the MVP is the API behavior against a real test database because that validates the domain model, validation, persistence, ranking, and product flows without coupling tests to UI internals.

Testing decisions:

- API integration tests should cover account-required flows, restaurant creation, dish creation, restaurant-dish linking, review creation, search, ranking, saved items, moderation state changes, and entitlement checks.
- Shared schema tests should verify request/response validation and API contract compatibility.
- Mobile journey tests should cover sign-in, dish search, review creation, dish detail, and saved dishes.
- Web smoke tests should cover public landing pages, dish pages, restaurant pages, and SEO metadata.
- Ranking tests should verify that dish-specific review data drives dish rankings and that restaurant-level metadata does not override food-specific signals.
- Search relevance tests should start simple with Postgres search and expand when a dedicated search service exists.
- AI tests should be added in Phase 2 around query parsing, canonicalization, highlight generation, and recommendation response shape.
- Data pipeline checks should verify that events can be exported to S3 without blocking core app behavior.
- Docker verification should ensure the repo can run from a clean checkout using documented commands.

## Out of Scope

- Publishing this PRD to Linear.
- Building the full app implementation in this planning artifact.
- Migrating or reusing the existing Express/Handlebars/MySQL code directly.
- AI recommendations in the first MVP implementation.
- Lucene/Nrtsearch production deployment in the first MVP.
- Kubernetes/EKS deployment in the first MVP.
- Athena, Glue, and Redshift-style warehouse implementation in the first MVP.
- Restaurant-paid placement, ads, reservations, delivery ordering, or influencer/social-feed mechanics in the first MVP.
- Native SwiftUI-only implementation.
- Using GraphQL as the initial API unless client data-fetching complexity later justifies it.

## Further Notes

GraphQL should be understood as an API layer, not a database. PostgreSQL stores the product data. GraphQL can sit between clients and backend systems when the app needs flexible typed reads across multiple sources.

Yelp can use Python heavily because large companies are polyglot and can afford specialized services for backend, data, ML, and search. TasteApp should start simpler: TypeScript for mobile, web, and API; Python only later if AI/data complexity warrants it.

The Yelp-inspired infrastructure should be treated as a roadmap, not an MVP checklist. The immediate goal is to build a clean, monetizable, dish-first product foundation that can grow toward serious search, AI, data, and cloud infrastructure over time.
