# Test Run Results

This file records meaningful test runs for Alphabet Stitch.

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
