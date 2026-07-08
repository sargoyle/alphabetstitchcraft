# Text Generator

## Purpose

Allow users to type custom lettering, choose a stitch font, adjust layout settings and view the generated cross-stitch lettering pattern with exact stitch dimensions. Generator settings remain browser-local for now, but future cross-browser settings sync is confirmed as database-backed.

## Source References

- Page: `src/app/generator/page.tsx`
- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Function: `renderTextToGrid()` in `src/lib/renderTextToGrid.ts`
- Component: `SpacingControls` in `src/components/SpacingControls.tsx`
- Component: `TextPatternPreview` in `src/components/TextPatternPreview.tsx`
- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Functions: `loadGeneratorSettings()`, `saveGeneratorSettings()`, `loadSelectedFontId()`, `saveSelectedFontId()` in `src/lib/localStorageUtils.ts`
- Type: `GeneratorSettings`
- Related product decision: generator settings remain browser-local for now.
- Related product decision: generator settings should sync across browsers through the database in the future.
- Related product decision: first available font is a suitable fallback.
- Related product decision: very large patterns should scroll rather than auto-fit.
- Reviewed behaviour: Create Pattern shows a loading state while database fonts resolve so it does not render a stale fallback font or stale preview.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Text Generator decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Available fonts.
- Font persistence/loading state from `useFonts()`.
- Selected font id.
- Text input.
- Letter spacing.
- Word spacing.
- Line spacing.
- Alignment.
- Grid visibility.
- Filled stitch visibility.
- Zoom.
- Persisted generator settings from localStorage.
- Future database-backed cross-browser generator settings sync source.

## Outputs

- Generated pattern preview.
- Width and height in stitches.
- Unsupported-character warning.
- Persisted generator settings in the current browser.
- Future database-backed cross-browser synced settings.
- Export controls for PNG, copy size and JSON.
- Scrollable preview for very large patterns.
- Loading state while database-backed fonts are resolving.

## Worked Examples

### First available font fallback

Input:
- Saved selected font id does not exist.
- Available fonts list contains `block-needle-5x7`.

Expected output:
- Generator selects `block-needle-5x7` as the fallback font.

### Browser-local settings

Input:
- User changes letter spacing to `2` in Browser A.
- User reloads Browser A.

Expected output:
- Browser A restores letter spacing `2` from localStorage.

### Future cross-browser settings sync

Input:
- User changes generator settings in Browser A.
- User later opens Browser B after future sync is implemented.

Expected output:
- Browser B can restore the synced generator settings from the database.

### Large pattern

Input:
- User enters a long multi-line quote.

Expected output:
- Preview remains scrollable and does not auto-fit or shrink the pattern.

## State Transitions

1. Generator page loads initial settings.
2. If font persistence is still loading, the page shows a loading status instead of rendering a pattern preview.
3. After font loading resolves, saved settings and selected font id are read from localStorage.
4. First available font is used as fallback when no saved/valid font is available.
5. User changes font, text or controls.
6. Settings state updates and is saved to localStorage for now.
7. Pattern is recalculated with `renderTextToGrid()`.
8. Preview, dimensions, warnings and exports update.
9. Very large patterns remain scrollable rather than auto-fitting.
10. Future cross-browser settings sync may restore settings from the database.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Users must be able to type custom text. | Confirmed | Implemented | Textarea present. |
| Text changes must update preview. | Confirmed | Implemented | State drives renderer. |
| Users must be able to choose a font. | Confirmed | Implemented | Select uses fonts list. |
| Width and height must be shown. | Confirmed | Implemented | Dimension pills display values. |
| Unsupported characters must be shown clearly. | Confirmed | Implemented | Warning appears when list is non-empty. |
| Generator settings should persist on reload in the same browser. | Confirmed | Implemented | Uses localStorage helpers. |
| Generator settings should remain browser-local for now. | Confirmed | Implemented | User confirmed current browser-local behaviour is acceptable for now. |
| Generator settings should sync across browsers through the database in the future. | Confirmed | Not Implemented | User confirmed database-backed sync. |
| First available font is a suitable fallback. | Confirmed | Implemented | User confirmed first available font is acceptable fallback. |
| First available font fallback must not run before database font loading has resolved. | Confirmed | Implemented | Loading state prevents stale default/bundled previews flashing before the selected database font is available. |
| Very large patterns should scroll rather than auto-fit. | Confirmed | Implemented | User confirmed scroll-only behaviour. |
| Preview and export should use the same generated pattern data. | Confirmed | Implemented | `GeneratorPage` passes the same `pattern` object to preview and export controls. |
| Generator should not require a backend to render default fonts. | Assumed | Implemented | Defaults are local. |

## Negative Rules

- Must not mutate font data while generating text.
- Must not export when the pattern is empty.
- Must not discard line breaks.
- Must not hide unsupported characters silently.
- Must not require Manage Fonts access to use the generator.
- Must not auto-fit very large patterns instead of allowing scroll.
- Must not render a stale fallback font preview while database fonts are still loading.
- Must not use browser-local storage as the only source once future database-backed settings sync is implemented.
- Must not remove browser-local settings persistence before the future sync mechanism is implemented.

## Acceptance Criteria

- Given the generator page opens with at least one available font, when the page renders, then a font selector, text input, spacing controls, dimensions and pattern preview are visible.
- Given the user changes the text input from `HELLO` to `A`, when the input event is processed, then the generated pattern recalculates and the displayed width and height match the new text.
- Given the user selects a different font, when the selection changes, then the generated pattern recalculates using the newly selected font id.
- Given the text contains an unsupported character, when the pattern is rendered, then the unsupported character appears in the warning list.
- Given the text is empty, when the pattern is rendered, then the empty preview state is shown and export controls are disabled.
- Given settings are changed and the page reloads in the same browser, when saved settings are available, then those settings are restored.
- Given no selected/saved font is available, when fonts exist, then the first available font is selected as fallback.
- Given database fonts are still loading, when Create Pattern renders, then a loading status is shown instead of a pattern preview.
- Given database fonts finish loading, when a selected font id is available, then the preview renders using the resolved selected font.
- Given settings are changed in one browser, when database-backed cross-browser sync is implemented later, then another browser can restore those settings from the database.
- Given a very large pattern is generated, then the preview scrolls rather than auto-fitting the pattern.

## Edge Cases

- No fonts available.
- Remote font loading failure.
- Slow database font loading.
- Empty text.
- Whitespace-only text.
- Very long text.
- Many line breaks.
- Persisted font id no longer exists.
- Corrupt persisted settings.
- Future cross-browser settings conflict between browsers.
- React hydration failure in local preview environment.

## Current Code Behaviour

- Currently starts with default text `HELLO\nSTITCH`.
- Currently shows `Loading pattern creator...` while `useFonts()` is in `loading` mode.
- Currently restores saved settings after font loading resolves.
- Currently saves updates during state changes.
- Currently selects the saved font id, saved settings font id, first font, or empty string in that order after loading.
- Currently uses localStorage for generator preferences even though font data may be remote.
- Currently large patterns are handled through scrollable preview behaviour.

## Known Gaps / Defects

- Persisted generator settings are not synced across browsers yet, which conflicts with the confirmed future sync requirement.
- Future cross-browser settings sync is confirmed as database-backed but not implemented.
- If `fonts` changes repeatedly after loading, saved settings are reapplied by the effect.
- Local dev server modes can render the page without hydration; this is an environment/runtime issue, not generator logic.

## Unclear or Assumed Rules

- None currently for Text Generator. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Generator settings should remain browser-local for now.
- First available font is a suitable fallback.
- Generator settings should sync across browsers through the database in the future.
- Very large patterns should scroll rather than auto-fit.

## Suggested Test Areas

- Typing updates preview.
- Font selection.
- First available font fallback.
- Loading state before database fonts resolve.
- Spacing and alignment integration.
- Unsupported warnings.
- Empty state.
- Settings persistence in the same browser.
- Future database-backed cross-browser settings sync.
- Large-pattern scrolling.
- Export enable/disable state.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.

