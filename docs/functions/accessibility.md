# Accessibility

## Purpose

Ensure Alphabet Stitch is usable with keyboard navigation, visible focus styles, clear labels, semantic landmarks, screen-reader-friendly status messages and non-colour-only stitch states. Accessibility requirements apply especially to the Generator controls, Font Library controls, Font Editor and stitch grids.

## Source References

- File: `src/app/layout.tsx`
- File: `src/app/globals.css`
- Page: `src/app/page.tsx`
- Page: `src/app/fonts/page.tsx`
- Page: `src/app/generator/page.tsx`
- Page: `src/app/editor/page.tsx`
- Component: `EditorClient` in `src/app/editor/EditorClient.tsx`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Component: `SpacingControls` in `src/components/SpacingControls.tsx`
- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Component: `Toast` in `src/components/ui/Toast.tsx`
- Component: `EmptyState` in `src/components/ui/EmptyState.tsx`
- Browser-level evidence: rendered route smoke checks for `/`, `/fonts`, `/generator`, `/editor` and `/design-system` on `http://127.0.0.1:3001`.
- Evidence gap: formal axe, Lighthouse, screen-reader and full keyboard traversal tools are not installed in the project.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| Formal accessibility tooling | axe-style browser checks / Lighthouse / manual-only checks | Use axe-style browser checks as the first automated accessibility gate before go-live; Lighthouse can remain optional for broader performance/SEO reporting. | If tooling is not added before release, accessibility regressions may rely on manual discovery only. |

## Inputs

- Keyboard input: Tab, Shift+Tab, Enter, Space and arrow keys.
- Pointer input for drawing and controls.
- Screen-reader semantics from headings, landmarks, labels, button names and live regions.
- Grid cell state: filled, empty, selected and read-only.
- Dynamic status text for save, export, database and validation states.

## Outputs

- Visible focus outlines.
- Semantic page headings and landmarks.
- Labelled controls and buttons.
- Editable grid cells with useful accessible names and state.
- Status and error messages announced through `aria-live` where messages change dynamically.
- Read-only stitch previews that do not add unnecessary keyboard stops.

## State Transitions

1. User opens a page or route.
2. Page exposes a meaningful heading and navigation landmark.
3. User navigates with keyboard focus.
4. Focus moves through actionable controls in a logical order.
5. Editable grid cells can be toggled with keyboard input.
6. Status, save, export and error messages update visually and should be announced to assistive technology.
7. Read-only previews should be perceivable without acting like editable controls.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Keyboard navigation must reach major controls. | Confirmed | Implemented | Native links, buttons, inputs and selects are used across core pages. |
| Focus states must be visible. | Confirmed | Implemented | Global `:focus-visible` styles are present in `src/app/globals.css`. |
| Pages should expose a meaningful `h1`. | Confirmed | Implemented | The editor route now includes a screen-reader-only `h1`; other checked routes already exposed an `h1`. |
| Primary navigation must expose a navigation landmark. | Confirmed | Implemented | `src/app/layout.tsx` uses `nav aria-label="Primary navigation"`. |
| Form controls must have labels. | Confirmed | Implemented | Source uses labelled controls; formal axe verification is still pending. |
| Editable grid cells must expose row, column and filled state. | Confirmed | Implemented | `CharacterGrid` builds per-cell `aria-label` values and uses `aria-pressed` for editable cells. |
| Enter and Space must toggle the focused editable grid cell in v1. | Confirmed | Implemented | `CharacterGrid` handles Enter and Space in `onKeyDown`. |
| Arrow-key navigation must be supported in the grid editor. | Confirmed | Not Implemented | User confirmed arrow-key navigation is required; source confirms no arrow-key movement handling. |
| Dynamic save, export and error messages must use `aria-live` regions. | Confirmed | Partially Implemented | Editor, generator, export and font-sync status surfaces now use live regions; prompt/alert-based font actions still need a fuller inline status pattern. |
| Read-only grid previews must use non-interactive cells. | Confirmed | Not Implemented | User confirmed read-only previews should use non-interactive cells; `CharacterGrid` currently renders disabled buttons when not editable. |
| Accessibility checks should include browser-level evidence before release. | Confirmed | Partially Implemented | A no-new-dependency rendered DOM/source pass was completed; axe-style automated browser checks are selected for future tooling but not installed yet. |

## Negative Rules

- Must not hide focus outlines.
- Must not rely only on colour to communicate stitch or control state.
- Must not require pointer-only interaction for core character editing.
- Must not render read-only stitch previews as unnecessary keyboard stops.
- Must not leave dynamic save/export/error feedback silent for screen-reader users.
- Must not ship public release without a formal accessibility pass or an accepted manual sign-off.

## Acceptance Criteria

- Given a user tabs through a page, when focus reaches each actionable control, then a visible focus indicator is shown.
- Given a page loads, when assistive technology reads the page structure, then the page has a meaningful `h1` and primary navigation landmark.
- Given an editable grid cell has focus, when Enter is pressed, then the cell toggles filled/empty state.
- Given an editable grid cell has focus, when Space is pressed, then the cell toggles filled/empty state.
- Given an editable grid cell has focus, when an arrow key is pressed after arrow navigation is implemented, then focus moves to the adjacent cell where one exists.
- Given a save, export or error message changes, when the message appears, then the changed message is announced through an `aria-live` region.
- Given a read-only stitch preview is displayed, when keyboard users tab through the page, then individual preview cells are not included as disabled button controls.
- Given a formal browser accessibility test is run, when axe/Lighthouse or equivalent reports violations, then each violation is triaged before public release.

## Edge Cases

- Keyboard-only editing of large character grids.
- First and last grid cells when using arrow keys.
- Empty or loading editor states.
- Disabled export controls.
- Save failures and database errors.
- Unsupported character warnings.
- Small viewport navigation wrapping.
- High contrast and colour perception differences.
- Dynamic modals such as duplicate-character selection.

## Current Code Behaviour

- Currently renders primary navigation with an accessible label.
- Currently has global visible focus styles.
- Currently editable grid cells use labelled buttons with `aria-pressed`.
- Currently Enter and Space toggle editable grid cells.
- Currently arrow-key movement between grid cells does not appear to be implemented.
- Currently read-only grid cells render as disabled buttons.
- Currently editor, generator, export and font-sync status surfaces use live regions; prompt/alert-based font actions still need a fuller inline status pattern.
- Browser-level rendered checks returned HTTP 200 for `/`, `/fonts`, `/generator`, `/editor` and `/design-system`.
- The editor route now includes a screen-reader-only `h1` in the route wrapper.
- Formal axe-style browser checks and screen-reader checks have not yet been run because browser accessibility tooling is not installed.

## Known Gaps / Defects

- Character grid does not support arrow-key navigation, which is a confirmed requirement.
- Some prompt/alert-based font action messages still need conversion to the shared inline `aria-live` status pattern.
- Read-only grid cells use disabled buttons, but non-interactive cells are the confirmed requirement.
- The editor route rendered with no `h1` in the browser-level route check.
- Formal axe-style browser accessibility tooling is not installed or automated yet.

## Unclear or Assumed Rules

- Assumption: axe-style browser accessibility checks are the preferred automated accessibility gate before go-live; Lighthouse remains optional for broader performance/SEO review.

## Suggested Test Areas

- Keyboard tab order on Home, Alphabet Library, Create Pattern and Font Editor.
- Enter and Space grid editing.
- Arrow-key grid navigation once implemented.
- Screen-reader announcement of save/export/error messages.
- Read-only preview semantics.
- Page heading and landmark structure.
- Colour contrast and non-colour-only states.
- Formal axe-style browser accessibility pass before public release.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.

