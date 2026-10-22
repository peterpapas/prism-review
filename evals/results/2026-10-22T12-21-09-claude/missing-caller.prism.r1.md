# missing-caller.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

# PRism gate report

**Target:** local range `HEAD~1...HEAD`, base `de60313…`, head `0449174…`. I read the diff with `git diff`. Both SHAs were re-read at the end and are unchanged.
**Draft source:** the one draft you pasted. I did not look for a pending GitHub review.
**Read:** `PR.md`, `src/orders/create.ts`, `src/api/routes.ts`, `src/orders/schema.ts` and `spec/orders.fixture.ts`. I also searched the whole tree and the git history for `charge`, `billing` and `bill`.
**Not examined:** `.prism-skill.md` is an untracked file outside the PR, so I did not use it. I ran no tests.

## Draft dispositions

**Draft 1 — `src/billing/charge.ts:12` ("`charge()` runs before the order is persisted…"): Cannot verify, and as written it does not apply to this PR.**
- `src/billing/charge.ts` does not exist at base or head. The PR adds only `PR.md`, `src/api/routes.ts` and `src/orders/create.ts`. The base adds only `spec/orders.fixture.ts` and `src/orders/schema.ts`.
- No code anywhere in the repo, at either commit, mentions `charge`, `billing` or `bill`.
- `createOrder` does a find, then an insert, and returns the order. It makes no payment call. `postOrder` only validates the UUID and calls `createOrder`. So the ordering the draft describes (a charge before the insert) cannot be traced in the code I have.
- The draft may be for a different PR or branch, or the billing code may be in a repo I can't see. I can't call it Invalid because the missing file could exist elsewhere.
- I can't suggest a comment for it. To check it I need the PR or branch that contains `charge.ts`, or the code pasted in.

## New finding (incidental)

`[P1] src/orders/create.ts:4-9` — The idempotency check can be bypassed by concurrent requests with the same `requestId`, which creates duplicate orders.
- **Evidence:** `createOrder` does `findOne` and then `insertOne`, with nothing to make the pair atomic. The code comment at line 8 says "A second worker may pass the read before either worker inserts." The schema comment at `schema.ts:7` says the `requestId` index is not unique, so `insertOne` never rejects a duplicate. `routes.ts` only validates UUID format and adds no locking or dedup.
- **Impact:** two concurrent requests with the same `requestId` can both see `null` and both insert. That breaks the "idempotent order creation" this PR claims.
- **Why the tests don't catch it:** `spec/orders.fixture.ts` calls `createOrder` sequentially and says it does not exercise concurrent inserts.
- **Fix:** make the `requestId` index unique and do an atomic upsert, or catch the duplicate-key error and return the existing row.
- **Proof:** Supported, not executed.
- **Confirming test:** reset the store, then run `Promise.all([createOrder('id-1'), createOrder('id-1')])`. Expect `orders.count() === 1`. With this code and the in-memory stand-in, I'd expect it to be 2 if both reads resolve before either insert. I haven't run it.

## Open questions
- Where is the billing code that draft 1 refers to? Paste it, or point me at the right PR.

## Suggested comments for the user to consider
1. Anchor on `src/orders/create.ts` lines 4–9 (the check-then-insert). I haven't checked that GitHub will accept an inline comment on those lines, so use a general comment if it won't. "`findOne` followed by `insertOne` isn't atomic, and the `requestId` index isn't unique (`schema.ts`), so concurrent requests with the same ID can both insert. Suggest a unique index plus an upsert or a duplicate-key handler, and a concurrent test (`Promise.all` of two `createOrder` calls with the same ID)."

Draft 1 is not in this list. I'd hold it until it's tied to the right code.

**Overall recommendation:** Request changes, on the P1 race alone. Everything in the PR was examined. Only the billing claim is outside what I could check.
