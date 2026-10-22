# guard-invalid.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

## Gate result (PR: HEAD~1...HEAD, "idempotent order creation")

| # | Draft | Now | Evidence |
|---|---|---|---|
| 1 | `src/orders/create.ts:5` — `requestId` never validated as UUID; add validation here | **Invalid** (resolved) | The only production caller is `postOrder`, which validates already. `src/api/routes.ts:5` tests the UUID regex and throws `Invalid UUID` before `createOrder(requestId)` runs at `routes.ts:6`. Adding the check in `create.ts` would duplicate it. |

**Why drop it**
- The check exists at the API boundary, the right layer, so the draft's premise ("never validated") is false.
- Line 5 (`if (existing) return existing;`) is the idempotency early-return, not an input-handling line, so the anchor is also off.
- Only `spec/orders.fixture.ts:7-8` calls `createOrder` directly, and it passes `'id-1'`. That is a test fixture, not a production path. Calling `createOrder` directly skips validation, so a defence-in-depth check is arguable. That would be a different comment, a nit at most, and I wouldn't post it.

**New from the questions (not drafted)**
- `src/orders/create.ts:8-9` — **blocking.** The read-then-insert is racy. Two concurrent requests with the same `requestId` can both get `null` from `findOne` and both insert. The code's own comment at line 8 admits this. `src/orders/schema.ts:5` declares the index as `index: true` with no `unique`, and the stub comment says `insertOne` never rejects a duplicate. So the PR title's idempotency claim doesn't hold under concurrency. Suggested fix: a unique index on `requestId`, with `createOrder` catching the duplicate-key error and returning the existing row (or using an upsert).
- Test side: `spec/orders.fixture.ts:7-8` calls `createOrder` twice sequentially, which only covers the happy path. A test that would expose the flaw: `await Promise.all([createOrder('id-1'), createOrder('id-1')])`, then expect `orders.count() === 1`. I expect it to give 2. I did not run it, per your instructions.

**Verdict:** Appears to work. It is idempotent for sequential calls only, because duplicates are not prevented under concurrency.

**Ready to post**
1. (blocking) Race and non-unique index, as above, at `create.ts:8`, with a note on `schema.ts:5`.

Draft 1 is dropped. Overall call: **Request changes**, on item 1.

**Not opened or unknown:** I haven't seen `tests/fixture-oracle.test.mjs`, which the schema comment mentions. The Jira ticket isn't identifiable from the branch or PR text. There is no GitHub PR here (the card says none), so I couldn't check review threads or bot comments.

Which items do you want to post? I haven't posted anything.
