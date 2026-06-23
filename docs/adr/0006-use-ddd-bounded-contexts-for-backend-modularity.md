# Use DDD bounded contexts for backend modularity

TasteApp will organize backend code around domain-driven bounded contexts rather than database tables, HTTP routes, or framework folders. The initial contexts are Identity, Catalog, Reviews, Discovery, Moderation, and Monetization so the product can grow without turning dish ranking, review integrity, auth, and premium features into one tangled application model.
