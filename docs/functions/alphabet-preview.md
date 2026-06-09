# Alphabet Preview

## Purpose

Display the full supported character set for a selected stitch font so users can inspect character shapes and dimensions on a stitch grid.

## Source References

- Page: `src/app/fonts/[id]/page.tsx`
- Function: `getCharacterGroups()` in `src/lib/fonts.ts`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Type: `StitchFont` in `src/lib/fontTypes.ts`
- Type: `StitchCharacter` in `src/lib/fontTypes.ts`


## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for alphabet preview decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Selected `StitchFont`.
- Font character map.
- Character keys.
- Character width and height.
- Character grid data.
- Preview cell size calculated from dimensions.

## Outputs

- Grouped alphabet sections.
- Character cards.
- Character labels.
- Character dimensions.
- Read-only stitch grid previews.

## State Transitions

1. A font is selected by route id.
2. Character keys are grouped by type.
3. Empty groups are skipped.
4. Each character is rendered in a card.
5. The read-only grid preview is shown for each character.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must see the full supported mapped character set, excluding blank/unmapped characters until edited. | Confirmed | Partially Implemented | Product scope requires alphabet preview; user confirmed blank/unmapped characters should be hidden until edited. Current code appears to show all mapped blank characters. |
| Characters should be grouped by English uppercase, English lowercase, numbers and punctuation for v1. | Confirmed | Implemented | User confirmed English-only for now; multi-language can be future work. |
| Each character should show dimensions. | Confirmed | Implemented | Width x height shown. |
| Each character must render on a visible grid. | Confirmed | Implemented | `CharacterGrid` is used. |
| Empty groups should be hidden. | Confirmed | Implemented | User confirmed empty groups should be hidden. |

## Negative Rules

- Must not edit character data from the alphabet preview.
- Must not hide supported characters inside non-empty groups.
- Must not clip large character grids.
- Must not classify punctuation as letters or numbers.

## Acceptance Criteria

- Given a font with uppercase letters, when opened, then an Uppercase section is shown.
- Given a font with lowercase letters, when opened, then a Lowercase section is shown.
- Given a font with numbers, when opened, then a Numbers section is shown.
- Given punctuation characters, when opened, then a Punctuation section is shown.
- Given a character card, then the character key and dimensions are visible.
- Given a blank/unmapped character has not been edited, then it should be hidden from alphabet preview.

## Edge Cases

- Font with only uppercase.
- Font with only blank generated characters.
- Non-ASCII character keys.
- Very large character dimensions.
- Empty character map.
- Character keys that are more than one code point.

## Current Code Behaviour

- Currently sorts keys inside each group.
- Currently uses ASCII regular expressions for grouping, which matches the confirmed English-only v1 scope.
- Currently treats any non-letter/non-digit as punctuation.
- Currently does not render headings for empty groups, which matches the confirmed behaviour.

## Known Gaps / Defects

- Non-English or multi-code-point characters are not specially grouped.
- Product has not confirmed whether blank generated characters should all be visible.

## Unclear or Assumed Rules

- None currently for alphabet preview. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- ASCII/English grouping is sufficient for v1.
- Empty groups should be hidden.
- Non-English and multi-language character support is a future feature.
- Blank or unmapped characters should be hidden until edited.

## Suggested Test Areas

- Grouping by character type.
- Read-only grid rendering.
- Dimension display.
- Large character preview sizing.
- Blank/unmapped character hiding.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.


