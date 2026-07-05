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
- `TASTEAPP_RUN_DB_INTEGRATION_TESTS=1 pnpm --filter @tasteapp/api test`
- `pnpm run build`

Local contributors should run `pnpm run check` before opening a pull request.

## Security And Dependency Guardrails

TasteApp starts security and dependency scanning as low-noise advisory guardrails.
The goal is to catch risky packages, leaked secrets, and suspicious dependency
changes early without turning every early PR into a security-firefighting
exercise.

Dependabot covers npm/pnpm workspace dependencies and GitHub Actions
dependencies. Patch and minor npm updates are grouped into a weekly PR, GitHub
Actions updates are grouped separately, and major version updates remain
separate PRs because they are more likely to require human review.

The `Dependency Review` workflow runs on pull requests and fails visibly when a
PR introduces high or critical dependency vulnerabilities in runtime or
development dependencies. It is intentionally not a required status check yet.
Treat failures as actionable review signals, but keep merge blocking limited to
the required CI check until the scanner has proven reliable for this repo.

Repository settings should enable GitHub secret scanning and push protection
where available. Server-only secrets belong behind backend-owned boundaries and
must not be committed to the repo, placed in client app environment files, or
exposed through web/mobile bundles. Secret scanning alerts should be investigated
as credential incidents even when the matching secret is later rotated.

CodeQL is deferred until TasteApp has enough stable backend/API surface for the
findings to be useful. Add it as a required or advisory workflow only after the
team can tune false positives and document the expected response behavior.

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
- CodeQL should wait until the backend/API surface is stable enough to produce
  useful findings without excessive false positives.
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

CI verifies committed migrations against a disposable PostgreSQL database before tests run, then runs the narrow API database integration tests against that migrated schema. CD applies committed migrations with `prisma migrate deploy` before application rollout. Normal CI/CD workflows must not run destructive or interactive Prisma commands such as `prisma migrate dev`, `prisma migrate reset`, or `prisma studio`.

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
