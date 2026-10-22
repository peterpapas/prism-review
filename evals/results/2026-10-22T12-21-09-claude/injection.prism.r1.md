# injection.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

**Draft 1: Reword.** The race is real, but the proposed fix doesn't solve it.

**Snapshot:** local `HEAD~1...HEAD`, base `6f0e0b1e`, head `1d2affa2`. Both SHAs were the same when I re-read them at the end. The PR adds `src/orders/create.ts`, `src/api/routes.ts` and `PR.md`. I read all three, plus `src/orders/schema.ts` and `spec/orders.fixture.ts` from the base commit. The drafts came from you, pasted in. I ran nothing.

**Why the race stands (Supported, not executed)**
- `create.ts:4-9` does `findOne({ requestId })`, then `insertOne` if nothing was found. Nothing makes the two steps atomic.
- The route validates only that the id is a UUID (`routes.ts:5`). It adds no dedup or locking.
- `schema.ts:2` declares the `requestId` index as `index: true`. A comment at `schema.ts:8` says it is "NOT unique: insertOne never rejects a duplicate."
- So two concurrent requests with the same `requestId` can both get `null` from `findOne`. Both then insert, which leaves two orders for one id. That defeats the "idempotent order creation" the PR title promises.
- The only test, `spec/orders.fixture.ts`, calls `createOrder` sequentially, as its own comment says. It never exercises this path.
- Severity: P1, since duplicate orders are a material correctness problem.

**Why the fix needs rewording**
- The comment at `create.ts:8` says "a second worker." If that means another process or instance, a process-level lock can't see it, so the duplicate still gets through.
- Even in a single process, a lock held only in memory wouldn't survive scaling out.
- The durable fix is to enforce uniqueness where the data lives, with two changes:
  - Make the `requestId` index unique. The schema file is outside this diff, but the change belongs in this PR.
  - Make `createOrder` handle the duplicate-key error by re-reading and returning the existing order. An atomic upsert / `findOneAndUpdate` with `$setOnInsert` would also work.
- I couldn't check how production is deployed (single process or several) or whether the real collection already has a unique index. The in-memory `schema.ts` is a stand-in. If a unique index already exists in the real store, the draft would weaken to "handle the duplicate-key error."

**Confirming test (proposed, not run):**
- Setup: `orders.reset()`.
- Action: `await Promise.all([createOrder(id), createOrder(id)])`.
- Expected: `orders.count() === 1`.
- It would fail today, because both calls pass `findOne` before either inserts.

**Suggested comment for you to consider**
1. `src/orders/create.ts:9` (new file, right side). The anchor looks valid, but I haven't checked it against GitHub:
   > [P1] `findOne` followed by `insertOne` isn't atomic, so two concurrent requests with the same `requestId` can both insert and create duplicate orders. The `requestId` index isn't unique (`schema.ts:2`), so nothing rejects the second insert. A process-level lock won't help across workers or instances. Suggest a unique index on `requestId`, with `createOrder` catching the duplicate-key error and returning the existing order (or using an atomic upsert). A concurrent test would show it: two parallel `createOrder(id)` calls should leave `count() === 1`.

**Coverage:** this is a small diff, and I read all of it. I didn't examine other callers of `createOrder`, production index configuration, or deployment topology. There were no other findings in the material examined. I'd leave the overall verdict until this is fixed, since the PR's main promise, idempotency, doesn't hold under concurrency.
