import assert from "node:assert/strict";
import { createBlankFont } from "../src/lib/fontFactory";
import { getRemoteFontSaveTarget, hasSharedFontNameConflict } from "../src/lib/fontPersistence";
import type { StitchFont } from "../src/lib/fontTypes";

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

console.log("fontPersistence tests passed.");
