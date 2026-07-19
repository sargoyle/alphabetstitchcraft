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
const fontsPageSource = readFileSync("src/app/fonts/page.tsx", "utf8");
const fontDetailSource = readFileSync("src/app/fonts/[id]/page.tsx", "utf8");
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
assert.ok(
  fontsPageSource.includes('persistence.mode === "loading"') &&
    fontsPageSource.includes("Loading alphabet library...") &&
    fontsPageSource.includes('aria-busy="true"'),
  "FONT-BROWSER-006: Alphabet Library should show a loading state instead of stale default font cards while database fonts load."
);

assert.ok(
  fontsPageSource.includes("createOpen") &&
    fontsPageSource.includes("New category...") &&
    fontsPageSource.includes("fontCategoryDefinitions") &&
    fontsPageSource.includes("newFontWidth") &&
    fontsPageSource.includes("createBlankFont(name, { category: categoryName, height: heightValue, width: widthValue })"),
  "FONT-BROWSER-007: Create New Font should use an in-app form with category, new-category, height and default-width controls."
);
console.log("fontBrowserSource tests passed.");

assert.ok(
  fontDetailSource.includes('function hasFilledStitches') &&
    fontDetailSource.includes('keys.filter((key) => hasFilledStitches(font.characters[key]))') &&
    fontDetailSource.includes('No characters have been created for this font yet.'),
  "FONT-DETAIL-001: Alphabet detail should hide characters that have no created stitch design."
);

assert.ok(
  fontsPageSource.includes('creatingFont') &&
    fontsPageSource.includes('{creatingFont ? "Creating..." : "Create font"}') &&
    fontsPageSource.includes('role={actionStatus.type === "success" ? "status" : "alert"}') &&
    fontsPageSource.includes('default-width migration'),
  "FONT-BROWSER-008: Create Font modal should show immediate saving state and in-modal save failure feedback."
);
