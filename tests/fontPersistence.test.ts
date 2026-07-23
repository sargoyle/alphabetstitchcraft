import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createBlankFont } from "../src/lib/fontFactory";
import {
  getFontIdKind,
  getRemoteFontDeleteTarget,
  getRemoteFontSaveTarget,
  hasSharedFontNameConflict,
  hydrateRemoteCustomFont
} from "../src/lib/fontPersistence";
import type { StitchFont } from "../src/lib/fontTypes";

const fontPersistenceSource = readFileSync("src/lib/fontPersistence.ts", "utf8");

const defaultFont: StitchFont = {
  id: "block-needle-5x7",
  name: "Block Needle 5x7",
  description: "Default font",
  category: "Block",
  defaultHeight: 7,
  recommendedUse: "Testing",
  licence: "Original",
  characters: {
    A: {
      width: 1,
      height: 1,
      grid: ["1"]
    }
  }
};

const renamedDefaultFont = { ...defaultFont, name: "Renamed Block Needle" };
const customFont = createBlankFont("Custom Shared Font");
const editedCustomFont = { ...customFont, name: "Edited Custom Shared Font" };
const customFontFromDefault = { ...createBlankFont("Copied Tiny Serif"), baseFontId: "tiny-serif-7x9" };

assert.equal(getFontIdKind(defaultFont.id), "slug", "Default/shared font IDs are slugs.");
assert.equal(getFontIdKind(customFont.id), "uuid", "Custom/shared font IDs are UUIDs.");

assert.deepEqual(
  getRemoteFontSaveTarget(defaultFont),
  { table: "default_fonts", operation: "update" },
  "Editing an existing default/shared font should update default_fonts."
);

assert.deepEqual(
  getRemoteFontSaveTarget(renamedDefaultFont),
  { table: "default_fonts", operation: "update" },
  "Renaming an existing default/shared font should still update the same default_fonts record."
);

assert.deepEqual(
  getRemoteFontSaveTarget(customFont),
  { table: "custom_fonts", operation: "upsert" },
  "Creating a custom/shared font should save through custom_fonts."
);

assert.deepEqual(
  getRemoteFontSaveTarget(editedCustomFont),
  { table: "custom_fonts", operation: "upsert" },
  "Editing a custom/shared font should save through custom_fonts using the existing UUID."
);

assert.deepEqual(
  getRemoteFontSaveTarget(customFontFromDefault),
  { table: "custom_fonts", operation: "upsert" },
  "A custom font copied from a default slug should still save by its UUID custom-font ID."
);

assert.deepEqual(
  getRemoteFontDeleteTarget(customFont.id),
  { allowed: true, table: "custom_fonts", idKind: "uuid" },
  "Deleting a custom font should target custom_fonts by UUID."
);

assert.deepEqual(
  getRemoteFontDeleteTarget(defaultFont.id),
  { allowed: true, table: "default_fonts", idKind: "slug" },
  "Deleting a default/shared font slug should target default_fonts by slug for archive/soft delete."
);

assert.equal(
  hasSharedFontNameConflict([defaultFont], defaultFont.id, "Block Needle 5x7"),
  false,
  "Duplicate-name validation should ignore the current default/shared record."
);

assert.equal(
  hasSharedFontNameConflict([customFont], customFont.id, "Custom Shared Font"),
  false,
  "Duplicate-name validation should ignore the current custom record."
);

assert.equal(
  hasSharedFontNameConflict([defaultFont, customFont], customFont.id, "Block Needle 5x7"),
  true,
  "Renaming a custom font to another shared font name should be rejected."
);

assert.equal(
  hasSharedFontNameConflict([defaultFont, customFont], defaultFont.id, "Custom Shared Font"),
  true,
  "Renaming a default font to another shared font name should be rejected."
);

assert.ok(
  fontPersistenceSource.includes('.rpc("archive_default_font", { font_id: fontId })') &&
    !fontPersistenceSource.includes('.update({ is_public: false })'),
  "Default/shared font deletes should use the archive RPC instead of browser-side table updates."
);

assert.ok(
  fontPersistenceSource.includes('customFontCharactersTable.upsert(characters, {') &&
    fontPersistenceSource.includes('onConflict: "font_id,character_key"') &&
    !fontPersistenceSource.includes('.in("character_key", blankCharacterKeys)'),
  "Custom font character saves should upsert by font_id and character_key instead of deleting all rows before insert."
);
console.log("fontPersistence tests passed.");

assert.ok(
  fontPersistenceSource.includes('default_width?: number | null') &&
    fontPersistenceSource.includes('defaultWidth: font.default_width ?? font.default_height') &&
    fontPersistenceSource.includes('default_width: font.defaultWidth ?? font.defaultHeight'),
  "FONT-PERSISTENCE-001: Remote font persistence should load and save font-level default width with height fallback."
);

assert.ok(
  fontPersistenceSource.includes('function normaliseRemoteFontSaveError') &&
    fontPersistenceSource.includes('function getRemoteErrorMessage') &&
    fontPersistenceSource.includes('details') &&
    fontPersistenceSource.includes('hint') &&
    fontPersistenceSource.includes('202607140001_add_font_default_width.sql') &&
    fontPersistenceSource.includes('if (fontError) throw normaliseRemoteFontSaveError(fontError)'),
  "FONT-PERSISTENCE-002: Missing default_width schema errors should produce a clear migration message."
);

assert.ok(
  fontPersistenceSource.includes('import { defaultEditableCharacterKeys } from "./characterSets"') &&
    fontPersistenceSource.includes('defaultEditableCharacterKeys.map((key) => [key, createBlankCharacter(defaultWidth, defaultHeight)])') &&
    fontPersistenceSource.includes('filter(([, character]) => hasFilledStitches(character))') &&
    !fontPersistenceSource.includes('.in("character_key", blankCharacterKeys)'),
  "FONT-PERSISTENCE-003: Remote custom fonts should persist filled character designs, rebuild blank starter characters on load, and avoid broad blank-row deletes."
);



assert.ok(
  fontPersistenceSource.includes("export async function saveRemoteCustomFontCharacter") &&
    fontPersistenceSource.includes('.eq("character_key", characterKey)') &&
    fontPersistenceSource.includes('{ onConflict: "font_id,character_key" }'),
  "FONT-PERSISTENCE-006: Character saves should have a narrow single-character persistence path."
);

const useFontsSource = readFileSync("src/lib/useFonts.ts", "utf8");
assert.ok(
  useFontsSource.includes("async function saveEditableFontCharacter") &&
    useFontsSource.includes("saveRemoteCustomFontMetadata(nextFont)") &&
    useFontsSource.includes("saveRemoteCustomFontCharacter(nextFont.id, characterKey, nextFont.characters[characterKey], {") &&
    useFontsSource.includes("function mergeSavedFontSnapshot") &&
    useFontsSource.includes("key === changedCharacterKey") &&
    useFontsSource.includes("hasFilledStitches(character) && !hasFilledStitches(mergedCharacters[key])") &&
    useFontsSource.includes("saveFontCharacter: saveEditableFontCharacter"),
  "FONT-PERSISTENCE-007: UUID custom font character saves should save metadata first, write only the active character row, and preserve other filled character rows in app state."
);

assert.ok(
  fontPersistenceSource.includes("export async function saveRemoteCustomFontMetadata") &&
    fontPersistenceSource.includes("Timed out saving font") &&
    fontPersistenceSource.includes("Timed out saving character") &&
    fontPersistenceSource.includes("Timed out clearing character"),
  "FONT-PERSISTENCE-008: Character save persistence should ensure metadata exists and time out stalled Supabase writes."
);

assert.ok(
  useFontsSource.includes('if (persistence.mode === "remote") {\n      return savedFonts;\n    }') &&
    !useFontsSource.includes('Promise.allSettled(localFonts.map((font) => saveRemoteFont(font)))') &&
    useFontsSource.includes('setDeletedFontIds([]);'),
  "FONT-PERSISTENCE-009: Remote font refresh must treat Supabase as the source of truth and must not upload stale browser-local fonts over database characters."
);

assert.ok(
  fontPersistenceSource.includes("const filledRows = validRows.filter(isFilledRemoteCharacterRow)") &&
    fontPersistenceSource.includes("const candidates = filledRows.length ? filledRows : validRows") &&
    fontPersistenceSource.includes("if (!chosenRow || !isStringGrid(chosenRow.grid) || !isFilledRemoteCharacterRow(chosenRow)) continue;"),
  "FONT-PERSISTENCE-010: Remote custom font loading should ignore stale blank character rows and rebuild uncreated characters from font defaults."
);

assert.ok(
  fontPersistenceSource.includes("async function loadRemoteCustomFontCharacterRows") &&
    fontPersistenceSource.includes("const pageSize = 1000") &&
    fontPersistenceSource.includes(".range(from, from + pageSize - 1)") &&
    fontPersistenceSource.includes("if (pageRows.length < pageSize) break") &&
    !fontPersistenceSource.includes('.select("id, font_id, character_key, width, height, grid, created_at, updated_at")\n    .in("font_id", ids);'),
  "FONT-PERSISTENCE-010B: Remote custom font loading and diagnostics should page through all custom_font_characters rows instead of stopping at Supabase's first 1,000 rows."
);

assert.ok(
  fontPersistenceSource.includes('export async function saveRemoteCustomFontCharacter') &&
    fontPersistenceSource.includes('.delete()') &&
    fontPersistenceSource.includes('.eq("character_key", characterKey)') &&
    !fontPersistenceSource.includes('blankCharacterKeys'),
  "FONT-PERSISTENCE-011: Clearing a custom character may delete only the active character row; broad whole-font saves must not delete blank character keys."
);

assert.ok(
  fontPersistenceSource.includes('function characterMatchesSavedRow') &&
    fontPersistenceSource.includes('logFontSaveDebug("character-save-attempt"') &&
    fontPersistenceSource.includes('logFontSaveDebug("character-upsert-response"') &&
    fontPersistenceSource.includes('Timed out verifying saved character') &&
    fontPersistenceSource.includes('Character "${characterKey}" was not saved correctly in the database.') &&
    fontPersistenceSource.includes('Timed out verifying cleared character') &&
    fontPersistenceSource.includes('Character "${characterKey}" was not cleared in the database.'),
  "FONT-PERSISTENCE-012: Custom character saves and clears should verify database read-back before reporting success."
);

const decoRemoteFont = {
  id: "e6c0d5ff-368b-41df-9471-beb8b15c84af",
  owner_id: null,
  base_default_font_id: null,
  base_custom_font_id: null,
  name: "Deco",
  description: "Regression test Deco font",
  category: "Decorative",
  default_height: 20,
  default_width: 14,
  recommended_use: "Testing",
  licence: "Original",
  created_at: "2026-07-20T00:00:00.000Z",
  updated_at: "2026-07-23T03:16:23.108Z"
};

function rowFor(characterKey: string, grid: string[], updatedAt: string, id = `${characterKey}-row`) {
  return {
    id,
    font_id: decoRemoteFont.id,
    character_key: characterKey,
    width: grid[0]?.length ?? 1,
    height: grid.length,
    grid,
    created_at: "2026-07-20T00:00:00.000Z",
    updated_at: updatedAt
  };
}

function blankGrid(width: number, height: number) {
  return Array.from({ length: height }, () => "0".repeat(width));
}

function filledGrid(width: number, height: number) {
  const rows = blankGrid(width, height);
  rows[0] = "1".repeat(width);
  return rows;
}

const decoG = rowFor("G", filledGrid(14, 20), "2026-07-23T03:16:23.108Z", "deco-g-filled");
const hydratedDeco = hydrateRemoteCustomFont(decoRemoteFont, [decoG]);

assert.equal(hydratedDeco.errors.length, 0, "HYDRATION-001: Deco fixture should hydrate without validation errors.");
assert.equal(
  hydratedDeco.font?.characters.G.grid[0],
  "11111111111111",
  "HYDRATION-002: Saved filled Deco G from custom_font_characters should appear in the hydrated app font model."
);
assert.equal(
  hydratedDeco.diagnostic.markedNotCreatedDespiteFilledSupabase.length,
  0,
  "HYDRATION-003: A filled Supabase character row must not be reported as Not Created after hydration."
);

const blankNewerG = rowFor("G", blankGrid(14, 20), "2026-07-24T00:00:00.000Z", "deco-g-blank-newer");
const filledOlderG = rowFor("G", filledGrid(14, 20), "2026-07-23T00:00:00.000Z", "deco-g-filled-older");
const duplicateDeco = hydrateRemoteCustomFont(decoRemoteFont, [blankNewerG, filledOlderG]);

assert.equal(
  duplicateDeco.font?.characters.G.grid[0],
  "11111111111111",
  "HYDRATION-004: A stale blank duplicate row must not hide a filled saved character row for the same key."
);
assert.deepEqual(
  duplicateDeco.diagnostic.duplicateCharacterRows.map((item) => [item.characterKey, item.count]),
  [["G", 2]],
  "HYDRATION-005: Duplicate character rows should be reported by character key."
);

const oldHeightSavedG = {
  ...rowFor("G", filledGrid(14, 7), "2026-07-23T00:00:00.000Z", "deco-g-old-height"),
  height: 7
};
const heightNormalisedDeco = hydrateRemoteCustomFont(decoRemoteFont, [oldHeightSavedG]);

assert.equal(
  heightNormalisedDeco.font?.characters.G.height,
  20,
  "HYDRATION-006: Saved character rows from an older font height should load at the current font-level height."
);
assert.equal(
  heightNormalisedDeco.font?.characters.G.grid[0],
  "11111111111111",
  "HYDRATION-007: Resizing old-height saved rows must preserve existing stitches."
);

const newestFilledGrid = filledGrid(14, 20);
newestFilledGrid[1] = "00000000000001";
const newestFilledG = rowFor("G", newestFilledGrid, "2026-07-25T00:00:00.000Z", "deco-g-newest-filled");
const deterministicDeco = hydrateRemoteCustomFont(decoRemoteFont, [filledOlderG, newestFilledG]);

assert.equal(
  deterministicDeco.font?.characters.G.grid[1],
  "00000000000001",
  "HYDRATION-008: When multiple filled rows exist, hydration should choose the most recently updated row."
);

const symbolsDeco = hydrateRemoteCustomFont(decoRemoteFont, [
  rowFor("7", filledGrid(14, 20), "2026-07-23T00:00:00.000Z", "deco-7"),
  rowFor("@", filledGrid(14, 20), "2026-07-23T00:00:00.000Z", "deco-at")
]);

assert.equal(symbolsDeco.font?.characters["7"].grid[0], "11111111111111", "HYDRATION-009: Number character keys must be preserved.");
assert.equal(symbolsDeco.font?.characters["@"].grid[0], "11111111111111", "HYDRATION-010: Symbol character keys must be preserved.");

const secondFont = {
  ...decoRemoteFont,
  id: "c4c1b5e6-0a23-4c27-98d5-a2bfcb971111",
  name: "Second Font"
};
const hydratedSecond = hydrateRemoteCustomFont(secondFont, [rowFor("A", filledGrid(14, 20), "2026-07-23T00:00:00.000Z", "second-a")]);

assert.equal(hydratedDeco.font?.characters.A.grid[0], "00000000000000", "HYDRATION-011: Hydrating another font must not mutate Deco starter characters.");
assert.equal(hydratedSecond.font?.characters.A.grid[0], "11111111111111", "HYDRATION-012: Multiple custom fonts should hydrate independently.");

const invalidShape = hydrateRemoteCustomFont(decoRemoteFont, [
  {
    ...rowFor("Z", ["10", "1"], "2026-07-23T00:00:00.000Z", "bad-z"),
    width: 2,
    height: 2
  }
]);

assert.equal(
  invalidShape.font?.characters.Z.grid[0],
  "00000000000000",
  "HYDRATION-013: Invalid saved rows must not overwrite the starter grid."
);
assert.equal(
  invalidShape.diagnostic.invalidGridRows.length,
  1,
  "HYDRATION-014: Invalid grid rows should be visible in the hydration diagnostic."
);
