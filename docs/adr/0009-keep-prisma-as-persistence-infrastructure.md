# Keep Prisma as persistence infrastructure

TasteApp will use Prisma for migrations and typed PostgreSQL access, but Prisma models should not become the domain model. Domain rules belong in bounded-context application and domain modules, while Prisma remains an infrastructure adapter for loading and saving state.
