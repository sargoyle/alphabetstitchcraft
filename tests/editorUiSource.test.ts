import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const editorClientSource = readFileSync("src/app/editor/EditorClient.tsx", "utf8");
const characterEditorSource = readFileSync("src/components/CharacterEditor.tsx", "utf8");

assert.ok(
  editorClientSource.includes("newCharacterOpen"),
  "EDITOR-UI-001: Editor should control new-character creation through modal open state."
);

assert.ok(
  editorClientSource.includes('role="dialog"') && editorClientSource.includes('aria-modal="true"'),
  "EDITOR-UI-002: New-character creation should render as an accessible dialog."
);

assert.ok(
  editorClientSource.includes("character-button-grid") &&
    editorClientSource.includes("\"character-tile\"") &&
    editorClientSource.includes("selected ? \"is-active\""),
  "EDITOR-UI-003: Editor sidebar should expose character tile navigation with active state."
);

assert.ok(
  editorClientSource.includes("uppercaseCharacters") &&
    editorClientSource.includes("lowercaseCharacters") &&
    editorClientSource.includes("numberCharacters") &&
    editorClientSource.includes("displayedCharacterKeys"),
  "EDITOR-UI-007: Character picker should order A-Z first, then a-z, then 0-9, then other mapped characters."
);

assert.ok(
  editorClientSource.includes("exists ? \"exists\" : \"not-created\"") &&
    editorClientSource.includes("character-picker-legend") &&
    editorClientSource.includes("Not created"),
  "EDITOR-UI-008: Character picker should expose exists, not-created and selected visual states."
);

assert.ok(
  editorClientSource.includes("function hasFilledStitches") &&
    editorClientSource.includes('row.includes("1")') &&
    editorClientSource.includes("const exists = hasFilledStitches"),
  "EDITOR-UI-011: Character picker should treat blank starter grids as not-created until they contain filled stitches."
);

assert.ok(
  editorClientSource.includes("fontId ? undefined : fonts[0]") &&
    editorClientSource.includes("Loading font data..."),
  "EDITOR-UI-010: Editor should avoid falling back to the first font while a requested font is still loading."
);

assert.ok(
  editorClientSource.includes("Select duplicate") &&
    editorClientSource.includes("duplicate-source-grid") &&
    !editorClientSource.includes("<select\n                  value={sourceCharacterKey}"),
  "EDITOR-UI-009: Duplicate selection should use a tile picker rather than a dropdown."
);

assert.ok(
  editorClientSource.includes("danger-zone") && editorClientSource.includes("Delete Font..."),
  "EDITOR-UI-004: Editor sidebar should keep delete controls in a danger zone."
);

assert.ok(
  characterEditorSource.includes("character-editor-body") &&
    characterEditorSource.includes("dimension-editor-panel") &&
    characterEditorSource.includes("editor-help-card"),
  "EDITOR-UI-005: Character editor should keep dimension controls and help text near the character grid."
);

assert.ok(
  characterEditorSource.includes("editor-footer") && characterEditorSource.includes("save-character-button"),
  "EDITOR-UI-006: Character editor should use a footer action row with a dedicated save button."
);

console.log("editor UI source tests passed.");
