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

The `Deploy` workflow is intentionally not a required status check. It is a
visible manual placeholder until a real production rollout target exists, so it
is allowed to fail with its placeholder message.

## Deferred Workflows

TasteApp should add deployment and release workflows only when the matching
product or infrastructure surface exists:

- Production deploys should replace the current placeholder after the first real
  hosting target is chosen. While infrastructure is young, production promotion
  should stay manually triggered from `main` after CI has passed.
- Web preview deploys should wait for real `apps/web` pages and a chosen hosting
  target. Preview deploys must not use production secrets or apply production
  database migrations.
- Mobile EAS builds should wait until the Expo app has enough product surface to
  justify recurring iOS and Android build cost.
- Security and dependency scanning should start as a low-noise smoke alarm for
  risky packages, leaked secrets, and suspicious code patterns. Early scanning
  may be advisory before it becomes a required PR gate.
- Optional Prisma drift checking belongs outside the baseline CI check unless
  schema and migration drift becomes a repeated risk.
- Release tagging and changelog automation should wait until TasteApp has real
  deployable releases.

Automatic production deploys can cost money whenever they build or run paid
hosting, database, build-minute, preview, or observability resources. The first
production workflow should therefore be manual by default, then reconsider
automatic deploys once cost and rollback behavior are understood.

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
