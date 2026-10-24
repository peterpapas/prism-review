# field-serial-restore.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/markers/restore.ts:7 — await in the loop is a performance defect; use Promise.all for the writes.

---

1. **Invalid.** [PR.md](PR.md) specifies ordered conditional writes that stop at the first conflict within the caller’s transaction. [restore.ts:8](src/markers/restore.ts:8) awaits each write and checks its result before starting the next. `Promise.all` would launch subsequent writes before detecting a conflict, breaking that contract. The sequential `await` is intentional; the draft provides no evidence of a performance defect.
