# Delivery Workflow

## Repository

- Canonical host: GitHub, `khoidle11/TasteApp`.
- Default branch: `main`.
- Delivery model: pull-request based work from short-lived feature branches.

## Branch Protection

Configure `main` in GitHub branch rulesets or branch protection with:

- Require a pull request before merging.
- Require at least one approving review before merge once more than one regular contributor is active.
- Require branches to be up to date before merging.
- Require status checks to pass before merging.
- Block force pushes and branch deletion.
- Require conversation resolution before merging.

## Required Status Checks

The required GitHub Actions check for `main` is:

- `Install, lint, typecheck, test, and build`

That job runs:

- `pnpm install --frozen-lockfile`
- If `prisma/schema.prisma` exists, `pnpm run db:generate`
- If `prisma/schema.prisma` exists, `pnpm run db:migrate:deploy` against disposable PostgreSQL
- `pnpm run format:check`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`

Local contributors should run `pnpm run check` before opening a pull request.

## Database Migrations

TasteApp uses code-first Prisma migrations. New migrations are created locally with `prisma migrate dev --name <name>` and committed for review with the Prisma schema changes.

CI verifies committed migrations against a disposable PostgreSQL database before tests run. CD applies committed migrations with `prisma migrate deploy` before application rollout. Normal CI/CD workflows must not run destructive or interactive Prisma commands such as `prisma migrate dev`, `prisma migrate reset`, or `prisma studio`.

## Local Setup

1. Install Node.js 24 LTS or newer.
2. Enable Corepack: `corepack enable`.
3. Install dependencies: `pnpm install`.
4. Run the full local gate: `pnpm run check`.

## Local App Commands

- Start local PostgreSQL services: `docker compose up -d`.
- Stop local PostgreSQL services: `docker compose down`.
- Start the API shell: `pnpm --filter @tasteapp/api dev`.
- Start the web shell: `pnpm --filter @tasteapp/web dev`.
- Start the mobile shell: `pnpm --filter @tasteapp/mobile dev`.

Connection string examples live in `.env.example`.
