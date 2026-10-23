# race-valid.none.r3

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

1. **Needs rewording.** The race is real: concurrent calls can both find no existing order at `create.ts:4` and insert at line 9. In `schema.ts:2`, `requestId` has a non-unique index, and `insertOne` unconditionally appends rows. The fixture only exercises sequential calls (`spec/orders.fixture.ts:6–7`).

   A process-level lock would only coordinate calls within one process; it would not protect multiple workers.

   Suggested comment:
   > Concurrent requests with the same `requestId` can both pass the lookup and insert duplicate orders, breaking idempotency. Enforce uniqueness at the storage layer and atomically create-or-return the order, handling conflicts by returning the existing order.
