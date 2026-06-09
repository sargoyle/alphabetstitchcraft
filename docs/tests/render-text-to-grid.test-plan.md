# Render Text To Grid Test Plan

## Purpose

Document automated and pending tests for `renderTextToGrid()` using `/docs/functions/render-text-to-grid.md`, `/docs/functions/unsupported-characters.md`, `/docs/functions/alignment-rules.md` and `/docs/functions/spacing-controls.md` as the source of truth.

## Automated Tests Added

| Test ID | Requirement / gap | Test file | Status | Notes |
|---|---|---|---|---|
| RENDER-001 | Whitespace-only text should be treated as empty. | `tests/renderVisibility.test.ts` | Passing | Spaces, tabs and line breaks produce width `0`, height `0` and an empty grid. |
| RENDER-002 | Very long text should not create inconsistent rows and should produce a safety warning. | `tests/renderVisibility.test.ts` | Passing | Row consistency and large-pattern warning are asserted. |
| UNSUPPORTED-001 | Mixed supported and unsupported characters should render safely. | `tests/renderVisibility.test.ts` | Passing | Asserts supported stitches render and unsupported character is reported. |
| UNSUPPORTED-002 | Repeated unsupported characters should be counted. | `tests/renderVisibility.test.ts` | Passing | Counted `{ character, count }` entries are asserted. |
| UNSUPPORTED-003 | Tabs should be treated as unsupported characters. | `tests/renderVisibility.test.ts` | Passing | Asserts tab is reported unsupported and rows remain consistent. |
| SPACING-001 | Negative spacing values should be rejected or safely handled by the renderer. | `tests/renderVisibility.test.ts` | Passing | Negative letter spacing throws a `RangeError`. |
| SPACING-002 | Very large spacing values should be safely handled or documented. | `tests/renderVisibility.test.ts` | Passing | Very large letter spacing throws a `RangeError`. |
| SPACING-003 | Invalid word spacing should be rejected. | `tests/renderVisibility.test.ts` | Passing | Word spacing below the confirmed range throws a `RangeError`. |
| SPACING-004 | `NaN` line spacing should be rejected. | `tests/renderVisibility.test.ts` | Passing | `NaN` line spacing throws a `RangeError`. |

## Pending Tests

| Test ID | Requirement | Reason pending |
|---|---|---|
| ALIGN-001 | Odd centre alignment puts the extra blank column on the confirmed side. | Known implementation gap; should be strict after alignment fix. |

## Current Evidence

- Renderer keeps row widths consistent for tested multiline, unsupported, very long and large-spacing inputs.
- Renderer safely reports tabs as unsupported.
- Renderer now treats whitespace-only text as empty.
- Renderer now rejects invalid spacing values according to confirmed ranges.
- Renderer now reports unsupported characters as counted entries.
- Renderer now returns a large-pattern warning for very long generated output.

## Product Decisions Blocking Further Tests

- None currently. The blocked items are implementation gaps, not open product decisions.
