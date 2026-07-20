# Character Editor

## Purpose

Allow users to edit an individual character grid, resize it, clear it, reset it, save it, create a new mapped character from a blank grid or duplicated source character, and avoid losing unsaved character work accidentally.

## Source References

- Page: `src/app/editor/page.tsx`
- Component: `EditorClient` in `src/app/editor/EditorClient.tsx`
- Component: `CharacterEditor` in `src/components/CharacterEditor.tsx`
- Component: `CharacterGrid` in `src/components/CharacterGrid.tsx`
- UI state: `newCharacterOpen`, `creatingCharacter`, `sourceCharacterKey`, `destinationCharacterKey`, `replaceExistingCharacter`, `newCharacterDraft`, `savingCharacter`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Functions: `cloneFont()`, `clearCharacter()`, `resizeCharacter()`, `validateCharacter()` in `src/lib/gridUtils.ts`
- Related route parameter: `/editor?font=`
- Floating status message: `Font changes saved successfully.`
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
- Floating save success, saving, or failure status.
- Font delete request.
- Sidebar character picker with active selected state.
- Sidebar character picker with A-Z, a-z, 0-9, common punctuation, then other mapped characters.
- Exists, not-created and selected tile states.
- Duplicate-source modal for copying an existing character or blank grid into the selected character.
- Stable duplicate draft state that remains attached to the destination character during save and font refresh.
- Protection against stale font refreshes overwriting newly saved character work with older or less-complete font data.
- Duplicate source picker ordered the same as the main character picker and limited to characters with filled stitch designs.
- Compact dimension controls below the editable grid.
- Editable font name and font-level height controls in the editor sidebar.
- Font panel containing font selector, font settings and Delete Font danger zone.
- Character panel containing character picker, legend and Select Duplicate action.
- Character editor panel containing selected character grid, width control directly under the grid, Reset, Clear and Save Character actions.

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
11. Updated font is saved through `useFonts().saveFont()` using the latest local font reference for the same font ID.
12. Save success is returned only after the database font save completes. For UUID custom fonts, the active edited character is then written directly to `custom_font_characters` by `font_id` and `character_key`.
13. As soon as save starts, the editor shows `Saving character...`, changes the button label to `Saving...`, marks it busy, and prevents repeat clicks.
14. While a character save is in progress, the editor suppresses transient duplicate-destination warnings caused by refreshed font data.
15. After save, if a later refresh returns a version with fewer filled character designs for the same font, the editor keeps the more complete local font state instead of downgrading the active working copy.
16. Editor shows an inline success message when save succeeds or a local failure status when save fails.
17. Editor returns to normal character-editing mode after saving a new character.

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
| Character saves must show immediate in-progress feedback. | Confirmed | Implemented | Save Character changes to `Saving...`, exposes `aria-busy`, and shows `Saving character...` while awaiting the database save. |
| Character saves must prevent repeat clicks while the save is in progress. | Confirmed | Implemented | The save button is disabled while `isSaving` is true. |
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
| Character selection must show A-Z first, then a-z, then 0-9, then common punctuation, then other mapped characters. | Confirmed | Implemented | User requested punctuation completion; shared character set now drives the picker. |
| Character tiles must visually distinguish existing, not-created and selected characters. | Confirmed | Implemented | Existing means the character has at least one filled stitch, not merely that a blank starter grid exists. |
| Selected characters should use the filled tile style, existing unselected characters should use a solid outline, and not-created characters should use a different-colour dashed outline. | Confirmed | Implemented | Blank starter-grid characters remain not-created unless they contain filled stitches. |
| Duplicate selection should use a tile selection UI rather than a dropdown. | Confirmed | Implemented | Select Duplicate opens a modal with a blank option and source character tiles. |
| Duplicate source tiles must use the same ordering as the main character picker. | Confirmed | Implemented | Source tiles are derived from the same displayed character list: A-Z, a-z, 0-9, punctuation, then other mapped characters. |
| Duplicate source tiles must only show characters with existing stitch designs. | Confirmed | Implemented | Not-created/blank characters are hidden from duplicate-source selection and cannot be selected. |
| Duplicate selection should copy the selected source into the currently selected character. | Confirmed | Implemented | The selected character remains the destination; source selection changes the draft only. |
| Character width controls should sit directly below the editable character grid. | Confirmed | Implemented | Font height is controlled in the sidebar; character width stays in the same left stack as the grid. |
| Font height must be set at the font level. | Confirmed | Implemented | The editor exposes font height in the sidebar and character save resizes the saved character to the font height. |
| Every character in a font must have the same height as the font height. | Confirmed | Implemented | Saving font settings resizes all characters to the selected font height. |
| Font height must remain selectable on the font. | Confirmed | Implemented | Font height is editable from the editor sidebar. |
| Font name must be editable on the editor screen. | Confirmed | Implemented | Font name is editable from the editor sidebar. |
| Character height must not be edited per character. | Confirmed | Implemented | Character editor now only exposes character width; height is controlled by the font. |
| The editor must not briefly fall back to another font while the requested font is loading or refreshing. | Confirmed | Implemented | The editor now shows a loading state for unresolved requested fonts rather than rendering the first font. |
| Duplicate-created characters must not flash back to the source character during save. | Confirmed | Implemented | The duplicate source is copied into a stable destination draft and the editor key is based on the destination, not the source. |
| Successful duplicate-created character saves must not briefly show a false character already exists warning. | Confirmed | Implemented | Save-in-progress state suppresses duplicate warnings that can appear when refreshed font data already includes the destination. |
| Character saves must not use stale selected-font data when a newer local font version exists. | Confirmed | Implemented | `saveCharacter()` uses `latestFontRef` for the same font ID so newly created characters are not dropped by subsequent saves. |
| Remote refreshes must not downgrade the active editor font to a version with fewer created characters. | Confirmed | Implemented | The editor compares filled-character counts and keeps the more complete local working copy for the active font. |
| Duplicated and hand-drawn custom character designs must persist after browser refresh. | Confirmed | Implemented | Remote custom font saves persist only filled character rows. UUID custom-font character saves bypass the broad whole-font save path and write the active custom character row directly through `useFonts().saveFontCharacter()`, which calls `saveRemoteCustomFontCharacter()` before reporting success. |

## Negative Rules

- Must not save a new character without a destination key.
- Must not overwrite an existing key unless replacement is explicitly confirmed.
- Must not save invalid character dimensions or rows.
- Must not mutate the selected font object directly without cloning.
- Must not lose the selected font after save.
- Must not leave the full new-character form permanently expanded on the editor screen.
- Must not let editor action buttons overlap character width or font-height controls.
- Must not hide not-created standard letters, numbers or punctuation from the picker.
- Must not use a dropdown for duplicate-source selection.
- Must not show duplicate-source character tiles in a different order from the main character picker.
- Must not allow not-created/blank characters to be selected as duplicate sources.
- Must not change the selected destination character when choosing a duplicate source.
- Must not use the filled tile style for existing unselected characters.
- Must not treat blank starter grids as existing created letters.
- Must not allow one character in a font to have a different height from the font height.
- Must not expose per-character height editing while height is a font-level setting.
- Must not save a blank font name.
- Must not flash to the first available font while a routed or selected font is still loading.
- Must not flash from a duplicate-created destination back to the duplicated source character while saving.
- Must not overwrite newly saved character designs with an older selected-font snapshot during refresh.
- Must not persist blank starter-grid characters as if they were created character designs.
- Must not show a transient `character already exists` warning during a successful duplicate-created character save.
- Must not leave Save Character visually unchanged while a save is in progress.
- Must not allow repeat Save Character clicks while a save is in progress.
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
- Given a character save is started, when the database save is still pending, then the button shows `Saving...`, the button is disabled, and a polite `Saving character...` status is shown.
- Given a character is saved successfully, when the save completes, then an inline confirmation message is shown in the editor.
- Given a database save fails, when the save attempt finishes, then a local editor status message explains that the save failed.
- Given Delete font is clicked, when the user confirms deletion, then the selected font is deleted according to the active persistence model.
- Given the Font Editor screen loads, when characters exist for the selected font, then character choices are shown as compact tiles with the active character highlighted.
- Given the Font Editor screen loads, when the character picker renders, then A-Z appears before a-z, a-z appears before 0-9, punctuation follows numbers, and other mapped characters appear last.
- Given a standard character has not been created, when the picker renders, then the character appears with the not-created border state.
- Given a brand-new font contains blank starter grids, when the picker renders, then blank characters appear as not-created unless their grid contains at least one filled stitch.
- Given a character exists and is not selected, when the picker renders, then the character uses a solid outline and not the filled selected style.
- Given a character is selected, when the picker renders, then the selected character uses the filled tile style with the selected border treatment.
- Given a font route points to a font that has not loaded yet, when the editor first renders, then it shows a loading state rather than briefly showing another font.
- Given Select Duplicate is clicked, when the modal opens, then the user can choose Blank or an existing source character from a tile selector.
- Given the duplicate source modal opens, when source character tiles are displayed, then they appear in the same order as the main character picker.
- Given a character has no filled stitch design, when the duplicate source modal opens, then that character is not shown and cannot be selected as a duplicate source.
- Given a duplicate source is selected, when the user confirms the modal, then the selected destination character draft uses the source grid.
- Given a duplicate source is selected and the user edits the destination draft, when Save Character is clicked, then the editor remains on the destination character and does not briefly show the source character.
- Given a duplicate-created destination is saving successfully, when the font data refreshes, then the editor does not show a false character already exists warning.
- Given dimension controls and editor actions are visible, when the screen is viewed at desktop width, then Clear, Reset and Save do not overlap the Width field or font settings fields.
- Given the editor grid is visible, when character dimension controls render, then character Width appears directly below the character grid and Height is controlled in the sidebar.
- Given the editor screen is open, when the user changes the font name and saves font settings, then the font is saved with the new name.
- Given the editor screen is open, when the user changes font height and saves font settings, then every character in the font is resized to the selected height.
- Given a character is edited and saved, when the character is written to the font, then its height matches the font height.
- Given characters A through I have already been saved and a user saves J, when a remote refresh returns stale data, then the editor must not replace the active font with a less-complete version that drops A through I.
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
- Selecting an unmapped uppercase, lowercase, numeric or punctuation character.
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
- Currently shows `Saving character...` immediately when a character save begins.
- Currently changes Save Character to `Saving...`, applies `aria-busy`, and disables the button while the save promise is pending.
- Currently shows `Font changes saved successfully.` as a floating auto-dismiss notification after a successful save.
- Currently shows a local editor error status when a save fails.
- Currently uses `window.confirm` for font deletion.
- Currently shows font selection, font settings and Delete Font in a dedicated Font panel.
- Currently shows ordered character tiles, legend and Select Duplicate in a wider dedicated Character panel with seven desktop columns and no internal desktop scrollbar.
- Currently shows selected character grid with Width directly below it, plus Reset, Clear and Save Character in a compact Character editor panel.
- Currently includes A-Z, a-z, 0-9 and common punctuation in the character picker even when some characters are not yet mapped.
- Currently shows selected as the filled tile state, exists as a solid outline, and not-created as a different-colour dashed outline.
- Currently treats a character as existing only when its grid contains at least one `1` cell.
- Currently avoids falling back to the first font while a requested `font` query parameter is unresolved.
- Currently shows duplicate-source setup in a modal dialog controlled by `newCharacterOpen`.
- Currently places character width controls directly below the editable grid.
- Currently places font name and font height controls in the editor sidebar.
- Currently resizes every character to the selected font height when font settings are saved.
- Currently resizes saved character edits to the selected font height before saving.
- Currently places Reset and Clear in the editor footer, with Save Character aligned as the primary action.
- Currently removes the previous character-width information panel from the editor controls.
- Currently shows an unsaved-change confirmation dialog before character changes, font changes, internal navigation or duplicate setup when the current character draft is dirty.
- Currently waits for duplicate modal confirmation before applying the duplicated source to the editor draft.
- Currently stores the duplicated source as a stable `newCharacterDraft` for the destination character so refreshes do not recompute the draft from the source.
- Currently builds duplicate-source tiles from the ordered main character list and filters out characters without filled stitches.
- Currently suppresses duplicate-destination save warnings while `savingCharacter` is true to avoid transient false warnings during successful saves.

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


## 2026-07-07 UX Update: Unsaved Changes And Notifications

### Added Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| The editor must not allow accidental navigation away from unsaved character changes. | Confirmed | Implemented | Character changes, font changes, internal navigation and duplicate setup use the unsaved-change confirmation flow. |
| Save & Continue must save before continuing the pending action. | Confirmed | Implemented | The editor exposes the current draft save action to the parent confirmation dialog. |
| Discard Changes must discard the draft before continuing the pending action. | Confirmed | Implemented | The editor exposes a discard action that restores the draft baseline. |
| Cancel must keep the user on the current character with edits intact. | Confirmed | Implemented | The pending action is cleared without changing the draft. |
| The character-width information panel must not appear. | Confirmed | Implemented | The previous guidance panel was removed to recover editor space. |
| Character save success must use a floating auto-dismiss notification that does not move layout. | Confirmed | Implemented | The notification uses an absolutely positioned editor status surface. |
| Duplicate-source selection must not apply the duplicated character until the user confirms. | Confirmed | Implemented | Source tiles choose a source only; creating mode starts from the modal confirmation button. |

### Added Negative Rules

- Must not let the user leave a dirty character draft without choosing Save & Continue, Discard Changes or Cancel.
- Must not show the character-width information panel.
- Must not let success status messages push editor controls around.
- Must not enter duplicate/create mode while the user is only selecting a duplicate source.

### Added Acceptance Criteria

- Given a character has unsaved edits, when the user selects another character, then the unsaved-change confirmation dialog appears.
- Given the unsaved-change dialog is open, when Save & Continue is clicked and save succeeds, then the pending character, font or navigation action continues.
- Given the unsaved-change dialog is open, when Discard Changes is clicked, then the draft is discarded and the pending action continues.
- Given the unsaved-change dialog is open, when Cancel is clicked, then the dialog closes and the current character edits remain intact.
- Given the editor renders, when the character controls are visible, then the old character-width information panel is not displayed.
- Given a character save succeeds, when the success notification appears, then surrounding controls do not move and the notification automatically dismisses.
- Given Select Duplicate is open, when a duplicate source tile is selected, then the editor does not show the duplicated draft or existing-character warning until the user confirms the duplicate.

### Added Test Areas

- Unsaved-change confirmation for character selection, font selection and internal navigation.
- Save & Continue, Discard Changes and Cancel flows.
- Removed information panel.
- Floating auto-dismiss save notification.
- Duplicate-source selection before modal confirmation.


## 2026-07-07 Bug Fix Update: Draft Stability And Font Settings

### Added Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Not-created punctuation characters must be drawable immediately after selection. | Confirmed | Implemented | Blank draft characters are memoised so editing cells is not reset by parent re-renders. |
| Saving font name or font height must not switch the editor back to `A`. | Confirmed | Implemented | Font settings save preserves the active character and routes through the unsaved-character guard. |
| Saving font settings after character edits must use the latest saved character data. | Confirmed | Implemented | The editor keeps a latest-font reference after character save to avoid overwriting edits. |
| Duplicate source selection must apply the chosen source to the selected character draft. | Confirmed | Implemented | Source tiles now apply the duplicate draft directly and close the picker. |
| The floating save message must not cover the Save Character button. | Confirmed | Implemented | The floating notification is positioned near the upper-right of the editor panel. |
| Character width and font height are currently clamped to 1-24 stitches. | Assumed | Implemented | This is an implementation safety limit to prevent oversized editor grids; it is not a confirmed craft/domain limit. |

### Added Acceptance Criteria

- Given a not-created punctuation character is selected, when a grid cell is clicked, then the cell remains filled and the draft becomes dirty.
- Given the current character has unsaved edits, when the user saves font settings, then the unsaved-change confirmation appears before font settings are applied.
- Given Save & Continue is used before saving font settings, when the font settings save completes, then the active character remains selected and its edits remain in the font.
- Given Select Duplicate is open, when a source character tile is clicked, then that source is applied to the selected character draft without requiring a second confirmation step.
- Given a character save succeeds, when the success notification appears, then it does not cover the Save Character button.

### Open Product Question

- Should the 24-stitch maximum width/height remain, be raised, or become user-configurable for larger alphabets?

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.

## 2026-07-14 Update: Default Width and Blank Dimension Inputs

- Confirmed behaviour: each font has a font-level default character width.
- Default width controls the starting grid width for newly created blank characters only.
- Character width remains editable per character after creation.
- Font height remains a required font-level value and applies to every character in the font.
- Font height and default width inputs may be temporarily blank while the user is editing, but saving must be blocked until both values are valid whole numbers between 1 and 60.
- Blank height input must not coerce immediately to 0, because that causes accidental values like 012 while typing.

### Added Acceptance Criteria

- Given the user clears the Font height field, when they type a new value, then the field does not force a leading 0.
- Given the Font height field is blank, when Save font settings is clicked, then saving is blocked with a clear required-field message.
- Given the Default character width is set to 14 and Font height is 9, when a new blank character is created, then the draft grid starts as 14 x 9.
- Given a new blank character starts from the font default width, when the user edits that character width, then only that character width changes.

### Related Tests

- EDITOR-UI-029 in tests/editorUiSource.test.ts.
- fontData.test.ts blank font default-width coverage.

## 2026-07-19 Bug Fix Update: Save Refresh Stability

### Added Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Successful character saves must not be visually replaced by older or blank remote data during the follow-up refresh. | Confirmed | Implemented | `useFonts()` now reapplies the just-saved font after `refresh()` so the editor keeps the saved grid while remote data catches up. |
| Save success messaging must only appear after `saveFont()` returns success. | Confirmed | Implemented | `CharacterEditor` already waits for the parent save result before showing success. |

### Added Acceptance Criteria

- Given a user edits a character grid, when Save character succeeds, then the edited grid remains visible after the remote refresh completes.
- Given the remote refresh returns an older or blank version immediately after save, when the save has already succeeded, then the just-saved font remains the local editor source.
- Given the save fails, when the parent save returns false or throws, then the success message is not displayed.

### Related Tests

- FONT-REFRESH-002 in `tests/fontRefreshSource.test.ts`.
- EDITOR-UI-030 in `tests/editorUiSource.test.ts`.

## 2026-07-19 Bug Fix Update: Default Width For Uncreated Characters

### Added Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Selecting an uncreated character must open a blank draft using the font-level default width. | Confirmed | Implemented | The editor now builds uncreated drafts from `defaultWidth x defaultHeight`. |
| Existing created characters must keep their character-specific width. | Confirmed | Implemented | Only characters with filled stitches use their saved character object directly. |
| Old blank placeholder widths must not override the current font default width. | Confirmed | Implemented | Blank/uncreated placeholders are ignored when building the active draft. |

### Added Acceptance Criteria

- Given a font default width is changed from 8 to 12, when the user selects an uncreated character, then the editable grid opens at 12 stitches wide.
- Given an existing character was previously saved at 7 stitches wide, when the font default width changes, then that existing character remains 7 stitches wide unless edited.
- Given a blank placeholder character exists with an old width, when that character has no filled stitches, then the editor uses the current font default width instead.

### Related Tests

- EDITOR-UI-031 in `tests/editorUiSource.test.ts`.


