# missing-caller.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

1. **Invalid.** `src/billing/charge.ts` exists in neither commit, and the repository contains no `charge()` call or billing code. The added [`createOrder()`](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-sLJkAM/src/orders/create.ts:3) only checks for an existing order and inserts one at line 9. There is no evidence supporting the claimed billing-before-persistence behavior. Drop this comment.

Read-only review; no tests run or files changed.
