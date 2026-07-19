# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- 2026-07-12: Replaced browser-side shared/default font archive updates with a controlled `archive_default_font` Supabase RPC and migration coverage. Files affected: `supabase/migrations/202607120001_archive_default_font_rpc.sql`, `src/lib/fontPersistence.ts`, `tests/migrationScripts.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/font-library.md`, `docs/tasks.md`.
- 2026-07-11: Added an approved column-level update grant so the browser client can archive shared/default fonts by changing only `default_fonts.is_public`. Files affected: `supabase/migrations/202607110003_grant_default_font_archive_update.sql`, `src/lib/fontPersistence.ts`, `tests/migrationScripts.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/font-library.md`, `docs/tasks.md`.
- 2026-07-11: Added an approved Supabase archive policy migration so shared/default fonts can be hidden with `is_public = false` without granting physical delete access. Files affected: `supabase/migrations/202607110002_allow_default_font_archive.sql`, `tests/migrationScripts.test.ts`, `docs/tasks.md`.
- 2026-07-09: Added font category selection and custom category creation to Font Library and Font Editor, plus shared category definitions; routed shared/default font deletes toward `default_fonts` pending required Supabase delete-policy approval. Files affected: `src/app/fonts/page.tsx`, `src/app/editor/EditorClient.tsx`, `src/lib/fontCategories.ts`, `src/lib/fontFactory.ts`, `src/lib/fontPersistence.ts`, `src/lib/useFonts.ts`, `src/lib/fontTypes.ts`, `src/app/globals.css`, `tests/fontBrowserSource.test.ts`, `tests/editorUiSource.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-library.md`, `docs/functions/font-data-model.md`, `docs/functions/character-editor.md`, `docs/tasks.md`.
- 2026-07-09: Added print-ready PDF export planning and download support, improved PNG export with dimensions and grid grouping, and hardened Create Pattern loading so saved settings hydrate before preview render. Files affected: `src/app/generator/page.tsx`, `src/components/ExportControls.tsx`, `src/lib/exportUtils.ts`, `tests/exportUtils.test.ts`, `tests/renderVisibility.test.ts`, `tests/accessibilitySource.test.ts`, `docs/functions/export-pdf.md`, `docs/functions/export-png.md`, `docs/functions/text-generator.md`, `docs/tests/export-pdf.test-plan.md`, `docs/tests/export-png.test-plan.md`, `docs/tests/test-index.md`, `docs/tasks.md`.
- 2026-07-07: Added browser favicon assets from the supplied needle-and-thread artwork and registered app icon metadata. Files affected: `src/app/favicon.ico`, `src/app/favicon-16x16.png`, `src/app/favicon-32x32.png`, `src/app/icon.png`, `src/app/apple-icon.png`, `src/app/layout.tsx`, `docs/tasks.md`.
- 2026-07-01: Added a follow-up Supabase cleanup migration for `Block Needle 5x7` display-name variants such as `Block Needle 5 x 7`, including self-contained backup-table creation when needed. Files affected: `supabase/migrations/202607010004_cleanup_block_needle_name_variants.sql`, `tests/migrationScripts.test.ts`, `docs/database.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`.
- 2026-07-01: Added a repeatable Supabase cleanup migration for duplicate `Block Needle 5x7` shared font records, including backup snapshots for accidental custom duplicates before deletion. Files affected: `supabase/migrations/202607010003_cleanup_duplicate_block_needle.sql`, `tests/migrationScripts.test.ts`, `tests/runTests.ts`, `docs/database.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`.
- 2026-07-01: Added a Supabase migration that allows the current public editing model to update existing default font rows. Files affected: `supabase/migrations/202607010002_public_default_fonts_update.sql`, `docs/database.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`.
- 2026-07-01: Added an idempotent Supabase seed migration to restore bundled default font records in `default_fonts`. Files affected: `supabase/migrations/202607010001_seed_default_fonts.sql`, `docs/database.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`.
- 2026-07-01: Added public `/api/keep-alive` Supabase endpoint using a read-only count query. Files affected: `src/app/api/keep-alive/route.ts`, `docs/functions/keep-alive-endpoint.md`, `docs/tasks.md`.
- 2026-06-09: Added public custom font backup storage and restore controls for baseline shared-library hardening. Files affected: `supabase/migrations/202606090001_public_font_backups.sql`, `src/lib/fontPersistence.ts`, `src/lib/useFonts.ts`, `src/app/custom-fonts/page.tsx`, `src/app/globals.css`, `src/lib/databaseTypes.ts`, `docs/functions/security.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`.
- 2026-06-05: Added renderer and grid visibility tests for confirmed known gaps, plus render/grid test plans and updated run results. Files affected: `tests/renderVisibility.test.ts`, `tests/runTests.ts`, `tests/exportUtils.test.ts`, `docs/tests/*`, `docs/functions/render-text-to-grid.md`, `docs/functions/unsupported-characters.md`, `docs/functions/export-png.md`, `docs/tasks/known-gaps-defects.md`, `docs/tasks.md`.
- 2026-06-05: Added test planning documentation and expanded automated utility coverage for grid utilities and font data contracts. Files affected: `docs/tests/*`, `tests/gridUtils.test.ts`, `tests/fontData.test.ts`, `tests/runTests.ts`, `docs/tasks.md`.
- 2026-06-05: Added a live in-app design system route with reusable UI tokens, base components, table/game display primitives and matching function documentation. Files affected: `src/app/design-system/page.tsx`, `src/design-system/*`, `src/components/ui/*`, `src/components/game/*`, `src/app/globals.css`, `docs/functions/design-system.md`, `docs/tasks.md`, `docs/rules.md`.
- 2026-06-04: Added functional requirements for a public Supabase keep-alive endpoint. Files affected: `docs/functions/keep-alive-endpoint.md`.
- 2026-06-04: Added central known gaps and defects backlog generated from function documentation. Files affected: `docs/tasks/known-gaps-defects.md`.
- 2026-05-04: Initial project setup. Files affected: `src/*`, `docs/*`, `package.json`, `supabase/migrations/*`.
- 2026-05-04: Added an in-app Documentation Center with routable pages for overview, architecture, components, data flow, API and dependencies. Files affected: `src/app/docs/*`, `src/lib/documentation.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `docs/tasks.md`, `docs/rules.md`.
- 2026-05-04: Added JSON export for fonts on the Manage Fonts page and shared JSON export helpers. Files affected: `src/app/custom-fonts/page.tsx`, `src/components/ExportControls.tsx`, `src/lib/exportUtils.ts`, `src/lib/documentation.ts`, `docs/tasks.md`.
- 2026-05-04: Added utility tests for localStorage fallback handling and export behavior, and updated the test runner to execute all utility tests. Files affected: `tests/localStorageUtils.test.ts`, `tests/exportUtils.test.ts`, `tests/runTests.ts`, `package.json`, `docs/tasks.md`.
- 2026-05-04: Added planned tasks for duplicating an existing letter into a new mapped character. Files affected: `docs/tasks.md`.
- 2026-05-04: Added editor support for duplicating an existing letter or starting blank, mapping it to a new character, and protecting existing mappings from accidental overwrite. Files affected: `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/app/globals.css`, `docs/tasks.md`, `docs/rules.md`.
- 2026-05-13: Added Create New Font and Edit actions to the Font Library using the shared blank-font factory. Files affected: `src/app/fonts/page.tsx`, `src/components/FontCard.tsx`, `src/app/custom-fonts/page.tsx`, `src/lib/fontFactory.ts`, `docs/tasks.md`.

### Changed
- 2026-07-11: Fixed shared/default font archive-delete false failures by pre-checking the public row before archive update and avoiding post-archive select reads that RLS can hide. Files affected: src/lib/fontPersistence.ts, 	ests/fontPersistence.test.ts, docs/functions/font-data-model.md, docs/functions/font-library.md, docs/tasks.md, docs/tests/test-run-results.md.
- 2026-07-08: Removed the visible Export JSON button from Create Pattern export controls while keeping Download PNG and Download Print PDF. Files affected: `src/components/ExportControls.tsx`, `tests/accessibilitySource.test.ts`, `docs/functions/export-json.md`, `docs/tests/export-json.test-plan.md`, `docs/tests/export-png.test-plan.md`, `docs/tests/test-index.md`, `docs/tasks.md`.






- 2026-07-08: Fixed pattern rendering so missing lowercase characters are skipped and warned instead of silently rendering as uppercase replacements. Files affected: `src/lib/renderTextToGrid.ts`, `tests/renderVisibility.test.ts`, `docs/functions/render-text-to-grid.md`, `docs/functions/unsupported-characters.md`, `docs/tests/render-text-to-grid.test-plan.md`, `docs/tasks.md`.
- 2026-07-08: Added immediate pending feedback to Save Character, including `Saving...`, `aria-busy`, and repeat-click prevention while the save is pending. Files affected: `src/components/CharacterEditor.tsx`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tests/editor-ui.test-plan.md`, `docs/tasks.md`.
- 2026-07-08: Added a Create Pattern loading state to prevent stale fallback font previews flashing before database fonts resolve. Files affected: `src/app/generator/page.tsx`, `tests/renderVisibility.test.ts`, `docs/functions/text-generator.md`, `docs/tasks.md`.
- 2026-07-08: Added an Alphabet Library loading state to prevent stale default font cards flashing before database fonts resolve. Files affected: `src/app/fonts/page.tsx`, `tests/fontBrowserSource.test.ts`, `docs/functions/font-browser.md`, `docs/tasks.md`.
- 2026-07-08: Removed the centre guide line from the homepage lettering preview while preserving Create Pattern guide behaviour. Files affected: `src/app/page.tsx`, `docs/tasks.md`.
- 2026-07-08: Completed a data, documentation and validation housekeeping pass; refreshed persistence wording, removed obsolete renderer placeholder option, aligned unsupported-character documentation and updated known-gaps tracking for newer function docs. Files affected: `src/lib/fontTypes.ts`, `src/lib/renderTextToGrid.ts`, `docs/masterplan.md`, `docs/rules.md`, `docs/functions/render-text-to-grid.md`, `docs/functions/unsupported-characters.md`, `docs/functions/security.md`, `docs/functions/font-browser.md`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`, `docs/tests/test-run-results.md`.
- 2026-07-08: Added versioned favicon URLs so browsers refresh cached tab icons. Files affected: `src/app/layout.tsx`, `docs/tasks.md`.
- 2026-07-08: Improved Alphabet Library card previews with adaptive supported sample text and shrink-wrapped mini preview paper. Files affected: `src/components/FontGridPreview.tsx`, `src/lib/fontPreviewSample.ts`, `src/app/globals.css`, `tests/fontBrowserSource.test.ts`, `tests/runTests.ts`, `docs/functions/font-browser.md`, `docs/tasks.md`.
- 2026-07-07: Updated Stitch Library previews, punctuation coverage and unsupported-character handling so library cards hide centre guides, default/blank fonts include common printable punctuation, and unsupported pattern text is skipped with one warning instead of placeholder graphics. Files affected: `src/components/TextPatternPreview.tsx`, `src/components/FontGridPreview.tsx`, `src/app/generator/page.tsx`, `src/app/editor/EditorClient.tsx`, `src/lib/renderTextToGrid.ts`, `src/lib/fontFactory.ts`, `src/lib/characterSets.ts`, `src/data/fonts.json`, `supabase/migrations/202607070001_add_default_punctuation_characters.sql`, `tests/*`, `docs/functions/*`, `docs/tests/*`, `docs/tasks.md`.
- 2026-07-05: Recorded a browser-level accessibility pass and cleaned the Accessibility functional requirements document after confirming rendered-route, header, keyboard, live-region and tooling findings. Files affected: `docs/functions/accessibility.md`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`, `docs/tests/test-run-results.md`.
- 2026-07-05: Recorded a full efficiency, accessibility and security validation pass, including lint, TypeScript, utility tests, production build, dependency audit, source security scans and runtime smoke checks. Files affected: `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-05: Cleaned the remaining lint warnings by removing unused code, replacing unsupported `aria-disabled` usage, and stabilising hook dependencies. Files affected: `scripts/generate-fonts.mjs`, `src/app/editor/EditorClient.tsx`, `src/components/layout/DisplayCard.tsx`, `src/lib/renderTextToGrid.ts`, `src/lib/useFonts.ts`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-05: Updated dependency security baseline by moving Next.js and `eslint-config-next` to `16.2.10`, updating Supabase to `2.110.0`, adding pnpm security overrides, and replacing obsolete `next lint` with ESLint 9 flat config. Files affected: `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `eslint.config.mjs`, `docs/tasks.md`, `docs/functions/security.md`, `docs/tests/test-run-results.md`.
- 2026-07-05: Added visible centre guide lines to generated pattern previews and PNG exports so stitchers can identify the exact pattern midpoint. Files affected: `src/components/TextPatternPreview.tsx`, `src/lib/exportUtils.ts`, `src/app/globals.css`, `tests/renderVisibility.test.ts`, `tests/exportUtils.test.ts`, `docs/functions/grid-rendering.md`, `docs/functions/export-png.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-04: Moved the Font Editor Width control directly under the selected letter grid and compacted the Home page preview, workflow cards and footer spacing for laptop viewports. Files affected: `src/components/CharacterEditor.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `tests/homepageLayoutSource.test.ts`, `tests/runTests.ts`, `docs/functions/character-editor.md`, `docs/functions/navigation-and-routing.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-03: Widened the Font Editor Character panel, restored seven desktop character columns and removed the desktop character-picker scrollbar where the standard alphabet set fits. Files affected: `src/app/globals.css`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-03: Updated the Font Editor to a compact three-panel layout with separate Font, Character and Character editor panels, clearer full-font delete copy, and tighter selected-character controls. Files affected: `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-02: Updated Font Editor so font name and font height are editable at the font level, removed per-character height editing, resized all characters when font height changes, and enforced font-level character heights in validation. Files affected: `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/lib/gridUtils.ts`, `src/data/fonts.json`, `src/app/globals.css`, `tests/fontData.test.ts`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-02: Fixed Font Editor not-created detection so blank starter-grid characters in brand-new fonts show as Not Created until they contain filled stitches. Files affected: `src/app/editor/EditorClient.tsx`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-01: Corrected Font Editor character tile states so selected is filled, exists is a solid outline and not-created is a different-colour dashed outline; stabilised font refreshes so the editor no longer flashes to older or different font versions while loading or saving. Files affected: `src/app/editor/EditorClient.tsx`, `src/lib/useFonts.ts`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `tests/fontRefreshSource.test.ts`, `tests/runTests.ts`, `docs/functions/character-editor.md`, `docs/functions/font-data-model.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-01: Updated the Font Editor picker to show A-Z, a-z, 0-9 and other characters with exists/not-created/selected states, changed New Character to Select Duplicate with tile-based source selection, and moved Width/Height controls below the character grid. Files affected: `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tasks.md`, `docs/tests/test-run-results.md`.
- 2026-07-01: Refined the Font Editor UI with sidebar character tiles, a condensed New Character modal, compact dimension controls beside the grid and a separated editor action footer. Files affected: `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `tests/runTests.ts`, `docs/functions/character-editor.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`, `docs/tasks.md`.
- 2026-07-01: Updated the homepage headline to say `Create beautiful cross-stitch lettering patterns in minutes.` Files affected: `src/app/page.tsx`, `docs/tasks.md`.
- 2026-07-01: Reduced the vertical spacing between the homepage How it works section and copyright footer. Files affected: `src/app/globals.css`, `docs/tasks.md`.
- 2026-07-01: Further compacted the homepage by removing the remaining hero CTA button and reducing header, hero and workflow spacing. Files affected: `src/app/page.tsx`, `src/app/globals.css`, `docs/tasks.md`.
- 2026-07-01: Refined the homepage by removing duplicated hero navigation, replacing action cards with a How it works section, tightening alignment and adding a copyright footer. Files affected: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `docs/tasks.md`.
- 2026-07-01: Updated the homepage Centred Lettering Preview to use Block Needle 5x7 with two blank stitch rows between text lines. Files affected: `src/app/page.tsx`, `docs/tasks.md`.
- 2026-07-01: Updated homepage messaging, CTA labels, action cards, hero preview text and primary navigation labels to use user-goal language. Files affected: `src/app/page.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `docs/functions/navigation-and-routing.md`, `docs/rules.md`, `docs/tasks.md`.
- 2026-06-05: Allowed `127.0.0.1` as a Next.js development origin so `/design-system` can be reviewed cleanly from the local browser URL. Files affected: `next.config.ts`.
- 2026-06-05: Cleaned design-system functional requirements so confirmed decisions are no longer listed under unclear or assumed rules. Files affected: `docs/functions/design-system.md`.
- 2026-06-05: Renamed design-system display primitives from game-oriented names to app-neutral layout names. Files affected: `src/components/layout/*`, `src/app/design-system/page.tsx`, `src/app/globals.css`, `src/design-system/*`, `docs/functions/design-system.md`, `docs/tasks.md`, `docs/rules.md`.
- 2026-06-05: Confirmed design-system route visibility and app-neutral component naming decisions, and added follow-up tasks for go-live hiding and component renaming. Files affected: `docs/functions/design-system.md`, `docs/tasks.md`, `docs/rules.md`.
- 2026-06-04: Added project rule requiring function documentation pages for new and updated app functions. Files affected: `docs/rules.md`.
- 2026-06-04: Added CSP/security headers and partial public font hardening for validation, duplicate-name prevention and invalid remote font warnings. Files affected: `next.config.ts`, `src/lib/fontPersistence.ts`, `src/lib/useFonts.ts`, `src/app/fonts/page.tsx`, `src/app/custom-fonts/page.tsx`, `docs/tasks.md`, `docs/functions/security.md`.
- 2026-06-04: Confirmed public font hardening controls as validation, edit history or backups, restore tools and simple abuse monitoring. Files affected: `docs/functions/security.md`, `docs/tasks.md`, `docs/rules.md`.
- 2026-06-04: Confirmed remaining Function documentation decisions for spacing ranges and font JSON export, and clarified public font security hardening options. Files affected: `docs/functions/security.md`, `docs/functions/spacing-controls.md`, `docs/functions/export-json.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Security Requirements decisions for public font editing, CSP/security headers, export scope, input/grid limits, unique font names, external scripts and future analytics review. Files affected: `docs/functions/security.md`, `docs/tasks.md`, `docs/rules.md`.
- 2026-06-04: Confirmed future Text Generator cross-browser settings sync should be database-backed. Files affected: `docs/functions/text-generator.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Navigation, Text Generator and Unsupported Characters decisions for Manage Fonts prominence, generator sync, scroll-only large patterns, placeholder behaviour, duplicate counts and tab handling. Files affected: `docs/functions/navigation-and-routing.md`, `docs/functions/text-generator.md`, `docs/functions/unsupported-characters.md`, `docs/rules.md`.
- 2026-06-04: Confirmed whitespace-only renderer behaviour and Spacing Controls numeric correction/rejection requirements. Files affected: `docs/functions/render-text-to-grid.md`, `docs/functions/spacing-controls.md`, `docs/rules.md`.
- 2026-06-04: Clarified Spacing Controls numeric input requirements and recommended validation/clamping before committing generator settings. Files affected: `docs/functions/spacing-controls.md`.
- 2026-06-04: Confirmed Local Storage, Navigation and text rendering rules for generator preferences, shared deleted fonts, active routing, remote loading, unsupported character counts, trailing spaces and renderer numeric bounds. Files affected: `docs/functions/local-storage.md`, `docs/functions/navigation-and-routing.md`, `docs/functions/render-text-to-grid.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Grid Rendering rules for filled-square v1 rendering, export visibility parity and smaller mini-preview cells. Files affected: `docs/functions/grid-rendering.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Font Detail and Font Library decisions for hidden detail height, Fonts page management actions, create-form fields and future admin permissions. Files affected: `docs/functions/font-detail-preview.md`, `docs/functions/font-library.md`, `docs/tasks.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Font Detail Preview rules for browse/use-only scope, hidden licence metadata and remote loading before not-found state. Files affected: `docs/functions/font-detail-preview.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Font Data Model rules for single-character keys, baseline default height, editable categories and invalid remote font error reporting. Files affected: `docs/functions/font-data-model.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Font Browser card previews should avoid unsupported sample characters. Files affected: `docs/functions/font-browser.md`, `docs/rules.md`.
- 2026-06-04: Confirmed Font Browser sample text requirements for standard `ABC 123` previews and lowercase samples when supported. Files affected: `docs/functions/font-browser.md`, `docs/rules.md`.
- 2026-06-04: Confirmed PNG preview zoom does not control fixed-size PNG export output in v1. Files affected: `docs/functions/export-png.md`, `docs/rules.md`.
- 2026-06-04: Confirmed PNG export requirements for fixed cell size, preview visibility parity and no metadata in v1. Files affected: `docs/functions/export-png.md`, `docs/rules.md`.
- 2026-05-04: Cleaned up documentation rules and changelog entries so they follow the agreed source-of-truth format. Files affected: `docs/rules.md`, `docs/changelog.md`, `docs/tasks.md`.
- 2026-05-04: Added lucide icons to useful action controls while keeping text labels for clarity. Files affected: `src/components/FontCard.tsx`, `src/components/ExportControls.tsx`, `src/components/CharacterEditor.tsx`, `src/app/custom-fonts/page.tsx`, `src/app/globals.css`, `docs/tasks.md`.
- 2026-05-04: Improved responsive layout behavior for mobile, tablet and desktop verification by tightening button wrapping, toolbar sizing, editor grid scrolling and docs table overflow. Files affected: `src/app/globals.css`, `docs/tasks.md`.
- 2026-05-04: Replaced the broad `.env*` ignore rule with explicit local environment file rules. Files affected: `.gitignore`, `docs/tasks.md`.
- 2026-05-13: Expanded the app shell and header to use the full available screen width instead of a centered fixed-width column. Files affected: `src/app/globals.css`, `docs/tasks.md`.
- 2026-05-13: Made the Font Library heading more compact and kept the Create New Font action on one row. Files affected: `src/app/fonts/page.tsx`, `src/app/globals.css`, `docs/tasks.md`.

### Fixed
- 2026-07-19: Fixed saved character grids being replaced by stale blank remote data immediately after a successful save. Files affected: `src/lib/useFonts.ts`, `tests/fontRefreshSource.test.ts`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`, `docs/tasks.md`.
- 2026-07-19: Fixed Create Font failure feedback so the modal shows the current Supabase save error instead of stale fallback text, and broadened save-error normalisation for Supabase details/hints. Files affected: `src/lib/useFonts.ts`, `src/app/fonts/page.tsx`, `src/lib/fontPersistence.ts`, `tests/fontBrowserSource.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-library.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`, `docs/tasks.md`.
- 2026-07-14: Fixed custom font character save data-loss risk by upserting character rows instead of deleting all rows before insert, and protected Font Editor saves from stale refresh state with fewer created characters. Files affected: `src/lib/fontPersistence.ts`, `src/app/editor/EditorClient.tsx`, `tests/fontPersistence.test.ts`, `tests/editorUiSource.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/character-editor.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`, `docs/tasks.md`.
- 2026-07-11: Fixed PDF dimension labels so they render in the visible stitch colour and changed shared/default font deletion to archive public rows with `is_public = false` instead of requiring a broad public delete policy. Files affected: `src/lib/exportUtils.ts`, `src/lib/fontPersistence.ts`, `tests/exportUtils.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/export-pdf.md`, `docs/functions/font-data-model.md`, `docs/functions/font-library.md`, `docs/tasks.md`.
- 2026-07-11: Fixed print PDF export rendering by using valid PDF colour values, updated PDF overlap so only continuation pages show repeated overlap cells, and removed the visible Copy size export button. Files affected: `src/lib/exportUtils.ts`, `src/components/ExportControls.tsx`, `tests/exportUtils.test.ts`, `tests/accessibilitySource.test.ts`, `docs/functions/export-pdf.md`, `docs/tests/export-pdf.test-plan.md`, `docs/tasks.md`.
- 2026-07-06: Fixed remaining accessibility backlog by adding arrow-key stitch-grid navigation, rendering read-only grid previews as non-interactive cells, and replacing remaining font action alerts with inline live status messages. Files affected: `src/components/CharacterGrid.tsx`, `src/app/fonts/page.tsx`, `src/app/custom-fonts/page.tsx`, `src/lib/useFonts.ts`, `src/app/globals.css`, `tests/accessibilitySource.test.ts`, `docs/functions/accessibility.md`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`, `docs/tests/test-run-results.md`.
- 2026-07-05: Fixed initial accessibility gaps by adding a Font Editor route heading, live-region semantics for editor/generator/export/font-sync status messages, source regression tests, and an axe-style tooling decision for go-live. Files affected: `src/app/editor/page.tsx`, `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/app/generator/page.tsx`, `src/components/ExportControls.tsx`, `src/app/custom-fonts/page.tsx`, `src/app/globals.css`, `tests/accessibilitySource.test.ts`, `tests/runTests.ts`, `docs/functions/accessibility.md`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`, `docs/tests/test-run-results.md`.
- 2026-07-01: Improved duplicate font-name errors so they identify whether the conflict is in `default_fonts` or `custom_fonts`. Files affected: `src/lib/fontPersistence.ts`, `docs/tasks.md`.
- 2026-07-01: Added inline font save confirmation after successful database saves and local editor failure status when saves fail. Files affected: `src/lib/useFonts.ts`, `src/components/CharacterEditor.tsx`, `src/app/editor/EditorClient.tsx`, `src/app/globals.css`, `docs/functions/character-editor.md`, `docs/rules.md`, `docs/tasks.md`.
- 2026-07-01: Fixed slug-versus-UUID font operations so default font slugs are not passed to UUID fields, custom font deletes target UUID records, and default/shared slug deletes are blocked with a clear message. Files affected: `src/lib/fontPersistence.ts`, `src/lib/useFonts.ts`, `tests/fontPersistence.test.ts`, `docs/database.md`, `docs/functions/font-data-model.md`, `docs/rules.md`, `docs/tasks.md`.
- 2026-07-01: Fixed font save routing so default/shared font edits update `default_fonts`, custom/shared font edits stay in `custom_fonts`, and duplicate-name checks ignore the current record. Files affected: `src/lib/fontPersistence.ts`, `src/lib/useFonts.ts`, `tests/fontPersistence.test.ts`, `tests/runTests.ts`, `docs/database.md`, `docs/functions/font-data-model.md`, `docs/rules.md`, `docs/tasks.md`.
- 2026-07-01: Added a clear custom-font save error when a referenced seeded default font is missing, avoiding opaque `custom_fonts_base_default_font_id_fkey` failures. Files affected: `src/lib/fontPersistence.ts`, `docs/functions/font-data-model.md`, `docs/tasks.md`.
- 2026-06-05: Fixed Generator preview/export parity for PNG visibility settings and added JSON/PNG export parity tests. Files affected: `src/lib/exportUtils.ts`, `src/components/ExportControls.tsx`, `src/app/generator/page.tsx`, `tests/exportUtils.test.ts`, `docs/functions/export-png.md`, `docs/functions/export-json.md`, `docs/functions/grid-rendering.md`, `docs/functions/text-generator.md`, `docs/tests/*`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`.
- 2026-06-05: Fixed confirmed renderer gaps for whitespace-only input, unsupported character counts, invalid spacing rejection and large-pattern warnings. Files affected: `src/lib/renderTextToGrid.ts`, `src/lib/fontTypes.ts`, `src/app/generator/page.tsx`, `tests/renderTextToGrid.test.ts`, `tests/renderVisibility.test.ts`, `docs/functions/render-text-to-grid.md`, `docs/functions/unsupported-characters.md`, `docs/tests/*`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`.
- 2026-05-04: Empty generator text now returns a true `0 x 0` rendered pattern instead of blank-height rows. Files affected: `src/lib/renderTextToGrid.ts`, `tests/renderTextToGrid.test.ts`.

### Removed
- 2026-05-13: Removed the in-app Documentation Center route and Docs navigation item while keeping markdown project docs in `/docs`. Files affected: `src/app/docs/*`, `src/lib/documentation.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `docs/tasks.md`, `docs/rules.md`.
- 2026-05-13: Removed Editor and Manage Fonts from the primary app navigation. Files affected: `src/app/layout.tsx`, `docs/tasks.md`.

---

**Format for new entries:**
- **Added** for new features
- **Changed** for changes in existing functionality
- **Fixed** for bug fixes
- **Removed** for removed features
- **Security** for security improvements

**Rules:**
- Add a new entry after every completed task or group of related tasks
- Include the date, a short description, and files affected
- This is a historical log — never edit or delete past entries
























## 2026-07-07 - Font Editor UX Improvements

### Added
- 2026-07-12: Replaced browser-side shared/default font archive updates with a controlled `archive_default_font` Supabase RPC and migration coverage. Files affected: `supabase/migrations/202607120001_archive_default_font_rpc.sql`, `src/lib/fontPersistence.ts`, `tests/migrationScripts.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/font-library.md`, `docs/tasks.md`.
- 2026-07-11: Added an approved column-level update grant so the browser client can archive shared/default fonts by changing only `default_fonts.is_public`. Files affected: `supabase/migrations/202607110003_grant_default_font_archive_update.sql`, `src/lib/fontPersistence.ts`, `tests/migrationScripts.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/font-library.md`, `docs/tasks.md`.
- 2026-07-11: Added an approved Supabase archive policy migration so shared/default fonts can be hidden with `is_public = false` without granting physical delete access. Files affected: `supabase/migrations/202607110002_allow_default_font_archive.sql`, `tests/migrationScripts.test.ts`, `docs/tasks.md`.
- 2026-07-09: Added font category selection and custom category creation to Font Library and Font Editor, plus shared category definitions; routed shared/default font deletes toward `default_fonts` pending required Supabase delete-policy approval. Files affected: `src/app/fonts/page.tsx`, `src/app/editor/EditorClient.tsx`, `src/lib/fontCategories.ts`, `src/lib/fontFactory.ts`, `src/lib/fontPersistence.ts`, `src/lib/useFonts.ts`, `src/lib/fontTypes.ts`, `src/app/globals.css`, `tests/fontBrowserSource.test.ts`, `tests/editorUiSource.test.ts`, `tests/fontPersistence.test.ts`, `docs/functions/font-library.md`, `docs/functions/font-data-model.md`, `docs/functions/character-editor.md`, `docs/tasks.md`.
- 2026-07-09: Added print-ready PDF export planning and download support, improved PNG export with dimensions and grid grouping, and hardened Create Pattern loading so saved settings hydrate before preview render. Files affected: `src/app/generator/page.tsx`, `src/components/ExportControls.tsx`, `src/lib/exportUtils.ts`, `tests/exportUtils.test.ts`, `tests/renderVisibility.test.ts`, `tests/accessibilitySource.test.ts`, `docs/functions/export-pdf.md`, `docs/functions/export-png.md`, `docs/functions/text-generator.md`, `docs/tests/export-pdf.test-plan.md`, `docs/tests/export-png.test-plan.md`, `docs/tests/test-index.md`, `docs/tasks.md`.
- Added an unsaved-character confirmation dialog for Font Editor character changes, font changes, duplicate setup and internal navigation. Files affected: `src/app/editor/EditorClient.tsx`, `src/components/CharacterEditor.tsx`, `src/app/globals.css`.
- Added Font Editor UX source coverage and test planning. Files affected: `tests/editorUiSource.test.ts`, `docs/tests/editor-ui.test-plan.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`.

### Changed
- 2026-07-11: Fixed shared/default font archive-delete false failures by pre-checking the public row before archive update and avoiding post-archive select reads that RLS can hide. Files affected: src/lib/fontPersistence.ts, 	ests/fontPersistence.test.ts, docs/functions/font-data-model.md, docs/functions/font-library.md, docs/tasks.md, docs/tests/test-run-results.md.






- 2026-07-08: Fixed pattern rendering so missing lowercase characters are skipped and warned instead of silently rendering as uppercase replacements. Files affected: `src/lib/renderTextToGrid.ts`, `tests/renderVisibility.test.ts`, `docs/functions/render-text-to-grid.md`, `docs/functions/unsupported-characters.md`, `docs/tests/render-text-to-grid.test-plan.md`, `docs/tasks.md`.
- 2026-07-08: Added immediate pending feedback to Save Character, including `Saving...`, `aria-busy`, and repeat-click prevention while the save is pending. Files affected: `src/components/CharacterEditor.tsx`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tests/editor-ui.test-plan.md`, `docs/tasks.md`.
- 2026-07-08: Updated Select Duplicate so source characters use the same order as the main picker and only characters with existing stitch designs are selectable. Files affected: `src/app/editor/EditorClient.tsx`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `docs/functions/character-editor.md`, `docs/tests/editor-ui.test-plan.md`, `docs/tasks.md`.
- 2026-07-08: Stabilised duplicate-created character saving so the editor no longer flashes to the duplicated source or shows a transient existing-character warning, and improved native dropdown option contrast. Files affected: `src/app/editor/EditorClient.tsx`, `src/app/globals.css`, `tests/editorUiSource.test.ts`, `tests/accessibilitySource.test.ts`, `docs/functions/character-editor.md`, `docs/functions/accessibility.md`, `docs/tasks.md`.
- 2026-07-08: Added a Create Pattern loading state to prevent stale fallback font previews flashing before database fonts resolve. Files affected: `src/app/generator/page.tsx`, `tests/renderVisibility.test.ts`, `docs/functions/text-generator.md`, `docs/tasks.md`.
- 2026-07-08: Added an Alphabet Library loading state to prevent stale default font cards flashing before database fonts resolve. Files affected: `src/app/fonts/page.tsx`, `tests/fontBrowserSource.test.ts`, `docs/functions/font-browser.md`, `docs/tasks.md`.
- 2026-07-08: Removed the centre guide line from the homepage lettering preview while preserving Create Pattern guide behaviour. Files affected: `src/app/page.tsx`, `docs/tasks.md`.
- 2026-07-08: Completed a data, documentation and validation housekeeping pass; refreshed persistence wording, removed obsolete renderer placeholder option, aligned unsupported-character documentation and updated known-gaps tracking for newer function docs. Files affected: `src/lib/fontTypes.ts`, `src/lib/renderTextToGrid.ts`, `docs/masterplan.md`, `docs/rules.md`, `docs/functions/render-text-to-grid.md`, `docs/functions/unsupported-characters.md`, `docs/functions/security.md`, `docs/functions/font-browser.md`, `docs/tasks.md`, `docs/tasks/known-gaps-defects.md`, `docs/tests/test-run-results.md`.
- 2026-07-08: Added versioned favicon URLs so browsers refresh cached tab icons. Files affected: `src/app/layout.tsx`, `docs/tasks.md`.
- 2026-07-08: Improved Alphabet Library card previews with adaptive supported sample text and shrink-wrapped mini preview paper. Files affected: `src/components/FontGridPreview.tsx`, `src/lib/fontPreviewSample.ts`, `src/app/globals.css`, `tests/fontBrowserSource.test.ts`, `tests/runTests.ts`, `docs/functions/font-browser.md`, `docs/tasks.md`.
- Removed the character-width information panel from the Font Editor and moved character save feedback into a floating auto-dismiss notification. Files affected: `src/components/CharacterEditor.tsx`, `src/app/globals.css`.
- Deferred duplicate-source draft application until the user confirms the duplicate selection. File affected: `src/app/editor/EditorClient.tsx`.

## 2026-07-07 - Font Editor Regression Fixes

### Fixed
- 2026-07-14: Fixed custom font character save data-loss risk by upserting character rows instead of deleting all rows before insert, and protected Font Editor saves from stale refresh state with fewer created characters. Files affected: `src/lib/fontPersistence.ts`, `src/app/editor/EditorClient.tsx`, `tests/fontPersistence.test.ts`, `tests/editorUiSource.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/character-editor.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`, `docs/tasks.md`.
- Fixed not-created punctuation character drafts resetting immediately after grid clicks, so newly added punctuation characters can be drawn and saved. Files affected: `src/app/editor/EditorClient.tsx`, `tests/editorUiSource.test.ts`.
- Fixed font settings saves so they route through the unsaved-character guard and preserve the active character instead of returning to `A`. Files affected: `src/app/editor/EditorClient.tsx`.
- Restored duplicate source selection so the selected source is applied directly to the current character draft. Files affected: `src/app/editor/EditorClient.tsx`.
- Moved the floating character save notification away from the Save Character button. Files affected: `src/app/globals.css`.

## 2026-07-07 - Generator Missing Pattern Warning Fix

### Fixed
- 2026-07-14: Fixed custom font character save data-loss risk by upserting character rows instead of deleting all rows before insert, and protected Font Editor saves from stale refresh state with fewer created characters. Files affected: `src/lib/fontPersistence.ts`, `src/app/editor/EditorClient.tsx`, `tests/fontPersistence.test.ts`, `tests/editorUiSource.test.ts`, `docs/functions/font-data-model.md`, `docs/functions/character-editor.md`, `docs/tests/test-index.md`, `docs/tests/test-run-results.md`, `docs/tasks.md`.
- Fixed Create Pattern warnings for characters whose key exists in the font but whose grid has no filled stitches. These blank/uncreated characters are now skipped and reported as unavailable. Files affected: `src/lib/renderTextToGrid.ts`, `tests/renderTextToGrid.test.ts`.

### Changed
- 2026-07-14 - Added font-level default character width for new blank characters and hid uncreated characters from Alphabet detail previews. Files affected: src/lib/fontTypes.ts, src/lib/fontFactory.ts, src/lib/fontPersistence.ts, src/app/editor/EditorClient.tsx, src/app/fonts/page.tsx, src/app/fonts/[id]/page.tsx, supabase/migrations/202607140001_add_font_default_width.sql.

### Fixed
- 2026-07-19 - Improved Create Font save feedback so the modal shows Creating... while saving and displays save/database setup errors inside the modal. Files affected: src/app/fonts/page.tsx, src/lib/fontPersistence.ts, src/lib/useFonts.ts, docs/functions/font-library.md, docs/functions/font-data-model.md, tests/fontBrowserSource.test.ts, tests/fontPersistence.test.ts.




