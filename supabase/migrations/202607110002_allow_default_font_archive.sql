-- Permit the current no-login shared font model to archive seeded default fonts.
--
-- Shared/default font deletion is implemented as an archive operation by setting
-- is_public = false. This keeps the row recoverable and avoids granting broad
-- physical DELETE access on seeded default font records.

drop policy if exists "Anyone can update default fonts" on public.default_fonts;

create policy "Anyone can update default fonts"
on public.default_fonts for update
using (is_public = true)
with check (true);
