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
  useFontsSource.includes("setSavedFonts((current) =>") &&
    useFontsSource.includes("savedFont.id !== nextFont.id") &&
    useFontsSource.includes("return [...nextFonts, nextFont]"),
  "FONT-REFRESH-002: Successful saves should optimistically keep the saved font in local state during refresh."
);

console.log("font refresh source tests passed.");
