# TasteApp Agent Notes

## Project Shape

TasteApp is a TypeScript-first pnpm workspace. Keep product language aligned with `CONTEXT.md` and keep durable architecture decisions in `docs/adr/`.

## AI-Driven Development Lens

TasteApp is AI-dev driven. When evaluating complexity, consider what is hard for AI agents to execute reliably and what is hard for Khoi to prompt clearly, not only what is hard for a human engineer to understand.

- Prefer explicit types, Zod validation schemas, narrow service boundaries, page-specific view models, concrete tests, and issue-sized vertical slices.
- Avoid hidden framework magic, speculative abstractions, scattered business logic, and tools that force agents to infer too much global context.
- When asked whether something is hard, distinguish AI execution complexity, human prompt complexity, domain complexity, and accidental tool/framework complexity.
- Keep product behavior in domain/application services so API transport choices such as REST, tRPC, or future GraphQL stay replaceable.

## Agent Behavior

These rules bias toward caution over speed. For trivial tasks, use judgment.

- Think before coding: state assumptions, surface tradeoffs, ask when unclear, and push back when a simpler approach fits better.
- Simplicity first: write the minimum code that solves the request; avoid speculative features, single-use abstractions, unrequested configurability, and impossible-case error handling.
- Surgical changes: touch only what the task requires, match existing style, clean up only unused code introduced by your changes, and mention unrelated dead code instead of deleting it.
- Goal-driven execution: turn tasks into verifiable success criteria, use a short plan for multi-step work, and loop until checks or tests prove the change.

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
- For Linear work, confirm the GitHub integration is connected for the repo, use branch names formatted as `feat-TST-123-short-title`, include the issue ID in PR titles, and include both the full Linear issue URL and a magic-word reference in the PR description. Use `Related to <issue ID>` or `Refs <issue ID>` to link without closing; use `Fixes`, `Closes`, or `Resolves` only when merge should complete the issue. For TST-34, use `https://linear.app/khoile11/issue/TST-34/create-claudemdagentmd` and `Related to TST-34`.
- Pull request descriptions should include `Summary`, `What I changed`, `Test Plan`, `Edge Cases Considered`, and a 4-5 item SWE checklist covering scope, domain language, ADR impact, validation, and user-facing risks.
- Do not add app, API, or infrastructure frameworks without recording or updating the relevant ADR.
- Prefer vertical slices that keep domain behavior testable at bounded-context or application-service boundaries.
