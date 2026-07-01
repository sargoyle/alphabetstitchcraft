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

## Outputs

- Valid `StitchFont` objects used throughout the app.
- Valid `StitchCharacter` objects used by previews and editor.
- `GeneratedPattern` objects used by preview/export.
- Validation results for font and character data.
- Supabase row payloads for remote persistence.
- Supabase backup snapshots for remote font restore.
- User-visible error/status reporting for invalid remote fonts that need attention.
- User-visible error reporting when a custom font references a missing seeded default font.

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

### Default height as baseline

Input:
- Font `defaultHeight`: `9`
- Character `A`: height `9`
- Character punctuation mark: height `5`

Expected output:
- The font can still be valid because `defaultHeight` is a baseline/display value, not a strict height requirement for every character.

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

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| A character grid must contain rows of `0` and `1` values. | Confirmed | Implemented | Product scope and `validateCharacter()` support this. |
| Character row count must equal character height. | Confirmed | Implemented | Validation checks this. |
| Every row length must equal character width. | Confirmed | Implemented | Validation checks this. |
| Character keys must be single characters in v1. | Confirmed | Unknown | User confirmed this product rule; implementation validation is not clearly confirmed from this doc review. |
| `defaultHeight` is a baseline/display value, not a strict height for every character. | Confirmed | Implemented | Mixed character heights are allowed by the type and validation rules. |
| Font IDs must be unique. | Confirmed | Partially Implemented | Utility exists; runtime uniqueness enforcement depends on data source. |
| Fonts must include metadata and character data. | Confirmed | Implemented | Types require these fields. |
| Font categories should be user-editable. | Confirmed | Unknown | User confirmed categories are editable; current implementation status should be checked before implementation/test work. |
| Remote fonts must be validated before use. | Assumed | Implemented | `toStitchFont()` returns null for invalid mapped fonts. |
| Invalid remote fonts must be shown as errors needing attention, not silently skipped. | Confirmed | Implemented | `loadRemoteFontResult()` returns invalid font warnings and `useFonts()` surfaces them in font sync status. |
| User-created fonts should be marked as custom. | Assumed | Implemented | `createBlankFont()` and `ensureDatabaseFont()` set `isCustom`. |
| Shared public fonts should have database-backed backup snapshots before update, restore and delete operations. | Confirmed | Implemented | `custom_font_backups` stores validated `StitchFont` snapshots for restore. |
| Bundled default fonts must be seeded into `default_fonts` before custom fonts can reference them. | Confirmed | Implemented | `202607010001_seed_default_fonts.sql` inserts or updates the bundled default font rows. |
| Custom font saves with `base_default_font_id` must show a clear error if the referenced default font is missing. | Confirmed | Implemented | `ensureBaseDefaultFontExists()` checks Supabase before the custom font upsert. |

## Negative Rules

- Must not render invalid grids without validation where validation is available.
- Must not treat non-rectangular character data as valid.
- Must not silently change a character key during mapping.
- Must not allow multi-character glyph keys in v1 unless a future feature explicitly changes this.
- Must not treat `defaultHeight` as a strict height that invalidates shorter or taller valid characters.
- Must not mutate default font JSON when editing user data.
- Must not use normal computer font outlines as stitch data in v1.
- Must not silently skip invalid remote fonts.
- Must not allow invalid hidden font rows to accumulate in the database without user-visible attention.
- Must not save a custom font with a `base_default_font_id` that is missing from `default_fonts`.
- Must not remove the `custom_fonts.base_default_font_id` foreign key to bypass missing seed data.

## Acceptance Criteria

- Given a character with row count not matching height, when validated, then validation fails.
- Given a row with a non-`0`/`1` value, when validated, then validation fails.
- Given a character key contains more than one character, when font data is validated for v1, then validation fails or the font is reported as invalid.
- Given valid default font data, when loaded, then it produces `StitchFont` objects.
- Given valid remote font and character rows, when mapped, then a valid `StitchFont` is produced.
- Given a valid font has characters with heights different from `defaultHeight`, when validated, then the font remains valid as long as each character's own height and grid are valid.
- Given a user edits a font category, when the font is saved, then the selected category is retained with the font data.
- Given invalid remote character rows, when mapped, then invalid font data is not included in the usable list and an error needing attention is shown.
- Given invalid remote font rows exist in the database, when fonts are loaded, then the app does not silently hide the issue.
- Given `default_fonts` is empty and a duplicated bundled font is saved, when the save runs, then the app shows a clear missing default font seed error instead of relying on a raw database foreign-key error.
- Given the default font seed migration is run more than once, when it completes, then it restores or updates the same default font rows without creating duplicates.

## Edge Cases

- Empty character map.
- Duplicate font IDs.
- Empty grid rows.
- Width or height of zero.
- Missing metadata.
- Remote grid field not an array of strings.
- Character key longer than one visible character.
- Mixed character heights inside one font.
- Category value missing or not part of the known category set.
- User changes category before saving a new font.
- Remote font row exists without valid character rows.
- Database contains multiple invalid remote fonts.
- `default_fonts` table is empty after project reset.
- `default_fonts` contains only some bundled font ids.
- A custom font references a stale base default font id.

## Current Code Behaviour

- Currently defines shared app types in `fontTypes.ts`.
- Currently validates character dimensions and binary cell values.
- Currently loads default font data from JSON without runtime validation in the loading function.
- Currently validates remote mapped fonts before returning them.
- Currently `toStitchFont()` returns `null` for invalid remote mapped fonts and `loadRemoteFontResult()` returns warning details for user attention.
- Currently database TypeScript types reflect nullable public custom font owners and include `custom_font_backups`.
- Currently remote font backup rows store a `font_snapshot` JSON value that is validated as a `StitchFont` before being exposed to restore UI.
- Current implementation status for user-editable categories needs to be checked before implementation or test work.
- Currently `202607010001_seed_default_fonts.sql` restores the bundled default fonts into Supabase `default_fonts`.
- Currently `saveRemoteFont()` checks for a referenced base default font before writing to `custom_fonts`.

## Known Gaps / Defects

- Invalid remote font warnings are implemented, but the final warning UX should still be reviewed in browser.
- Database type definitions now reflect the current public no-login persistence model for nullable custom font owners and the backup table.
- Default font validation exists but is not automatically enforced at every app startup path.
- Character key single-character enforcement is confirmed as a product rule, but implementation enforcement is not clearly confirmed from the current documentation pass.
- User-editable font category support is confirmed as a product rule, but implementation status needs code verification.

## Unclear or Assumed Rules

- None currently for Font Data Model. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Character keys are single characters in v1.
- `defaultHeight` is a baseline, not a strict height for all characters.
- Font categories should be user-editable.
- Invalid remote fonts should be shown as errors needing attention, not silently skipped.
- Invalid hidden fonts should not be allowed to accumulate in the database unnoticed.
- Bundled default fonts must be restorable through an idempotent database seed migration.
- Missing default font seed data must be reported clearly before custom font saves fail.

## Suggested Test Areas

- Character validation.
- Single-character key validation.
- Font validation.
- Duplicate font ID detection.
- Remote row mapping.
- Invalid remote font reporting.
- Default font data validation.
- Blank font creation data shape.
- Mixed character heights against `defaultHeight`.
- User-editable category persistence.
- Default font seed migration idempotency.
- Custom font save error handling when `default_fonts` is missing a referenced id.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
