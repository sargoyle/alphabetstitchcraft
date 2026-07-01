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
  editorClientSource.includes("character-button-grid") && editorClientSource.includes("character-tile is-active"),
  "EDITOR-UI-003: Editor sidebar should expose character tile navigation with active state."
);

assert.ok(
  editorClientSource.includes("danger-zone") && editorClientSource.includes("Delete Font..."),
  "EDITOR-UI-004: Editor sidebar should keep delete controls in a danger zone."
);

assert.ok(
  characterEditorSource.includes("character-editor-body") &&
    characterEditorSource.includes("dimension-editor-panel") &&
    characterEditorSource.includes("editor-help-card"),
  "EDITOR-UI-005: Character editor should place grid and dimension controls in the compact editor body."
);

assert.ok(
  characterEditorSource.includes("editor-footer") && characterEditorSource.includes("save-character-button"),
  "EDITOR-UI-006: Character editor should use a footer action row with a dedicated save button."
);

console.log("editor UI source tests passed.");
