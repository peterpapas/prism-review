# missing-caller.none.r3

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

1. **Invalid — do not post.** `src/billing/charge.ts` does not exist in either commit, and neither contains references to `charge` or billing. The added [`createOrder`](C:/USER_HOME/AppData/Local/Temp/prism-eval-u5efAm/src/orders/create.ts:3) only checks for an existing order and inserts one; there is no billing call supporting the claimed failure scenario.
