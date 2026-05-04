import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { GeneratorSettings, StitchFont } from "../src/lib/fontTypes";
import {
  deleteFont,
  duplicateFont,
  loadCustomFonts,
  loadDeletedFontIds,
  loadGeneratorSettings,
  loadSelectedFontId,
  restoreFont,
  saveCustomFonts,
  saveDeletedFontIds,
  saveFont,
  saveGeneratorSettings,
  saveSelectedFontId
} from "../src/lib/localStorageUtils";

const fonts = fontsData as StitchFont[];
const blockFont = fonts.find((font) => font.id === "block-needle-5x7");
assert.ok(blockFont, "Block Needle test font should exist.");

class MemoryStorage {
  private values = new Map<string, string>();

  getItem(key: string) {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string) {
    this.values.set(key, value);
  }

  removeItem(key: string) {
    this.values.delete(key);
  }

  clear() {
    this.values.clear();
  }
}

const localStorage = new MemoryStorage();
(globalThis as any).window = { localStorage };

localStorage.clear();
assert.deepEqual(loadCustomFonts(), [], "Missing custom font storage should return an empty list.");
assert.deepEqual(loadDeletedFontIds(), [], "Missing deleted font storage should return an empty list.");
assert.deepEqual(loadGeneratorSettings(), {}, "Missing generator settings should return an empty object.");
assert.equal(loadSelectedFontId(), null, "Missing selected font id should return null.");

localStorage.setItem("crossStitch.customFonts", "not valid json");
localStorage.setItem("crossStitch.deletedFontIds", "not valid json");
localStorage.setItem("crossStitch.generatorSettings", "not valid json");
assert.deepEqual(loadCustomFonts(), [], "Corrupted custom font storage should fall back safely.");
assert.deepEqual(loadDeletedFontIds(), [], "Corrupted deleted font storage should fall back safely.");
assert.deepEqual(loadGeneratorSettings(), {}, "Corrupted generator settings should fall back safely.");

const invalidFont = { ...blockFont, characters: { A: { width: 2, height: 1, grid: ["101"] } } };
saveCustomFonts([blockFont, invalidFont as StitchFont]);
assert.deepEqual(
  loadCustomFonts().map((font) => font.id),
  [blockFont.id],
  "Invalid stored fonts should be filtered out."
);

const duplicated = duplicateFont(blockFont, "Copied Block");
assert.equal(duplicated.name, "Copied Block");
assert.equal(duplicated.baseFontId, blockFont.id);
assert.equal(duplicated.isCustom, true);
assert.notEqual(duplicated.id, blockFont.id);

saveCustomFonts([]);
saveFont(duplicated);
assert.equal(loadCustomFonts()[0].id, duplicated.id, "Saved font should be returned from storage.");

deleteFont(duplicated.id);
assert.deepEqual(loadCustomFonts(), [], "Deleted custom font should be removed from storage.");
assert.deepEqual(loadDeletedFontIds(), [duplicated.id], "Deleted font id should be tracked once.");

restoreFont(duplicated.id);
assert.deepEqual(loadDeletedFontIds(), [], "Restoring a font should remove it from deleted ids.");

saveDeletedFontIds(["a", "a", "b"]);
assert.deepEqual(loadDeletedFontIds(), ["a", "b"], "Deleted font ids should be deduplicated.");

const settings: Partial<GeneratorSettings> = {
  text: "HELLO",
  letterSpacing: 2,
  wordSpacing: 4,
  lineSpacing: 1,
  alignment: "center"
};
saveGeneratorSettings(settings);
assert.deepEqual(loadGeneratorSettings(), settings, "Generator settings should round-trip.");

saveSelectedFontId(blockFont.id);
assert.equal(loadSelectedFontId(), blockFont.id, "Selected font id should round-trip.");

console.log("localStorageUtils tests passed.");
