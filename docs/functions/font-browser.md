# Font Browser

## Purpose

Allow users to scan stitch alphabet options quickly by showing readable metadata, compact previews and clear actions on each font card. Font cards should support consistent comparison across fonts while also showing lowercase sample text when a font supports lowercase characters.

## Source References

- Component: `FontCard` in `src/components/FontCard.tsx`
- Component: `FontGridPreview` in `src/components/FontGridPreview.tsx`
- Utility: `buildFontPreviewSample()` in `src/lib/fontPreviewSample.ts`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Function: `renderTextToGrid()` in `src/lib/renderTextToGrid.ts`
- Page: `src/app/fonts/page.tsx`
- Type: `StitchFont` in `src/lib/fontTypes.ts`
- Related sample text: `ABC 123`
- Related optional sample text: lowercase characters when available
- Reviewed behaviour: card previews now build supported samples from drawable font characters.
- Reviewed behaviour: Alphabet Library shows a loading state while database fonts load so stale bundled/default cards do not flash before the shared list resolves.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Font Browser decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- `StitchFont` object.
- Optional `showEdit` flag.
- `onUse(fontId)` callback.
- Font metadata.
- Font character data for sample preview.
- Standard sample baseline: uppercase stitch text, expanded to `ABC DEF GHI` for card previews to use preview space more efficiently.
- Lowercase sample characters when the font supports lowercase.
- User clicks on View Alphabet, Use or Edit.
- Font persistence/loading state from `useFonts()`.

## Outputs

- A font card with category, height, name, description, preview and actions.
- A compact sample preview using a fuller supported sample that starts with uppercase letters and adds lowercase/numbers when drawable.
- A loading state while the database-backed font list is still resolving.
- Navigation link to `/fonts/[id]`.
- Navigation link to `/generator` plus selected font persistence.
- Optional navigation link to `/editor?font=[id]`.

## Worked Examples

### Standard sample

Input:
- Font supports `A`, `B`, `C`, space, `1`, `2`, `3`.

Output:
- Card preview can render `ABC 123`.

### Lowercase-capable sample

Input:
- Font supports uppercase, lowercase and numbers.

Expected output:
- Card preview should include lowercase sample characters as well as the standard sample.

### Unsupported sample character

Input:
- Card sample text: `ABC abc 123`
- Font supports only uppercase letters.

Unsupported sample characters:
- `a`, `b`, `c`, `1`, `2`, `3` if those characters do not exist in the font's `characters` map.

Confirmed behaviour:
- Unsupported sample characters should be avoided by choosing sample text each font supports.

## State Transitions

1. Font Library starts with `useFonts()` in `loading` mode.
2. While `loading`, the page shows a loading status instead of rendering bundled/default cards.
3. Once persistence resolves, Font Library passes each available font into `FontCard`.
4. `FontCard` renders metadata and preview.
5. `FontGridPreview` renders sample text into a mini generated pattern.
6. If lowercase is supported, the browser should include lowercase sample characters.
7. The sample builder filters unsupported or blank/uncreated characters before rendering the card preview.
8. User selects an action.
9. App navigates or saves selected font id depending on action.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Font cards must identify the font name and category. | Confirmed | Implemented | Required by scope. |
| Font cards should show stitch height. | Confirmed | Implemented | Topline shows height. |
| Font cards should show a sample preview. | Confirmed | Implemented | `FontGridPreview` is used. |
| `ABC 123` remains the standard sample text. | Confirmed | Implemented | User confirmed this standard sample. |
| Sample text should include lowercase when the font supports lowercase. | Confirmed | Implemented | `buildFontPreviewSample()` adds lowercase sample characters when they are available and drawable. |
| Unsupported sample characters must not crash card previews. | Confirmed | Implemented | Existing renderer handles unsupported characters. |
| Unsupported sample characters should be avoided by choosing sample text that each font supports. | Confirmed | Implemented | The preview sample is filtered to characters with filled stitch cells. |
| Font cards must provide a way to inspect the alphabet. | Confirmed | Implemented | View Alphabet link. |
| Font cards must provide a way to use the font. | Confirmed | Implemented | Use link saves font id. |
| Font cards may provide editing when requested by page context. | Assumed | Implemented | `showEdit` controls Edit link. |
| Alphabet Library must not briefly show stale bundled/default cards while database fonts are still loading. | Confirmed | Implemented | `src/app/fonts/page.tsx` shows a loading status when `persistence.mode === "loading"`. |

## Negative Rules

- Must not crash if sample text includes unsupported characters.
- Must not save selected font id when only viewing the alphabet.
- Must not show Edit unless the parent page asks for it.
- Must not mutate the font object while previewing.
- Must not omit lowercase from the sample when lowercase is supported.
- Must not treat unsupported sample characters as evidence that the whole font is invalid.
- Must not render stale bundled/default font cards while the database-backed list is still loading.

## Acceptance Criteria

- Given a font card receives a font, when rendered, then name, category, height and description are visible.
- Given a font supports `ABC 123`, when rendered, then a mini grid preview for `ABC 123` appears.
- Given a font supports lowercase characters, when rendered, then the card sample includes lowercase characters.
- Given a font does not support lowercase characters, when rendered, then the card does not crash or show broken output.
- Given a candidate sample contains characters unsupported by a font, when the card preview is built, then unsupported characters are filtered before rendering.
- Given Use is clicked, when navigation occurs, then selected font id is saved.
- Given `showEdit` is false, when rendered, then Edit is not shown.
- Given `showEdit` is true, when rendered, then Edit links to the editor with that font id.
- Given database fonts are still loading, when the Alphabet Library renders, then a loading status is shown instead of font cards.
- Given database loading completes, when the Alphabet Library renders, then the resolved font list is shown.

## Edge Cases

- Font with no numbers for sample text.
- Font with uppercase only.
- Font with lowercase support.
- Font with punctuation support only in some characters.
- Very long font name.
- Very large character dimensions.
- Missing description.
- Multiple cards with the same height/category.
- Sample text where every non-space character is unsupported.
- Slow database font loading.
- Database loading error.

## Current Code Behaviour

- Currently uses `FontGridPreview` with `buildFontPreviewSample()` to create a fuller supported sample such as `ABC DEF GHI`, plus lowercase and numbers when drawable.
- Currently shows View Alphabet, Use and optional Edit actions.
- Currently uses Lucide icons in actions.
- Currently does not show duplicate or delete actions on Font Library cards.
- Currently adds lowercase sample text when lowercase characters are available and drawable.
- Currently filters unsupported or blank/uncreated sample characters before rendering the card preview.
- Currently shows `Loading alphabet library...` while `useFonts()` is in `loading` mode, preventing the bundled/default list from flashing before database fonts resolve.

## Known Gaps / Defects

- Long descriptions may affect card height; this is a layout concern to verify manually.

## Unclear or Assumed Rules

- None currently for Font Browser. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- `ABC 123` remains the standard sample text.
- Sample text should include lowercase when lowercase is available.
- Unsupported sample characters should be avoided by choosing sample text that each font supports.

## Suggested Test Areas

- Card metadata rendering.
- Standard `ABC 123` preview rendering.
- Lowercase sample rendering when supported.
- Uppercase-only sample rendering.
- Adaptive supported sample generation.
- Loading state before database fonts resolve.
- Use action.
- View action.
- Optional Edit action.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.


