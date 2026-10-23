# race-valid.prism.r3

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

Draft 1 — **Needs rewording.** The race is **Supported**, but a process-level lock would not protect a shared collection across workers.

Two concurrent calls can both read no existing order at `create.ts:4`, then both insert at line 9. `schema.ts:13–18` confirms that reads and inserts are separate and inserts accept duplicates; the `requestId` index is not unique. The API’s UUID validation permits repeated valid IDs. The existing fixture only checks sequential calls.

Use atomic storage-level creation by `requestId`, returning the existing order when another request wins.

Target: local repository `prism-eval-xGgB8t`, `HEAD~1...HEAD`, obtained with Git diff.

- Base: `fa1184c6393dc1646258e94e7aa2b15e59e7e3bf`
- Head: `e881ce654bfb6484c7b749f7daa301eaeae0d2b3`

Both SHAs were rechecked and remained unchanged. Reviewed the complete create function, API caller, collection implementation, fixture, PR description, and base versions. Draft source: your single pasted comment. Remote threads and deployment details were unavailable; no broader review or overall approval recommendation is offered. No additional findings. The referenced worked example was absent.

Proposed test, **not run**: reset the collection, call `postOrder` twice concurrently with the same valid UUID, and assert one stored order and the same returned order. No files were edited or comments posted.

**Suggested comments for the user to consider**

1. **[P2] src/orders/create.ts:9 — Concurrent requests can create duplicate orders.** Both requests can pass `findOne` before either inserts, and `insertOne` accepts duplicate `requestId` values. Make creation atomic at the storage boundary and return the existing order on a conflict; a process-level lock cannot coordinate separate workers sharing storage. **Proof: Supported.** Anchor: added line 9 on the current head diff.
