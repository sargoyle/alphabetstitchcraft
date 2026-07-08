# Known Gaps and Defects Backlog

Central backlog of known gaps and defects extracted from `/docs/functions` functional requirements documentation.

## Summary Counts

| Category | Count |
|---|---:|
| Source function documents reviewed | 23 |
| Source documents with Known Gaps / Defects entries | 23 |
| De-duplicated backlog tasks created | 48 |
| High priority tasks | 14 |
| Medium priority tasks | 22 |
| Low priority tasks | 12 |
| Tasks with product decision needed | 6 |
| Tasks ready for implementation planning | 42 |

## Source Document Review Notes

Reviewed all Markdown files in `/docs/functions`:

- `/docs/functions/accessibility.md`
- `/docs/functions/alignment-rules.md`
- `/docs/functions/alphabet-preview.md`
- `/docs/functions/character-editor.md`
- `/docs/functions/character-grid.md`
- `/docs/functions/custom-font-creation.md`
- `/docs/functions/design-system.md`
- `/docs/functions/error-handling.md`
- `/docs/functions/export-json.md`
- `/docs/functions/export-png.md`
- `/docs/functions/font-browser.md`
- `/docs/functions/font-data-model.md`
- `/docs/functions/font-detail-preview.md`
- `/docs/functions/font-library.md`
- `/docs/functions/grid-rendering.md`
- `/docs/functions/keep-alive-endpoint.md`
- `/docs/functions/local-storage.md`
- `/docs/functions/navigation-and-routing.md`
- `/docs/functions/render-text-to-grid.md`
- `/docs/functions/security.md`
- `/docs/functions/spacing-controls.md`
- `/docs/functions/text-generator.md`
- `/docs/functions/unsupported-characters.md`

De-duplication notes:

- Export preview parity appears in Export PNG, Grid Rendering, Spacing Controls and Security. It is captured as one export task.
- Invalid remote font reporting appears in Error Handling, Font Data Model and Security. It is captured as one data integrity task.
- Arrow-key grid navigation appears in Accessibility and Character Grid. It is captured as one accessibility task.
- Read-only grid non-interactive cells appear in Accessibility and Character Grid. It is captured as one accessibility task.
- localStorage corruption/quota/recovery appears in Error Handling, Local Storage and Security. It is split into storage write handling and corrupted-data recovery because the work differs.
- Public font hardening appears in Security and Tasks. It is captured as one security task with confirmed hardening controls.
- Design system rollout gaps are captured as separate implementation and sample-data follow-ups.
- Keep-alive endpoint gaps are captured as separate route-test and monitoring-schedule follow-ups.

## Priority Guidance

High priority tasks affect accessibility requirements, confirmed product behaviour, database integrity, security, export accuracy, or core rendering correctness.

Medium priority tasks affect usability, maintainability, future testability, or confirmed behaviours that do not fully block core v1 usage.

Low priority tasks are future-facing, acceptable for v1, or require a later product decision before implementation.

## Product Decision Tracking

Confirmed decisions already captured in `/docs/rules.md` should be treated as implementation-ready unless a task below says otherwise.

Open product decisions from these gaps:

- Whether non-English or multi-code-point alphabet grouping should be designed now or deferred entirely.
- Whether blank generated characters should be visible in alphabet preview before editing.
- Whether JSON import should become a future feature.
- Whether font JSON export should evolve into custom font pack import/export.
- Whether analytics should be added and, if so, which approach should be used.

# High Priority

## Implement Arrow-Key Navigation For Editable Grids

**Source document:** `/docs/functions/accessibility.md`, `/docs/functions/character-grid.md`  
**Functional area:** Accessibility / Character Grid  
**Gap / defect:** Character grid arrow-key navigation is not implemented, but arrow-key navigation is a confirmed requirement.  
**Impact:** Keyboard users cannot efficiently move around the stitch grid, which weakens accessibility and makes character editing harder to test.  
**Task type:** Accessibility  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Keep source and browser regression coverage for arrow-key grid movement.  
**Status:** Fixed

## Replace Read-Only Disabled Grid Buttons With Non-Interactive Cells

**Source document:** `/docs/functions/accessibility.md`, `/docs/functions/character-grid.md`  
**Functional area:** Accessibility / Grid Rendering  
**Gap / defect:** Read-only grids use disabled buttons, but non-interactive cells are the confirmed requirement.  
**Impact:** Disabled buttons create noisy semantics for previews and can confuse assistive technology users.  
**Task type:** Accessibility  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Keep source and browser regression coverage for read-only preview semantics.  
**Status:** Fixed

## Add `aria-live` Status And Warning Announcements

**Source document:** `/docs/functions/accessibility.md`, `/docs/functions/error-handling.md`  
**Functional area:** Accessibility / Error Handling  
**Gap / defect:** Status and warning changes are not consistently announced with `aria-live`, and status presentation is inconsistent.  
**Impact:** Users relying on assistive technology may miss save, warning, error or unsupported-character messages.  
**Task type:** Accessibility  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Keep source coverage for live font action statuses and consider extracting a shared status component later if duplication grows.  
**Status:** Fixed for current font action alerts

## Correct Centre Alignment Odd Padding

**Source document:** `/docs/functions/alignment-rules.md`  
**Functional area:** Alignment Rules / Text Rendering  
**Gap / defect:** Odd-width centre alignment is confirmed to place the extra blank column on the left, but current code appears to place it on the right.  
**Impact:** Generated layout can differ from confirmed product rules and future tests would fail.  
**Task type:** Bug  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Update alignment logic and add renderer tests for odd remaining width.  
**Status:** Backlog

## Ignore Empty Lines During Text Rendering

**Source document:** `/docs/functions/alignment-rules.md`, `/docs/functions/render-text-to-grid.md`  
**Functional area:** Text Rendering / Alignment Rules  
**Gap / defect:** Empty lines are confirmed to be ignored, but current code appears to preserve them as blank rows.  
**Impact:** Pattern height can be incorrect and the preview/export can include unintended blank rows.  
**Task type:** Bug  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Update text splitting/rendering to ignore empty lines according to the confirmed rule and add multiline tests.  
**Status:** Backlog

## Fail Loudly For Invalid Alignment Values

**Source document:** `/docs/functions/alignment-rules.md`, `/docs/functions/security.md`  
**Functional area:** Alignment Rules / Validation  
**Gap / defect:** Invalid alignment values are confirmed to fail loudly, but current code does not explicitly validate or reject them.  
**Impact:** Invalid state can silently fall back to unintended layout, hiding bugs in generator settings or future database sync.  
**Task type:** Validation  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Add runtime validation for alignment values before rendering and document the error path.  
**Status:** Backlog

## Make PNG Export Match Preview Visibility Settings

**Source document:** `/docs/functions/export-png.md`, `/docs/functions/grid-rendering.md`, `/docs/functions/spacing-controls.md`, `/docs/functions/security.md`, `/docs/functions/alignment-rules.md`  
**Functional area:** Export / Grid Rendering  
**Gap / defect:** PNG export previously did not fully honour preview grid/stitch visibility settings and could force grid drawing on by default.  
**Impact:** Fixed at utility and Generator wiring level; full visual browser parity still needs manual/browser coverage.  
**Task type:** Export  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Run manual/browser visual checks for simple, multiline, aligned, unsupported and hidden-visibility exports.  
**Status:** Fixed at utility level; manual visual parity pending

## Report Invalid Remote Fonts Instead Of Silently Skipping Them

**Source document:** `/docs/functions/error-handling.md`, `/docs/functions/font-data-model.md`, `/docs/functions/security.md`  
**Functional area:** Data Integrity / Error Handling  
**Gap / defect:** Invalid remote fonts can be skipped without a user-visible explanation, which conflicts with the confirmed product decision.  
**Impact:** Invalid database records can accumulate unseen and users may not understand why a saved font is missing.  
**Task type:** Data integrity  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Surface invalid remote font records as actionable errors and include enough detail for correction.  
**Status:** Fixed

## Validate Full Font Before Saving To Supabase

**Source document:** `/docs/functions/security.md`, `/docs/functions/font-data-model.md`  
**Functional area:** Data Integrity / Database Persistence  
**Gap / defect:** `saveRemoteFont()` does not clearly validate the full font object before writing to Supabase.  
**Impact:** Invalid font data could be written to the shared database and then fail during load or rendering.  
**Task type:** Data integrity  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Add full font validation at the persistence boundary and block writes with inline error feedback.  
**Status:** Fixed

## Harden Public Font Editing Model

**Source document:** `/docs/functions/security.md`  
**Functional area:** Security / Public Font Persistence  
**Gap / defect:** Public create, edit, rename and delete access is product-confirmed; baseline hardening has now been added with validation, duplicate-name prevention, invalid remote font warnings, database backups, restore tools and recent backup activity visibility.  
**Impact:** Shared font data is now easier to recover after accidental or harmful public edits, but stronger abuse controls can still be considered if public usage grows.  
**Task type:** Security  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Run the Supabase backup migration, then verify update/delete backups and restore from the Manage Fonts page.  
**Status:** Fixed at baseline level; manual database verification pending

## Configure CSP And Security Headers

**Source document:** `/docs/functions/security.md`  
**Functional area:** Security / Browser Security  
**Gap / defect:** No explicit Content Security Policy or security header configuration was found, although the product decision requires this immediately.  
**Impact:** Missing headers increase the impact of future injection mistakes and weaken public deployment readiness.  
**Task type:** Security  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Add Next.js security headers and a practical CSP, then verify the app still renders and exports correctly.  
**Status:** Fixed

## Reject Duplicate Custom Font Names

**Source document:** `/docs/functions/custom-font-creation.md`, `/docs/functions/security.md`, `/docs/functions/font-library.md`  
**Functional area:** Custom Font Creation / Data Integrity  
**Gap / defect:** Duplicate font names should not be allowed, but current prompt-based creation does not appear to enforce unique names.  
**Impact:** Duplicate names make browsing, editing, exporting and recovery confusing, especially in a shared database.  
**Task type:** Data integrity  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Enforce unique names in the UI and shared database, with clear inline errors.  
**Status:** Fixed

## Add Numeric Spacing Validation And Immediate Rejection

**Source document:** `/docs/functions/spacing-controls.md`, `/docs/functions/render-text-to-grid.md`, `/docs/functions/security.md`  
**Functional area:** Spacing Controls / Text Rendering  
**Gap / defect:** Renderer-level numeric bounds are now implemented, but control-level immediate correction and inline rejection still need UI verification.  
**Impact:** Invalid persisted or programmatic settings are now rejected by the renderer; the spacing controls still need focused UI validation coverage.  
**Task type:** Validation  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Add component/browser tests for control-level validation and inline error messages.  
**Status:** Partially resolved - renderer fixed

## Treat Whitespace-Only Text As Empty

**Source document:** `/docs/functions/render-text-to-grid.md`  
**Functional area:** Text Rendering  
**Gap / defect:** Whitespace-only text previously rendered blank rows/columns, which conflicted with the confirmed rule to treat it as empty.  
**Impact:** Fixed at renderer level; whitespace-only input now returns an empty pattern and prevents misleading generated dimensions.  
**Task type:** Bug  
**Suggested priority:** High  
**Product decision needed:** No  
**Suggested next step:** Keep `RENDER-001` as regression coverage.  
**Status:** Fixed

# Medium Priority

## Add Inline Save Confirmation In Character Editor

**Source document:** `/docs/functions/character-editor.md`  
**Functional area:** Character Editor  
**Gap / defect:** Successful save has no clear inline confirmation, which conflicts with the confirmed requirement.  
**Impact:** Users may not know whether their character edit was saved, especially when persistence is remote.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a local success status after save and ensure it is accessible.  
**Status:** Fixed

## Show Local Editor Status For Database Save Failures

**Source document:** `/docs/functions/character-editor.md`, `/docs/functions/error-handling.md`  
**Functional area:** Character Editor / Error Handling  
**Gap / defect:** Database save failures are handled by the hook with alerts rather than local editor status.  
**Impact:** Errors feel disconnected from the action and are harder to recover from or announce accessibly.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Route persistence errors into the editor status area with retry guidance.  
**Status:** Fixed

## Add Central Retry Controls For Failed Database Operations

**Source document:** `/docs/functions/error-handling.md`  
**Functional area:** Error Handling / Persistence  
**Gap / defect:** There is no central retry control for failed database sync or failed save operations.  
**Impact:** Users may need to reload or repeat work manually after transient database failures.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Define retry behaviour for load, save, delete and migration paths.  
**Status:** Fixed

## Replace Prompt And Alert Font Workflows With In-App Forms And Status

**Source document:** `/docs/functions/font-library.md`, `/docs/functions/error-handling.md`  
**Functional area:** Font Library / Error Handling  
**Gap / defect:** Font creation feedback uses prompt/alert rather than an in-app form and status area.  
**Impact:** Prompt/alert flows are harder to validate, style, announce accessibly and extend for category/height selection.  
**Task type:** Technical debt  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Replace prompt-based font creation/rename with controlled forms and inline statuses.  
**Status:** Fixed

## Add Category And Height Inputs To Font Creation

**Source document:** `/docs/functions/font-library.md`  
**Functional area:** Font Library / Custom Font Creation  
**Gap / defect:** Create New Font does not yet collect category and height before creation, which conflicts with the confirmed requirement.  
**Impact:** New fonts may be created with generic metadata that users must fix later or cannot configure.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a creation form with name, category and height fields using current validation rules.  
**Status:** Fixed

## Restore Visible Whole-Font Duplication

**Source document:** `/docs/functions/custom-font-creation.md`  
**Functional area:** Custom Font Creation  
**Gap / defect:** Whole-font duplication should be visible, but the current visible creation flow appears to start blank only.  
**Impact:** Users cannot easily create variants from existing alphabets, which was a core v1 workflow.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a duplicate-font action or creation mode that starts from an existing font.  
**Status:** Fixed

## Implement Lowercase-Aware Font Card Samples

**Source document:** `/docs/functions/font-browser.md`  
**Functional area:** Font Browser  
**Gap / defect:** Lowercase sample text is confirmed but does not appear to be implemented in the current card preview.  
**Impact:** Users may not see lowercase support until opening a detail page or using the generator.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Generate card sample text based on supported characters, including lowercase when available.  
**Status:** Fixed

## Avoid Unsupported Characters In Font Card Samples

**Source document:** `/docs/functions/font-browser.md`  
**Functional area:** Font Browser  
**Gap / defect:** Font card previews previously used unsupported sample characters or left excess blank preview space; adaptive supported samples now avoid unsupported characters.  
**Impact:** Font cards can look broken or lower quality even when the font is valid.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Build sample text from each font's supported character set.  
**Status:** Fixed

## Delay Font Detail Not-Found Until Remote Fonts Load

**Source document:** `/docs/functions/font-detail-preview.md`, `/docs/functions/navigation-and-routing.md`  
**Functional area:** Font Detail Preview / Routing  
**Gap / defect:** Font-not-found may appear if remote fonts have not loaded yet and the requested font is remote.  
**Impact:** Users can see a false missing-font state when navigating directly to remote/shared fonts.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add loading-aware route state before rendering not-found.  
**Status:** Fixed

## Hide Height Metadata On Font Detail

**Source document:** `/docs/functions/font-detail-preview.md`  
**Functional area:** Font Detail Preview  
**Gap / defect:** Height currently appears on the detail page, which conflicts with the confirmed decision to hide it.  
**Impact:** The detail page shows metadata the user decided was not needed, taking up screen space.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Remove height metadata from the detail header and verify spacing.  
**Status:** Fixed

## Verify Rename And Delete Actions On Fonts Page

**Source document:** `/docs/functions/font-library.md`  
**Functional area:** Font Library  
**Gap / defect:** Rename/Delete availability on the Fonts page needs implementation verification against the confirmed requirement.  
**Impact:** Users may not have the expected font management actions from the main library page.  
**Task type:** Testing  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Inspect current Fonts page behaviour and add or correct rename/delete actions if missing.  
**Status:** Fixed

## Add Database Font Loading Skeleton

**Source document:** `/docs/functions/font-library.md`  
**Functional area:** Font Library / Loading States  
**Gap / defect:** There is no visible loading skeleton while database fonts are loading.  
**Impact:** Users may see incomplete font lists or assume remote fonts are missing.  
**Task type:** Technical debt  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a loading state for database font fetches.  
**Status:** Fixed

## Allow Mini Previews Below Generated Preview Clamp

**Source document:** `/docs/functions/grid-rendering.md`  
**Functional area:** Grid Rendering / Previews  
**Gap / defect:** Mini previews cannot currently use cell sizes below the generated preview clamp, conflicting with the confirmed mini-preview rule.  
**Impact:** Small previews may be cramped, clipped or visually inconsistent in cards.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Separate mini-preview cell sizing from generated preview zoom clamping.  
**Status:** Fixed

## Add Shared Persistence For Deleted Default Fonts

**Source document:** `/docs/functions/local-storage.md`  
**Functional area:** Local Storage / Persistence  
**Gap / defect:** Deleted built-in/default font IDs remain browser-local, which conflicts with the confirmed shared deletion requirement.  
**Impact:** Deleted fonts can reappear across browsers or devices, undermining shared font management.  
**Task type:** Data integrity  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Move deleted default font state into shared persistence or the confirmed database model.  
**Status:** Fixed

## Add Active Route Indicator

**Source document:** `/docs/functions/navigation-and-routing.md`  
**Functional area:** Navigation  
**Gap / defect:** No active route indicator is shown in primary navigation; this is confirmed as a gap.  
**Impact:** Users have less orientation when moving between Fonts, Generator and Home.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add active navigation styling based on the current route.  
**Status:** Fixed

## Add More Prominent Manage Fonts Entry

**Source document:** `/docs/functions/navigation-and-routing.md`  
**Functional area:** Navigation / Font Management  
**Gap / defect:** Manage Fonts needs a more prominent contextual entry after removal from primary navigation.  
**Impact:** Users may struggle to find management functions such as rename, delete and restore.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a contextual entry from Fonts or another appropriate management surface.  
**Status:** Fixed

## Report Unsupported Characters With Counts

**Source document:** `/docs/functions/render-text-to-grid.md`, `/docs/functions/unsupported-characters.md`  
**Functional area:** Text Rendering / Unsupported Characters  
**Gap / defect:** Repeated unsupported characters were previously reported as unique values rather than with counts.  
**Impact:** Fixed at renderer level; unsupported output now preserves character counts for UI warning copy.  
**Task type:** Bug  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Keep `UNSUPPORTED-002` as regression coverage and add later browser coverage for displayed warning copy.  
**Status:** Fixed

## Verify And Implement Tab Handling As Unsupported

**Source document:** `/docs/functions/unsupported-characters.md`  
**Functional area:** Unsupported Characters / Text Rendering  
**Gap / defect:** Previously required verification; automated renderer test `UNSUPPORTED-003` now confirms tab characters are reported as unsupported at utility level.  
**Impact:** No current renderer utility gap remains for tab reporting, but UI warning display can still be covered by later browser tests.  
**Task type:** Validation  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add UI/browser coverage later to confirm tab warnings are displayed clearly in the Generator.  
**Status:** Verified at utility level

## Add Guidance For Editing Missing Characters

**Source document:** `/docs/functions/unsupported-characters.md`  
**Functional area:** Unsupported Characters / Character Editor  
**Gap / defect:** Warning does not explain how to add or edit missing characters.  
**Impact:** Users may see unsupported warnings but not know how to fix them by editing or adding characters.  
**Task type:** Technical debt  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a short contextual link or action from unsupported warnings to the editor.  
**Status:** Fixed

## Add Safe Failure Handling For Huge Patterns

**Source document:** `/docs/functions/security.md`  
**Functional area:** Security / Rendering Performance  
**Gap / defect:** No fixed text or grid size limit is required for v1; renderer now returns a warning for large generated patterns, but browser-level stress handling still needs verification.  
**Impact:** Users receive a large-pattern warning at generator level, but preview/export performance still needs later browser coverage.  
**Task type:** Security  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add browser-level tests for very large preview/export workflows.  
**Status:** Partially resolved - renderer warning added

## Apply The Design System Across Existing Screens

**Source document:** `/docs/functions/design-system.md`  
**Functional area:** Design System / UI Consistency  
**Gap / defect:** The design system exists as a live reference route, but it is not yet applied across existing app screens.  
**Impact:** UI patterns can drift between screens, making future maintenance and accessibility review harder.  
**Task type:** Technical debt  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Plan a focused design-system adoption pass for shared buttons, panels, badges, empty states and layout patterns without changing app behaviour.  
**Status:** Backlog

## Add Automated Coverage For The Keep-Alive Endpoint

**Source document:** `/docs/functions/keep-alive-endpoint.md`  
**Functional area:** API / Supabase Keep-Alive  
**Gap / defect:** No automated route test exists yet for `/api/keep-alive`.  
**Impact:** The endpoint could regress without utility or route-level evidence that it remains read-only and returns the expected JSON response.  
**Task type:** Testing  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Add a minimal route test or mocked Supabase client test for success and failure responses.  
**Status:** Backlog
# Low Priority / Future-Facing

## Decide Non-English And Multi-Code-Point Character Grouping

**Source document:** `/docs/functions/alphabet-preview.md`  
**Functional area:** Alphabet Preview  
**Gap / defect:** Non-English or multi-code-point characters are not specially grouped.  
**Impact:** Future multilingual fonts may display poorly or be hard to browse.  
**Task type:** Product decision  
**Suggested priority:** Low  
**Product decision needed:** Yes  
**Suggested next step:** Defer until multi-language support is in scope, then define grouping rules.  
**Status:** Fixed

## Decide Visibility Of Blank Generated Characters

**Source document:** `/docs/functions/alphabet-preview.md`  
**Functional area:** Alphabet Preview  
**Gap / defect:** Product has not confirmed whether blank generated characters should all be visible.  
**Impact:** Alphabet previews may feel cluttered or hide editable blank characters depending on the chosen rule.  
**Task type:** Product decision  
**Suggested priority:** Low  
**Product decision needed:** Yes  
**Suggested next step:** Decide whether blank characters are hidden until edited or visible as editable placeholders.  
**Status:** Fixed

## Revisit JSON Import As A Future Feature

**Source document:** `/docs/functions/export-json.md`, `/docs/functions/security.md`  
**Functional area:** Export JSON / Future Import  
**Gap / defect:** There is no JSON import flow, which is acceptable for v1 because import is a separate future feature.  
**Impact:** Users cannot re-import exported JSON or share font packs through JSON yet.  
**Task type:** Product decision  
**Suggested priority:** Low  
**Product decision needed:** Yes  
**Suggested next step:** If import becomes a priority, define schema validation, error handling and security requirements first.  
**Status:** Fixed

## Revisit Font JSON Export Role For Font Packs

**Source document:** `/docs/functions/export-json.md`  
**Functional area:** Export JSON / Custom Font Packs  
**Gap / defect:** Font JSON export is implemented, but its long-term role should be revisited if future import/export font pack features are prioritised.  
**Impact:** Current JSON export may not match future pack format or import expectations.  
**Task type:** Product decision  
**Suggested priority:** Low  
**Product decision needed:** Yes  
**Suggested next step:** Revisit when custom font pack import/export enters active scope.  
**Status:** Fixed

## Decide Analytics Approach

**Source document:** `/docs/functions/security.md`  
**Functional area:** Analytics / Security  
**Gap / defect:** Analytics approach is intentionally deferred to a later task.  
**Impact:** Analytics choices can affect privacy, consent, CSP and external script requirements.  
**Task type:** Product decision  
**Suggested priority:** Low  
**Product decision needed:** Yes  
**Suggested next step:** Decide between no analytics, privacy-preserving analytics or third-party analytics before implementation.  
**Status:** Fixed

## Verify Long Font Description Layout

**Source document:** `/docs/functions/font-browser.md`  
**Functional area:** Font Browser / Layout  
**Gap / defect:** Long descriptions may affect card height; this is a layout concern to verify manually.  
**Impact:** Font cards may become uneven or awkward if descriptions are long.  
**Task type:** Testing  
**Suggested priority:** Low  
**Product decision needed:** No  
**Suggested next step:** Manually test long names/descriptions at desktop and mobile widths.  
**Status:** Fixed

## Verify Trailing Space Width Contribution

**Source document:** `/docs/functions/render-text-to-grid.md`  
**Functional area:** Text Rendering  
**Gap / defect:** Trailing-space width contribution is confirmed and needs targeted verification.  
**Impact:** Users relying on intentional spacing need dimensions to remain accurate.  
**Task type:** Testing  
**Suggested priority:** Low  
**Product decision needed:** No  
**Suggested next step:** Add targeted tests for leading and trailing spaces.  
**Status:** Fixed

## Review Canvas And CSS Styling Drift

**Source document:** `/docs/functions/grid-rendering.md`  
**Functional area:** Grid Rendering / Export  
**Gap / defect:** Canvas styling can drift from CSS styling because it is rendered separately.  
**Impact:** Export output may slowly diverge from the visible UI as styles change.  
**Task type:** Technical debt  
**Suggested priority:** Low  
**Product decision needed:** No  
**Suggested next step:** Add visual parity checks or centralise colour/size tokens for preview and canvas export.  
**Status:** Fixed

## Keep Legacy Local Custom Font Helpers Migration-Only

**Source document:** `/docs/functions/local-storage.md`  
**Functional area:** Local Storage / Migration  
**Gap / defect:** Legacy local custom font helpers remain, acceptable only for migration/compatibility and not as an active source of truth.  
**Impact:** Future work may accidentally reintroduce browser-only persistence for shared font data.  
**Task type:** Technical debt  
**Suggested priority:** Low  
**Product decision needed:** No  
**Suggested next step:** Label legacy helpers clearly and remove them when migration support is no longer needed.  
**Status:** Fixed

## Verify User-Editable Font Category Implementation

**Source document:** `/docs/functions/font-data-model.md`  
**Functional area:** Font Data Model / Font Library  
**Gap / defect:** User-editable font category support is confirmed as a product rule, but implementation status needs code verification.  
**Impact:** Users may not be able to properly classify custom fonts if category editing is missing.  
**Task type:** Testing  
**Suggested priority:** Low  
**Product decision needed:** No  
**Suggested next step:** Verify category editing in current UI and add controls if missing.  
**Status:** Fixed


## Add A Meaningful Editor Page Heading

**Source document:** `/docs/functions/accessibility.md`  
**Functional area:** Accessibility / Navigation and Routing  
**Gap / defect:** Browser-level rendered checks found `/editor` with no `h1` in the checked output.  
**Impact:** Screen-reader and keyboard users may have weaker page orientation on the Font Editor route, and automated accessibility tooling is likely to flag the page structure.  
**Task type:** Accessibility  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Keep route heading regression coverage.  
**Status:** Fixed

## Add Formal Browser Accessibility Tooling

**Source document:** `/docs/functions/accessibility.md`  
**Functional area:** Accessibility / Testing  
**Gap / defect:** axe-core, Lighthouse and Playwright are not installed, so this pass could not produce formal accessibility scores or rule-level violations.  
**Impact:** Accessibility regressions may rely on manual/source review rather than repeatable automated browser checks.  
**Task type:** Accessibility / Testing  
**Suggested priority:** Medium  
**Product decision needed:** Yes  
**Suggested next step:** Choose the formal accessibility toolchain to add, then add repeatable browser-level accessibility checks to the regular test process.  
**Status:** Fixed

## Investigate Regular Lint Timeout After Production Build

**Source document:** `/docs/tests/test-run-results.md`  
**Functional area:** Testing / Tooling  
**Gap / defect:** `pnpm run lint` timed out after a production build, while direct source-only ESLint passed.  
**Impact:** The regular validation command may be unreliable after generated build output exists, which weakens the repeatability of the full test process.  
**Task type:** Testing / Technical debt  
**Suggested priority:** Medium  
**Product decision needed:** No  
**Suggested next step:** Investigate whether ESLint is traversing generated folders or another non-source path, then tighten the lint command/config so `pnpm run lint` remains reliable after `next build`.  
**Status:** Fixed


## Replace Static Design System Samples With Representative App Data

**Source document:** `/docs/functions/design-system.md`  
**Functional area:** Design System / Documentation  
**Gap / defect:** The `/design-system` route currently uses static sample content rather than representative app data.  
**Impact:** Component examples may drift from real font, grid and pattern data as the product evolves.  
**Task type:** Technical debt  
**Suggested priority:** Low  
**Product decision needed:** No  
**Suggested next step:** Replace or supplement static examples with small representative font and pattern fixtures once design-system adoption is prioritised.  
**Status:** Backlog

## Decide Keep-Alive Monitoring Schedule

**Source document:** `/docs/functions/keep-alive-endpoint.md`  
**Functional area:** API / Supabase Keep-Alive  
**Gap / defect:** No keep-alive monitoring or ping schedule is documented yet.  
**Impact:** The endpoint exists, but there is no agreed operational schedule or service responsible for calling it.  
**Task type:** Product decision / Testing  
**Suggested priority:** Low  
**Product decision needed:** Yes  
**Suggested next step:** Decide whether Vercel Cron, an external uptime monitor, or manual/deferred keep-alive checks should be used.  
**Status:** Backlog