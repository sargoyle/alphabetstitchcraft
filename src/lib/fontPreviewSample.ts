import type { StitchFont } from "./fontTypes";

const UPPERCASE_SAMPLE = "ABCDEFGHI";
const LOWERCASE_SAMPLE = "abc";
const NUMBER_SAMPLE = "123";

function characterHasStitches(font: StitchFont, character: string) {
  return Boolean(font.characters[character]?.grid.some((row) => row.includes("1")));
}

function allCharactersAvailable(font: StitchFont, text: string) {
  return Array.from(text).every((character) => character === " " || characterHasStitches(font, character));
}

export function buildFontPreviewSample(font: StitchFont) {
  const parts = [UPPERCASE_SAMPLE];

  if (allCharactersAvailable(font, LOWERCASE_SAMPLE)) {
    parts.push(LOWERCASE_SAMPLE);
  }

  if (allCharactersAvailable(font, NUMBER_SAMPLE)) {
    parts.push(NUMBER_SAMPLE);
  }

  const supportedSample = parts.join(" ");
  const filteredSample = Array.from(supportedSample)
    .filter((character) => character === " " || characterHasStitches(font, character))
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  return filteredSample || "ABC";
}
