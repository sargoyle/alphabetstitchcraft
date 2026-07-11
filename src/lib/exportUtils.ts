import type { GeneratedPattern, StitchFont } from "./fontTypes";

type PatternCanvasOptions = {
  cellSize?: number;
  showGrid?: boolean;
  showFilled?: boolean;
  showCenterGuide?: boolean;
};

type Rect = { x: number; y: number; width: number; height: number };

export type PatternPage = {
  pageNumber: number;
  totalPages: number;
  rowIndex: number;
  columnIndex: number;
  rowCount: number;
  columnCount: number;
  startRow: number;
  endRow: number;
  startColumn: number;
  endColumn: number;
  primaryStartRow: number;
  primaryEndRow: number;
  primaryStartColumn: number;
  primaryEndColumn: number;
  neighbours: {
    left: number | null;
    right: number | null;
    above: number | null;
    below: number | null;
  };
};

type PdfPlan = {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  footerHeight: number;
  headerHeight: number;
  cellSize: number;
  columnsPerPage: number;
  rowsPerPage: number;
  pages: PatternPage[];
};

const normalGrid = "#d6cdbc";
const groupedGrid = "#9f927f";
const centreGuide = "#2b9dff";
const overlapFill = "#e6e2db";
const stitchFill = "#08231d";
const paperFill = "#f8f3ea";

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

function hexToRgb(hex: string) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16) / 255,
    g: parseInt(value.slice(2, 4), 16) / 255,
    b: parseInt(value.slice(4, 6), 16) / 255
  };
}

function setCanvasStroke(ctx: CanvasRenderingContext2D, column: number, row: number, cellSize: number) {
  const isGrouped = column % 10 === 0 || row % 10 === 0;
  ctx.strokeStyle = isGrouped ? groupedGrid : normalGrid;
  ctx.lineWidth = isGrouped ? Math.max(1.5, cellSize * 0.09) : 1;
}

function drawPatternCellsToCanvas(
  ctx: CanvasRenderingContext2D,
  pattern: GeneratedPattern,
  options: Required<PatternCanvasOptions>,
  bounds: Rect,
  startColumn = 0,
  startRow = 0,
  endColumn = pattern.width,
  endRow = pattern.height,
  overlap?: { primaryStartColumn: number; primaryEndColumn: number; primaryStartRow: number; primaryEndRow: number }
) {
  const cellSize = options.cellSize;
  ctx.fillStyle = paperFill;
  ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);

  for (let row = startRow; row < endRow; row += 1) {
    const rowData = pattern.grid[row] ?? "";
    for (let column = startColumn; column < endColumn; column += 1) {
      const localX = bounds.x + (column - startColumn) * cellSize;
      const localY = bounds.y + (row - startRow) * cellSize;
      const isOverlap = overlap
        ? column < overlap.primaryStartColumn || row < overlap.primaryStartRow
        : false;

      if (isOverlap) {
        ctx.fillStyle = overlapFill;
        ctx.fillRect(localX, localY, cellSize, cellSize);
      }

      if (options.showFilled && rowData[column] === "1") {
        const inset = Math.max(1, Math.round(cellSize * 0.2));
        ctx.fillStyle = stitchFill;
        ctx.fillRect(localX + inset, localY + inset, cellSize - inset * 2, cellSize - inset * 2);
      }

      if (options.showGrid) {
        setCanvasStroke(ctx, column, row, cellSize);
        ctx.strokeRect(localX, localY, cellSize, cellSize);
      }
    }
  }

  if (options.showCenterGuide && pattern.width > 0 && pattern.height > 0) {
    const guideWidth = Math.max(2, Math.round(cellSize * 0.14));
    const centerColumnPosition = pattern.width / 2;
    const centerRowPosition = pattern.height / 2;
    ctx.fillStyle = centreGuide;

    if (centerColumnPosition >= startColumn && centerColumnPosition <= endColumn) {
      const x = bounds.x + (centerColumnPosition - startColumn) * cellSize - guideWidth / 2;
      ctx.fillRect(x, bounds.y, guideWidth, bounds.height);
    }

    if (centerRowPosition >= startRow && centerRowPosition <= endRow) {
      const y = bounds.y + (centerRowPosition - startRow) * cellSize - guideWidth / 2;
      ctx.fillRect(bounds.x, y, bounds.width, guideWidth);
    }
  }
}

export function patternToCanvas(
  pattern: GeneratedPattern,
  options: PatternCanvasOptions = { cellSize: 18, showGrid: true, showFilled: true }
) {
  const resolvedOptions = {
    cellSize: options.cellSize ?? 18,
    showGrid: options.showGrid ?? true,
    showFilled: options.showFilled ?? true,
    showCenterGuide: options.showCenterGuide ?? true
  };
  const cellSize = resolvedOptions.cellSize;
  const margin = cellSize;
  const headerHeight = pattern.width > 0 && pattern.height > 0 ? Math.max(24, cellSize * 2) : 0;
  const canvas = document.createElement("canvas");
  canvas.width = pattern.width * cellSize + margin * 2;
  canvas.height = pattern.height * cellSize + margin * 2 + headerHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is not available.");

  ctx.fillStyle = paperFill;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (pattern.width > 0 && pattern.height > 0) {
    ctx.fillStyle = stitchFill;
    ctx.font = `${Math.max(12, Math.round(cellSize * 0.8))}px sans-serif`;
    ctx.fillText(`${pattern.width} x ${pattern.height} Squares`, margin, margin + Math.max(12, Math.round(cellSize * 0.8)));
  }

  drawPatternCellsToCanvas(
    ctx,
    pattern,
    resolvedOptions,
    {
      x: margin,
      y: margin + headerHeight,
      width: pattern.width * cellSize,
      height: pattern.height * cellSize
    }
  );

  return canvas;
}

export function planPdfPages(pattern: GeneratedPattern, options: { cellSize?: number; overlap?: number } = {}): PdfPlan {
  const pageWidth = 841.89;
  const pageHeight = 595.28;
  const margin = 24;
  const footerHeight = 22;
  const headerHeight = 20;
  const overlap = options.overlap ?? 2;
  const availableWidth = pageWidth - margin * 2;
  const availableHeight = pageHeight - margin * 2 - footerHeight - headerHeight;
  const targetCellSize = options.cellSize ?? 10;
  const singlePageCellSize = pattern.width > 0 && pattern.height > 0
    ? Math.min(12, Math.floor(Math.min(availableWidth / pattern.width, availableHeight / pattern.height)))
    : targetCellSize;
  const cellSize = Math.max(6, Math.min(targetCellSize, singlePageCellSize || targetCellSize));
  const columnsPerPage = Math.max(1, Math.floor(availableWidth / cellSize));
  const rowsPerPage = Math.max(1, Math.floor(availableHeight / cellSize));
  const buildPrimaryRanges = (total: number, capacity: number) => {
    if (total === 0) return [{ start: 0, end: 0 }];
    const ranges: Array<{ start: number; end: number }> = [];
    let start = 0;

    while (start < total) {
      const hasPreviousPage = ranges.length > 0;
      const primaryCapacity = Math.max(1, capacity - (hasPreviousPage ? overlap : 0));
      const end = Math.min(total, start + primaryCapacity);
      ranges.push({ start, end });
      if (end >= total) break;
      start = end;
    }

    return ranges;
  };

  const columnRanges = buildPrimaryRanges(pattern.width, columnsPerPage);
  const rowRanges = buildPrimaryRanges(pattern.height, rowsPerPage);
  const columnCount = columnRanges.length;
  const rowCount = rowRanges.length;
  const pages: PatternPage[] = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    for (let columnIndex = 0; columnIndex < columnCount; columnIndex += 1) {
      const pageNumber = rowIndex * columnCount + columnIndex + 1;
      const primaryStartColumn = columnRanges[columnIndex].start;
      const primaryStartRow = rowRanges[rowIndex].start;
      const primaryEndColumn = columnRanges[columnIndex].end;
      const primaryEndRow = rowRanges[rowIndex].end;
      const startColumn = Math.max(0, primaryStartColumn - (columnIndex > 0 ? overlap : 0));
      const startRow = Math.max(0, primaryStartRow - (rowIndex > 0 ? overlap : 0));
      const endColumn = primaryEndColumn;
      const endRow = primaryEndRow;

      pages.push({
        pageNumber,
        totalPages: rowCount * columnCount,
        rowIndex,
        columnIndex,
        rowCount,
        columnCount,
        startRow,
        endRow,
        startColumn,
        endColumn,
        primaryStartRow,
        primaryEndRow,
        primaryStartColumn,
        primaryEndColumn,
        neighbours: {
          left: columnIndex > 0 ? pageNumber - 1 : null,
          right: columnIndex < columnCount - 1 ? pageNumber + 1 : null,
          above: rowIndex > 0 ? pageNumber - columnCount : null,
          below: rowIndex < rowCount - 1 ? pageNumber + columnCount : null
        }
      });
    }
  }

  return { pageWidth, pageHeight, margin, footerHeight, headerHeight, cellSize, columnsPerPage, rowsPerPage, pages };
}

function pdfEscape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function pdfColour(hex: string) {
  const { r, g, b } = hexToRgb(hex);
  return `${r.toFixed(3)} ${g.toFixed(3)} ${b.toFixed(3)}`;
}

function pdfText(x: number, y: number, text: string, size = 9) {
  return `${pdfColour(stitchFill)} rg BT /F1 ${size} Tf ${x.toFixed(2)} ${y.toFixed(2)} Td (${pdfEscape(text)}) Tj ET`;
}

function pdfRect(x: number, y: number, width: number, height: number, colour: string, mode: "f" | "S" = "f", lineWidth = 1) {
  const command = mode === "f" ? `${pdfColour(colour)} rg` : `${pdfColour(colour)} RG ${lineWidth.toFixed(2)} w`;
  return `${command} ${x.toFixed(2)} ${y.toFixed(2)} ${width.toFixed(2)} ${height.toFixed(2)} re ${mode}`;
}

function pageContent(pattern: GeneratedPattern, plan: PdfPlan, page: PatternPage) {
  const commands: string[] = [];
  const cellSize = plan.cellSize;
  const gridX = plan.margin;
  const gridTop = plan.pageHeight - plan.margin - plan.headerHeight;
  const gridY = gridTop - (page.endRow - page.startRow) * cellSize;
  commands.push(pdfRect(0, 0, plan.pageWidth, plan.pageHeight, paperFill));
  commands.push(pdfText(plan.margin, plan.pageHeight - plan.margin - 8, `${pattern.width} x ${pattern.height} Squares`, 10));

  for (let row = page.startRow; row < page.endRow; row += 1) {
    const rowData = pattern.grid[row] ?? "";
    for (let column = page.startColumn; column < page.endColumn; column += 1) {
      const x = gridX + (column - page.startColumn) * cellSize;
      const y = gridY + (page.endRow - row - 1) * cellSize;
      const isOverlap = column < page.primaryStartColumn || row < page.primaryStartRow;
      if (isOverlap) commands.push(pdfRect(x, y, cellSize, cellSize, overlapFill));
      if (rowData[column] === "1") {
        const inset = Math.max(1, cellSize * 0.2);
        commands.push(pdfRect(x + inset, y + inset, cellSize - inset * 2, cellSize - inset * 2, stitchFill));
      }
      const grouped = column % 10 === 0 || row % 10 === 0;
      commands.push(pdfRect(x, y, cellSize, cellSize, grouped ? groupedGrid : normalGrid, "S", grouped ? 1.1 : 0.45));
    }
  }

  const centerColumnPosition = pattern.width / 2;
  const centerRowPosition = pattern.height / 2;
  if (centerColumnPosition >= page.startColumn && centerColumnPosition <= page.endColumn) {
    const x = gridX + (centerColumnPosition - page.startColumn) * cellSize - 0.6;
    commands.push(pdfRect(x, gridY, 1.2, (page.endRow - page.startRow) * cellSize, "#2b9dff"));
  }
  if (centerRowPosition >= page.startRow && centerRowPosition <= page.endRow) {
    const y = gridY + (page.endRow - centerRowPosition) * cellSize - 0.6;
    commands.push(pdfRect(gridX, y, (page.endColumn - page.startColumn) * cellSize, 1.2, "#2b9dff"));
  }

  const footer = `Page ${page.pageNumber} of ${page.totalPages}    < ${page.neighbours.left ?? "None"}     > ${page.neighbours.right ?? "None"}     ^ ${page.neighbours.above ?? "None"}     v ${page.neighbours.below ?? "None"}`;
  commands.push(pdfText(plan.margin, 14, footer, 8));
  return commands.join("\n");
}

function buildPdf(contents: string[], pageWidth: number, pageHeight: number) {
  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const fontObjectId = 3;

  objects[1] = "<< /Type /Catalog /Pages 2 0 R >>";
  objects[2] = "";
  objects[3] = "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>";

  contents.forEach((content, index) => {
    const pageId = 4 + index * 2;
    const contentId = pageId + 1;
    pageObjectIds.push(pageId);
    objects[pageId] = `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth.toFixed(2)} ${pageHeight.toFixed(2)}] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentId} 0 R >>`;
    objects[contentId] = `<< /Length ${content.length} >>\nstream\n${content}\nendstream`;
  });

  objects[2] = `<< /Type /Pages /Kids [${pageObjectIds.map((id) => `${id} 0 R`).join(" ")}] /Count ${pageObjectIds.length} >>`;

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  for (let id = 1; id < objects.length; id += 1) {
    offsets[id] = pdf.length;
    pdf += `${id} 0 obj\n${objects[id]}\nendobj\n`;
  }
  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length}\n0000000000 65535 f \n`;
  for (let id = 1; id < objects.length; id += 1) {
    pdf += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<< /Size ${objects.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
  return pdf;
}

export function exportPatternPdf(pattern: GeneratedPattern, filename = "stitch-lettering-pattern.pdf") {
  const plan = planPdfPages(pattern);
  const contents = plan.pages.map((page) => pageContent(pattern, plan, page));
  const pdf = buildPdf(contents, plan.pageWidth, plan.pageHeight);
  const blob = new Blob([pdf], { type: "application/pdf" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

export function exportPatternPng(
  pattern: GeneratedPattern,
  filename = "stitch-lettering-pattern.png",
  options: PatternCanvasOptions = {}
) {
  const canvas = patternToCanvas(pattern, options);
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


