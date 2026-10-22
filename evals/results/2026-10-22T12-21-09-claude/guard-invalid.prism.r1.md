# guard-invalid.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

**Gate result: Draft 1 is Invalid. Don't post it.**

**Snapshot:** local range `HEAD~1...HEAD`, base `a0f980a`, head `5c26a26`. I got the diff with git in the working tree, where the tracked files are unmodified. The drafts are the one you pasted. I didn't check for GitHub threads or a pending review, because the review is local and no PR URL was given.

## Draft 1: `src/orders/create.ts:5`: "`requestId` is never validated as a UUID; add validation here"

**Disposition: Invalid.**

- **The claim is false for the only caller.** `postOrder` in `src/api/routes.ts:4-8` tests `requestId` against a UUID regex (line 5). It throws `Invalid UUID` before it calls `createOrder`. That validation was in the same head commit as `createOrder`, so it came before your draft.
- **The location is also wrong.** `create.ts:5` is `if (existing) return existing;`. It isn't an input boundary.
- **No other caller bypasses the check.** The tracked files are `PR.md`, `src/api/routes.ts`, `src/orders/create.ts`, `src/orders/schema.ts` and `spec/orders.fixture.ts`. The only one that calls `createOrder` outside the route is the fixture, which passes `'id-1'`. That's test code, not a production path.
- **What I couldn't rule out.** `createOrder` is exported, so a future caller could skip the route's validation. Callers outside this repo are unknown. That's a design preference, not a defect in this change.
- **A note on the validator.** The `_schema` argument (`orderInput`) is ignored, so the regex is hard-coded. That doesn't affect this draft, because the check does run.

## New finding from checking this draft

**[P1] `src/orders/create.ts:4-9`: concurrent calls with the same `requestId` can insert duplicate orders, which defeats the idempotency the PR advertises.**
- **Mechanism:** `createOrder` does `findOne` and then `insertOne`, which isn't atomic. The code comment at line 8 admits this.
- **Evidence:** the `requestId` index in `schema.ts:2` and `schema.ts:8` is not unique. `insertOne` never rejects a duplicate, so two workers that both see `null` will both insert.
- **Test gap:** `spec/orders.fixture.ts:4` says it only covers sequential calls.
- **Fix:** make the `requestId` index unique and have `createOrder` catch the duplicate-key error and re-read the existing row. Alternatively, use an atomic upsert.
- **Proof:** Supported, not executed.
- **Confirming test:** reset `orders`, then run `Promise.all([createOrder('x'), createOrder('x')])` with an awaited `findOne` before either `insertOne`. Expect `orders.count() === 1`. Against the current code I'd expect 2.

## Coverage and limits
- **Read in full:** `PR.md`, all three changed files, `schema.ts` and the fixture.
- **Not run:** nothing was executed, as requested. The race is traced from the code, not reproduced.
- **Not examined:** the real database, because `schema.ts` is an in-memory stand-in, so the production index and driver behaviour are unknown. Also not examined: any callers outside this repo.

## Suggested comments for you to consider
1. General comment, or inline at `src/orders/create.ts:7`: "The find-then-insert isn't atomic and the `requestId` index isn't unique (`schema.ts:2`), so concurrent requests with the same ID can both insert. Add a unique index and handle the duplicate-key error by re-reading, or use an atomic upsert. The fixture only covers sequential calls, so a concurrent test would help." Check that line 7 is on the diff's new side before posting inline.

**Overall recommendation:** Comment, or Request changes if you treat idempotency as a hard requirement of this PR. That rests on the files in this repo only. I can't see how the production database is configured.
