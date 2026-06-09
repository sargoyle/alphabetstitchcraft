# Accessibility

## Purpose

Ensure the app is usable with keyboard navigation, visible focus styles, clear labels and non-colour-only stitch states. Accessibility requirements apply especially to the Generator controls, Font Library controls and Character Editor grid.

## Source References

- Styles: `src/app/globals.css`
- Layout: `src/app/layout.tsx`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Component: `SpacingControls` in `src/components/SpacingControls.tsx`
- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Pages: `/fonts`, `/generator`, `/editor`, `/custom-fonts`
- Related grid events: `onKeyDown`, `onPointerDown`, `onPointerMove`
- Related cell state: `aria-pressed`
- Related grid labels: row, column and filled/empty state
- Evidence gap: no `aria-live` status region pattern was found for dynamic save/export/error messages.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for accessibility decisions captured in this document. | N/A | N/A | N/A |

## Inputs'@
$content = $content -replace '### Plain-English Note On `aria-live`\r?\n\r?\nAn `aria-live` region is a part of the page that screen readers automatically announce when its text changes. It is useful for messages that appear after an action, such as “PNG exported”, “Character saved” or “Database save failed”. It does not need to change the visual design. It mainly helps users who cannot see that a status message appeared or changed.\r?\n\r?\n', ''
$content = $content -replace '\| Dynamic save, export and error messages should be understandable to screen-reader users\. \| Needs Product Confirmation \| Partially Implemented \| Visual text exists in places, but live announcements are not consistently implemented\. \|', '| Dynamic save, export and error messages must use `aria-live` regions so screen-reader users are notified. | Confirmed | Not Implemented | User confirmed live regions are required; current status messages are not consistently live regions. |'
$content = $content -replace '\| Arrow-key navigation must be supported in the grid editor\. \| Confirmed \| Not Implemented \| User confirmed arrow-key navigation should be required; current grid does not implement arrow movement\. \|', '| Arrow-key navigation must be supported in the grid editor. | Confirmed | Not Implemented | User confirmed arrow-key navigation is required; current grid does not implement arrow movement. |'
# Insert read-only semantics rule after live-region rule if not present.
if ($content -notmatch 'Read-only grid previews must use non-interactive cells') {
  $content = $content -replace '(\| Dynamic save, export and error messages must use `aria-live` regions so screen-reader users are notified\. \| Confirmed \| Not Implemented \| User confirmed live regions are required; current status messages are not consistently live regions\. \|)', '$1' + "`r`n" + '| Read-only grid previews must use non-interactive cells. | Confirmed | Not Implemented | User confirmed read-only previews should not continue using disabled buttons. |'
}
$content = $content -replace '7\. Dynamic status messages should be announced if the live-region decision is confirmed\.', '7. Dynamic status messages must be announced through `aria-live` regions.'
$content = $content -replace '## Known Gaps / Defects\r?\n\r?\n- Character grid does not support arrow-key navigation, which is now a confirmed requirement\.\r?\n- Status/warning changes are not consistently announced with `aria-live`; product decision is pending after explanation\.\r?\n- Read-only grid cells use disabled buttons, which may be suboptimal for assistive technology\.', @'
## Known Gaps / Defects

- Character grid does not support arrow-key navigation, which is now a confirmed requirement.
- Status/warning changes are not consistently announced with `aria-live`, which is now a confirmed requirement.
- Read-only grid cells use disabled buttons, but non-interactive cells are now the confirmed requirement.

- Keyboard focus.
- Button and link labels.
- Form labels.
- Aria labels.
- Grid cell state.
- Colour and shape styling.
- Status and warning text.
- Keyboard actions: Tab, Enter, Space and arrow keys.

## Outputs

- Visible focus outlines.
- Accessible primary navigation.
- Labelled form controls.
- Grid cell accessible names.
- `aria-pressed` for editable cells.
- Enter/Space cell toggling.
- Required future arrow-key movement in the editor grid.
- Semantic page headings and landmarks.

## State Transitions

1. User navigates by keyboard or assistive technology.
2. Focus moves through links, buttons and inputs.
3. Visible focus styles appear.
4. Editable grid cells announce location and filled state.
5. User activates a focused editable grid cell with Enter or Space.
6. User should be able to move around the editor grid with arrow keys once that confirmed requirement is implemented.
7. Dynamic status messages should be announced if the live-region decision is confirmed.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Keyboard navigation should reach major controls. | Confirmed | Implemented | Native controls and links are used. |
| Focus states must be visible. | Confirmed | Implemented | Global focus-visible styles. |
| Form controls must have labels. | Confirmed | Implemented | Labels wrap inputs/selects. |
| Editable grid cells should be labelled. | Confirmed | Implemented | Aria labels include row/column/state. |
| Filled state must not rely only on colour. | Confirmed | Partially Implemented | Shape/fill contrast exists; needs visual review. |
| Enter and Space must toggle the focused editable grid cell in v1. | Confirmed | Implemented | User confirmed Enter/Space editing is sufficient for v1 cell activation. |
| Arrow-key navigation must be supported in the grid editor. | Confirmed | Not Implemented | User confirmed arrow-key navigation should be required; current grid does not implement arrow movement. |
| Dynamic save, export and error messages should be understandable to screen-reader users. | Needs Product Confirmation | Partially Implemented | Visual text exists in places, but live announcements are not consistently implemented. |

## Negative Rules

- Must not hide focus outlines.
- Must not use icon-only controls without accessible text or labels.
- Must not rely solely on colour for filled stitches.
- Must not trap keyboard focus.
- Must not require pointer-only interaction for core character editing.
- Must not announce stale or incorrect status messages to assistive technology.

## Acceptance Criteria

- Given keyboard navigation, when tabbing through the page, then primary controls receive visible focus.
- Given a labelled input, when assistive technology reads the control, then its purpose is available.
- Given an editable grid cell, when assistive technology reads it, then row, column and filled state are exposed.
- Given focus is on an editable grid cell, when Enter is pressed, then the cell toggles between filled and empty.
- Given focus is on an editable grid cell, when Space is pressed, then the cell toggles between filled and empty.
- Given focus is on an editable grid cell, when arrow-key navigation is implemented and an arrow key is pressed, then focus moves to the adjacent grid cell in that direction where one exists.
- Given primary navigation renders, when assistive technology reads it, then it has a navigation landmark label.
- Given a save, export or error status changes, when the message appears or changes, then the updated message is announced through an `aria-live` region.

## Edge Cases

- Large editable grids.
- First and last cells in a row when using arrow keys.
- First and last rows when using arrow keys.
- Disabled export buttons.
- Disabled read-only grid cells.
- Warning/status messages.
- Small viewport navigation wrapping.
- High contrast needs.
- Users who use keyboard only but not a screen reader.
- Users who use a screen reader and pointer/mouse together.

## Current Code Behaviour

- Currently defines visible focus styles for buttons, links, inputs, textareas and selects.
- Currently uses labelled form controls.
- Currently uses text labels alongside most icons.
- Currently editable cells support `aria-pressed` and keyboard toggle with Enter or Space.
- Currently arrow-key movement between grid cells does not appear to be implemented.
- Currently status messages are not consistently live regions, which conflicts with the confirmed requirement.
- Currently read-only grid cells render as disabled buttons, which conflicts with the confirmed requirement for non-interactive cells.

## Known Gaps / Defects

- Character grid does not support arrow-key navigation, which is now a confirmed requirement.
- Status/warning changes are not consistently announced with `aria-live`; product decision is pending after explanation.
- Read-only grid cells use disabled buttons, which may be suboptimal for assistive technology.

## Unclear or Assumed Rules

- None currently. The accessibility decisions previously listed here have been confirmed.

## Suggested Test Areas

- Keyboard tab order.
- Focus visibility.
- Grid cell labels.
- Enter cell toggle.
- Space cell toggle.
- Arrow-key grid navigation once implemented.
- Form labels.
- Button names.
- Colour contrast.
- Live status announcements for save, export and error messages.\n- Read-only preview cells are non-interactive and skipped by keyboard tab navigation.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.


