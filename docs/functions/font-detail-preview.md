# Font Detail Preview

## Purpose

Show a selected font in detail so users can inspect its supported characters before using it in the generator. The detail page is a browse/use surface, not an edit or management surface, and its header should stay lean.

## Source References

- Page: `src/app/fonts/[id]/page.tsx`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Function: `getCharacterGroups()` in `src/lib/fonts.ts`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Function: `saveSelectedFontId()` in `src/lib/localStorageUtils.ts`
- Related route: `/fonts/[id]`
- Related route: `/generator`
- Related persistence state: remote fonts loading through `useFonts()`
- Related previous UI decision: detail page removed duplicate, edit, delete, recommended and licence header actions/metadata.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Font Detail Preview decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Route parameter `id`.
- Available fonts from `useFonts()`.
- Font loading state.
- Font metadata.
- Font character map.
- User click on Use in generator.

## Outputs

- Detail page header with category, name and description.
- No height metadata in the detail header.
- No licence, attribution or recommended-use metadata on the detail page.
- Grouped character preview sections.
- Character cards with key, dimensions and grid.
- Loading state while remote fonts may still be loading.
- Not-found message only after loading state has resolved.
- Selected font id stored before generator navigation.

## Worked Examples

### Remote font loading

Input:
- URL: `/fonts/my-remote-font`
- Remote font list is still loading.

Expected output:
- The page shows a loading state rather than immediately showing Font not found.

### Missing font after load

Input:
- URL: `/fonts/missing-font`
- Font loading has completed.
- No local or remote font has id `missing-font`.

Expected output:
- The page shows a helpful Font not found state.

### Hidden header metadata

Input:
- Font has `defaultHeight`, licence and recommended-use data.

Expected output:
- The detail header shows the font identity and description, but not height, licence, attribution or recommended-use metadata.

## State Transitions

1. User opens `/fonts/[id]`.
2. Page reads route id and available fonts.
3. If fonts may still be loading, page shows a loading state.
4. After loading resolves, page finds the matching font.
5. If not found, not-found state is displayed.
6. If found, characters are grouped and rendered.
7. User can click Use in generator.
8. Selected font id is stored and user navigates to Generator.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Detail page must show the selected font. | Confirmed | Implemented | Product scope includes Font Detail. |
| Detail page must show supported characters. | Confirmed | Implemented | Characters are grouped and rendered. |
| Detail page is browse/use only. | Confirmed | Implemented | User confirmed this; edit/delete/duplicate should not be shown here. |
| Character dimensions should be visible. | Confirmed | Implemented | Card topline shows width x height. |
| Detail page should provide Use in generator. | Confirmed | Implemented | Button link exists. |
| Detail page must not show licence or attribution. | Confirmed | Implemented | User confirmed licence/attribution should not be visible on this page. |
| Recommended-use metadata must not be shown in the detail header. | Confirmed | Implemented | Previous UI request removed this metadata. |
| Height metadata must be hidden on the detail page. | Confirmed | Not Implemented | User confirmed height should be hidden; current code currently shows height. |
| Remote loading state should delay the not-found state. | Confirmed | Not Implemented | User confirmed this; current doc previously flagged not-found may appear too early. |
| Invalid font id should show a helpful state after loading resolves. | Confirmed | Implemented | Font not found message and back link. |

## Negative Rules

- Must not show duplicate, edit or delete actions on the detail page under current UI rules.
- Must not show licence or attribution on the detail page.
- Must not show recommended-use metadata in the detail header.
- Must not show height metadata on the detail page.
- Must not show Font not found while remote fonts are still loading.
- Must not clip large character previews.
- Must not mutate font data while previewing.
- Must not require generator settings changes before Use in generator.
- Must not make compact metadata consume unnecessary screen space.

## Acceptance Criteria

- Given a valid font id, when the detail page loads, then font name, category and description are visible.
- Given a valid font id, when the detail page loads, then height metadata is not shown.
- Given a font has uppercase characters, when the page loads, then uppercase previews are shown.
- Given a character preview, when displayed, then its width and height are visible.
- Given Use in generator is clicked, then the font id is saved for generator use.
- Given remote fonts are still loading, when the requested font is not yet in the local list, then the page shows loading rather than Font not found.
- Given loading has completed and the font id is invalid, then a Font not found state is shown.
- Given the detail page renders, then duplicate, edit and delete actions are not shown.
- Given the detail page renders, then licence and attribution are not shown.

## Edge Cases

- Remote fonts not loaded yet.
- Font id not found after loading completes.
- Font with only punctuation.
- Very wide or tall character.
- Empty character groups.
- Font with blank character grids.
- Font with missing or unusual height metadata.
- User navigates directly to a remote font URL on a slow connection.

## Current Code Behaviour

- Currently reads route params with `useParams()`.
- Currently loads fonts through `useFonts()`.
- Currently groups characters into Uppercase, Lowercase, Numbers and Punctuation.
- Currently scales preview cell size based on maximum character dimension.
- Currently renders only non-empty groups.
- Currently shows only Use in generator as the primary action.
- Currently shows height in the header.
- Currently does not show licence or attribution on the detail page.
- Currently may show Font not found before remote fonts have finished loading.

## Known Gaps / Defects

- Font-not-found may appear if remote fonts have not loaded yet and the requested font is remote; this conflicts with the confirmed loading-state rule.
- Height currently appears on the detail page, which conflicts with the confirmed decision to hide it.

## Unclear or Assumed Rules

- None currently for Font Detail Preview. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Detail page is browse/use only.
- Licence and attribution should not be visible on the detail page.
- Remote loading state should delay the not-found state.
- Recommended-use metadata should not appear in the detail header.
- Height metadata should be hidden on the detail page.

## Suggested Test Areas

- Valid font detail rendering.
- Invalid font id state after loading resolves.
- Remote font loading timing.
- Character grouping.
- Preview sizing.
- Use in generator action.
- Absence of edit/delete/duplicate actions.
- Absence of licence/attribution metadata.
- Absence of height metadata.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
