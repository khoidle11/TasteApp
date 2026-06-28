# Use thin API transport adapters

TasteApp will keep API transport adapters thin, whether the MVP uses tRPC procedures, typed REST route handlers, or a future GraphQL layer. API adapters should validate input, enforce request-level authorization, call domain-focused application use cases, map results to client-facing DTOs, and return. Ranking, review integrity, verification, AI recommendation, and moderation rules should live in bounded-context application services rather than HTTP handlers, tRPC procedures, REST route handlers, or GraphQL resolvers.
