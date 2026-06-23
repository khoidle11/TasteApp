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

Application-specific setup, Docker Compose services, and environment variables should be added as the monorepo packages are introduced.
