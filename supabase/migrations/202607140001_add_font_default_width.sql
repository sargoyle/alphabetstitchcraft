-- Add a soft font-level default width used when creating new character grids.
-- Existing fonts default to their current font height so this is safe for old data.
alter table public.default_fonts
  add column if not exists default_width integer;

alter table public.custom_fonts
  add column if not exists default_width integer;

update public.default_fonts
set default_width = default_height
where default_width is null;

update public.custom_fonts
set default_width = default_height
where default_width is null;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'default_fonts_default_width_valid'
  ) then
    alter table public.default_fonts
      add constraint default_fonts_default_width_valid
      check (default_width is null or (default_width >= 1 and default_width <= 60));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'custom_fonts_default_width_valid'
  ) then
    alter table public.custom_fonts
      add constraint custom_fonts_default_width_valid
      check (default_width is null or (default_width >= 1 and default_width <= 60));
  end if;
end $$;
