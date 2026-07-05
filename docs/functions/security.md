# Security Requirements

## Purpose

This document defines the security expectations for Alphabet Stitch. It covers safe handling of user input, local data, generated pattern exports, font data, dependencies, browser storage, environment configuration, and future backend/auth risks.

Alphabet Stitch v1 is primarily a web-based cross-stitch lettering tool. The product should remain practical and lightweight, but the codebase currently includes Supabase persistence for shared custom fonts, so this document also records the security implications of that existing backend integration.

## Source References

- File: `package.json`
  - Reviewed dependencies, scripts, and package manager expectations.
- File: `pnpm-lock.yaml`
  - Lock file exists and was refreshed during the dependency security update.
- File: `pnpm-workspace.yaml`
  - Reviewed pnpm overrides for patched transitive dependency versions.
- File: `eslint.config.mjs`
  - Reviewed ESLint 9 flat config used by the project lint script.
- File: `next.config.ts`
  - Reviewed framework configuration and security header configuration.
- File: `tsconfig.json`
  - Reviewed TypeScript strictness and JSON module usage.
- File: `.eslintrc.json`
  - Reviewed lint configuration.
- File: `.env.local.example`
  - Reviewed public Supabase environment variable names.
- File: `src/lib/fontTypes.ts`
  - Types: `StitchFont`, `StitchCharacter`, `GeneratedPattern`, `GeneratorSettings`, `TextAlignment`.
- File: `src/lib/gridUtils.ts`
  - Functions: `validateCharacter()`, `validateFont()`, `validateUniqueFontIds()`, `resizeCharacter()`, `cloneFont()`.
- File: `src/lib/renderTextToGrid.ts`
  - Function: `renderTextToGrid()`.
  - Related behaviour: unsupported character placeholder, alignment, spacing, generated grid rows.
- File: `src/lib/localStorageUtils.ts`
  - Storage keys: `crossStitch.customFonts`, `crossStitch.deletedFontIds`, `crossStitch.generatorSettings`, `crossStitch.selectedFontId`.
  - Functions: `readJson()`, `writeJson()`, `loadCustomFonts()`, `saveCustomFonts()`, `loadGeneratorSettings()`, `saveGeneratorSettings()`.
- File: `src/lib/exportUtils.ts`
  - Functions: `patternToCanvas()`, `exportPatternPng()`, `downloadJson()`, `exportPatternJson()`, `exportFontJson()`, `copyDesignSize()`.
- File: `src/lib/fontFactory.ts`
  - Function: `createBlankFont()`.
- File: `src/lib/fontPersistence.ts`
  - Functions: `loadRemoteFonts()`, `saveRemoteFont()`, `deleteRemoteFont()`, `toStitchFont()`.
- File: `src/lib/supabaseClient.ts`
  - Functions/values: `getSupabaseClient()`, `isSupabaseConfigured`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- File: `src/lib/useFonts.ts`
  - Hook: `useFonts()`.
  - Related behaviour: local and remote font loading, saving, deletion, migration, persistence status.
- File: `src/data/fonts.json`
  - Default font data source.
- Component: `CharacterGrid`
  - File: `src/components/CharacterGrid.tsx`.
  - Reviewed editable grid rendering and pointer/keyboard events.
- Component: `CharacterEditor`
  - File: `src/components/CharacterEditor.tsx`.
  - Reviewed character edit validation before save.
- Component: `TextPatternPreview`
  - File: `src/components/TextPatternPreview.tsx`.
  - Reviewed generated grid display.
- Component: `ExportControls`
  - File: `src/components/ExportControls.tsx`.
  - Reviewed PNG/JSON export triggers.
- Component: `SpacingControls`
  - File: `src/components/SpacingControls.tsx`.
  - Reviewed numeric input and alignment controls.
- Component: `FontCard`
  - File: `src/components/FontCard.tsx`.
  - Reviewed rendering of font names, descriptions, categories, and actions.
- Component: `FontGridPreview`
  - File: `src/components/FontGridPreview.tsx`.
  - Reviewed sample rendering.
- Page: `src/app/generator/page.tsx`
  - Reviewed typed text flow, settings persistence, preview, and export composition.
- Page: `src/app/fonts/page.tsx`
  - Reviewed font filtering, search, and create font prompt.
- Page: `src/app/custom-fonts/page.tsx`
  - Reviewed shared font creation, rename, delete, and JSON export.
- Page: `src/app/editor/EditorClient.tsx`
  - Reviewed character duplication, destination character handling, save, and delete font action.
- Database migration: `supabase/migrations/202604250001_initial_auth_owned_schema.sql`
  - Reviewed original owner-based schema, validation constraints, and RLS policies.
- Database migration: `supabase/migrations/202604260001_public_custom_fonts_read.sql`
  - Reviewed public read policy for custom fonts.
- Database migration: `supabase/migrations/202604260002_public_custom_fonts_write.sql`
  - Reviewed public create/update/delete policy for custom fonts.
- Source not found: `src/app/api` route handlers.
- Source not found: server actions.
- Source not found: file upload logic.
- Source not found: explicit Content Security Policy or security header configuration.
- Source not found: `dangerouslySetInnerHTML` usage in reviewed source.
- Dependency vulnerability status was confirmed with `pnpm audit --prod` on 2026-07-05; the final audit reported no known vulnerabilities.

## Security Scope

In scope for v1:

- Browser-based user input.
- Generated text rendering.
- Character grid editing.
- Custom font data.
- Browser localStorage.
- PNG export.
- JSON export.
- Font data validation.
- Dependency security review expectations.
- Client-side error handling.
- Browser security headers where supported.
- Current Supabase custom font persistence because it already exists in the codebase.
- Future readiness for auth, backend, uploads, and sharing features.

Out of scope for v1 unless already implemented:

- User accounts as a required product workflow.
- Password management.
- Payments.
- Admin roles.
- Moderated community sharing.
- Cloud sync for private user data.
- Private database records for personal pattern data.
- File uploads.
- Public marketplace features.
- Moderation workflows.

Important current exception: Supabase persistence is already present for shared public custom fonts. The current product direction allows public create, update, and delete access for shared fonts, but that public model must be hardened before public release so vandalism, invalid records, accidental deletion, and abuse are easier to prevent or recover from.

## Data Classification

| Data Type | Example | Sensitivity | Storage Location | Security Requirement |
|---|---|---|---|---|
| Typed pattern text | `HELLO STITCH` | Low to medium, depending on user content | React state, `crossStitch.generatorSettings` in localStorage | Treat as plain text. Do not render as HTML. Warn users not to enter sensitive personal data. |
| Generated pattern grid | `['101', '010']` | Low | React state, JSON export, PNG export | Validate row widths and cell values before saving or exporting where practical. |
| Custom font names | `Sara1` | Low | Supabase `custom_fonts`, localStorage fallback/history | Render as plain text. Validate non-empty and uniqueness if required. |
| Custom character grids | Character rows of `0` and `1` | Low | Supabase `custom_font_characters`, localStorage | Validate dimensions and cell values before saving. |
| Default font data | `src/data/fonts.json` | Low | Source-controlled JSON | Validate on load. Do not mutate default source data through editing. |
| Exported PNG | Generated pattern image | Low to medium if text is personal | User download | Include only pattern image data. Do not include secrets or unrelated data. |
| Exported JSON | Pattern or font object | Low to medium if text/font name is personal | User download | Include only expected app data. Do not include secrets, environment variables, or debug data. |
| App settings | spacing, alignment, zoom | Low | `crossStitch.generatorSettings` in localStorage | Validate numeric bounds before rendering. Handle malformed storage safely. |
| Environment variables | Supabase URL and publishable key | Public if `NEXT_PUBLIC_*`; high if server secret | `.env.local`, client bundle for public vars | Only expose intentionally public variables. Never expose service role keys or secrets client-side. |
| Logs/errors | Persistence messages, export errors | Low to medium | Browser console, UI messages | Provide useful errors without exposing secrets or internal credentials. |

localStorage must be treated as user-controllable browser storage. It is not suitable for passwords, payment details, API keys, tokens, private notes, or highly sensitive personal data.

## Threat Model

| Threat | Example | Risk Level | Current Control | Required Control | Notes |
|---|---|---|---|---|---|
| XSS through user-entered text | User types `<script>alert(1)</script>` into generator | Medium | React renders text and grid through escaped text/classes; no raw HTML found | Continue treating user input as plain text and never use raw HTML rendering for it | Unsupported character handling should remain data-only. |
| XSS through custom font names | Font named `<img onerror=alert(1)>` | Medium | Font names appear through React text nodes and prompt values | Keep font names rendered as text; validate length and characters if needed | Public shared fonts increase exposure. |
| XSS through exported/imported JSON | Malicious JSON included in a future import | Medium | JSON export exists; JSON import was not found | If import is added, validate schema before use and never execute JSON data | Import is future scope. |
| Malformed font grid data causing crashes | Grid row width does not match character width | Medium | `validateCharacter()` and database constraints exist; remote invalid fonts are skipped | Validate all remote/local font data and show user-visible errors for invalid remote data | Silent skipping can hide database problems. |
| localStorage tampering | User edits `crossStitch.customFonts` manually | Medium | `readJson()` catches parse errors; `loadCustomFonts()` filters by `validateFont()` | Show recovery path and do not silently ignore corrupted app data | Current fallback may hide corruption. |
| localStorage quota exceeded | Browser refuses to save custom font | Medium | No catch around `writeJson()` | Catch write failures and show retry/recovery message | Less relevant while database writes are primary, but generator settings still use storage. |
| Unsafe rendering of user-generated content | Rendering font description with raw HTML | Medium | No `dangerouslySetInnerHTML` found in reviewed source | Do not introduce raw HTML rendering for user-generated values | Maintain React escaping. |
| Dependency vulnerabilities | Vulnerable package in dependency tree | Medium | Lock file exists | Run dependency audit before public release and during maintenance | Audit not performed for this document. |
| Accidental exposure of environment variables | Service role key added as `NEXT_PUBLIC_*` | High | Only public Supabase vars shown in `.env.local.example` | Never prefix secrets with `NEXT_PUBLIC_`; keep service keys server-only | `.env.local` contents were not read. |
| Unsafe external scripts | Third-party CDN script injected into app | Medium | No external scripts/CDNs found in reviewed source | Avoid unnecessary external scripts and configure CSP if practical | Future analytics needs review. |
| Export mismatch or unsafe generated file content | Export differs from visible preview | Medium | PNG export renders from generated grid; preview visibility options may differ | Export should match approved preview settings or warn clearly | Product decisions already favour preview/export consistency. |
| Denial-of-service style behaviour from huge text/grids | User pastes enormous text and browser locks | Medium | No explicit input/grid size limit found | No maximum input or grid size limit is required by product decision; rendering should still fail safely if the browser cannot complete the work | User has confirmed no fixed maximum for v1. |
| Browser compatibility affecting storage/export | Clipboard, canvas, or localStorage unavailable | Low to medium | Some export errors are caught; localStorage read guards exist | Handle missing/disabled browser APIs with inline errors | JSON export error handling is less explicit. |
| Public database write abuse | Anyone edits/deletes shared fonts | High | Current migration allows public insert/update/delete | Harden the public editing model with validation, recovery, monitoring, rate-limiting or equivalent safeguards; admin-only editing is not required for the current product direction | This is the largest current security/integrity concern. |
| Future backend/auth risk | Accounts, uploads, or sharing added without server validation | High | Initial migration has owner-based model, later migration relaxes custom font writes | Expand this spec before backend/auth/uploads/community features are implemented | Client checks alone are not enough. |

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| User-entered text must be treated as plain text, not HTML. | Confirmed | Implemented | React rendering and grid rendering do not use raw HTML for text. |
| Font names, custom font names, character labels, descriptions, and metadata must be rendered as text, not HTML. | Confirmed | Implemented | Reviewed components render values through JSX text nodes. |
| The app must not use `dangerouslySetInnerHTML` for user-generated content. | Confirmed | Implemented | No usage found in reviewed source. |
| Unsupported characters must be handled safely. | Confirmed | Partially Implemented | Renderer uses data placeholders and warnings, but duplicate counts/tabs requirements remain product-specific gaps elsewhere. |
| Invalid grid data must be rejected or safely normalised. | Confirmed | Partially Implemented | Utility and database validation exist; persistence does not consistently show invalid remote fonts to users. |
| Extremely large text input should be handled safely to avoid browser lock-ups, but v1 must not enforce a fixed maximum text length or generated grid size. | Confirmed | Partially Implemented | Product decision: no fixed maximum text input length and no fixed maximum generated grid size. Current code has no explicit safe-failure handling for very large renders. |
| Font IDs must be unique. | Confirmed | Partially Implemented | Utility exists; full enforcement across local plus remote merged fonts is not clearly user-visible. |
| Character keys must be unique within a font. | Confirmed | Implemented | Object keys and database unique constraint support this; editor prevents accidental replacement unless confirmed. |
| Grid rows must match declared width. | Confirmed | Implemented | `validateCharacter()` and database `is_valid_binary_grid()` check this. |
| Grid row count must match declared height. | Confirmed | Implemented | `validateCharacter()` and database constraints check this. |
| Grid values must only contain valid cell values, for example `0` and `1`. | Confirmed | Implemented | `validateCharacter()` and database constraints check binary rows. |
| Default font data must not be mutated by user edits. | Confirmed | Implemented | `cloneFont()` and save flows create edited font objects; source JSON is not written by the app. |
| Custom font data must be validated before saving. | Confirmed | Partially Implemented | Character editor validates character data before save; `saveRemoteFont()` does not itself validate the full font before upsert. |
| Imported JSON, if supported, must be validated before use. | Confirmed | Not Implemented | JSON import was not found. Requirement applies if import is added later. |
| localStorage must only store non-sensitive app data. | Confirmed | Implemented | Current storage is fonts, deleted IDs, selected font, and generator settings. |
| localStorage reads must handle missing, malformed, stale, or tampered data. | Confirmed | Partially Implemented | Parse errors fall back safely; user-visible recovery is missing. |
| localStorage writes must handle quota errors. | Confirmed | Not Implemented | `writeJson()` does not catch write failures. |
| Stored custom fonts must not automatically execute code. | Confirmed | Implemented | Stored data is parsed as JSON and rendered as React text/grid data. |
| The app should provide a safe way to reset or clear local custom data. | Confirmed | Not Implemented | No dedicated reset/clear local data control found. |
| PNG export must use generated grid data, not raw HTML. | Confirmed | Implemented | `patternToCanvas()` draws from `GeneratedPattern.grid`. |
| JSON export, if supported, must only include expected app data. | Confirmed | Implemented | Current JSON export serialises pattern/font objects passed to export helpers. |
| Exported files must not include secrets, environment variables, internal debug data, or unrelated browser data. | Confirmed | Implemented | No code path found that includes env vars or browser storage in exports. |
| Export must handle empty or invalid patterns safely. | Confirmed | Partially Implemented | Export buttons are disabled for empty text; invalid grid handling is not explicit in export helpers. |
| Export must not generate a different pattern from the visible preview without warning. | Confirmed | Partially Implemented | PNG uses the same generated grid, but export visibility options may not fully match preview settings. |
| The app should use security headers where supported by the hosting platform. | Confirmed | Implemented | Security headers are configured in `next.config.ts`. |
| The app should configure a Content Security Policy immediately. | Confirmed | Implemented | CSP is configured in `next.config.ts`. |
| The app may use external fonts or scripts when they are justified and trusted. | Confirmed | Implemented | Product decision: external fonts/scripts do not need to remain blocked unless explicitly approved. No external scripts/CDNs are currently used. |
| External assets should be trusted and documented when added. | Confirmed | Implemented | No external images/fonts/scripts found in reviewed source. |
| Secrets must not be exposed to the client bundle. | Confirmed | Partially Implemented | Only public Supabase vars are referenced. Actual `.env.local` was not read, so secret exposure cannot be fully confirmed. |
| Environment variables intended for the browser must be explicitly prefixed according to framework rules. | Confirmed | Implemented | Supabase browser values use `NEXT_PUBLIC_` prefixes. |
| Error messages should be useful but should not expose sensitive internals. | Confirmed | Partially Implemented | Errors are surfaced via alerts/status messages. Sensitive data exposure was not seen, but consistency is incomplete. |
| Dependencies should be kept minimal. | Confirmed | Unknown | Dependency count appears modest, but no unused dependency audit was run. |
| Unused dependencies should be removed. | Confirmed | Unknown | Not audited. |
| Dependency vulnerabilities should be reviewed. | Confirmed | Unknown | No vulnerability audit was run for this document. |
| Build scripts should not rely on untrusted remote code. | Confirmed | Implemented | Package scripts are local framework/build scripts. |
| Package manager lock files should be committed. | Confirmed | Implemented | `pnpm-lock.yaml` exists. |
| If future versions add accounts, cloud sync, uploads, sharing, payments, or community fonts, this security spec must be expanded before implementation. | Confirmed | Partially Implemented | Future risks are documented here; no future implementation should proceed without a security update. |
| Current shared custom font writes must remain public but be hardened before public deployment. | Confirmed | Implemented at baseline level | Font validation, duplicate-name prevention, invalid remote font warnings, database-backed backups, restore tools and simple recent-backup activity visibility are implemented. More advanced abuse monitoring can be considered later. |

### Future backend/auth readiness

If future versions add accounts, cloud sync, uploads, sharing, payments, or community fonts, the security specification must be expanded before implementation.

Future requirements should include:

- Authentication.
- Authorisation.
- Secure session management.
- Server-side validation.
- Rate limiting.
- Upload validation.
- Content moderation.
- Audit logging.
- Privacy policy requirements.
- Account deletion and data export.
- Secure database access rules.

## Negative Rules

- The app must not render user-entered text as HTML.
- The app must not execute data from localStorage.
- The app must not trust localStorage data without validation.
- The app must not mutate default font data when editing custom fonts.
- The app must not store passwords, payment details, API keys, tokens, or sensitive personal data in localStorage.
- The app must not expose server secrets in client-side code.
- The app must not silently ignore corrupted custom font data.
- The app must not allow malformed grid data to crash the whole app.
- The app must not import unvalidated JSON as executable or trusted data.
- The app must not rely on client-side checks as the only security control if backend features are added later.
- The app must not ship public database write access without public-use hardening, validation, recovery, and abuse-management decisions in place.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Security Requirements decisions captured in this document. | N/A | N/A | N/A |

Resolved decisions:

- No maximum text input length is required for v1.
- No maximum generated grid width or height is required for v1.
- JSON export remains a utility feature and JSON import is not part of v1.
- A clear local data/reset button is not required now.
- Custom font names should be globally unique in the shared database.
- Public database font editing should not be replaced with admin-only editing at this stage.
- CSP and security headers should be configured immediately.
- External fonts and scripts do not need to remain blocked unless explicitly approved.
- Analytics approach decisions are tracked in `docs/tasks.md` and should be answered before analytics implementation.
- Public font hardening should use validation, edit history or backups, restore tools and simple abuse monitoring.
- PNG export should remain image-only unless future print metadata is confirmed.

### Public font hardening options explained

Public font hardening means keeping public create, edit, rename and delete available, while adding safeguards so the shared font library can recover from mistakes or abuse.

Options include:

- Validation: reject invalid font names, duplicate names, invalid grids and malformed records before they are saved.
- Backups or edit history: keep previous versions so accidental or malicious changes can be restored.
- Restore tools: make it easy to roll a font back to a known good version.
- Rate limiting: slow down repeated edits or deletes from the same browser, IP or user context.
- Moderation or admin review: require approval for some changes, especially deletes or suspicious edits.
- Abuse monitoring: surface unusual activity, invalid records or repeated destructive actions.

Confirmed public font hardening controls: validation, edit history or backups, restore tools and simple abuse monitoring. This keeps the app public and editable without making it fragile.
## Acceptance Criteria

- Given the user enters text containing HTML tags, when the preview renders, then the tags are displayed as plain text or unsupported characters and are not executed.
- Given a custom font name contains HTML-like text, when it is displayed in the UI, then it is rendered as plain text and not interpreted as HTML.
- Given localStorage contains malformed custom font data, when the app loads, then the app does not crash and the user is shown a safe recovery path.
- Given a character grid row has invalid values, when validation runs, then the grid is rejected or normalised according to the documented rule.
- Given a user enters extremely long text, when the preview renders, then the app does not enforce a fixed product limit but still fails safely or warns if the browser cannot complete rendering.
- Given PNG export is triggered, when the export completes, then the file contains only the generated pattern image and no secrets or unrelated app data.
- Given JSON export is triggered, when the export completes, then the JSON contains only expected pattern/font data.
- Given default font data exists, when a user edits a duplicated custom font, then the original default font data remains unchanged.
- Given invalid alignment or spacing values are supplied, when rendering runs, then values are rejected, normalised, or safely handled according to documented rules.
- Given no backend exists, when reviewing security scope, then account, password, role and database security are marked out of scope for v1 but listed as future requirements.
- Given the current Supabase custom font write policy is enabled, when reviewing deployment readiness, then public create/update/delete access is identified as a high-risk integrity issue that requires public-use hardening rather than admin-only replacement.
- Given a shared font is updated, renamed, restored or deleted, when the operation runs, then the previous database-saved font state is stored in `custom_font_backups` before the destructive change completes.
- Given recent backups exist for a shared font, when the user views Manage Fonts, then restore actions are available for recent backups.
- Given a remote font fails schema validation, when remote fonts are loaded, then the app shows an error that needs attention instead of silently hiding the invalid record.
- Given localStorage quota is exceeded, when the app attempts to save generator settings or local fallback data, then the app shows a clear error and does not imply the save succeeded.

## Edge Cases

- Empty user input.
- Whitespace-only user input.
- Very long user input.
- Repeated line breaks.
- Unsupported characters.
- HTML-like text input.
- Script-like text input.
- Malformed custom font data.
- Missing localStorage.
- localStorage disabled.
- localStorage quota exceeded.
- Corrupted localStorage records.
- Duplicate custom font IDs.
- Duplicate custom font names.
- Invalid grid dimensions.
- Invalid cell values.
- Invalid alignment values.
- Invalid spacing values.
- Export with empty pattern.
- Export with huge pattern.
- External dependency unavailable.
- Environment variables accidentally referenced in client code.
- Supabase configured but unavailable.
- Supabase configured with public write policies.
- Remote database contains invalid custom font rows.
- Browser blocks clipboard or canvas export APIs.

## Current Code Behaviour

- The app currently renders user-entered text into grid data through `renderTextToGrid()` and displays grid cells through React components.
- The app currently appears to render font names, descriptions, categories, and labels through JSX text nodes, not raw HTML.
- The reviewed source does not appear to use `dangerouslySetInnerHTML`.
- `renderTextToGrid()` currently handles unsupported characters using a placeholder character grid and an unsupported character list.
- `renderTextToGrid()` currently does not enforce explicit text length, grid width, or grid height limits.
- `SpacingControls` currently uses HTML number inputs with min/max attributes, but values are passed through `Number()` and are not independently clamped or rejected inside the renderer.
- `validateCharacter()` currently checks positive integer dimensions, row count, row width, and binary cell values.
- `validateFont()` currently validates basic font metadata and all character grids.
- `loadCustomFonts()` currently filters localStorage custom fonts through `validateFont()`.
- `readJson()` currently catches malformed JSON parse errors and returns fallback data.
- `writeJson()` currently writes to localStorage without catching quota or storage availability errors.
- Remote font loading currently converts Supabase rows to `StitchFont` objects and returns valid fonts plus invalid font warnings.
- Invalid remote fonts currently appear in font sync warnings for user attention.
- Character editor saves currently validate the edited character before calling `onSave()`.
- `saveRemoteFont()` currently validates the full font before writing font and character rows to Supabase.
- `saveRemoteFont()` currently creates a database-backed backup of the previous font state before update and restore writes when the font already exists.
- `deleteRemoteFont()` currently creates a database-backed backup before deleting a shared database font.
- `loadRemoteFontBackups()` currently reads the five most recent valid backups for each shared database font.
- `restoreRemoteFontBackup()` currently validates a backup snapshot and restores it through the same remote save path.
- The Manage Fonts page currently shows recent backup restore controls for fonts with backup history.
- PNG export currently draws from `GeneratedPattern.grid` using canvas and does not export raw HTML.
- JSON export currently serialises pattern/font objects provided to the helper.
- Export controls currently disable export for empty trimmed text.
- `next.config.ts` currently configures security headers and a Content Security Policy.
- `.env.local.example` currently documents only `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- No API routes, server actions, file upload logic, external scripts, external fonts, analytics scripts, or CDN dependencies were found in the reviewed source.
- Supabase migrations currently show a shift from owner-based RLS to public custom font read and public custom font write/delete policies.
- Supabase migrations currently include `custom_font_backups` for public read/insert backup snapshots.

## Known Gaps / Defects

- No explicit text input length limit was found. This is now product-confirmed for v1, but safe handling for browser stress cases is still needed.
- No generated grid width or height limit was found. This is now product-confirmed for v1, but safe handling for browser stress cases is still needed.
- Content Security Policy is now configured in `next.config.ts`.
- Security headers are now configured in `next.config.ts`.
- Production dependency vulnerabilities were reviewed on 2026-07-05 and the final `pnpm audit --prod` run reported no known vulnerabilities.
- localStorage writes do not appear to handle quota or disabled-storage errors.
- Corrupted localStorage data can be ignored through fallback behaviour without a clear user recovery path.
- Invalid remote fonts are now surfaced through font sync warnings, but the final UX should still be reviewed.
- `saveRemoteFont()` now validates the full font object before writing to Supabase.
- Current Supabase custom font policies allow public create, update, and delete access. This is product-confirmed and now has baseline public hardening through validation, duplicate-name prevention, invalid remote font warnings, backups and restore tools.
- Public-use hardening now has a baseline implementation; future improvements could add stronger rate limiting, dashboards, moderation workflows or admin review if abuse appears.
- Renderer-level validation for invalid alignment and spacing values is incomplete or unclear.
- PNG export uses generated grid data, but preview/export visibility consistency is not fully guaranteed by the export helper.
- JSON import is not present; if added later, schema validation must be designed first.
- A safe reset/clear-local-data workflow was not found.

## Unclear or Assumed Rules

- None currently for Security Requirements. The public font hardening controls have been confirmed.

Confirmed decisions now captured in this document:

- v1 should avoid storing sensitive personal data because the tool is for lettering patterns, not private records.
- Supabase public custom font writes are intended for the public product, but the system must be hardened for public use.
- JSON export remains a utility feature and JSON import is not part of v1.
- PNG export should be image-only unless future print metadata is explicitly confirmed.
- No maximum text input length should be enforced for v1.
- No maximum generated grid width or height should be enforced for v1.
- The app does not need a clear local data/reset button now.
- Custom font names should be globally unique in the shared database.
- Public database font editing should not be replaced with admin-only editing before deployment.
- CSP and security headers should be configured immediately.
- External fonts and scripts do not need to remain blocked unless explicitly approved.
- Analytics approach decisions are tracked in `docs/tasks.md` and should be answered before analytics implementation.
- Public font hardening should use validation, edit history or backups, restore tools and simple abuse monitoring.
## Suggested Test Areas

- XSS-safe rendering.
- Plain-text rendering of user content.
- Custom font name rendering.
- Custom font validation.
- Grid validation.
- Remote invalid font handling.
- localStorage malformed data handling.
- localStorage quota handling.
- Export data safety.
- PNG export content safety.
- JSON export content safety.
- Default font immutability.
- Oversized input safe-failure handling without fixed product limits.
- Generated grid size safe-failure handling without fixed product limits.
- Dependency/security scanning.
- Environment variable exposure.
- Invalid settings handling.
- Preview/export consistency.
- Supabase public write hardening review.
- Admin/auth permission behaviour if added later.

## Review Checklist

- [ ] Security scope is confirmed.
- [ ] Data classification is confirmed.
- [ ] Product decisions are answered.
- [ ] Assumptions are accepted or corrected.
- [ ] Known security gaps are triaged.
- [ ] Acceptance criteria are ready to convert into tests.












