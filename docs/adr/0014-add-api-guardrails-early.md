# Add API guardrails early

TasteApp will add API guardrails early, even while the MVP uses tRPC or typed REST instead of GraphQL. List endpoints/procedures should use explicit pagination or limits, request inputs should be validated with Zod schemas, authorization should happen at the handler/procedure and use-case boundaries, and page/use-case DTOs should avoid exposing persistence models directly.

These controls keep the API predictable for AI agents and prevent page-specific data needs from leaking into domain models. If GraphQL is introduced later, add GraphQL-specific guardrails before the schema grows: cursor pagination for lists, query depth and complexity limits, resolver/use-case authorization checks, and batching/data-loader patterns to avoid N+1 database queries.
