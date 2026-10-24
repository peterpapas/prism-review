# report-07-resource-auth.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at ef10b9a7732559950528bf01a59fc5cf86b5b63c; current head is 372df687201c36e10748507edb973f184bac21b2. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/calendar.js:4 — any signed-in user can sync a meeting ID onto its owner calendar; require resource-level edit access.

---

1. **Resolved.** At draft commit `ef10b9a`, only login was checked before calendar sync. Current head adds `await db.assertCanEdit(user, meeting)` at [src/case/calendar.js:4](src/case/calendar.js:4), before `calendar.push` on line 5. This addresses the requested resource-level edit check; drop the draft comment.

The assertion’s implementation is absent from this fixture, so its internal correctness cannot be verified.
