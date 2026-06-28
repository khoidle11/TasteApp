# TasteApp Agent Notes

## Project Shape

TasteApp is a TypeScript-first pnpm workspace. Keep product language aligned with `CONTEXT.md` and keep durable architecture decisions in `docs/adr/`.

## Local Commands

- `pnpm install`: install workspace dependencies.
- `pnpm run lint`: run ESLint.
- `pnpm run typecheck`: run TypeScript without emitting files.
- `pnpm run format`: format the repo with Prettier.
- `pnpm run format:check`: verify formatting in CI.
- `pnpm run test`: run Vitest.
- `pnpm run build`: compile TypeScript.
- `pnpm run check`: run formatting, lint, typecheck, tests, and build.

## Delivery Rules

- Work from short-lived branches and merge through pull requests into `main`.
- Keep `main` deployable and protected by the required CI status checks documented in `docs/delivery/workflow.md`.
- For Linear work, confirm the GitHub integration is connected for the repo, include the issue ID in branch names and PR titles, and include both the full Linear issue URL and a magic-word reference in the PR description. Use `Related to <issue ID>` or `Refs <issue ID>` to link without closing; use `Fixes`, `Closes`, or `Resolves` only when merge should complete the issue. For TST-34, use `https://linear.app/khoile11/issue/TST-34/create-claudemdagentmd` and `Related to TST-34`.
- Pull request descriptions should include `Summary`, `What I changed`, `Test Plan`, `Edge Cases Considered`, and a 4-5 item SWE checklist covering scope, domain language, ADR impact, validation, and user-facing risks.
- Do not add app, API, or infrastructure frameworks without recording or updating the relevant ADR.
- Prefer vertical slices that keep domain behavior testable at bounded-context or application-service boundaries.
