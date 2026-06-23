# Use Fastify with thin GraphQL and REST adapters

TasteApp will use Fastify for the API framework, with GraphQL resolvers and REST route handlers acting as thin adapters around domain-focused application use cases. Controllers and resolvers are not obsolete, but fat adapters are a design smell; ranking, review integrity, verification, AI recommendation, and moderation rules should live in bounded-context application services rather than HTTP or GraphQL handlers.
