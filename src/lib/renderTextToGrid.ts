import type { GeneratedPattern, StitchCharacter, StitchFont, TextRenderOptions } from "./fontTypes";

const DEFAULT_OPTIONS: TextRenderOptions = {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left"
};

const OPTION_BOUNDS = {
  letterSpacing: { min: 0, max: 8 },
  wordSpacing: { min: 1, max: 16 },
  lineSpacing: { min: 0, max: 12 }
} as const;

const LARGE_PATTERN_WARNING_WIDTH = 1000;
const LARGE_PATTERN_WARNING_HEIGHT = 250;

function blank(width: number): string {
  return "0".repeat(Math.max(0, width));
}

function validateSpacingOption(name: keyof typeof OPTION_BOUNDS, value: number) {
  const bounds = OPTION_BOUNDS[name];
  if (!Number.isFinite(value) || !Number.isInteger(value) || value < bounds.min || value > bounds.max) {
    throw new RangeError(`${name} must be an integer from ${bounds.min} to ${bounds.max}.`);
  }
}

function validateOptions(options: TextRenderOptions) {
  validateSpacingOption("letterSpacing", options.letterSpacing);
  validateSpacingOption("wordSpacing", options.wordSpacing);
  validateSpacingOption("lineSpacing", options.lineSpacing);
}

function unsupportedCounts(unsupported: Map<string, number>) {
  return Array.from(unsupported.entries()).map(([character, count]) => ({ character, count }));
}

function hasStitches(character: StitchCharacter | undefined) {
  return Boolean(character?.grid.some((row) => row.includes("1")));
}

function resolveRenderableCharacter(char: string, font: StitchFont) {
  const exact = font.characters[char];
  if (hasStitches(exact)) return exact;

  const fallback = char.toUpperCase();
  if (fallback !== char) {
    const uppercase = font.characters[fallback];
    if (hasStitches(uppercase)) return uppercase;
  }

  return undefined;
}

function appendCharacter(rows: string[], character: StitchCharacter): string[] {
  return rows.map((row, index) => row + (character.grid[index] ?? blank(character.width)));
}

function appendBlank(rows: string[], width: number): string[] {
  if (width <= 0) return rows;
  return rows.map((row) => row + blank(width));
}

function renderLine(line: string, font: StitchFont, options: TextRenderOptions, unsupported: Map<string, number>) {
  const chars = Array.from(line);
  const lineHeight = Math.max(font.defaultHeight, ...Object.values(font.characters).map((char) => char.height));
  let rows = Array.from({ length: lineHeight }, () => "");
  let renderedAny = false;

  chars.forEach((char, index) => {
    if (char === " ") {
      rows = appendBlank(rows, options.wordSpacing);
      renderedAny = true;
      return;
    }

    const character = resolveRenderableCharacter(char, font);

    if (!character) {
      unsupported.set(char, (unsupported.get(char) ?? 0) + 1);
      return;
    }

    rows = appendCharacter(rows, character);
    renderedAny = true;

    const hasRenderableNext = chars.slice(index + 1).some(
      (nextChar) => nextChar === " " || Boolean(resolveRenderableCharacter(nextChar, font))
    );
    const next = chars[index + 1];
    if (hasRenderableNext && next && next !== " ") rows = appendBlank(rows, options.letterSpacing);
  });

  if (!renderedAny) rows = Array.from({ length: lineHeight }, () => "");
  const width = rows.reduce((max, row) => Math.max(max, row.length), 0);
  return rows.map((row) => row.padEnd(width, "0"));
}

function alignLine(rows: string[], width: number, alignment: TextRenderOptions["alignment"]): string[] {
  const currentWidth = rows[0]?.length ?? 0;
  const remaining = Math.max(0, width - currentWidth);
  const left = alignment === "center" ? Math.floor(remaining / 2) : alignment === "right" ? remaining : 0;
  const right = remaining - left;
  return rows.map((row) => `${blank(left)}${row}${blank(right)}`);
}

export function renderTextToGrid(
  text: string,
  font: StitchFont,
  renderOptions: Partial<TextRenderOptions> = {}
): GeneratedPattern {
  const options = { ...DEFAULT_OPTIONS, ...renderOptions };
  validateOptions(options);

  if (text.trim().length === 0) {
    return {
      fontId: font.id,
      text,
      letterSpacing: options.letterSpacing,
      wordSpacing: options.wordSpacing,
      lineSpacing: options.lineSpacing,
      alignment: options.alignment,
      width: 0,
      height: 0,
      grid: [],
      unsupportedCharacters: [],
      warnings: []
    };
  }

  const unsupported = new Map<string, number>();
  const sourceLines = text.split(/\r?\n/);
  const renderedLines = sourceLines.map((line) => renderLine(line, font, options, unsupported));
  const width = renderedLines.reduce((max, rows) => Math.max(max, rows[0]?.length ?? 0), 0);
  const grid: string[] = [];

  renderedLines.forEach((rows, index) => {
    grid.push(...alignLine(rows, width, options.alignment));
    if (index < renderedLines.length - 1) {
      grid.push(...Array.from({ length: options.lineSpacing }, () => blank(width)));
    }
  });

  const warnings: string[] = [];
  if (width > LARGE_PATTERN_WARNING_WIDTH || grid.length > LARGE_PATTERN_WARNING_HEIGHT) {
    warnings.push(
      `Large pattern generated: ${width} x ${grid.length} stitches. Preview and export may be slower than usual.`
    );
  }

  return {
    fontId: font.id,
    text,
    letterSpacing: options.letterSpacing,
    wordSpacing: options.wordSpacing,
    lineSpacing: options.lineSpacing,
    alignment: options.alignment,
    width,
    height: grid.length,
    grid,
    unsupportedCharacters: unsupportedCounts(unsupported),
    warnings
  };
}
