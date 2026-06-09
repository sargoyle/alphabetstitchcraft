# Keep-Alive Endpoint

## Purpose

Provide a simple public API endpoint at `/api/keep-alive` that can be pinged to keep the Supabase project active. The endpoint should perform a lightweight read-only Supabase query against an existing table and return a small JSON response.

This feature is operational only. It must not create, update or delete app data, and it must not expose secret keys to the frontend.

Created to satisfy the project rule that every new function or feature must have a matching function requirements page.

## Source References

- Required route: `src/app/api/keep-alive/route.ts`
- Existing Supabase config: `src/lib/supabaseClient.ts`
- Existing database types: `src/lib/databaseTypes.ts`
- Existing Supabase persistence utilities: `src/lib/fontPersistence.ts`
- Existing Supabase migrations:
  - `supabase/migrations/202604250001_initial_auth_owned_schema.sql`
  - `supabase/migrations/202604260001_public_custom_fonts_read.sql`
  - `supabase/migrations/202604260002_public_custom_fonts_write.sql`
- Related security documentation: `docs/functions/security.md`
- Source not found: existing `src/app/api` route handlers.
- Evidence gap: endpoint implementation does not exist yet.

Note: `src/lib/supabaseClient.ts` is currently marked with `"use client"`. The endpoint should reuse the same Supabase URL and anon-key configuration, but implementation may need a server-safe Supabase helper for route handlers rather than importing a client-only module directly.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| Supabase table to query | `custom_fonts` / `default_fonts` / another existing public table | Query `custom_fonts` with a count-only or one-row read because it is part of the current shared font persistence model | Choosing the wrong table could fail under RLS or not exercise the database connection used by the app. |

## Inputs

- Public HTTP `GET` request to `/api/keep-alive`.
- Supabase project URL from existing environment configuration.
- Supabase public/anon key from existing environment configuration.
- Existing Supabase table selected for a lightweight read-only query.

## Outputs

- Successful response: JSON body such as `{ "status": "ok" }`.
- Failed response: JSON error body with an appropriate non-2xx HTTP status.
- No created, updated or deleted database records.
- No secret keys, tokens or internal credentials in the response.

## State Transitions

1. External monitor or user sends a `GET` request to `/api/keep-alive`.
2. API route creates or obtains a Supabase client using existing public configuration.
3. API route performs a lightweight read-only query against an existing table.
4. Query fetches at most one row or one count.
5. If the query succeeds, route returns `{ "status": "ok" }`.
6. If the query fails, route returns a JSON error response.
7. No app data is created, updated or deleted.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| The endpoint must exist at `/api/keep-alive`. | Confirmed | Not Implemented | User requirement. |
| The endpoint must be public. | Confirmed | Not Implemented | User wants to ping it externally. |
| The endpoint must perform a Supabase query. | Confirmed | Not Implemented | Query keeps the database connection active. |
| The Supabase query must be read-only. | Confirmed | Not Implemented | Must not insert, update, upsert or delete. |
| The query must fetch only one row or one count. | Confirmed | Not Implemented | Keep-alive should be lightweight. |
| The success response should be simple JSON such as `{ "status": "ok" }`. | Confirmed | Not Implemented | Keep response small and predictable. |
| Failed Supabase queries must return an error response. | Confirmed | Not Implemented | Do not report success if Supabase failed. |
| The endpoint must not expose secret keys in frontend code or responses. | Confirmed | Not Implemented | Use only existing public config and never return key values. |
| The endpoint should use existing Supabase configuration. | Confirmed | Not Implemented | May require a server-safe helper using the same env values. |
| The route should not log or return sensitive internals. | Assumed | Not Implemented | Error response should be useful but not leak credentials. |
| The endpoint should support `GET` only unless another method is explicitly needed. | Assumed | Not Implemented | Keep the public surface minimal. |

## Negative Rules

- Must not create database records.
- Must not update database records.
- Must not delete database records.
- Must not perform expensive table scans.
- Must not fetch full font payloads or character grids.
- Must not expose Supabase anon key, service role key, tokens or environment values in the response.
- Must not require a frontend page or browser-only code path.
- Must not rely on a secret service role key for this public endpoint.
- Must not return `{ "status": "ok" }` if the Supabase query fails.

## Acceptance Criteria

- Given a `GET` request to `/api/keep-alive`, when Supabase is configured and the read-only query succeeds, then the route returns a 200 response with `{ "status": "ok" }`.
- Given a `GET` request to `/api/keep-alive`, when the Supabase query fails, then the route returns a non-2xx JSON error response.
- Given the endpoint runs, when it queries Supabase, then it fetches only one row or one count.
- Given the endpoint runs, when inspecting database effects, then no records are created, updated or deleted.
- Given the endpoint response is inspected, then no Supabase keys, tokens or environment variable values are present.
- Given the endpoint is implemented in a Next.js route handler, then it does not import browser-only code if that causes server-route issues.
- Given the app is deployed, when an external ping service calls the endpoint, then the endpoint can be reached without user authentication.

## Edge Cases

- Supabase environment variables are missing.
- Supabase URL is invalid.
- Supabase anon key is invalid.
- Selected table does not exist.
- Selected table is blocked by RLS or permissions.
- Selected table has zero rows.
- Supabase is paused, cold or temporarily unavailable.
- Network request times out.
- Endpoint receives unsupported HTTP methods.
- External monitor calls the endpoint frequently.
- Error object contains sensitive details and must be sanitised before response.

## Current Code Behaviour

- No `/api/keep-alive` route currently appears to exist.
- Existing Supabase configuration uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `src/lib/supabaseClient.ts`.
- Existing Supabase client helper is marked `"use client"`, so a route handler may need a server-safe helper rather than importing it directly.
- Existing Supabase persistence reads and writes custom font data through Supabase.
- Current migrations define public custom font read/write policies.

## Known Gaps / Defects

- `/api/keep-alive` is not implemented yet.
- A server-safe Supabase route helper may be needed because the existing helper is client-marked.
- The exact table to query is not yet confirmed, though `custom_fonts` is recommended.
- No keep-alive monitoring or ping schedule is documented yet.

## Unclear or Assumed Rules

- Assumption: The endpoint should use `GET` only.
- Assumption: Querying `custom_fonts` is acceptable for the keep-alive check.
- Assumption: A count-only query is preferred over fetching row data.
- Needs confirmation: Should the endpoint return only `{ "status": "ok" }`, or may it include harmless details such as a timestamp?

## Suggested Test Areas

- Successful `GET /api/keep-alive` response.
- Supabase failure response.
- Missing environment configuration.
- Read-only database behaviour.
- Count-only or one-row query behaviour.
- No secret exposure in response.
- Unsupported HTTP methods.
- Route handler compatibility with server runtime.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.


