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
| EDITOR-UI-025 | Duplicate source picker uses main character order and hides not-created characters. | Select Duplicate should only offer usable source designs in the same order as the main picker. | Covered by source test |
| EDITOR-UI-026 | Save Character gives immediate pending feedback. | Saving should feel responsive and prevent duplicate clicks while the database save is pending. | Covered by source test |

## Manual Checks

- Edit a character, click another character, confirm the unsaved-change dialog appears.
- Use Save & Continue and confirm the character saves before navigation.
- Use Discard Changes and confirm edits are removed before navigation.
- Use Cancel and confirm the current character and unsaved edits remain visible.
- Open Select Duplicate, choose a source, and confirm no warning appears until the duplicate is intentionally applied.
- Save a character and confirm the success message floats over the editor and disappears automatically.

## Current Limitations

- Source tests verify structure and guard rails. Full click-path behaviour should be covered by browser-level tests when Playwright or similar tooling is added.

## Regression Fix Coverage Added 2026-07-07

| Test ID | Scenario | Requirement | Status |
|---|---|---|---|
| EDITOR-UI-022 | Blank punctuation and other not-created character drafts remain stable while edited. | Clicking a newly added punctuation character grid must draw cells instead of resetting to blank. | Covered by source test |
| EDITOR-UI-023 | Font settings saves preserve the current character and use the unsaved-change guard. | Changing font name/height must not switch to `A` or discard character edits. | Covered by source test |
| EDITOR-UI-017 | Duplicate source selection applies the chosen source to the current draft. | Duplicate character workflow should work directly after source selection. | Covered by source test |
| EDITOR-UI-021 | Floating save notification is positioned away from the Save button. | Success feedback must not cover the action the user just used. | Covered by source test |

Manual checks to prioritise:

- Select each new punctuation character, click a grid cell, and confirm the cell stays filled.
- Edit a non-`A` character, change font name or height, and confirm the editor does not jump to `A`.
- Use Select Duplicate, choose a source tile, and confirm the selected character draft updates.
- Save a character and confirm the success message does not cover Save Character.
