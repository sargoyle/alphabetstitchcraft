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
  fontPersistenceSource.includes("const { data: existingFont, error: findError } = await defaultFontsTable") &&
    fontPersistenceSource.includes("if (findError) throw findError;") &&
    fontPersistenceSource.includes("if (!existingFont) throw new Error") &&
    fontPersistenceSource.includes('.update({ is_public: false })'),
  "Default/shared font deletes should pre-check the public row, archive it, and avoid post-archive select visibility issues."
);
console.log("fontPersistence tests passed.");
