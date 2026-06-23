# Add GraphQL guardrails early

TasteApp will use GraphQL from early development, so the API must include guardrails before the schema grows: cursor pagination for lists, query depth and complexity limits, authorization at resolver/use-case boundaries, and batching/data-loader patterns to avoid N+1 database queries. These controls keep the graph-shaped API useful without letting flexible client queries become a performance or security hazard.
