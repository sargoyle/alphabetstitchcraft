# Grid Consistency Test Plan

## Purpose

Document automated and pending tests for generated grid dimensions, row width consistency, line spacing rows, alignment preservation and utility-level preview/export consistency.

## Automated Tests Added

| Test ID | Requirement / gap | Test file | Status | Notes |
|---|---|---|---|---|
| GRID-001 | Final generated rows must all match generated pattern width. | `tests/renderVisibility.test.ts` | Passing | Covers multiline rendered output. |
| GRID-002 | Inserted line spacing rows must match pattern width and contain blank cells. | `tests/renderVisibility.test.ts` | Passing | Covers confirmed line spacing behaviour. |
| GRID-003 | Alignment must preserve stitched content. | `tests/renderVisibility.test.ts` | Passing | Compares filled-cell count for aligned shorter line. |
| EXPORT-001 | Canvas export must honour grid visibility at utility level. | `tests/exportUtils.test.ts` | Passing | Asserts `showGrid: false` avoids grid stroke drawing while still drawing filled cells. |
| EXPORT-002 | Canvas export must honour filled-stitch visibility at utility level. | `tests/exportUtils.test.ts` | Passing | Asserts `showFilled: false` avoids filled-stitch rectangles while retaining grid lines. |
| PARITY-001 | Canvas export uses the supplied grid. | `tests/exportUtils.test.ts` | Passing | Filled and stroked cell counts match the provided pattern grid. |

## Pending Tests

| Test ID | Requirement | Reason pending |
|---|---|---|
| GRID-004 | Preview grid and exported canvas match for the same settings. | Requires component/browser or shared rendering fixture beyond current utility scope. |
| GRID-006 | Very large generated grids provide user-safe feedback. | Requires product/UI warning path implementation. |

## Current Evidence

- Generated rows remain rectangular in the tested renderer scenarios.
- Line spacing rows are full-width blank rows.
- Utility export respects `showGrid` when called directly.

## Product Decisions Blocking Further Tests

- None currently. Remaining items are implementation or test-harness gaps.
