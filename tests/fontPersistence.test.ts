import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createBlankFont } from "../src/lib/fontFactory";
import {
  getFontIdKind,
  getRemoteFontDeleteTarget,
  getRemoteFontSaveTarget,
  hasSharedFontNameConflict
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
    useFontsSource.includes("saveRemoteCustomFontCharacter(nextFont.id, characterKey, nextFont.characters[characterKey])") &&
    useFontsSource.includes("saveFontCharacter: saveEditableFontCharacter"),
  "FONT-PERSISTENCE-007: UUID custom font character saves should save font metadata first, then write only the active character row."
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
  fontPersistenceSource.includes('if (!hasFilledStitches(loadedCharacter)) {\n      return acc;\n    }'),
  "FONT-PERSISTENCE-010: Remote custom font loading should ignore stale blank character rows and rebuild uncreated characters from font defaults."
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
    fontPersistenceSource.includes('Timed out verifying saved character') &&
    fontPersistenceSource.includes('Character "${characterKey}" was not saved correctly in the database.') &&
    fontPersistenceSource.includes('Timed out verifying cleared character') &&
    fontPersistenceSource.includes('Character "${characterKey}" was not cleared in the database.'),
  "FONT-PERSISTENCE-012: Custom character saves and clears should verify database read-back before reporting success."
);
