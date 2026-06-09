# Character Grid

## Purpose

Render a single stitch character as a square-cell grid in either read-only preview mode or editable drawing mode.

## Source References

- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Page: `src/app/fonts/[id]/page.tsx`
- Type: `StitchCharacter` in `src/lib/fontTypes.ts`
- Functions: `toggleGridCell()` and `setGridCell()` in `src/lib/gridUtils.ts`


## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Character Grid decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- `StitchCharacter` width, height and grid.
- Label string.
- Editable flag.
- Show grid flag.
- Cell size.
- `onToggle` callback.
- `onSetCell` callback.
- Pointer and keyboard events.

## Outputs

- Read-only or editable grid UI.
- Cell buttons with filled/empty styling.
- Toggle and paint callbacks.
- Accessible labels for cells.
- Drag fill or erase behaviour.


## Worked Examples

### Drag fill

Input:
- Start drag on an empty cell.
- Drag over two more empty cells.

Output:
- All touched cells are set to filled.

### Drag erase

Input:
- Start drag on a filled cell.
- Drag over two more filled cells.

Output:
- All touched cells are set to empty.

## State Transitions

1. Character data is passed into `CharacterGrid`.
2. Component renders one button per grid cell.
3. In editable mode, pointer down determines fill or erase mode.
4. Pointer move paints cells under the pointer.
5. Pointer up or cancel clears drag state.
6. Keyboard Enter or Space toggles the focused cell.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Grid cells must be square. | Confirmed | Implemented | Cell size variable controls rows/columns. |
| Editable cells must be clickable. | Confirmed | Implemented | Pointer down toggles/paints. |
| Pointer or touch drag painting should mark cells dragged over. | Confirmed | Implemented | User confirmed pointer drag behaviour is enough for mouse/touch drawing in v1. |
| Drag should support fill and erase. | Confirmed | Implemented | First cell determines `dragFillValue`. |
| Read-only mode must not edit data. | Confirmed | Implemented | User confirmed read-only grids should use non-button cells, but current disabled buttons still prevent editing. |
| Editable cells should have accessible labels. | Confirmed | Implemented | Aria label includes row/column/state. |
| Arrow keys must move focus between editable grid cells. | Confirmed | Not Implemented | User confirmed arrow-key focus movement is required. |
| Read-only grids must use non-button cells instead of disabled buttons. | Confirmed | Not Implemented | User confirmed read-only grids should be non-interactive cells. |

## Negative Rules

- Must not edit cells in read-only mode.
- Must not repaint the same cell repeatedly in one drag pass.
- Must not mutate character data directly inside the component.
- Must not lose keyboard toggling while supporting pointer dragging.
- Must not use disabled buttons for read-only grid previews once non-interactive cells are implemented.
- Must not require pointer input when keyboard movement is needed.

## Acceptance Criteria

- Given editable mode, when a cell is clicked, then the correct row and column are toggled.
- Given editable mode, when dragging starts on an empty cell, then dragged-over cells are filled.
- Given editable mode, when dragging starts on a filled cell, then dragged-over cells are erased.
- Given read-only mode, when cells are clicked, then no edit callback is triggered.
- Given a focused editable cell, when Enter or Space is pressed, then it toggles.
- Given a cell is rendered, then its accessible label includes row, column and state.
- Given focus is on an editable grid cell, when an arrow key is pressed, then focus moves to the adjacent cell in that direction where one exists.
- Given a grid is rendered in read-only mode, then cells are rendered as non-interactive cells rather than disabled buttons.

## Edge Cases

- Pointer leaves the grid during drag.
- Pointer cancel event.
- Drag over the same cell more than once.
- Missing `onSetCell` but present `onToggle`.
- Disabled read-only cells.
- Touch screen drag input.
- Arrow-key movement at grid edges.
- Very small or large grids.

## Current Code Behaviour

- Currently uses `document.elementFromPoint()` to find cells during drag.
- Currently stores drag fill value in component state and last painted cell in a ref.
- Currently resets drag state on window `pointerup` and `pointercancel`.
- Currently does not support arrow-key focus movement between cells.
- Currently renders disabled buttons for read-only grids, which conflicts with the confirmed requirement for non-interactive read-only cells.

## Known Gaps / Defects

- Arrow-key grid navigation is not implemented, which conflicts with the confirmed requirement.
- Read-only grids use disabled buttons, which conflicts with the confirmed requirement to use non-button cells.

## Unclear or Assumed Rules

- None currently for Character Grid. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Pointer drag behaviour is enough for mouse and touch-screen drawing in v1.
- Arrow keys should move focus between editable grid cells.
- Read-only grids should use non-button cells instead of disabled buttons.

## Suggested Test Areas

- Click toggle.
- Drag fill.
- Drag erase.
- Pointer cancel.
- Keyboard toggle.
- Read-only behaviour.
- Accessibility labels.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.



