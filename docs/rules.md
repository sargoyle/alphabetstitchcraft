# Project Rules & Decisions

This file is the single source of truth for all project-wide decisions. Update it immediately when any decision is made.

## How to use this file
- Every architecture choice, naming convention, or design pattern we agree on goes here
- Every business rule or constraint gets documented here
- If a decision overrides a previous one, update the entry (don't duplicate)
- Group entries by category for easy scanning

## Architecture
- The app exposes a public `/docs` documentation center using Next.js App Router pages with shared content in `src/lib/documentation.ts`.

## Naming Conventions
- Component names, file names, database columns and API routes should be documented here when project-wide naming decisions are made.

## Design Patterns
- Documentation pages use the existing dark aura design tokens, sticky sidebar navigation and reusable table/card/code-block styles in `globals.css`.

## Business Logic
- Validation rules, access control decisions, feature flags and pricing logic should be documented here when project-wide business decisions are made.

## Integrations
- Third-party services, API keys and webhook configurations should be documented here when integration decisions are made.

Keep entries concise. One line per decision when possible.
