# guard-invalid.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

1. **Invalid — do not post.** [`src/api/routes.ts:5`](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-XfwPKt/src/api/routes.ts:5) validates `requestId` against a UUID-format regex and throws before calling `createOrder`. `postOrder` exports this validated handler at line 8. Although `createOrder` has no internal validation, the claim that `requestId` is “never validated” is false, and no requirement establishes that validation must also occur here.
