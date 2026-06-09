# Export JSON

## Purpose

Allow users to download generated pattern data or font data as JSON for reuse, inspection or handoff. JSON export is a utility feature for designers/developers; it is not the primary visual export, and it should not add schema or app version metadata in v1.

## Source References

- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Page: `src/app/custom-fonts/page.tsx`
- File: `src/lib/exportUtils.ts`
- Function: `exportPatternJson()`
- Function: `exportFontJson()`
- Function: `downloadJson()`
- Function: `safeFilename()`
- Types: `GeneratedPattern`, `StitchFont`
- Related export feature: PNG image export is the primary user-facing export format.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Export JSON decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Generated pattern object.
- Stitch font object.
- Font name for filename generation.
- Default pattern export filename.
- Browser download support.

## Outputs

- JSON download for generated pattern.
- JSON download for font, where the current UI exposes it.
- Safe filename for font export.
- Status message after pattern JSON export.
- No schema version, app version or extra metadata added to the exported JSON in v1.

## Worked Examples

### Font filename

Input:
- Font name: `Tiny Serif 7x9!`

Output:
- JSON filename: `tiny-serif-7x9.font.json`

### Pattern JSON shape

Input:
- Generated pattern object with `fontId`, `text`, spacing settings, dimensions and grid.

Output:
- The generated pattern object serialised as JSON with no added schema or app version metadata.

## State Transitions

1. User generates a valid pattern or opens a font export action.
2. User clicks Export JSON.
3. App serialises the selected object with two-space indentation.
4. App creates a Blob and temporary object URL.
5. Browser download is triggered.
6. Object URL is revoked.
7. The app state remains unchanged.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Generated pattern JSON export is optional but allowed in v1. | Confirmed | Implemented | Original scope listed optional JSON export. |
| JSON export is a utility feature for designers/developers. | Confirmed | Implemented | User confirmed the assumption. |
| JSON exports must not include schema or app version metadata in v1. | Confirmed | Implemented | Current code serialises the object directly without adding metadata. |
| JSON import is not part of v1. | Confirmed | Implemented | User confirmed import may be a whole future feature. |
| Font JSON export is available from Manage Fonts where exposed by the current UI. | Confirmed | Implemented | User confirmed font JSON export remains useful as a developer/designer utility. |
| JSON export must not mutate source objects. | Assumed | Implemented | Serialises only. |
| Filenames should be safe for download. | Assumed | Implemented for font export | Pattern filename is fixed. |
| PNG/image export remains the primary user-facing export. | Confirmed | Implemented | Product scope prioritises PNG image export. |

## Negative Rules

- Must not write JSON back into app state during export.
- Must not require database access.
- Must not expose secrets.
- Must not export when generated pattern is empty.
- Must not add schema version metadata in v1.
- Must not add app version metadata in v1.
- Must not imply that JSON import exists in v1.
- Must not treat JSON export as the primary visual export; users should use PNG for the created image.

## Acceptance Criteria

- Given a valid generated pattern, when Export JSON is clicked, then a JSON download is triggered.
- Given an empty pattern, then pattern JSON export is disabled.
- Given a font with spaces or punctuation in its name, when exported, then filename is normalised.
- Given JSON is downloaded, then it contains the exported pattern or font object.
- Given JSON is downloaded in v1, then it does not include schema version metadata.
- Given JSON is downloaded in v1, then it does not include app version metadata.
- Given a user has a JSON file, when using v1, then there is no JSON import workflow presented as available.

## Edge Cases

- Empty pattern.
- Font name with punctuation.
- Font name with only unsupported filename characters.
- Very large grid data.
- Browser download blocked.
- JSON export requested before a pattern is generated.
- User expects image output from export controls and chooses PNG instead of JSON.

## Current Code Behaviour

- Currently pattern JSON filename is `stitch-lettering-pattern.json`.
- Currently font JSON filename is derived from lowercased font name and falls back to `stitch-font`.
- Currently JSON is formatted with two-space indentation.
- Currently JSON export serialises the object directly and does not appear to add schema or app version metadata.
- Currently there is no import counterpart.

## Known Gaps / Defects

- There is no JSON import flow, which is acceptable for v1 because import is a separate future feature.
- Font JSON export is implemented, but its long-term role should be revisited if future import/export font pack features are prioritised.

## Automated Test Evidence

- `PARITY-002` verifies generated pattern JSON export preserves the source `GeneratedPattern` object, including grid, dimensions and warnings.
- `EXPORT-004` verifies empty pattern JSON export preserves safe empty data at utility level.

## Unclear or Assumed Rules

- None currently for Export JSON. The previously listed assumption has been confirmed.

## Confirmed Product Decisions

- JSON export is a utility feature for designers/developers.
- Font JSON export remains useful as a developer/designer utility even though PNG is the primary visual export.
- JSON exports should not include schema metadata in v1.
- JSON exports should not include app version metadata in v1.
- JSON import may be considered later, but it would be a separate future feature.
- The created image should be handled through PNG export rather than JSON metadata.

## Suggested Test Areas

- Pattern JSON export.
- Font JSON export.
- Filename sanitisation.
- Empty export disabled state.
- JSON payload shape.
- Confirm no schema metadata is added.
- Confirm no app version metadata is added.
- Confirm no JSON import UI is present in v1.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.



