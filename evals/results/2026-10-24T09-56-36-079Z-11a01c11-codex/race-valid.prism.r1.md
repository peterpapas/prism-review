# race-valid.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

Draft 1 — **Needs rewording.** The race is supported, but the proposed process-level lock needs correction.

**[P2] src/orders/create.ts:9 — Concurrent requests can create duplicate orders.** Both calls can complete `findOne` before either resumes after `await`, then both insert. `src/orders/schema.ts:2` declares only a non-unique index, and `insertOne` unconditionally appends. The API’s UUID validation does not prevent concurrent reuse of a valid ID. The existing fixture makes sequential calls only. **Proof: Supported**, through code tracing; not executed.

Use an atomic insert-if-absent operation in the collection. For shared persistent storage, enforce uniqueness on `requestId` and return the existing order on conflict. A process-level lock alone would not coordinate multiple processes.

Target: local repository `<LOCAL_HOME>\AppData\Local\Temp\prism-eval-7w8IqQ`, using `git diff HEAD~1...HEAD`.

- Base: `7b8d88d16ff8d8beea163f125501dd1f0e717c5f`
- Head: `df0b0aea71f6f1a334ec37b211d1038ab3222e02`
- Both SHAs were re-read and remained unchanged.
- Draft source: your single pasted comment; fully assessed. Remote threads were not accessed.
- Read: `PR.md`, complete creation function, API caller/validation, collection implementation, sequential fixture, and base versions of the collection and fixture.
- Limits: gate-only review; external consumers and deployment storage are unknown. The referenced worked example was absent. No separate new findings or overall PR recommendation.

Proposed test, **not run**: reset the collection, call `postOrder` concurrently twice with the same valid UUID using `Promise.all`, and assert that the collection contains one order.

**Suggested comments for the user to consider**

1. **[P2] `src/orders/create.ts:9` (RIGHT side, added line)** — Two requests with the same `requestId` can both read no existing order and then insert. The collection’s index is non-unique and `insertOne` accepts duplicates, so concurrent retries break idempotency. Please make creation atomic at the storage boundary and return the existing order when the ID already exists.
