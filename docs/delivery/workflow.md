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
- `pnpm run format:check`
- `pnpm run lint`
- `pnpm run typecheck`
- `pnpm run test`
- `pnpm run build`

Local contributors should run `pnpm run check` before opening a pull request.

## Local Setup

1. Install Node.js 20 or newer.
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
