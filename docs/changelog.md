# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- 2026-05-04: Initial project setup. Files affected: `src/*`, `docs/*`, `package.json`, `supabase/migrations/*`.
- 2026-05-04: Added an in-app Documentation Center with routable pages for overview, architecture, components, data flow, API and dependencies. Files affected: `src/app/docs/*`, `src/lib/documentation.ts`, `src/app/layout.tsx`, `src/app/globals.css`, `docs/tasks.md`, `docs/rules.md`.
- 2026-05-04: Added JSON export for fonts on the Manage Fonts page and shared JSON export helpers. Files affected: `src/app/custom-fonts/page.tsx`, `src/components/ExportControls.tsx`, `src/lib/exportUtils.ts`, `src/lib/documentation.ts`, `docs/tasks.md`.
- 2026-05-04: Added utility tests for localStorage fallback handling and export behavior, and updated the test runner to execute all utility tests. Files affected: `tests/localStorageUtils.test.ts`, `tests/exportUtils.test.ts`, `tests/runTests.ts`, `package.json`, `docs/tasks.md`.

### Changed
- 2026-05-04: Cleaned up documentation rules and changelog entries so they follow the agreed source-of-truth format. Files affected: `docs/rules.md`, `docs/changelog.md`, `docs/tasks.md`.
- 2026-05-04: Added lucide icons to useful action controls while keeping text labels for clarity. Files affected: `src/components/FontCard.tsx`, `src/components/ExportControls.tsx`, `src/components/CharacterEditor.tsx`, `src/app/custom-fonts/page.tsx`, `src/app/globals.css`, `docs/tasks.md`.
- 2026-05-04: Improved responsive layout behavior for mobile, tablet and desktop verification by tightening button wrapping, toolbar sizing, editor grid scrolling and docs table overflow. Files affected: `src/app/globals.css`, `docs/tasks.md`.

### Fixed
- (none yet)

---

**Format for new entries:**
- **Added** for new features
- **Changed** for changes in existing functionality
- **Fixed** for bug fixes
- **Removed** for removed features
- **Security** for security improvements

**Rules:**
- Add a new entry after every completed task or group of related tasks
- Include the date, a short description, and files affected
- This is a historical log — never edit or delete past entries
