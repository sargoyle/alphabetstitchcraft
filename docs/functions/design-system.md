# Design System

## Purpose

The in-app design system provides a live, reusable UI/UX foundation for future interface work. It documents and demonstrates tokens, base UI components and table-style layout patterns without changing existing app behaviour.

## Source References

- Route: `src/app/design-system/page.tsx`
- Tokens: `src/design-system/tokens.ts`
- UI components: `src/components/ui/Button.tsx`, `Panel.tsx`, `Badge.tsx`, `Modal.tsx`, `EmptyState.tsx`, `Toast.tsx`
- Layout display components: `src/components/layout/DisplayCard.tsx`, `ParticipantArea.tsx`, `ItemRail.tsx`, `LayoutBoard.tsx`, `StackSlot.tsx`, `MetricBadge.tsx`, `ActivityLog.tsx`, `PromptCard.tsx`
- Styling: `src/app/globals.css`
- Guidance: `src/design-system/componentGuidelines.md`, `layoutGuidelines.md`, `layoutUxRules.md`

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| Go-live visibility for `/design-system` | Hide before launch / keep public / protect behind admin | Hide before public go-live, while keeping direct URL access during development | Design reference page may be exposed publicly after launch |

## Inputs

- Existing app theme values from `globals.css`
- Requested component list
- Static sample content used only on `/design-system`
- Design tokens exported from `tokens.ts`

## Outputs

- A routable `/design-system` page with live component examples
- Reusable UI components under `src/components/ui`
- Reusable layout display components under `src/components/layout`
- Design token definitions under `src/design-system/tokens.ts`
- Supporting design guidance markdown files

## State Transitions

1. User visits `/design-system`.
2. The route renders static examples using reusable components and tokens.
3. No gameplay, font, database, generator or editor state is changed.
4. Developers reuse components later when applying the design system to app screens.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| The design system must be a live in-app route. | Confirmed | Implemented | `/design-system` route added. |
| The design system must not redesign the whole app yet. | Confirmed | Implemented | Existing app routes are not migrated. |
| Design tokens should centralise repeated visual values. | Confirmed | Implemented | `tokens.ts` added. |
| Components must not contain gameplay logic. | Confirmed | Implemented | Components are presentational only. |
| The route should not interfere with gameplay or existing app features. | Confirmed | Implemented | Route is standalone and not linked in primary nav. |
| `/design-system` should be reachable by direct URL during the development cycle for browser review. | Confirmed | Implemented | Keep direct access available until go-live hardening. |
| `/design-system` should be hidden before public go-live. | Confirmed | Not Implemented | Added to tasks for the go-live checklist. |
| Reusable layout components should use app-neutral naming. | Confirmed | Implemented | Display primitives now live under `src/components/layout`. |
| States for selected, disabled, legal, illegal, hover and focus should be visible. | Confirmed | Implemented | Live examples and CSS state classes added. |

## Negative Rules

- Must not change game logic or existing app behaviour.
- Must not remove existing features.
- Must not alter card/font data, scoring, setup, deck logic, NPC logic or rules.
- Must not require database access.
- Must not block existing navigation.

## Acceptance Criteria

- Given a user opens `/design-system`, when the page loads, then reusable component examples are visible.
- Given a developer reviews `tokens.ts`, when they need spacing, colour or card values, then named tokens are available.
- Given a future page needs a button, panel, badge, modal, empty state or toast, when a component is reused, then it follows the app visual language.
- Given a future table-style surface needs display pieces, when layout components are reused, then they do not own rules or data mutation.
- Given existing app pages are opened, when the design system is added, then existing page behaviour is unchanged.

## Edge Cases

- The route is visited on a narrow screen.
- The route is visited without Supabase configuration.
- Static sample cards overflow available width.
- Components are rendered disabled or with long labels.

## Current Code Behaviour

- The design-system route currently renders static sample components.
- The components currently use existing global CSS plus new design-system-specific classes.
- The route is not added to primary navigation.
- The components do not currently integrate with production app workflows.

## Known Gaps / Defects

- The design system is not yet applied across existing app screens.
- The route currently uses static sample content rather than app data.

## Unclear or Assumed Rules

- None currently.

## Suggested Test Areas

- Route renders successfully.
- Component examples are keyboard reachable where interactive.
- Responsive layout does not clip content.
- Existing app routes still render after adding the design system.
- TypeScript component props compile.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
