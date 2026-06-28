# Use a typed API for MVP and defer GraphQL

TasteApp will use a TypeScript-first typed API for the MVP, favoring tRPC or typed REST with Zod validation schemas and explicit page/use-case DTOs. GraphQL is deferred until multi-client data composition becomes valuable enough to justify resolver, caching, authorization, code generation, and query-complexity overhead.

This decision fits the project's AI-dev-driven workflow. TypeScript inference, explicit schemas, and page-specific response shapes give AI agents compiler feedback and reduce hidden contract drift. The product is still graph-shaped, but the MVP risk is domain clarity around RestaurantDish identity, ranking truth, verification state, review integrity, check-ins, and trending signals, not the ability to request nested JSON.

REST-style route handlers remain appropriate for public/simple endpoints such as health checks, webhooks, auth callbacks, file upload signing, public SEO data, and any future non-TypeScript consumers. All API transports should call bounded-context application services rather than owning product behavior.
