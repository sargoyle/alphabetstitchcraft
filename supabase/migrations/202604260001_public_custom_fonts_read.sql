-- Make user-created fonts visible to everyone while keeping writes owner-only.
--
-- Created fonts are public reference data.
-- Only the authenticated owner can insert, update or delete their own font rows.

drop policy if exists "Users can see their own custom fonts" on public.custom_fonts;
drop policy if exists "Users can see characters for their own custom fonts" on public.custom_font_characters;

create policy "Custom fonts are visible to everyone"
on public.custom_fonts for select
using (true);

create policy "Custom font characters are visible to everyone"
on public.custom_font_characters for select
using (true);
