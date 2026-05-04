export const documentationPages = [
  {
    href: "/docs",
    title: "Documentation Home",
    description: "Project overview and index for the living app documentation."
  },
  {
    href: "/docs/architecture",
    title: "Architecture",
    description: "Tech stack, folder structure, app boundaries and database overview."
  },
  {
    href: "/docs/components",
    title: "Components",
    description: "Major UI components, their responsibilities, inputs and usage."
  },
  {
    href: "/docs/data-flow",
    title: "Data Flow",
    description: "How font, editor, generator and export data moves through the system."
  },
  {
    href: "/docs/api",
    title: "API",
    description: "App functions, persistence helpers, rendering utilities and Supabase operations."
  },
  {
    href: "/docs/dependencies",
    title: "Dependencies",
    description: "Third-party libraries, services and what depends on them."
  }
];

export const folderStructure = [
  { path: "src/app", purpose: "Next.js App Router pages, layouts and route-specific client screens." },
  { path: "src/components", purpose: "Reusable UI components for grids, previews, font cards, controls and auth status." },
  { path: "src/lib", purpose: "Font models, rendering, validation, export, storage and Supabase integration helpers." },
  { path: "src/data", purpose: "Default stitch alphabet data used as built-in font source material." },
  { path: "supabase/migrations", purpose: "Database schema and RLS policy migrations for Supabase Postgres." },
  { path: "docs", purpose: "Persistent project documentation, tasks, rules and changelog source files." },
  { path: "tests", purpose: "Focused TypeScript tests for renderer behavior." }
];

export const databaseTables = [
  { table: "profiles", purpose: "Supabase Auth profile records created for authenticated users." },
  { table: "workspaces", purpose: "Future collaboration container; currently scaffolded for later workspace sharing." },
  { table: "workspace_members", purpose: "Future workspace membership and role records." },
  { table: "default_fonts", purpose: "Optional public reference table for built-in fonts." },
  { table: "custom_fonts", purpose: "Shared public editable font records used by the app's Manage Fonts workflow." },
  { table: "custom_font_characters", purpose: "Character grids belonging to shared public custom fonts." },
  { table: "generated_patterns", purpose: "Planned saved generated lettering patterns." },
  { table: "generator_settings", purpose: "Planned saved generator preferences per user." },
  { table: "pattern_exports", purpose: "Planned export metadata for generated patterns." }
];

export const componentDocs = [
  {
    name: "AuthStatus",
    file: "src/components/AuthStatus.tsx",
    purpose: "Legacy/auth utility panel for Supabase session, magic link and password sign-in flows.",
    usedIn: "Previously used in Manage Fonts authentication experiments; not part of the current public font workflow.",
    inputs: "No external props."
  },
  {
    name: "CharacterEditor",
    file: "src/components/CharacterEditor.tsx",
    purpose: "Editable character workspace with width, height, clear, reset and save controls.",
    usedIn: "/editor",
    inputs: "characterKey, character, originalCharacter, onSave(character)"
  },
  {
    name: "CharacterGrid",
    file: "src/components/CharacterGrid.tsx",
    purpose: "Renders a stitch character grid and supports click or drag-to-paint editing.",
    usedIn: "CharacterEditor and alphabet previews.",
    inputs: "character, label, editable, showGrid, cellSize, onToggle, onSetCell"
  },
  {
    name: "ExportControls",
    file: "src/components/ExportControls.tsx",
    purpose: "Exports generated patterns as PNG or JSON and copies stitch dimensions.",
    usedIn: "/generator",
    inputs: "pattern"
  },
  {
    name: "FontCard",
    file: "src/components/FontCard.tsx",
    purpose: "Displays a library font with metadata, sample preview and View/Use actions.",
    usedIn: "/fonts",
    inputs: "font, onUse(fontId)"
  },
  {
    name: "FontGridPreview",
    file: "src/components/FontGridPreview.tsx",
    purpose: "Renders compact sample lettering from a font for cards and management previews.",
    usedIn: "FontCard and /custom-fonts.",
    inputs: "font"
  },
  {
    name: "SpacingControls",
    file: "src/components/SpacingControls.tsx",
    purpose: "Controls letter spacing, word spacing, line spacing, alignment, visibility and zoom.",
    usedIn: "/generator",
    inputs: "letterSpacing, wordSpacing, lineSpacing, alignment, showGrid, showFilled, zoom, onChange"
  },
  {
    name: "TextPatternPreview",
    file: "src/components/TextPatternPreview.tsx",
    purpose: "Renders a generated lettering pattern on scrollable cross-stitch graph paper.",
    usedIn: "Home and /generator.",
    inputs: "pattern, showGrid, showFilled, zoom"
  }
];

export const apiDocs = [
  {
    name: "useFonts()",
    location: "src/lib/useFonts.ts",
    inputs: "No arguments.",
    output: "fonts, savedFonts, deletedFonts, persistence state, refresh, saveFont, deleteFont, restoreFont, resetFontEdits.",
    example: "const { fonts, saveFont, persistence } = useFonts();"
  },
  {
    name: "renderTextToGrid(text, font, options)",
    location: "src/lib/renderTextToGrid.ts",
    inputs: "text string, StitchFont, TextRenderOptions.",
    output: "GeneratedPattern with width, height, grid and unsupportedCharacters.",
    example: "renderTextToGrid('HELLO', font, { letterSpacing: 1, wordSpacing: 3, lineSpacing: 2, alignment: 'left' })"
  },
  {
    name: "saveRemoteFont(font)",
    location: "src/lib/fontPersistence.ts",
    inputs: "StitchFont with a UUID id.",
    output: "Promise<boolean>; writes font metadata and character rows to Supabase.",
    example: "await saveRemoteFont(font);"
  },
  {
    name: "loadRemoteFonts()",
    location: "src/lib/fontPersistence.ts",
    inputs: "No arguments.",
    output: "Promise<StitchFont[] | null>; loads public database fonts and characters.",
    example: "const fonts = await loadRemoteFonts();"
  },
  {
    name: "deleteRemoteFont(fontId)",
    location: "src/lib/fontPersistence.ts",
    inputs: "UUID font id.",
    output: "Promise<boolean>; deletes a database font and cascades character rows.",
    example: "await deleteRemoteFont(font.id);"
  },
  {
    name: "exportPatternPng(pattern)",
    location: "src/lib/exportUtils.ts",
    inputs: "GeneratedPattern.",
    output: "Downloads a PNG image using a browser canvas.",
    example: "exportPatternPng(pattern);"
  },
  {
    name: "exportPatternJson(pattern)",
    location: "src/lib/exportUtils.ts",
    inputs: "GeneratedPattern.",
    output: "Downloads the generated pattern object as JSON.",
    example: "exportPatternJson(pattern);"
  },
  {
    name: "exportFontJson(font)",
    location: "src/lib/exportUtils.ts",
    inputs: "StitchFont.",
    output: "Downloads a stitch font object and character grids as JSON.",
    example: "exportFontJson(font);"
  },
  {
    name: "copyDesignSize(pattern)",
    location: "src/lib/exportUtils.ts",
    inputs: "GeneratedPattern.",
    output: "Copies width and height text to the clipboard.",
    example: "await copyDesignSize(pattern);"
  }
];

export const dependencies = [
  {
    name: "Next.js",
    type: "Framework",
    usedFor: "App Router pages, routing, build pipeline and React server/client component structure.",
    removalImpact: "All route pages, layouts and build scripts would need to be replaced."
  },
  {
    name: "React",
    type: "UI library",
    usedFor: "Interactive editor, generator controls, previews and component state.",
    removalImpact: "The entire UI component model would need to be rebuilt."
  },
  {
    name: "TypeScript",
    type: "Language/tooling",
    usedFor: "Font, grid, renderer, persistence and Supabase type safety.",
    removalImpact: "Grid/data contracts become easier to break and typecheck scripts stop working."
  },
  {
    name: "Tailwind CSS",
    type: "Styling utility",
    usedFor: "Base styling pipeline; project also uses custom CSS variables and classes in globals.css.",
    removalImpact: "CSS build setup would need adjustment, though most current visual styling is custom CSS."
  },
  {
    name: "@supabase/supabase-js",
    type: "Database client",
    usedFor: "Loading, saving and deleting shared public font data in Supabase.",
    removalImpact: "Database font sync stops; font changes cannot persist across browsers."
  },
  {
    name: "Supabase",
    type: "Third-party service",
    usedFor: "Postgres database, migrations, optional auth scaffolding and RLS policy management.",
    removalImpact: "Shared public font persistence and future collaboration storage need a replacement backend."
  },
  {
    name: "lucide-react",
    type: "Icon library",
    usedFor: "Available icon set for UI controls where icons are introduced.",
    removalImpact: "Icon buttons would need text labels, custom SVGs or another icon package."
  }
];
