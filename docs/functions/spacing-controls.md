# Spacing Controls

## Purpose

Provide user controls for adjusting the layout and visibility of generated lettering patterns. Spacing controls should keep the generator easy to use while preventing invalid numeric values from reaching rendering state.

## Source References

- Component: `SpacingControls` in `src/components/SpacingControls.tsx`
- Page: `src/app/generator/page.tsx`
- Type: `TextAlignment` in `src/lib/fontTypes.ts`
- Type: `GeneratorSettings` in `src/lib/fontTypes.ts`
- Function: `renderTextToGrid()` in `src/lib/renderTextToGrid.ts`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Related controls: letter spacing, word spacing, line spacing, alignment, grid visibility, stitch visibility and zoom.
- Related confirmed rule: renderer must enforce numeric bounds independently of the UI.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Spacing Controls decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Current letter spacing.
- Current word spacing.
- Current line spacing.
- Current alignment.
- Current grid visibility.
- Current filled stitch visibility.
- Current zoom.
- User input from number fields, buttons, checkboxes and range control.
- Browser event values from cleared or partially typed numeric fields.

## Outputs

- Partial settings updates through `onChange()`.
- Updated generator settings state.
- Re-rendered generated pattern.
- Updated preview visibility and zoom.
- Inline or controlled-field handling for invalid numeric input once implemented.

## Worked Examples

### Letter spacing update

Input:
- Current letter spacing: `1`
- User changes field to `2`

Output:
- `onChange({ letterSpacing: 2 })`

### Cleared number field

Input:
- Current letter spacing: `1`
- User clears the field.

Current risk:
- Browser/event handling may produce `0`, `NaN` or an empty string depending on how the input value is read and converted.

Confirmed output:
- The control corrects invalid numeric input immediately and does not pass `NaN` to generator state.

### Alignment update

Input:
- Current alignment: `left`
- User clicks `Right`

Output:
- `onChange({ alignment: "right" })`

## State Transitions

1. Generator page passes current settings into `SpacingControls`.
2. User changes a control.
3. For non-numeric controls, the control calls `onChange()` with the changed setting.
4. For numeric controls, the control corrects invalid input immediately before committing a settings update.
5. Generator merges valid updates into settings state.
6. Settings are saved to localStorage.
7. Preview recalculates or re-renders.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must be able to adjust letter spacing. | Confirmed | Implemented | Number input. |
| Users must be able to adjust word spacing. | Confirmed | Implemented | Number input. |
| Users must be able to adjust line spacing. | Confirmed | Implemented | Number input. |
| Users must be able to set left, centre or right alignment. | Confirmed | Implemented | Segmented buttons. |
| Users should be able to toggle grid visibility. | Confirmed | Implemented | Checkbox. |
| Users should be able to toggle filled stitches. | Confirmed | Implemented | Checkbox. |
| Users should be able to zoom preview. | Confirmed | Implemented | Range input. |
| Numeric settings should have sane limits. | Confirmed | Partially Implemented | HTML min/max exist; runtime clamping is limited. |
| Clearing a number field can produce `0` or `NaN` and is not explicitly validated in `SpacingControls`. | Confirmed | Implemented | User confirmed this current behaviour/gap. |
| Numeric values should not reach generator state as `NaN` or invalid out-of-range values. | Confirmed | Not Implemented | Renderer-level bounds are confirmed; controls should support that goal. |
| Numeric fields should correct invalid input immediately while typing. | Confirmed | Not Implemented | User confirmed immediate correction rather than blur/commit correction. |
| Out-of-range spacing values should be rejected with an inline message. | Confirmed | Not Implemented | User confirmed rejection, not silent clamping. |
| Export should honour grid and stitch visibility controls. | Confirmed | Partially Implemented | Confirmed in Export PNG/Grid Rendering docs; export parity still needs implementation work. |
| Preview zoom does not need to control PNG cell size. | Confirmed | Implemented | Confirmed in Export PNG docs. |

## Negative Rules

- Must not directly mutate generator state.
- Must not trigger export.
- Must not change selected font or text.
- Must not allow alignment values outside the supported set through normal UI.
- Must not pass `NaN` to generator settings.
- Must not pass invalid out-of-range numeric values to generator settings.
- Must not silently clamp out-of-range spacing values.
- Must not wait until blur/commit to correct invalid numeric values.

## Acceptance Criteria

- Given letter spacing changes to a valid number, then `onChange` receives the new letter spacing number.
- Given word spacing changes to a valid number, then generated word gaps update.
- Given line spacing changes to a valid number, then multiline gaps update.
- Given a number field is cleared, when the value changes, then the app immediately corrects the value and does not store `NaN`.
- Given a user types a value outside the supported range, when the value changes, then the app rejects the value with an inline message.
- Given centre alignment is clicked, then alignment becomes `center` and active state updates.
- Given Show grid is unchecked, then preview grid lines are hidden.
- Given Show stitches is unchecked, then filled stitch styling is hidden.
- Given zoom changes, then preview cell size changes within bounds.

## Edge Cases

- Clearing a number input.
- Typing a value outside min/max.
- Decimal values.
- Negative values.
- `NaN` from `Number(event.target.value)`.
- Very large values.
- Rapid control changes.
- Keyboard-only operation.
- Missing `onChange` is impossible by type but relevant in tests with mocks.

## Current Code Behaviour

- Currently converts numeric input using `Number(event.target.value)`.
- Currently clearing a number field can produce `0` or `NaN` depending on browser event value handling and is not explicitly validated in `SpacingControls`.
- Currently relies on HTML min/max for the user-facing bounds.
- Currently numeric values are not clamped inside `SpacingControls` before `onChange()`.
- Currently renders alignment options from a fixed array.
- Currently applies active class to the selected alignment.
- Currently passes zoom as a number from a range input.

## Known Gaps / Defects

- Clearing a number field can produce `0` or `NaN` depending on browser event value handling and is not explicitly validated here.
- Numeric values are not clamped inside `SpacingControls` before `onChange()`.
- Immediate correction for invalid numeric input is confirmed but not implemented.
- Out-of-range values should be rejected with an inline message, but current controls do not implement that behaviour.
- Export visibility parity is confirmed elsewhere but not fully implemented.

## Unclear or Assumed Rules

- None currently for Spacing Controls. The previously listed assumptions and product questions have been answered, including the decision to keep current spacing ranges until user need says otherwise.

## Confirmed Product Decisions

- Clearing a number field can currently produce `0` or `NaN` depending on browser event value handling and is not explicitly validated in `SpacingControls`.
- Renderer-level numeric bounds are required independently of the UI.
- Export must honour grid visibility and stitch visibility.
- Preview zoom does not need to control PNG export cell size.
- Numeric fields should correct invalid input immediately while typing.
- Out-of-range spacing values should be rejected with an inline message.

## Suggested Test Areas

- Each control emits correct updates.
- Numeric edge values.
- Cleared number input.
- `NaN` prevention.
- Out-of-range values.
- Alignment active state.
- Visibility toggles.
- Zoom rendering.
- Keyboard accessibility.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.



