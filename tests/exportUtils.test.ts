import assert from "node:assert/strict";
import fontsData from "../src/data/fonts.json";
import type { GeneratedPattern, StitchFont } from "../src/lib/fontTypes";
import { copyDesignSize, exportFontJson, exportPatternJson, exportPatternPng, patternToCanvas } from "../src/lib/exportUtils";

const fonts = fontsData as StitchFont[];
const blockFont = fonts.find((font) => font.id === "block-needle-5x7");
assert.ok(blockFont, "Block Needle test font should exist.");

const clicks: Array<{ download: string; href: string }> = [];
const objectUrls: string[] = [];
const revokedUrls: string[] = [];
const drawCalls: string[] = [];

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
        fillRect() {
          drawCalls.push("fillRect");
        },
        strokeRect() {
          drawCalls.push("strokeRect");
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
    assert.equal(blob.type, "application/json");
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
  unsupportedCharacters: []
};

const canvas = patternToCanvas(pattern, { cellSize: 10, showGrid: true });
assert.equal(canvas.width, 40);
assert.equal(canvas.height, 40);
assert.ok(drawCalls.includes("fillRect"), "Canvas export should draw filled cells and background.");
assert.ok(drawCalls.includes("strokeRect"), "Canvas export should draw grid lines when enabled.");

exportPatternPng(pattern, "letters.png");
assert.deepEqual(clicks.at(-1), { download: "letters.png", href: "data:image/png;base64,test" });

exportPatternJson(pattern);
assert.equal(clicks.at(-1)?.download, "stitch-lettering-pattern.json");
assert.deepEqual(revokedUrls, objectUrls, "JSON object URLs should be revoked after download.");

exportFontJson({ ...blockFont, name: "Fancy Font!" });
assert.equal(clicks.at(-1)?.download, "fancy-font.font.json");

void copyDesignSize(pattern);
assert.equal(
  (globalThis as any).mockClipboard.value,
  "Width: 2 stitches, Height: 2 stitches",
  "Copy size should write a readable stitch dimension summary."
);

console.log("exportUtils tests passed.");
