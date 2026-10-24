# report-05-matched-count.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 830ae390ab82188af25e516984da29579b52be7f; current head is 794f1e0b84ed647b515972e83d9986b548a21fb1. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/sync.js:2 — throw 404 when modifiedCount is zero after the external sync.

---

1. **Resolved — do not post.** Current head checks the update result and throws when it is zero (`src/case/sync.js:2–3`). The store returns **matched-document count**, including unchanged matches (`src/case/store.js:6`), so `modifiedCount` is the wrong criterion.

The code throws `Error('not found')`; nothing in this repository establishes HTTP 404 mapping or a requirement for it.
