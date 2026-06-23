# ADR 0017: Use GitHub as the Canonical Repository Host

## Status

Accepted

## Context

TasteApp needs one clear source repository and delivery workflow before implementation begins. The project already uses GitHub as the remote host at `khoidle11/TasteApp`, and the immediate workflow needs pull requests, branch protection, required CI checks, and simple contributor onboarding.

GitLab could provide a comparable issue, CI, and repository platform, but adding it now would create duplicate repository administration before the product needs GitLab-specific features.

## Decision

Use GitHub as the canonical repository host for TasteApp.

Defer GitLab unless a future need appears, such as organization-wide GitLab standardization, GitLab-specific CI/CD features, customer requirements, or a compliance workflow that GitHub cannot satisfy cleanly.

## Consequences

- GitHub `main` is the protected default branch.
- GitHub Actions is the baseline CI system.
- Required merge checks are documented in `docs/delivery/workflow.md`.
- GitLab mirrors, pipelines, and merge workflows are intentionally out of scope for the MVP setup.
