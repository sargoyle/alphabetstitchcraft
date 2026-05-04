import type { GeneratedPattern, StitchFont } from "./fontTypes";

function downloadJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function safeFilename(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "stitch-font";
}

export function patternToCanvas(pattern: GeneratedPattern, options = { cellSize: 18, showGrid: true }) {
  const cellSize = options.cellSize;
  const margin = cellSize;
  const canvas = document.createElement("canvas");
  canvas.width = pattern.width * cellSize + margin * 2;
  canvas.height = pattern.height * cellSize + margin * 2;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");

  ctx.fillStyle = "#f8f3ea";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  pattern.grid.forEach((row, rowIndex) => {
    Array.from(row).forEach((cell, columnIndex) => {
      const x = margin + columnIndex * cellSize;
      const y = margin + rowIndex * cellSize;
      if (cell === "1") {
        ctx.fillStyle = "#08231d";
        ctx.fillRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
      }
      if (options.showGrid) {
        ctx.strokeStyle = "#d6cdbc";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, cellSize, cellSize);
      }
    });
  });

  return canvas;
}

export function exportPatternPng(pattern: GeneratedPattern, filename = "stitch-lettering-pattern.png") {
  const canvas = patternToCanvas(pattern);
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = filename;
  link.click();
}

export function exportPatternJson(pattern: GeneratedPattern, filename = "stitch-lettering-pattern.json") {
  downloadJson(pattern, filename);
}

export function exportFontJson(font: StitchFont) {
  downloadJson(font, `${safeFilename(font.name)}.font.json`);
}

export async function copyDesignSize(pattern: GeneratedPattern) {
  await navigator.clipboard.writeText(`Width: ${pattern.width} stitches, Height: ${pattern.height} stitches`);
}
