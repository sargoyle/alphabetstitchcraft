# Cross-Stitch Lettering Library Design Guidelines

## Design Direction

The interface should combine two qualities:

- A strong futuristic technology aura inspired by the provided HTML reference.
- A practical, readable craft-tool workspace where the stitch grid is always the hero.

The result should feel polished and distinctive without becoming decorative at the expense of usability.

## Brand Personality

The product should feel:

- Precise.
- Creative.
- Calm.
- Capable.
- Modern.
- Craft-aware.
- Easy to trust.

Avoid making the app feel like:

- A generic marketing site.
- A full professional design suite.
- A dark sci-fi dashboard that overwhelms the grid.
- A soft craft blog with low contrast.

## Visual Principles

### 1. Make the Grid the Hero

The grid is the main artifact users are creating. It should receive the clearest space, strongest hierarchy, and most careful contrast.

### 2. Keep Controls Practical

Controls should be obvious, compact, and near the thing they affect. Avoid explanatory clutter inside the app.

### 3. Use Futuristic Styling as Atmosphere

The aura reference can influence:

- App shell.
- Background treatment.
- Subtle glow.
- Accent colors.
- Section framing.
- Navigation styling.

It should not reduce grid readability.

### 4. Preserve Craft Legibility

Cross-stitch users need to count cells. Grid lines, filled stitches, dimensions, and spacing controls must remain clear.

## Color System

Use a balanced palette rather than a single-hue interface.

Recommended roles:

- App background: soft off-white, pale warm gray, or very dark neutral depending on final theme.
- Working surfaces: neutral, high contrast, low visual noise.
- Grid lines: light gray with enough visibility to count cells.
- Filled cells: dark charcoal, ink, or deep accent.
- Primary accent: electric teal, cyan, or blue-green.
- Secondary accent: warm coral, gold, or magenta used sparingly.
- Error/warning: accessible amber or red with text labels.

Avoid:

- Overusing purple or blue gradients.
- Low contrast grid lines.
- Beige-only craft palette.
- Decorative glow inside the stitch grid itself.

## Typography

Requirements:

- Use readable sans-serif typography for UI.
- Use stable font sizes, not viewport-scaled font sizes.
- Do not use negative letter spacing.
- Keep hero-scale type only for the home page.
- Use compact headings inside panels and cards.
- Ensure button and card text never overflows.

Suggested hierarchy:

- Page title: clear and short.
- Section title: practical labels.
- Control labels: plain language.
- Metadata: smaller but still readable.
- Stitch dimensions: prominent and scannable.

## Layout

### Global Shell

Include:

- Persistent navigation.
- Product name.
- Primary routes.
- Clear active page state.
- Responsive mobile navigation.

Main routes:

- Home.
- Font Library.
- Generator.
- Character Editor.
- My Custom Fonts.

### Page Layouts

Font Library:

- Filter controls at top.
- Font card grid below.
- Cards should be scan-friendly.

Font Detail:

- Metadata header.
- Primary actions.
- Character grid previews grouped by character type.

Generator:

- Text input and controls.
- Stitch dimension summary.
- Large pattern preview.
- Export controls near preview.

Editor:

- Font and character selectors.
- Editable grid.
- Editing controls.
- Save status.

Custom Fonts:

- List saved custom fonts.
- Actions for rename, edit, use, and delete.
- Empty state.

## Component Patterns

### Buttons

Use buttons for clear commands.

Button types:

- Primary: main action such as export, save, or use font.
- Secondary: navigation or lower-priority action.
- Destructive: delete custom font.
- Icon button: zoom, grid visibility, clear, reset, duplicate where an icon is clear.

Requirements:

- Visible focus state.
- Clear labels or accessible labels.
- No text overflow.
- Disabled state when action cannot be completed.

### Cards

Use cards for repeated items such as fonts and custom fonts.

Requirements:

- Border radius of 8px or less unless the final visual system consistently requires otherwise.
- No nested cards.
- Sample preview must be readable.
- Actions must be clearly separated from metadata.

### Forms

Inputs:

- Textarea for generator text.
- Select or combobox for font and character selection.
- Numeric inputs, sliders, or steppers for spacing.
- Segmented control for alignment.
- Toggle buttons or switches for grid and filled-cell visibility.

Requirements:

- Labels are always visible or accessible.
- Error and warning states include text.
- Numeric controls have min and max bounds.

### Grid Components

Character grids and pattern grids must:

- Use square cells.
- Keep filled cells visually distinct from empty cells.
- Show grid lines when enabled.
- Support zoom.
- Avoid layout shift when toggling filled cells or grid lines.
- Remain countable.

Editable grids must:

- Show selected character label.
- Allow click-to-toggle.
- Expose clear, reset, resize, and save actions.
- Provide accessible labels for cells.

## Responsive Behavior

### Desktop

- Use multi-column layouts where helpful.
- Keep controls close to the preview.
- Allow large preview areas.
- Use scroll containers for wide generated patterns.

### Tablet

- Stack controls and preview when space is limited.
- Keep primary actions visible.
- Preserve readable grid cell sizes.

### Mobile

- Use single-column layouts.
- Keep navigation compact.
- Make controls finger-friendly.
- Allow horizontal scrolling for wide grids.
- Do not shrink grid cells to the point that counting becomes impossible.

## Accessibility

Requirements:

- Semantic headings.
- Landmark regions.
- Keyboard navigation.
- Visible focus states.
- Accessible form labels.
- Button labels that describe the action.
- Strong color contrast.
- Warnings and errors not communicated by color alone.
- Pattern dimensions exposed as readable text.
- Editor selected character exposed as readable text.

For editable grid cells:

- Each cell should have an accessible label such as `Row 3, column 5, filled`.
- Toggled state should be represented programmatically where practical.
- Full keyboard drawing can be considered later, but v1 must not trap keyboard focus.

## Content Guidelines

Use plain language.

Preferred labels:

- Browse Fonts.
- Use in Generator.
- Duplicate Font.
- Letter Spacing.
- Word Spacing.
- Line Spacing.
- Export PNG.
- Copy Size.
- Clear Character.
- Reset Character.
- Save Character.

Avoid lengthy in-app descriptions of how features work. The interface should make the workflow clear through layout and labels.

## Branding Requirements

The product name is not final. Until confirmed, use a neutral placeholder such as `Stitch Lettering Library` in metadata and navigation.

Branding should not imply:

- Marketplace functionality.
- Full pattern design.
- Automatic font conversion.
- Cloud accounts.

## Visual QA Checklist

Before considering the UI done:

- Text does not overlap at desktop or mobile sizes.
- Buttons do not overflow.
- Cards are readable.
- Grid cells remain square.
- Generated patterns can be inspected when wide.
- Filled cells are visible with grid on and off.
- Warnings are readable.
- Focus states are visible.
- The aura-inspired styling is present but does not overpower the grid.

