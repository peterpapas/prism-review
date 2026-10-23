# race-valid.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

Draft 1 — **Needs rewording.** The race is **Supported**; the proposed process-level lock assumes a deployment model that this repository does not establish.

[P2] `src/orders/create.ts:9` — concurrent requests with the same `requestId` can create duplicate orders. Evidence: both calls can obtain `null` from `findOne` before either resumes after `await`; `insertOne` then unconditionally appends both records. The index is nonunique. UUID validation in `postOrder` does not prevent repeated IDs, and the existing fixture exercises only sequential calls. Fix: make creation atomic per request ID at the storage boundary. Proof: **Supported**, not executed.

A process-level lock could protect this in-memory implementation within one process. It would not coordinate separate processes sharing persistent storage; that deployment context is unavailable.

Snapshot: local repository `C:/USER_HOME\AppData\Local\Temp\prism-eval-3pdQH4`, using `git diff HEAD~1...HEAD`:

- Base: `918bd0ddef2b0590f6d520ea38b3f9b880740f6b`
- Head: `df3d18d7e3fa68444f7bc331173437e1a08e064e`

Both SHAs were rechecked and remained unchanged. Draft source: your single pasted comment, fully assessed. Read: `PR.md`, both changed TypeScript files, and the schema and fixture at base and head. The referenced example file was absent. No external implementation, deployment configuration, or review threads were available; no broader review recommendation is offered. No separate new findings.

Proposed test, **not run**: reset storage, concurrently call `postOrder` twice with the same valid UUID, then assert one stored order and the same returned order. The traced implementation permits two stored orders.

**Suggested comments for the user to consider**

1. `src/orders/create.ts:9` (head-side added line): “Concurrent requests with the same request ID can both read no existing order and then insert, creating duplicates because `insertOne` does not enforce uniqueness. Please make creation atomic per request ID at the storage boundary and return the existing order when another request wins.”
