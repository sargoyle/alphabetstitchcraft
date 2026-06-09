import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { StitchFont } from "../src/lib/fontTypes";
import { renderTextToGrid } from "../src/lib/renderTextToGrid";

const fonts = fontsData as StitchFont[];
const blockFont = fonts.find((font) => font.id === "block-needle-5x7");

assert.ok(blockFont, "Block Needle test font should exist.");

function assertGridShape(grid: string[], width: number, height: number) {
  assert.equal(grid.length, height);
  grid.forEach((row) => assert.equal(row.length, width));
}

const singleWord = renderTextToGrid("HELLO", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left"
});
assert.equal(singleWord.width, 29);
assert.equal(singleWord.height, 7);
assertGridShape(singleWord.grid, 29, 7);

const withSpace = renderTextToGrid("H I", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left"
});
assert.equal(withSpace.width, 13);
assert.equal(withSpace.height, 7);
assertGridShape(withSpace.grid, 13, 7);

const multiline = renderTextToGrid("HI\nHELLO", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left"
});
assert.equal(multiline.width, 29);
assert.equal(multiline.height, 16);
assertGridShape(multiline.grid, 29, 16);
assert.deepEqual(multiline.grid.slice(7, 9), ["0".repeat(29), "0".repeat(29)]);

const centered = renderTextToGrid("HI\nHELLO", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "center"
});
assert.equal(centered.width, 29);
assert.ok(centered.grid[0].startsWith("0".repeat(9)), "Short centered line should receive left padding.");
assertGridShape(centered.grid, 29, 16);

const rightAligned = renderTextToGrid("HI\nHELLO", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "right"
});
assert.equal(rightAligned.width, 29);
assert.ok(rightAligned.grid[0].startsWith("0".repeat(18)), "Short right-aligned line should receive left padding.");
assertGridShape(rightAligned.grid, 29, 16);

const unsupported = renderTextToGrid("A~", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left"
});
assert.deepEqual(unsupported.unsupportedCharacters, [{ character: "~", count: 1 }]);
assert.equal(unsupported.width, 13);
assertGridShape(unsupported.grid, 13, 7);

const empty = renderTextToGrid("", blockFont, {
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left"
});
assert.equal(empty.width, 0);
assert.equal(empty.height, 0);
assert.deepEqual(empty.grid, []);
assert.deepEqual(empty.unsupportedCharacters, []);

console.log("renderTextToGrid tests passed.");
