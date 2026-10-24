# report-18-route-shape.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/paths.js:3 — REPORTS is a route object; pass REPORTS.path or replace throws.

---

Draft 1 — **Invalid. Evidence: Disproved.**

At [src/case/paths.js:1](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-n5Eq9x/src/case/paths.js:1), `ROUTE_PATHS.REPORTS` is the string `'/reports/:id'`. Its `.replace()` call on line 3 is valid; tracing `reportUrl('7')` yields `'/reports/7'`. Changing it to `REPORTS.path` would access `undefined` and introduce the claimed failure.

The `.path` access in `spec/path.fixture.js:3` does not establish an object contract: its ternary falls back to `'/reports'`.

Target: local repository `<LOCAL_HOME>\AppData\Local\Temp\prism-eval-n5Eq9x`, `HEAD~1...HEAD`, obtained with `git diff`.

- Base: `0cebad4b665cb734c24a6a1c55e8b2f97539e7bd`
- Head: `8a93049c0a853c7c3285394658efa49bfb5fc599`

Both SHAs were rechecked and remained unchanged. Reviewed the complete diff, `PR.md`, route implementation, fixture caller, and unchanged context file. All one supplied draft was assessed; remote drafts and threads were unavailable. The referenced `references/example.md` was absent.

**No supported findings in the material examined.** No new findings or open questions. Coverage was limited to this draft’s failure claim; no overall PR recommendation. Optional verification, not run: assert `reportUrl('7') === '/reports/7'`. No files were edited, tests run, or comments posted.

**Suggested comments for the user to consider**

None; omit draft 1.
