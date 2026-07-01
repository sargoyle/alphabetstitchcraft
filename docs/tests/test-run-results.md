# Test Run Results

This file records meaningful test runs for Alphabet Stitch.

## 2026-07-01

### Font Editor UI Refinement Run

#### Scope

- Updated the Font Editor screen to use compact sidebar character tiles.
- Moved New Character setup into a condensed modal dialog.
- Reworked the character editor panel so the grid, dimension controls and action footer match the uploaded layout direction.
- Added source-level editor UI regression coverage.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- Added `tests/editorUiSource.test.ts`.
- Updated `tests/runTests.ts`.
- Automated output included `editor UI source tests passed.` and `All utility tests passed.`

#### Manual Checks Still Required

- Open `/editor?font=block-needle-5x7`.
- Confirm sidebar character tiles, New Character modal, dimension controls and editor action footer match the uploaded mockup direction.
- Confirm New Character remains disabled until a destination character is entered.
- Confirm save, reset, clear and delete behaviours still work with the updated layout.

### Block Needle Name Variant Cleanup Run

#### Scope

- Added cleanup for `Block Needle 5 x 7` display-name variants not caught by the compact `Block Needle 5x7` cleanup.
- Made the variant cleanup create `custom_font_backups` if the target Supabase project has not applied the backup migration yet.
- Improved duplicate-name error logging so conflicts identify whether they came from `default_fonts` or `custom_fonts`.
- Updated migration-script coverage for the variant cleanup.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- Updated `tests/migrationScripts.test.ts`.
- Automated output included `migration script tests passed.` and `All utility tests passed.`

#### Manual Checks Still Required

- Run the updated `supabase/migrations/202607010004_cleanup_block_needle_name_variants.sql` in Supabase.
- Refresh the app and save the visible Block Needle font again.
- If a duplicate error still appears, note whether it says `default_fonts` or `custom_fonts`.

### Save Confirmation And Block Needle Cleanup Run

#### Scope

- Added inline editor confirmation after successful database font saves.
- Added local editor failure status when a database save returns failure.
- Added a repeatable Supabase cleanup migration for duplicate `Block Needle 5x7` shared font records.
- Added backup snapshots before accidental custom duplicate records are deleted by the cleanup.
- Added utility coverage that verifies the cleanup migration keeps the canonical `block-needle-5x7` record and repoints duplicate references.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- Added `tests/migrationScripts.test.ts`.
- Updated `tests/runTests.ts`.
- Automated output included `migration script tests passed.` and `All utility tests passed.`

#### Manual Checks Still Required

- Run `supabase/migrations/202607010003_cleanup_duplicate_block_needle.sql` in Supabase after the default font seed migration.
- Confirm only one default/shared `Block Needle 5x7` row remains, with `default_fonts.id = 'block-needle-5x7'`.
- Confirm any deleted accidental custom duplicates have backup rows in `custom_font_backups`.
- Edit and save `Block Needle 5x7` in the app and confirm `Font changes saved successfully.` appears.
- Confirm Supabase logs show no duplicate-name or UUID syntax errors for the save.

### Slug Versus UUID Font Operation Run

#### Scope

- Fixed duplicate-name validation so slug IDs are not passed to UUID columns.
- Added explicit save/delete target helpers for default/shared slugs and custom/shared UUIDs.
- Blocked default/shared slug deletes with a clear message.
- Added console logging for save and delete target decisions.
- Expanded font persistence utility tests.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- Updated `tests/fontPersistence.test.ts`.
- Added ID-kind checks for slug versus UUID IDs.
- Added delete-target checks for UUID custom fonts and default/shared slugs.
- Added custom-font-from-default-slug save-target coverage.

#### Manual Checks Still Required

- Refresh the app and save `tiny-serif-7x9`.
- Confirm Supabase no longer logs `invalid input syntax for type uuid: "tiny-serif-7x9"`.
- Delete a UUID custom/shared font and confirm it is removed from `custom_fonts`.
- Try deleting a default/shared font and confirm the app shows the clear blocked-delete message.

### Default And Custom Font Save Flow Run

#### Scope

- Fixed save routing for default/shared versus custom/shared fonts.
- Added a Supabase policy migration for updating existing default font rows.
- Added utility tests for save target selection and duplicate-name conflict rules.
- Updated database, font data model, rules, task and changelog documentation.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- Added `tests/fontPersistence.test.ts`.
- Added assertions for default/shared font update targeting.
- Added assertions for custom/shared font create/edit targeting.
- Added assertions that duplicate-name validation ignores the current record.
- Added assertions that renaming to another shared font's name is detected as a conflict.

#### Manual Checks Still Required

- Run `supabase/migrations/202607010002_public_default_fonts_update.sql` in Supabase.
- Refresh the app and edit `Block Needle 5x7`.
- Confirm the save updates `default_fonts` and no longer creates a duplicate `custom_fonts` row.
- Rename a default font to a unique name and confirm it saves.
- Try renaming a font to another existing shared font name and confirm the clear duplicate-name error appears.

### Default Font Seed Recovery Run

#### Scope

- Added an idempotent Supabase migration to seed `default_fonts` from bundled app font data.
- Added a client-side check that reports a clear missing default font seed error before custom font saves with `base_default_font_id`.
- Updated database, font data model, task and changelog documentation.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' -e "const fs=require('fs');const fonts=JSON.parse(fs.readFileSync('src/data/fonts.json','utf8'));const sql=fs.readFileSync('supabase/migrations/202607010001_seed_default_fonts.sql','utf8');for (const font of fonts) if (!sql.includes(font.id)) throw new Error('Missing '+font.id); console.log('Seed migration includes '+fonts.length+' font ids.');"
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- Seed migration font-id validation: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- No new automated tests were added in this pass.
- Existing utility tests were rerun to catch regressions in shared font data, validation and persistence imports.

#### Manual Checks Still Required

- Run `supabase/migrations/202607010001_seed_default_fonts.sql` in Supabase.
- Confirm `default_fonts` contains the bundled font IDs such as `block-needle-5x7`.
- Edit or duplicate a bundled font and confirm the save no longer fails with `custom_fonts_base_default_font_id_fkey`.

### Supabase Keep-Alive Endpoint Run

#### Scope

- Added public `GET /api/keep-alive` route.
- Route performs a read-only count query against `custom_fonts`.
- Route returns `{ "status": "ok" }` when Supabase responds successfully.
- Route returns JSON error responses for missing Supabase config or query failure.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
```

#### Result

- Status: passed.
- App TypeScript compile: passed.

#### Manual Checks Still Required

- Start the app locally and visit `/api/keep-alive`.
- Confirm a configured Supabase project returns `{ "status": "ok" }`.
- Confirm the route returns a JSON error response if Supabase env values are missing or invalid.

## 2026-06-09

### Public Font Backup Hardening Run

#### Scope

- Added a Supabase migration for `custom_font_backups`.
- Added remote backup creation before shared font update, restore and delete operations.
- Added restore controls for recent font backups on Manage Fonts.
- Updated security, font data model, task and changelog documentation.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- No new automated tests were added for Supabase backup persistence in this pass.
- Existing utility tests were rerun to catch regressions in shared types and persistence imports.

#### Manual Checks Still Required

- Run `supabase/migrations/202606090001_public_font_backups.sql` in Supabase.
- Edit or rename a database font and confirm a backup appears on Manage Fonts.
- Delete a database font and confirm a backup row is created before deletion.
- Restore a recent backup and confirm the font returns to the backed-up state.

## 2026-06-05

### Generator Preview Export Parity Run

#### Scope

- Verified preview/export parity at utility and source-wiring level.
- Fixed PNG export so Generator preview grid and filled-stitch visibility settings are passed to export.
- Added JSON export parity assertions for generated pattern object preservation.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Added Or Updated

- `EXPORT-001`: PNG canvas export does not draw grid lines when grid visibility is off.
- `EXPORT-002`: PNG canvas export does not draw filled stitch rectangles when filled visibility is off.
- `EXPORT-003`: Empty pattern canvas export creates a safe margin-only canvas.
- `EXPORT-004`: Empty pattern JSON export preserves safe empty data.
- `PARITY-001`: PNG canvas export uses the provided generated pattern grid for filled and blank cells.
- `PARITY-002`: Pattern JSON export preserves the generated pattern object, including grid, dimensions and warnings.
- `PREVIEW-001`: Source review confirms Generator preview and export controls receive the same `pattern` object.
- `PREVIEW-002`: Source review confirms Export Controls passes preview visibility settings to PNG export.

#### Failures Found

- Before the fix, PNG export did not receive preview visibility settings and used default export options.
- No failures remain in utility-level automated coverage after the fix.

#### Classification

- Preview/export visibility mismatch: confirmed defect, fixed at Generator wiring and PNG utility level.
- Full browser visual parity: manual/browser coverage still required.

#### Manual Checks Still Required

- Preview simple text, export PNG and compare dimensions.
- Preview multiline text, export PNG and compare line spacing rows.
- Preview aligned text, export PNG and compare layout.
- Preview unsupported character placeholders, export PNG and confirm placeholder cells appear.
- Preview with grid hidden and filled stitches hidden, export PNG and confirm visibility settings.

### Renderer Production Fix Run

#### Scope

- Fixed confirmed renderer gaps for whitespace-only text, unsupported character counts, spacing numeric bounds and very large generated output warnings.
- Updated strict regression tests for the fixed behaviour.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' --noEmit
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- App TypeScript compile: passed.
- Test TypeScript compile: passed.
- Automated tests: passed.

#### Tests Updated

- `RENDER-001`: now strictly verifies whitespace-only text returns an empty pattern.
- `UNSUPPORTED-002`: now strictly verifies counted unsupported character entries.
- `SPACING-001`: now strictly verifies negative letter spacing is rejected.
- `SPACING-002`: now strictly verifies very large letter spacing is rejected.
- `SPACING-003`: verifies invalid word spacing is rejected.
- `SPACING-004`: verifies `NaN` line spacing is rejected.
- `RENDER-002`: now strictly verifies very long generated output returns a large-pattern warning and keeps row consistency.

#### Failures Found

- None in the final run.

#### Classification

- `RENDER-001`: fixed confirmed bug.
- `UNSUPPORTED-002`: fixed confirmed bug.
- `SPACING-001`: fixed confirmed validation gap.
- `SPACING-002`: fixed confirmed validation gap.
- `RENDER-002`: partially resolved confirmed safety gap with renderer/generator warning; browser stress coverage remains future work.

#### Notes

- Production changes were limited to renderer validation/output and Generator warning display.
- No unrelated UI redesign or gameplay/app workflow refactor was performed.

### Renderer And Grid Visibility Run

#### Scope

- Added renderer visibility tests for whitespace-only text, unsupported characters, repeated unsupported characters, tabs, invalid spacing values, large spacing values, very long text, row width consistency, line spacing rows and alignment content preservation.
- Added utility-level export grid visibility coverage.

#### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\.test-build\tests\runTests.js'
```

#### Result

- Status: passed.
- Test compile: passed.
- Automated tests: passed.
- Tests added: 11 requirement/evidence checks.
- Output summary:
  - `renderTextToGrid tests passed.`
  - `renderVisibility tests passed.`
  - `gridUtils tests passed.`
  - `fontData tests passed.`
  - `localStorageUtils tests passed.`
  - `exportUtils tests passed.`
  - `All utility tests passed.`

#### Failures Found

- No hard test failures.
- Known confirmed gaps were observed and logged as warning evidence:
  - `RENDER-001`: whitespace-only text currently renders as `9 x 7`.
  - `UNSUPPORTED-002`: repeated unsupported characters currently return `["@","#"]` without counts.
  - `SPACING-001`: negative letter spacing is accepted and rendered as width `10`.
  - `SPACING-002`: very large letter spacing is accepted and rendered as width `1010`.
  - `RENDER-002`: very long text rendered `1799 x 7` without a renderer warning or documented safety response.

#### Classification

- `RENDER-001`: confirmed bug.
- `UNSUPPORTED-002`: confirmed bug.
- `SPACING-001`: confirmed validation gap.
- `SPACING-002`: confirmed validation/safety gap.
- `RENDER-002`: confirmed safety/UX gap.
- `UNSUPPORTED-003`: tab handling verified as implemented at renderer utility level.
- `GRID-001`, `GRID-002`, `GRID-003`, `EXPORT-001`: passed.

#### Notes

- No production code was changed.
- Known-gap evidence tests are intentionally non-blocking until production fixes are approved.

### Scope

- Started test planning from `/docs/functions`.
- Added utility coverage for font data and grid helpers.
- Re-ran existing renderer, local storage and export utility tests.

### Commands

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.test-build\tests\runTests.js'
```

### Result

- Status: passed.
- Test compile: passed.
- Automated tests: passed.
- Output summary:
  - `renderTextToGrid tests passed.`
  - `gridUtils tests passed.`
  - `fontData tests passed.`
  - `localStorageUtils tests passed.`
  - `exportUtils tests passed.`
  - `All utility tests passed.`

### Findings

- Initial `fontData.test.ts` assertion assumed `Object.keys()` would preserve numeric-like character keys after letters. JavaScript returns integer-like keys first, so the test was corrected to compare expected character mappings by set membership instead of object-key order.
- No production code was changed.

### Known Pending Coverage

- Whitespace-only rendering, unsupported character counts and renderer numeric bounds are confirmed gaps and are not yet automated as passing tests.
- Character grid keyboard navigation and read-only non-interactive cells require component or browser-level tests.
- PNG preview visibility parity requires additional export tests after the export behaviour is confirmed or fixed.
