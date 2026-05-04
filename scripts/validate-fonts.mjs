import fs from "node:fs";

const fonts = JSON.parse(fs.readFileSync("src/data/fonts.json", "utf8"));
const errors = [];
const ids = new Set();

for (const font of fonts) {
  if (ids.has(font.id)) errors.push(`Duplicate font id: ${font.id}`);
  ids.add(font.id);

  for (const [key, character] of Object.entries(font.characters)) {
    if (character.grid.length !== character.height) {
      errors.push(`${font.id}:${key} height mismatch`);
    }
    for (const [index, row] of character.grid.entries()) {
      if (row.length !== character.width) errors.push(`${font.id}:${key} row ${index + 1} width mismatch`);
      if (!/^[01]+$/.test(row)) errors.push(`${font.id}:${key} row ${index + 1} contains invalid cells`);
    }
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(`Validated ${fonts.length} fonts.`);
