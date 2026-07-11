import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const cleanupSql = readFileSync("supabase/migrations/202607010003_cleanup_duplicate_block_needle.sql", "utf8");
const variantCleanupSql = readFileSync(
  "supabase/migrations/202607010004_cleanup_block_needle_name_variants.sql",
  "utf8"
);
const punctuationSql = readFileSync("supabase/migrations/202607070001_add_default_punctuation_characters.sql", "utf8");
const defaultFontArchiveSql = readFileSync("supabase/migrations/202607110002_allow_default_font_archive.sql", "utf8");
const defaultFontArchiveGrantSql = readFileSync("supabase/migrations/202607110003_grant_default_font_archive_update.sql", "utf8");

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
  /create table if not exists public\.custom_font_backups/,
  "Block Needle variant cleanup should create the backup table if it is missing."
);

assert.match(
  variantCleanupSql,
  /insert into public\.custom_font_backups[\s\S]*font_snapshot/,
  "Block Needle variant cleanup should back up accidental custom duplicates before deleting them."
);

assert.match(
  punctuationSql,
  /update public.default_fonts/,
  "Punctuation migration should patch existing default font records."
);

assert.match(
  punctuationSql,
  /"@"/,
  "Punctuation migration should include the required @ character."
);

assert.match(
  punctuationSql,
  /"~"/,
  "Punctuation migration should include the required tilde character."
);

assert.match(
  defaultFontArchiveSql,
  /on public\.default_fonts for update[\s\S]*using \(is_public = true\)[\s\S]*with check \(true\)/,
  "Default font archive migration should allow public rows to be archived with is_public = false."
);

assert.doesNotMatch(
  defaultFontArchiveSql,
  /for delete/,
  "Default font archive migration should keep physical deletes unavailable."
);
assert.match(
  defaultFontArchiveGrantSql,
  /grant update \(is_public\) on public\.default_fonts to anon, authenticated/i,
  "Default font archive grant should allow the public client to update only is_public."
);

assert.doesNotMatch(
  defaultFontArchiveGrantSql,
  /grant delete/i,
  "Default font archive grant should not allow physical deletes."
);
console.log("migration script tests passed.");
