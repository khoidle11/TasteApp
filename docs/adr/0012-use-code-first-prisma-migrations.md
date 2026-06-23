# Use code-first Prisma migrations

TasteApp will use a code-first Prisma schema and migration workflow because it is a greenfield TypeScript product with DDD-oriented application code. The database remains authoritative for persisted state, but schema evolution starts from reviewed code changes and migrations rather than manual database-first edits.
