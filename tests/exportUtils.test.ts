import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { GeneratedPattern, StitchFont } from "../src/lib/fontTypes";
import { copyDesignSize, exportFontJson, exportPatternJson, exportPatternPdf, exportPatternPng, patternToCanvas, planPdfPages } from "../src/lib/exportUtils";

const fonts = fontsData as StitchFont[];
const blockFont = fonts.find((font) => font.id === "block-needle-5x7");
assert.ok(blockFont, "Block Needle test font should exist.");

const clicks: Array<{ download: string; href: string }> = [];
const objectUrls: string[] = [];
const revokedUrls: string[] = [];
const jsonPayloads: unknown[] = [];
const pdfPayloads: string[] = [];
const drawCalls: Array<{ type: "fillRect" | "strokeRect"; x: number; y: number; width: number; height: number }> = [];

class MockBlob {
  type: string;
  content: string;

  constructor(parts: unknown[], options: { type?: string } = {}) {
    this.type = options.type ?? "";
    this.content = parts.join("");
  }
}

(globalThis as any).Blob = MockBlob;

type LinkElement = {
  href: string;
  download: string;
  click: () => void;
};

function createLink(): LinkElement {
  return {
    href: "",
    download: "",
    click() {
      clicks.push({ download: this.download, href: this.href });
    }
  };
}

function createCanvas() {
  return {
    width: 0,
    height: 0,
    toDataURL(type: string) {
      assert.equal(type, "image/png");
      return "data:image/png;base64,test";
    },
    getContext(type: string) {
      assert.equal(type, "2d");
      return {
        fillStyle: "",
        strokeStyle: "",
        lineWidth: 0,
        fillRect(x: number, y: number, width: number, height: number) {
          drawCalls.push({ type: "fillRect", x, y, width, height });
        },
        strokeRect(x: number, y: number, width: number, height: number) {
          drawCalls.push({ type: "strokeRect", x, y, width, height });
        },
        fillText() {
          return undefined;
        }
      };
    }
  };
}

(globalThis as any).document = {
  createElement(tagName: string) {
    if (tagName === "canvas") return createCanvas();
    if (tagName === "a") return createLink();
    throw new Error(`Unexpected element ${tagName}`);
  }
};

(globalThis as any).URL = {
  createObjectURL(blob: Blob) {
    if (blob.type === "application/json") {
      jsonPayloads.push(JSON.parse((blob as unknown as MockBlob).content));
    } else if (blob.type === "application/pdf") {
      pdfPayloads.push((blob as unknown as MockBlob).content);
    } else {
      throw new Error(`Unexpected blob type ${blob.type}`);
    }
    const url = `blob:mock-${objectUrls.length + 1}`;
    objectUrls.push(url);
    return url;
  },
  revokeObjectURL(url: string) {
    revokedUrls.push(url);
  }
};

(globalThis as any).mockClipboard = {
  value: "",
  async writeText(value: string) {
    this.value = value;
  }
};

Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: {
    clipboard: (globalThis as any).mockClipboard
  }
});

const pattern: GeneratedPattern = {
  fontId: blockFont.id,
  text: "A",
  letterSpacing: 1,
  wordSpacing: 3,
  lineSpacing: 2,
  alignment: "left",
  width: 2,
  height: 2,
  grid: ["10", "01"],
  unsupportedCharacters: [],
  warnings: ["Large pattern generated: 2 x 2 stitches."]
};

const canvas = patternToCanvas(pattern, { cellSize: 10, showGrid: true });
assert.equal(canvas.width, 40);
assert.equal(canvas.height, 64);
assert.ok(drawCalls.some((call) => call.type === "fillRect"), "Canvas export should draw filled cells, dimensions and background.");
assert.ok(drawCalls.some((call) => call.type === "strokeRect"), "Canvas export should draw grid lines when enabled.");

drawCalls.length = 0;
patternToCanvas(pattern, { cellSize: 10, showGrid: false });
assert.ok(
  drawCalls.some((call) => call.type === "fillRect"),
  "EXPORT-001: Canvas export should still draw filled cells when grid is hidden."
);
assert.equal(
  drawCalls.some((call) => call.type === "strokeRect"),
  false,
  "EXPORT-001: Canvas export should not draw grid lines when disabled."
);

drawCalls.length = 0;
patternToCanvas(pattern, { cellSize: 10, showGrid: true, showFilled: false });
const filledCellRects = drawCalls.filter((call) => call.type === "fillRect" && call.width === 6 && call.height === 6);
assert.equal(filledCellRects.length, 0, "EXPORT-002: Canvas export should not draw filled cells when hidden.");
assert.ok(
  drawCalls.some((call) => call.type === "strokeRect"),
  "EXPORT-002: Canvas export should still draw grid lines when filled stitches are hidden."
);

drawCalls.length = 0;
patternToCanvas(pattern, { cellSize: 10, showGrid: true, showFilled: true });
assert.equal(
  drawCalls.filter((call) => call.type === "fillRect" && call.width === 6 && call.height === 6).length,
  2,
  "PARITY-001: Canvas export should draw exactly the filled cells from the provided grid."
);
assert.equal(
  drawCalls.filter((call) => call.type === "strokeRect").length,
  4,
  "PARITY-001: Canvas export should draw one grid square for every provided grid cell."
);
assert.ok(
  drawCalls.some((call) => call.type === "fillRect" && call.x === 19 && call.y === 34 && call.width === 2 && call.height === 20) &&
    drawCalls.some((call) => call.type === "fillRect" && call.x === 10 && call.y === 43 && call.width === 20 && call.height === 2),
  "EXPORT-005: Canvas export should draw centre guide lines through the exact middle of the pattern."
);

drawCalls.length = 0;
patternToCanvas(pattern, { cellSize: 10, showGrid: true, showFilled: true, showCenterGuide: false });
assert.equal(
  drawCalls.some((call) => call.type === "fillRect" && call.width === 2 && call.height === 20),
  false,
  "EXPORT-005: Canvas centre guides should be controlled by the centre-guide option."
);

exportPatternPng(pattern, "letters.png", { showGrid: false, showFilled: true });
assert.deepEqual(clicks.at(-1), { download: "letters.png", href: "data:image/png;base64,test" });

exportPatternJson(pattern);
assert.equal(clicks.at(-1)?.download, "stitch-lettering-pattern.json");
assert.deepEqual(jsonPayloads.at(-1), pattern, "PARITY-002: Pattern JSON export should preserve the generated pattern object.");
assert.deepEqual(revokedUrls, objectUrls, "JSON object URLs should be revoked after download.");

const emptyPattern: GeneratedPattern = {
  ...pattern,
  text: "",
  width: 0,
  height: 0,
  grid: [],
  unsupportedCharacters: [],
  warnings: []
};
const emptyCanvas = patternToCanvas(emptyPattern, { cellSize: 10, showGrid: true, showFilled: true });
assert.equal(emptyCanvas.width, 20, "EXPORT-003: Empty patterns should produce a safe margin-only canvas.");
assert.equal(emptyCanvas.height, 20, "EXPORT-003: Empty patterns should produce a safe margin-only canvas.");

const pdfPlan = planPdfPages({ ...pattern, width: 180, height: 120, grid: Array.from({ length: 120 }, () => "1".repeat(180)) });
assert.equal(pdfPlan.pageWidth > pdfPlan.pageHeight, true, "PDF-001: Print PDF should use landscape A4 dimensions.");
assert.equal(pdfPlan.pages.length > 1, true, "PDF-002: Large patterns should paginate.");
assert.equal(pdfPlan.pages.some((page) => page.startColumn < page.primaryStartColumn || page.startRow < page.primaryStartRow), true, "PDF-003: Paginated pages should include 2-stitch overlap where adjoining pages exist.");
assert.equal(pdfPlan.pages[0].startColumn, pdfPlan.pages[0].primaryStartColumn, "PDF-007: First/source page should not include left overlap shading.");
assert.equal(pdfPlan.pages[0].startRow, pdfPlan.pages[0].primaryStartRow, "PDF-007: First/source page should not include top overlap shading.");
assert.equal(pdfPlan.pages[0].endColumn, pdfPlan.pages[0].primaryEndColumn, "PDF-007: First/source page should not include future right overlap cells.");
assert.equal(pdfPlan.pages[0].endRow, pdfPlan.pages[0].primaryEndRow, "PDF-007: First/source page should not include future lower overlap cells.");
const continuationPage = pdfPlan.pages.find((page) => page.columnIndex > 0 || page.rowIndex > 0);
assert.ok(continuationPage, "PDF-008: A paginated pattern should include at least one continuation page.");
assert.equal(
  continuationPage.startColumn < continuationPage.primaryStartColumn || continuationPage.startRow < continuationPage.primaryStartRow,
  true,
  "PDF-008: Continuation pages should include repeated overlap from previous pages."
);
assert.equal(
  pdfPlan.pages.every((page) => page.endColumn === page.primaryEndColumn && page.endRow === page.primaryEndRow),
  true,
  "PDF-009: PDF pages should not include future overlap cells on source pages."
);
assert.equal(pdfPlan.pages[0].neighbours.right, 2, "PDF-004: Footer navigation should calculate right neighbours.");
assert.equal(pdfPlan.pages[0].neighbours.left, null, "PDF-004: Footer navigation should report missing neighbours as null before rendering None.");

exportPatternPdf(pattern, "letters.pdf");
assert.equal(clicks.at(-1)?.download, "letters.pdf", "PDF-005: PDF export should trigger a PDF download.");
const latestPdf = pdfPayloads.at(-1) ?? "";
assert.ok(latestPdf.startsWith("%PDF-1.4"), "PDF-005: PDF export should create a PDF payload.");
assert.ok(latestPdf.includes("2 x 2 Squares"), "PDF-006: PDF export should include total pattern dimensions.");
assert.ok(latestPdf.includes("0.031 0.137 0.114 rg BT /F1 10 Tf"), "PDF-011: PDF dimension text should be drawn in a visible dark colour.");
assert.ok(latestPdf.includes("0.031 0.137 0.114 rg"), "PDF-010: PDF export should include stitch fill drawing commands.");
assert.equal(latestPdf.includes("NaN"), false, "PDF-010: PDF export should not contain invalid PDF colour values.");

exportPatternJson(emptyPattern);
assert.deepEqual(jsonPayloads.at(-1), emptyPattern, "EXPORT-004: Empty pattern JSON export should preserve safe empty data.");

exportFontJson({ ...blockFont, name: "Fancy Font!" });
assert.equal(clicks.at(-1)?.download, "fancy-font.font.json");

void copyDesignSize(pattern);
assert.equal(
  (globalThis as any).mockClipboard.value,
  "Width: 2 stitches, Height: 2 stitches",
  "Copy size should write a readable stitch dimension summary."
);

console.log("exportUtils tests passed.");


