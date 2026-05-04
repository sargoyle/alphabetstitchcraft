-- Convert custom fonts into a shared public library.
-- Anyone with the project's publishable key can create, edit, rename or delete custom fonts.

drop policy if exists "Users can create their own custom fonts" on public.custom_fonts;
drop policy if exists "Users can update their own custom fonts" on public.custom_fonts;
drop policy if exists "Users can delete their own custom fonts" on public.custom_fonts;
drop policy if exists "Anyone can create custom fonts" on public.custom_fonts;
drop policy if exists "Anyone can update custom fonts" on public.custom_fonts;
drop policy if exists "Anyone can delete custom fonts" on public.custom_fonts;
drop policy if exists "Users can create characters for their own custom fonts" on public.custom_font_characters;
drop policy if exists "Users can update characters for their own custom fonts" on public.custom_font_characters;
drop policy if exists "Users can delete characters for their own custom fonts" on public.custom_font_characters;
drop policy if exists "Anyone can create custom font characters" on public.custom_font_characters;
drop policy if exists "Anyone can update custom font characters" on public.custom_font_characters;
drop policy if exists "Anyone can delete custom font characters" on public.custom_font_characters;

alter table public.custom_font_characters
drop constraint if exists custom_font_characters_font_owner_fk;

alter table public.custom_fonts
drop constraint if exists custom_fonts_id_owner_id_key;

alter table public.custom_fonts
alter column owner_id drop not null;

alter table public.custom_font_characters
alter column owner_id drop not null;

alter table public.custom_font_characters
drop constraint if exists custom_font_characters_font_fk;

alter table public.custom_font_characters
add constraint custom_font_characters_font_fk
foreign key (font_id)
references public.custom_fonts(id)
on delete cascade;

create policy "Anyone can create custom fonts"
on public.custom_fonts for insert
with check (true);

create policy "Anyone can update custom fonts"
on public.custom_fonts for update
using (true)
with check (true);

create policy "Anyone can delete custom fonts"
on public.custom_fonts for delete
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
