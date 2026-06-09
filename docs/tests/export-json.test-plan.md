# Export JSON Test Plan

## Purpose

Verify that JSON export preserves the generated pattern object used by the Generator preview and does not add unrelated metadata.

## Source Requirements

- `/docs/functions/export-json.md`
- `/docs/functions/render-text-to-grid.md`
- `/docs/functions/text-generator.md`

## Automated Tests

| Test ID | Requirement | Test file | Status | Notes |
|---|---|---|---|---|
| PARITY-002 | Pattern JSON export preserves the generated pattern object. | `tests/exportUtils.test.ts` | Passing | Captured JSON payload deep-equals the source `GeneratedPattern`, including grid, width, height and warnings. |
| EXPORT-004 | Empty pattern JSON export preserves safe empty data at utility level. | `tests/exportUtils.test.ts` | Passing | Captured JSON payload deep-equals an empty `GeneratedPattern`. |

## Manual Checks Still Required

- Export JSON from the Generator and inspect the downloaded file.
- Confirm multiline generated grids preserve line spacing rows.
- Confirm unsupported character count data appears in JSON when present.
- Confirm large-pattern warnings appear in JSON when present.

## Known Remaining Limits

- Export controls disable JSON export for empty patterns in the UI; utility-level JSON export still serialises empty data safely.
- Browser download behaviour is simulated in automated tests.
