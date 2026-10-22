# race-valid.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

**Draft 1 (src/orders/create.ts:9): the race is real, but the proposed fix is wrong, so reword it.**

**The race is real.**
- `src/orders/create.ts:4-9` does `findOne`, then `insertOne`, with an `await` between them.
- Two concurrent calls with the same `requestId` can both see `null` and both insert.
- The `requestId` index in `src/orders/schema.ts:2` is `index: true` only, not unique. The comment at `schema.ts:8` says "insertOne never rejects a duplicate", so nothing at the storage layer stops the second insert.
- `spec/orders.fixture.ts:4` calls `createOrder` sequentially and says it does not exercise concurrent inserts. It gives no coverage for the race.

**The process-level lock is the wrong fix.**
- The code comment at `create.ts:8` says "A second worker may pass the read". That means multiple workers, so likely multiple processes.
- A lock inside one process doesn't coordinate across workers, so the race stays open in any multi-worker or multi-instance deploy.
- The durable fix is a unique index on `requestId`, with `insertOne` catching the duplicate-key error and returning the existing row. An atomic upsert (`findOneAndUpdate` with `upsert` and `$setOnInsert`) also works.
- A process lock could still be a stopgap for a single process, but it shouldn't be the recommendation.

**Suggested rewording:**
> `findOne` then `insertOne` isn't atomic. Concurrent requests with the same `requestId` can both insert, because the `requestId` index in `schema.ts` isn't unique. A process-level lock won't help across workers. Make the index unique and handle the duplicate-key error by returning the existing order, or use an atomic upsert. It would also be worth adding a concurrent-call test, since `spec/orders.fixture.ts` only runs sequential calls.

**Not verified:** I didn't check the deployment topology, so I can't confirm how many workers or processes run. The in-memory `orders` stub in `schema.ts` is a stand-in, so I haven't seen the real collection or driver. I only read files and ran nothing.
