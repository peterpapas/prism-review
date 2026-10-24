# report-05-matched-count.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 75fc52a09bb7befae78bd097494f5ca0ec203bd0; current head is 420ade34e75b189df7ba7ef4f822590faedf421f. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/sync.js:2 — throw 404 when modifiedCount is zero after the external sync.

---

Draft 1 — **Resolved**, with a terminology correction.

At draft SHA `75fc52a09bb7befae78bd097494f5ca0ec203bd0`, `syncExternalId` ignored the update result and returned success even when no row existed. Current head `420ade34e75b189df7ba7ef4f822590faedf421f` checks `count === 0` and throws `Error('not found')` at [sync.js:3](src/case/sync.js:3).

The result is a **matched-document count**, not `modifiedCount`: [store.js:4](src/case/store.js:4) returns zero for a missing row, while line 6 returns one even for an unchanged match. The current guard therefore covers the missing-record path without rejecting unchanged records.

An HTTP **404** cannot be verified: this fixture contains no HTTP handler or error mapping. The generic throw establishes failure, but not an HTTP status.

Reviewed the complete local `HEAD~1...HEAD` diff, both versions of `sync.js`, `store.js`, `context.js`, and `PR.md`. Both SHAs were rechecked and remained unchanged. Draft source: your one pasted comment; remote threads were not examined.

**No supported findings in the material examined.** Coverage is limited to this fixture; HTTP behavior remains unknown. Proposed checks, not run: a missing ID rejects; an existing ID with the same external ID succeeds. No files were edited, tests run, or comments posted.

**Suggested comments for the user to consider**

None. Do not post the original draft; its missing-record concern is addressed.
