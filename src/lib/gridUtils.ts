import type { StitchCharacter, StitchFont, ValidationResult } from "./fontTypes";

export function validateCharacter(character: StitchCharacter, label = "character"): ValidationResult {
  const errors: string[] = [];

  if (!Number.isInteger(character.width) || character.width <= 0) {
    errors.push(`${label} width must be a positive integer.`);
  }

  if (!Number.isInteger(character.height) || character.height <= 0) {
    errors.push(`${label} height must be a positive integer.`);
  }

  if (!Array.isArray(character.grid) || character.grid.length !== character.height) {
    errors.push(`${label} grid row count must equal height.`);
  }

  character.grid?.forEach((row, index) => {
    if (row.length !== character.width) {
      errors.push(`${label} row ${index + 1} width must equal ${character.width}.`);
    }
    if (!/^[01]+$/.test(row)) {
      errors.push(`${label} row ${index + 1} must only contain 0 or 1.`);
    }
  });

  return { valid: errors.length === 0, errors };
}

export function validateFont(font: StitchFont): ValidationResult {
  const errors: string[] = [];

  if (!font.id) errors.push("Font id is required.");
  if (!font.name) errors.push(`${font.id || "Font"} name is required.`);
  if (!font.characters || Object.keys(font.characters).length === 0) {
    errors.push(`${font.id || "Font"} must include characters.`);
  }

  for (const [key, character] of Object.entries(font.characters || {})) {
    const result = validateCharacter(character, `${font.id}:${key}`);
    errors.push(...result.errors);
    if (Number.isInteger(font.defaultHeight) && character.height !== font.defaultHeight) {
      errors.push(`${font.id}:${key} height must match font height ${font.defaultHeight}.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateUniqueFontIds(fonts: StitchFont[]): ValidationResult {
  const errors: string[] = [];
  const seen = new Set<string>();

  fonts.forEach((font) => {
    if (seen.has(font.id)) errors.push(`Duplicate font id: ${font.id}`);
    seen.add(font.id);
  });

  return { valid: errors.length === 0, errors };
}

export function clearCharacter(character: StitchCharacter): StitchCharacter {
  return {
    ...character,
    grid: Array.from({ length: character.height }, () => "0".repeat(character.width))
  };
}

function clampGridDimension(value: number, fallback = 1) {
  const nextValue = Number.isFinite(value) ? value : fallback;
  return Math.max(1, Math.min(24, Math.round(nextValue)));
}

export function resizeCharacter(character: StitchCharacter, width: number, height: number): StitchCharacter {
  const safeWidth = clampGridDimension(width, character.width);
  const safeHeight = clampGridDimension(height, character.height);
  const grid = Array.from({ length: safeHeight }, (_, rowIndex) => {
    const existing = character.grid[rowIndex] ?? "";
    return existing.padEnd(safeWidth, "0").slice(0, safeWidth);
  });

  return { width: safeWidth, height: safeHeight, grid };
}

export function resizeFontCharactersHeight(font: StitchFont, height: number): StitchFont {
  const safeHeight = clampGridDimension(height, font.defaultHeight);
  return {
    ...font,
    defaultHeight: safeHeight,
    characters: Object.fromEntries(
      Object.entries(font.characters).map(([key, character]) => [
        key,
        resizeCharacter(character, character.width, safeHeight)
      ])
    )
  };
}

export function cloneFont(font: StitchFont): StitchFont {
  return JSON.parse(JSON.stringify(font)) as StitchFont;
}

export function setGridCell(character: StitchCharacter, row: number, column: number, filled: boolean): StitchCharacter {
  const grid = character.grid.map((line, rowIndex) => {
    if (rowIndex !== row) return line;
    const cells = line.split("");
    cells[column] = filled ? "1" : "0";
    return cells.join("");
  });

  return { ...character, grid };
}

export function toggleGridCell(character: StitchCharacter, row: number, column: number): StitchCharacter {
  return setGridCell(character, row, column, character.grid[row]?.[column] !== "1");
}
