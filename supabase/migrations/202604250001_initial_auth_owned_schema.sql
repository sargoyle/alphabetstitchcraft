-- Cross-Stitch Lettering Library database foundation.
-- Target: Supabase Postgres with Supabase Auth.
--
-- Privacy model for v1:
-- - Default fonts may be public reference data.
-- - User-created fonts, characters, generated patterns, settings and exports are
--   always owned by auth.uid().
-- - Workspace tables are included now so collaboration can be added later
--   without reshaping the whole database. Current policies still keep private
--   data owner-only.

create extension if not exists pgcrypto;

create type public.workspace_role as enum ('owner', 'editor', 'viewer');
create type public.font_source_type as enum ('default', 'custom');
create type public.export_format as enum ('png', 'json');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.is_valid_binary_grid(grid jsonb, expected_width integer, expected_height integer)
returns boolean
language sql
immutable
as $$
  select
    jsonb_typeof(grid) = 'array'
    and jsonb_array_length(grid) = expected_height
    and not exists (
      select 1
      from jsonb_array_elements_text(grid) as rows(row_value)
      where length(row_value) <> expected_width
         or row_value !~ '^[01]+$'
    );
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null default 'My stitch library',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint workspaces_name_not_blank check (length(trim(name)) > 0)
);

create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.workspace_role not null default 'owner',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table public.default_fonts (
  id text primary key,
  name text not null,
  description text not null,
  category text not null,
  default_height integer not null check (default_height > 0),
  recommended_use text not null,
  licence text not null,
  characters jsonb not null,
  is_public boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint default_fonts_name_not_blank check (length(trim(name)) > 0),
  constraint default_fonts_characters_object check (jsonb_typeof(characters) = 'object')
);

create table public.custom_fonts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  base_default_font_id text references public.default_fonts(id) on delete set null,
  base_custom_font_id uuid references public.custom_fonts(id) on delete set null,
  name text not null,
  description text not null default '',
  category text not null,
  default_height integer not null check (default_height > 0),
  recommended_use text not null default '',
  licence text not null default 'User-created private font',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint custom_fonts_name_not_blank check (length(trim(name)) > 0),
  unique (id, owner_id)
);

create table public.custom_font_characters (
  id uuid primary key default gen_random_uuid(),
  font_id uuid not null,
  owner_id uuid not null,
  character_key text not null,
  width integer not null check (width > 0 and width <= 64),
  height integer not null check (height > 0 and height <= 64),
  grid jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint custom_font_characters_font_owner_fk
    foreign key (font_id, owner_id)
    references public.custom_fonts(id, owner_id)
    on delete cascade,
  constraint custom_font_characters_key_not_blank check (length(character_key) > 0),
  constraint custom_font_characters_grid_valid check (public.is_valid_binary_grid(grid, width, height)),
  unique (font_id, character_key)
);

create table public.generated_patterns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  title text not null default 'Untitled lettering pattern',
  font_source public.font_source_type not null,
  default_font_id text references public.default_fonts(id) on delete set null,
  custom_font_id uuid references public.custom_fonts(id) on delete set null,
  text_content text not null,
  options jsonb not null default '{}'::jsonb,
  width integer not null check (width >= 0),
  height integer not null check (height >= 0),
  grid jsonb not null,
  unsupported_characters text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint generated_patterns_title_not_blank check (length(trim(title)) > 0),
  constraint generated_patterns_source_match check (
    (font_source = 'default' and default_font_id is not null and custom_font_id is null)
    or
    (font_source = 'custom' and custom_font_id is not null and default_font_id is null)
  ),
  constraint generated_patterns_grid_valid check (
    (width = 0 and height = 0 and jsonb_typeof(grid) = 'array' and jsonb_array_length(grid) = 0)
    or public.is_valid_binary_grid(grid, width, height)
  ),
  unique (id, owner_id)
);

create table public.generator_settings (
  owner_id uuid primary key references auth.users(id) on delete cascade,
  selected_default_font_id text references public.default_fonts(id) on delete set null,
  selected_custom_font_id uuid references public.custom_fonts(id) on delete set null,
  text_content text not null default '',
  letter_spacing integer not null default 1 check (letter_spacing >= 0 and letter_spacing <= 32),
  word_spacing integer not null default 3 check (word_spacing >= 0 and word_spacing <= 64),
  line_spacing integer not null default 2 check (line_spacing >= 0 and line_spacing <= 64),
  alignment text not null default 'left' check (alignment in ('left', 'center', 'right')),
  show_grid boolean not null default true,
  show_filled boolean not null default true,
  zoom integer not null default 18 check (zoom >= 4 and zoom <= 64),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint generator_settings_single_selected_font check (
    not (selected_default_font_id is not null and selected_custom_font_id is not null)
  )
);

create table public.pattern_exports (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null,
  pattern_id uuid not null,
  format public.export_format not null,
  storage_path text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  constraint pattern_exports_pattern_owner_fk
    foreign key (pattern_id, owner_id)
    references public.generated_patterns(id, owner_id)
    on delete cascade
);

create index custom_fonts_owner_id_idx on public.custom_fonts(owner_id);
create index custom_fonts_workspace_id_idx on public.custom_fonts(workspace_id);
create index custom_font_characters_font_id_idx on public.custom_font_characters(font_id);
create index generated_patterns_owner_id_idx on public.generated_patterns(owner_id);
create index generated_patterns_workspace_id_idx on public.generated_patterns(workspace_id);
create index pattern_exports_owner_id_idx on public.pattern_exports(owner_id);

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger workspaces_set_updated_at
before update on public.workspaces
for each row execute function public.set_updated_at();

create trigger default_fonts_set_updated_at
before update on public.default_fonts
for each row execute function public.set_updated_at();

create trigger custom_fonts_set_updated_at
before update on public.custom_fonts
for each row execute function public.set_updated_at();

create trigger custom_font_characters_set_updated_at
before update on public.custom_font_characters
for each row execute function public.set_updated_at();

create trigger generated_patterns_set_updated_at
before update on public.generated_patterns
for each row execute function public.set_updated_at();

create trigger generator_settings_set_updated_at
before update on public.generator_settings
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  new_workspace_id uuid;
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.workspaces (owner_id, name)
  values (new.id, 'My stitch library')
  returning id into new_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (new_workspace_id, new.id, 'owner');

  insert into public.generator_settings (owner_id)
  values (new.id)
  on conflict (owner_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.default_fonts enable row level security;
alter table public.custom_fonts enable row level security;
alter table public.custom_font_characters enable row level security;
alter table public.generated_patterns enable row level security;
alter table public.generator_settings enable row level security;
alter table public.pattern_exports enable row level security;

alter table public.profiles force row level security;
alter table public.workspaces force row level security;
alter table public.workspace_members force row level security;
alter table public.default_fonts force row level security;
alter table public.custom_fonts force row level security;
alter table public.custom_font_characters force row level security;
alter table public.generated_patterns force row level security;
alter table public.generator_settings force row level security;
alter table public.pattern_exports force row level security;

create policy "Profiles are visible to their owner"
on public.profiles for select
using (id = auth.uid());

create policy "Users can update their own profile"
on public.profiles for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "Users can see their own workspaces"
on public.workspaces for select
using (owner_id = auth.uid());

create policy "Users can create their own workspaces"
on public.workspaces for insert
with check (owner_id = auth.uid());

create policy "Users can update their own workspaces"
on public.workspaces for update
using (owner_id = auth.uid())
with check (owner_id = auth.uid());

create policy "Users can delete their own workspaces"
on public.workspaces for delete
using (owner_id = auth.uid());

create policy "Users can see memberships for their own workspaces"
on public.workspace_members for select
using (
  user_id = auth.uid()
  or exists (
    select 1 from public.workspaces w
    where w.id = workspace_members.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Users can create their own owner membership"
on public.workspace_members for insert
with check (
  user_id = auth.uid()
  and role = 'owner'
  and exists (
    select 1 from public.workspaces w
    where w.id = workspace_members.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Users can delete memberships in their own workspaces"
on public.workspace_members for delete
using (
  exists (
    select 1 from public.workspaces w
    where w.id = workspace_members.workspace_id
      and w.owner_id = auth.uid()
  )
);

create policy "Public default fonts are readable"
on public.default_fonts for select
using (is_public = true);

create policy "Users can see their own custom fonts"
on public.custom_fonts for select
using (owner_id = auth.uid());

create policy "Users can create their own custom fonts"
on public.custom_fonts for insert
with check (
  owner_id = auth.uid()
  and (
    workspace_id is null
    or exists (
      select 1 from public.workspaces w
      where w.id = custom_fonts.workspace_id
        and w.owner_id = auth.uid()
    )
  )
  and (
    base_custom_font_id is null
    or exists (
      select 1 from public.custom_fonts source_font
      where source_font.id = custom_fonts.base_custom_font_id
        and source_font.owner_id = auth.uid()
    )
  )
);

create policy "Users can update their own custom fonts"
on public.custom_fonts for update
using (owner_id = auth.uid())
with check (
  owner_id = auth.uid()
  and (
    workspace_id is null
    or exists (
      select 1 from public.workspaces w
      where w.id = custom_fonts.workspace_id
        and w.owner_id = auth.uid()
    )
  )
  and (
    base_custom_font_id is null
    or exists (
      select 1 from public.custom_fonts source_font
      where source_font.id = custom_fonts.base_custom_font_id
        and source_font.owner_id = auth.uid()
    )
  )
);

create policy "Users can delete their own custom fonts"
on public.custom_fonts for delete
using (owner_id = auth.uid());

create policy "Users can see characters for their own custom fonts"
on public.custom_font_characters for select
using (owner_id = auth.uid());

create policy "Users can create characters for their own custom fonts"
on public.custom_font_characters for insert
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.custom_fonts f
    where f.id = custom_font_characters.font_id
      and f.owner_id = auth.uid()
  )
);

create policy "Users can update characters for their own custom fonts"
on public.custom_font_characters for update
using (owner_id = auth.uid())
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.custom_fonts f
    where f.id = custom_font_characters.font_id
      and f.owner_id = auth.uid()
  )
);

create policy "Users can delete characters for their own custom fonts"
on public.custom_font_characters for delete
using (owner_id = auth.uid());

create policy "Users can see their own generated patterns"
on public.generated_patterns for select
using (owner_id = auth.uid());

create policy "Users can create their own generated patterns"
on public.generated_patterns for insert
with check (
  owner_id = auth.uid()
  and (
    workspace_id is null
    or exists (
      select 1 from public.workspaces w
      where w.id = generated_patterns.workspace_id
        and w.owner_id = auth.uid()
    )
  )
  and (
    custom_font_id is null
    or exists (
      select 1 from public.custom_fonts f
      where f.id = generated_patterns.custom_font_id
        and f.owner_id = auth.uid()
    )
  )
);

create policy "Users can update their own generated patterns"
on public.generated_patterns for update
using (owner_id = auth.uid())
with check (
  owner_id = auth.uid()
  and (
    workspace_id is null
    or exists (
      select 1 from public.workspaces w
      where w.id = generated_patterns.workspace_id
        and w.owner_id = auth.uid()
    )
  )
  and (
    custom_font_id is null
    or exists (
      select 1 from public.custom_fonts f
      where f.id = generated_patterns.custom_font_id
        and f.owner_id = auth.uid()
    )
  )
);

create policy "Users can delete their own generated patterns"
on public.generated_patterns for delete
using (owner_id = auth.uid());

create policy "Users can see their own generator settings"
on public.generator_settings for select
using (owner_id = auth.uid());

create policy "Users can create their own generator settings"
on public.generator_settings for insert
with check (
  owner_id = auth.uid()
  and (
    selected_custom_font_id is null
    or exists (
      select 1 from public.custom_fonts f
      where f.id = generator_settings.selected_custom_font_id
        and f.owner_id = auth.uid()
    )
  )
);

create policy "Users can update their own generator settings"
on public.generator_settings for update
using (owner_id = auth.uid())
with check (
  owner_id = auth.uid()
  and (
    selected_custom_font_id is null
    or exists (
      select 1 from public.custom_fonts f
      where f.id = generator_settings.selected_custom_font_id
        and f.owner_id = auth.uid()
    )
  )
);

create policy "Users can see their own exports"
on public.pattern_exports for select
using (owner_id = auth.uid());

create policy "Users can create exports for their own patterns"
on public.pattern_exports for insert
with check (
  owner_id = auth.uid()
  and exists (
    select 1 from public.generated_patterns p
    where p.id = pattern_exports.pattern_id
      and p.owner_id = auth.uid()
  )
);

create policy "Users can delete their own exports"
on public.pattern_exports for delete
using (owner_id = auth.uid());
