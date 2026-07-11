# Export PNG Test Plan

## Purpose

Verify that PNG export uses the same generated pattern grid and relevant visibility settings as the Generator preview.

## Source Requirements

- `/docs/functions/export-png.md`
- `/docs/functions/grid-rendering.md`
- `/docs/functions/text-generator.md`
- `/docs/tests/grid-consistency.test-plan.md`

## Automated Tests

| Test ID | Requirement | Test file | Status | Notes |
|---|---|---|---|---|
| EXPORT-001 | PNG canvas export honours hidden grid visibility. | `tests/exportUtils.test.ts` | Passing | `patternToCanvas(..., { showGrid: false })` does not call `strokeRect`. |
| EXPORT-002 | PNG canvas export honours hidden filled-stitch visibility. | `tests/exportUtils.test.ts` | Passing | `patternToCanvas(..., { showFilled: false })` does not draw filled stitch rectangles. |
| EXPORT-003 | Empty patterns are handled safely at canvas utility level. | `tests/exportUtils.test.ts` | Passing | Empty pattern creates a safe margin-only canvas. |
| PARITY-001 | PNG canvas draws filled and blank cells from the provided `GeneratedPattern.grid`. | `tests/exportUtils.test.ts` | Passing | Filled-cell draw count and grid-cell stroke count match the supplied grid. |
| EXPORT-005 | PNG canvas draws centre guide lines through the exact pattern midpoint. | `tests/exportUtils.test.ts` | Passing | Centre guide line coordinates account for the dimensions header and grid bounds. |

## Source Review Evidence

| Test ID | Evidence | Status | Notes |
|---|---|---|---|
| PREVIEW-001 | `src/app/generator/page.tsx` passes the same `pattern` object to `TextPatternPreview` and `ExportControls`. | Reviewed | Confirms preview and export share generated pattern data at page level. |
| PREVIEW-002 | `ExportControls` passes `showGrid` and `showFilled` into `exportPatternPng()`. | Reviewed | Confirms PNG export receives preview visibility settings. |
| PARITY-002 | `exportPatternPng()` calls `patternToCanvas(pattern, options)` and does not call `renderTextToGrid()`. | Reviewed | Confirms PNG export does not recalculate layout. |
| EXPORT-006 | `ExportControls` renders `Download PNG` and `Download Print PDF` without rendering `Copy size` or `Export JSON`. | Tested | Confirms Create Pattern export controls stay focused on image/PDF export. |

## Manual Checks Still Required

- Preview simple text, export PNG, compare dimensions visually.
- Preview multiline text, export PNG, confirm line spacing rows appear.
- Preview aligned text, export PNG, compare alignment.
- Preview unsupported character placeholder, export PNG, confirm placeholder cells appear.
- Preview with filled stitches hidden, export PNG, confirm filled cells are hidden.
- Preview with grid hidden, export PNG, confirm grid lines are hidden.

## Known Remaining Limits

- Canvas style parity with CSS preview is not pixel-perfect tested in the utility runner.
- Browser download behaviour is only simulated by the utility test harness.
