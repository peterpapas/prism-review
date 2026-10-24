# report-18-route-shape.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/paths.js:3 — REPORTS is a route object; pass REPORTS.path or replace throws.

---

1. **Invalid.** [src/case/paths.js:1](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-OpbpZ1/src/case/paths.js:1) defines `REPORTS` as the string `'/reports/:id'`, so calling `.replace()` on line 3 is valid. Using `REPORTS.path` would instead yield `undefined`. The fixture’s `.path` check falls back to `'/reports'`; it does not establish that `REPORTS` is an object.

Read only; no tests run or files changed.
