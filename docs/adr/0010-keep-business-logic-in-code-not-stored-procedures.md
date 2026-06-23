# Keep business logic in code, not stored procedures

TasteApp will keep ranking, verification, moderation, entitlement, and review-integrity logic in the TypeScript codebase rather than database stored procedures. PostgreSQL should enforce persistence and integrity constraints, while bounded-context application and domain modules own business decisions so the behavior remains readable, testable, and portable.
