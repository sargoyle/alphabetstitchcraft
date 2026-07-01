-- Allow the current no-login shared font editing model to update seeded default fonts.
--
-- Default fonts remain seeded reference rows. This policy allows existing rows to
-- be edited by the app, while creation of new default font IDs continues to be
-- handled by the seed migration rather than arbitrary client inserts.

drop policy if exists "Anyone can update default fonts" on public.default_fonts;

create policy "Anyone can update default fonts"
on public.default_fonts for update
using (is_public = true)
with check (is_public = true);
