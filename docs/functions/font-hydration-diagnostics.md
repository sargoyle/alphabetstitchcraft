# Font Hydration Diagnostics

## Purpose

Provide a temporary, public diagnostic page that compares saved Supabase font character data with the final hydrated app font model. The goal is to identify whether characters exist in the database but are missing, blank, invalid or marked as not-created after app loading and merge logic.

## Source References

- Page: `src/app/diagnostics/font-hydration/page.tsx`
- Function: `loadFontHydrationDiagnostics()` in `src/lib/fontPersistence.ts`
- Function: `loadRemoteCustomFontCharacterRows()` in `src/lib/fontPersistence.ts`
- Function: `hydrateRemoteCustomFont()` in `src/lib/fontPersistence.ts`
- Function: `toDefaultStitchFont()` in `src/lib/fontPersistence.ts`
- Type: `FontHydrationDiagnostic`
- Type: `FontHydrationDiagnosticResult`
- Data source: Supabase `default_fonts`
- Data source: Supabase `custom_fonts`
- Data source: Supabase `custom_font_characters`
- Environment: `NEXT_PUBLIC_SUPABASE_URL`
- Related UI model: `StitchFont.characters`

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| Remove or protect diagnostic page before public release | Remove route / admin-protect route / leave public | Remove or admin-protect before public release | Public users could see internal font ids and data-quality details. |

## Inputs

- Supabase public URL and publishable key configured through environment variables.
- Remote default font rows.
- Remote custom font rows.
- Remote custom font character rows.
- Paginated Supabase character-row batches from `custom_font_characters`.
- Optional target font names supplied to the diagnostic helper.

## Outputs

- Supabase host name, without secret keys.
- Duplicate font records by normalised name.
- Invalid remote font summaries.
- Per-font Supabase filled character keys.
- Per-font hydrated app-model filled character keys.
- Filled Supabase keys missing from the UI model.
- Filled Supabase keys that hydrate as blank.
- Duplicate character rows by `font_id` and `character_key`.
- Invalid grid rows.
- Width/height versus grid-shape mismatches.

## State Transitions

1. Diagnostic page loads in the browser.
2. The page calls `loadFontHydrationDiagnostics()`.
3. Supabase font and character rows are fetched read-only; custom font character rows are fetched in paginated batches so rows after Supabase's first 1,000 records are included.
4. Custom fonts are hydrated with the same canonical merge function used by app loading.
5. The diagnostic compares filled database rows against the hydrated app model.
6. The page renders a structured report without modifying any data.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Diagnostics must be read-only. | Confirmed | Implemented | The page only calls select/load helpers. |
| Diagnostics must not expose secret keys. | Confirmed | Implemented | The report shows only the Supabase host, not the publishable key. |
| Diagnostics must compare Supabase rows with the hydrated app model. | Confirmed | Implemented | Custom fonts use `hydrateRemoteCustomFont()`. |
| Diagnostics must include all matching `custom_font_characters` rows, not only the first 1,000 rows. | Confirmed | Implemented | `loadFontHydrationDiagnostics()` uses `loadRemoteCustomFontCharacterRows()` so diagnostic results match the normal paginated font loader. |
| Filled saved rows must not be hidden by blank starter grids. | Confirmed | Implemented | The diagnostic reports blank/missing hydrated rows and the hydrator overlays filled rows. |
| Duplicate custom character rows must be reported. | Confirmed | Implemented | Duplicate rows are grouped by `character_key` per font. |
| Older-height saved rows should hydrate at the current font height. | Confirmed | Implemented | Hydration normalises valid saved characters to the current font height before validation. |

## Negative Rules

- Must not create, update or delete Supabase data.
- Must not print Supabase secret keys.
- Must not use diagnostic success as a substitute for browser UI verification.
- Must not remain publicly discoverable before go-live without a deliberate decision.

## Acceptance Criteria

- Given Supabase is configured, when the diagnostic page loads, then it shows the Supabase host and font hydration report.
- Given a custom font has filled character rows, when diagnostics run, then those keys are compared with the hydrated `StitchFont.characters` keys.
- Given a filled row is present in Supabase but blank in the hydrated model, when diagnostics run, then the key is listed as blank or not-created despite Supabase data.
- Given duplicate rows exist for the same `font_id` and `character_key`, when diagnostics run, then they are reported without deleting anything.
- Given a saved character row has an older height but valid grid data, when diagnostics run, then hydration normalises it to the current font height and does not mark it missing.
- Given more than 1,000 custom font character rows exist, when diagnostics run, then rows beyond Supabase's default first-page response are included in per-font counts and key comparisons.

## Edge Cases

- Supabase not configured.
- Supabase query failure.
- No default fonts.
- No custom fonts.
- Custom font with no character rows.
- Filled row missing from hydrated model.
- Duplicate character rows.
- Invalid grid shape.
- Saved row height differs from current font height.
- Duplicate font names across tables.

## Current Code Behaviour

- Currently exposes `/diagnostics/font-hydration`.
- Currently calls `loadFontHydrationDiagnostics()` on page load.
- Currently compares default and custom font data from Supabase against the hydrated app model.
- Currently fetches custom font character rows in paginated 1,000-row batches before comparing database rows with the UI model.
- Currently shows Deco first when present, then other diagnostic rows.
- Currently does not require sign-in because the app has no sign-in flow.

## Known Gaps / Defects

- The diagnostic page is intentionally temporary and should be removed or protected before public release.
- Production environment variables could not be independently verified from local files because no `.vercel` project metadata is present in the repository.

## Unclear or Assumed Rules

- Assumption: It is acceptable for this diagnostic route to remain public during active development.
- Needs confirmation: Should this diagnostic route be removed entirely or protected behind future admin access before launch?

## Suggested Test Areas

- Diagnostic page source coverage.
- Supabase unconfigured state.
- Missing filled row reporting.
- Duplicate row reporting.
- Older-height row normalisation.
- Production environment comparison once deployment metadata is available.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
