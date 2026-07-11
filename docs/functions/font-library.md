# Font Library

## Purpose

Provide the primary browsing and management surface for stitch alphabets, including filtering, searching, previewing, selecting, editing, renaming, deleting and creating fonts. For now there is no login/admin permission layer, so the Fonts page may expose font management actions; an admin login model is planned as a future control layer.

## Source References

- Page: `src/app/fonts/page.tsx`
- Component: `FontCard` in `src/components/FontCard.tsx`
- Component: `FontGridPreview` in `src/components/FontGridPreview.tsx`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Function: `createBlankFont()` in `src/lib/fontFactory.ts`
- Function: `saveSelectedFontId()` in `src/lib/localStorageUtils.ts`
- Data source: default fonts from `src/data/fonts.json`
- Data source: Supabase custom fonts through `fontPersistence.ts`
- Related route: `/fonts`
- Related route: `/fonts/[id]`
- Related route: `/generator`
- Related route: `/editor?font=[id]`
- Future control layer: Admin login/permissions for create/edit/rename/delete actions.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Font Library decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Available fonts from `useFonts()`.
- Persistence state from `useFonts()`.
- Category filter selection.
- Height filter selection.
- Search text.
- Create New Font action.
- New font name.
- New font category.
- New font height.
- Font card actions: View Alphabet, Use, Edit, Rename and Delete.

## Outputs

- Filtered font cards.
- New blank font save request with user-selected name, category and height.
- Selected font id saved for generator use.
- Navigation to font detail, generator or editor.
- Rename request for selected font.
- Delete request for selected font.
- Empty state when no fonts match filters.
- Inline error/status if creation or management is attempted while persistence is unavailable.

## Worked Examples

### Search scope

Input:
- Search text: `serif`
- Font name: `Tiny Serif 7x9`
- Font description: `Compact alphabet for labels`

Output:
- Font remains visible because search matches the name.

### Create New Font

Input:
- Name: `Sara Block`
- Category: `Block`
- Height: `10`

Expected output:
- A new blank font is created using the selected name, category and height.

### No admin layer yet

Input:
- User opens Fonts page.
- No admin login exists.

Expected output:
- Create, edit, rename and delete actions may be visible for now.

## State Transitions

1. Page loads and calls `useFonts()`.
2. Default and remote fonts are merged into the available font list.
3. User changes category, height or search state.
4. Font list filters client-side.
5. User clicks Use, View Alphabet, Edit, Rename, Delete or Create New Font.
6. The app either navigates, stores the selected font id, saves a new blank font, renames a font or deletes a font.
7. Future admin permissions may restrict create/edit/rename/delete actions while leaving browse/use available.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must be able to view available fonts. | Confirmed | Implemented | Product scope requires font browsing. |
| Users must be able to filter by category. | Confirmed | Implemented | Category select is present. |
| Users should be able to filter by height. | Confirmed | Implemented | Added in current Fonts page. |
| Search only needs to cover font name and description. | Confirmed | Implemented | User confirmed this search scope. |
| Fonts page is allowed to expose Edit actions for now. | Confirmed | Implemented | User confirmed this while there is no login/admin function. |
| Users should be able to rename fonts from the Fonts page. | Confirmed | Unknown | User confirmed this; implementation status needs code verification. |
| Users should be able to delete fonts from the Fonts page. | Confirmed | Unknown | User confirmed this; implementation status needs code verification. |
| Users should be able to create a new font when persistence is available. | Confirmed | Implemented | Create button calls font creation flow. |
| Create New Font should allow category and height selection before creation. | Confirmed | Implemented | Create New Font now uses an in-app dialog with name, category, new-category and height fields. |
| Create must not proceed when persistence cannot write. | Assumed | Implemented | Disabled button and alert guard. |
| Font cards should show a preview. | Confirmed | Implemented | `FontGridPreview` is used. |
| Font card previews must not show pattern centre guide lines. | Confirmed | Implemented | Centre guides remain on Create Pattern but `FontGridPreview` passes `showCenterGuide={false}`. |
| Future admin login should control who can create/edit/rename/delete fonts. | Confirmed | Not Implemented | Added to outstanding tasks as a future feature. |
| Non-admin/general users should still be able to use other site features once admin permissions are added. | Confirmed | Not Implemented | Future permission model should preserve browse/use/generator access. |

## Negative Rules

- Must not create fonts when persistence is unavailable.
- Must not remove fonts from the list merely because a search field is empty.
- Must not mutate font data while filtering.
- Must not require users to visit Manage Fonts before creating from the Fonts page.
- Must not require admin login for browse/use/generator behaviour until a future permission model is implemented.
- Must not create a new font without allowing category and height selection once the confirmed creation flow is implemented.
- Must not silently fail rename/delete actions.
- Must not show centre guide overlays in Stitch Library card previews.

## Acceptance Criteria

- Given fonts are loaded, when the Fonts page opens, then font cards are displayed without centre guide overlays.
- Given a category filter is selected, when fonts are shown, then only matching category fonts appear.
- Given a height filter is selected, when fonts are shown, then only matching default-height fonts appear.
- Given search text matches a font name, when entered, then that font remains visible.
- Given search text matches a font description, when entered, then that font remains visible.
- Given search text matches only a category, when entered, then that category match alone does not need to keep the font visible.
- Given persistence can write, when Create New Font is used, then the user can provide name, category and height before the blank font save is requested.
- Given persistence cannot write, when Create New Font is used, then creation is blocked and the user sees a clear status/error.
- Given Edit is clicked, when navigation occurs, then the selected font opens in the editor.
- Given Rename is clicked, when the user confirms a new name, then the font rename is saved and the library updates.
- Given Delete is clicked, when the user confirms deletion, then the font is removed from the library.
- Given Use is clicked, when the generator opens, then the selected font id is available to the generator.
- Given a future admin permission model is added, when a user without admin permission opens Fonts, then create/edit/rename/delete are restricted while browse/use remains available.

## Edge Cases

- No fonts loaded.
- Remote fonts fail to load.
- No filter matches.
- Duplicate height values.
- Blank create name.
- Invalid create height.
- Missing create category.
- Duplicate font name.
- Rename to blank name.
- Delete failure.
- Search with uppercase/lowercase differences.
- Font with unsupported sample preview characters.
- Font card preview for different font heights and sizes.
- Future user lacks admin permission.

## Current Code Behaviour

- Currently loads fonts through `useFonts()`.
- Currently derives category and height options from available fonts.
- Currently filters by category, height and case-insensitive search over name and description.
- Currently disables Create New Font when `persistence.canWrite` is false.
- Currently uses an in-app Create Font dialog for name, category, new-category and height.
- Currently shows View Alphabet, Use and Edit actions.
- Current implementation status for Rename and Delete on the Fonts page needs code verification.
- Current Create New Font flow collects category and height before creation.
- Currently there is no admin login/permission model.

## Known Gaps / Defects

- Shared/default fonts are deleted from the user experience by archiving default_fonts.is_public = false; they are no longer loaded by the library after deletion.

- Create New Font does not yet collect category and height before creation, which conflicts with the confirmed requirement.
- Creation feedback uses prompt/alert rather than an in-app form and status area.
- Rename/Delete availability on the Fonts page needs implementation verification against the confirmed requirement.
- There is no admin login/permission model to restrict font management actions in the future.
- There is no visible loading skeleton while database fonts are loading.

## Unclear or Assumed Rules

- None currently for Font Library. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Fonts page is allowed to expose Edit actions for now because there is no login/admin function.
- Search only needs to cover font name and description.
- Users should be able to rename fonts from the Fonts page.
- Users should be able to delete fonts from the Fonts page.
- Create New Font should allow category and height selection before creation.
- A future admin login function should manage who can create/edit/rename/delete fonts versus who can use other site features.

## Suggested Test Areas

- Font list loading.
- Category filtering.
- Height filtering.
- Search filtering by name.
- Search filtering by description.
- Create font availability.
- Create font category selection.
- Create font height selection.
- View, Use and Edit navigation.
- Rename action.
- Delete action.
- Empty filtered state.
- Future admin permission restrictions.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.

