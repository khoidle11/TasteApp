# Version legal policies in the repository

## Status

Accepted

## Context

TasteApp depends on user-generated content: Dish Reviews, future Review Photos, Reports, and Catalog Contributions for Restaurants, Locations, Canonical Dishes, Menu Items, and RestaurantDishes. These surfaces need clear legal and trust rules before public launch.

The project is AI-dev driven, so legal/product boundaries should be explicit and locally discoverable. If legal policy lives only in a website CMS, a private document, or an external vendor tool, agents and contributors may implement upload, review, moderation, or reporting behavior without seeing the policy constraints.

## Decision

Keep draft legal policy sources in `docs/legal/` and version them through pull requests.

These files are scaffolds, not legal advice or launch-ready public terms. Final public policies must be reviewed and approved by qualified counsel before launch. Product pages can later render approved versions or link to approved published copies, but the repo remains the durable source for engineering-facing legal requirements.

## Consequences

- User-generated content work can reference legal policy scaffolds during design and implementation.
- Policy changes receive code review and history like other product requirements.
- Legal acceptance tracking should store accepted policy versions, not just a boolean.
- DMCA, content moderation, review integrity, privacy, and Terms of Service requirements can be connected to domain models and application services.
- The team must still involve counsel before public launch; repo ownership does not make draft policy text legally sufficient.
