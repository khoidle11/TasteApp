# ADR 0020: Start Security Scanning as Advisory Guardrails

## Status

Accepted

## Context

TasteApp is built by AI-assisted agents in a young TypeScript monorepo, so dependency, secret, and source scanning should catch risky changes early without creating enough noise that contributors ignore or bypass it.

## Decision

Start security and dependency scanning as low-noise advisory guardrails. Dependabot should cover npm/pnpm packages and GitHub Actions, dependency review should run on pull requests for high and critical vulnerability introductions, and GitHub-native secret scanning expectations should be documented. These checks should not become required merge gates until their signal is reliable enough for normal PR work.

## Consequences

- High and critical dependency vulnerabilities are the first must-fix signal.
- Moderate and low findings remain review inputs until the repo has enough history to tune them confidently.
- CodeQL is deferred until the backend/API surface is stable enough for useful findings.
- Required status checks stay limited to the main CI gate unless a later ADR or delivery update promotes a security check to blocking.
