# Layout UX Rules

## Purpose

These rules define how future table-style and workspace screens should behave without implementing product logic.

## Rules

- Workflow readability takes priority over decoration.
- Allowed, blocked, selected, active and disabled states must be visually distinct and must not rely on colour alone.
- Card or item content must remain readable at desktop and small-screen sizes.
- The active area should be visible without requiring users to infer it from layout.
- The activity log should show meaningful feedback in chronological order.
- Stack and archive areas should show labels and counts where available.
- Keyboard focus should remain visible on all interactive card, action and modal controls.
- Feedback for blocked actions should be immediate and specific.

## Boundaries

- UI components must not contain product rules.
- UI components must not mutate data, ordering, scoring or persistence decisions.
- Layout examples may use static sample data only.
