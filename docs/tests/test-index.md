# Alphabet Stitch Test Index

## Purpose

This index maps confirmed functional requirements to current automated tests, pending tests and known gaps. The first testing goal is visibility: identify what currently works, what is broken and what needs product confirmation.

## Current Automated Test Coverage

| Functional area | Source requirements | Automated test file | Coverage status | Notes |
|---|---|---|---|---|
| Text rendering | `/docs/functions/render-text-to-grid.md` | `tests/renderTextToGrid.test.ts`, `tests/renderVisibility.test.ts` | Partial | Covers single word, spaces, multiline, alignment, lowercase fallback, trailing spaces, unsupported skip behaviour, empty text, whitespace-only text, unsupported counts, renderer numeric bounds, large-pattern warnings and row consistency. |
| Alignment | `/docs/functions/alignment-rules.md` | `tests/renderTextToGrid.test.ts`, `tests/renderVisibility.test.ts` | Partial | Covered through renderer integration. Stitched-content preservation is covered by `GRID-003`. Odd centre-padding rule still needs a direct regression once implementation is updated to the confirmed rule. |
| Font data model | `/docs/functions/font-data-model.md` | `tests/fontData.test.ts` | Partial | Covers default font validity, unique IDs, single-character keys, complete punctuation coverage and blank font shape. Remote invalid font reporting still needs integration coverage. |
| Character/grid utilities | `/docs/functions/character-grid.md`, `/docs/functions/font-data-model.md` | `tests/gridUtils.test.ts` | Partial | Covers validation, clear, resize, set and toggle helpers. UI keyboard navigation and read-only non-button cells have source-level coverage; browser/component interaction coverage is still recommended. |
| Character editor UI | `/docs/functions/character-editor.md` | `tests/editorUiSource.test.ts` | Partial | Source-level guard covers the editor sidebar tiles, new-character dialog, danger zone, dimension panel and footer action row. Visual/browser interaction still needs manual or browser coverage. |
| Font refresh stability | `/docs/functions/font-data-model.md`, `/docs/functions/character-editor.md` | `tests/fontRefreshSource.test.ts`, `tests/editorUiSource.test.ts`, `tests/fontPersistence.test.ts` | Partial | Source-level guard covers avoiding saved-font clearing during refresh, keeping the just-saved font in state, non-destructive custom character upserts, and editor protection against stale refreshes with fewer created characters. Browser timing still needs manual verification. |
| Local storage | `/docs/functions/local-storage.md` | `tests/localStorageUtils.test.ts` | Partial | Covers missing/corrupt storage fallback, custom fonts, deleted IDs and generator settings. Database persistence is out of this utility test scope. |
| Export | `/docs/functions/export-png.md`, `/docs/functions/export-pdf.md`, `/docs/functions/export-json.md` | `tests/exportUtils.test.ts` | Partial | Covers canvas sizing, grid drawing on/off, filled drawing on/off, PNG trigger, PDF planning/download payload, JSON utility payload parity, safe empty export utilities, source coverage that Create Pattern no longer shows Export JSON or Copy size. Full visual browser parity remains manual. |

## Pending Automated Test Areas

| Functional area | Requirement source | Pending test | Reason pending |
|---|---|---|---|
| Centre alignment odd padding | `/docs/functions/alignment-rules.md` | Odd remaining width puts extra blank column on the confirmed side. | Current implementation behaviour needs correction before locking final expectation. |
| Character grid accessibility | `/docs/functions/character-grid.md`, `/docs/functions/accessibility.md` | Browser interaction checks for arrow-key cell navigation and read-only non-interactive cells. | Source-level coverage exists; browser-level interaction coverage remains useful before release. |
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

## Font Editor UX Coverage

- `EDITOR-UI-017`: Duplicate source tiles do not apply a duplicated draft until confirmed.
- `EDITOR-UI-018`: Unsaved character edits expose a Save & Continue, Discard Changes and Cancel dialog.
- `EDITOR-UI-019`: Character selection, font selection and internal navigation are guarded when the current character has unsaved edits.
- `EDITOR-UI-020`: CharacterEditor exposes dirty state plus save/discard actions to the editor shell.
- `EDITOR-UI-021`: Character save feedback uses a floating auto-dismiss notification that does not move layout.

Related plan: `docs/tests/editor-ui.test-plan.md`.

## Font Editor Regression Coverage

- `EDITOR-UI-022`: Blank punctuation and other not-created character drafts remain stable while edited.
- `EDITOR-UI-023`: Font settings saves preserve the current character and route through the unsaved-change guard.
- `EDITOR-UI-017`: Duplicate source selection applies the chosen source directly to the current draft.
- `EDITOR-UI-021`: Floating save notification is positioned away from the Save Character button.

## Generator Missing Pattern Warning Coverage

- Blank/uncreated character grids are now covered as unsupported pattern input in `tests/renderTextToGrid.test.ts`.

## Font Category Management Coverage

- `FONT-BROWSER-007`: Create New Font uses an in-app form with category, new-category and height controls.
- `EDITOR-UI-027`: Font Editor allows choosing, creating and saving font categories.
- `EDITOR-UI-028`: Character saves use the latest local font state and ignore stale refresh data with fewer created characters.
- `fontPersistence.test.ts`: Custom font characters are upserted by `font_id,character_key` rather than deleted and reinserted as a batch.
- `fontPersistence.test.ts`: Shared/default slug deletes route to `default_fonts`; UUID custom font deletes route to `custom_fonts`.

## 2026-07-14 Default Width and Alphabet Detail Coverage

- FONT-DETAIL-001: Alphabet detail hides uncreated/blank starter characters and shows an empty state when none are created.
- EDITOR-UI-029: Font settings allow temporary blank dimension inputs but block saving without valid height/default width.
- FONT-PERSISTENCE-001: Remote persistence loads and saves default_width with a height fallback.
- fontData.test.ts: Blank fonts created with default width use that width for starter grids.
- migrationScripts.test.ts: Supabase migration adds and backfills default_width on font tables.

## 2026-07-19 Create Font Save Feedback Coverage

- FONT-BROWSER-008: Create Font modal shows Creating... and in-modal failure feedback, including the current save error via `getLastSaveError()`.
- FONT-PERSISTENCE-002: Missing default_width schema errors are converted to a clear migration message using Supabase message/details/hint text.


## 2026-07-19 Character Save Refresh Stability Coverage

- FONT-REFRESH-002: Successful saves keep the just-saved font in local state before and after remote refresh.
- EDITOR-UI-030: Character/font saves preserve the saved font after refresh so stale remote data cannot blank the editor grid.

## 2026-07-19 Default Width Draft Coverage

- EDITOR-UI-031: Uncreated character drafts use font default width and ignore old blank placeholder widths.

## 2026-07-19 Duplicated Character Persistence Coverage

- FONT-PERSISTENCE-003: Remote custom fonts persist only filled character designs and rebuild blank starter characters on load, so duplicated characters remain after browser refresh.

## 2026-07-19 Custom Character Save Verification Coverage

- FONT-PERSISTENCE-004: Character saves verify Supabase persisted filled character rows before reporting success.
- MIGRATION-CHARACTER-PERSISTENCE-001: The Supabase repair migration restores public/shared custom character row persistence.

## 2026-07-20 Focused Active Character Persistence Coverage

- FONT-PERSISTENCE-006: Character saves have a narrow single-character persistence path.
- EDITOR-UI-033: Font Editor saves the active character through that narrow database write after the font save succeeds.

