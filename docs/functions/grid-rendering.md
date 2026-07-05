# Grid Rendering

## Purpose

Render stitch data as readable square graph-paper grids for generated text patterns, font card previews, alphabet previews, character editing and PNG export. V1 uses simple filled-square rendering rather than X-shaped stitches.

## Source References

- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Component: `FontGridPreview` in `src/components/FontGridPreview.tsx`
- Styles: `src/app/globals.css`
- Utility: `patternToCanvas()` in `src/lib/exportUtils.ts`
- Type: `GeneratedPattern`
- Type: `StitchCharacter`
- Related setting: grid visibility
- Related setting: filled stitch visibility
- Related visual guide: centre-point horizontal and vertical lines
- Related export: PNG canvas rendering

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Grid Rendering decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Pattern grid rows.
- Character grid rows.
- Pattern width and height.
- Character width and height.
- Zoom or cell size.
- Mini-preview cell size.
- Show grid flag.
- Show filled/stitch visibility flag.
- Editable flag for character grid.
- Export grid visibility setting.
- Export stitch visibility setting.
- Centre guide visibility for generated pattern previews and PNG exports.

## Outputs

- Square visual cells.
- Filled-square stitch styling.
- Optional grid-line styling.
- Scrollable generated pattern area.
- Editable buttons for character cells where editing is enabled.
- Non-interactive cells where previews are read-only, once accessibility requirements are implemented.
- Canvas output for PNG export that honours grid and stitch visibility settings.
- Centre-point horizontal and vertical guide lines in a distinct colour from normal grid lines.

## Worked Examples

### Generated row rendering

Input row:
- `101`

Output cells:
- Filled cell, empty cell, filled cell.

### Hidden filled stitches

Input row:
- `101`
- `showFilled`: `false`

Output cells:
- Three cells render, but filled styling is not applied.

### Mini preview below generated-preview clamp

Input:
- Font card preview cell size: `6`
- Generated pattern preview minimum clamp: `8`

Expected output:
- Mini preview may use `6` so compact card previews remain compact, even if generated pattern previews clamp to a larger minimum.

### Export visibility parity

Input:
- Preview grid visibility: off
- Preview stitch visibility: on

Expected output:
- PNG export shows stitches but does not draw grid lines.

### Centre guide

Input:
- Pattern width: `6`
- Pattern height: `5`

Expected output:
- A vertical guide line is drawn at 50% of the pattern width.
- A horizontal guide line is drawn at 50% of the pattern height.
- The guide colour is visually distinct from the normal grid line colour.

## State Transitions

1. Renderer or font data supplies grid rows.
2. Preview component receives grid and display settings.
3. CSS grid columns are calculated from width and cell size.
4. Each cell is rendered as filled or empty using filled-square styling.
5. User display controls may hide grid lines or filled styling.
6. Mini previews may use smaller cell sizes than generated pattern previews.
7. Export uses generated grid data and visibility settings to draw canvas cells.
8. Generated pattern preview overlays centre guide lines at the exact midpoint of the pattern.
9. PNG export draws matching centre guide lines after grid and filled-cell drawing.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Stitch cells must be square. | Confirmed | Implemented | CSS grid uses equal cell size variable. |
| Filled cells must be visually distinct. | Confirmed | Implemented | Filled classes are applied. |
| Empty cells should show as grid squares when grid is enabled. | Confirmed | Implemented | Grid classes are applied. |
| Large generated patterns should not break layout. | Confirmed | Implemented | Pattern container scrolls. |
| V1 should use filled squares, not X-shaped stitches. | Confirmed | Implemented | User confirmed filled-square rendering is sufficient for v1. |
| Export should use the generated grid. | Confirmed | Implemented | Canvas iterates pattern grid. |
| Export must honour grid visibility. | Confirmed | Implemented | `EXPORT-001` verifies hidden grid drawing at utility level. |
| Export must honour filled stitch visibility. | Confirmed | Implemented | `EXPORT-002` verifies hidden filled-cell drawing at utility level. |
| Generated pattern preview must show the exact centre point with horizontal and vertical guide lines. | Confirmed | Implemented | Preview overlays blue centre guide lines at 50% width and height. |
| PNG export must show the exact centre point with horizontal and vertical guide lines. | Confirmed | Implemented | Canvas export draws centre guide lines after cells are drawn. |
| Centre guide lines must use a different colour from normal grid lines. | Confirmed | Implemented | Preview and export use blue guide lines rather than paper-coloured grid lines. |
| Mini previews may allow cell sizes below the generated preview clamp. | Confirmed | Not Implemented | Current `FontGridPreview` passes zoom `6`, but `TextPatternPreview` clamps to `8`. |
| Visibility toggles must not alter underlying grid data. | Assumed | Implemented | Display settings affect styling, not grid rows. |

## Negative Rules

- Must not stretch cells into rectangles.
- Must not clip large patterns without scroll/fitting.
- Must not change underlying grid data when toggling visibility.
- Must not render filled cells when filled visibility is off in preview or export.
- Must not draw grid lines in export when grid visibility is off.
- Must not hide centre guide lines inside normal grid-line styling.
- Must not alter pattern grid data to add centre guides.
- Must not require mini previews to use the same minimum cell size as generated previews.
- Must not introduce X-shaped stitch display in v1 unless a future feature changes the rendering mode.

## Acceptance Criteria

- Given a generated pattern, when rendered, then cells are square.
- Given grid visibility is on, then empty cells have visible grid lines.
- Given grid visibility is off, then grid line class is not applied.
- Given filled visibility is off, then filled styling is not applied in preview.
- Given grid visibility is off in preview, when PNG export is triggered, then the exported PNG does not draw grid lines.
- Given filled stitch visibility is off in preview, when PNG export is triggered, then the exported PNG honours that hidden stitch visibility setting.
- Given a font card mini preview requests a cell size below the generated preview clamp, when the mini preview renders, then it may use the smaller cell size.
- Given a large pattern, then the preview area scrolls instead of breaking the page.
- Given export is triggered, then canvas dimensions reflect pattern width and height.
- Given a generated pattern preview is shown, then horizontal and vertical centre guide lines appear at the exact middle of the pattern.
- Given PNG export is triggered, then horizontal and vertical centre guide lines appear at the exact middle of the exported pattern image.
- Given normal grid lines are visible, then centre guide lines remain visually distinct.

## Edge Cases

- Width zero.
- Height zero.
- Very large width.
- Very large height.
- Tiny zoom.
- Maximum zoom.
- Mini-preview cell size below generated-preview clamp.
- Mixed character preview sizes.
- Blank grids with no filled cells.
- Export grid visibility off.
- Export filled stitch visibility off.
- Pattern with odd width or height.
- Pattern with even width or height.
- Centre guide with grid visibility off.
- Centre guide with filled stitch visibility off.

## Current Code Behaviour

- Currently clamps generated preview cell size between 8 and 34.
- Currently `FontGridPreview` passes zoom `6`, but `TextPatternPreview` clamps it up to 8.
- Currently pattern previews are scrollable.
- Currently generated pattern previews overlay blue centre guide lines at 50% width and height.
- Currently editable character grids use button cells.
- Currently PNG export uses a separate canvas renderer with fixed colours and cell size.
- Currently PNG export receives preview grid and stitch visibility settings from Export Controls.
- Currently PNG export draws blue centre guide lines over the rendered pattern when the pattern is non-empty.

## Known Gaps / Defects

- Mini previews cannot currently use cell sizes below the generated preview clamp, which conflicts with the confirmed mini-preview rule.
- Canvas styling can drift from CSS styling because it is rendered separately.

## Unclear or Assumed Rules

- None currently for Grid Rendering. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Filled-square rendering is sufficient for v1.
- Export must honour grid visibility.
- Export must honour stitch visibility.
- Mini previews may allow cell sizes below the generated preview clamp.

## Suggested Test Areas

- Square cell sizing.
- Visibility toggles.
- Export grid visibility off.
- Export stitch visibility off.
- Large-pattern scrolling.
- Blank grids.
- Mini preview small cell sizing.
- Canvas export dimensions.
- CSS preview and PNG visual consistency.
- Centre guide placement for odd and even pattern dimensions.
- Centre guide visibility when grid visibility is off.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
