# Export PNG

## Purpose

Allow users to download the generated lettering pattern as a PNG image for use outside the app. PNG remains the single-image digital export for the complete generated pattern. It should match the PDF rendering rules where practical, including 10-stitch grouping, centre guide lines and total pattern dimensions.

## Source References

- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- File: `src/lib/exportUtils.ts`
- Function: `patternToCanvas()`
- Function: `exportPatternPng()`
- Type: `GeneratedPattern`
- Related setting: grid visibility
- Related setting: filled stitch visibility
- Related setting: preview zoom
- Related visual guide: centre-point horizontal and vertical guide lines
- Evidence: `ExportControls` now passes preview grid and filled-stitch visibility settings into `exportPatternPng()`.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Export PNG decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Generated pattern grid.
- Pattern width and height.
- Pattern text.
- Canvas availability.
- Default filename.
- Fixed export cell size.
- Canvas margin.
- Preview grid visibility setting.
- Preview filled stitch visibility setting.
- Centre guide line drawing.
- Browser download support.

## Outputs

- Downloaded PNG file.
- Canvas drawing of pattern grid.
- Status message in export controls.
- Error message if canvas is unavailable or export fails.
- Image export that honours preview visibility settings.
- Image export that includes centre guide lines at the exact middle of the pattern.
- Total pattern dimensions displayed on the exported image.
- 10-stitch grouping lines.
- Centre guide lines matching PDF centre-guide calculation.

## Worked Examples

### Canvas size

Input:
- Pattern width: `4`
- Pattern height: `3`
- Cell size: `18`
- Margin: `18`

Output:
- Canvas width: `4 * 18 + 36 = 108`
- Canvas height: `3 * 18 + 36 = 90`

### Grid visibility

Input:
- Preview grid visibility: off
- Pattern contains filled stitches

Expected output:
- PNG shows the filled stitches without grid lines.

### Metadata

Input:
- Font name: `Tiny Serif 7x9`
- Pattern size: `84 x 21`

Expected output:
- PNG contains only the rendered pattern image, not title text, font name or printed dimensions.

### Centre guide lines

Input:
- Pattern width: `2`
- Pattern height: `2`
- Cell size: `10`
- Margin: `10`

Expected output:
- Vertical guide line is drawn at `x = 20`.
- Horizontal guide line is drawn at `y = 20`.
- Guide lines use a distinct blue colour.

## State Transitions

1. User generates a non-empty pattern.
2. Export controls calculate `canExport`.
3. User chooses preview visibility settings.
4. User clicks Export PNG.
5. Pattern is rendered to a canvas using the confirmed export style and visibility settings.
6. Centre guide lines are drawn over the rendered pattern.
7. Canvas data URL is assigned to a temporary link.
8. Browser download is triggered.
9. Status message updates.
10. The generated pattern and preview state remain unchanged.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must be able to export PNG. | Confirmed | Implemented | Product scope requires PNG export. |
| PNG is the primary export for the created visual pattern. | Confirmed | Implemented | Product scope prioritises PNG export. |
| Export should be disabled for empty patterns. | Assumed | Implemented | `canExport` checks dimensions and text. |
| Export should include grid and filled cells when those preview settings are enabled. | Confirmed | Implemented | `EXPORT-001`, `EXPORT-002` and `PARITY-001` cover utility-level behaviour. |
| Export must honour preview visibility settings. | Confirmed | Implemented | `ExportControls` passes `showGrid` and `showFilled` to PNG export. |
| Fixed export cell size is acceptable for v1. | Confirmed | Implemented | User confirmed fixed export cell size is acceptable. |
| Preview zoom does not need to control PNG cell size. | Confirmed | Implemented | User confirmed fixed export cell size takes precedence over preview zoom in v1. |
| Exported PNG must include horizontal and vertical centre guide lines at the exact middle of the pattern. | Confirmed | Implemented | `EXPORT-005` verifies canvas centre-guide drawing. |
| Exported PNG must include 10-stitch grouping lines. | Confirmed | Implemented | Grid drawing uses darker/thicker lines every 10 stitches. |
| Exported PNG must display total pattern dimensions. | Confirmed | Implemented | Canvas header writes total dimensions as `W x H Squares`. |
| Centre guide lines must be visually distinct from normal grid lines. | Confirmed | Implemented | Canvas uses blue guide lines instead of the paper grid colour. |
| Exported PNG must not include title, dimensions or font name metadata for now. | Confirmed | Implemented | User confirmed additional print values are future-feature decisions. |
| Export must not change the generated pattern. | Assumed | Implemented | Reads pattern only. |
| Additional print values may be considered as a future feature. | Confirmed | Implemented | Not part of v1. |

## Negative Rules

- Must not export empty patterns.
- Must not mutate `GeneratedPattern`.
- Must not require database access.
- Must not silently fail without user-facing message.
- Must not add title text to PNG in v1.
- Must not add stitch dimensions to PNG in v1.
- Must not add font name to PNG in v1.
- Must not ignore preview visibility settings.
- Must not omit centre guide lines from the PNG export.
- Must not mutate pattern grid rows to add centre guide lines.
- Must not treat future print metadata as part of the current export requirement.

## Acceptance Criteria

- Given a generated pattern has width greater than `0`, height greater than `0` and non-empty text, when Export PNG is clicked, then a PNG download is triggered.
- Given a generated pattern has empty trimmed text, when export controls render, then Export PNG is disabled.
- Given `canvas.getContext("2d")` is unavailable, when PNG export is attempted, then an error message is shown to the user.
- Given a pattern row contains `1` cells and filled stitch visibility is enabled, when the canvas is drawn, then those cells are drawn with filled-cell styling.
- Given filled stitch visibility is disabled in the preview, when PNG export is clicked, then the PNG honours that hidden filled-stitch setting.
- Given grid visibility is enabled in the preview, when PNG export is clicked, then grid rectangles are drawn for each pattern cell.
- Given grid visibility is disabled in the preview, when PNG export is clicked, then the PNG does not draw grid lines.
- Given a valid generated pattern, when PNG export is clicked, then the image uses the fixed v1 export cell size.
- Given a valid generated pattern, when PNG export is clicked, then the image includes vertical and horizontal centre guide lines at the exact pattern midpoint.
- Given grid visibility is disabled, when PNG export is clicked, then centre guide lines remain visible.
- Given a valid generated pattern, when PNG export is clicked, then the PNG includes total pattern dimensions and does not include unrelated decorative metadata.

## Edge Cases

- Width or height zero.
- Empty trimmed text.
- Very large pattern.
- Canvas unavailable.
- Browser blocks download.
- Pattern rows with inconsistent widths.
- Grid visibility off.
- Filled stitch visibility off.
- Preview zoom differs from fixed export cell size.
- Odd pattern width or height.
- Even pattern width or height.
- Centre guide line with grid visibility off.
- User expects print metadata that is not part of v1.

## Current Code Behaviour

- Currently uses fixed cell size `18` and margin equal to one cell.
- Currently fills paper background, filled cells when `showFilled` is enabled and grid strokes when `showGrid` is enabled.
- Currently draws blue centre guide lines after cells and grid are drawn.
- Currently receives preview grid and filled-stitch visibility settings from `ExportControls`.
- Currently does not use current preview zoom, which matches the fixed export cell-size decision.
- Currently adds total pattern dimensions to the PNG header and avoids unrelated decorative metadata.

## Known Gaps / Defects

- Export does not include metadata such as font name or dimensions, which is correct for v1 after the latest product decision.
- Full pixel-level CSS preview versus canvas export parity is not automated in the utility test runner.

## Automated Test Evidence

- `EXPORT-001` verifies that `patternToCanvas()` honours `showGrid: false` at utility level by avoiding grid stroke drawing while still drawing filled cells.
- `EXPORT-002` verifies that `patternToCanvas()` honours `showFilled: false` at utility level.
- `EXPORT-003` verifies empty patterns produce a safe margin-only canvas.
- `EXPORT-005` verifies canvas export draws centre guide lines through the exact middle of the pattern and can disable them at utility level.
- `PARITY-001` verifies canvas export uses the provided grid by matching filled-cell and grid-cell draw counts.
- Source review confirms `ExportControls` passes preview visibility settings to `exportPatternPng()`.

## Unclear or Assumed Rules

- None currently for Export PNG. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Fixed export cell size is acceptable for v1.
- Preview zoom does not need to control PNG cell size because fixed export cell size is confirmed for v1.
- Export must honour preview visibility settings.
- Exported PNG should not include title, dimensions or font name for now.
- Additional print values may be considered and confirmed as a future feature.

## Suggested Test Areas

- Export enabled/disabled.
- Canvas dimensions with fixed cell size.
- Filled cell drawing.
- Filled stitch visibility off.
- Grid drawing.
- Grid visibility off.
- Export error handling.
- Preview/export visibility consistency.
- Confirm no title, dimensions or font name are drawn.
- Centre guide placement for odd and even pattern dimensions.
- Centre guide visibility when grid visibility is off.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
