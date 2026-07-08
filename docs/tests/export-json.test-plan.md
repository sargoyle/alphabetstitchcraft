# Export JSON Test Plan

## Purpose

Verify that JSON export utilities preserve expected data, while the Create Pattern UI no longer exposes a visible pattern JSON export button.

## Source Requirements

- `/docs/functions/export-json.md`
- `/docs/functions/render-text-to-grid.md`
- `/docs/functions/text-generator.md`

## Automated Tests

| Test ID | Requirement | Test file | Status | Notes |
|---|---|---|---|---|
| PARITY-002 | Pattern JSON export preserves the generated pattern object at utility level. | `tests/exportUtils.test.ts` | Passing | Captured JSON payload deep-equals the source `GeneratedPattern`, including grid, width, height and warnings. |
| EXPORT-004 | Empty pattern JSON export preserves safe empty data at utility level. | `tests/exportUtils.test.ts` | Passing | Captured JSON payload deep-equals an empty `GeneratedPattern`. |
| EXPORT-006 | Create Pattern export controls do not expose a visible Export JSON button. | `tests/accessibilitySource.test.ts` | Passing | Source-level guard confirms `ExportControls` keeps Export PNG and Copy size only. |

## Manual Checks Still Required

- Confirm font JSON export remains available where intentionally exposed.
- If generated pattern JSON export is reintroduced later, inspect the downloaded file for multiline grids and line spacing rows.
- If generated pattern JSON export is reintroduced later, confirm unsupported character count data appears in JSON when present.
- If generated pattern JSON export is reintroduced later, confirm large-pattern warnings appear in JSON when present.

## Known Remaining Limits

- Create Pattern no longer exposes pattern JSON export in the UI; utility-level JSON export still serialises empty data safely.
- Browser download behaviour is simulated in automated tests.

