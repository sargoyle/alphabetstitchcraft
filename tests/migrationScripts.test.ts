import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const cleanupSql = readFileSync("supabase/migrations/202607010003_cleanup_duplicate_block_needle.sql", "utf8");
const variantCleanupSql = readFileSync(
  "supabase/migrations/202607010004_cleanup_block_needle_name_variants.sql",
  "utf8"
);

assert.match(
  cleanupSql,
  /where id = 'block-needle-5x7'/,
  "Block Needle cleanup should require the canonical seeded default font row."
);

assert.match(
  cleanupSql,
  /set\s+base_default_font_id = 'block-needle-5x7'/,
  "Block Needle cleanup should repoint custom font base references to the canonical default row."
);

assert.match(
  cleanupSql,
  /delete from public\.default_fonts[\s\S]*id <> 'block-needle-5x7'/,
  "Block Needle cleanup should delete duplicate default font rows while keeping the canonical row."
);

assert.match(
  cleanupSql,
  /delete from public\.custom_fonts[\s\S]*base_default_font_id = 'block-needle-5x7'/,
  "Block Needle cleanup should remove accidental custom duplicates derived from the canonical default row."
);

assert.match(
  cleanupSql,
  /insert into public\.custom_font_backups[\s\S]*font_snapshot/,
  "Block Needle cleanup should back up accidental custom duplicates before deleting them."
);

assert.match(
  variantCleanupSql,
  /regexp_replace\(lower\(regexp_replace\(trim\(name\), '\\s\+', ' ', 'g'\)\), '\\s\*x\\s\*', 'x', 'g'\) = 'block needle 5x7'/,
  "Block Needle variant cleanup should normalise spaces around the x in 5x7."
);

assert.match(
  variantCleanupSql,
  /set\s+base_default_font_id = 'block-needle-5x7'/,
  "Block Needle variant cleanup should repoint base references to the canonical default row."
);

assert.match(
  variantCleanupSql,
  /insert into public\.custom_font_backups[\s\S]*font_snapshot/,
  "Block Needle variant cleanup should back up accidental custom duplicates before deleting them."
);

console.log("migration script tests passed.");
