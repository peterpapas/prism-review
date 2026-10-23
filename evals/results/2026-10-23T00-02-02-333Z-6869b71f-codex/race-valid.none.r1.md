# race-valid.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

1. **Needs rewording.** The race is real: concurrent calls can both find no existing order at [create.ts:4](src/orders/create.ts:4), then both insert at line 9. [schema.ts:2](src/orders/schema.ts:2) defines a non-unique index, and `insertOne` unconditionally appends. The fixture covers sequential calls only.

   A process-level lock would protect only callers sharing that process; it would not ensure idempotency across workers.

   Suggested comment:
   > Concurrent requests with the same `requestId` can both pass the lookup and insert duplicate orders because the index is not unique. Please enforce uniqueness at the storage boundary and use an atomic create-or-return operation, or handle duplicate conflicts by returning the existing order.

Read-only inspection; no tests run or posts made.
