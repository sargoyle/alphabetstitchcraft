# Unsupported Characters

## Purpose

Ensure characters missing from the selected stitch font are visible to the user, represented safely in the generated pattern and reported clearly. V1 uses visible placeholder boxes for unsupported characters, falls back from lowercase to uppercase where possible, counts repeated unsupported characters, and treats tabs as unsupported characters rather than spacing.

## Source References

- File: `src/lib/renderTextToGrid.ts`
- Function: `renderLine()`
- Function: `placeholder()`
- Function: `renderTextToGrid()`
- Page: `src/app/generator/page.tsx`
- Type: `GeneratedPattern.unsupportedCharacters`
- Component: `TextPatternPreview`
- Related product decision: placeholder box is preferred v1 behaviour.
- Related product decision: uppercase fallback is desirable.
- Related product decision: unsupported duplicates should be counted.
- Related product decision: tabs should be treated as unsupported characters.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Unsupported Characters decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- User text.
- Selected font character map.
- Exact character key lookup.
- Uppercase fallback lookup.
- Font line height.
- Unsupported-character placeholder setting.
- Repeated unsupported character occurrences.
- Tab characters in pasted or typed text.

## Outputs

- Placeholder stitch grid for missing characters.
- `unsupportedCharacters` data as `{ character, count }` entries.
- Warning text on the Generator page.
- Visible placeholder in preview/export grid.
- Tab characters reported as unsupported, not converted to spaces.

## Worked Examples

### Uppercase fallback

Input:
- Text: `a`
- Font supports `A` but not `a`

Expected output:
- Uses `A` grid.
- Does not list `a` as unsupported.

### Unsupported duplicate counts

Input:
- Text: `A@@#`
- Font supports `A` but not `@` or `#`

Expected output:
- `@` is reported with count `2`.
- `#` is reported with count `1`.
- Visible placeholders are inserted for each unsupported occurrence.

### Tab handling

Input:
- Text contains a tab character.

Expected output:
- Tab is treated as an unsupported character, not as spacing.
- A placeholder appears where the tab occurs.
- The tab is included in unsupported reporting.

### Missing character

Input:
- Text: `A@`
- Font supports `A` but not `@`

Expected output:
- Renders `A` followed by a placeholder.
- Lists `@` in unsupported characters with count `1`.

## State Transitions

1. User enters text.
2. Renderer checks each character against the selected font.
3. If exact key is missing, uppercase fallback is checked.
4. If no character exists, placeholder is inserted.
5. Unsupported character occurrence is counted.
6. Tabs are treated as unsupported characters, not converted to spaces.
7. Final generated pattern includes unsupported character counts.
8. Generator warning displays the unsupported characters and counts.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Unsupported characters must not crash rendering. | Confirmed | Implemented | Placeholder is used. |
| Placeholder box is the preferred v1 behaviour. | Confirmed | Implemented | User confirmed placeholder box behaviour. |
| Unsupported characters should be visible. | Confirmed | Implemented | Placeholder box appears. |
| Unsupported characters must be reported. | Confirmed | Implemented | Generator warning lists them. |
| Unsupported duplicates should be counted. | Confirmed | Implemented | `UNSUPPORTED-002` verifies counted output. |
| Normal spaces should not be unsupported. | Confirmed | Implemented | Spaces use word spacing. |
| Tabs should be treated as unsupported characters. | Confirmed | Implemented | `UNSUPPORTED-003` verifies tabs are reported as unsupported at renderer utility level. |
| Lowercase should fall back to uppercase. | Confirmed | Implemented | User confirmed uppercase fallback is desirable. |
| Unsupported reporting should be clear. | Confirmed | Partially Implemented | Counts are implemented; warning still does not explain how to add or edit missing characters. |

## Negative Rules

- Must not silently drop unsupported characters.
- Must not treat unsupported characters as alignment padding.
- Must not mutate font data by creating missing characters automatically.
- Must not list normal spaces as unsupported.
- Must not treat tabs as spaces.
- Must not collapse unsupported duplicate counts once count reporting is implemented.
- Must not render unsupported characters as blank space in v1.

## Acceptance Criteria

- Given unsupported input, when rendered, then a placeholder appears in the grid.
- Given unsupported input, when rendered, then the unsupported character appears in the warning list.
- Given repeated unsupported input, then the warning reports the unsupported character with a count.
- Given lowercase input and uppercase exists, then uppercase fallback is used and no warning appears for that character.
- Given a normal space, then no unsupported warning is created for the space.
- Given a tab character, then an unsupported warning is created for the tab.
- Given a tab character, then the renderer does not convert it into word spacing.

## Edge Cases

- Emoji.
- Accented characters.
- Tabs.
- Newline characters.
- Repeated unsupported characters.
- Unsupported character next to spaces.
- Unsupported character in a very tall font.
- Unsupported characters repeated across multiple lines.

## Current Code Behaviour

- Currently reports unsupported characters as counted entries.
- Currently builds placeholder height from line height and width from height with min/max constraints.
- Currently ignores `placeholderUnsupported` as a behavioural switch.
- Currently displays unsupported characters in a comma-separated warning.
- Current tab handling reports tab characters as unsupported at renderer utility level.

## Known Gaps / Defects

- `placeholderUnsupported` does not appear to disable placeholder rendering, which is acceptable for v1 because placeholders are confirmed preferred behaviour.
- Warning does not explain how to add or edit missing characters.

## Unclear or Assumed Rules

- None currently for Unsupported Characters. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Placeholder box is the preferred v1 behaviour.
- Uppercase fallback is desirable.
- Unsupported duplicates should be counted.
- Tabs should be treated as unsupported characters.

## Suggested Test Areas

- Placeholder rendering.
- Warning list.
- Uppercase fallback.
- Emoji/accented input.
- Duplicate unsupported characters with counts.
- Tab characters as unsupported input.
- Spaces and line breaks.
- Unsupported characters across multiple lines.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
