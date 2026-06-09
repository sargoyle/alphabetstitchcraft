# Test Maintenance Rules

## Purpose

These rules keep Alphabet Stitch tests aligned with the confirmed functional requirements in `/docs/functions`.

## Source Of Truth

- Functional requirements live in `/docs/functions`.
- Implementation order and backlog live in `/docs/tasks.md` and `/docs/tasks/known-gaps-defects.md`.
- Test planning lives in `/docs/tests`.
- Test results live in `/docs/tests/test-run-results.md`.

## Rules

- Add or update tests when a confirmed requirement changes.
- Do not write tests that lock in an unclear product rule.
- If a requirement is confirmed but the current app fails it, record the planned test as pending instead of silently changing the requirement.
- Keep automated tests focused on observable behaviour, data contracts and user-relevant outcomes.
- Do not change production behaviour just to make a test pass unless the related defect is approved for fixing.
- Every new function or feature should have a matching function requirements page and matching test-plan entry.
- Prefer small utility tests for pure functions and targeted browser tests later for UI workflows.
- Test names and assertions should explain the requirement being protected.
- Update `test-run-results.md` after each meaningful test run.

## Current Test Command

```powershell
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.\node_modules\typescript\bin\tsc' -p tsconfig.tests.json
& 'C:\Users\61402\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' '.test-build\tests\runTests.js'
```

## Pending Test Policy

Use pending/manual entries when:

- the requirement is confirmed but the implementation is known to fail;
- the behaviour requires browser automation not yet set up;
- the source document still has a product decision outstanding;
- the test would require changing production code first.
