# guard-invalid.none.r2

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

1. **Invalid — don’t post.** [`src/api/routes.ts:5`](C:/USER_HOME/AppData/Local/Temp/prism-eval-CuWIb9/src/api/routes.ts:5) validates UUID format and throws `Invalid UUID` before calling `createOrder` on line 6. The API entry point `postOrder` uses this validator on line 8. The claim that `requestId` is “never validated” is false; no evidence establishes a need to duplicate validation inside `createOrder`.
