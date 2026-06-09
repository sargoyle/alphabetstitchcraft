# Navigation And Routing

## Purpose

Define how users move between the app's primary workflows: home, font browsing, font detail, generator, character editor, manage fonts and auth callback. Primary navigation stays minimal, while Editor and Manage Fonts remain reachable through contextual links; Manage Fonts also needs a more prominent contextual entry after being removed from the top navigation.

## Source References

- Layout: `src/app/layout.tsx`
- Home page: `src/app/page.tsx`
- Fonts page: `src/app/fonts/page.tsx`
- Font detail page: `src/app/fonts/[id]/page.tsx`
- Generator page: `src/app/generator/page.tsx`
- Editor page: `src/app/editor/page.tsx`
- Editor client: `src/app/editor/EditorClient.tsx`
- Manage Fonts page: `src/app/custom-fonts/page.tsx`
- Auth callback page: `src/app/auth/callback/page.tsx`
- Component: `FontCard`
- Related accessibility pattern: active route indicator with visual state and `aria-current`.
- Related product decision: contextual access is sufficient for Editor and Manage Fonts.
- Related product decision: Manage Fonts should have a more prominent contextual entry.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Navigation And Routing decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- User navigation clicks.
- Route path and route params.
- Query parameter `font` on editor route.
- Stored selected font id.
- Supabase auth callback state.
- Contextual links from cards and home quick links.
- Remote font loading state.

## Outputs

- Rendered route pages.
- Active route visual indicator in primary navigation.
- `aria-current` for the active primary navigation item.
- Selected font id persisted before generator navigation.
- Editor initial font selection from query parameter.
- Auth callback redirect to Manage Fonts when sign-in completes.
- Loading state before font detail not-found for remote-backed fonts.
- Prominent contextual entry to Manage Fonts outside the primary top navigation.

## State Transitions

1. User opens the app shell.
2. Primary nav shows Home, Fonts and Generator.
3. The active route is indicated visually and semantically.
4. User reaches editor/manage routes through contextual links or direct URL.
5. Manage Fonts is discoverable through a prominent contextual entry.
6. Font card actions route to detail, generator or editor.
7. Font detail Use action stores selected font id and routes to generator.
8. Font detail waits for remote font loading before showing not-found.
9. Auth callback attempts to complete Supabase session and redirects to Manage Fonts.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Primary navigation should be minimal. | Confirmed | Implemented | Rules doc says Home, Fonts and Generator only. |
| Editor and Manage Fonts should remain reachable contextually. | Confirmed | Implemented | User confirmed contextual access is sufficient for Editor and Manage Fonts. |
| Manage Fonts should have a more prominent entry after removal from primary navigation. | Confirmed | Unknown | User confirmed more prominent discoverability is needed; implementation approach needs code/design work. |
| Primary navigation must show an active route indicator. | Confirmed | Not Implemented | User confirmed this known gap. |
| Active route should include semantic state such as `aria-current`. | Assumed | Not Implemented | Recommended for accessibility once visual active state is added. |
| Font detail route must support font id. | Confirmed | Implemented | `/fonts/[id]`. |
| Remote font detail route must wait for loading before showing not found. | Confirmed | Not Implemented | User confirmed this known gap. |
| Editor route should accept selected font query. | Assumed | Implemented | `?font=` is read. |
| Auth callback should return users to Manage Fonts. | Confirmed | Implemented | Callback replaces route. |
| In-app `/docs` pages should not exist. | Confirmed | Implemented | Docs route removed from app nav/surface. |

## Negative Rules

- Must not expose Docs in primary navigation under current decision.
- Must not remove Editor or Manage Fonts routes while contextual links still depend on them.
- Must not require top navigation access for every workflow.
- Must not make Manage Fonts difficult to discover.
- Must not lose selected font when navigating to Generator through Use.
- Must not show a remote font as not found while remote fonts are still loading.
- Must not rely only on colour for the active navigation indicator.

## Acceptance Criteria

- Given the app shell renders, then primary nav shows Home, Fonts and Generator.
- Given a primary route is active, then the matching nav item has a visible active state.
- Given a primary route is active, then the matching nav item exposes `aria-current` or equivalent semantic current-page state.
- Given Home quick links are shown, then Editor and Manage Fonts are reachable.
- Given a user needs font management, then a prominent contextual entry to Manage Fonts is available.
- Given View Alphabet is clicked, then `/fonts/[id]` opens.
- Given Use is clicked, then `/generator` opens and selected font id is saved.
- Given Edit is clicked, then `/editor?font=[id]` opens.
- Given a remote font detail URL is opened while remote fonts are still loading, then loading appears instead of not-found.
- Given auth callback succeeds, then user is routed to `/custom-fonts`.

## Edge Cases

- Invalid font id.
- Missing query parameter.
- Selected font id deleted.
- Auth callback without session.
- Remote font loading delay.
- Small viewport header wrapping.
- Active state for nested routes such as `/fonts/[id]`.
- Direct URL to contextual-only routes.
- User needs Manage Fonts after it has been removed from primary navigation.

## Current Code Behaviour

- Currently primary nav contains Home, Fonts and Generator.
- Currently Home quick links include Editor and Manage Fonts.
- Currently `/docs` app pages are removed, while markdown docs remain in `/docs`.
- Currently FontCard links perform route navigation.
- Currently active nav state is not visually indicated.
- Currently remote font detail route may show not found before remote fonts are available.
- Current implementation status for a more prominent Manage Fonts entry needs verification.

## Known Gaps / Defects

- No active route indicator is shown in primary navigation; this is confirmed as a gap.
- Remote font detail route may show not found before remote fonts are available; this is confirmed as a gap.
- Manage Fonts needs a more prominent contextual entry after removal from primary navigation; implementation needs verification/design work.

## Unclear or Assumed Rules

- None currently for Navigation And Routing. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Primary navigation needs an active route indicator.
- Remote font detail route should wait for loading before showing not found.
- Contextual access is sufficient for Editor and Manage Fonts.
- Manage Fonts should have a more prominent entry after removal from primary navigation.

## Suggested Test Areas

- Primary navigation.
- Active route indicator.
- `aria-current` on active route.
- Home quick links.
- Prominent Manage Fonts contextual entry.
- Font card routes.
- Font detail Use route.
- Remote font detail loading timing.
- Editor query parameter.
- Auth callback behaviour.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
