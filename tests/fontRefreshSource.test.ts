import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const useFontsSource = readFileSync("src/lib/useFonts.ts", "utf8");
const refreshFunctionBody = useFontsSource.slice(
  useFontsSource.indexOf("async function refresh()"),
  useFontsSource.indexOf("async function saveEditableFont")
);

assert.equal(
  refreshFunctionBody.includes("setSavedFonts([])"),
  false,
  "FONT-REFRESH-001: Refresh should not clear saved fonts before remote fonts finish loading."
);

assert.ok(
  useFontsSource.includes("const keepSavedFontCurrent = (current: StitchFont[])") &&
    useFontsSource.includes("savedFont.id !== nextFont.id") &&
    useFontsSource.includes("return [...nextFonts, nextFont]") &&
    (useFontsSource.match(/setSavedFonts\(keepSavedFontCurrent\)/g)?.length ?? 0) >= 2 &&
    useFontsSource.includes("await refresh();"),
  "FONT-REFRESH-002: Successful saves should keep the saved font in local state before and after refresh."
);

console.log("font refresh source tests passed.");


