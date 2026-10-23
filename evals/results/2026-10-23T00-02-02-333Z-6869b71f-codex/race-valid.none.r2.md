# race-valid.none.r2

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

1. **Needs rewording.** The race is real: concurrent calls can both read no existing order and then insert. `src/orders/schema.ts` explicitly makes `requestId` non-unique and permits duplicates. The fixture only checks sequential calls. A process-level lock would protect only one process, leaving the stated second-worker race unresolved.

   Suggested comment at `src/orders/create.ts:9`:
   > Concurrent requests with the same `requestId` can both pass the lookup and insert duplicate orders. Enforce uniqueness on `requestId` and use an atomic insert/upsert or handle duplicate conflicts by returning the existing order.
