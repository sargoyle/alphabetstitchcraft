# Alignment Rules

## Purpose

Alignment controls how each rendered text line is horizontally positioned within the final pattern width after all lines have been rendered and the maximum line width is known. It affects blank padding around rendered line content and should not alter the stitch content inside the line.

## Source References

- File: `src/lib/renderTextToGrid.ts`
- Function: `renderTextToGrid()`
- Function: `renderLine()`
- Function: `alignLine()`
- Function: `blank()`
- Type: `TextAlignment` in `src/lib/fontTypes.ts`
- Type: `TextRenderOptions` in `src/lib/fontTypes.ts`
- Type: `GeneratedPattern` in `src/lib/fontTypes.ts`
- Component: `SpacingControls` in `src/components/SpacingControls.tsx`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Page: `src/app/generator/page.tsx`
- Utility: `patternToCanvas()` in `src/lib/exportUtils.ts`
- Related setting: `alignment`
- Related settings affecting line width: `letterSpacing`, `wordSpacing`, `lineSpacing`
- Related generated output: `GeneratedPattern.grid`, `GeneratedPattern.width`, `GeneratedPattern.height`
- Evidence gap: no separate runtime validation was found for invalid alignment values before `alignLine()` receives them.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for alignment decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Rendered line grid: an array of row strings produced by `renderLine()`.
- Maximum pattern width: calculated from the widest rendered line before alignment is applied.
- Selected alignment value: `left`, `center` or `right`.
- Blank cell value: `0`, produced by `blank(width)`.
- Line width: derived from `rows[0]?.length` in `alignLine()`.
- Remaining width: `Math.max(0, width - currentWidth)`.
- Multiline text input: split in `renderTextToGrid()` by `/\r?\n/`.
- Spacing settings: letter, word and line spacing can change rendered line widths before alignment.
- Unsupported character placeholders: unsupported characters can affect line width before alignment.

## Outputs

- Aligned line grid with blank cells added to the left and/or right of each row.
- Leading blank columns for centre and right alignment where needed.
- Trailing blank columns for left and centre alignment where needed.
- Final rows matching the maximum pattern width.
- A final generated pattern grid used by preview and export.
- `GeneratedPattern.width` representing the final aligned width.
- `GeneratedPattern.grid` containing aligned rows and line-spacing rows.

## Worked Examples

### Left alignment

Input:
- Final width: 6
- Line width: 4
- Remaining width: 2
- Rendered row: `1111`

Output:
- `111100`

### Right alignment

Input:
- Final width: 6
- Line width: 4
- Remaining width: 2
- Rendered row: `1111`

Output:
- `001111`

### Centre alignment with even remaining width

Input:
- Final width: 8
- Line width: 4
- Remaining width: 4
- Rendered row: `1111`

Output:
- `00111100`

### Centre alignment with odd remaining width

Input:
- Final width: 7
- Line width: 4
- Remaining width: 3
- Rendered row: `1111`

Current output:
- `0111100`

Decision required:
- Confirm whether the extra blank column should remain on the right.

## State Transitions

1. User enters or updates text in the Generator page.
2. User may also update spacing or alignment settings.
3. `renderTextToGrid()` splits the text into source lines.
4. The system renders each line into stitch grid rows using `renderLine()`.
5. The system calculates the maximum rendered line width across all rendered lines.
6. The system applies `alignLine()` to each rendered line using the selected alignment value.
7. `alignLine()` pads rows with blank `0` cells.
8. The system adds line-spacing rows between rendered lines when needed.
9. The system returns a final `GeneratedPattern` where each row should have consistent width.
10. `TextPatternPreview` renders the aligned grid.
11. Export utilities use the generated pattern grid for PNG and JSON export.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Alignment must be available in the text generator. | Confirmed | Implemented | Project scope explicitly requires text alignment: left, centre and right. |
| Alignment must be applied after line rendering and width calculation. | Confirmed | Implemented | User confirmed alignment applies per rendered line within final pattern width. |
| Left alignment must add no leading blank columns. | Assumed | Implemented | Inferred from standard left alignment and current implementation. |
| Right alignment must add all remaining blank columns before the line content. | Assumed | Implemented | Inferred from standard right alignment and current implementation. |
| Centre alignment must split remaining blank columns between left and right padding. | Assumed | Implemented | Inferred from standard centre alignment and current implementation. |
| When remaining width is odd, centre alignment must place the extra blank column on the left. | Confirmed | Not Implemented | User confirmed the extra blank column should not remain on the right; current code puts it on the right. |
| Alignment must not change the stitched content of each character. | Confirmed | Implemented | User confirmed alignment should preserve stitch content and shape. |
| Alignment must not change the calculated height of a rendered line. | Assumed | Implemented | `alignLine()` maps existing rows and does not add/remove rows. |
| All rows in the final generated pattern must have consistent width. | Confirmed | Implemented for valid rendered lines | Confirmed as part of final pattern width behaviour. |
| Empty lines must be ignored. | Confirmed | Not Implemented | User confirmed empty lines should be ignored; current code appears to preserve blank lines as blank rows. |
| Invalid alignment values must fail loudly. | Confirmed | Not Implemented | User confirmed invalid values should fail loudly; current code appears to fall through like left alignment. |
| Exported alignment must match preview alignment exactly. | Confirmed | Partially Implemented | User confirmed export should match preview; export uses the aligned grid but separate visual settings may still differ. |

## Negative Rules

- Alignment must not change filled stitch cells.
- Alignment must not mutate source font character data.
- Alignment must not remove lines.
- Alignment must not collapse intentional blank lines unless confirmed by product decision.
- Alignment must not create rows with inconsistent widths.
- Alignment must not apply before the final maximum width is known.
- Alignment must not treat unsupported characters as alignment padding.
- Alignment must not alter line height.
- Alignment must not change letter spacing, word spacing or line spacing values.

## Acceptance Criteria

- Given two rendered lines with widths 4 and 6, when left alignment is selected, then both lines have final width 6 and the shorter line becomes `111100` when its rendered row is `1111`.
- Given two rendered lines with widths 4 and 6, when right alignment is selected, then both lines have final width 6 and the shorter line becomes `001111` when its rendered row is `1111`.
- Given a rendered row `1111`, final width 8 and centre alignment, when alignment is applied, then the output row is `00111100`.
- Given a rendered row `1111`, final width 7 and centre alignment, when alignment is applied, then the output must be `0011110` with the extra blank column on the left.
- Given a line contains filled stitch cells, when alignment is applied, then the filled stitch cells remain in the same order and shape.
- Given multiline text is rendered, when alignment is applied, then each line is aligned against the same final pattern width.
- Given a generated grid is exported, when export uses the generated grid, then horizontal alignment positions match the preview grid structure.
- Given an invalid alignment value reaches the renderer, when rendering is attempted, then rendering must fail loudly rather than silently falling back to left alignment.

## Edge Cases

- Single-line text.
- Multiline text with unequal widths.
- Empty text.
- Text with spaces only.
- Intentional blank lines.
- Odd remaining width for centre alignment.
- Even remaining width for centre alignment.
- Zero remaining width.
- Very long lines.
- Unsupported characters inside aligned text.
- Trailing spaces.
- Leading spaces.
- Line width greater than expected maximum due to rendering error.
- Invalid alignment value.
- Missing alignment setting.
- All lines empty or whitespace-only.

## Current Code Behaviour

- Alignment currently appears to be applied after line rendering.
- Maximum width is currently calculated in `renderTextToGrid()` using the widest rendered line row length.
- Left alignment currently adds no leading blank cells and pads the right side.
- Centre alignment currently calculates left padding with `Math.floor(remaining / 2)` and puts any odd remainder on the right. This conflicts with the confirmed requirement to put the extra column on the left.
- Right alignment currently adds all remaining blank cells to the left.
- Empty lines currently appear to become blank rows at the computed line height. This conflicts with the confirmed requirement that empty lines should be ignored.
- If the entire text is empty (`text.length === 0`), the renderer returns width `0`, height `0` and an empty grid.
- Invalid alignment values are not explicitly handled. A value outside `left`, `center` or `right` would currently behave like left alignment because the conditional checks only special-case `center` and `right`; this conflicts with the confirmed fail-loudly requirement.
- Alignment behaviour is centralised in `alignLine()` and does not appear to be duplicated elsewhere.
- Preview and export both use `GeneratedPattern.grid`; export does not have separate alignment logic, but it does have separate visual rendering settings.

## Known Gaps / Defects

- Odd-width centre alignment is confirmed to place the extra blank column on the left, but current code appears to place it on the right.
- Empty lines are confirmed to be ignored, but current code appears to preserve them as blank rows.
- Invalid alignment values are confirmed to fail loudly, but current code does not explicitly validate or reject them.
- Alignment must apply to export exactly as shown in preview; current export uses the aligned grid but does not guarantee exact visual parity for settings such as zoom or grid visibility.

## Unclear or Assumed Rules

- None currently for alignment. The previously listed alignment assumptions and product questions have been answered.

## Confirmed Product Decisions

- Alignment applies per rendered line within the final pattern width.
- Blank padding uses   cells.
- Alignment preserves intentional line breaks, except empty lines should be ignored.
- Alignment preserves the stitch content and shape of each rendered line.
- Odd centre alignment places the extra blank column on the left.
- Leading and trailing spaces typed by the user are preserved before alignment is applied.
- Alignment applies to export exactly as shown in preview.
- Invalid alignment values must fail loudly.

## Suggested Test Areas

- Left alignment.
- Centre alignment.
- Right alignment.
- Odd remaining width, including confirmed left-side extra padding.
- Even remaining width.
- Multiline rendering.
- Empty lines.
- Leading spaces.
- Trailing spaces.
- Invalid alignment values.
- Preview/export consistency.
- Row width consistency.
- Preservation of stitch content.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.



