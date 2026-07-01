# Character Editor

## Purpose

Allow users to edit an individual character grid, resize it, clear it, reset it, save it, or create a new mapped character from a blank grid or duplicated source character.

## Source References

- Page: `src/app/editor/page.tsx`
- Component: `EditorClient` in `src/app/editor/EditorClient.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Functions: `cloneFont()`, `clearCharacter()`, `resizeCharacter()`, `validateCharacter()` in `src/lib/gridUtils.ts`
- Related route parameter: `/editor?font=`
- Inline status message: `Font changes saved successfully.`


## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Character Editor decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Available fonts.
- Selected font id.
- Selected character key.
- Source character for duplication.
- Destination character input.
- Replace-existing checkbox.
- Draft grid edits.
- Width and height values.
- Clear, reset, save and delete actions.

## Outputs

- Editable character grid.
- Draft character state.
- Saved character changes to selected font.
- New mapped character when creation mode is active.
- Save-disabled warning where applicable.
- Inline save success or failure status.
- Font delete request.

## State Transitions

1. Editor page loads available fonts and optional `font` query parameter.
2. Selected font and character are chosen.
3. `CharacterEditor` receives the active character as a draft.
4. User edits cells, resizes, clears or resets draft.
5. Validation runs against draft.
6. Save either updates existing character or writes a new destination character.
7. Updated font is saved through `useFonts().saveFont()`.
8. Save success is returned only after the database save and font refresh complete.
9. Editor shows an inline success message when save succeeds or a local failure status when save fails.
10. Editor returns to normal character-editing mode after saving a new character.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must be able to toggle cells. | Confirmed | Implemented | CharacterGrid editable mode. |
| Users must be able to clear a character. | Confirmed | Implemented | Clear button. |
| Users must be able to reset a character. | Confirmed | Implemented | Reset button. |
| Users must be able to resize width and height. | Confirmed | Implemented | Number inputs and `resizeCharacter()`. |
| Save must prevent invalid grids. | Confirmed | Implemented | Validation disables save. |
| New duplicated characters must require a destination key. | Confirmed | Implemented | Save disabled reason. |
| Destination characters must be one visible character. | Confirmed | Implemented | User confirmed destination should be one visible character; current code uses the first typed character. |
| Existing mapped characters must be protected unless replacement is confirmed. | Confirmed | Implemented | Replace checkbox required. |
| Successful saves must show clear inline confirmation. | Confirmed | Implemented | `CharacterEditor` shows `Font changes saved successfully.` after `saveFont()` returns success. |
| Database save failures must show local editor status. | Confirmed | Implemented | `CharacterEditor` shows local failure status when `onSave()` returns `false` or throws. Existing hook alerts remain in place. |
| Users must be able to delete fonts from the editor. | Confirmed | Implemented | Delete font button is currently available and user confirmed this should remain. |
| Any visible font can be edited under the current public shared model. | Confirmed | Implemented | User confirmed editing any visible font is acceptable. |

## Negative Rules

- Must not save a new character without a destination key.
- Must not overwrite an existing key unless replacement is explicitly confirmed.
- Must not save invalid character dimensions or rows.
- Must not mutate the selected font object directly without cloning.
- Must not lose the selected font after save.

## Acceptance Criteria

- Given a selected character, when a cell is toggled and saved, then the font is saved with the updated grid.
- Given Clear is clicked, then all draft cells become `0`.
- Given Reset is clicked, then draft returns to the original character passed into the editor.
- Given width is changed, then the grid resizes within the 1-24 limit.
- Given duplicate mode without a destination, then Save is disabled or blocked.
- Given destination already exists, then Save is blocked until Replace existing is checked.
- Given a new destination is saved, then it appears in future previews and generator rendering.
- Given a character is saved successfully, when the save completes, then an inline confirmation message is shown in the editor.
- Given a database save fails, when the save attempt finishes, then a local editor status message explains that the save failed.
- Given Delete font is clicked, when the user confirms deletion, then the selected font is deleted according to the active persistence model.

## Edge Cases

- No fonts available.
- Selected font id missing.
- Selected character missing.
- Destination input longer than one character.
- Blank destination input.
- Replace existing unchecked.
- Width/height outside bounds.
- Save failure from database.
- Delete currently selected font.

## Current Code Behaviour

- Currently derives initial font from query parameter or first font.
- Currently defaults selected character to `A`.
- Currently takes the first character of destination input.
- Currently creates blank new characters at a size based on selected font default height, clamped to 1-24.
- Currently clones the selected font before writing edited characters.
- Currently waits for `saveFont()` to return success before resetting editor state.
- Currently shows `Font changes saved successfully.` inline after a successful save.
- Currently shows a local editor error status when a save fails.
- Currently uses `window.confirm` for font deletion.

## Known Gaps / Defects

- No current Character Editor save-status gaps are known from this documentation pass.

## Unclear or Assumed Rules

- None currently for the listed Character Editor decisions. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Editing any visible font is acceptable under the current public shared model.
- Destination characters should be one visible character.
- Users should be able to delete fonts from the editor.
- Saved edits should show a success message.
- Successful saves should show clear inline confirmation.
- Database save failures should show local editor status.
- Current reset behaviour, based on the character prop supplied when the component mounted, is acceptable.

## Suggested Test Areas

- Existing character edit/save.
- Clear/reset.
- Resize bounds.
- Duplicate into new character.
- Blank new character.
- Replacement protection.
- Save failure behaviour.
- Inline save confirmation.
- Local editor save-failure status.
- Delete font from editor.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.





