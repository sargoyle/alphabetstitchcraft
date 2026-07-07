import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { StitchFont } from "../src/lib/fontTypes";
import { defaultEditableCharacterKeys, punctuationCharacters } from "../src/lib/characterSets";
import { createBlankCharacter, createBlankFont } from "../src/lib/fontFactory";
import { resizeFontCharactersHeight, validateCharacter, validateFont, validateUniqueFontIds } from "../src/lib/gridUtils";

const fonts = fontsData as StitchFont[];

assert.ok(fonts.length > 0, "Default font data should include at least one font.");
assert.equal(validateUniqueFontIds(fonts).valid, true, "Default font ids should be unique.");

for (const font of fonts) {
  const result = validateFont(font);
  assert.equal(result.valid, true, `${font.id} should be valid: ${result.errors.join("; ")}`);

  for (const key of punctuationCharacters) {
    assert.ok(font.characters[key], `${font.id}:${key} should include the complete punctuation set.`);
  }

  for (const key of Object.keys(font.characters)) {
    assert.equal(Array.from(key).length, 1, `${font.id}:${key} should use a single-character key.`);
    assert.equal(
      font.characters[key].height,
      font.defaultHeight,
      `${font.id}:${key} height should match font height.`
    );
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
  new Set(defaultEditableCharacterKeys),
  "Blank fonts should include the expected starter character mappings."
);
for (const key of punctuationCharacters) {
  assert.ok(customFont.characters[key], `Blank font should include editable punctuation character ${key}.`);
}

const resizedFont = resizeFontCharactersHeight(customFont, 12);
assert.equal(resizedFont.defaultHeight, 12);
for (const character of Object.values(resizedFont.characters)) {
  assert.equal(character.height, 12, "Font-level height resize should update every character height.");
  assert.equal(character.grid.length, 12, "Font-level height resize should update every character grid row count.");
}

console.log("fontData tests passed.");
