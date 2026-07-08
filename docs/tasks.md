# Cross-Stitch Lettering Library Tasks

## Purpose

This document is the source of truth for implementation order. Build the v1 product as a clean Next.js, React, TypeScript, and Tailwind CSS website focused on stitch-based lettering only.

The first complete version is done when a user can browse stitch alphabets, select a font, preview its characters, generate text on a stitch grid, adjust spacing and alignment, edit a character, save a custom duplicated font locally, and export the generated lettering pattern as a PNG.

## Product Assumptions

- The attached `FuturisticTechnilogyAuraTemplate.html` is a strong visual influence, adapted into a practical craft tool interface.
- The stack is fixed for v1: Next.js, React, TypeScript, Tailwind CSS, local JSON font data, browser `localStorage`, and canvas or SVG-based PNG export.
- There is no backend, login, marketplace, cloud sync, PDF export, floss palette, full pattern editor, or uploaded chart conversion in v1.
- Default stitch alphabets must be original, public domain, or otherwise explicitly licensed for this project.
- The grid is the main visual object. UI polish supports the grid rather than distracting from it.

## Readiness Answers

### 1. Have we read and understood the project and its core feature?

Yes. The core product is a web-based lettering pattern tool for cross-stitch designers. Its central feature is translating stitch alphabet data into editable, previewable, exportable grid-based text patterns.

The key workflows are:

- Browse available stitch fonts.
- Preview supported characters on graph-paper style grids.
- Type custom text and render it as a stitch pattern.
- Adjust spacing, line layout, alignment, zoom, and grid visibility.
- Edit individual character grids.
- Duplicate a font, rename it, save edits locally, and reuse the custom font.
- Export the generated lettering pattern as PNG.

### 2. Do we understand the implementation plan from start to finish?

Yes. The build should move from data model and rendering primitives first, then pages and workflows, then editing and persistence, then export and polish.

The implementation order should protect the product's most important risk: accurate grid rendering. Font data validation, reusable grid components, text-to-grid rendering, and export fidelity should be built before deeper visual polish.

### 3. Objections or suggestions

No objections to the v1 scope. It is well-sized and correctly avoids expensive features such as backend accounts, PDF generation, DMC color management, and full pattern design.

Suggestions:

- Start with two or three original default fonts instead of one so the library, filtering, and category experience are meaningful from the beginning.
- Add a lightweight font-data validator early. Invalid character widths or row lengths will otherwise cause confusing rendering bugs later.
- Treat custom fonts as separate stored objects with a `baseFontId`, `createdAt`, and `updatedAt` so local edits remain traceable.
- Keep export rendering in one shared utility so the on-screen preview and PNG output do not drift apart.
- Include unsupported-character reporting in the renderer result, not only in the UI, so every page can use the same behavior.

## Clarifying Questions

These are not blockers for v1 implementation, but should be answered before final polish:

- What name should the product use in navigation, metadata, and hero copy?
- Should custom fonts be exportable/importable as JSON in v1, or only generated patterns?
- Should PNG export include a title, stitch dimensions, font name, and settings, or only the grid image?
- Should the first visual pass use the futuristic aura design strongly across the full app, or reserve it for the shell and keep tool panels more neutral?

## Phase 0: Project Setup

### 0.1 Initialize Application

- [x] Create a Next.js app using TypeScript.
- [x] Install and configure Tailwind CSS.
- [x] Add ESLint and formatting defaults compatible with the generated project.
- [x] Confirm the app runs locally.
- [x] Create the proposed `/src` structure:
  - [x] `/src/app`
  - [x] `/src/components`
  - [x] `/src/data`
  - [x] `/src/lib`
  - [x] `/src/styles` if needed by the selected setup.

Acceptance checks:

- [x] `npm run dev` starts the app.
- [x] Home page renders without runtime errors.
- [x] TypeScript compiles.

### 0.3 Environment Ignore Rules

- [x] In `.gitignore`, replace `.env*` with explicit environment file entries:
  - [x] `.env`
  - [x] `.env.local`
  - [x] `.env.*.local`

Acceptance checks:

- [x] `.gitignore` no longer ignores every `.env*` file pattern.
- [x] Local and environment-specific local files remain ignored.

### 0.2 Establish App Shell

- [x] Create global layout with persistent navigation.
- [x] Add routes:
  - [x] `/`
  - [x] `/fonts`
  - [x] `/fonts/[id]`
  - [x] `/generator`
  - [x] `/editor`
  - [x] `/custom-fonts`
- [x] Add metadata with placeholder product name.
- [x] Add visible focus styles and semantic landmarks.

Acceptance checks:

- [x] Users can navigate between all main pages.
- [x] Navigation works with keyboard tab order.
- [x] Current page state is visually clear.

## Phase 1: Data Model and Font Foundation

### 1.1 Define Types

- [x] Create `src/lib/fontTypes.ts`.
- [x] Define `StitchCharacter`.
- [x] Define `StitchFont`.
- [x] Define `GeneratedPattern`.
- [x] Define `TextRenderOptions`.
- [x] Define `RenderWarning` or unsupported-character result type.
- [x] Define `CustomFontMetadata` fields:
  - [x] `baseFontId`
  - [x] `isCustom`
  - [x] `createdAt`
  - [x] `updatedAt`

Acceptance checks:

- [x] All downstream data uses shared TypeScript types.
- [x] No component invents its own incompatible grid shape.

### 1.2 Create Default Font Data

- [x] Create `src/data/fonts.json`.
- [x] Add at least three original stitch fonts:
  - [x] Block font.
  - [x] Tiny or compact font.
  - [x] Decorative, sampler, gothic, or modern font.
- [x] Include uppercase A-Z for all initial fonts.
- [x] Include numbers 0-9 for at least one font.
- [x] Include basic punctuation where practical:
  - [x] `.`
  - [x] `,`
  - [x] `!`
  - [x] `?`
  - [x] `'`
  - [x] `-`
  - [x] `&`
- [x] Include lowercase only where intentionally supported.
- [x] Add licence and attribution notes for every font.

Acceptance checks:

- [x] Every font has a unique `id`.
- [x] Every character row length matches `width`.
- [x] Every character row count matches `height`.
- [x] Every grid cell is `0` or `1`.
- [x] At least one default font can render `ABC 123`.

### 1.3 Add Font Validation Utilities

- [x] Create `src/lib/gridUtils.ts`.
- [x] Add `validateCharacter`.
- [x] Add `validateFont`.
- [x] Add `normalizeGridSize` helpers if needed.
- [x] Add clear error messages for invalid data.

Acceptance checks:

- [x] Invalid row lengths are detected.
- [x] Invalid row counts are detected.
- [x] Invalid grid characters are detected.
- [x] Duplicate font IDs can be detected during load or development checks.

## Phase 2: Shared Grid Rendering

### 2.1 Build Character Grid Component

- [x] Create `src/components/CharacterGrid.tsx`.
- [x] Render a character grid as square stitch cells.
- [x] Support editable and read-only modes.
- [x] Support click-to-toggle when editable.
- [x] Support accessible labels for editable cells.
- [x] Support configurable cell size or zoom.
- [x] Support grid visibility toggle.

Acceptance checks:

- [x] Filled cells are visually distinct.
- [x] Empty cells remain visible when grid is enabled.
- [x] Cells stay square at different sizes.
- [x] Editable mode toggles the correct cell.

### 2.2 Build Font Grid Preview Component

- [x] Create `src/components/FontGridPreview.tsx`.
- [x] Render sample text using a selected font.
- [x] Show a compact preview suitable for cards.
- [x] Handle unsupported sample characters gracefully.

Acceptance checks:

- [x] Font cards can display `ABC abc 123` without breaking.
- [x] Unsupported characters do not crash the preview.

### 2.3 Build Text Pattern Preview Component

- [x] Create `src/components/TextPatternPreview.tsx`.
- [x] Render generated pattern grids.
- [x] Add zoom support.
- [x] Add grid visibility support.
- [x] Add filled-cell visibility support.
- [x] Ensure large patterns can scroll or fit gracefully.

Acceptance checks:

- [x] Grid remains readable at small and large zoom values.
- [x] Large text does not break page layout.
- [x] Preview updates when generator settings change.

## Phase 3: Text Rendering Engine

### 3.1 Implement Text-to-Grid Rendering

- [x] Create `src/lib/renderTextToGrid.ts`.
- [x] Accept:
  - [x] `text`
  - [x] selected font
  - [x] letter spacing
  - [x] word spacing
  - [x] line spacing
  - [x] alignment
- [x] Preserve spaces.
- [x] Preserve line breaks.
- [x] Skip unsupported characters and return warnings/counts.
- [x] Return unsupported character warnings.
- [x] Calculate final stitch width.
- [x] Calculate final stitch height.
- [x] Return generated grid rows.

Acceptance checks:

- [x] `HELLO` renders with the expected width and height.
- [x] Spaces add word spacing.
- [x] New lines add line spacing.
- [x] Left alignment works.
- [x] Center alignment works.
- [x] Right alignment works.
- [x] Unsupported characters are skipped and shown in warnings.

### 3.2 Add Renderer Tests

- [x] Add unit tests for `renderTextToGrid`.
- [x] Test single word rendering.
- [x] Test spaces.
- [x] Test multiline text.
- [x] Test alignment.
- [x] Test unsupported characters.
- [x] Test empty input.

Acceptance checks:

- [x] Renderer tests pass.
- [x] Tests cover width and height calculations.

## Phase 4: Font Library and Detail Pages

### 4.1 Font Library Page

- [x] Build `/fonts`.
- [x] Load default fonts.
- [x] Load custom fonts from localStorage.
- [x] Merge default and custom fonts.
- [x] Show font cards with:
  - [x] Font name.
  - [x] Category.
  - [x] Sample preview.
  - [x] Stitch height.
  - [x] Short description.
  - [x] Select or view details action.
- [x] Add category filter.
- [x] Add search if simple after filtering is complete.

Acceptance checks:

- [x] All default fonts are visible.
- [x] Custom fonts appear after being saved.
- [x] Category filtering works.
- [x] Search works if included.

### 4.2 Font Card Component

- [x] Create `src/components/FontCard.tsx`.
- [x] Use the shared preview component.
- [x] Include clear actions:
  - [x] View alphabet.
  - [x] Use in generator.
  - [x] Duplicate font.
- [x] Style cards consistently with the design system.

Acceptance checks:

- [x] Card content is readable on desktop and mobile.
- [x] Actions are keyboard accessible.

### 4.3 Font Detail Page

- [x] Build `/fonts/[id]`.
- [x] Show font metadata.
- [x] Show full supported character set.
- [x] Group characters by:
  - [x] Uppercase.
  - [x] Lowercase if supported.
  - [x] Numbers if supported.
  - [x] Punctuation if supported.
- [x] Show each character's label, width, height, and grid preview.
- [x] Add action to use font in generator.
- [x] Add action to duplicate font.

Acceptance checks:

- [x] Every supported character renders.
- [x] Character dimensions are visible.
- [x] Invalid or missing font IDs show a helpful not-found state.

## Phase 5: Text Generator

### 5.1 Generator Page

- [x] Build `/generator`.
- [x] Add selected font control.
- [x] Add text input preserving line breaks.
- [x] Render live preview.
- [x] Show stitch dimensions:
  - [x] Width.
  - [x] Height.
- [x] Show unsupported-character warnings.

Acceptance checks:

- [x] Typing updates the pattern immediately.
- [x] Changing fonts updates the pattern.
- [x] Empty text state is clear.
- [x] Unsupported characters are listed.

### 5.2 Spacing Controls

- [x] Create `src/components/SpacingControls.tsx`.
- [x] Add letter spacing input.
- [x] Add word spacing input.
- [x] Add line spacing input.
- [x] Add alignment segmented control:
  - [x] Left.
  - [x] Center.
  - [x] Right.
- [x] Add grid visibility toggle.
- [x] Add filled stitch visibility toggle.
- [x] Add zoom control.

Acceptance checks:

- [x] Controls update renderer options.
- [x] Numeric controls have sane min and max values.
- [x] Alignment is reflected visually.

### 5.3 Generator State Persistence

- [x] Persist selected font ID.
- [x] Persist text input.
- [x] Persist spacing and display settings.
- [x] Restore settings on page reload.

Acceptance checks:

- [x] Refreshing the page restores the latest generator state.
- [x] Broken persisted values fall back safely.

## Phase 6: Character Editor

### 6.1 Editor Page

- [x] Build `/editor`.
- [x] Add font selector.
- [x] Add character selector.
- [x] Show selected character label.
- [x] Show editable grid.
- [x] Add controls:
  - [x] Clear.
  - [x] Reset.
  - [x] Save.
  - [x] Width adjustment.
  - [x] Height adjustment.
- [x] Prevent saving invalid grids.

Acceptance checks:

- [x] User can toggle individual cells.
- [x] Clear turns all cells off.
- [x] Reset restores original character data.
- [x] Width can increase and decrease within limits.
- [x] Height can increase and decrease within limits.
- [x] Save updates local font data.

### 6.2 Character Editor Component

- [x] Create `src/components/CharacterEditor.tsx`.
- [x] Encapsulate editor interactions.
- [x] Keep original grid available for reset.
- [x] Expose save callback.
- [x] Validate edited character before save.
- [x] Add click-and-drag painting across editable grid cells.
- [x] Support drag-to-fill from an empty cell and drag-to-erase from a filled cell.
- [x] Space editor inputs and action buttons so focus states do not overlap.

Acceptance checks:

- [x] Editor can be reused from `/editor`.
- [x] Editor does not mutate default font data directly.
- [x] Dragging over editable cells updates each cell only once per drag pass.
- [x] Clear, Reset and Save character buttons wrap without overlapping the width/height inputs.

## Phase 7: Custom Fonts

### 7.1 Local Storage Utilities

- [x] Create `src/lib/localStorageUtils.ts`.
- [x] Add custom font load function.
- [x] Add custom font save function.
- [x] Add custom font delete function.
- [x] Add custom font duplicate function.
- [x] Add generator settings persistence helpers.
- [x] Handle corrupted localStorage data.

Acceptance checks:

- [x] App does not crash when localStorage is empty.
- [x] App does not crash when localStorage contains invalid JSON.
- [x] Custom fonts survive page refresh.

### 7.2 Duplicate Font Flow

- [x] Add duplicate action from font cards and detail page.
- [x] Prompt for custom font name.
- [x] Generate unique custom font ID.
- [x] Copy all character data from source font.
- [x] Store `baseFontId`.
- [x] Mark font as custom.
- [x] Redirect or navigate user to editor for the duplicated font.

Acceptance checks:

- [x] Duplicated font appears in library.
- [x] Duplicated font can be edited without changing original.
- [x] Duplicate names are handled clearly.

### 7.3 My Custom Fonts Page

- [x] Build `/custom-fonts`.
- [x] List locally saved custom fonts.
- [x] Show source/base font when available.
- [x] Add actions:
  - [x] Rename.
  - [x] Edit.
  - [x] Use in generator.
  - [x] Delete.
  - [x] Export JSON if included in v1.
- [x] Add empty state.

Acceptance checks:

- [x] Custom fonts are visible.
- [x] Rename persists.
- [x] Delete removes the custom font.
- [x] Empty state points users to duplicate a font.
- [x] Font JSON export downloads a valid stitch font object.

## Phase 8: Export

### 8.1 PNG Export Utility

- [x] Create `src/lib/exportUtils.ts`.
- [x] Render generated pattern to canvas or SVG.
- [x] Include filled cells.
- [x] Include grid lines.
- [x] Match visible preview dimensions and spacing.
- [x] Support transparent or solid background decision.
- [x] Trigger browser download.

Acceptance checks:

- [x] Exported PNG matches visible preview.
- [x] Exported PNG includes grid and filled stitches.
- [x] Export works for multiline text.
- [x] Export works after zoom changes.
- [x] Export does not depend on visible zoom unless intentionally designed.

### 8.2 Export Controls

- [x] Create `src/components/ExportControls.tsx`.
- [x] Add PNG export button.
- [x] Add copy design size button.
- [x] Add JSON export button if included in v1.
- [x] Show export errors clearly.

Acceptance checks:

- [x] User can export PNG from generator.
- [x] User can copy stitch dimensions.
- [x] JSON export produces a valid generated pattern object if included.

## Phase 9: Home Page and Visual System

### 9.1 Home Page

- [x] Build `/` as a useful product entry screen, not a generic marketing page.
- [x] Provide clear entry points:
  - [x] Browse fonts.
  - [x] Generate lettering.
  - [x] Edit characters.
  - [x] View custom fonts.
- [x] Include a live or static stitch grid preview.
- [x] Make the product purpose obvious in the first viewport.

Acceptance checks:

- [x] Users understand the tool is for cross-stitch lettering.
- [x] Primary action takes users to generator or font library.
- [x] Page remains usable on mobile.

### 9.2 Apply Design Direction

- [x] Translate the futuristic aura inspiration into the app shell.
- [x] Balance futuristic styling with craft-tool readability.
- [x] Use a soft neutral working surface for grids.
- [x] Use strong contrast for stitch cells.
- [x] Avoid visual clutter around editing surfaces.
- [x] Keep repeated cards to 8px border radius unless the app style requires a consistent exception.
- [x] Use icons in controls where useful.
- [x] Ensure design does not become one-note in a single hue family.

Acceptance checks:

- [x] The app has a clear visual identity.
- [x] Grid areas remain readable.
- [x] Controls look like practical tools, not decoration.

## Phase 10: Responsive Behavior and Accessibility

### 10.1 Responsive Layout

- [x] Verify pages at mobile, tablet, and desktop widths.
- [x] Ensure controls wrap cleanly.
- [x] Ensure grid previews can scroll horizontally when needed.
- [x] Avoid text overflow inside buttons, cards, and panels.
- [x] Keep fixed-format grid elements dimensionally stable.

Acceptance checks:

- [x] No incoherent overlap on common mobile widths.
- [x] Large patterns remain inspectable.
- [x] Navigation is usable on mobile.

### 10.2 Accessibility

- [x] Use semantic headings.
- [x] Use accessible form labels.
- [x] Use accessible button labels.
- [x] Add visible focus states.
- [x] Maintain strong color contrast.
- [x] Do not rely on color alone to show filled cells.
- [x] Add ARIA labels for editable grid cells.
- [x] Add helpful status text for selected character and pattern dimensions.

Acceptance checks:

- [x] Keyboard navigation reaches all major controls.
- [x] Screen reader labels exist for form controls.
- [x] Editor actions are understandable without pointer-only affordances.

## Phase 11: Quality, Testing, and Validation

### 11.1 Unit and Utility Tests

- [x] Test grid validation.
- [x] Test text rendering.
- [x] Test localStorage parsing fallbacks.
- [x] Test export utility where practical.

Acceptance checks:

- [x] Core utility tests pass.
- [x] Test failures clearly identify rendering or data errors.

### 11.2 Manual User Journey Testing

- [ ] Test Journey 1: Browse a font.
- [ ] Test Journey 2: Generate text.
- [ ] Test Journey 3: Edit a character.
- [ ] Test Journey 4: Create a custom font.
- [ ] Test export.
- [ ] Test reload persistence.

Acceptance checks:

- [ ] A user can complete every v1 journey without developer tools.
- [ ] Saved custom font data affects future previews.
- [ ] PNG export opens as a valid image.

### 11.3 Browser Verification

- [x] Run local dev server.
- [ ] Verify the app in a browser.
- [ ] Check desktop viewport.
- [ ] Check mobile viewport.
- [ ] Inspect for console errors.
- [ ] Capture screenshots if needed for review.

Acceptance checks:

- [ ] No blocking console errors.
- [ ] Main workflows work in the browser.
- [ ] Canvas or SVG export works in the browser.

## V1 Definition of Done

- [x] Website opens successfully.
- [x] Font library displays all default fonts.
- [x] Font library filters by category.
- [x] Font detail page previews the supported alphabet.
- [x] Generator renders custom text on a stitch grid.
- [x] Generator preserves spaces and line breaks.
- [x] Generator supports letter spacing, word spacing, line spacing, and alignment.
- [x] Generator shows stitch width and height.
- [x] Unsupported characters are visible and listed.
- [x] Character editor toggles cells.
- [x] Character editor can clear, reset, resize, and save a character.
- [x] User can duplicate a default font.
- [x] User can rename and save a custom font locally.
- [x] Custom fonts appear in library and generator.
- [x] User can export generated lettering as PNG.
- [x] Exported PNG matches the visible pattern.
- [x] App is usable on desktop and mobile.
- [x] Core utility tests pass.
- [x] No out-of-scope v1 features have been added.

## Post-V1 Backlog

- [ ] Admin login and permissions: control who can create, edit, rename and delete fonts while keeping browse, generator and other non-management features available to general users.
- [x] Public font system hardening: keep public create, edit, rename and delete access, but add security controls for validation, abuse prevention, recovery, monitoring and safe public deployment.
- [ ] Analytics decision: decide whether the app should use no analytics, privacy-preserving analytics or third-party analytics, and document any privacy, consent, CSP and external-script requirements before implementation.

- [ ] PDF export.
- [ ] SVG export.
- [ ] Print-friendly sheets.
- [ ] DMC floss color support.
- [ ] X-shaped stitch rendering.
- [ ] Pattern symbols.
- [ ] Backstitch.
- [ ] Fabric count and finished-size calculator.
- [ ] Fit text into width tool.
- [ ] Import and export custom font packs.
- [ ] User accounts.
- [ ] Cloud sync.
- [ ] Community sharing.
- [ ] Marketplace.

## Phase 16: Cross-Browser Font Persistence

### 16.1 Supabase Client Wiring

- [x] Install the Supabase JavaScript client.
- [x] Add public Supabase environment variable example.
- [x] Add local Supabase project URL and publishable key configuration.
- [x] Create a browser Supabase client helper.
- [x] Add a Manage Fonts sign-in panel using email magic links.
- [x] Pause new font database writes when Supabase is not configured or the user is signed out.
- [x] Stop using browser-stored custom fonts as the active source of truth.
- [x] Add plain-English Supabase setup guide for non-technical setup.
- [x] Make the auth/session check fail fast so the sign-in form does not stay stuck loading.
- [x] Restart the preview server after rebuilding the database sync flow.
- [x] Add an auth callback page for Supabase magic links.
- [x] Send magic-link redirects to `/auth/callback`.
- [x] Add in-site email/password account creation and sign-in.

Acceptance checks:

- [x] The app compiles with the Supabase client installed.
- [x] The production build loads `.env.local`.
- [x] Manage Fonts explains whether font storage is configured, signed in or synced.
- [x] Users can request an email sign-in link when Supabase env values are configured.
- [x] Magic links have a dedicated callback route that returns users to Manage Fonts.
- [x] Users can create an account or sign in from the Manage Fonts page without relying only on magic links.
- [x] New font creation is disabled until database writes are available.
- [x] Manage Fonts copy describes database-backed saving, not browser saving.

### 16.2 Remote Font Persistence

- [x] Create remote font load, save and delete utilities.
- [x] Store created fonts in `custom_fonts`.
- [x] Store character grids in `custom_font_characters`.
- [x] Link remote records to the authenticated user.
- [x] Load signed-in users' custom fonts from Supabase.
- [x] Delete signed-in users' custom fonts from Supabase.
- [x] Use UUID IDs for newly created fonts.
- [x] Attempt to migrate local UUID custom fonts after sign-in.

Acceptance checks:

- [x] Created fonts can be saved to the authenticated user's database records.
- [x] Remote character grids are reconstructed into app `StitchFont` objects.
- [x] Row ownership remains enforced by the existing RLS policies.

### 16.3 Schema Alignment

- [x] Allow brand-new blank custom fonts without requiring a base font.
- [x] Document cross-browser persistence behavior.
- [x] Apply the Supabase database schema and RLS setup in the hosted project.
- [x] Add migration for public read access to user-created fonts and characters.
- [x] Track remote font ownership in the app.
- [x] Keep edit/delete controls owner-only while public fonts remain browsable.

Acceptance checks:

- [x] The database schema matches the current Create New Font workflow.
- [x] Supabase SQL Editor reports successful execution.
- [x] Created fonts can be shown to all users once the public-read migration is applied.
- [x] Users cannot edit or delete another user's public font through the UI.

### 16.4 Public Shared Font Library

- [x] Remove login as a requirement for creating fonts.
- [x] Remove owner-only edit and delete restrictions from Manage Fonts.
- [x] Allow every visible font to be edited from the character editor.
- [x] Save database fonts without requiring a Supabase Auth session.
- [x] Add Supabase migration to allow public custom-font writes.
- [x] Update database documentation to describe the no-login shared-library model.

Acceptance checks:

- [x] Manage Fonts no longer shows the sign-in or create-account form.
- [x] Create New Font is available when Supabase is configured.
- [x] Fonts are saved to Supabase instead of browser-only storage.
- [x] All users can browse, create, edit, rename and delete shared custom fonts.

## Phase 12: Authenticated Database Foundation

### 12.1 Database Schema

- [x] Add Supabase/Postgres migration folder.
- [x] Create authenticated user profile table.
- [x] Create workspace and workspace membership tables for future collaboration.
- [x] Create public default font table.
- [x] Create user-owned custom font table.
- [x] Create user-owned custom font character table.
- [x] Create user-owned generated pattern table.
- [x] Create user-owned generator settings table.
- [x] Create user-owned pattern export table.
- [x] Add primary keys, foreign keys and composite owner relationships.
- [x] Add timestamps and update triggers.
- [x] Add grid validation function and constraints.

Acceptance checks:

- [x] Private tables have an authenticated user owner.
- [x] Child records cannot be attached to another user's parent record.
- [x] Schema supports future workspace-based collaboration without enabling cross-user access in v1.

### 12.2 Row-Level Security

- [x] Enable RLS on all app tables.
- [x] Force RLS on all app tables.
- [x] Add owner-only profile policies.
- [x] Add owner-only workspace policies.
- [x] Add public read-only default font policy.
- [x] Add owner-only custom font policies.
- [x] Add owner-only custom font character policies.
- [x] Add owner-only generated pattern policies.
- [x] Add owner-only generator settings policies.
- [x] Add owner-only export policies.

Acceptance checks:

- [x] Users can only select their own private records.
- [x] Users can only insert private records with their own authenticated user id.
- [x] Users can only update and delete their own private records.
- [x] Custom-font references are restricted to the current user's own custom fonts.

### 12.3 Database Documentation and Types

- [x] Add database documentation.
- [x] Add TypeScript database type contract.
- [x] Document ownership model and future collaboration path.

Acceptance checks:

- [x] A developer can identify every table and relationship.
- [x] A developer can see which data is public and which is private.
- [x] A developer can apply the migration to a Supabase project.

## Phase 13: Uploaded Alphabet Samples

### 13.1 Times Roman and Alphabet Pic Samples

- [x] Inspect uploaded Times Roman Alphabet DOCX.
- [x] Extract DOCX alphabet reference artwork.
- [x] Copy uploaded Alphabet Pic image into app assets.
- [x] Add Times Roman DOCX Sample font entry.
- [x] Add Alphabet Pic Serif Sample font entry.
- [x] Include uppercase, lowercase, numbers and punctuation where supported by generated sample data.
- [x] Add source-image preview support to font cards.
- [x] Add source-image preview support to font detail pages.
- [x] Validate updated font data.

Acceptance checks:

- [x] Font data validates with five total fonts.
- [x] New sample fonts appear in the font library.
- [x] New sample fonts can be selected in the generator.
- [x] Source reference images are visible for sample fonts.

## Phase 14: Editable Font Library Management

### 14.1 Remove Protected Default Font Behavior

- [x] Remove source image display from uploaded sample fonts.
- [x] Remove copied uploaded image assets from the app bundle.
- [x] Treat every visible font as editable in the character editor.
- [x] Save edits to any font through browser storage using the same font ID.
- [x] Remove the protected default-font copy prompt.
- [x] Add delete actions for every font in the library.
- [x] Add delete action for the selected font in the editor.
- [x] Add delete action for every font in the management page.
- [x] Add restore controls for deleted built-in/sample fonts.
- [x] Rename Custom Fonts navigation to Manage Fonts.

Acceptance checks:

- [x] No font card displays uploaded source artwork.
- [x] The Times Roman and Alphabet Pic fonts remain available as generated stitch fonts.
- [x] Any active font can be opened in the editor and saved directly.
- [x] Any active font can be deleted from the browser.
- [x] Deleted built-in/sample fonts can be restored.

## Phase 15: Font Surface Simplification

### 15.1 Library, Detail and Management Page Roles

- [x] Remove duplicate buttons from Font Library cards.
- [x] Remove delete buttons from Font Library cards.
- [x] Keep only View Alphabet and Use actions on Font Library cards.
- [x] Remove duplicate action from Font Detail page.
- [x] Remove edit action from Font Detail page.
- [x] Remove delete action from Font Detail page.
- [x] Keep only Use in Generator action on Font Detail page.
- [x] Add font previews to Manage Fonts cards.
- [x] Remove Use action from Manage Fonts cards.
- [x] Add Create New Font action to Manage Fonts page.
- [x] Create new fonts with blank uppercase, lowercase, number and punctuation characters.

Acceptance checks:

- [x] Font Library is browse/use only.
- [x] Font Detail is alphabet view/use only.
- [x] Manage Fonts is the only page with create, edit, rename and delete actions.
- [x] Newly created fonts can be opened in the editor.

### 15.2 Font Detail Header Polish

- [x] Keep the Font Detail primary action compact at desktop width.
- [x] Prevent the Use in Generator button from wrapping awkwardly.
- [x] Show only the Height metadata tag on Font Detail pages.
- [x] Remove Recommended and Licence metadata tags from Font Detail pages.
- [x] Remove nested metadata boxes around the height value.
- [x] Show font height as compact inline text in the Font Detail heading.

Acceptance checks:

- [x] Font Detail header action is visually balanced on wide screens.
- [x] Font Detail metadata shows only height.
- [x] Font Detail height display uses minimal screen real estate.

### 15.3 Font Library Height Filter

- [x] Add a height filter to the Font Library toolbar.
- [x] Populate height options from available font `defaultHeight` values.
- [x] Combine height filtering with category and search filters.

Acceptance checks:

- [x] Users can filter fonts by stitch height.
- [x] Height filter includes built-in and user-created font heights.

### 15.4 Font Detail Preview Sizing

- [x] Scale Font Detail character previews based on each character's width and height.
- [x] Keep large character grids inside their cards without overlapping nearby previews.
- [x] Center character grids inside the preview cards.
- [x] Size alphabet card columns so previews are not clipped on the right edge.

Acceptance checks:

- [x] A 14 x 14 character preview fits within its card.
- [x] Standard 8 x 10 character previews remain readable.
- [x] The full character grid remains visible when mixed-width fonts are added.

## Phase 17: Character Duplication and New Letter Mapping

### 17.1 Duplicate Letter Into New Character

- [x] Add a character duplication action in the editor.
- [x] Allow the user to choose an existing letter as the source character.
- [x] Copy the source character grid into a new editable character.
- [x] Require the duplicated character to be assigned to a new unmapped character option before saving.
- [x] Provide a blank/new-character option when the user does not want to start from an existing mapped character.
- [x] Prevent saving when no destination character has been selected.
- [x] Prevent overwriting an already mapped character unless the user explicitly chooses to replace it.
- [x] Save the new character into the selected font so it appears in alphabet previews, the generator and future editor sessions.

Acceptance checks:

- [x] User can duplicate an existing letter, edit the copy and save it as a different character.
- [x] User can start from a blank character and map it to a new character.
- [x] Save is disabled or blocked until a destination character is selected.
- [x] Existing mapped characters are protected from accidental overwrite.
- [x] Newly mapped characters render correctly in Font Detail, Generator and Editor.

## Phase 18: App Surface Simplification

### 18.1 Remove In-App Docs And Expand Main Layout

- [x] Remove the in-app `/docs` route pages.
- [x] Remove Docs from the primary app navigation.
- [x] Remove app-only documentation data helpers.
- [x] Remove documentation-only CSS selectors from the app stylesheet.
- [x] Expand the main app shell and header to use the full available screen width.
- [x] Keep the persistent markdown documentation in `/docs` intact.

Acceptance checks:

- [x] Primary navigation no longer shows Docs.
- [x] `/docs` is no longer an active app documentation section.
- [x] Main app content is no longer constrained to a centered fixed-width column.

### 18.2 Add Font Creation And Editing To Font Library

- [x] Add Create New Font to the Fonts page.
- [x] Reuse the existing blank-font creation model from Manage Fonts.
- [x] Add Edit actions to Font Library cards.
- [x] Route Edit actions to the character editor with the selected font.
- [x] Keep View Alphabet and Use actions available on Font Library cards.

Acceptance checks:

- [x] Users can create a blank font from `/fonts`.
- [x] Users can edit a font directly from `/fonts`.
- [x] Font creation remains disabled with the same database sync rules when persistence is unavailable.

### 18.3 Compact Font Library Header And Primary Navigation

- [x] Make the Fonts page heading area more compact.
- [x] Keep the Create New Font button text on one row.
- [x] Remove Editor from the primary app navigation.
- [x] Remove Manage Fonts from the primary app navigation.
- [x] Keep those routes available through direct links and contextual actions where already used.

Acceptance checks:

- [x] Fonts page header uses less vertical space.
- [x] Create New Font button does not wrap on desktop.
- [x] Top navigation shows only Home, Fonts and Generator.

## Phase 19: Public Security Hardening

### 19.1 Public-Safe Security Baseline

- [x] Configure CSP and security headers immediately.
- [x] Harden the public font editing model while keeping public create, edit, rename and delete access using validation, edit history or backups, restore tools and simple abuse monitoring.
- [x] Enforce globally unique custom font names in the shared database.
- [x] Add safeguards for invalid remote font records so they surface as errors needing attention.
- [x] Review public deployment risks for vandalism, accidental deletion, abuse, recovery and monitoring against the confirmed hardening controls.

Acceptance checks:

- [x] The deployed app has documented CSP and security headers.
- [x] Public font editing remains available.
- [x] Public font data has validation, edit history or backups, restore tools and simple abuse monitoring.
- [x] Duplicate custom font names are rejected or prevented.
- [x] Invalid remote font records are visible as errors needing attention.
## Phase 16: Project Documentation Governance

### 16.1 Rules And Decisions Log

- [x] Create `docs/rules.md`.
- [x] Define the rules file as the single source of truth for project-wide decisions.
- [x] Document the categories used to track architecture, naming, design patterns, business logic and integrations.

Acceptance checks:

- [x] Rules file exists in `/docs`.
- [x] Rules file explains how and when to update project decisions.

### 16.2 Changelog

- [x] Create `docs/changelog.md`.
- [x] Add the Unreleased changelog structure.
- [x] Document changelog entry categories and rules.

Acceptance checks:

- [x] Changelog file exists in `/docs`.
- [x] Changelog explains how future completed tasks should be recorded.

### 16.3 In-App Documentation Center

- [x] Create a routable `/docs` documentation home page.
- [x] Create `/docs/architecture`.
- [x] Create `/docs/components`.
- [x] Create `/docs/data-flow`.
- [x] Create `/docs/api`.
- [x] Create `/docs/dependencies`.
- [x] Add shared sidebar navigation for documentation pages.
- [x] Add documentation data based on the current app structure, components, data flow, APIs and dependencies.
- [x] Add Documentation to the primary app navigation.

Acceptance checks:

- [x] Documentation Center is reachable from `/docs`.
- [x] All requested docs routes exist as app pages.
- [x] Docs pages use the existing visual system and readable tables/code blocks.
- [x] Current database and public font persistence decisions are documented.

### 16.4 Documentation Health Check

- [x] Check project docs for obvious formatting or source-of-truth issues.
- [x] Reorganise `docs/rules.md` so category headings and decisions are not mixed together.
- [x] Update the initial changelog entry to follow the date, description and files-affected rule.

Acceptance checks:

- [x] Rules are grouped by category.
- [x] Changelog entries include a date, description and files affected.

## Phase 20: In-App Design System Foundation

### 20.1 Create Live Design System Route

- [x] Create `/design-system` as a standalone development reference route.
- [x] Add reusable design tokens in `src/design-system/tokens.ts`.
- [x] Add supporting design-system guidance markdown files.
- [x] Add reusable base UI components under `src/components/ui`.
- [x] Add presentational layout components under `src/components/layout`.
- [x] Add live examples for buttons, panels, badges, modal, empty state, toast, cards, seats, hand, tableau, deck slots, scores and log.
- [x] Add matching function documentation for the new design-system feature.

Acceptance checks:

- [x] `/design-system` renders live reusable component examples.
- [x] Existing gameplay/app logic and data flows are not changed.
- [x] Design-system components are presentational and reusable.
- [x] The new feature has a matching `/docs/functions` page.

### 20.2 Design System Go-Live And Naming Follow-Up

- [x] Rename the original design-system display components to app-neutral layout component names.
- [x] Update `/design-system` examples and related function documentation after the component rename.
- [ ] Before public go-live, hide or protect `/design-system` so it is not exposed as a public-facing page.

Acceptance checks:

- [x] Reusable design-system component names are app-neutral.
- [ ] `/design-system` remains reachable by direct URL during development.
- [ ] `/design-system` is hidden or protected before public go-live.

## Phase 21: Test Planning And Automated Test Visibility

### 21.1 Establish Test Planning Documentation

- [x] Create `/docs/tests`.
- [x] Create `/docs/tests/test-index.md`.
- [x] Create `/docs/tests/test-maintenance-rules.md`.
- [x] Create `/docs/tests/test-run-results.md`.
- [x] Map function requirement documents to current automated coverage and pending coverage.

Acceptance checks:

- [x] Test planning docs exist under `/docs/tests`.
- [x] Test index identifies automated, pending and manual test areas.
- [x] Test maintenance rules explain how tests stay aligned with function docs.
- [x] Test run results record the latest validation commands and outcome.

### 21.2 Add First Utility Test Expansion

- [x] Add automated tests for grid utility validation, clear, resize, set and toggle behaviour.
- [x] Add automated tests for default font data validity, unique font IDs, single-character keys and blank font creation.
- [x] Update the utility test runner to include the new test files.
- [x] Run the automated utility test suite and record results.

Acceptance checks:

- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.
- [x] No production behaviour is changed.

### 21.3 Add Renderer And Grid Gap Visibility Tests

- [x] Add renderer visibility tests for whitespace-only text.
- [x] Add renderer visibility tests for unsupported characters and repeated unsupported characters.
- [x] Add renderer visibility tests for invalid and very large spacing values.
- [x] Add renderer visibility tests for very long text input.
- [x] Add grid consistency tests for generated row widths, line spacing rows and alignment content preservation.
- [x] Add utility-level export grid visibility consistency test.
- [x] Update related test-plan documents, test index and run results.

Acceptance checks:

- [x] Confirmed known gaps are documented as evidence without production fixes.
- [x] Passing utility behaviours are asserted with automated tests.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 21.4 Fix Confirmed Renderer Gaps

- [x] Treat whitespace-only text as empty input in the renderer.
- [x] Report unsupported characters with counts.
- [x] Reject negative spacing values at renderer level.
- [x] Reject very large out-of-range spacing values at renderer level.
- [x] Add large-pattern warnings for very long generated output without enforcing a fixed text or grid limit.
- [x] Update Generator warning display for counted unsupported characters and renderer warnings.
- [x] Update renderer tests from evidence-only checks to strict regression assertions.
- [x] Update related function docs, test plans, known-gaps backlog, test run results and changelog.

Acceptance checks:

- [x] Whitespace-only text returns width `0`, height `0` and an empty grid.
- [x] Repeated unsupported characters return counted entries.
- [x] Invalid renderer spacing values are rejected.
- [x] Very long generated output returns a warning.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 21.5 Verify And Fix Generator Preview Export Parity

- [x] Add PNG export parity tests for grid visibility, filled-cell visibility, safe empty canvas and provided grid drawing.
- [x] Add JSON export parity tests for generated pattern object preservation and empty pattern data.
- [x] Pass Generator preview grid and filled-stitch visibility settings into PNG export.
- [x] Confirm Generator preview and export controls receive the same `GeneratedPattern` object.
- [x] Create export PNG and JSON test-plan documents.
- [x] Update related function docs, test index, run results, known-gaps backlog and changelog.

Acceptance checks:

- [x] PNG export uses the provided generated pattern grid.
- [x] PNG export honours grid visibility at utility level.
- [x] PNG export honours filled-stitch visibility at utility level.
- [x] JSON export preserves generated pattern grid, dimensions and warnings.
- [x] Empty pattern export utilities handle data safely.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.





## Phase 22: Supabase Keep-Alive Endpoint

### 22.1 Public Keep-Alive Route

- [x] Create `/api/keep-alive`.
- [x] Use existing Supabase public URL and anon-key configuration.
- [x] Perform a lightweight read-only count query against `custom_fonts`.
- [x] Return `{ "status": "ok" }` when the Supabase query succeeds.
- [x] Return a JSON error response when Supabase is unconfigured or the query fails.
- [x] Avoid exposing Supabase keys, tokens or environment values in the response.
- [x] Update matching function documentation.

Acceptance checks:

- [x] Endpoint exists at `/api/keep-alive`.
- [x] Endpoint does not create, update or delete data.
- [x] Endpoint fetches only a count.
- [x] App TypeScript compile passes.

## Phase 23: Homepage Messaging And Navigation Language

### 23.1 User-Goal Homepage Copy

- [x] Replace the homepage hero headline with outcome-focused cross-stitch lettering copy.
- [x] Replace the homepage supporting text with alphabet browsing, instant preview and aligned lettering messaging.
- [x] Rename homepage CTAs to Create Lettering and Browse Alphabets.
- [x] Update the hero preview to show centred multi-row lettering: CREATE / YOUR OWN / PATTERNS.
- [x] Set the hero preview font to Block Needle 5x7 with two blank stitch rows between text lines.
- [x] Replace homepage workflow links with Browse Alphabets, Create Lettering and Edit Fonts action cards.
- [x] Rename primary navigation labels to Home, Alphabet Library, Create Pattern and Font Editor while preserving existing routes.
- [x] Update navigation/routing documentation and project rules.

Acceptance checks:

- [x] Homepage focuses on creating cross-stitch lettering patterns from text.
- [x] Homepage avoids implementation-focused labels like Fonts, Generator, Render custom text and Manage editable fonts.
- [x] Action cards link to the relevant existing pages.
- [x] Centred Lettering Preview uses Block Needle 5x7 and two blank rows between preview text lines.
- [x] TypeScript compile passes.

### 23.2 Homepage Layout, CTAs And Footer

- [x] Remove the secondary Browse Alphabets hero CTA.
- [x] Replace the repeated bottom action cards with a How it works workflow section.
- [x] Keep workflow card links only where they support the described step.
- [x] Tighten hero and workflow section alignment within the same page margins.
- [x] Add a subtle footer with `© Sara Gillard 2026`.
- [x] Remove the remaining Create Lettering hero button and reduce homepage vertical whitespace.
- [x] Minimise the vertical space between the How it works section and the footer copyright.
- [x] Update the homepage heading to say `Create beautiful cross-stitch lettering patterns in minutes.`

Acceptance checks:

- [x] Hero has one primary CTA only: Create Lettering.
- [x] Top navigation remains Home, Alphabet Library, Create Pattern and Font Editor.
- [x] How it works section explains Choose an alphabet, Add your text and Export your pattern.
- [x] Footer displays `© Sara Gillard 2026`.
- [x] Desktop and mobile layouts remain responsive.
- [x] Homepage is more compact and aims to fit one desktop viewport without scrolling.
- [x] Footer sits close to the How it works section without a large empty gap.
- [x] Homepage heading includes `lettering patterns`.

## Phase 24: Default Font Database Seed Recovery

### 24.1 Restore Default Font Reference Data

- [x] Investigate Supabase migrations and source data for `default_fonts`.
- [x] Confirm `default_fonts` was created by schema migration but had no seed migration.
- [x] Add an idempotent seed migration for bundled default fonts from `src/data/fonts.json`.
- [x] Keep the `custom_fonts.base_default_font_id` foreign key intact.
- [x] Add a clear save-path error when a referenced base default font is missing.
- [x] Update database and font data model documentation.

Acceptance checks:

- [x] Seed migration restores `default_fonts` records for bundled fonts.
- [x] Duplicated bundled fonts can reference a valid `base_default_font_id` after seed migration is applied.
- [x] Missing seeded default fonts produce a clear app error before custom font upsert.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Existing utility test runner passes.

### 24.2 Correct Default And Custom Font Save Flow

- [x] Investigate the full font save flow for default/shared and custom/shared fonts.
- [x] Stop converting default font edits into new UUID custom font create operations.
- [x] Route non-UUID bundled default font saves to `default_fonts` updates.
- [x] Keep UUID custom font saves on the existing `custom_fonts` path.
- [x] Update duplicate-name validation to ignore the current record and reject only different shared records.
- [x] Add a Supabase policy migration allowing updates to existing public default font rows.
- [x] Add save-flow utility tests for create/edit/rename duplicate scenarios.
- [x] Update database, function, rules, task and changelog documentation.

Acceptance checks:

- [x] Editing `Block Needle 5x7` updates `default_fonts` rather than creating a `custom_fonts` duplicate.
- [x] Renaming a default font is allowed when the name is unique.
- [x] Renaming a default or custom font to another shared font's name is blocked.
- [x] Creating and editing UUID custom fonts retains the existing `custom_fonts` behaviour.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 24.3 Fix Slug Versus UUID Font Operations

- [x] Identify duplicate-name validation as a source of slug values being passed to the UUID `custom_fonts.id` field.
- [x] Add explicit font ID classification for slug versus UUID IDs.
- [x] Prevent slug IDs such as `tiny-serif-7x9` from being used in UUID query filters.
- [x] Add save/delete target helpers for default/shared and custom/shared fonts.
- [x] Block default/shared slug deletes with a clear user-facing message instead of using the custom-font delete path.
- [x] Add clear console logging for save and delete target decisions, including whether the ID is a UUID or slug.
- [x] Add tests for default/shared edit targeting, custom delete targeting, default/shared delete blocking, and custom fonts copied from default slugs.
- [x] Update database, function, rules, task, changelog and test-run documentation.

Acceptance checks:

- [x] Saving `tiny-serif-7x9` no longer passes that slug into `custom_fonts.id`.
- [x] UUID custom/shared font deletes target `custom_fonts`.
- [x] Default/shared slug deletes are blocked before any UUID delete query.
- [x] Duplicate-name validation still ignores the current record when editing.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 24.4 Add Save Confirmation And Clean Duplicate Block Needle Data

- [x] Add a user-facing inline success message after a font save completes successfully.
- [x] Use the exact message `Font changes saved successfully.`.
- [x] Return save success or failure from the shared font save hook so the editor only confirms successful database saves.
- [x] Keep existing database save failure messages and add local editor failure status.
- [x] Add a repeatable Supabase cleanup migration for duplicate `Block Needle 5x7` shared font records.
- [x] Keep the seeded `block-needle-5x7` default font row as the canonical record.
- [x] Repoint duplicate default-font references in `custom_fonts.base_default_font_id` to the canonical row before cleanup.
- [x] Back up accidental custom duplicates before deleting them.
- [x] Remove duplicate default/shared rows safely without weakening duplicate-name validation.
- [x] Add automated migration-script coverage for the cleanup migration.
- [x] Update database, function, task, changelog and test-run documentation.

Acceptance checks:

- [x] Successful editor saves show `Font changes saved successfully.`.
- [x] Failed saves do not show the success message.
- [x] The cleanup migration keeps the canonical `block-needle-5x7` default font row.
- [x] The cleanup migration repoints related custom-font base references before deleting duplicate default rows.
- [x] The cleanup migration backs up accidental custom duplicates before deletion.
- [x] The cleanup migration removes accidental custom duplicates based on `block-needle-5x7`.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 24.5 Clean Block Needle Name Variant Duplicates

- [x] Identify `Block Needle 5 x 7` as a possible duplicate-name variant not covered by the compact `Block Needle 5x7` cleanup.
- [x] Add a follow-up cleanup migration that normalises spaces around the `x` in `5x7`.
- [x] Make the variant cleanup self-contained by creating `custom_font_backups` if the backup migration has not already been run.
- [x] Keep `block-needle-5x7` as the canonical default font row.
- [x] Repoint duplicate default-font references in `custom_fonts.base_default_font_id` to the canonical row.
- [x] Back up accidental custom duplicates before deleting them.
- [x] Improve duplicate-name logging and errors so they identify whether the conflict is in `default_fonts` or `custom_fonts`.
- [x] Update migration-script coverage and project documentation.

Acceptance checks:

- [x] The variant cleanup catches both `Block Needle 5x7` and `Block Needle 5 x 7`.
- [x] The variant cleanup can run even when `custom_font_backups` does not already exist.
- [x] Accidental custom duplicates are backed up before deletion.
- [x] Duplicate-name errors now include the conflicting table name.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

## Phase 25: Font Editor UI Refinement

### 25.1 Compact Edit Screen Layout

- [x] Replace the Font Editor character dropdown with compact sidebar character tiles.
- [x] Keep the selected character visibly highlighted.
- [x] Move the New Character workflow into a condensed modal dialog.
- [x] Support blank-character creation and duplicate-character creation from the modal.
- [x] Keep font deletion in a visually separated Danger Zone.
- [x] Move width and height controls beside the editable grid on desktop.
- [x] Separate Reset, Clear and Save Character into a clean editor footer row.
- [x] Preserve existing save, reset, clear, resize, delete and duplicate-character behaviour.
- [x] Update Character Editor function documentation.
- [x] Add source-level automated coverage for the editor UI structure.

Acceptance checks:

- [x] Font Editor visually follows the uploaded compact sidebar and editor-panel mockup.
- [x] New Character opens as a pop-up/modal rather than a large always-visible sidebar form.
- [x] Save is unavailable for a new character until a destination character is selected.
- [x] Editor action buttons do not overlap width and height inputs.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.2 Ordered Character Picker And Duplicate Selection

- [x] Order the Font Editor character picker as A-Z, then a-z, then 0-9, then other mapped characters.
- [x] Show not-created standard characters in the picker instead of hiding them.
- [x] Add visual states for exists, not-created and selected characters.
- [x] Add a picker legend explaining the character tile states.
- [x] Rename the New Character action to Select Duplicate.
- [x] Replace the duplicate-source dropdown with a tile-based duplicate selector.
- [x] Copy the selected duplicate source into the currently selected character draft.
- [x] Move Width, Height and helper text below the editable character grid.
- [x] Update Character Editor function documentation.
- [x] Update automated source-level editor UI coverage.

Acceptance checks:

- [x] Characters appear in the requested order: A-Z, a-z, 0-9, then other characters.
- [x] Missing characters are visible and styled differently from existing characters.
- [x] Selected character has a distinct border state.
- [x] Select Duplicate uses tiles rather than a dropdown list.
- [x] Width and Height controls appear below the character grid.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.3 Character Tile State And Font Refresh Stability

- [x] Change Selected character styling to the filled tile treatment.
- [x] Change Exists styling to a solid outline without the filled selected treatment.
- [x] Change Not Created styling to a different-colour dashed outline.
- [x] Keep the legend aligned with the actual tile state styling.
- [x] Prevent the editor from falling back to another font while a requested font is still loading.
- [x] Prevent font refresh from clearing saved fonts before remote data resolves.
- [x] Keep the just-saved font in local state while the database refresh completes.
- [x] Update function documentation for tile states and font refresh behaviour.
- [x] Add source-level tests for editor fallback and font refresh behaviour.

Acceptance checks:

- [x] Selected is the filled visual state.
- [x] Existing unselected characters use a solid outline.
- [x] Not-created characters use a different-colour dashed outline.
- [x] The editor shows a loading state rather than flashing to the first available font when a routed font is unresolved.
- [x] Saving does not briefly revert the editor to an older font version while refresh completes.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.4 Blank Starter Grid Not-Created State

- [x] Treat a character as existing only when its grid contains at least one filled stitch.
- [x] Show blank starter characters in brand-new fonts as Not Created.
- [x] Keep selected blank characters editable without marking all starter grids as existing.
- [x] Update Character Editor function documentation.
- [x] Add source-level coverage for blank starter grids.

Acceptance checks:

- [x] A brand-new blank font shows unfilled starter characters as Not Created.
- [x] Existing unselected characters still use the Exists solid outline only after they contain filled stitches.
- [x] Selected characters still use the filled selected treatment.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.5 Font-Level Height And Editable Font Name

- [x] Move character height control to the font level.
- [x] Keep font height selectable from the Font Editor screen.
- [x] Resize all characters in a font when the font height changes.
- [x] Ensure saved character edits always match the selected font height.
- [x] Add editable font name controls to the Font Editor screen.
- [x] Update font data validation so each character height must match the font height.
- [x] Normalise bundled font data so every character matches its font height.
- [x] Update Character Editor function documentation.
- [x] Update Font Data Model function documentation.
- [x] Add automated coverage for font-level height validation and editor source structure.

Acceptance checks:

- [x] Font Editor exposes Font name and Font height controls.
- [x] Character editor no longer exposes per-character height editing.
- [x] Changing font height applies that height to every character in the font.
- [x] Saving a character writes it at the font-level height.
- [x] Font validation rejects characters whose height differs from the font height.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.6 Compact Three-Panel Font Editor Layout

- [x] Split the Font Editor into Font panel, Character panel and Character editor panel.
- [x] Keep font selector, font settings and Danger Zone in the Font panel.
- [x] Move character selector, legend and Select Duplicate into a separate Character panel.
- [x] Keep selected character grid, width, guidance, Reset, Clear and Save Character in the Character editor panel.
- [x] Update Delete Font copy to clarify it deletes the full font and all characters.
- [x] Keep character scrolling inside the Character panel.
- [x] Preserve stacked responsive behaviour for smaller screens.
- [x] Update Character Editor function documentation.
- [x] Update automated source-level editor UI coverage.

Acceptance checks:

- [x] Desktop Font Editor uses a compact three-column layout.
- [x] Character selector is separated from Font Settings.
- [x] Character editor panel no longer stretches awkwardly across the full page.
- [x] Font height remains managed at font level.
- [x] Character width remains managed at character level.
- [x] Delete Font remains a font-level Danger Zone action.
- [x] Save Character remains clear and available.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.7 Wider Font Editor Character Panel

- [x] Widen the Font Editor Character panel on desktop.
- [x] Restore seven desktop character tile columns.
- [x] Remove the desktop character-picker scrollbar where the standard alphabet set fits.
- [x] Keep smaller-screen responsive stacking intact.
- [x] Update Character Editor function documentation.
- [x] Update automated source-level editor UI coverage.

Acceptance checks:

- [x] Character panel is wider on desktop.
- [x] Character tiles render in seven columns on desktop.
- [x] The character picker does not show its own scrollbar for the standard alphabet view on desktop.
- [x] The character editor panel remains usable with the wider middle panel.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 25.8 Editor Width Stack And Compact Homepage Fit

- [x] Move the character Width control directly under the editable letter grid.
- [x] Arrange the character editor action/help area to use the remaining panel space efficiently.
- [x] Reduce the Home centred lettering preview zoom.
- [x] Tighten Home hero, How it works and footer spacing.
- [x] Update Character Editor function documentation.
- [x] Update Navigation and Routing function documentation for homepage fit.
- [x] Add homepage layout source-level coverage.
- [x] Update editor source-level coverage for the width-under-grid layout.

Acceptance checks:

- [x] Character Width appears under the selected letter grid.
- [x] Save Character remains clear and available.
- [x] Home centred lettering preview is smaller at 100% browser zoom.
- [x] How it works and copyright footer sit higher on the Home page.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

## Phase 26: Pattern Stitching Aids

### 26.1 Pattern Centre Guide Lines

- [x] Show a vertical centre guide line on generated pattern previews.
- [x] Show a horizontal centre guide line on generated pattern previews.
- [x] Use a guide colour that is visibly different from normal grid lines.
- [x] Draw matching centre guide lines in PNG export.
- [x] Keep centre guide drawing separate from pattern grid data.
- [x] Update Grid Rendering function documentation.
- [x] Update Export PNG function documentation.
- [x] Add automated coverage for preview and PNG centre guide behaviour.

Acceptance checks:

- [x] Pattern preview shows the exact middle with horizontal and vertical guide lines.
- [x] PNG export includes the same centre guide lines.
- [x] Centre guide lines remain visible even when normal grid lines are visually different.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

## Phase 27: Dependency Security And Lint Validation

### 27.1 Patch Vulnerable Dependencies

- [x] Update `next` to a patched version above the vulnerable `16.2.4` release.
- [x] Update `eslint-config-next` to match the patched Next.js version.
- [x] Update `@supabase/supabase-js` to the latest available version.
- [x] Add pnpm overrides for remaining transitive audit findings.
- [x] Refresh `pnpm-lock.yaml`.

Acceptance checks:

- [x] Production dependency audit reports no known vulnerabilities.
- [x] Production build passes.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.

### 27.2 Restore Lint As A Regular Check

- [x] Replace the obsolete `next lint` script with direct ESLint.
- [x] Add an ESLint flat config compatible with ESLint 9 and Next.js 16.
- [x] Keep generated and dependency folders ignored by lint.

Acceptance checks:

- [x] `eslint .` runs successfully.
- [x] Lint reports no blocking errors.
- [x] Remaining lint findings are warnings only.

### 27.3 Clean Existing Lint Warnings

- [x] Remove unused script helper variable from `scripts/generate-fonts.mjs`.
- [x] Remove unused editor selected-character variable.
- [x] Replace unsupported `aria-disabled` usage on the display card article.
- [x] Remove unused renderer parameter.
- [x] Fix editor selected-font effect dependency.
- [x] Fix `useFonts` refresh effect dependency with stable callbacks.

Acceptance checks:

- [x] `pnpm run lint` reports no warnings or errors.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.
- [x] Production build passes.
- [x] Production dependency audit reports no known vulnerabilities.

## Phase 28: Efficiency, Accessibility And Security Validation

### 28.1 Full Validation Pass

- [x] Run lint/static accessibility checks.
- [x] Run app TypeScript compile.
- [x] Run test TypeScript compile and utility tests.
- [x] Run production build.
- [x] Run production dependency security audit.
- [x] Scan source for dangerous HTML/script execution patterns.
- [x] Scan source for environment variable and external script exposure patterns.
- [x] Smoke test Home, Generator and keep-alive routes on a temporary production server.

Acceptance checks:

- [x] Lint reports no warnings or errors.
- [x] TypeScript compile passes.
- [x] Utility tests pass.
- [x] Production build passes.
- [x] Production audit reports no known vulnerabilities.
- [x] Runtime smoke checks return HTTP 200.

### 28.2 Browser-Level Accessibility Pass

- [x] Start a temporary production server for rendered route checks.
- [x] Check rendered route status and basic page structure for Home, Alphabet Library, Create Pattern, Font Editor and Design System.
- [x] Verify runtime security headers while testing the browser output.
- [x] Inspect keyboard and screen-reader source support for focus styles, grid keyboard controls, live regions and read-only grid semantics.
- [x] Confirm axe-core, Lighthouse and Playwright are not currently installed.
- [x] Stop the temporary production server after checks.
- [x] Update accessibility function documentation with browser-level findings.
- [x] Update central known gaps for newly confirmed accessibility/tooling follow-ups.

Acceptance checks:

- [x] Core routes return HTTP 200 during rendered checks.
- [x] Security headers are present in runtime responses.
- [x] Existing known accessibility gaps are confirmed from source.
- [x] New browser-level findings are documented.

## Phase 29: Accessibility Fixes

### 29.1 Editor Heading And Live Status Regions

- [x] Add a meaningful screen-reader-only `h1` to the Font Editor route.
- [x] Add a polite live loading status to the Font Editor route fallback.
- [x] Add live-region semantics to Font Editor font settings status messages.
- [x] Add live-region semantics to Character Editor validation, disabled-save and save result messages.
- [x] Add live-region semantics to Generator unsupported-character and renderer warning messages.
- [x] Add live-region semantics to ExportControls feedback messages.
- [x] Add live-region semantics to font-sync status and warning messages.
- [x] Add accessibility source regression tests.
- [x] Document the accessibility tooling decision: axe-style browser checks before go-live; Lighthouse optional later.

Acceptance checks:

- [x] App TypeScript compile passes.
- [x] Source/test ESLint passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.
- [x] Production build passes.
- [x] Built `/editor` route returns HTTP 200 with one `h1` and live-region markup.

### 29.2 Remaining Accessibility Backlog

- [x] Add arrow-key focus movement for editable stitch grids.
- [x] Render read-only stitch preview cells as non-interactive cells.
- [x] Replace remaining `window.alert()` font action status messages with inline live status messages.
- [x] Add accessibility source regression tests for arrow navigation, read-only preview semantics and font action status messages.
- [x] Update accessibility functional requirements and known-gaps documentation.

Acceptance checks:

- [x] Editable grid cells respond to ArrowUp, ArrowDown, ArrowLeft and ArrowRight.
- [x] Arrow-key focus movement is clamped at grid edges.
- [x] Read-only grid previews do not render individual cells as disabled buttons.
- [x] Font create, rename, delete, restore and backup restore outcomes use inline status/alert regions.
- [x] Source no longer contains `window.alert()` font action status calls.
- [x] App TypeScript compile passes.
- [x] Source/test ESLint passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.
- [x] Production build passes.

## Phase 30: Stitch Library And Unsupported Character Improvements

### 30.1 Library Preview, Punctuation And Unsupported Character Handling

- [x] Remove centre guide overlays from Stitch Library font card previews.
- [x] Keep centre guide overlays on Create Pattern previews.
- [x] Add the remaining common printable punctuation characters to the shared editable character set.
- [x] Add punctuation mappings to bundled default font data.
- [x] Add a repeatable Supabase migration to patch punctuation into seeded default font rows.
- [x] Update blank font creation so new fonts include the complete punctuation set.
- [x] Update Font Editor character ordering to show A-Z, a-z, 0-9, punctuation, then other mapped characters.
- [x] Skip unsupported characters during pattern rendering instead of inserting placeholder graphics.
- [x] Show a single immediate Generator warning that lists skipped unsupported characters where practical.
- [x] Update function documentation and test documentation.
- [x] Add automated regression coverage for preview centre guides, punctuation coverage and unsupported character skipping.

Acceptance checks:

- [x] Stitch Library previews render without centre guide overlays.
- [x] Create Pattern preview keeps centre guide overlays.
- [x] Required punctuation exists in bundled fonts and blank fonts.
- [x] Required punctuation appears in the Font Editor character picker.
- [x] Supported punctuation renders as stitch data.
- [x] Unsupported characters are counted, warned about and skipped rather than replaced.
- [x] Multiple unsupported characters produce one warning surface in the Generator.
- [x] App TypeScript compile passes.
- [x] Source/test ESLint passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.
- [x] Production build passes.


## Phase 31: Font Editor UX Improvements

### 31.1 Unsaved Character Guard, Duplicate Flow And Stable Notifications

- [x] Add an unsaved-character confirmation dialog with Save & Continue, Discard Changes and Cancel.
- [x] Guard character selection when the current character has unsaved edits.
- [x] Guard font selection when the current character has unsaved edits.
- [x] Guard internal page navigation when the current character has unsaved edits.
- [x] Guard duplicate setup when the current character has unsaved edits.
- [x] Remove the character-width information panel from the Font Editor.
- [x] Move character save success feedback to a floating auto-dismiss notification.
- [x] Prevent duplicate-source selection from applying a draft before the user confirms it.
- [x] Update Character Editor function documentation.
- [x] Add Font Editor test documentation and automated source coverage.

Acceptance checks:

- [x] Unsaved character edits prompt before leaving the current character.
- [x] Save & Continue saves before continuing the requested action.
- [x] Discard Changes discards before continuing the requested action.
- [x] Cancel keeps the user on the current character.
- [x] The character-width information panel no longer appears.
- [x] Character save success feedback does not move the editor layout.
- [x] Duplicate source selection does not show the duplicated draft or existing-character warning until confirmed.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.

## Phase 32: Font Editor Regression Fixes

### 32.1 Punctuation Drawing, Font Settings Preservation And Duplicate Restore

- [x] Stabilise blank/not-created character drafts so punctuation characters can be drawn on immediately.
- [x] Preserve the currently selected character when saving font name or font height.
- [x] Route font settings saves through the unsaved-character confirmation flow.
- [x] Ensure Save & Continue before font settings uses the latest saved character data.
- [x] Restore duplicate source selection so choosing a source applies it to the selected character draft.
- [x] Move the floating save notification away from the Save Character button.
- [x] Document the current 1-24 width/height clamp as an implementation safety limit and open product question.
- [x] Update Character Editor function documentation and Font Editor source tests.

Acceptance checks:

- [x] Newly added punctuation characters can be selected and drawn on.
- [x] Saving font settings does not switch the view back to `A`.
- [x] Saving font settings does not silently discard unsaved character edits.
- [x] Duplicate character selection applies the chosen source to the selected draft.
- [x] Save success feedback does not cover the Save Character button.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.

## Phase 33: Generator Missing Pattern Warning Fix

### 33.1 Blank Character Grids Warn As Unavailable

- [x] Treat blank/uncreated character grids as unavailable during pattern generation.
- [x] Keep lowercase-to-uppercase fallback when the lowercase grid is blank but uppercase has stitches.
- [x] Restore the Generator warning when a typed character has no stitch pattern.
- [x] Add renderer regression coverage for blank punctuation characters.
- [x] Update function documentation and test documentation.

Acceptance checks:

- [x] Typing a character whose grid exists but has no filled stitches shows the missing-character warning.
- [x] Blank/uncreated characters are skipped from the rendered pattern.
- [x] Supported characters in the same text still render.
- [x] Renderer tests cover blank punctuation grids.

## Phase 34: Browser Favicon

### 34.1 Needle And Thread Favicon

- [x] Create favicon assets from the supplied needle-and-thread artwork.
- [x] Add browser tab icon metadata for favicon and Apple touch icon support.
- [x] Add versioned favicon URLs so browsers refresh cached tab icons.
- [x] Verify generated favicon dimensions.

Acceptance checks:

- [x] Browser tab can use the supplied favicon artwork.
- [x] Favicon assets include ICO, 512px app icon and 180px Apple touch icon.

## Phase 35: Alphabet Library Preview Efficiency

### 35.1 Adaptive Font Card Samples

- [x] Build font-card preview samples from drawable characters in each alphabet.
- [x] Use a fuller uppercase sample so short previews make better use of card space.
- [x] Include lowercase and numbers only when the selected font can draw them.
- [x] Shrink-wrap mini preview paper to short samples while preserving scrolling for wider samples.
- [x] Update Font Browser function documentation and source tests.

Acceptance checks:

- [x] Alphabet Library previews avoid unsupported sample characters.
- [x] Alphabet Library previews include more sample lettering than `ABC 123` where supported.
- [x] Short previews no longer leave a large blank paper area across the card.

## Phase 36: Data, Documentation And Test Housekeeping Review

### 36.1 Housekeeping Pass

- [x] Review current font data model, bundled seed data, persistence helpers and Supabase migration coverage.
- [x] Validate bundled font data for duplicate IDs/names, complete punctuation coverage, font-level height consistency and invalid grids.
- [x] Remove obsolete renderer placeholder option from active types and implementation.
- [x] Update stale function documentation and rules for unsupported-character skipping and warning behaviour.
- [x] Update the masterplan to reflect current Supabase-backed shared font persistence.
- [x] Refresh known-gaps tracking for newer function documentation pages.
- [x] Run app TypeScript compile, test TypeScript compile, utility tests, ESLint, production build and production dependency audit.

Acceptance checks:

- [x] Bundled fonts validate successfully.
- [x] Required punctuation is present in bundled fonts.
- [x] Character heights match font-level height in bundled data.
- [x] Unsupported characters are documented as skipped with warnings, not rendered as placeholders.
- [x] App TypeScript compile passes.
- [x] Test TypeScript compile passes.
- [x] Utility test runner passes.
- [x] ESLint passes with no warnings.
- [x] Production build passes.
- [x] Production dependency audit reports no known vulnerabilities.

## Phase 37: Homepage Preview Guide Cleanup

### 37.1 Remove Homepage Centre Guide

- [x] Disable the centre guide line on the homepage lettering preview.
- [x] Preserve centre guide behaviour for the Create Pattern page.

Acceptance checks:

- [x] Homepage preview renders without the blue centre guide.
- [x] Create Pattern preview component default remains unchanged.

## Phase 38: Alphabet Library Loading State

### 38.1 Prevent Stale Font List Flash

- [x] Show a loading status while database-backed font data is still resolving.
- [x] Prevent bundled/default font cards from rendering during the loading state.
- [x] Keep Create New Font disabled until write-ready persistence is available.
- [x] Update Font Browser function documentation and source coverage.

Acceptance checks:

- [x] Alphabet Library shows `Loading alphabet library...` while fonts load.
- [x] Alphabet Library does not flash the old/default list before database fonts resolve.
- [x] Resolved font list still renders after loading completes.
- [x] Create Pattern centre guide behaviour is unaffected.

## Phase 39: Create Pattern Loading State

### 39.1 Prevent Stale Pattern Preview Flash

- [x] Show a loading status while database-backed font data is still resolving on Create Pattern.
- [x] Prevent the first-font fallback from running before font loading resolves.
- [x] Prevent stale preview/export controls from rendering during the loading state.
- [x] Update Text Generator function documentation and source coverage.

Acceptance checks:

- [x] Create Pattern shows `Loading pattern creator...` while fonts load.
- [x] Create Pattern does not flash an old/default preview before the selected font resolves.
- [x] Create Pattern still falls back to the first available font after loading if no saved/selected font is available.
- [x] Create Pattern centre guide behaviour is unaffected after loading.

## Phase 40: Duplicate Character Save And Dropdown Contrast

### 40.1 Stabilise Duplicate Character Saves

- [x] Keep duplicate-created character drafts attached to the destination character during save.
- [x] Prevent transient `character already exists` warnings during successful duplicate-created character saves.
- [x] Improve native dropdown option contrast in the dark theme.
- [x] Update function documentation and source tests.

Acceptance checks:

- [x] Saving a character created from a duplicate no longer flashes back to the source character.
- [x] Successful duplicate-created character saves do not show a false existing-character warning.
- [x] Native dropdown options use dark high-contrast styling.

## Phase 41: Duplicate Source Picker Ordering

### 41.1 Match Main Character Ordering And Hide Not-Created Sources

- [x] Use the same character order in Select Duplicate as the main character picker.
- [x] Hide not-created or blank characters from the duplicate source picker.
- [x] Add an empty-state message when no existing character designs are available to duplicate.
- [x] Update function documentation and source tests.

Acceptance checks:

- [x] Duplicate source tiles are ordered A-Z, a-z, 0-9, punctuation, then other mapped characters.
- [x] Characters without filled stitch designs do not appear as duplicate sources.
- [x] Not-created characters cannot be selected as duplicate sources.
## Phase 42: Save Character Pending Feedback

### 42.1 Make Character Saves Feel Responsive

- [x] Show immediate saving feedback when Save Character is clicked.
- [x] Change Save Character to `Saving...` while the save is pending.
- [x] Disable Save Character while the save is pending to prevent duplicate clicks.
- [x] Update function documentation and source tests.

Acceptance checks:

- [x] Save Character visibly changes as soon as saving begins.
- [x] A polite saving status is shown while the database save is pending.
- [x] The save button cannot be clicked repeatedly while saving.
## Phase 43: Missing Lowercase Pattern Warning

### 43.1 Stop Silent Uppercase Replacement

- [x] Remove lowercase-to-uppercase fallback from pattern rendering.
- [x] Report missing lowercase characters as unsupported.
- [x] Skip missing lowercase characters rather than rendering uppercase replacements.
- [x] Update function documentation and renderer tests.

Acceptance checks:

- [x] Missing lowercase characters show in unsupported-character reporting.
- [x] Missing lowercase characters are skipped from the generated grid.
- [x] Existing uppercase characters still render when typed as uppercase.
