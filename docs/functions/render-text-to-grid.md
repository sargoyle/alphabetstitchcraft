# Render Text To Grid

## Purpose

Convert typed lettering text into a generated cross-stitch pattern grid using a selected stitch font and render settings. The renderer is the core transformation between user text and the preview/export pattern.

## Source References

- File: `src/lib/renderTextToGrid.ts`
- Function: `renderTextToGrid()`
- Function: `renderLine()`
- Function: `appendCharacter()`
- Function: `appendBlank()`
- Function: `alignLine()`
- Type: `GeneratedPattern` in `src/lib/fontTypes.ts`
- Type: `TextRenderOptions` in `src/lib/fontTypes.ts`
- Type: `StitchFont` in `src/lib/fontTypes.ts`
- Page: `src/app/generator/page.tsx`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Related controls: letter spacing, word spacing, line spacing and alignment.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Render Text To Grid decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Text string from the generator textarea.
- Selected `StitchFont`.
- Font character map.
- Letter spacing.
- Word spacing.
- Line spacing.
- Alignment.
- Unsupported-character skip handling.
- Font `defaultHeight`.
- Individual character widths, heights and grids.
- Renderer-level numeric bounds for spacing options.

## Outputs

- A `GeneratedPattern` object.
- Generated pattern width and height in stitches.
- A rectangular grid represented as an array of `0`/`1` strings.
- Unsupported character list as `{ character, count }` entries.
- Preserved text and render settings in the result object.
- Data consumed by preview, PNG export and JSON export.

## Worked Examples

### Single word with letter spacing

Input:
- Text: `AB`
- A width: 3
- B width: 3
- Letter spacing: 1

Expected width:
- `3 + 1 + 3 = 7`

### Missing lowercase character

Input:
- Text: `aA`
- Font supports `A` but not `a`

Expected output:
- Renderer skips `a` and reports it as unsupported.
- Renderer still renders `A`.

### Unsupported character counts

Input:
- Text: `A@@#`
- Font supports `A` but not `@` or `#`

Expected output:
- `@` is reported with count `2`.
- `#` is reported with count `1`.
- Unsupported characters are skipped from the generated grid.

### Trailing spaces

Input:
- Text: `A `
- Word spacing: `3`

Expected output:
- Trailing space contributes blank columns to the final width.

### Whitespace-only text

Input:
- Text: `   `

Expected output:
- Treated as empty text, returning width `0`, height `0` and an empty grid.

## State Transitions

1. User changes text, font or render settings.
2. Generator page calls `renderTextToGrid()` inside `useMemo()`.
3. Renderer validates, clamps or rejects numeric options independently of the UI.
4. Renderer merges supplied options with default render options.
5. Empty text and whitespace-only text return an empty pattern.
6. Non-empty text is split into lines.
7. Each line is rendered from exact font character grids; missing lowercase characters are unsupported and are not replaced by uppercase.
8. Unsupported characters are skipped from the grid and counted for one warning message.
9. Maximum width is calculated, including confirmed trailing-space width.
10. Alignment is applied to each line.
11. Line spacing rows are inserted.
12. A `GeneratedPattern` is returned for preview/export.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Text must render into stitch-grid rows. | Confirmed | Implemented | Product scope requires custom text generation. |
| Spaces must be preserved inside non-empty text. | Confirmed | Implemented | Normal spaces add word spacing columns. |
| Whitespace-only text should be treated as empty. | Confirmed | Implemented | `RENDER-001` verifies spaces, tabs and line breaks produce an empty pattern. |
| Trailing spaces must contribute to final width. | Confirmed | Implemented | Covered by renderer tests. |
| Line breaks must be preserved. | Confirmed | Implemented | Text is split on CRLF/LF and line spacing rows are inserted. |
| Missing lowercase characters must not fall back to uppercase. | Confirmed | Implemented | Missing lowercase characters are skipped and reported in `unsupportedCharacters` so users know the font needs that character drawn. |
| Unsupported characters must be skipped rather than rendered as placeholders. | Confirmed | Implemented | User requested this in the 2026-07-07 update. |
| Repeated unsupported characters should be reported with counts. | Confirmed | Implemented | `UNSUPPORTED-002` verifies repeated unsupported characters are counted. |
| Final pattern must include width and height. | Confirmed | Implemented | Returned as `width` and `height`. |
| Renderer must not mutate font data. | Assumed | Implemented | Code reads character grids and builds new strings. |
| Renderer must enforce numeric bounds independently of the UI. | Confirmed | Implemented | `SPACING-001`, `SPACING-002`, `SPACING-003` and `SPACING-004` verify invalid values are rejected. |

## Negative Rules

- Must not mutate source font character grids.
- Must not silently crash on unsupported characters.
- Must not insert placeholder or junk graphics for unsupported characters.
- Must not collapse repeated unsupported characters into a unique-only list once counted reporting is implemented.
- Must not produce rows with inconsistent widths for non-empty valid input.
- Must not remove intentional line breaks.
- Must not remove trailing spaces from the width calculation for non-empty text.
- Must not render whitespace-only text as a visible blank pattern.
- Must not treat normal spaces as unsupported characters.
- Must not trust invalid numeric settings just because the UI is expected to constrain them.
- Must not recalculate or alter font metadata.

## Acceptance Criteria

- Given text `HELLO`, when rendered with a valid font, then the result has non-zero width, non-zero height and grid rows.
- Given text containing a normal space, when rendered, then the space contributes blank columns according to word spacing.
- Given text ends with a trailing space, when rendered, then that trailing space contributes to final width.
- Given multiline text, when rendered, then line spacing rows appear between rendered lines.
- Given a selected right alignment, when rendered, then shorter lines are padded before stitch content.
- Given an unsupported character, when rendered, then the character is skipped and listed in `unsupportedCharacters`.
- Given repeated unsupported characters occur, when rendered, then each unsupported character is reported with its count.
- Given empty text, when rendered, then width and height are `0` and grid is empty.
- Given whitespace-only text, when rendered, then width and height are `0` and grid is empty.
- Given a font without a lowercase character but with the matching uppercase character, when lowercase input is rendered, then the lowercase character is skipped and reported as unsupported.
- Given spacing values are negative, `NaN` or outside supported bounds, when rendering is attempted, then the renderer validates, clamps or rejects them consistently without relying only on the UI.

## Edge Cases

- Empty text.
- Spaces-only text.
- Leading spaces.
- Trailing spaces.
- Consecutive spaces.
- Multiple blank lines.
- Repeated unsupported characters.
- Font with mixed character heights.
- Character grid shorter than line height.
- Negative spacing values.
- `NaN` spacing values.
- Very large spacing values.
- Very long text.
- Invalid or missing font characters.

## Current Code Behaviour

- Currently merges provided render options with defaults.
- Currently returns an empty pattern when text is empty or whitespace-only.
- Currently uses the maximum of `font.defaultHeight` and all character heights as line height.
- Currently uses normal spaces as word spacing.
- Currently inserts letter spacing only when the next character exists and is not a space.
- Currently aligns each rendered line after maximum width is known.
- Currently requires an exact character key with filled stitches; missing lowercase characters are reported as unsupported rather than replaced by uppercase.
- Currently unsupported characters are skipped from the rendered grid.
- Currently returns unsupported characters as `{ character, count }` entries.
- Currently rejects invalid numeric spacing values inside the renderer.
- Currently returns a warning for very large generated patterns instead of enforcing a hard size limit.

## Known Gaps / Defects

- No remaining confirmed renderer gap for whitespace-only text, unsupported counts, placeholder removal or spacing numeric bounds after the renderer fix passes.

## Automated Test Evidence

- `RENDER-001` verifies that whitespace-only text returns width `0`, height `0` and an empty grid.
- `UNSUPPORTED-002` verifies that repeated unsupported characters return counted entries.
- `UNSUPPORTED-004` verifies that missing lowercase characters are skipped and reported instead of falling back to uppercase.
- `SPACING-001` verifies that negative letter spacing is rejected.
- `SPACING-002` verifies that very large letter spacing is rejected.
- `SPACING-003` verifies that invalid word spacing is rejected.
- `SPACING-004` verifies that `NaN` line spacing is rejected.
- `RENDER-002` verifies that very long generated patterns include a large-pattern warning while preserving row consistency.
- `GRID-001`, `GRID-002` and `GRID-003` currently pass for row width consistency, line spacing rows and alignment content preservation.

## Unclear or Assumed Rules

- None currently for Render Text To Grid. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Missing lowercase characters should be skipped and warned, not replaced with uppercase.
- Unsupported characters should be skipped from the grid and shown in a warning.
- Repeated unsupported characters should be listed with counts.
- Trailing spaces should contribute to final width.
- Renderer should enforce numeric bounds independently of the UI.
- Whitespace-only text should be treated as empty.

## Suggested Test Areas

- Single-word rendering.
- Spaces and word spacing.
- Trailing spaces.
- Multiline rendering.
- Alignment integration.
- Unsupported character skip behaviour.
- Unsupported character counts.
- Empty and whitespace-only input.
- Missing lowercase warning behaviour.
- Mixed character heights.
- Invalid spacing values.
- Renderer numeric bounds.


## 2026-07-07 Blank Character Warning Fix

- Blank character grids are treated as unavailable patterns during text generation.
- If a character key exists but has no filled stitches, the renderer skips it and reports it in `unsupportedCharacters`.
- Missing or blank lowercase characters are skipped and reported even when the uppercase character has stitches.
- This keeps Font Editor `Not created` state consistent with Create Pattern warnings.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.


