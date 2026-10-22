# missing-caller.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

**Draft 1 (src/billing/charge.ts:12): invalid.**

- `src/billing/charge.ts` doesn't exist at HEAD. The tree only has `src/api/routes.ts`, `src/orders/create.ts` and `src/orders/schema.ts`.
- A case-insensitive search for `charge`, `billing` and `bill` across the repo returns nothing.
- The PR diff touches only `PR.md`, `src/api/routes.ts` and `src/orders/create.ts`. The base commit adds `spec/orders.fixture.ts` and `src/orders/schema.ts`. No commit in the history mentions billing.
- `createOrder` only does a `findOne` on `requestId`, then an `insertOne`. Nothing in it charges anyone, so the claim that a failed insert still bills the customer has no code behind it in this range.

Don't post it as written. It may have been meant for a different PR or branch. If the billing code lives elsewhere, point me at that branch or range and I'll check it there.

**A related point worth a separate comment (not one of your drafts):** `src/orders/create.ts:8` has its own comment saying that a second worker may pass the read before either worker inserts. That is a check-then-insert race. Nothing in `create.ts` or `routes.ts` prevents it, so two concurrent requests with the same `requestId` can both insert.

The PR title says "idempotent", so this undercuts the stated goal. I haven't read `schema.ts` to see whether it has a unique index on `requestId` that would turn the race into a duplicate-key error instead of a duplicate order. Check that before posting.

I didn't edit, run or post anything.
