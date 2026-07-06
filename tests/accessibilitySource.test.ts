import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const editorPageSource = readFileSync("src/app/editor/page.tsx", "utf8");
const editorClientSource = readFileSync("src/app/editor/EditorClient.tsx", "utf8");
const characterEditorSource = readFileSync("src/components/CharacterEditor.tsx", "utf8");
const generatorSource = readFileSync("src/app/generator/page.tsx", "utf8");
const exportControlsSource = readFileSync("src/components/ExportControls.tsx", "utf8");
const customFontsSource = readFileSync("src/app/custom-fonts/page.tsx", "utf8");
const fontsPageSource = readFileSync("src/app/fonts/page.tsx", "utf8");
const characterGridSource = readFileSync("src/components/CharacterGrid.tsx", "utf8");
const useFontsSource = readFileSync("src/lib/useFonts.ts", "utf8");
const globalCssSource = readFileSync("src/app/globals.css", "utf8");

assert.ok(
  editorPageSource.includes('<h1 className="sr-only">Font Editor</h1>') && globalCssSource.includes(".sr-only"),
  "A11Y-001: Font Editor route should expose a meaningful screen-reader heading."
);

assert.ok(
  editorPageSource.includes('role="status"') && editorPageSource.includes('aria-live="polite"'),
  "A11Y-002: Font Editor loading fallback should be announced politely."
);

assert.ok(
  editorClientSource.includes('role={fontSettingsStatus.type === "success" ? "status" : "alert"}') &&
    editorClientSource.includes('aria-live={fontSettingsStatus.type === "success" ? "polite" : "assertive"}'),
  "A11Y-003: Font settings save messages should use appropriate live regions."
);

assert.ok(
  characterEditorSource.includes('role={saveStatus.type === "success" ? "status" : "alert"}') &&
    characterEditorSource.includes('aria-live={saveStatus.type === "success" ? "polite" : "assertive"}') &&
    characterEditorSource.includes('role="alert" aria-live="assertive"'),
  "A11Y-004: Character editor save, validation and disabled-save messages should use live regions."
);

assert.ok(
  generatorSource.includes('role="alert" aria-live="assertive"') &&
    generatorSource.includes("Unsupported characters"),
  "A11Y-005: Generator warnings should be announced assertively."
);

assert.ok(
  exportControlsSource.includes('role="status" aria-live="polite"'),
  "A11Y-006: Export feedback should be announced politely."
);

assert.ok(
  customFontsSource.includes('role="status" aria-live="polite"') &&
    customFontsSource.includes('role="alert" aria-live="assertive"'),
  "A11Y-007: Font sync status and warnings should use live regions."
);

assert.ok(
  characterGridSource.includes("function handleArrowKey") &&
    characterGridSource.includes("ArrowUp") &&
    characterGridSource.includes("ArrowDown") &&
    characterGridSource.includes("ArrowLeft") &&
    characterGridSource.includes("ArrowRight") &&
    characterGridSource.includes("focusCell(nextRow, nextColumn)") &&
    characterGridSource.includes('data-grid-cell="true"'),
  "A11Y-008: Editable character grids should support arrow-key focus movement."
);

assert.ok(
  characterGridSource.includes("return <span") &&
    characterGridSource.includes('aria-hidden="true"') &&
    !characterGridSource.includes("disabled={!editable}"),
  "A11Y-009: Read-only character previews should use non-interactive cells instead of disabled buttons."
);

assert.ok(
  !fontsPageSource.includes("window.alert") &&
    !customFontsSource.includes("window.alert") &&
    !useFontsSource.includes("window.alert"),
  "A11Y-010: Font actions should not use window.alert for status feedback."
);

assert.ok(
  fontsPageSource.includes("setActionStatus") &&
    customFontsSource.includes("setActionStatus") &&
    fontsPageSource.includes('aria-live={actionStatus.type === "success" ? "polite" : "assertive"}') &&
    customFontsSource.includes('aria-live={actionStatus.type === "success" ? "polite" : "assertive"}'),
  "A11Y-011: Font action outcomes should use inline live status messages."
);

console.log("accessibility source tests passed.");
