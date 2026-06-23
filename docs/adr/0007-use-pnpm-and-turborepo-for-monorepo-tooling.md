# Use pnpm and Turborepo for monorepo tooling

TasteApp will use pnpm workspaces and Turborepo for package management, task orchestration, and caching. Domain modularity should primarily live inside API bounded contexts rather than exploding every domain concept into a separate package.
