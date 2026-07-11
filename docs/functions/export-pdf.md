# Export Print PDF

## Purpose

Generate a print-ready A4 landscape PDF for home stitching. The PDF is separate from the single-image PNG export and is optimised for printed pages, pagination, readable stitch cells, 10-stitch grouping, centre guide lines, total pattern dimensions, 2-stitch page overlap and footer navigation.

## Source References

- Component: `ExportControls` in `src/components/ExportControls.tsx`
- File: `src/lib/exportUtils.ts`
- Function: `exportPatternPdf()`
- Function: `planPdfPages()`
- Function: `patternToCanvas()` for shared PNG/PDF rendering decisions
- Type: `GeneratedPattern`
- Tests: `tests/exportUtils.test.ts`

## Inputs

- Generated pattern grid, width and height.
- A4 landscape page size.
- Minimum readable cell size.
- 8-10 mm style page margins, represented as compact point margins in the PDF utility.
- 2-stitch overlap shown only on continuation pages.
- Browser Blob/download support.

## Outputs

- Downloaded `.pdf` file.
- One or more landscape A4 pages.
- Visible total pattern dimensions on each page.
- Pattern grid with normal, 10-stitch grouping and centre guide line styles.
- Footer navigation showing current page, total pages and left/right/above/below neighbours.
- Lightly shaded overlap cells only where a continuation page repeats stitches from a previous page.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| PDF export must be available from Create Pattern. | Confirmed | Implemented | Button label is `Download Print PDF`. |
| PDF must use A4 landscape. | Confirmed | Implemented | `planPdfPages()` uses landscape A4 point dimensions. |
| Large patterns must paginate automatically. | Confirmed | Implemented | `planPdfPages()` splits rows and columns as needed. |
| Adjoining pages must include 2-stitch overlap. | Confirmed | Implemented | Continuation pages include previous page overlap; source pages do not include future overlap cells. |
| Overlap must be visually distinct. | Confirmed | Implemented | Continuation-page overlap cells use grey fill; source pages are not shaded for future overlap. |
| Footer navigation must show neighbouring pages or None. | Confirmed | Implemented | Page plan stores left, right, above and below neighbours. |
| Centre guide lines must be calculated from the full pattern. | Confirmed | Implemented | Centre checks use full `pattern.width` and `pattern.height`, not page-local midpoint. |
| PNG and PDF must share rendering decisions where practical. | Confirmed | Implemented | Shared constants and page/cell calculations live in `exportUtils.ts`. |

## Acceptance Criteria

- Given a valid pattern, when Download Print PDF is clicked, then a PDF download is triggered.
- Given a large pattern, when `planPdfPages()` runs, then more than one page is produced.
- Given a page has a right neighbour, when footer navigation is generated, then the right page number is present.
- Given a page has no left neighbour, when footer navigation is generated, then `None` is used for left.
- Given pages adjoin, when page windows are calculated, then continuation pages include the 2-stitch repeated overlap from the previous page.
- Given centre guide lines are drawn on a paginated page, then their position is based on the full pattern centre.

## Current Code Behaviour

- Currently generates a minimal browser-side PDF without adding a third-party PDF dependency.
- Currently uses A4 landscape dimensions in points.
- Currently prints pattern dimensions on each page using the dark stitch colour so the label remains visible on the cream page background.
- Currently shades only continuation-page overlap cells grey.
- Currently draws normal grid lines, darker 10-stitch grouping lines and blue centre guide lines.

## Known Gaps / Defects

- Browser-level visual PDF inspection is still recommended because utility tests verify structure and payload, not rendered PDF appearance.
- The PDF writer is intentionally minimal and should be revisited if future print features require richer layout controls.

## Suggested Test Areas

- Browser PDF download.
- Visual PDF inspection after download.
- Single-page pattern PDF.
- Multi-page pattern PDF.
- Footer navigation accuracy.
- Continuation-page-only 2-stitch overlap visibility.
- Centre guide continuity across pages.
- PNG/PDF rendering parity.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into browser tests.
