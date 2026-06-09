# Error Handling

## Purpose

Document how the app must respond to storage, persistence, rendering, export and navigation failures without hiding important problems from users. Any error that could affect whether data was saved to the database must be visible, recoverable and consistent.

## Source References

- Hook: `useFonts()` in `src/lib/useFonts.ts`
- Function: `refresh()` in `src/lib/useFonts.ts`
- Function: `saveEditableFont()` in `src/lib/useFonts.ts`
- Function: `deleteEditableFont()` in `src/lib/useFonts.ts`
- Utility: `src/lib/fontPersistence.ts`
- Function: `loadRemoteFonts()` in `src/lib/fontPersistence.ts`
- Function: `saveRemoteFont()` in `src/lib/fontPersistence.ts`
- Function: `deleteRemoteFont()` in `src/lib/fontPersistence.ts`
- Utility: `src/lib/localStorageUtils.ts`
- Utility: `src/lib/exportUtils.ts`
- Function: `patternToCanvas()` in `src/lib/exportUtils.ts`
- Component: `ExportControls` in `src/components/ExportControls.tsx`
- Component: `AuthStatus` in `src/components/AuthStatus.tsx`
- Page: `src/app/auth/callback/page.tsx`
- Page: `src/app/fonts/[id]/page.tsx`
- Page: `src/app/custom-fonts/page.tsx`
- Persistence state values: `loading`, `remote`, `unconfigured`, `error`
- Related UI pattern: inline status and warning messages
- Evidence gap: no central shared inline status/error component was found.
- Evidence gap: invalid remote fonts appear to be filtered without user-facing reporting.

## Decision Required

| Decision | Options | Recommendation | Impact if not confirmed |
|---|---|---|---|
| None currently outstanding for Error Handling decisions captured in this document. | N/A | N/A | N/A |

## Inputs

- Supabase configured/unconfigured state.
- Supabase load, save and delete errors.
- Failed or uncertain database persistence state.
- localStorage parse errors.
- Invalid font ids.
- Invalid font data.
- Invalid remote font rows.
- Canvas/export failures.
- Clipboard failures.
- Auth session errors.
- User retry actions after a failed save/delete/load.
- Any state where the app cannot confirm that database-backed data was saved.

## Outputs

- Consistent inline status or error message.
- Disabled create/save actions where persistence cannot write.
- Retry opportunity for recoverable database failures.
- Not-found state for invalid font detail route.
- Disabled export buttons where export is invalid.
- User-visible reporting for invalid remote font data.
- Fallback values only where they cannot hide unsaved database data.
- No browser-only substitute save when the intended database save fails.

## State Transitions

1. App attempts to load fonts, settings or persistence state.
2. Success produces normal UI state.
3. Failure updates a visible inline status or error message.
4. If a database save fails, the app must not show success or treat the change as saved.
5. The app must not create a browser-only replacement save after a database failure.
6. The user should be able to correct the problem or try the failed database operation again.
7. If invalid remote font data is detected, the issue should be reported to the user or an appropriate admin/debug surface.
8. Export failures are caught and shown in the same consistent inline status pattern.

## Rules and Requirements

| Rule | Product Status | Implementation Status | Notes |
|---|---|---|---|
| Database unavailable state must be visible. | Confirmed | Implemented | Persistence message is shown when storage is unavailable or errored. |
| Font changes must not save falsely after database failure. | Confirmed | Implemented | Save catches and returns, but UI feedback pattern still needs improvement. |
| Database failure must not allow temporary browser-only saves. | Confirmed | Implemented | Current public-font save path blocks when remote save fails instead of saving locally. |
| Database failures must show an error and allow the user to try again. | Confirmed | Partially Implemented | Errors are shown, often by alert; retry is mostly manual rather than a clear inline action. |
| Silent localStorage fallback must not be used when there is any chance database-backed data was not saved. | Confirmed | Partially Implemented | Current localStorage parsing can fall back silently; this is acceptable only for harmless local-only preferences, not save uncertainty. |
| Invalid remote fonts must be reported to users. | Confirmed | Not Implemented | Current mapping appears to filter invalid remote fonts without user-facing reporting. |
| All status messages must use a consistent inline pattern. | Confirmed | Partially Implemented | Current app mixes alerts, inline text and silent fallback. |
| Export failure should be user-visible. | Assumed | Implemented | `ExportControls` appears to set user-visible status text. |
| Invalid font id should show helpful state. | Confirmed | Implemented | Font detail not-found state exists. |

## Negative Rules

- Must not silently claim a failed save succeeded.
- Must not hide database save uncertainty behind localStorage fallback.
- Must not allow temporary browser-only saves after database failure.
- Must not make users rely on developer tools to learn that remote font data is invalid.
- Must not use inconsistent error/status patterns for similar workflow failures.
- Must not crash because browser storage is corrupt.
- Must not allow create/save where persistence cannot write.
- Must not hide unsupported character warnings.
- Must not expose secret environment values in UI.

## Acceptance Criteria

- Given Supabase is not configured, when the user views a create/save workflow, then create/save actions are unavailable and a clear inline message explains why.
- Given a remote save fails, when the save attempt finishes, then the user sees a consistent inline error and the app does not show a success state.
- Given a remote save fails, when the error is shown, then the app does not create a browser-only replacement save for that failed database operation.
- Given a remote save fails, when the error is shown, then the user has a clear way to try the save again.
- Given a remote delete fails, when the delete attempt finishes, then the item remains available and the user sees a consistent inline error.
- Given invalid remote font data is detected, when fonts are loaded, then the user or admin/debug surface is told that one or more remote fonts could not be loaded.
- Given localStorage contains corrupt preference JSON, when the app reads it, then harmless local-only preferences may fall back safely but the fallback must not hide a database save failure or database save uncertainty.
- Given export canvas creation fails, when export is attempted, then the export area shows a consistent inline error.
- Given an invalid font id is opened, then a not-found state appears.
- Given any status, warning or error message appears, when it is shown to the user, then it follows the shared inline status pattern.

## Edge Cases

- Supabase timeout.
- Network unavailable.
- Bad Supabase schema or RLS policy.
- Invalid remote font rows.
- Partial remote font data: font row exists but character rows are invalid.
- Browser clipboard failure.
- Canvas unavailable.
- Auth callback without session.
- Stale selected font id.
- Corrupt localStorage settings.
- Database save succeeds but refresh fails.
- Database delete succeeds but UI refresh fails.
- User retries a save after a database failure.
- Database becomes unavailable during an edit session.

## Current Code Behaviour

- Currently uses persistence modes `loading`, `remote`, `unconfigured` and `error`.
- Currently database save/delete failures use `window.alert` and update persistence state.
- Currently corrupt localStorage JSON falls back silently.
- Currently invalid remote fonts are filtered out by validation without a clear user-facing report.
- Currently export PNG catches errors and sets status text.
- Currently copy-to-clipboard failure falls back to displaying the dimensions as status text.
- Currently error handling is spread across hooks, pages and components rather than one consistent inline pattern.
- Currently browser-only localStorage is still used for some local reads/fallbacks, so each fallback must be reviewed against the confirmed database-save rule.

## Known Gaps / Defects

- Error presentation is inconsistent across alerts, inline messages and silent fallback.
- There is no central retry control for failed database sync or failed save operations.
- Invalid remote fonts are skipped without a user-visible explanation.
- localStorage fallback is silent in some paths and must be constrained to harmless local-only preferences.
- The app does not yet have one shared inline status pattern for all warnings, errors and success messages.

## Unclear or Assumed Rules

- None currently for Error Handling. The previously listed assumptions and product questions have been answered.

## Confirmed Product Decisions

- Silent fallback is not acceptable if there is a chance database-backed data was not saved.
- Database failure must not allow temporary browser-only saves.
- Database failure must show an error and allow the user to try again.
- Invalid remote fonts must be reported to users.
- All status messages must use a consistent inline pattern.

## Suggested Test Areas

- Supabase unconfigured state.
- Supabase load failure.
- Save failure with inline error.
- Save retry after failure.
- No browser-only replacement save after database failure.
- Delete failure with inline error.
- Corrupt localStorage fallback for harmless preferences.
- Corrupt or failed state that could affect database saves.
- Invalid remote font reporting.
- Export failure.
- Invalid font route.
- Consistent inline status pattern.

## Review Checklist

- [ ] Product behaviour is confirmed.
- [ ] Assumptions are accepted or corrected.
- [ ] Decisions required have been answered.
- [ ] Known gaps have been triaged.
- [ ] Acceptance criteria are ready to convert into tests.
