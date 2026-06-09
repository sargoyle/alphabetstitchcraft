# Custom Font Creation

## Purpose

Allow users to create editable stitch alphabets that can be browsed, edited, rendered and saved as shared public fonts. Brand-new fonts should start as blank alphabets. Duplicated fonts and copied-letter workflows should preserve source data for modification rather than behaving like blank-new-font creation.

## Source References

- Function: `createBlankFont()` in `src/lib/fontFactory.ts`
- Function: `createBlankCharacter()` in `src/lib/fontFactory.ts`
- Constant: `blankFontCharacterKeys` in `src/lib/fontFactory.ts`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Page: `src/app/fonts/page.tsx`
- Page: `src/app/custom-fonts/page.tsx`
- Utility: `saveRemoteFont()` in `src/lib/fontPersistence.ts`
- Legacy utility: `duplicateFont()` in `src/lib/localStorageUtils.ts`
- Related editor workflow: copied/new character creation in `src/app/editor/EditorClient.tsx`
- Evidence gap: visible whole-font duplication action was not found in the current Font Library or Manage Fonts page code.
- Evidence gap: duplicate font name validation was not found in the current prompt-based creation flow.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Custom Font Creation decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- User-entered font name.
- Existing font names for duplicate-name validation.
- Persistence state.
- Blank character key list.
- Default blank character dimensions.
- Supabase configuration.
- Existing font selected for whole-font duplication.
- Source character data for copied-letter workflows.

## Outputs

- New `StitchFont` with UUID id for blank-new-font creation.
- Blank character grids for uppercase, lowercase, numbers and punctuation for brand-new fonts.
- Duplicated font created from an existing font when the user chooses whole-font duplication.
- Save request to remote persistence.
- New or duplicated font appears in browse, manage, detail, editor and generator workflows after refresh/load.
- Clear duplicate-name rejection when a user attempts to create or duplicate a font using an existing name.

## Worked Examples

### Blank font creation

Input:
- Name: `Sampler Test`

Output:
- New UUID font named `Sampler Test`.
- Blank characters are created for uppercase, lowercase, numbers and supported punctuation.
- Default height is currently `10`.

### Whole-font duplication

Input:
- Source font: `Tiny Serif 7x9`
- New name: `Tiny Serif Custom`

Expected output:
- A new editable font named `Tiny Serif Custom`.
- Character grids are copied from `Tiny Serif 7x9`.
- The source font remains unchanged.

### Duplicate name prevention

Input:
- Existing font name: `Sampler Test`
- New requested font name: `Sampler Test`

Expected output:
- Creation is blocked.
- User sees a clear duplicate-name message.

## State Transitions

1. User clicks Create New Font or a future Duplicate Font action.
2. UI checks `persistence.canWrite`.
3. User enters a font name.
4. System checks that the name is not already used.
5. For a brand-new font, `createBlankFont()` builds a blank font object.
6. For whole-font duplication, the selected source font is cloned into a new editable font with a unique id and unique name.
7. `saveFont()` attempts remote save.
8. `useFonts()` refreshes available fonts.
9. New or duplicated font becomes available across the app.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users should be able to create a new blank custom font. | Confirmed | Implemented | User confirmed blank font creation is preferred for brand-new fonts. |
| New blank fonts should be editable. | Confirmed | Implemented | Created fonts link to editor. |
| New blank fonts should include blank common characters. | Confirmed | Implemented | `blankFontCharacterKeys`; this applies to brand-new fonts, not duplicated fonts or copied letters. |
| New font saves should use the database when configured. | Confirmed | Implemented | `useFonts().saveFont()`. |
| Creation must be blocked when persistence cannot write. | Assumed | Implemented | Button disabled and guarded. |
| User-created fonts are currently public shared fonts. | Confirmed | Implemented | Persistence message and `owner_id: null`. |
| Whole-font duplication must be available as a visible action. | Confirmed | Not Implemented | User confirmed whole-font duplication should return as a visible action. |
| Duplicated fonts must preserve source font character data for modification. | Confirmed | Partially Implemented | Legacy duplication utility exists, but visible action is not currently present. |
| Copied-letter workflows must preserve source character data for modification. | Confirmed | Implemented | Editor copy/new-character flow copies source character when selected. |
| Users should not configure height or category before initial save. | Confirmed | Implemented | User confirmed no pre-save height/category configuration is needed. |
| Duplicate font names must not be allowed. | Confirmed | Not Implemented | User confirmed duplicate names should be prevented; current prompt flow does not appear to enforce this. |

## Negative Rules

- Must not create a nameless font.
- Must not allow duplicate font names.
- Must not write browser-only fonts as the active source of truth under current rules.
- Must not require login under the current public shared model.
- Must not omit the standard blank character set for brand-new blank fonts.
- Must not force height/category configuration before first save.
- Must not treat duplicated fonts or copied letters as blank-new-font workflows.
- Must not mutate the source font when creating a duplicate.

## Acceptance Criteria

- Given persistence can write and no existing font has the requested name, when a user creates a brand-new font with that name, then a UUID blank font is saved.
- Given the create prompt is cancelled or blank, when creation is attempted, then no font is created.
- Given persistence cannot write, when Create New Font is shown, then creation is disabled or blocked.
- Given a new blank font is saved, when the font list refreshes, then it appears in the font list.
- Given a new blank font is opened in the editor, when characters are selected, then blank characters are editable.
- Given a user chooses whole-font duplication, when they provide a unique name, then a visible duplicate workflow creates a copy of the selected font for editing.
- Given a whole-font duplicate is created, when the duplicate is edited, then the source font remains unchanged.
- Given a user enters a font name that already exists, when they try to save the new or duplicated font, then creation is blocked with a clear duplicate-name message.
- Given a user creates a new blank font, when the initial save happens, then height and category are not required as pre-save configuration fields.

## Edge Cases

- Blank name.
- Duplicate font name.
- Same name with different casing.
- Same name with leading or trailing spaces.
- Supabase unavailable.
- UUID generation unavailable.
- Save failure.
- Very long font name.
- Blank character list changes.
- Whole-font duplication source missing.
- Copied-letter workflow confused with whole-font duplication.

## Current Code Behaviour

- Currently creates UUID fonts using `crypto.randomUUID()`.
- Currently uses `window.prompt` for the font name.
- Currently assigns category `Block`, height `10` and licence `User-created public font` for blank-new-font creation.
- Currently creates blank 8 x 10 characters for common uppercase, lowercase, numbers and punctuation.
- Currently still has a legacy `duplicateFont()` helper, but whole-font duplication does not appear to be exposed as a visible action.
- Currently duplicate font name validation does not appear to be implemented in the visible creation flow.
- Currently height and category are not requested before the initial save, which matches the confirmed requirement.

## Known Gaps / Defects

- Whole-font duplication should be visible, but current visible creation flow appears to start blank only.
- Duplicate font names should not be allowed, but current prompt-based creation does not appear to enforce unique names.

## Unclear or Assumed Rules

- None currently for Custom Font Creation. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Blank font creation is the preferred workflow for creating brand-new fonts.
- Duplicated fonts and copied letters should not use blank-new-font behaviour.
- Whole-font duplication should return as a visible action.
- Users should not configure height or category before initial save.
- Duplicate font names should not be allowed.

## Suggested Test Areas

- Create from Fonts page.
- Create from Manage Fonts page.
- Persistence unavailable state.
- Blank prompt cancellation.
- Created font data shape.
- Created font availability across routes.
- Visible whole-font duplication.
- Source font preservation during duplication.
- Duplicate font name prevention.
- New blank font creation without height/category pre-configuration.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
