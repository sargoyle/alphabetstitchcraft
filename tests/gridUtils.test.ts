import assert from "node:assert/strict";
import type { StitchCharacter } from "../src/lib/fontTypes";
import {
  clearCharacter,
  resizeCharacter,
  setGridCell,
  toggleGridCell,
  validateCharacter,
  validateFont,
  validateUniqueFontIds
} from "../src/lib/gridUtils";

const character: StitchCharacter = {
  width: 3,
  height: 2,
  grid: ["101", "010"]
};

assert.deepEqual(validateCharacter(character), { valid: true, errors: [] });

const badWidth = validateCharacter({ width: 3, height: 2, grid: ["101", "01"] }, "bad");
assert.equal(badWidth.valid, false);
assert.ok(badWidth.errors.some((error) => error.includes("row 2 width")));

const badCells = validateCharacter({ width: 3, height: 1, grid: ["10x"] }, "bad");
assert.equal(badCells.valid, false);
assert.ok(badCells.errors.some((error) => error.includes("must only contain 0 or 1")));

assert.deepEqual(clearCharacter(character).grid, ["000", "000"]);

const resized = resizeCharacter(character, 5, 3);
assert.equal(resized.width, 5);
assert.equal(resized.height, 3);
assert.deepEqual(resized.grid, ["10100", "01000", "00000"]);

const clamped = resizeCharacter(character, 99, -10);
assert.equal(clamped.width, 60);
assert.equal(clamped.height, 1);

assert.deepEqual(setGridCell(character, 0, 1, true).grid, ["111", "010"]);
assert.deepEqual(setGridCell(character, 1, 1, false).grid, ["101", "000"]);
assert.deepEqual(toggleGridCell(character, 0, 1).grid, ["111", "010"]);
assert.deepEqual(toggleGridCell(character, 0, 0).grid, ["001", "010"]);

const validFont = {
  id: "test-font",
  name: "Test Font",
  description: "Test",
  category: "Block" as const,
  defaultHeight: 2,
  recommendedUse: "Tests",
  licence: "Test",
  characters: { A: character }
};

assert.equal(validateFont(validFont).valid, true);
assert.equal(validateFont({ ...validFont, characters: {} }).valid, false);
assert.equal(validateUniqueFontIds([validFont, { ...validFont, id: "other-font" }]).valid, true);
assert.equal(validateUniqueFontIds([validFont, { ...validFont }]).valid, false);

console.log("gridUtils tests passed.");
