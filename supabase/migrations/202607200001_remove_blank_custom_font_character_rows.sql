-- Remove stale blank custom character rows created by earlier persistence bugs.
-- Blank/uncreated characters are rebuilt by the app from font-level defaults and
-- should not be stored as custom_font_characters rows.

delete from public.custom_font_characters c
where not exists (
  select 1
  from jsonb_array_elements_text(c.grid) as row_value
  where row_value like '%1%'
);
