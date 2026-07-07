import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import fontsData from "../src/data/fonts.json";
import { buildFontPreviewSample } from "../src/lib/fontPreviewSample";
import type { StitchFont } from "../src/lib/fontTypes";

const fonts = fontsData as StitchFont[];
const blockFont = fonts.find((font) => font.id === "block-needle-5x7");
assert.ok(blockFont, "Font browser source test needs Block Needle 5x7.");

const sample = buildFontPreviewSample(blockFont);
assert.ok(sample.includes("ABC DEF GHI"), "FONT-BROWSER-001: card preview should use a fuller uppercase sample.");
assert.ok(sample.includes("123"), "FONT-BROWSER-002: card preview should include numbers when supported.");

const uppercaseOnlyFont: StitchFont = {
  ...blockFont,
  characters: Object.fromEntries(Object.entries(blockFont.characters).filter(([key]) => /^[A-Z]$/.test(key)))
};
const uppercaseOnlySample = buildFontPreviewSample(uppercaseOnlyFont);
assert.equal(
  uppercaseOnlySample,
  "ABC DEF GHI",
  "FONT-BROWSER-003: card preview should avoid unsupported lowercase and number characters."
);

const fontGridPreviewSource = readFileSync("src/components/FontGridPreview.tsx", "utf8");
const globalCssSource = readFileSync("src/app/globals.css", "utf8");
assert.ok(
  fontGridPreviewSource.includes("buildFontPreviewSample"),
  "FONT-BROWSER-004: FontGridPreview should build a supported sample from drawable characters."
);
assert.ok(
  globalCssSource.includes(".font-card .mini-preview") &&
    globalCssSource.includes("width: fit-content;") &&
    globalCssSource.includes(".mini-preview .pattern-scroll"),
  "FONT-BROWSER-005: mini previews should shrink-wrap short samples while still respecting card width."
);

console.log("fontBrowserSource tests passed.");
