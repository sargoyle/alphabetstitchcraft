# Cross-Stitch Lettering Library Masterplan

## Vision

The Cross-Stitch Lettering Library is a web-based tool that helps crafters and pattern designers create readable, reusable stitch-based lettering without needing a full cross-stitch design application.

The product exists because lettering is one of the most common and frustrating parts of custom cross-stitch design. Regular digital fonts do not translate cleanly into stitch grids, and designers often need to manually test whether a name, quote, caption, or label will fit inside a fixed stitch area.

Version 1 focuses on one clear job: make stitch lettering easy to browse, preview, generate, edit, save, and export.

## Core Purpose

The product should help users answer practical lettering questions quickly:

- What does this stitch alphabet look like?
- How wide and tall will my text be in stitches?
- Will my phrase fit in my design?
- Can I adjust the spacing and alignment?
- Can I tweak one awkward letter by hand?
- Can I save a custom version and reuse it?
- Can I export the final lettering as a PNG?

This is not a full pattern design suite in v1. The product should be deliberately focused on lettering.

## Target Users

### Primary Users

Cross-stitch hobbyists:

- Create personal patterns for gifts, samplers, bookmarks, ornaments, labels, and home decor.
- Need simple tools that are easier than full charting software.
- Care about stitch count, readability, and visual fit.

Pattern designers:

- Need reusable alphabets for captions, quotes, names, and labels.
- Need consistent output and predictable dimensions.
- May create custom font variants for different pattern styles.

Crafters personalising projects:

- Want to add names, initials, dates, quotes, and short phrases.
- Need confidence that the lettering will fit before stitching.
- May be beginners who understand graph paper better than font tooling.

### Secondary Users

Beginners:

- Learning how lettering behaves on a stitch grid.
- Need visual feedback and simple controls.
- Benefit from seeing every character in a chosen alphabet.

Gift makers:

- Creating personalised one-off pieces.
- Need quick output rather than complex editing.

## User Needs

Users need to:

- Browse stitch alphabets by style.
- See alphabet samples before choosing a font.
- Preview full character sets on visible grids.
- Type custom text and instantly see the stitched result.
- Preserve spaces and line breaks.
- Adjust letter spacing, word spacing, line spacing, and alignment.
- Know exact stitch width and height.
- Understand when unsupported characters are present.
- Edit a character directly on graph-paper cells.
- Duplicate an existing font and save a local custom version.
- Export the generated lettering pattern as an image.

## Primary Value Proposition

The Cross-Stitch Lettering Library turns stitch alphabet data into a practical lettering workflow.

Instead of manually drawing letters on graph paper or guessing from a normal font, users can choose a stitch alphabet, type their text, see exact stitch dimensions, make small edits, and export the result.

The product saves time, reduces mistakes, and makes lettering feel approachable.

## Product Principles

### 1. The Grid Is the Product

The stitch grid must be accurate, readable, and trustworthy. Visual styling should frame and support the grid, not compete with it.

### 2. Lettering First

Avoid building full cross-stitch pattern design features in v1. Every feature should support selecting, rendering, editing, saving, or exporting lettering.

### 3. Local and Lightweight

Use local JSON data for default fonts and browser `localStorage` for custom fonts. No backend, accounts, or cloud sync are required in v1.

### 4. Practical Over Decorative

The interface may draw strong inspiration from the attached futuristic technology aura design, but the tool must remain clean, readable, and efficient for craft work.

### 5. Editable but Safe

Users can edit shared font data through the app. Default/shared font data should remain valid, backed up where practical, and recoverable through repeatable migrations or database restore tools.

## V1 Scope

Version 1 includes:

- Home page with clear entry points.
- Font library with filtering.
- Font detail page with full supported character preview.
- Text generator with live stitch grid output.
- Spacing, alignment, zoom, grid visibility, and stitch visibility controls.
- Unsupported character handling.
- Character editor for individual letters.
- Custom font creation by duplicating existing fonts.
- Supabase-backed saving of shared editable fonts.
- Font Editor and shared font management flows.
- PNG export.
- Copy design size.
- Optional JSON export for generated pattern data.

## Out of Scope for V1

Version 1 does not include:

- User accounts.
- Private account-based cloud sync.
- Community sharing.
- Marketplace.
- Uploading chart images.
- Converting normal computer fonts to stitch fonts.
- Full color cross-stitch chart design.
- DMC floss palette management.
- Backstitch.
- Fractional stitches.
- PDF export.
- Pattern symbols.
- Printing instructions.
- Mobile app version.
- Multi-user collaboration.

## Success Metrics

### Product Completion Metrics

- Users can complete all four core journeys without developer help.
- Default font data validates successfully.
- Generated stitch dimensions are accurate.
- PNG export matches the visible preview.
- Shared editable fonts persist after page reload and across browsers.

### Usability Metrics

- A first-time user can generate text within one minute of opening the app.
- A user can determine width and height in stitches without searching.
- A user can edit and save a character without reading documentation.
- Unsupported characters are obvious and recoverable.

### Quality Metrics

- No blocking runtime errors in primary workflows.
- Core rendering utilities have test coverage.
- The app is usable at common mobile and desktop widths.
- Keyboard navigation reaches all primary controls.
- Color contrast remains strong in grid and control areas.

## Definition of Done

V1 is complete when a user can:

- Open the website.
- Browse available stitch fonts.
- Filter fonts by category.
- Select a font.
- View the full alphabet.
- Type custom text.
- See that text rendered on a cross-stitch grid.
- Adjust spacing and alignment.
- See total stitch dimensions.
- Edit at least one character.
- Save a duplicated or edited font to the shared database.
- Reuse that saved shared font.
- Export the generated lettering pattern as a PNG.

