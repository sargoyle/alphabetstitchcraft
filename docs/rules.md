# Project Rules & Decisions

This file is the single source of truth for all project-wide decisions. Update it immediately when any decision is made.

## How to use this file
- Every architecture choice, naming convention, or design pattern we agree on goes here
- Every business rule or constraint gets documented here
- If a decision overrides a previous one, update the entry (don't duplicate)
- Group entries by category for easy scanning

## Architecture
- Project documentation lives in markdown files under `/docs`; the app does not expose a routable Documentation Center.
- Every new app function or feature must have a corresponding function requirements page in `/docs/functions`.
- When an existing app function or feature is updated, its corresponding `/docs/functions` page must be updated and kept in line with the implementation.

## Naming Conventions
- Component names, file names, database columns and API routes should be documented here when project-wide naming decisions are made.

## Design Patterns
- `/design-system` is a live in-app development reference route that remains reachable by direct URL for browser review, but must be hidden before public go-live.
- New reusable visual patterns should prefer `src/design-system/tokens.ts` and components under `src/components/ui` before adding one-off styles.
- Reusable table/layout display primitives live under `src/components/layout`, use app-neutral naming and must not own rules, scoring, ordering or data mutation.
- Manage Fonts should have a more prominent contextual entry after removal from primary navigation.
- Remote font detail routes wait for loading before showing not-found.
- Primary navigation shows an active route indicator.
- Mini previews may use cell sizes below the generated pattern preview clamp.
- PNG export must honour grid visibility and stitch visibility settings.
- Grid rendering uses filled-square stitches for v1.
- Font Detail waits for remote font loading before showing a not-found state.
- Font Detail does not show licence or attribution metadata.
- Font Detail is browse/use only and does not show duplicate, edit or delete actions.
- Font Browser cards use `ABC 123` as the standard sample text.
- Font Browser sample previews include lowercase characters when the font supports lowercase.
- Font Browser sample previews avoid unsupported characters by choosing sample text each font supports.
- The app shell and primary content use the full available viewport width rather than a centered fixed-width container.
- Primary navigation uses user-goal labels: Home, Alphabet Library, Create Pattern and Font Editor.
- Homepage CTAs use Create Lettering and Browse Alphabets; homepage action cards use Browse Alphabets, Create Lettering and Edit Fonts.
- Blank font creation is shared through `src/lib/fontFactory.ts` so Font Library and Manage Fonts create identical starter alphabets.

## Business Logic
- Unsupported tab characters are treated as unsupported characters, not spaces.
- Very large generated patterns scroll rather than auto-fit.
- Generator settings remain browser-local for now, but future cross-browser settings sync must be database-backed.
- Out-of-range spacing values are rejected with an inline message, not silently clamped.
- Spacing number fields correct invalid input immediately while typing.
- Current spacing ranges remain in place until user need says otherwise: letter spacing `0-8`, word spacing `1-16`, line spacing `0-12`, zoom `8-34`.
- Whitespace-only text is treated as empty by the text renderer.
- Text renderer enforces numeric bounds independently of the UI.
- Trailing spaces contribute to rendered pattern width.
- Unsupported text characters render as visible placeholders and repeated unsupported characters are reported with counts.
- Text rendering falls back from lowercase to uppercase when lowercase is unsupported.
- Deleted default fonts should use shared persistence, not browser-only localStorage.
- Browser-local generator preferences are acceptable and should not be synced to Supabase.
- Future admin login should control who can create/edit/rename/delete fonts while preserving general browse/generator access.
- Fonts page Create New Font should allow category and height selection before creation.
- Fonts page search only needs to cover font name and description.
- Fonts page may expose create/edit/rename/delete actions for now because no admin/login permission layer exists yet.
- Font Detail hides height metadata.
- Invalid remote fonts must be shown as errors needing attention, not silently skipped.
- Font categories should be user-editable.
- Font `defaultHeight` is a baseline/display value, not a strict height for every character.
- Font character keys are single characters in v1.
- New editor characters require a destination mapping before save and protect existing mappings unless replacement is explicitly confirmed.
- PNG export uses a fixed export cell size for v1.
- PNG export preview zoom does not control PNG cell size in v1 because the fixed export cell size is confirmed.
- PNG export must honour preview visibility settings.
- PNG export does not include title, stitch dimensions or font name metadata for now; additional print values are a future feature decision.
- v1 should avoid storing sensitive personal data because the tool is for lettering patterns, not private records.
- JSON export remains a utility feature and JSON import is not part of v1.
- Font JSON export remains useful as a developer/designer utility even though PNG is the primary visual export.
- No maximum text input length is enforced for v1.
- No maximum generated grid width or height is enforced for v1.
- A clear local data/reset button is not required now.
- Custom font names should be globally unique in the shared database.
- Public database font editing remains allowed, but the system must be hardened for safe public use.
- Public font hardening uses validation, edit history or backups, restore tools and simple abuse monitoring.
- Public shared font updates, restores and deletes create database-backed backup snapshots in `custom_font_backups` before replacing or removing the current font.
- Default/shared fonts with non-UUID IDs update existing `default_fonts` rows; custom/shared fonts with UUID IDs save through `custom_fonts`.
- Duplicate-name checks for font saves ignore the record currently being edited and reject only different shared font records with the same name.
- Font slug IDs such as `tiny-serif-7x9` must never be passed into UUID database fields or UUID query filters.
- Default/shared font slug deletes are blocked in the app unless a future `default_fonts` delete policy is intentionally added.

## Integrations
- Third-party services, API keys and webhook configurations should be documented here when integration decisions are made.
- CSP and security headers should be configured immediately.
- External fonts and scripts do not need to remain blocked unless explicitly approved.
- Analytics requires a later product/security decision before implementation.

Keep entries concise. One line per decision when possible.





















