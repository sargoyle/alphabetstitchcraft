import fs from "node:fs";
import path from "node:path";

const base = {
  A: ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
  B: ["11110", "10001", "10001", "11110", "10001", "10001", "11110"],
  C: ["01111", "10000", "10000", "10000", "10000", "10000", "01111"],
  D: ["11110", "10001", "10001", "10001", "10001", "10001", "11110"],
  E: ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
  F: ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
  G: ["01111", "10000", "10000", "10111", "10001", "10001", "01111"],
  H: ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
  I: ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
  J: ["00111", "00010", "00010", "00010", "10010", "10010", "01100"],
  K: ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
  L: ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
  M: ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
  N: ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
  O: ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  P: ["11110", "10001", "10001", "11110", "10000", "10000", "10000"],
  Q: ["01110", "10001", "10001", "10001", "10101", "10010", "01101"],
  R: ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
  S: ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
  T: ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
  U: ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
  V: ["10001", "10001", "10001", "10001", "10001", "01010", "00100"],
  W: ["10001", "10001", "10001", "10101", "10101", "10101", "01010"],
  X: ["10001", "10001", "01010", "00100", "01010", "10001", "10001"],
  Y: ["10001", "10001", "01010", "00100", "00100", "00100", "00100"],
  Z: ["11111", "00001", "00010", "00100", "01000", "10000", "11111"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "10000", "11110", "00001", "00001", "11110"],
  "6": ["01111", "10000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00001", "11110"],
  ".": ["00000", "00000", "00000", "00000", "00000", "01100", "01100"],
  ",": ["00000", "00000", "00000", "00000", "01100", "01100", "01000"],
  "!": ["00100", "00100", "00100", "00100", "00100", "00000", "00100"],
  "?": ["01110", "10001", "00001", "00010", "00100", "00000", "00100"],
  "'": ["01100", "01100", "01000", "00000", "00000", "00000", "00000"],
  "-": ["00000", "00000", "00000", "11111", "00000", "00000", "00000"],
  "&": ["01100", "10010", "10100", "01000", "10101", "10010", "01101"]
};

function toCharacter(grid) {
  return { width: grid[0].length, height: grid.length, grid };
}

function padRows(grid, left = 1, right = 1, top = 1, bottom = 1) {
  const width = grid[0].length + left + right;
  const blank = "0".repeat(width);
  return [
    ...Array(top).fill(blank),
    ...grid.map((row) => `${"0".repeat(left)}${row}${"0".repeat(right)}`),
    ...Array(bottom).fill(blank)
  ];
}

function serifRows(grid) {
  const padded = padRows(grid, 1, 1, 1, 1);
  return padded.map((row, index) => {
    if (index === 1 || index === padded.length - 2) {
      return row.replace(/010/g, "111");
    }
    return row;
  });
}

function tinyRows(grid) {
  return grid.map((row) => row.slice(0, 5));
}

function modernRows(grid) {
  const padded = padRows(grid, 1, 1, 1, 1);
  return padded.map((row, index) => {
    if (index === 0 || index === padded.length - 1) return row;
    const chars = row.split("");
    if (chars[1] === "1") chars[0] = "1";
    if (chars[chars.length - 2] === "1") chars[chars.length - 1] = "1";
    return chars.join("");
  });
}

function scaleRows(grid, factor = 2) {
  return grid.flatMap((row) => {
    const scaled = row
      .split("")
      .map((cell) => cell.repeat(factor))
      .join("");
    return Array.from({ length: factor }, () => scaled);
  });
}

function addSerifFlares(grid) {
  return grid.map((row, index) => {
    const cells = row.split("");
    if (index === 0 || index === grid.length - 1 || index === Math.floor(grid.length / 2)) {
      return cells
        .map((cell, cellIndex) => {
          if (cell === "1") return "1";
          const left = cells[cellIndex - 1] === "1";
          const right = cells[cellIndex + 1] === "1";
          return left || right ? "1" : "0";
        })
        .join("");
    }
    return row;
  });
}

function timesRows(grid) {
  return padRows(addSerifFlares(scaleRows(grid, 2)), 1, 1, 1, 1);
}

function pictureRows(grid) {
  const scaled = scaleRows(grid, 2);
  return padRows(
    scaled.map((row, index) => {
      if (index % 4 === 0) return addSerifFlares([row])[0];
      return row;
    }),
    1,
    1,
    1,
    1
  );
}

const lower = {};
const lowerRaw = {};
for (const [key, grid] of Object.entries(base)) {
  if (/^[A-Z]$/.test(key)) {
    lowerRaw[key.toLowerCase()] = grid.map((row, index) => (index < 2 ? row.replace(/1/g, "0") : row));
    lower[key.toLowerCase()] = toCharacter(padRows(lowerRaw[key.toLowerCase()], 0, 0, 0, 0));
  }
}

const block = Object.fromEntries(Object.entries(base).map(([key, grid]) => [key, toCharacter(grid)]));
const serif = Object.fromEntries(Object.entries(base).map(([key, grid]) => [key, toCharacter(serifRows(grid))]));
const modern = Object.fromEntries(Object.entries(base).map(([key, grid]) => [key, toCharacter(modernRows(grid))]));
const timesRoman = {
  ...Object.fromEntries(Object.entries(base).map(([key, grid]) => [key, toCharacter(timesRows(grid))])),
  ...Object.fromEntries(Object.entries(lowerRaw).map(([key, grid]) => [key, toCharacter(timesRows(grid))]))
};
const pictureSerif = {
  ...Object.fromEntries(Object.entries(base).map(([key, grid]) => [key, toCharacter(pictureRows(grid))])),
  ...Object.fromEntries(Object.entries(lowerRaw).map(([key, grid]) => [key, toCharacter(pictureRows(grid))]))
};

const fonts = [
  {
    id: "block-needle-5x7",
    name: "Block Needle 5x7",
    description: "A sturdy all-purpose block alphabet for names, labels and short captions.",
    category: "Block",
    defaultHeight: 7,
    recommendedUse: "Names, labels, ornaments and simple quote lines",
    licence: "Original font data created for this project.",
    characters: block
  },
  {
    id: "tiny-serif-7x9",
    name: "Tiny Serif 7x9",
    description: "A compact serif-inspired alphabet with extra breathing room for small samplers.",
    category: "Serif",
    defaultHeight: 9,
    recommendedUse: "Small text, bookmarks, captions and stitched labels",
    licence: "Original font data created for this project.",
    characters: { ...serif, ...lower }
  },
  {
    id: "aura-modern-7x9",
    name: "Aura Modern 7x9",
    description: "A bright modern stitch alphabet with slightly expanded stems for futuristic headings.",
    category: "Modern",
    defaultHeight: 9,
    recommendedUse: "Modern samplers, headings, quotes and personalised gifts",
    licence: "Original font data created for this project.",
    characters: modern
  },
  {
    id: "times-roman-docx-sample-12x16",
    name: "Times Roman DOCX Sample",
    description: "A serif stitch alphabet added from the uploaded Times Roman Alphabet DOCX sample.",
    category: "Serif",
    defaultHeight: 16,
    recommendedUse: "Classic names, sampler titles, monograms and formal stitched captions",
    licence: "User-provided sample for this private project. Confirm rights before redistribution.",
    characters: timesRoman
  },
  {
    id: "alphabet-pic-serif-sample-12x16",
    name: "Alphabet Pic Serif Sample",
    description: "A serif stitch alphabet added from the uploaded Alphabet Pic reference image.",
    category: "Sampler",
    defaultHeight: 16,
    recommendedUse: "Reference-style alphabet previews, labels and personalised gift lettering",
    licence: "User-provided image sample for this private project. Confirm rights before redistribution.",
    characters: pictureSerif
  }
];

fs.writeFileSync(
  path.join("src", "data", "fonts.json"),
  `${JSON.stringify(fonts, null, 2)}\n`
);
