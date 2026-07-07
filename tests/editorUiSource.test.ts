import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const editorClientSource = readFileSync("src/app/editor/EditorClient.tsx", "utf8");
const characterEditorSource = readFileSync("src/components/CharacterEditor.tsx", "utf8");
const characterSetSource = readFileSync("src/lib/characterSets.ts", "utf8");
const globalCssSource = readFileSync("src/app/globals.css", "utf8");

assert.ok(
  editorClientSource.includes("newCharacterOpen"),
  "EDITOR-UI-001: Editor should control new-character creation through modal open state."
);

assert.ok(
  editorClientSource.includes("editor-font-panel") &&
    editorClientSource.includes("editor-character-panel") &&
    editorClientSource.includes("editor-main"),
  "EDITOR-UI-014: Font Editor should use separate font, character and character-editor panels."
);

assert.ok(
  globalCssSource.includes("minmax(350px, 390px)") &&
    globalCssSource.includes("grid-template-columns: repeat(7, minmax(0, 1fr));") &&
    globalCssSource.includes("max-height: none;") &&
    globalCssSource.includes("overflow: visible;"),
  "EDITOR-UI-015: Desktop character panel should be wide enough to avoid a character picker scrollbar."
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
    editorClientSource.includes("punctuationCharacters") &&
    editorClientSource.includes("displayedCharacterKeys"),
  "EDITOR-UI-007: Character picker should order A-Z first, then a-z, then 0-9, then punctuation, then other mapped characters."
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
  editorClientSource.includes("fontNameDraft") &&
    editorClientSource.includes("fontHeightDraft") &&
    editorClientSource.includes("saveFontSettings") &&
    editorClientSource.includes("resizeFontCharactersHeight"),
  "EDITOR-UI-012: Editor should expose editable font name and font-level height settings."
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
  editorClientSource.includes("setSourceCharacterKey(key)") &&
    editorClientSource.includes("setCreatingCharacter(true)") &&
    editorClientSource.includes("setNewCharacterOpen(false)"),
  "EDITOR-UI-017: Duplicate source tile selection should apply the selected source directly to the current character draft."
);

assert.ok(
  editorClientSource.includes("danger-zone") &&
    editorClientSource.includes("Delete Font...") &&
    editorClientSource.includes("Deletes the full font and all characters permanently."),
  "EDITOR-UI-004: Editor font panel should keep delete controls in a danger zone with full-font delete copy."
);

assert.ok(
  characterEditorSource.includes("character-editor-layout") &&
    characterEditorSource.includes("character-grid-stack") &&
    characterEditorSource.includes("character-editor-controls") &&
    !characterEditorSource.includes("editor-help-card") &&
    !characterEditorSource.includes("Character width is edited here"),
  "EDITOR-UI-005: Character editor should keep the grid and width control stacked together without the old character-width help panel."
);

assert.ok(
  !characterEditorSource.includes("Height\n              <input") &&
    characterEditorSource.includes("Width\n              <input"),
  "EDITOR-UI-013: Character editor should not expose per-character height editing."
);

assert.ok(
  characterEditorSource.includes("editor-footer") && characterEditorSource.includes("save-character-button"),
  "EDITOR-UI-006: Character editor should use a footer action row with a dedicated save button."
);

assert.ok(
  editorClientSource.includes("pendingExit") &&
    editorClientSource.includes("Save &amp; Continue") &&
    editorClientSource.includes("Discard Changes") &&
    editorClientSource.includes("You have unsaved changes to this character."),
  "EDITOR-UI-018: Unsaved character changes should use a three-action confirmation dialog."
);

assert.ok(
  editorClientSource.includes("beforeunload") &&
    editorClientSource.includes('document.addEventListener("click", handleDocumentClick, true)') &&
    editorClientSource.includes("requestCharacterExit"),
  "EDITOR-UI-019: Unsaved character changes should guard font changes, character changes and page navigation."
);

assert.ok(
  characterEditorSource.includes("onDirtyChange") &&
    characterEditorSource.includes("onEditorActionsChange") &&
    characterEditorSource.includes("serialiseCharacter") &&
    characterEditorSource.includes("discardDraft"),
  "EDITOR-UI-020: CharacterEditor should expose dirty state plus save/discard actions to the editor shell."
);

assert.ok(
  characterEditorSource.includes("editor-floating-status") &&
    characterEditorSource.includes("window.setTimeout") &&
    globalCssSource.includes(".editor-floating-status") &&
    globalCssSource.includes("position: absolute") &&
    globalCssSource.includes("top: 72px") &&
    !globalCssSource.includes("bottom: 14px"),
  "EDITOR-UI-021: Character save status should use a floating auto-dismiss notification that does not cover the save button."
);

assert.ok(
  editorClientSource.includes("const newCharacter = useMemo") &&
    editorClientSource.includes("selectedFont?.defaultHeight") &&
    editorClientSource.includes("sourceCharacter"),
  "EDITOR-UI-022: Blank punctuation and other not-created character drafts should remain stable while cells are edited."
);

assert.ok(
  editorClientSource.includes("latestFontRef") &&
    editorClientSource.includes("requestCharacterExit(() =>") &&
    editorClientSource.includes("void applyFontSettings()"),
  "EDITOR-UI-023: Saving font settings should preserve the current character and route through the unsaved-change guard."
);

console.log("editor UI source tests passed.");

assert.ok(
  characterSetSource.includes("punctuationCharacters") &&
    characterSetSource.includes('"@"') &&
    characterSetSource.includes('"~"') &&
    characterSetSource.includes('"\\\\"'),
  "EDITOR-UI-016: Shared character set should include the required printable punctuation characters."
);
