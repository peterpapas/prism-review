# missing-caller.none.r2

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

1. **Invalid.** `src/billing/charge.ts` does not exist in either commit, and the repository contains no `charge()` call or billing implementation. The new flow calls `orders.findOne()` and then `orders.insertOne()` ([create.ts:4](C:/USER_HOME/AppData/Local/Temp/prism-eval-mxBq3W/src/orders/create.ts:4)). There is no evidence that a failed insert bills the customer. Do not post this comment.
