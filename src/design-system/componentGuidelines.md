# Component Guidelines

## Purpose

Reusable UI components should make the app easier to read, test and maintain without changing product behaviour.

## Principles

- Prefer existing app classes and visual language before introducing new styling.
- Use named design tokens for repeated colour, spacing, radius, shadow and state values.
- Keep controls readable and keyboard reachable.
- Use semantic elements for panels, dialogs, lists and status messages.
- Preserve text labels on important actions.
- Use disabled, selected, hover, focus, success, warning and error states consistently.

## UI Components

- `Button` is for direct actions and supports `primary`, `secondary`, `ghost` and `danger`.
- `Panel` is for framed content groups.
- `Badge` is for compact status or category labels.
- `Modal` is for blocking confirmation or focused editing.
- `EmptyState` is for blank or unavailable content.
- `Toast` is for temporary feedback and uses `aria-live`.

## Layout Components

- `DisplayCard` is a reusable card surface for future table-like displays.
- `ParticipantArea`, `ItemRail`, `LayoutBoard`, `StackSlot`, `MetricBadge`, `ActivityLog` and `PromptCard` are display primitives only.
- These components must not own product rules, scoring, ordering or persistence logic.
