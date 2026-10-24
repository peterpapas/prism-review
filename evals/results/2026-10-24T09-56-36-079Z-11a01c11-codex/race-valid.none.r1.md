# race-valid.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

1. **Needs rewording.** The race is real: `createOrder` awaits the lookup before inserting, so concurrent calls can both observe no order. `src/orders/schema.ts` explicitly has a nonunique index and accepts duplicate inserts. The fixture covers only sequential calls.

   A process-level lock only coordinates callers within one process; it does not protect against separate workers.

   Suggested comment:
   > Concurrent requests with the same `requestId` can both pass the lookup and insert duplicate orders, breaking idempotency. Please enforce uniqueness at the storage layer and use an atomic create-or-return operation, or handle a duplicate insert by returning the existing order.

Read-only review; no tests run.
