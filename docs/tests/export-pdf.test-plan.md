# Export Print PDF Test Plan

## Purpose

Verify that print-ready PDF export creates A4 landscape output with pagination, continuation-page-only 2-stitch overlap, footer navigation, centre guide lines and total pattern dimensions.

## Source Requirements

- `/docs/functions/export-pdf.md`
- `/docs/functions/export-png.md`
- `/docs/functions/text-generator.md`

## Automated Tests

| Test ID | Requirement | Test file | Status | Notes |
|---|---|---|---|---|
| PDF-001 | PDF plan uses landscape A4 dimensions. | `tests/exportUtils.test.ts` | Passing | Page width is greater than page height. |
| PDF-002 | Large patterns paginate. | `tests/exportUtils.test.ts` | Passing | Oversized fixture produces multiple pages. |
| PDF-003 | Adjoining pages include overlap. | `tests/exportUtils.test.ts` | Passing | At least one page starts before its primary area. |
| PDF-004 | Footer neighbours are calculated. | `tests/exportUtils.test.ts` | Passing | First page has right neighbour and no left neighbour. |
| PDF-005 | PDF export triggers a PDF download payload. | `tests/exportUtils.test.ts` | Passing | Blob starts with `%PDF-1.4`. |
| PDF-006 | PDF export includes total pattern dimensions. | `tests/exportUtils.test.ts` | Passing | PDF payload contains `W x H Squares`. |

## Manual Checks Still Required

- Download a PDF from Create Pattern and open it in a PDF viewer.
- Print-preview a single-page and multi-page pattern.
- Confirm 10-stitch grouping, centre guides and overlap shading are visually clear.
- Confirm footer navigation is readable and compact.

## Known Remaining Limits

- Automated tests do not visually render the PDF pages.
- Future print polish may need a richer PDF renderer if requirements expand.


- PDF-007: First/source pages must not include or shade future overlap cells.
- PDF-008: Continuation pages must include the previous page's repeated overlap cells.
- PDF-009: Page windows must end at their primary bounds so overlap is never marked on source pages.
- PDF-010: PDF payload must include stitch fill commands and no invalid colour values.
