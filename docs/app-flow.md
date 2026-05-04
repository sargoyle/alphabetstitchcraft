# Cross-Stitch Lettering Library App Flow

## Information Architecture

Primary screens:

- Home `/`
- Font Library `/fonts`
- Font Detail `/fonts/[id]`
- Text Generator `/generator`
- Character Editor `/editor`
- My Custom Fonts `/custom-fonts`

Persistent navigation should allow users to move between:

- Home
- Fonts
- Generator
- Editor
- Custom Fonts

## Global State

The app should track:

- Available default fonts.
- Saved custom fonts from localStorage.
- Selected font ID.
- Generator text.
- Generator spacing settings.
- Generator display settings.
- Current generated pattern.
- Current editor font.
- Current editor character.

State persistence:

- Custom fonts persist in localStorage.
- Selected generator font may persist.
- Generator text and settings may persist.
- Invalid persisted state should fall back safely.

## Journey 1: Browse a Font

### Goal

User wants to inspect available stitch alphabets and choose one.

### Flow

1. User opens the website.
2. User selects Font Library.
3. Font Library loads default and custom fonts.
4. User filters by category, such as Gothic, Tiny, Block, or Sampler.
5. User reviews font cards.
6. User selects View Alphabet.
7. Font Detail opens.
8. User sees supported characters rendered on grids.
9. User can choose Use in Generator or Duplicate Font.

### Success State

User understands the selected font's style, dimensions, supported characters, and recommended use.

### Edge Cases

- No fonts found for filter: show empty state and clear-filter action.
- Font ID missing or invalid: show not-found state and link back to Font Library.
- Font contains unsupported sample text: preview skips or placeholders unsupported characters safely.

## Journey 2: Generate Text

### Goal

User wants to type a name, quote, or phrase and see it as stitch lettering.

### Flow

1. User opens Text Generator.
2. App loads selected font or default font.
3. User enters text into multiline textarea.
4. Renderer converts text into a generated pattern grid.
5. Preview updates live.
6. App displays width and height in stitches.
7. User adjusts letter spacing.
8. User adjusts word spacing.
9. User adjusts line spacing.
10. User selects left, center, or right alignment.
11. User toggles grid visibility or filled stitch visibility if desired.
12. User changes zoom if needed.
13. User exports PNG or copies stitch dimensions.

### Success State

User has a visible stitch lettering pattern with accurate dimensions and can export it.

### Edge Cases

- Empty text: show empty preview state and dimensions of 0 by 0.
- Unsupported characters: render placeholders and show a warning listing characters.
- Very long line: preview scrolls horizontally without breaking layout.
- Very tall multiline text: preview scrolls vertically or page remains usable.
- Missing selected font: fall back to first valid font.
- Export failure: show readable error and keep preview intact.

## Journey 3: Edit a Character

### Goal

User wants to manually adjust a letter or symbol on a stitch grid.

### Flow

1. User opens Character Editor.
2. User selects a font.
3. If selected font is default, app should encourage duplicating before saving edits.
4. User selects a character.
5. Editable grid displays the character.
6. User clicks cells to toggle filled/empty.
7. User may clear the character.
8. User may reset the character to original data.
9. User may adjust width or height.
10. User saves the edited character.
11. App stores the updated custom font locally.
12. Future previews and generator output use the updated character.

### Success State

The edited character is saved locally and reflected wherever that custom font is used.

### Edge Cases

- User tries to edit default font: require duplicate or save as custom copy.
- Character missing: show unavailable character state.
- Invalid resize: prevent values below minimum or above maximum.
- User leaves with unsaved changes: warn or indicate unsaved status if practical.
- Save fails due to localStorage issue: show error and preserve in-memory edits.

## Journey 4: Create a Custom Font

### Goal

User wants a personal version of an existing stitch alphabet.

### Flow

1. User browses Font Library or Font Detail.
2. User selects Duplicate Font.
3. App asks for custom font name.
4. App creates a custom font object with unique ID.
5. App copies all source character data.
6. App saves the custom font to localStorage.
7. App marks it as custom and stores `baseFontId`.
8. User is taken to Character Editor or Custom Fonts page.
9. User edits characters as needed.
10. Custom font appears in Font Library, Generator, Editor, and Custom Fonts.

### Success State

User has a locally saved custom font that can be edited and used for generated lettering.

### Edge Cases

- Empty name: prevent duplicate until a name is entered.
- Duplicate name: allow with suffix or request a different name.
- localStorage unavailable: show error and explain custom fonts cannot be saved.
- Corrupted custom font data: skip invalid font and show recovery notice if needed.

## Journey 5: Export Pattern

### Goal

User wants to save the generated lettering pattern outside the app.

### Flow

1. User generates text.
2. User confirms preview and stitch dimensions.
3. User selects Export PNG.
4. App renders generated pattern to canvas or SVG.
5. App downloads PNG.
6. User can also copy stitch size.
7. Optional: user exports generated pattern JSON.

### Success State

The exported PNG matches the visible grid preview and includes filled cells and grid lines.

### Edge Cases

- No generated pattern: disable export or show empty-state message.
- Browser blocks download: provide fallback message.
- Pattern is very large: export still works or warns the user if dimensions are too large.
- Preview zoom differs from export size: use consistent export settings and avoid surprise.

## Screen-by-Screen Requirements

### Home

Primary purpose:

- Give users immediate entry into the tool.

Content:

- Product name.
- Short explanation of stitch lettering purpose.
- Live or static stitch preview.
- Primary actions.

States:

- Normal.
- No JavaScript fallback is not required for v1.

### Font Library

Content:

- Category filter.
- Optional search.
- Font cards.

Transitions:

- View Alphabet leads to `/fonts/[id]`.
- Use in Generator leads to `/generator` with selected font.
- Duplicate Font creates custom font and routes to editor or custom fonts.

States:

- Loading.
- No fonts.
- No filter results.
- Normal list.

### Font Detail

Content:

- Font metadata.
- Character groups.
- Character grids.
- Actions.

Transitions:

- Use in Generator.
- Duplicate Font.
- Back to Library.

States:

- Font found.
- Font not found.
- Invalid font data.

### Generator

Content:

- Font selector.
- Textarea.
- Spacing controls.
- Alignment controls.
- Display controls.
- Dimensions.
- Unsupported character warning.
- Pattern preview.
- Export controls.

Transitions:

- Select font updates preview.
- Use editor action may open `/editor` with selected font.
- Export stays on page.

States:

- Empty text.
- Valid generated pattern.
- Unsupported characters.
- Exporting.
- Export error.

### Character Editor

Content:

- Font selector.
- Character selector.
- Editable grid.
- Width and height controls.
- Clear, reset, save actions.
- Save status.

Transitions:

- Selecting a font updates available characters.
- Selecting a character updates grid.
- Save persists custom font.
- Duplicate default font routes user into editable custom copy.

States:

- No font selected.
- No character selected.
- Editing custom font.
- Default font selected.
- Unsaved changes.
- Saved.
- Save error.

### My Custom Fonts

Content:

- List custom fonts.
- Custom font metadata.
- Actions.

Transitions:

- Edit opens editor.
- Use opens generator.
- Rename updates localStorage.
- Delete removes font.

States:

- Empty state.
- Custom font list.
- Rename mode.
- Delete confirmation.
- localStorage error.

## Navigation Rules

- Main navigation should always be available.
- Font selection should carry into generator where possible.
- Custom fonts should be treated as first-class font options after loading.
- Missing route data should return helpful not-found states, not blank screens.

## Error States

### Unsupported Characters

Show:

- Placeholder in preview.
- Warning with unsupported characters listed.
- Message should be practical, such as `Unsupported characters: @, #`.

### Invalid Font Data

Show:

- Font cannot be loaded message.
- Link back to Font Library.

Log development details only where appropriate.

### localStorage Failure

Show:

- Local save unavailable message.
- Keep current in-memory changes if possible.

### Export Failure

Show:

- Export failed message.
- Suggest trying again or reducing pattern size.

## State Transition Summary

Font selection:

- Library card action updates selected font and opens generator or detail.
- Detail action updates selected font and opens generator.
- Generator selector updates selected font immediately.

Custom font creation:

- Duplicate default font.
- Save custom font.
- Add to available font list.
- Route to editor or custom fonts.

Character editing:

- Select custom font.
- Select character.
- Modify grid.
- Save.
- Update localStorage.
- Re-render previews using updated data.

Export:

- Generate pattern.
- Use same generated grid for preview and export.
- Download PNG.

## Completion Criteria

The app flow is complete when the user can complete all primary journeys:

- Browse a font.
- Generate text.
- Edit a character.
- Create a custom font.
- Export a PNG.

All flows must work without backend services or user accounts.

