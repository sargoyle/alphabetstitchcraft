# Alphabet Stitch Test Index

## Purpose

This index maps confirmed functional requirements to current automated tests, pending tests and known gaps. The first testing goal is visibility: identify what currently works, what is broken and what needs product confirmation.

## Current Automated Test Coverage

| Functional area | Source requirements | Automated test file | Coverage status | Notes |
|---|---|---|---|---|
| Text rendering | `/docs/functions/render-text-to-grid.md` | `tests/renderTextToGrid.test.ts`, `tests/renderVisibility.test.ts` | Partial | Covers single word, spaces, multiline, alignment, lowercase fallback, trailing spaces, unsupported placeholder, empty text, whitespace-only text, unsupported counts, renderer numeric bounds, large-pattern warnings and row consistency. |
| Alignment | `/docs/functions/alignment-rules.md` | `tests/renderTextToGrid.test.ts`, `tests/renderVisibility.test.ts` | Partial | Covered through renderer integration. Stitched-content preservation is covered by `GRID-003`. Odd centre-padding rule still needs a direct regression once implementation is updated to the confirmed rule. |
| Font data model | `/docs/functions/font-data-model.md` | `tests/fontData.test.ts` | Partial | Covers default font validity, unique IDs, single-character keys and blank font shape. Remote invalid font reporting still needs integration coverage. |
| Character/grid utilities | `/docs/functions/character-grid.md`, `/docs/functions/font-data-model.md` | `tests/gridUtils.test.ts` | Partial | Covers validation, clear, resize, set and toggle helpers. UI keyboard navigation and read-only non-button cells need browser/component tests. |
| Character editor UI | `/docs/functions/character-editor.md` | `tests/editorUiSource.test.ts` | Partial | Source-level guard covers the editor sidebar tiles, new-character dialog, danger zone, dimension panel and footer action row. Visual/browser interaction still needs manual or browser coverage. |
| Local storage | `/docs/functions/local-storage.md` | `tests/localStorageUtils.test.ts` | Partial | Covers missing/corrupt storage fallback, custom fonts, deleted IDs and generator settings. Database persistence is out of this utility test scope. |
| Export | `/docs/functions/export-png.md`, `/docs/functions/export-json.md` | `tests/exportUtils.test.ts` | Partial | Covers canvas sizing, grid drawing on/off, filled drawing on/off, PNG trigger, JSON payload parity, safe empty export utilities and copy size. Full visual browser parity remains manual. |

## Pending Automated Test Areas

| Functional area | Requirement source | Pending test | Reason pending |
|---|---|---|---|
| Centre alignment odd padding | `/docs/functions/alignment-rules.md` | Odd remaining width puts extra blank column on the confirmed side. | Current implementation behaviour needs correction before locking final expectation. |
| Character grid accessibility | `/docs/functions/character-grid.md`, `/docs/functions/accessibility.md` | Arrow-key cell navigation and read-only non-interactive cells. | Requires component/browser-level testing. |
| Remote font validation warnings | `/docs/functions/font-data-model.md`, `/docs/functions/error-handling.md` | Invalid remote fonts are surfaced as attention-needed errors. | Requires mocked Supabase or integration test setup. |
| Design system route | `/docs/functions/design-system.md` | `/design-system` renders and remains directly reachable in development. | Requires route/browser test setup. |
| Keep-alive endpoint | `/docs/functions/keep-alive-endpoint.md` | `/api/keep-alive` returns ok or safe error response. | Endpoint implementation status needs review before testing. |

## Manual Review Areas For Now

- Font Library create/edit/rename/delete workflows.
- Character editor layout against the uploaded mockup, including new-character modal usability.
- Responsive layout and text clipping.
- `/design-system` visual review.
- Public security hardening controls.

## Automation Roadmap

1. Keep expanding pure utility tests for renderer, validation, factory and export utilities.
2. Add component tests or browser tests for grid interaction, accessibility and navigation.
3. Add API tests for keep-alive once endpoint implementation is confirmed.
4. Add Supabase mocking or test fixtures for remote font persistence and invalid font reporting.
5. Add visual/browser checks for `/design-system`, Fonts and Generator pages.
