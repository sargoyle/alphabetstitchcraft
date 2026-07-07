# Font Editor UI Test Plan

## Purpose

Verify the Font Editor usability behaviours that protect character edits, keep the editor layout stable, and make duplicate-character workflows clear.

## Source References

- Component: `EditorClient` in `src/app/editor/EditorClient.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Styles: `src/app/globals.css`
- Source tests: `tests/editorUiSource.test.ts`
- Function documentation: `docs/functions/character-editor.md`

## Automated Coverage

| Test ID | Scenario | Requirement | Status |
|---|---|---|---|
| EDITOR-UI-017 | Duplicate source selection does not enter creating mode until the user confirms. | Avoid duplicate workflow flicker and false existing-character warnings. | Covered by source test |
| EDITOR-UI-018 | Unsaved character edits show a three-action confirmation dialog. | Prevent accidental navigation away from unsaved character work. | Covered by source test |
| EDITOR-UI-019 | Unsaved edits guard character selection, font changes and page navigation. | User must explicitly save, discard or cancel before leaving. | Covered by source test |
| EDITOR-UI-020 | CharacterEditor exposes dirty state plus save/discard actions. | Parent editor can complete Save & Continue and Discard Changes flows. | Covered by source test |
| EDITOR-UI-021 | Save status uses a floating auto-dismiss notification. | Success message must not move surrounding controls. | Covered by source test |
| EDITOR-UI-005 | Old character-width information panel is absent. | Remove low-value help panel and recover editor space. | Covered by source test |

## Manual Checks

- Edit a character, click another character, confirm the unsaved-change dialog appears.
- Use Save & Continue and confirm the character saves before navigation.
- Use Discard Changes and confirm edits are removed before navigation.
- Use Cancel and confirm the current character and unsaved edits remain visible.
- Open Select Duplicate, choose a source, and confirm no warning appears until the duplicate is intentionally applied.
- Save a character and confirm the success message floats over the editor and disappears automatically.

## Current Limitations

- Source tests verify structure and guard rails. Full click-path behaviour should be covered by browser-level tests when Playwright or similar tooling is added.
