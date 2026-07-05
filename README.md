# TasteApp

TasteApp is a dish-first food review app. The product is designed to help people find the best place for a specific dish, while downplaying non-food signals such as service, ambiance, brand popularity, and general restaurant sentiment unless the user explicitly chooses to factor them in.

The project started from the TasteDB class-project domain idea, but this repo is a fresh product and architecture direction for a monetizable mobile and web app.

## App Overview

TasteApp is for people who choose where to eat based on the dish they are craving. Instead of asking users to trust a restaurant-wide rating, TasteApp centers the experience around canonical dishes, restaurant-specific menu items, dish reviews, and dish-quality rankings.

The long-term vision is a consumer food discovery platform that can answer questions like:

- "Where is the best tonkotsu ramen near me?"
- "Which place has the crispiest fried chicken within 10 miles?"
- "What is the best value birria taco nearby?"
- "Where can my friend and I get great pizza and fried chicken at the same place?"
- "Plan a three-stop dumpling crawl."

The MVP should stay narrower: search dishes, review dishes, rank restaurant-specific dishes, match a small selected list of dishes to places that serve all of them well, and preserve trust in the ranking model.

## Product Direction

TasteApp ranks `RestaurantDish` entries: a specific restaurant/location's version of a canonical dish. For example, instead of ranking "best restaurant," TasteApp should answer questions like:

- Where is the best tonkotsu ramen near me?
- Which location serves the best crispy chicken sandwich?
- What is the best value birria taco within 10 miles?
- Where can two people get both strong pizza and strong fried chicken without hiding either dish's rank?

Default rankings are food-quality-first. Distance, service, ambiance, convenience, and other experience factors can be filters or optional modes, but they should not silently override food quality.

## Product Philosophy

- Food quality is the default truth.
- Restaurants are not ranked as monoliths; specific dishes at specific locations earn their own reputation.
- Service, ambiance, convenience, and popularity can matter, but they should be explicit user-controlled factors.
- Core ranking truth should stay free. Premium features should improve discovery, not hide the basic answer.
- Community contribution should feel rewarding, not bureaucratic.
- Trust and moderation should protect useful criticism without letting restaurants control rankings.
- AI should improve discovery, verification, and summaries over time, but it should not replace the domain model.

## MVP Scope

The first usable MVP should include:

- Account creation and login.
- Creation flows for Restaurants, Locations, Canonical Dishes, Menu Items, and RestaurantDishes.
- Dish Review creation with structured food-quality inputs.
- Canonical Dish search.
- RestaurantDish ranking pages.
- Group Dish Match for two or more selected Canonical Dishes, using explicit dish-quality rankings rather than open-ended AI recommendations.
- Distance filters and list-first results with distance labels.
- Emerging labels for low-sample rankings.
- Basic report and moderation flows.
- Docker-based local development.
- API integration tests against a real test database.

Not in MVP: open-ended AI recommendations, profile badges, photo upload, premium subscriptions, claimed restaurant tools, Food Crawl planning, repeat-visit review layers, map-heavy UI, dedicated search infrastructure, Kubernetes, and analytics warehouse workflows.

## Tech Stack

Planned MVP stack:

- **Monorepo:** pnpm workspaces + Turborepo
- **Mobile:** Expo React Native + TypeScript
- **Web:** Next.js + TypeScript
- **API:** TypeScript API layer, favoring tRPC or typed REST for MVP
- **API contracts:** Zod validation schemas plus TypeScript DTOs/view models
- **Auth:** Clerk with email code plus Google/Apple login
- **Database:** PostgreSQL
- **ORM/migrations:** Prisma with code-first migrations
- **Local development:** Docker Compose
- **Infrastructure:** AWS CDK with TypeScript for the first AWS deployment
- **Initial AWS services:** RDS Postgres and S3
- **Testing:** API integration tests against a real test database, plus context/domain tests

Planned later stack additions:

- GraphQL only if multi-client data composition becomes valuable enough to justify resolver, caching, auth, and query-complexity overhead
- S3 signed uploads for review photos
- Dedicated search service evaluation, including Lucene/Nrtsearch-style indexing
- AI services for query understanding, review highlights, canonicalization, and recommendations
- Athena/Glue/Redshift-style analytics workflows
- Kubernetes/EKS only if scale or service operations justify it
- Swift/SwiftUI for later iOS-native enhancements if product traction justifies it

## Architecture Direction

TasteApp is planned as a TypeScript-first monorepo:

- `apps/mobile`: Expo React Native mobile app.
- `apps/web`: Next.js web app.
- `apps/api`: TypeScript backend exposing typed REST or tRPC-style use-case endpoints for MVP.
- `packages/shared`: shared contracts and primitives when genuinely cross-context.
- `infra`: AWS CDK infrastructure when the first AWS deployment is needed.

Key decisions:

- Use pnpm workspaces and Turborepo.
- Use DDD bounded contexts for backend modularity.
- Use PostgreSQL with code-first Prisma migrations.
- Keep business logic in TypeScript, not stored procedures.
- Use Clerk for MVP authentication.
- Defer GraphQL for MVP unless a concrete screen/client need proves it is worth the agent-execution and operational complexity.
- Keep the API transport replaceable by putting product behavior in application services, not handlers, routers, or resolvers.
- Use Docker Compose for local development.
- Use AWS CDK for the first AWS deployment.

## Engineering Philosophy

- Prefer domain-driven design over table-driven or route-driven architecture.
- Organize backend behavior around bounded contexts: Identity, Catalog, Reviews, Discovery, Moderation, and Monetization.
- Keep API handlers, tRPC procedures, REST handlers, and any future GraphQL resolvers thin. They should call application use cases, not own business logic.
- Keep business logic in TypeScript code, not database stored procedures.
- Treat Prisma as persistence infrastructure, not the domain model.
- Use encapsulation and polymorphism where they clarify domain behavior; prefer composition over inheritance unless a real domain hierarchy emerges.
- Avoid generic `Manager` classes. Prefer precise names such as use cases, policies, rankers, detectors, repositories, and adapters.
- Add operational complexity only when the product needs it. Docker belongs in MVP; Kubernetes does not.
- Preserve testability at the bounded-context/application-service level.

## Documentation

- [PRD and product plan](./plan.md)
- [Domain glossary](./CONTEXT.md)
- [Architecture Decision Records](./docs/adr)
- [Legal policy scaffolds](./docs/legal)
- [Delivery workflow](./docs/delivery/workflow.md)
- [Agent and developer setup notes](./AGENTS.md)

## Local Development

Prerequisites:

- Node.js 20 or newer
- Corepack enabled. If `corepack enable` cannot write to `/usr/local/bin`, use `corepack enable --install-directory ~/.local/bin`.
- pnpm 9. This repo pins pnpm through `packageManager` in `package.json`.

Setup:

```bash
cd /Users/Khoi/Documents/TasteApp2
pnpm install
pnpm run check
```

Useful commands:

- `pnpm run lint`: run ESLint.
- `pnpm run typecheck`: run TypeScript without emitting files.
- `pnpm run format`: format the repo with Prettier.
- `pnpm run format:check`: verify formatting.
- `pnpm run test`: run Vitest.
- `pnpm run build`: compile TypeScript.
- `pnpm run check`: run the full local quality gate.

App commands:

- `pnpm --filter @tasteapp/api dev`: build and start the API shell on `127.0.0.1:4000`.
- `pnpm --filter @tasteapp/web dev`: start the Next.js web shell.
- `pnpm --filter @tasteapp/mobile dev`: start the Expo mobile shell.
- `pnpm --filter @tasteapp/contracts test`: run shared contract tests.

## Environments and Deployment

TasteApp is still in repository and MVP foundation setup. These instructions describe the intended workflow and should be expanded as the API, web, mobile, Docker Compose, Prisma, and AWS CDK packages are introduced.

### Local

Use local development for day-to-day coding and pre-PR checks.

```bash
cd /Users/Khoi/Documents/TasteApp2
pnpm install
pnpm run check
```

Run app shells:

```bash
pnpm --filter @tasteapp/api dev
pnpm --filter @tasteapp/web dev
pnpm --filter @tasteapp/mobile dev
```

Start local PostgreSQL services:

```bash
docker compose up -d
```

This starts:

- `postgres`: development database on `localhost:5432`
- `postgres-test`: test database on `localhost:5433`

Connection string examples live in [.env.example](./.env.example).

Stop local PostgreSQL services:

```bash
docker compose down
```

When Prisma is added, local migration creation should happen from a feature branch:

```bash
pnpm run db:migrate -- --name <migration-name>
pnpm run db:generate
```

Local development is the only place where new migrations should be created. Do not create migrations in CI or production.

### Development

The development workflow is pull-request based:

1. Create a short-lived branch for the Linear issue.
2. Install dependencies with `pnpm install`.
3. Run `pnpm run check` locally before opening a PR.
4. Open a PR into `main`.
5. Let GitHub Actions run install, lint, typecheck, test, and build.

When Prisma is added, PR CI should also generate Prisma Client and apply committed migrations against a disposable PostgreSQL test database. CI should verify migrations, not create them.

### Production

Production deployment is not implemented yet. The planned production direction is AWS-first:

- AWS CDK with TypeScript for infrastructure.
- RDS PostgreSQL for the application database.
- S3 for media, data exports, and later object storage needs.
- Deployment from reviewed changes merged through `main`.

When production deployment exists, the pipeline should:

1. Install dependencies with a frozen lockfile.
2. Run the same quality gate used in CI.
3. Build deployable app artifacts.
4. Apply committed database migrations with `prisma migrate deploy`.
5. Deploy the API, web app, and supporting infrastructure.

Production should not run `prisma migrate dev`, `prisma migrate reset`, or `prisma studio`.

## Delivery Workflow

`main` is the default branch. Work should land through pull requests with the CI job `Install, lint, typecheck, test, and build` required before merge. Branch protection and required status checks are documented in [Delivery workflow](./docs/delivery/workflow.md).

## Software Leads

- Khoi Le
- Kelley Le
- Danny Lam

## Status

This repo is currently in product and architecture planning. Implementation should begin after the MVP boundaries and core domain model are stable.

## Linear Project Links

https://linear.app/khoile11/project/tasteapp-phase-1-mvp-5978d94f4bbf/overview
https://linear.app/khoile11/project/tasteapp-mvp-frontend-experience-d9cd4eb9290d/overview
