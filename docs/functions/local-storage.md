# Local Storage

## Purpose

Persist browser-local preferences and selected generator state while maintaining the product decision that font data and shared deletion state should be database-backed when configured. Browser-local storage is acceptable for generator preferences, but not for shared font data that users expect to persist across browsers.

## Source References

- File: `src/lib/localStorageUtils.ts`
- Functions: `loadGeneratorSettings()`, `saveGeneratorSettings()`
- Storage key: `crossStitch.generatorSettings`
- Functions: `loadSelectedFontId()`, `saveSelectedFontId()`
- Storage key: `crossStitch.selectedFontId`
- Legacy functions: `loadCustomFonts()`, `saveFont()`, `deleteFont()`, `restoreFont()`
- Legacy storage key: `crossStitch.customFonts`
- Legacy storage key: `crossStitch.deletedFontIds`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Page: `src/app/generator/page.tsx`
- Related persistence: Supabase remote font storage
- Related product decision: deleted default fonts should be shared, not browser-local.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Local Storage decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Browser `localStorage` availability.
- Stored JSON strings.
- Generator settings object.
- Selected font id.
- Legacy custom font data.
- Legacy deleted font ids.
- Remote database availability for shared font state.

## Outputs

- Persisted browser-local generator settings.
- Persisted browser-local selected font id.
- Safe fallback values when storage or JSON parsing fails.
- Legacy local font data used only for migration or compatibility.
- Shared font deletion state should be saved to the database, not only localStorage.

## Worked Examples

### Corrupt settings fallback

Input:
- `crossStitch.generatorSettings` contains invalid JSON.

Output:
- `loadGeneratorSettings()` returns `{}` rather than throwing.

### Selected font persistence

Input:
- Selected font id: `block-needle-5x7`

Output:
- `crossStitch.selectedFontId` stores `block-needle-5x7`.

### Deleted default font state

Input:
- User deletes a default/shared font.

Expected output:
- The deletion is shared through the database so other browsers see the same font state.

## State Transitions

1. App checks whether `window.localStorage` is available.
2. Generator loads saved settings and selected font id on page load.
3. User changes generator settings.
4. Settings are written to localStorage.
5. Generator settings remain browser-local and are not synced to Supabase.
6. `useFonts()` reads legacy custom fonts and attempts remote migration when Supabase is configured.
7. Deleted default/shared font state should be stored in the shared database model rather than only hiding fonts in the current browser.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Browser-local generator preferences are acceptable. | Confirmed | Implemented | User confirmed generator preferences may remain local. |
| Generator settings should persist on reload. | Confirmed | Implemented | `crossStitch.generatorSettings`. |
| Generator settings should not be saved to Supabase later. | Confirmed | Implemented | User confirmed no Supabase sync for generator settings. |
| Selected font should persist for generator use. | Confirmed | Implemented | `crossStitch.selectedFontId`. |
| Bad localStorage JSON must not crash the app. | Assumed | Implemented | `readJson()` catches parse errors. |
| Custom font active source should be database-backed when configured. | Confirmed | Implemented | `useFonts()` saves via Supabase. |
| Browser-only custom font storage is legacy. | Assumed | Partially Implemented | Helpers remain and migration is attempted. |
| Deleted default/shared fonts should use shared persistence. | Confirmed | Not Implemented | User confirmed deleted default fonts should be shared; current legacy deleted ids are browser-local. |

## Negative Rules

- Must not crash when localStorage is unavailable.
- Must not trust corrupt JSON.
- Must not use localStorage as the only active custom font store when database sync is configured.
- Must not sync generator settings to Supabase.
- Must not store shared default-font deletion state only in one browser.
- Must not expose secret values in localStorage.
- Must not silently fall back to browser-only saves when database-backed data is expected.

## Acceptance Criteria

- Given generator settings are saved, when the page reloads in the same browser, then those settings are restored.
- Given generator settings are saved in one browser, when the user opens a different browser, then those settings do not need to sync through Supabase.
- Given selected font id is saved, when Generator opens, then that font is selected if available.
- Given corrupt JSON exists, when read, then fallback values are returned.
- Given localStorage is unavailable, then helper reads return fallbacks without crashing.
- Given legacy local custom fonts exist and Supabase is configured, then migration is attempted.
- Given a default/shared font is deleted, when another browser loads the font library, then the deleted state is reflected through shared persistence.

## Edge Cases

- Storage unavailable.
- Corrupt JSON.
- Selected font id no longer exists.
- Legacy deleted default font id.
- Large stored custom font payload.
- Browser privacy settings clearing storage.
- User changes generator settings in multiple browsers.
- Shared deleted font state conflicts with old local deleted ids.

## Current Code Behaviour

- Currently uses fixed keys beginning with `crossStitch.`.
- Currently catches JSON parsing failures silently.
- Currently writes generator settings as JSON.
- Currently selected font id is stored as a plain string.
- Currently legacy local custom fonts are filtered through validation before use.
- Currently deleted built-in/default font ids are browser-local through `crossStitch.deletedFontIds`.

## Known Gaps / Defects

- Deleted built-in/default font ids remain browser-local, which conflicts with the confirmed shared deletion requirement.
- Legacy local custom font helpers remain, which is acceptable only for migration/compatibility and not as an active source of truth.

## Unclear or Assumed Rules

- None currently for Local Storage. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Browser-local generator preferences are acceptable.
- Generator settings should not be saved to Supabase later.
- Deleted default fonts should be shared.

## Suggested Test Areas

- Settings read/write.
- Selected font read/write.
- Corrupt JSON fallback.
- Storage unavailable fallback.
- Generator settings remain browser-local.
- Legacy custom font migration path.
- Shared deleted default font persistence.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
