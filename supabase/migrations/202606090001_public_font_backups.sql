-- Add public custom font backups for shared-library hardening.
-- The app keeps public editing open, but stores restorable snapshots before updates and deletes.

create table if not exists public.custom_font_backups (
  id uuid primary key default gen_random_uuid(),
  font_id uuid not null,
  action text not null check (action in ('update', 'delete', 'restore')),
  font_name text not null,
  font_snapshot jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists custom_font_backups_font_id_created_at_idx
on public.custom_font_backups (font_id, created_at desc);

alter table public.custom_font_backups enable row level security;
alter table public.custom_font_backups force row level security;

drop policy if exists "Anyone can read custom font backups" on public.custom_font_backups;
drop policy if exists "Anyone can create custom font backups" on public.custom_font_backups;

create policy "Anyone can read custom font backups"
on public.custom_font_backups for select
using (true);

create policy "Anyone can create custom font backups"
on public.custom_font_backups for insert
with check (true);
