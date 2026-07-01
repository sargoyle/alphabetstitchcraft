-- Clean up Block Needle 5x7 / 5 x 7 name variants.
--
-- The first duplicate cleanup matched the compact display name. This follow-up
-- normalises spacing around the "x" so duplicate records named either
-- "Block Needle 5x7" or "Block Needle 5 x 7" are treated as the same font.

begin;

do $$
begin
  if not exists (
    select 1
    from public.default_fonts
    where id = 'block-needle-5x7'
  ) then
    raise exception 'Canonical default font block-needle-5x7 is missing. Run 202607010001_seed_default_fonts.sql before this cleanup.';
  end if;
end $$;

with duplicate_default_fonts as (
  select id
  from public.default_fonts
  where regexp_replace(lower(regexp_replace(trim(name), '\s+', ' ', 'g')), '\s*x\s*', 'x', 'g') = 'block needle 5x7'
    and id <> 'block-needle-5x7'
)
update public.custom_fonts
set
  base_default_font_id = 'block-needle-5x7',
  updated_at = now()
where base_default_font_id in (select id from duplicate_default_fonts);

delete from public.default_fonts
where regexp_replace(lower(regexp_replace(trim(name), '\s+', ' ', 'g')), '\s*x\s*', 'x', 'g') = 'block needle 5x7'
  and id <> 'block-needle-5x7';

insert into public.custom_font_backups (
  font_id,
  action,
  font_name,
  font_snapshot
)
select
  cf.id,
  'delete',
  cf.name,
  jsonb_build_object(
    'id', cf.id::text,
    'name', cf.name,
    'description', cf.description,
    'category', cf.category,
    'defaultHeight', cf.default_height,
    'recommendedUse', cf.recommended_use,
    'licence', cf.licence,
    'isCustom', true,
    'baseFontId', cf.base_default_font_id,
    'createdAt', cf.created_at,
    'updatedAt', cf.updated_at,
    'characters', coalesce(chars.characters, '{}'::jsonb)
  )
from public.custom_fonts cf
left join lateral (
  select jsonb_object_agg(
    cfc.character_key,
    jsonb_build_object(
      'width', cfc.width,
      'height', cfc.height,
      'grid', cfc.grid
    )
  ) as characters
  from public.custom_font_characters cfc
  where cfc.font_id = cf.id
) chars on true
where regexp_replace(lower(regexp_replace(trim(cf.name), '\s+', ' ', 'g')), '\s*x\s*', 'x', 'g') = 'block needle 5x7'
  and cf.base_default_font_id = 'block-needle-5x7';

delete from public.custom_fonts
where regexp_replace(lower(regexp_replace(trim(name), '\s+', ' ', 'g')), '\s*x\s*', 'x', 'g') = 'block needle 5x7'
  and base_default_font_id = 'block-needle-5x7';

update public.custom_fonts
set
  name = concat(name, ' duplicate ', left(id::text, 8)),
  updated_at = now()
where regexp_replace(lower(regexp_replace(trim(name), '\s+', ' ', 'g')), '\s*x\s*', 'x', 'g') = 'block needle 5x7';

commit;
