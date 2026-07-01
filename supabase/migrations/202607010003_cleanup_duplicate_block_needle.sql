-- Clean up duplicate Block Needle 5x7 shared font records.
--
-- This migration keeps the seeded default font row `block-needle-5x7` as the
-- canonical shared/default font. It repoints custom-font base references away
-- from duplicate default rows, removes duplicate default rows, and removes or
-- renames custom-font records that were accidentally created with the same
-- shared font name.

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

-- If a duplicate default row was created with another slug, move custom-font
-- base references to the canonical seeded row before deleting the duplicate.
update public.custom_fonts
set
  base_default_font_id = 'block-needle-5x7',
  updated_at = now()
where base_default_font_id in (
  select id
  from public.default_fonts
  where lower(trim(name)) = 'block needle 5x7'
    and id <> 'block-needle-5x7'
);

delete from public.default_fonts
where lower(trim(name)) = 'block needle 5x7'
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
where lower(trim(cf.name)) = 'block needle 5x7'
  and cf.base_default_font_id = 'block-needle-5x7';

-- Remove accidental custom/shared copies that point back to the canonical
-- default font. Their character rows are duplicate derived data and are removed
-- through the existing cascade relationship.
delete from public.custom_fonts
where lower(trim(name)) = 'block needle 5x7'
  and base_default_font_id = 'block-needle-5x7';

-- Preserve any same-named custom/shared font that does not clearly derive from
-- the canonical default by renaming it out of the duplicate-name conflict.
update public.custom_fonts
set
  name = concat(name, ' duplicate ', left(id::text, 8)),
  updated_at = now()
where lower(trim(name)) = 'block needle 5x7';

commit;
