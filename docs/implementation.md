# Cross-Stitch Lettering Library Implementation Guide

## Technical Stack

Use the recommended v1 stack:

- Next.js
- React
- TypeScript
- Tailwind CSS
- Local JSON files for default font data
- Browser `localStorage` for saved custom fonts and user settings
- HTML canvas or SVG for PNG export rendering
- Supabase Postgres and Supabase Auth for authenticated persistence when moving beyond local-only storage

The original v1 can run local-only, but authenticated persistence is now scaffolded with SQL migrations and row-level security.

## Suggested Folder Structure

```text
/src
  /app
    /page.tsx
    /fonts/page.tsx
    /fonts/[id]/page.tsx
    /generator/page.tsx
    /editor/page.tsx
    /custom-fonts/page.tsx

  /components
    FontCard.tsx
    FontGridPreview.tsx
    CharacterGrid.tsx
    TextPatternPreview.tsx
    SpacingControls.tsx
    ExportControls.tsx
    CharacterEditor.tsx

  /data
    fonts.json

  /lib
    fontTypes.ts
    renderTextToGrid.ts
    gridUtils.ts
    exportUtils.ts
    localStorageUtils.ts

  /styles
    globals.css
```

## Data Models

### Font Object

```ts
export type StitchFont = {
  id: string;
  name: string;
  description: string;
  category: FontCategory;
  defaultHeight: number;
  recommendedUse: string;
  licence: string;
  characters: Record<string, StitchCharacter>;
  isCustom?: boolean;
  baseFontId?: string;
  createdAt?: string;
  updatedAt?: string;
};
```

### Character Object

```ts
export type StitchCharacter = {
  width: number;
  height: number;
  grid: string[];
};
```

Rules:

- `grid.length` must equal `height`.
- Every row length must equal `width`.
- Every row may only contain `0` and `1`.
- Character keys must be unique within a font.

### Generated Pattern Object

```ts
export type GeneratedPattern = {
  fontId: string;
  text: string;
  letterSpacing: number;
  wordSpacing: number;
  lineSpacing: number;
  alignment: "left" | "center" | "right";
  width: number;
  height: number;
  grid: string[];
  unsupportedCharacters: string[];
};
```

### Text Render Options

```ts
export type TextRenderOptions = {
  letterSpacing: number;
  wordSpacing: number;
  lineSpacing: number;
  alignment: "left" | "center" | "right";
  placeholderUnsupported: boolean;
};
```

## Default Font Data

Create `src/data/fonts.json` with at least three original fonts:

- Block style
- Tiny or compact style
- Decorative, sampler, gothic, or modern style

Minimum character support:

- Uppercase A-Z for every default font.
- Numbers 0-9 for at least one font.
- Basic punctuation where practical: `.`, `,`, `!`, `?`, `'`, `-`, `&`.
- Lowercase only where intentionally supported.

Every font must include:

- Font name.
- Description.
- Style category.
- Default character height.
- Supported character data.
- Recommended use.
- Licence or attribution notes.

## Font Validation

Create validation utilities in `src/lib/gridUtils.ts`.

Required functions:

- `validateCharacter(character: StitchCharacter): ValidationResult`
- `validateFont(font: StitchFont): ValidationResult`
- `resizeCharacter(character, width, height): StitchCharacter`
- `clearCharacter(character): StitchCharacter`
- `cloneFont(font): StitchFont`

Validation should detect:

- Missing IDs.
- Duplicate IDs when loading all fonts.
- Invalid widths or heights.
- Row count mismatch.
- Row width mismatch.
- Grid values other than `0` or `1`.

## Rendering Engine

Create `src/lib/renderTextToGrid.ts`.

The renderer must:

- Accept text, selected font, and render options.
- Split input into lines.
- Convert each supported character into grid data.
- Preserve spaces.
- Preserve line breaks.
- Insert letter spacing between letters.
- Insert word spacing for spaces.
- Insert line spacing between rendered lines.
- Render unsupported characters as visible placeholders.
- Return unsupported character warnings.
- Calculate final width and height.
- Apply left, center, and right alignment.

Unsupported character behavior:

- Render a placeholder box using the font default height.
- Add the character to `unsupportedCharacters`.
- Display a visible warning in the generator UI.

## Core Components

### FontCard

Displays a font in the library.

Required content:

- Font name.
- Category.
- Sample preview.
- Stitch height.
- Short description.
- View alphabet action.
- Use in generator action.
- Duplicate font action.

### CharacterGrid

Displays a single character grid.

Props:

- `grid`
- `width`
- `height`
- `editable`
- `showGrid`
- `cellSize` or `zoom`
- `onCellToggle`
- accessible label

Required behavior:

- Cells remain square.
- Filled cells are visually distinct.
- Empty cells show graph-paper grid lines when enabled.
- Editable cells toggle on click.

### TextPatternPreview

Displays generated text on a larger grid.

Props:

- `pattern`
- `showGrid`
- `showFilledCells`
- `zoom`

Required behavior:

- Large patterns can scroll.
- Preview updates when text or options change.
- Grid remains readable across zoom levels.

### SpacingControls

Controls:

- Letter spacing.
- Word spacing.
- Line spacing.
- Alignment: left, center, right.
- Grid visibility.
- Filled stitch visibility.
- Zoom.

### CharacterEditor

Allows individual character editing.

Functions:

- Toggle cell.
- Clear grid.
- Reset grid.
- Resize width.
- Resize height.
- Save character.

### ExportControls

Actions:

- Export PNG.
- Copy design size.
- Optional JSON export.

## Pages

### Home `/`

Purpose:

- Explain the tool quickly.
- Provide entry points into the main workflows.
- Show a stitch-grid preview.

Primary actions:

- Browse fonts.
- Generate lettering.
- Edit characters.
- View custom fonts.

### Font Library `/fonts`

Purpose:

- Browse available default and custom fonts.

Required behavior:

- Show all fonts.
- Filter by category.
- Optional search.
- Allow font selection.
- Show card previews.

### Font Detail `/fonts/[id]`

Purpose:

- Show full supported alphabet for one font.

Required behavior:

- Show metadata.
- Group characters by uppercase, lowercase, numbers, and punctuation.
- Display character label, width, height, and grid.
- Provide use-in-generator and duplicate actions.

### Text Generator `/generator`

Purpose:

- Let users type text and generate stitch lettering.

Required behavior:

- Select font.
- Type multiline text.
- Render live grid preview.
- Adjust spacing and alignment.
- Show width and height in stitches.
- Show unsupported character warning.
- Export PNG.

### Character Editor `/editor`

Purpose:

- Edit a selected character in a selected font.

Required behavior:

- Select font.
- Select character.
- Toggle grid cells.
- Clear.
- Reset.
- Resize.
- Save locally.

Default fonts should not be mutated directly. If a user edits a default font, the app should prompt or guide them to duplicate it first.

### My Custom Fonts `/custom-fonts`

Purpose:

- Manage locally saved custom fonts.

Required behavior:

- List custom fonts.
- Rename custom fonts.
- Edit custom fonts.
- Use custom fonts in generator.
- Delete custom fonts.
- Show helpful empty state.

## Local Storage

Create `src/lib/localStorageUtils.ts`.

Storage keys:

- `crossStitch.customFonts`
- `crossStitch.generatorSettings`
- `crossStitch.selectedFontId`

Functions:

- `loadCustomFonts()`
- `saveCustomFont(font)`
- `saveCustomFonts(fonts)`
- `deleteCustomFont(fontId)`
- `duplicateFont(font, name)`
- `loadGeneratorSettings()`
- `saveGeneratorSettings(settings)`

Requirements:

- Handle missing localStorage safely.
- Handle invalid JSON safely.
- Validate loaded custom fonts.
- Never crash the app due to corrupted saved data.

## Database Persistence

Database schema lives in:

```text
supabase/migrations/202604250001_initial_auth_owned_schema.sql
```

Database TypeScript types live in:

```text
src/lib/databaseTypes.ts
```

Database documentation lives in:

```text
docs/database.md
```

Persistence model:

- Supabase Auth owns identity.
- `profiles.id` maps one-to-one to `auth.users.id`.
- User-owned tables use `owner_id`.
- Public default fonts are readable reference data.
- Custom fonts, edited characters, generated patterns, generator settings and export records are private to the authenticated owner.
- Workspace and membership tables exist now so collaboration can be added later without a full schema rewrite.
- The client uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` when present.
- Created fonts are saved to Supabase for signed-in users. If the database is not configured or the user is signed out, new font writes should pause and ask the user to configure/sign in rather than silently saving browser-only data.
- Brand-new blank fonts are valid custom fonts and do not need a base font reference.

Security requirements:

- Enable and force row-level security on every app table.
- Client reads and writes for private data must require `owner_id = auth.uid()`.
- Child tables must use relationships that prevent cross-user attachment.
- Custom font characters must belong to a custom font owned by the same user.
- Generated patterns using a custom font must use a custom font owned by the same user.
- Generator settings selecting a custom font must use a custom font owned by the same user.
- Default font reference data may be public read-only.

## Export

Create `src/lib/exportUtils.ts`.

PNG export requirements:

- Export generated grid as PNG.
- Include grid lines.
- Include filled stitch cells.
- Match the visible preview style closely.
- Support multiline patterns.
- Use a consistent export cell size independent of zoom unless explicitly configured.
- Trigger browser download.

Optional JSON export:

- Export the `GeneratedPattern` object.
- Include render settings and font ID.

## Phased Build Plan

### Phase 1: Foundation

- Set up Next.js, TypeScript, Tailwind.
- Add routes and app shell.
- Create types.
- Create default font data.
- Add validation utilities.
- Build basic grid components.

### Phase 2: Text Generator

- Implement text-to-grid rendering.
- Add generator page.
- Add spacing controls.
- Add dimensions display.
- Add unsupported character warnings.

### Phase 3: Font Library

- Build font library.
- Add font cards.
- Add category filtering.
- Build font detail page.
- Render full supported alphabets.

### Phase 4: Character Editor

- Build editor page.
- Add editable grid.
- Add clear, reset, resize, and save.
- Prevent default font mutation.

### Phase 5: Custom Fonts

- Add localStorage utilities.
- Add duplicate font flow.
- Add rename and delete.
- Build custom fonts page.
- Ensure custom fonts appear across app.

### Phase 6: Export and Polish

- Add PNG export.
- Add copy stitch size.
- Add optional JSON export.
- Polish responsive layout.
- Verify accessibility.
- Test primary journeys.

## Testing Requirements

Unit tests should cover:

- Font validation.
- Character validation.
- Text rendering.
- Width and height calculations.
- Spacing behavior.
- Alignment behavior.
- Unsupported character behavior.
- localStorage fallback behavior.

Manual tests should cover:

- Browse a font.
- View alphabet.
- Generate text.
- Adjust spacing and alignment.
- Edit character.
- Duplicate font.
- Save custom font.
- Reload and confirm persistence.
- Export PNG.

## Implementation Risks

### Data Quality

Bad grid data will cause bad rendering. Add validation early.

### Preview and Export Drift

If preview and export use separate rendering logic, they may disagree. Share grid data and rendering constants where possible.

### localStorage Corruption

Users can have invalid saved data. Always parse defensively.

### Large Patterns

Long quotes can create very wide grids. Use scroll containers and avoid layout breakage.

## V1 Completion Criteria

The implementation is complete when every item in `docs/tasks.md` under V1 Definition of Done is satisfied.
