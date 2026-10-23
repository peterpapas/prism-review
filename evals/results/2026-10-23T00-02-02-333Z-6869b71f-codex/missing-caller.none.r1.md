# missing-caller.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

1. **Invalid.** `src/billing/charge.ts` does not exist in HEAD, and the PR contains no `charge()` call or billing integration. The order creation path checks for an existing order and then calls `orders.insertOne(order)` at [src/orders/create.ts:9](/C:/USER_HOME/AppData/Local/Temp/prism-eval-tHlczC/src/orders/create.ts:9). There is no evidence for the claimed billing side effect. Do not post this draft.

Read-only review completed; no tests run or comments posted.
