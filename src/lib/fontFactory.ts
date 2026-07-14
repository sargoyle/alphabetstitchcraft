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

export function createBlankFont(name: string, options: { category?: FontCategory; height?: number; width?: number } = {}): StitchFont {
  const now = new Date().toISOString();
  const defaultHeight = options.height ?? 10;
  const defaultWidth = options.width ?? defaultHeight;
  return {
    id: crypto.randomUUID(),
    name,
    description: "A blank editable alphabet ready for drawing on the character grid.",
    category: options.category ?? ("Block" as FontCategory),
    defaultHeight,
    defaultWidth,
    recommendedUse: "Custom lettering alphabets, experiments and personal stitch styles",
    licence: "User-created public font",
    isCustom: true,
    createdAt: now,
    updatedAt: now,
    characters: Object.fromEntries(blankFontCharacterKeys.map((key) => [key, createBlankCharacter(defaultWidth, defaultHeight)]))
  };
}
