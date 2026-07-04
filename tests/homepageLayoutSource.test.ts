import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const homePageSource = readFileSync("src/app/page.tsx", "utf8");
const globalCssSource = readFileSync("src/app/globals.css", "utf8");

assert.ok(
  homePageSource.includes("zoom={13}"),
  "HOME-UI-001: Home centred lettering preview should use a compact zoom that fits laptop viewports."
);

assert.ok(
  globalCssSource.includes("font-size: clamp(2.25rem, 4.4vw, 4.25rem);") &&
    globalCssSource.includes("min-height: 72px;") &&
    globalCssSource.includes("margin-top: -2px;") &&
    globalCssSource.includes("padding: 0 4px;"),
  "HOME-UI-002: Home page should use compact hero, workflow and footer spacing."
);

console.log("homepage layout source tests passed.");
