# field-serial-restore.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/markers/restore.ts:7 — await in the loop is a performance defect; use Promise.all for the writes.

---

Draft 1 — **Invalid. Evidence outcome: Disproved.**

The sequential `await` in [restore.ts:8](/<LOCAL_HOME>/AppData/Local/Temp/prism-eval-dx9qX3/src/markers/restore.ts:8) ensures each conditional write finishes and its count is checked before the next write starts. When a write returns a count other than one, `MarkerConflict` stops subsequent writes. `Promise.all` would start subsequent writes before that conflict is checked, breaking this behavior.

The complete caller, `handleRestore` in `src/markers/route.ts`, passes `restore` into a database transaction. This corroborates the contract described in `PR.md`. No measured performance defect supports the draft or its proposed fix.

Snapshot: local repository `<LOCAL_HOME>\AppData\Local\Temp\prism-eval-dx9qX3`, using `git diff HEAD~1...HEAD`:

- Base: `73ea03cd201a703718d53135bf7bab84ee449a64`
- Head: `114c05032e78809783fd274fc93728f8d933cf5c`

Both SHAs were rechecked and remained unchanged. All one supplied draft was gated. Read the full diff, `PR.md`, repository guidance, and both versions of `restore.ts` and its caller. Database implementation, runtime performance, and external review threads were unavailable; no broader review was performed.

Proposed check, **not run**: supply two sorted markers and make the first conditional update return `{ count: 0 }`; verify rejection with `MarkerConflict` and that the second update is never invoked. No files were edited, tests run, or comments posted.

**No supported findings in the material examined.** No overall PR recommendation follows from this draft-only gate.

**Suggested comments for the user to consider**

None; drop draft 1.
