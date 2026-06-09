import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { GeneratedPattern, StitchFont } from "../src/lib/fontTypes";
import { renderTextToGrid } from "../src/lib/renderTextToGrid";

const fonts = fontsData as StitchFont[];
const blockFont = fonts.find((font) => font.id === "block-needle-5x7");
assert.ok(blockFont, "Block Needle test font should exist.");

const options = {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left" as const
};

function assertRowWidthConsistency(pattern: GeneratedPattern, id: string) {
  pattern.grid.forEach((row, index) => {
    assert.equal(row.length, pattern.width, `${id}: row ${index + 1} should match generated width.`);
  });
}

function countFilledCells(rows: string[]) {
  return rows.join("").split("").filter((cell) => cell === "1").length;
}

// RENDER-001: confirmed requirement says whitespace-only text should be treated as empty.
const whitespaceOnly = renderTextToGrid("   ", blockFont, options);
assert.equal(whitespaceOnly.width, 0, "RENDER-001: whitespace-only text should have width 0.");
assert.equal(whitespaceOnly.height, 0, "RENDER-001: whitespace-only text should have height 0.");
assert.deepEqual(whitespaceOnly.grid, [], "RENDER-001: whitespace-only text should have an empty grid.");

const whitespaceLines = renderTextToGrid(" \n\t\r\n ", blockFont, options);
assert.equal(whitespaceLines.width, 0, "RENDER-001: whitespace-only lines should have width 0.");
assert.equal(whitespaceLines.height, 0, "RENDER-001: whitespace-only lines should have height 0.");
assert.deepEqual(whitespaceLines.grid, [], "RENDER-001: whitespace-only lines should have an empty grid.");

// UNSUPPORTED-001: mixed supported and unsupported input should render safely and report unsupported characters.
const mixedUnsupported = renderTextToGrid("A@A", blockFont, options);
assert.ok(mixedUnsupported.width > 0, "UNSUPPORTED-001: supported characters should still render.");
assert.ok(mixedUnsupported.grid.some((row) => row.includes("1")), "UNSUPPORTED-001: rendered grid should include stitches.");
assert.deepEqual(
  mixedUnsupported.unsupportedCharacters,
  [{ character: "@", count: 1 }],
  "UNSUPPORTED-001: unsupported character should be reported."
);
assertRowWidthConsistency(mixedUnsupported, "UNSUPPORTED-001");

// UNSUPPORTED-002: confirmed requirement says duplicate unsupported characters should be counted.
const repeatedUnsupported = renderTextToGrid("A@@#", blockFont, options);
assert.deepEqual(
  repeatedUnsupported.unsupportedCharacters,
  [
    { character: "@", count: 2 },
    { character: "#", count: 1 }
  ],
  "UNSUPPORTED-002: repeated unsupported characters should be counted."
);

// UNSUPPORTED-003: confirmed requirement says tabs are unsupported, not word spacing.
const tabUnsupported = renderTextToGrid("A\tA", blockFont, options);
assert.deepEqual(
  tabUnsupported.unsupportedCharacters,
  [{ character: "\t", count: 1 }],
  "UNSUPPORTED-003: tab should be reported as unsupported."
);
assertRowWidthConsistency(tabUnsupported, "UNSUPPORTED-003");

// SPACING-001: confirmed requirement says renderer should validate numeric bounds independently of the UI.
assert.throws(
  () => renderTextToGrid("AA", blockFont, { ...options, letterSpacing: -4 }),
  /letterSpacing must be an integer from 0 to 8/,
  "SPACING-001: negative letter spacing should be rejected."
);

// SPACING-002: very large spacing should be safely handled or documented.
assert.throws(
  () => renderTextToGrid("AA", blockFont, { ...options, letterSpacing: 1000 }),
  /letterSpacing must be an integer from 0 to 8/,
  "SPACING-002: very large letter spacing should be rejected."
);

assert.throws(
  () => renderTextToGrid("AA", blockFont, { ...options, wordSpacing: 0 }),
  /wordSpacing must be an integer from 1 to 16/,
  "SPACING-003: invalid word spacing should be rejected."
);

assert.throws(
  () => renderTextToGrid("AA", blockFont, { ...options, lineSpacing: Number.NaN }),
  /lineSpacing must be an integer from 0 to 12/,
  "SPACING-004: NaN line spacing should be rejected."
);

// RENDER-002: very long text should not produce inconsistent rows.
const veryLong = renderTextToGrid("A".repeat(300), blockFont, options);
assert.ok(veryLong.width > 0 && veryLong.height > 0, "RENDER-002: very long text should render a non-empty pattern.");
assertRowWidthConsistency(veryLong, "RENDER-002");
assert.ok(veryLong.warnings?.length, "RENDER-002: very long text should return a warning.");
assert.match(veryLong.warnings?.[0] ?? "", /Large pattern generated/, "RENDER-002: warning should explain the large pattern.");

// GRID-001: multiline output rows should all match generated width.
const multiline = renderTextToGrid("HI\nHELLO", blockFont, options);
assertRowWidthConsistency(multiline, "GRID-001");

// GRID-002: line spacing rows should match generated width and contain only blank cells.
const spacingRows = multiline.grid.slice(7, 9);
assert.deepEqual(spacingRows, ["0".repeat(multiline.width), "0".repeat(multiline.width)], "GRID-002");

// GRID-003: alignment should preserve stitched content count for the aligned line.
const standaloneA = renderTextToGrid("A", blockFont, options);
const rightAligned = renderTextToGrid("A\nAA", blockFont, { ...options, alignment: "right" });
assert.equal(
  countFilledCells(rightAligned.grid.slice(0, standaloneA.height)),
  countFilledCells(standaloneA.grid),
  "GRID-003: alignment should preserve stitched content for the shorter line."
);
assertRowWidthConsistency(rightAligned, "GRID-003");

console.log("renderVisibility tests passed.");
