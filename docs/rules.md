# Project Rules & Decisions

This file is the single source of truth for all project-wide decisions. Update it immediately when any decision is made.

## How to use this file
- Every architecture choice, naming convention, or design pattern we agree on goes here
- Every business rule or constraint gets documented here
- If a decision overrides a previous one, update the entry (don't duplicate)
- Group entries by category for easy scanning

## Architecture
- Project documentation lives in markdown files under `/docs`; the app does not expose a routable Documentation Center.

## Naming Conventions
- Component names, file names, database columns and API routes should be documented here when project-wide naming decisions are made.

## Design Patterns
- The app shell and primary content use the full available viewport width rather than a centered fixed-width container.
- Primary navigation is intentionally minimal: Home, Fonts and Generator; editing and font management are reached through contextual actions.
- Blank font creation is shared through `src/lib/fontFactory.ts` so Font Library and Manage Fonts create identical starter alphabets.

## Business Logic
- New editor characters require a destination mapping before save and protect existing mappings unless replacement is explicitly confirmed.

## Integrations
- Third-party services, API keys and webhook configurations should be documented here when integration decisions are made.

Keep entries concise. One line per decision when possible.
