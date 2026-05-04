import type { GeneratedPattern, StitchCharacter, StitchFont, TextRenderOptions } from "./fontTypes";

const DEFAULT_OPTIONS: TextRenderOptions = {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left",
  placeholderUnsupported: true
};

function blank(width: number): string {
  return "0".repeat(Math.max(0, width));
}

function placeholder(height: number): StitchCharacter {
  const safeHeight = Math.max(5, height);
  const width = Math.max(3, Math.min(7, height));
  const rows = Array.from({ length: safeHeight }, (_, index) => {
    if (index === 0 || index === safeHeight - 1) return "1".repeat(width);
    return `1${"0".repeat(width - 2)}1`;
  });
  return { width, height: safeHeight, grid: rows };
}

function appendCharacter(rows: string[], character: StitchCharacter, lineHeight: number): string[] {
  return rows.map((row, index) => row + (character.grid[index] ?? blank(character.width)));
}

function appendBlank(rows: string[], width: number): string[] {
  if (width <= 0) return rows;
  return rows.map((row) => row + blank(width));
}

function renderLine(line: string, font: StitchFont, options: TextRenderOptions, unsupported: Set<string>) {
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

    const character = font.characters[char] ?? font.characters[char.toUpperCase()];
    const rendered = character ?? placeholder(lineHeight);

    if (!character) unsupported.add(char);
    rows = appendCharacter(rows, rendered, lineHeight);
    renderedAny = true;

    const next = chars[index + 1];
    if (next && next !== " ") rows = appendBlank(rows, options.letterSpacing);
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
  const unsupported = new Set<string>();
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
    unsupportedCharacters: Array.from(unsupported)
  };
}

