-- Allow the browser client to archive shared/default fonts without granting
-- physical delete access or broad default font editing permissions.
--
-- The archive action only updates is_public from true to false. The existing
-- updated_at trigger records the change time.

grant update (is_public) on public.default_fonts to anon, authenticated;