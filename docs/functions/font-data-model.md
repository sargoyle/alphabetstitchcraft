# Font Data Model

## Purpose

Define the data structures used to describe stitch alphabets, individual character grids, generated lettering patterns and generator settings. These structures are the contract shared by font browsing, previewing, editing, rendering, persistence and export.

## Source References

- File: `src/lib/fontTypes.ts`
- Type: `FontCategory`
- Type: `StitchCharacter`
- Type: `StitchFont`
- Type: `GeneratedPattern`
- Type: `GeneratorSettings`
- File: `src/data/fonts.json`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- File: `src/lib/fonts.ts`
- File: `src/lib/gridUtils.ts`
- Function: `validateCharacter()` in `src/lib/gridUtils.ts`
- Function: `validateFont()` in `src/lib/gridUtils.ts`
- File: `src/lib/fontPersistence.ts`
- Function: `toStitchFont()` in `src/lib/fontPersistence.ts`
- Function: `loadRemoteFontBackups()` in `src/lib/fontPersistence.ts`
- Function: `restoreRemoteFontBackup()` in `src/lib/fontPersistence.ts`
- File: `src/lib/databaseTypes.ts`
- Database migration: `supabase/migrations/202604250001_initial_auth_owned_schema.sql`
- Database seed migration: `supabase/migrations/202607010001_seed_default_fonts.sql`
- Database migration: `supabase/migrations/202607010002_public_default_fonts_update.sql`
- Database cleanup migration: `supabase/migrations/202607010003_cleanup_duplicate_block_needle.sql`
- Database cleanup migration: `supabase/migrations/202607010004_cleanup_block_needle_name_variants.sql`
- Data source: local default font JSON
- Data source: Supabase `default_fonts`, `custom_fonts`, `custom_font_characters` and `custom_font_backups`
- Related UI: font creation and editing flows
- Related UI: font category fields and filters

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Font Data Model decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Default font JSON data.
- Remote Supabase font rows.
- Remote Supabase character rows.
- Remote Supabase font backup rows.
- User-created blank font data.
- Edited character grid data.
- User-selected font category.
- Generated pattern settings.
- Font metadata fields: id, name, description, category, default height, recommended use and licence.
- Character keys, which are confirmed as single characters for v1.
- Shared default editable character set from `src/lib/characterSets.ts`.

## Outputs

- Valid `StitchFont` objects used throughout the app.
- Valid `StitchCharacter` objects used by previews and editor.
- `GeneratedPattern` objects used by preview/export.
- Validation results for font and character data.
- Supabase row payloads for remote persistence.
- Supabase backup snapshots for remote font restore.
- User-visible error/status reporting for invalid remote fonts that need attention.
- User-visible error reporting when a custom font references a missing seeded default font.
- Complete common printable punctuation mappings for default and blank editable fonts.
- Save target decisions for default font updates and custom font upserts.
- Safe cleanup of duplicate `Block Needle 5x7` or `Block Needle 5 x 7` shared font rows while retaining the canonical `block-needle-5x7` default record and backing up accidental custom duplicates before deletion.

## Worked Examples

### Valid character

Input:
```json
{ "width": 3, "height": 2, "grid": ["101", "010"] }
```

Output:
- Validation passes because there are 2 rows, each row has width 3, and all cells are `0` or `1`.

### Invalid row width

Input:
```json
{ "width": 3, "height": 2, "grid": ["101", "01"] }
```

Output:
- Validation fails because row 2 width does not equal 3.

### Font height as shared character height

Input:
- Font `defaultHeight`: `9`
- Character `A`: height `9`
- Character `a`: height `7`

Expected output:
- The font is invalid until character `a` is resized to height `9`.
- The editor should resize every character to the selected font height when font settings are saved.

### Invalid remote font

Input:
- Remote font row exists.
- One remote character row has grid rows that do not match its width.

Expected output:
- The invalid remote font is not silently hidden.
- The app reports an error needing attention so invalid database rows do not accumulate unnoticed.

## State Transitions

1. Font data starts as default JSON, remote database rows or user-created blank data.
2. Data is mapped into TypeScript app types.
3. Validation utilities confirm grid dimensions and cell values.
4. Valid fonts are merged into the available font list.
5. Invalid remote fonts are reported as errors needing attention.
6. Components consume the typed font data for browsing, rendering and editing.
7. Saves map the typed font back into remote database rows.
8. User-editable category changes are persisted with the font data.
9. Before public update, restore or delete operations, the current database font can be copied into `custom_font_backups`.
10. Restore actions map a validated backup snapshot back into the same `StitchFont` data model and save path.
11. Custom font saves that reference bundled default fonts confirm the base default id exists in Supabase before writing `custom_fonts`.
12. Saves for non-UUID bundled default font IDs update `default_fonts`.
13. Saves for UUID custom/shared font IDs upsert `custom_fonts`, upsert only filled character rows by `font_id,character_key`, and remove blank saved character rows for the current font.
14. Remote custom-font loads rebuild blank starter characters from the standard editable character set and the font-level default height/width, then overlay persisted filled character rows from `custom_font_characters`.
14. Duplicate-name validation ignores the current record and only rejects different records with the same normalised name.
15. Duplicate-name validation must not apply a slug ID such as `tiny-serif-7x9` to UUID fields such as `custom_fonts.id`.
16. Delete requests for UUID custom/shared fonts target `custom_fonts`; delete requests for default/shared slugs archive default_fonts.is_public = false after first confirming the public row exists.
17. Duplicate `Block Needle 5x7` and `Block Needle 5 x 7` shared rows are cleaned by retaining `block-needle-5x7`, repointing related custom base references, backing up accidental custom duplicates, and removing accidental duplicate records.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| A character grid must contain rows of `0` and `1` values. | Confirmed | Implemented | Product scope and `validateCharacter()` support this. |
| Character row count must equal character height. | Confirmed | Implemented | Validation checks this. |
| Every row length must equal character width. | Confirmed | Implemented | Validation checks this. |
| Character keys must be single characters in v1. | Confirmed | Implemented | Font data tests assert single-character keys for bundled fonts. |
| `defaultHeight` is the font-level character height. | Confirmed | Implemented | User confirmed every character in a font must have this height. |
| Every character in a font must have the same height as `defaultHeight`. | Confirmed | Implemented | `validateFont()` reports mismatched character heights and editor font settings resize all characters. |
| Font height must remain user-selectable at the font level. | Confirmed | Implemented | Font Editor exposes a font-height input and saves it through the font save path. |
| Font name must be editable from the editor screen. | Confirmed | Implemented | Font Editor exposes a font-name input and saves it through the font save path. |
| Font refresh must not clear the current saved font list before replacement remote data has loaded. | Confirmed | Implemented | Prevents the UI from flashing back to older bundled/default font versions during save/load refreshes. |
| Successful font saves should keep the just-saved font in local state while the remote refresh completes. | Confirmed | Implemented | Prevents a brief return to the pre-save version after editing. |
| Font IDs must be unique. | Confirmed | Partially Implemented | Utility exists; runtime uniqueness enforcement depends on data source. |
| Fonts must include metadata and character data. | Confirmed | Implemented | Types require these fields. |
| Default and blank editable fonts must include common printable punctuation. | Confirmed | Implemented | `punctuationCharacters` covers the newly required printable punctuation set and tests assert bundled/blank font coverage. |
| Font categories should be user-editable. | Confirmed | Implemented | Font Editor saves category changes, and Font Library creation supports existing or new category names. |
| Remote fonts must be validated before use. | Assumed | Implemented | `toStitchFont()` returns null for invalid mapped fonts. |
| Invalid remote fonts must be shown as errors needing attention, not silently skipped. | Confirmed | Implemented | `loadRemoteFontResult()` returns invalid font warnings and `useFonts()` surfaces them in font sync status. |
| User-created fonts should be marked as custom. | Assumed | Implemented | `createBlankFont()` and `ensureDatabaseFont()` set `isCustom`. |
| Shared public fonts should have database-backed backup snapshots before update, restore and delete operations. | Confirmed | Implemented | `custom_font_backups` stores validated `StitchFont` snapshots for restore. |
| Bundled default fonts must be seeded into `default_fonts` before custom fonts can reference them. | Confirmed | Implemented | `202607010001_seed_default_fonts.sql` inserts or updates the bundled default font rows. |
| Custom font saves with `base_default_font_id` must show a clear error if the referenced default font is missing. | Confirmed | Implemented | `ensureBaseDefaultFontExists()` checks Supabase before the custom font upsert. |
| Editing a bundled default/shared font must update the existing `default_fonts` record. | Confirmed | Implemented | `getRemoteFontSaveTarget()` sends non-UUID font IDs to `default_fonts` update. |
| Editing a UUID custom/shared font must update the existing `custom_fonts` record rather than create a duplicate. | Confirmed | Implemented | UUID IDs continue through the custom-font upsert path and duplicate checks ignore the current ID. |
| Custom font character saves must be non-destructive. | Confirmed | Implemented | `custom_font_characters` rows are upserted by `font_id,character_key`; the save flow must not delete all character rows before inserting replacements. |
| Custom font persistence must store only characters that contain filled stitches. | Confirmed | Implemented | Blank starter grids are synthesised from `defaultEditableCharacterKeys`, `defaultHeight` and `defaultWidth` when remote custom fonts load. After a font save succeeds, the active edited UUID custom-font character is written directly to `custom_font_characters` by `font_id` and `character_key`. |
| Clearing a custom character and saving should remove that character row from `custom_font_characters`. | Assumed | Implemented | Saving blank grids deletes those character keys so they return to a not-created starter state after reload. |
| Duplicate-name validation must ignore the record currently being edited. | Confirmed | Implemented | `hasSharedFontNameConflict()` compares IDs before reporting a conflict. |
| Renaming a font to another shared font's name must be blocked. | Confirmed | Implemented | Duplicate-name checks compare against both default and custom/shared font rows. |
| Font slugs must not be sent to UUID database fields. | Confirmed | Implemented | Custom duplicate-name exclusion only applies `.neq("id", ...)` when the current ID is a UUID. |
| Default/shared font deletion is not allowed through the app while `default_fonts` has no delete policy. | Confirmed | Implemented | `getRemoteFontDeleteTarget()` blocks slug deletes before any database delete query. |
| Duplicate `Block Needle 5x7` or `Block Needle 5 x 7` records must be cleaned without removing the foreign key constraint. | Confirmed | Implemented | `202607010003_cleanup_duplicate_block_needle.sql` handles compact-name duplicates. `202607010004_cleanup_block_needle_name_variants.sql` handles spacing variants and creates `custom_font_backups` if missing. Both keep `block-needle-5x7`, repoint `custom_fonts.base_default_font_id`, back up accidental custom duplicates, and remove duplicate rows. |

## Negative Rules

- Must not render invalid grids without validation where validation is available.
- Must not treat non-rectangular character data as valid.
- Must not silently change a character key during mapping.
- Must not allow multi-character glyph keys in v1 unless a future feature explicitly changes this.
- Must not omit required common printable punctuation from blank or seeded default fonts.
- Must not allow mixed character heights inside one font.
- Must not treat font height as a per-character setting.
- Must not mutate default font JSON when editing user data.
- Must not use normal computer font outlines as stitch data in v1.
- Must not silently skip invalid remote fonts.
- Must not allow invalid hidden font rows to accumulate in the database without user-visible attention.
- Must not save a custom font with a `base_default_font_id` that is missing from `default_fonts`.
- Must not delete all custom font character rows before inserting saved character replacements.
- Must not remove the `custom_fonts.base_default_font_id` foreign key to bypass missing seed data.
- Must not convert a default font edit into a new UUID custom font create operation.
- Must not report the current edited record as a duplicate of itself.
- Must not pass default font slugs into UUID database columns or UUID query filters.
- Must not delete default/shared font slugs through the custom-font delete path.
- Must not remove `custom_fonts.base_default_font_id` or weaken duplicate-name validation to hide duplicate data.

## Acceptance Criteria

- Given a character with row count not matching height, when validated, then validation fails.
- Given a row with a non-`0`/`1` value, when validated, then validation fails.
- Given a character key contains more than one character, when font data is validated for v1, then validation fails or the font is reported as invalid.
- Given valid default font data, when loaded, then it produces `StitchFont` objects.
- Given bundled or blank editable font data, when inspected, then every required punctuation key is present and editable.
- Given valid remote font and character rows, when mapped, then a valid `StitchFont` is produced.
- Given a font has a character with height different from `defaultHeight`, when validated, then validation fails.
- Given a font height is changed in the editor, when font settings are saved, then every character height and grid row count is updated to the new font height.
- Given a user edits a font category, when the font is saved, then the selected category is retained with the font data.
- Given invalid remote character rows, when mapped, then invalid font data is not included in the usable list and an error needing attention is shown.
- Given invalid remote font rows exist in the database, when fonts are loaded, then the app does not silently hide the issue.
- Given `default_fonts` is empty and a duplicated bundled font is saved, when the save runs, then the app shows a clear missing default font seed error instead of relying on a raw database foreign-key error.
- Given the default font seed migration is run more than once, when it completes, then it restores or updates the same default font rows without creating duplicates.
- Given a default font is edited without changing its name, when saved, then the existing `default_fonts` record is updated and no duplicate-name error is shown for the same record.
- Given a default font is renamed, when no other shared font has that name, then the same `default_fonts` record is updated.
- Given a default font is renamed to another shared font's name, when saved, then the save is blocked with a clear duplicate-name error.
- Given a UUID custom font is edited, when saved, then the existing `custom_fonts` record is updated.
- Given a default/shared font slug is checked for duplicate names, when custom shared fonts are queried, then the slug is not passed to `custom_fonts.id`.
- Given a UUID custom/shared font is deleted, when the delete runs, then `custom_fonts` is targeted with the UUID.
- Given a default/shared font slug is deleted, when the user confirms delete, then the app blocks the action with a clear message and does not query UUID delete fields.
- Given duplicate `Block Needle 5x7` or `Block Needle 5 x 7` rows exist, when the cleanup migrations run after default fonts are seeded, then only the canonical `block-needle-5x7` default font remains with related custom-font base references repointed to it and accidental custom duplicates backed up before removal.

## Edge Cases

- Empty character map.
- Duplicate font IDs.
- Empty grid rows.
- Width or height of zero.
- Missing metadata.
- Remote grid field not an array of strings.
- Character key longer than one visible character.
- Required punctuation characters such as `@`, `#`, `\` and `~`.
- Existing data with mixed character heights from older versions.
- Category value missing or not part of the known category set.
- User changes category before saving a new font.
- Remote font row exists without valid character rows.
- Database contains multiple invalid remote fonts.
- `default_fonts` table is empty after project reset.
- `default_fonts` contains only some bundled font ids.
- A custom font references a stale base default font id.
- A default font is renamed to match an existing custom/shared font.
- A custom/shared font is renamed to match an existing default font.
- A default/shared slug such as `tiny-serif-7x9` is used while checking `custom_fonts`.
- A custom/shared font has a UUID ID but a `baseFontId` slug pointing at a default font.
- Duplicate `Block Needle 5x7` or `Block Needle 5 x 7` rows exist in `default_fonts` or `custom_fonts` from earlier save-flow bugs.

## Current Code Behaviour

- Currently defines shared app types in `fontTypes.ts`.
- Currently validates character dimensions and binary cell values.
- Currently validates that every character height matches the font `defaultHeight`.
- Currently loads default font data from JSON without runtime validation in the loading function.
- Currently validates remote mapped fonts before returning them.
- Currently `toStitchFont()` returns `null` for invalid remote mapped fonts and `loadRemoteFontResult()` returns warning details for user attention.
- Currently database TypeScript types reflect nullable public custom font owners and include `custom_font_backups`.
- Currently remote font backup rows store a `font_snapshot` JSON value that is validated as a `StitchFont` before being exposed to restore UI.
- Currently `useFonts().refresh()` keeps existing `savedFonts` in state while remote data reloads.
- Currently `useFonts().saveFont()` optimistically keeps the saved font in local state after a successful database save while refresh completes.
- Current implementation status for user-editable categories needs to be checked before implementation or test work.
- Currently `202607010001_seed_default_fonts.sql` restores the bundled default fonts into Supabase `default_fonts`.
- Currently `saveRemoteFont()` checks for a referenced base default font before writing to `custom_fonts`.
- Currently non-UUID bundled default font saves update `default_fonts` instead of creating UUID custom-font records.
- Currently UUID custom font saves keep using the `custom_fonts` path.
- Currently duplicate-name checks avoid passing slug IDs into `custom_fonts.id`.
- Currently default/shared slug deletes are blocked before the database delete path.
- Currently `202607010003_cleanup_duplicate_block_needle.sql` provides a repeatable cleanup for duplicate `Block Needle 5x7` data created before the save-flow fixes.
- Currently `202607010004_cleanup_block_needle_name_variants.sql` provides a repeatable cleanup for `Block Needle 5 x 7` spacing variants and is self-contained when `custom_font_backups` is missing.

## Known Gaps / Defects

- Shared/default font deletion archives the row by setting is_public = false instead of physically deleting from default_fonts, avoiding a broad public delete policy while removing the font from the app.

- Invalid remote font warnings are implemented, but the final warning UX should still be reviewed in browser.
- Database type definitions now reflect the current public no-login persistence model for nullable custom font owners and the backup table.
- Default font validation exists but is not automatically enforced at every app startup path.
- User-editable font category support is confirmed as a product rule, but implementation status needs code verification.
- Live Supabase duplicate records cannot be inspected from the local test runner; both cleanup migrations must be run and verified in the target Supabase project.

## Unclear or Assumed Rules

- None currently for Font Data Model. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Character keys are single characters in v1.
- `defaultHeight` is the font-level height and every character in the font should match it.
- Font categories should be user-editable.
- Invalid remote fonts should be shown as errors needing attention, not silently skipped.
- Invalid hidden fonts should not be allowed to accumulate in the database unnoticed.
- Bundled default fonts must be restorable through an idempotent database seed migration.
- Missing default font seed data must be reported clearly before custom font saves fail.
- Existing default/shared font edits update `default_fonts`.
- Existing custom/shared font edits update `custom_fonts`.
- Duplicate-name validation ignores the record currently being saved.
- UUID fields and slug fields must remain separate in save/delete logic.
- Default/shared font deletion is blocked until a deliberate `default_fonts` delete model is designed.
- Duplicate Block Needle cleanup keeps the seeded `block-needle-5x7` default font and does not remove the base-default foreign key.

## Suggested Test Areas

- Character validation.
- Single-character key validation.
- Required punctuation coverage in bundled, seeded and blank fonts.
- Font validation.
- Duplicate font ID detection.
- Remote row mapping.
- Invalid remote font reporting.
- Default font data validation.
- Blank font creation data shape.
- Rejection of mixed character heights against `defaultHeight`.
- Font-level height resizing across every character.
- Font name editing from the editor screen.
- User-editable category persistence.
- Default font seed migration idempotency.
- Custom font save error handling when `default_fonts` is missing a referenced id.
- Save target selection for default versus custom font IDs.
- Duplicate-name validation for create, edit and rename flows.
- Slug versus UUID handling in duplicate checks.
- Custom UUID delete targeting.
- Default/shared slug archive-delete targeting and post-archive RLS visibility handling.
- Duplicate Block Needle cleanup migration coverage.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.

## 2026-07-14 Update: Font Default Width

- StitchFont.defaultWidth is now a soft font-level starter width for newly created blank characters.
- defaultWidth is not a hard character constraint; individual characters can still have their own width.
- defaultHeight remains a hard font-level height: every character in the font must share that height.
- Supabase stores the field as default_width on both default_fonts and custom_fonts.
- Existing database rows are backfilled from default_height by migration 202607140001_add_font_default_width.sql.
- Remote font loading falls back to default_height when default_width is missing or null, so older data remains readable.

### Added Acceptance Criteria

- Given a blank font is created with height 9 and width 14, then every starter character is 14 x 9.
- Given a remote font row has no default_width, when loaded, then the app uses the font height as the default width fallback.
- Given a font is saved to Supabase, then default_width is included in the default/custom font payload.

### Related Tests

- fontData.test.ts validates blank-font default width.
- fontPersistence.test.ts validates remote load/save source mapping.
- migrationScripts.test.ts validates the default-width migration.

## 2026-07-19 Update: Default Width Migration Error Handling

- Supabase save errors caused by the missing default_width schema column are normalised into a user-actionable migration message.
- The required migration is 202607140001_add_font_default_width.sql.
- This keeps Create Font from appearing unresponsive when the database schema is behind the application code.

### Related Tests

- FONT-PERSISTENCE-002 in tests/fontPersistence.test.ts.

