import fontsData from "@/data/fonts.json";
import type { StitchFont } from "./fontTypes";
import { validateFont, validateUniqueFontIds } from "./gridUtils";

export const defaultFonts = fontsData as StitchFont[];

export function getAllValidationErrors(fonts: StitchFont[] = defaultFonts): string[] {
  const errors = fonts.flatMap((font) => validateFont(font).errors);
  errors.push(...validateUniqueFontIds(fonts).errors);
  return errors;
}

export function findFont(fonts: StitchFont[], id?: string | null): StitchFont | undefined {
  if (!id) return fonts[0];
  return fonts.find((font) => font.id === id) ?? fonts[0];
}

export function getCharacterGroups(font: StitchFont) {
  const keys = Object.keys(font.characters);
  return {
    Uppercase: keys.filter((key) => /^[A-Z]$/.test(key)).sort(),
    Lowercase: keys.filter((key) => /^[a-z]$/.test(key)).sort(),
    Numbers: keys.filter((key) => /^[0-9]$/.test(key)).sort(),
    Punctuation: keys.filter((key) => !/^[A-Za-z0-9]$/.test(key)).sort()
  };
}

