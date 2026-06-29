# Use pnpm workspaces for monorepo tooling

TasteApp currently uses `pnpm-workspace.yaml` for workspace layout and root `package.json` scripts for linting, typechecking, testing, and builds. Because the repository has no Turborepo configuration and `.github/workflows/ci.yml` runs those root scripts directly, the current monorepo tooling baseline is pnpm workspaces without Turborepo. Domain modularity should primarily live inside API bounded contexts rather than exploding every domain concept into a separate package.
