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
- Implemented endpoint: `src/app/api/keep-alive/route.ts`
- Existing route handlers: `/api/keep-alive` is currently the only app API route found for this feature area.

Note: `src/lib/supabaseClient.ts` is currently marked with `"use client"`. The endpoint should reuse the same Supabase URL and anon-key configuration, but implementation may need a server-safe Supabase helper for route handlers rather than importing a client-only module directly.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Keep-Alive Endpoint decisions captured in this document. | N/A | N/A | N/A |

Resolved decision:

- The endpoint queries `custom_fonts` using a count-only, read-only request.

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
| The endpoint must exist at `/api/keep-alive`. | Confirmed | Implemented | Implemented in `src/app/api/keep-alive/route.ts`. |
| The endpoint must be public. | Confirmed | Implemented | Route has no auth requirement. |
| The endpoint must perform a Supabase query. | Confirmed | Implemented | Uses Supabase client with existing public URL/key config. |
| The Supabase query must be read-only. | Confirmed | Implemented | Uses `select()` only. |
| The query must fetch only one row or one count. | Confirmed | Implemented | Uses a count-only `select("id", { count: "exact", head: true })`. |
| The success response should be simple JSON such as `{ "status": "ok" }`. | Confirmed | Implemented | Returns `{ "status": "ok" }`. |
| Failed Supabase queries must return an error response. | Confirmed | Implemented | Returns JSON error with HTTP 500 on query failure. |
| The endpoint must not expose secret keys in frontend code or responses. | Confirmed | Implemented | Uses public anon config and does not return env values. |
| The endpoint should use existing Supabase configuration. | Confirmed | Implemented | Uses the same `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` env values. |
| The route should not log or return sensitive internals. | Assumed | Implemented | Returns a generic failure message, not the raw Supabase error. |
| The endpoint should support `GET` only unless another method is explicitly needed. | Assumed | Implemented | Only `GET` is exported. |

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

- `/api/keep-alive` currently exists as a Next.js route handler.
- Existing Supabase configuration uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in `src/lib/supabaseClient.ts`.
- Existing Supabase client helper is marked `"use client"`, so the route handler creates a server-safe Supabase client directly using the same public env values.
- The endpoint currently performs a count-only, read-only query against `custom_fonts`.
- The endpoint currently returns `{ "status": "ok" }` on success.
- The endpoint currently returns a 503 JSON error when Supabase env values are missing.
- The endpoint currently returns a 500 JSON error when the Supabase query fails.
- Existing Supabase persistence reads and writes custom font data through Supabase.
- Current migrations define public custom font read/write policies.

## Known Gaps / Defects

- No automated route test exists yet for `/api/keep-alive`.
- No keep-alive monitoring or ping schedule is documented yet.

## Unclear or Assumed Rules

- Assumption: The endpoint should use `GET` only.
- Assumption: A count-only query is preferred over fetching row data.

## Confirmed Product Decisions

- Querying `custom_fonts` is acceptable for the keep-alive check.
- The endpoint returns only `{ "status": "ok" }` on success.

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


