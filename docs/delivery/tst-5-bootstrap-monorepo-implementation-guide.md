# TST-5 Bootstrap Monorepo Implementation Guide

Linear issue: https://linear.app/khoile11/issue/TST-5/bootstrap-tasteapp-monorepo

## Goal

Bootstrap the first runnable TasteApp monorepo so a fresh checkout can install dependencies, start local databases, run API/web/mobile shells, and pass CI-ready lint, typecheck, test, and build scripts.

Keep this slice infrastructure-focused. Do not implement real product flows, domain services, authentication, Prisma models, ranking logic, or review behavior in TST-5.

## Existing Decisions To Respect

- Use pnpm workspaces and Turborepo for monorepo tooling. See `docs/adr/0007-use-pnpm-and-turborepo-for-monorepo-tooling.md`.
- Keep domain modularity inside API bounded contexts instead of creating a package for every domain concept.
- Use Docker Compose for local PostgreSQL development.
- Keep API transport replaceable. TST-5 can expose a health path, but product behavior should not live in route handlers later.
- Use shared packages for contracts and tooling only when they are genuinely shared across API, web, and mobile.

No new ADR is needed for this issue unless implementation changes one of those decisions.

## Suggested Workspace Shape

Create the smallest structure that satisfies the issue:

```text
apps/
  api/
  mobile/
  web/
packages/
  contracts/
  tsconfig/
infra/
docker-compose.yml
turbo.json
```

Use exact package names consistently, for example:

- `@tasteapp/api`
- `@tasteapp/web`
- `@tasteapp/mobile`
- `@tasteapp/contracts`
- `@tasteapp/tsconfig`

## Implementation Steps

1. Add Turborepo

- Add `turbo` as a root dev dependency.
- Add `turbo.json` with tasks for `build`, `lint`, `typecheck`, `test`, and `dev`.
- Update root scripts so CI commands fan out through Turbo where useful:
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run check`

2. Add shared TypeScript config package

- Create `packages/tsconfig` for reusable TypeScript config files.
- Keep configs explicit and boring: base, node, react/web, and react-native/mobile only if each app actually needs them.
- Avoid putting domain types or runtime helpers in this package.

3. Add contracts package

- Create `packages/contracts` for shared DTOs and Zod schemas.
- For TST-5, keep it to a health contract such as:
  - `HealthResponseSchema`
  - `HealthResponse`
- Do not add Restaurant, Dish Review, RestaurantDish, ranking, or user-submission contracts yet.

4. Add API shell

- Create `apps/api` as a TypeScript service with a basic HTTP server.
- Add a health endpoint, preferably `GET /health`, returning the shared health contract.
- Keep the implementation dependency-light. Fastify or a similarly small HTTP framework is acceptable; avoid adding a full application framework for this bootstrap slice.
- Include a smoke test for the health handler or server route.

5. Add web shell

- Create `apps/web` as a minimal Next.js TypeScript app.
- Add a page that can render a basic TasteApp health/smoke state.
- If it calls the API, keep the call optional or configurable so `pnpm run check` does not require long-running dev servers.

6. Add mobile shell

- Create `apps/mobile` as a minimal Expo TypeScript app.
- Add a simple screen that renders the same health/smoke state.
- Keep native configuration minimal; this issue only needs a runnable shell.

7. Add Docker Compose

- Add Docker Compose for two PostgreSQL services or two databases:
  - development database
  - test database
- Prefer clear names such as `tasteapp_dev` and `tasteapp_test`.
- Add documented connection strings in `.env.example`.
- Do not add Prisma migrations in this issue unless the implementation needs a tiny connectivity check. TST-5 is about bootstrapping the workspace, not modeling product data.

8. Add CI-ready scripts

- Ensure these pass from a fresh checkout after `pnpm install`:
  - `pnpm run format:check`
  - `pnpm run lint`
  - `pnpm run typecheck`
  - `pnpm run test`
  - `pnpm run build`
  - `pnpm run check`
- Keep tests fast and deterministic. Unit/smoke tests should not require Docker unless the script name clearly says it does.

9. Update docs

- Update `README.md` with:
  - prerequisites
  - install command
  - Docker Compose command
  - app dev commands
  - check/test commands
- Update `docs/delivery/workflow.md` only if the required CI commands change.

## Acceptance Criteria Mapping

Fresh checkout can install dependencies and run workspace scripts:

- `pnpm install --frozen-lockfile`
- `pnpm run check`

Docker Compose starts PostgreSQL and a separate test database:

- `docker compose up -d`
- Confirm both dev and test databases are reachable.
- `docker compose down` should cleanly stop the services.

API, web, and mobile app shells exist and can run a basic health/smoke path:

- API exposes `GET /health`.
- Web renders a basic smoke page.
- Mobile renders a basic smoke screen.
- Each app has a package-level `dev` script.

Shared TypeScript tooling is configured without forcing domain logic into a shared package:

- Shared config lives in `packages/tsconfig`.
- Shared runtime contract package contains only the health contract for now.
- No domain model, ranking, review, or catalog behavior appears in shared packages.

CI-ready scripts exist for linting, type checking, and tests:

- Root scripts run the whole workspace.
- App/package scripts are compatible with Turbo.
- `pnpm run check` remains the local pre-PR gate.

## Implementation Guardrails

- Do not solve future issues inside this one.
- Do not add Clerk, Prisma schema models, API auth, AWS CDK, search, analytics, or real domain workflows.
- Do not create a generic `packages/shared` dumping ground. Prefer `packages/contracts` and `packages/tsconfig` with narrow responsibilities.
- Do not make Docker required for lint, typecheck, or build.
- Do not hide failures behind permissive scripts. CI scripts should fail loudly.

## Suggested PR Checklist

- Scope stays limited to monorepo bootstrapping and smoke paths.
- Package names, scripts, and docs match each other.
- Docker Compose includes both development and test PostgreSQL targets.
- Shared packages contain contracts/tooling only, not domain behavior.
- `pnpm run check` passes locally.
- README explains how to install, run checks, start databases, and launch each app shell.
