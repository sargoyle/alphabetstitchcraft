# Character Editor

## Purpose

Allow users to edit an individual character grid, resize it, clear it, reset it, save it, or create a new mapped character from a blank grid or duplicated source character.

## Source References

- Page: `src/app/editor/page.tsx`
- Component: `EditorClient` in `src/app/editor/EditorClient.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- UI state: `newCharacterOpen`, `creatingCharacter`, `sourceCharacterKey`, `destinationCharacterKey`, `replaceExistingCharacter`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Functions: `cloneFont()`, `clearCharacter()`, `resizeCharacter()`, `validateCharacter()` in `src/lib/gridUtils.ts`
- Related route parameter: `/editor?font=`
- Inline status message: `Font changes saved successfully.`
- UI pattern: Three-panel Font Editor layout with Font panel, Character panel and Character editor panel; ordered character tile picker; exists/not-created/selected legend; compact duplicate-source dialog; loading state for requested fonts; danger zone delete panel; compact character editor action area.


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
- Character width value.
- Font name draft.
- Font height draft.
- Clear, reset, save and delete actions.
- New Character button action.
- Select Duplicate button action.
- Modal close and cancel actions.

## Outputs

- Editable character grid.
- Draft character state.
- Saved character changes to selected font.
- New mapped character when creation mode is active.
- Save-disabled warning where applicable.
- Inline save success or failure status.
- Font delete request.
- Sidebar character picker with active selected state.
- Sidebar character picker with A-Z, a-z, 0-9, then other mapped characters.
- Exists, not-created and selected tile states.
- Duplicate-source modal for copying an existing character or blank grid into the selected character.
- Compact dimension controls below the editable grid.
- Editable font name and font-level height controls in the editor sidebar.
- Font panel containing font selector, font settings and Delete Font danger zone.
- Character panel containing character picker, legend and Select Duplicate action.
- Character editor panel containing selected character grid, width control directly under the grid, guidance text, Reset, Clear and Save Character actions.

## State Transitions

1. Editor page loads available fonts and optional `font` query parameter.
2. Selected font and character are chosen.
3. `CharacterEditor` receives the active character as a draft.
4. User edits cells, resizes, clears or resets draft.
5. Validation runs against draft.
6. User may select an existing or not-created character tile. Not-created characters open as blank draft characters that can be saved.
7. User may open Select Duplicate, choose a blank grid or an existing source character from a tile picker, then copy that source into the selected character draft.
8. User may edit the font name or font height in the sidebar and save font settings.
9. Font height save resizes every character in the font to the selected height.
10. Character save either updates an existing character or writes a new destination character at the current font height.
11. Updated font is saved through `useFonts().saveFont()`.
12. Save success is returned only after the database save and font refresh complete.
13. Editor shows an inline success message when save succeeds or a local failure status when save fails.
14. Editor returns to normal character-editing mode after saving a new character.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must be able to toggle cells. | Confirmed | Implemented | CharacterGrid editable mode. |
| Users must be able to clear a character. | Confirmed | Implemented | Clear button. |
| Users must be able to reset a character. | Confirmed | Implemented | Reset button. |
| Users must be able to resize character width. | Confirmed | Implemented | Character width remains editable per character. |
| Save must prevent invalid grids. | Confirmed | Implemented | Validation disables save. |
| New duplicated characters must require a destination key. | Confirmed | Implemented | Save disabled reason. |
| Destination characters must be one visible character. | Confirmed | Implemented | User confirmed destination should be one visible character; current code uses the first typed character. |
| Existing mapped characters must be protected unless replacement is confirmed. | Confirmed | Implemented | Replace checkbox required. |
| Successful saves must show clear inline confirmation. | Confirmed | Implemented | `CharacterEditor` shows `Font changes saved successfully.` after `saveFont()` returns success. |
| Database save failures must show local editor status. | Confirmed | Implemented | `CharacterEditor` shows local failure status when `onSave()` returns `false` or throws. Existing hook alerts remain in place. |
| Users must be able to delete fonts from the editor. | Confirmed | Implemented | Delete font button is currently available and user confirmed this should remain. |
| Any visible font can be edited under the current public shared model. | Confirmed | Implemented | User confirmed editing any visible font is acceptable. |
| Character selection should be compact and scannable. | Assumed | Implemented | Current editor uses sidebar character tiles instead of a full-width character dropdown. |
| Font Editor must use three desktop panels: Font panel, Character panel and Character editor panel. | Confirmed | Implemented | Font selector/settings/delete are separated from character selection and editing. |
| Font actions must live in the Font panel. | Confirmed | Implemented | Delete Font remains in the Font panel Danger Zone only. |
| Character selection and duplicate/create controls must live in the Character panel. | Confirmed | Implemented | Character picker, legend and Select Duplicate sit in their own middle panel. |
| Desktop Character panel should be wide enough to avoid an internal character-picker scrollbar where practical. | Confirmed | Implemented | Desktop uses a wider middle panel and seven character columns. |
| Character editing and save actions must live in the Character editor panel. | Confirmed | Implemented | Selected character grid, width, Reset, Clear and Save Character are grouped in the right panel. |
| Delete Font copy must clarify that it deletes the full font and all characters. | Confirmed | Implemented | Danger Zone text says `Deletes the full font and all characters permanently.` |
| Character selection must show A-Z first, then a-z, then 0-9, then other mapped characters. | Confirmed | Implemented | User requested this ordering for the sidebar section. |
| Character tiles must visually distinguish existing, not-created and selected characters. | Confirmed | Implemented | Existing means the character has at least one filled stitch, not merely that a blank starter grid exists. |
| Selected characters should use the filled tile style, existing unselected characters should use a solid outline, and not-created characters should use a different-colour dashed outline. | Confirmed | Implemented | Blank starter-grid characters remain not-created unless they contain filled stitches. |
| Duplicate selection should use a tile selection UI rather than a dropdown. | Confirmed | Implemented | Select Duplicate opens a modal with a blank option and source character tiles. |
| Duplicate selection should copy the selected source into the currently selected character. | Confirmed | Implemented | The selected character remains the destination; source selection changes the draft only. |
| Character width controls should sit directly below the editable character grid. | Confirmed | Implemented | Font height is controlled in the sidebar; character width stays in the same left stack as the grid. |
| Font height must be set at the font level. | Confirmed | Implemented | The editor exposes font height in the sidebar and character save resizes the saved character to the font height. |
| Every character in a font must have the same height as the font height. | Confirmed | Implemented | Saving font settings resizes all characters to the selected font height. |
| Font height must remain selectable on the font. | Confirmed | Implemented | Font height is editable from the editor sidebar. |
| Font name must be editable on the editor screen. | Confirmed | Implemented | Font name is editable from the editor sidebar. |
| Character height must not be edited per character. | Confirmed | Implemented | Character editor now only exposes character width; height is controlled by the font. |
| The editor must not briefly fall back to another font while the requested font is loading or refreshing. | Confirmed | Implemented | The editor now shows a loading state for unresolved requested fonts rather than rendering the first font. |

## Negative Rules

- Must not save a new character without a destination key.
- Must not overwrite an existing key unless replacement is explicitly confirmed.
- Must not save invalid character dimensions or rows.
- Must not mutate the selected font object directly without cloning.
- Must not lose the selected font after save.
- Must not leave the full new-character form permanently expanded on the editor screen.
- Must not let editor action buttons overlap character width or font-height controls.
- Must not hide not-created standard letters or numbers from the picker.
- Must not use a dropdown for duplicate-source selection.
- Must not change the selected destination character when choosing a duplicate source.
- Must not use the filled tile style for existing unselected characters.
- Must not treat blank starter grids as existing created letters.
- Must not allow one character in a font to have a different height from the font height.
- Must not expose per-character height editing while height is a font-level setting.
- Must not save a blank font name.
- Must not flash to the first available font while a routed or selected font is still loading.
- Must not place Delete Font beside selected-character save controls.
- Must not make the character picker scroll the full page awkwardly when many characters exist.

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
- Given the Font Editor screen loads, when characters exist for the selected font, then character choices are shown as compact tiles with the active character highlighted.
- Given the Font Editor screen loads, when the character picker renders, then A-Z appears before a-z, a-z appears before 0-9, and other mapped characters appear last.
- Given a standard character has not been created, when the picker renders, then the character appears with the not-created border state.
- Given a brand-new font contains blank starter grids, when the picker renders, then blank characters appear as not-created unless their grid contains at least one filled stitch.
- Given a character exists and is not selected, when the picker renders, then the character uses a solid outline and not the filled selected style.
- Given a character is selected, when the picker renders, then the selected character uses the filled tile style with the selected border treatment.
- Given a font route points to a font that has not loaded yet, when the editor first renders, then it shows a loading state rather than briefly showing another font.
- Given Select Duplicate is clicked, when the modal opens, then the user can choose Blank or an existing source character from a tile selector.
- Given a duplicate source is selected, when the user confirms the modal, then the selected destination character draft uses the source grid.
- Given dimension controls and editor actions are visible, when the screen is viewed at desktop width, then Clear, Reset and Save do not overlap the Width field or font settings fields.
- Given the editor grid is visible, when character dimension controls render, then character Width appears directly below the character grid and Height is controlled in the sidebar.
- Given the editor screen is open, when the user changes the font name and saves font settings, then the font is saved with the new name.
- Given the editor screen is open, when the user changes font height and saves font settings, then every character in the font is resized to the selected height.
- Given a character is edited and saved, when the character is written to the font, then its height matches the font height.
- Given the character editor is shown, when dimension controls render, then only character width is editable in the character panel.
- Given the Font Editor opens on desktop, when the layout renders, then Font panel, Character panel and Character editor panel appear as separate side-by-side areas.
- Given the Font panel renders, when the user reviews destructive actions, then Delete Font appears only in the Danger Zone and explains that it deletes the full font and all characters.
- Given the Character panel renders, when many characters exist, then character scrolling stays within the character picker area.
- Given the Font Editor renders on desktop, when the character picker shows the standard alphabet set, then the Character panel is wide enough to show seven tile columns without its own scrollbar.
- Given the Character editor panel renders, when selected character controls are visible, then grid and Width are stacked together while guidance text, Reset, Clear and Save Character use the remaining editor-panel space.

## Edge Cases

- No fonts available.
- Selected font id missing.
- Selected character missing.
- Destination input longer than one character.
- Blank destination input.
- Replace existing unchecked.
- Width or font-height outside bounds.
- Save failure from database.
- Delete currently selected font.
- Fonts with many mapped characters.
- New-character modal opened and closed without saving.
- Duplicating a source character into a destination key.
- Mobile layout where dimension controls stack below the grid.
- Tablet layout where the three panels stack into a usable single column.
- Narrow desktop layout where the wider character panel must still leave enough room for the editor panel.
- Selecting an unmapped uppercase, lowercase or numeric character.
- Fonts with no lowercase mappings.
- Source duplicate selection into an existing character.
- Font height changed after multiple characters already contain stitches.
- Font name cleared before saving settings.
- Remote save failure after font settings are changed.

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
- Currently shows font selection, font settings and Delete Font in a dedicated Font panel.
- Currently shows ordered character tiles, legend and Select Duplicate in a wider dedicated Character panel with seven desktop columns and no internal desktop scrollbar.
- Currently shows selected character grid with Width directly below it, plus guidance text, Reset, Clear and Save Character in a compact Character editor panel.
- Currently includes A-Z, a-z and 0-9 in the character picker even when some characters are not yet mapped.
- Currently shows selected as the filled tile state, exists as a solid outline, and not-created as a different-colour dashed outline.
- Currently treats a character as existing only when its grid contains at least one `1` cell.
- Currently avoids falling back to the first font while a requested `font` query parameter is unresolved.
- Currently shows duplicate-source setup in a modal dialog controlled by `newCharacterOpen`.
- Currently places character width controls directly below the editable grid.
- Currently places font name and font height controls in the editor sidebar.
- Currently resizes every character to the selected font height when font settings are saved.
- Currently resizes saved character edits to the selected font height before saving.
- Currently places Reset and Clear in the editor footer, with Save Character aligned as the primary action.

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
- Sidebar character tile active state.
- Select Duplicate modal open, cancel, blank and duplicate flows.
- Editor layout source guard for ordered picker, exists/not-created/selected states, duplicate-source grid, loading fallback prevention, modal, danger zone, dimension panel and action footer.
- Three-panel editor layout source guard for separate Font, Character and Character editor panels.
- Font settings source guard for editable font name, font-level height and no per-character height input.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.





