import { defaultEditableCharacterKeys } from "./characterSets";
import type { FontCategory, StitchCharacter, StitchFont } from "./fontTypes";

export const blankFontCharacterKeys = defaultEditableCharacterKeys;

export function createBlankCharacter(width = 8, height = 10): StitchCharacter {
  return {
    width,
    height,
    grid: Array.from({ length: height }, () => "0".repeat(width))
  };
}

export function createBlankFont(name: string): StitchFont {
  const now = new Date().toISOString();
  return {
    id: crypto.randomUUID(),
    name,
    description: "A blank editable alphabet ready for drawing on the character grid.",
    category: "Block" as FontCategory,
    defaultHeight: 10,
    recommendedUse: "Custom lettering alphabets, experiments and personal stitch styles",
    licence: "User-created public font",
    isCustom: true,
    createdAt: now,
    updatedAt: now,
    characters: Object.fromEntries(blankFontCharacterKeys.map((key) => [key, createBlankCharacter()]))
  };
}
