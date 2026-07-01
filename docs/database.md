# Database and Row-Level Security

## Database Choice

The database foundation is written for Supabase Postgres. Supabase Auth remains available for future private accounts or collaboration, but the current font-library workflow does not require login.

Migration file:

```text
supabase/migrations/202604250001_initial_auth_owned_schema.sql
```

Default font seed migration:

```text
supabase/migrations/202607010001_seed_default_fonts.sql
```

The seed migration is idempotent and mirrors `src/data/fonts.json`. Re-run it if
`default_fonts` is empty or if a Supabase project is reset.

TypeScript contract:

```text
src/lib/databaseTypes.ts
```

## Ownership Model

Every private table links data to the authenticated user through `owner_id` or `id = auth.uid()`.

Private user-owned data:

- `profiles`
- `workspaces`
- `workspace_members`
- `custom_fonts`
- `custom_font_characters`
- `generated_patterns`
- `generator_settings`
- `pattern_exports`

Public reference data:

- `default_fonts`

Default fonts are readable by everyone when `is_public = true`. User-created fonts are public shared reference data so all users can browse, use, create, edit, rename and delete them. Generated patterns and account-owned settings remain private by default if those features are used later.

## Future Collaboration Shape

The schema includes `workspaces` and `workspace_members` now so collaboration can be added later without replacing the data model.

For v1, RLS policies allow public read and write access to user-created fonts so the app can work without login. Private records such as generated patterns, settings and exports remain owner-only. Future collaboration can tighten custom-font policies again and extend access through workspace membership, for example:

```sql
or exists (
  select 1
  from public.workspace_members wm
  where wm.workspace_id = target.workspace_id
    and wm.user_id = auth.uid()
)
```

Do not add that access until collaboration is intentionally designed and tested.

## Tables

### profiles

One row per authenticated user.

Relationship:

- `profiles.id` references `auth.users.id`

RLS:

- Users can select and update only their own profile.

### workspaces

Personal ownership container for user data.

Relationship:

- `workspaces.owner_id` references `auth.users.id`

RLS:

- Users can select, create, update and delete only workspaces they own.

### workspace_members

Future-ready membership table.

Relationship:

- `workspace_members.workspace_id` references `workspaces.id`
- `workspace_members.user_id` references `auth.users.id`

RLS:

- Users can see their own memberships.
- Workspace owners can see and delete memberships in their workspaces.
- V1 insert policy only allows a user to create their own `owner` membership in their own workspace.

### default_fonts

Public reference stitch font data.

Seed source:

- `src/data/fonts.json`
- `supabase/migrations/202607010001_seed_default_fonts.sql`

RLS:

- Anyone can select rows where `is_public = true`.
- No client insert, update or delete policies are provided.

### custom_fonts

Shared user-created font records.

Relationship:

- `custom_fonts.owner_id` references `auth.users.id` when a future authenticated owner is used. It is nullable in the public shared-library workflow.
- `custom_fonts.workspace_id` references `workspaces.id`
- `custom_fonts.base_default_font_id` references `default_fonts.id`
- `custom_fonts.base_custom_font_id` references `custom_fonts.id`
- Brand-new blank fonts may leave both base font fields empty.

RLS:

- Everyone can select custom fonts.
- Anyone can create, update and delete custom fonts.
- Inserts may leave `owner_id` and workspace fields empty.

Client persistence:

- Browser-created fonts use UUID IDs so they can be stored directly in `custom_fonts`.
- Created fonts are visible to all users and editable by all users.
- Signed-out or unconfigured environments should not silently save newly created fonts to browser-only storage.
- Local UUID custom fonts are attempted for upload once database sync is configured.
- Duplicated bundled fonts must use a `base_default_font_id` that exists in seeded `default_fonts`.

### custom_font_characters

Editable character grids belonging to a custom font.

Relationship:

- `font_id` references `custom_fonts(id)` with cascade delete.

RLS:

- Everyone can select custom font characters.
- Anyone can create, update and delete custom font characters.
- Inserts and updates must reference an existing custom font.

Validation:

- `width` and `height` are bounded.
- `grid` must be a JSON array of binary strings matching width and height.

### generated_patterns

Saved text rendering output.

Relationship:

- `generated_patterns.owner_id` references `auth.users.id`
- `generated_patterns.workspace_id` references `workspaces.id`
- `generated_patterns.default_font_id` references `default_fonts.id`
- `generated_patterns.custom_font_id` references `custom_fonts.id`

RLS:

- Users can select, create, update and delete only their own generated patterns.
- Inserts must reference the user's own workspace when `workspace_id` is present.
- Custom-font patterns must use a custom font owned by the current user.

Validation:

- Font source must match either default or custom font fields.
- Pattern grid must be valid binary grid data.

### generator_settings

One persisted generator settings row per user.

Relationship:

- `generator_settings.owner_id` references `auth.users.id`

RLS:

- Users can select, create and update only their own settings.
- Selected custom font must be owned by the current user.

### pattern_exports

Export audit/history records for generated patterns.

Relationship:

- Composite foreign key `(pattern_id, owner_id)` references `generated_patterns(id, owner_id)`

RLS:

- Users can select, create and delete only exports for their own patterns.

## Auth Hook

The migration creates `public.handle_new_user()` and attaches it to `auth.users`.

When a user signs up, it creates:

- A profile.
- A personal workspace.
- An owner membership for that workspace.
- A default generator settings row.

## Applying the Migration

With Supabase CLI:

```bash
supabase db push
```

Or paste the migration SQL into the Supabase SQL editor for the target project.

## Security Checklist

- RLS is enabled on all app tables.
- RLS is forced on all app tables.
- Private tables require `owner_id = auth.uid()` or equivalent.
- Child tables use composite foreign keys with `owner_id` where needed.
- Public default font data has read-only client access.
- No policy allows a user to read another user's private generated patterns, settings or exports.
- Public custom fonts are intentionally readable and mutable by all users for the no-login shared-library workflow.
