# race-valid.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race under concurrent requests; add a process-level lock.

---

# Gate report: 1 draft, Reword

**Snapshot:** local `HEAD~1...HEAD`, base `5b01c9e69a33`, head `f26648e4bee6`. I re-read both SHAs after investigating and they were unchanged. The diff came from local git. The draft is the one you pasted, so I couldn't check it against any GitHub threads.

**Read:** `PR.md`, `src/orders/create.ts`, `src/orders/schema.ts`, `src/api/routes.ts` and `spec/orders.fixture.ts`. I didn't run anything.

## Draft 1: `src/orders/create.ts:9`
**Disposition: Reword.** The race is real, but the proposed fix doesn't solve it.

**The defect stands. Proof: Supported.**
- `createOrder` does `findOne({requestId})` and then `insertOne`, with an `await` between them (`create.ts:4-9`). Two concurrent calls with the same `requestId` can both see `null` and both insert.
- `src/orders/schema.ts` says "The requestId index is NOT unique: insertOne never rejects a duplicate." `orderSchema` also declares only `index: true`. Nothing downstream rejects or dedupes the second insert.
- `postOrder` in `src/api/routes.ts` only validates the UUID format and then calls `createOrder`. It adds no guard.
- The PR's stated purpose is idempotent creation, so a duplicate order for one `requestId` breaks the feature's contract. I'd rate it P1.
- The only test, `spec/orders.fixture.ts`, runs sequential calls and says it doesn't exercise concurrency. It therefore can't catch this.

**The fix is wrong.** A process-level lock only serialises calls inside one process. The code's own comment talks about "a second worker", and API handlers are normally run as several processes or instances. Two workers would still race. I found no evidence of a single-process deployment, so the lock is at best a partial fix.

**Suggested reword:**
> [P1] `src/orders/create.ts:9` — The find-then-insert isn't atomic, and the `requestId` index isn't unique (`schema.ts`). Two concurrent requests with the same `requestId`, from the same or different workers, can both insert, which breaks the idempotency this PR is meant to provide. Fix: make the `requestId` index unique and enforce it in the database. Then either do an atomic upsert (insert-if-absent, return the existing row), or insert and, on a duplicate-key error, re-read and return the existing order. An in-process lock won't help across workers. Test to confirm: with a fresh store, run `Promise.all([createOrder('id-1'), createOrder('id-1')])` and expect `orders.count() === 1`. At this snapshot I expect it to return 2.

**Anchoring:** line 9 is the `insertOne` call, which is the right place for an inline comment. I haven't checked whether GitHub accepts it on the current diff side, so it may need to be a general comment.

## New findings, open questions, coverage
- **New findings:** none beyond the draft.
- **Open question:** the real datastore may differ from the in-memory stand-in in `schema.ts`. If a unique index already exists elsewhere, the race would surface as an unhandled duplicate-key error rather than a duplicate row. `createOrder` has no handling for that either, so the reword still applies.
- **Not examined:** deployment topology, how many workers run, and any real DB migration, since none are in the repo.
- **Tests:** proposed above, not run.

**Overall:** I'd post the reworded comment as Request changes, since the idempotency guarantee doesn't hold under concurrency. Only one file of real logic was reviewed, and that supports the call.
