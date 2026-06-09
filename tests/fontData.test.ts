import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { StitchFont } from "../src/lib/fontTypes";
import { createBlankCharacter, createBlankFont, blankFontCharacterKeys } from "../src/lib/fontFactory";
import { validateCharacter, validateFont, validateUniqueFontIds } from "../src/lib/gridUtils";

const fonts = fontsData as StitchFont[];

assert.ok(fonts.length > 0, "Default font data should include at least one font.");
assert.equal(validateUniqueFontIds(fonts).valid, true, "Default font ids should be unique.");

for (const font of fonts) {
  const result = validateFont(font);
  assert.equal(result.valid, true, `${font.id} should be valid: ${result.errors.join("; ")}`);

  for (const key of Object.keys(font.characters)) {
    assert.equal(Array.from(key).length, 1, `${font.id}:${key} should use a single-character key.`);
  }
}

const blank = createBlankCharacter(4, 3);
assert.deepEqual(blank, { width: 4, height: 3, grid: ["0000", "0000", "0000"] });
assert.equal(validateCharacter(blank).valid, true);

const customFont = createBlankFont("Test Blank Font");
assert.equal(customFont.name, "Test Blank Font");
assert.equal(customFont.isCustom, true);
assert.equal(customFont.defaultHeight, 10);
assert.equal(validateFont(customFont).valid, true);
assert.deepEqual(
  new Set(Object.keys(customFont.characters)),
  new Set(blankFontCharacterKeys),
  "Blank fonts should include the expected starter character mappings."
);

console.log("fontData tests passed.");
