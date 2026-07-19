-- Repair public custom font character persistence for the shared editing model.
-- This is safe to rerun. It does not delete font or character data.

alter table public.custom_fonts
alter column owner_id drop not null;

alter table public.custom_font_characters
alter column owner_id drop not null;

alter table public.custom_font_characters
drop constraint if exists custom_font_characters_font_owner_fk;

alter table public.custom_font_characters
drop constraint if exists custom_font_characters_font_fk;

alter table public.custom_font_characters
add constraint custom_font_characters_font_fk
foreign key (font_id)
references public.custom_fonts(id)
on delete cascade;

drop policy if exists "Custom font characters are visible to everyone" on public.custom_font_characters;
drop policy if exists "Anyone can create custom font characters" on public.custom_font_characters;
drop policy if exists "Anyone can update custom font characters" on public.custom_font_characters;
drop policy if exists "Anyone can delete custom font characters" on public.custom_font_characters;

create policy "Custom font characters are visible to everyone"
on public.custom_font_characters for select
using (true);

create policy "Anyone can create custom font characters"
on public.custom_font_characters for insert
with check (true);

create policy "Anyone can update custom font characters"
on public.custom_font_characters for update
using (true)
with check (true);

create policy "Anyone can delete custom font characters"
on public.custom_font_characters for delete
using (true);

grant select, insert, update, delete on public.custom_fonts to anon, authenticated;
grant select, insert, update, delete on public.custom_font_characters to anon, authenticated;
