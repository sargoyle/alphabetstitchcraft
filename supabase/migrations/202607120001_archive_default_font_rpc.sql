-- Archive shared/default fonts through one controlled RPC instead of relying on
-- browser-side table updates. This avoids RLS/PostgREST update edge cases while
-- still avoiding physical deletes.

revoke update (is_public) on public.default_fonts from anon, authenticated;

create or replace function public.archive_default_font(font_id text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.default_fonts
  set is_public = false
  where id = font_id
    and is_public = true;

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

revoke all on function public.archive_default_font(text) from public;
grant execute on function public.archive_default_font(text) to anon, authenticated;