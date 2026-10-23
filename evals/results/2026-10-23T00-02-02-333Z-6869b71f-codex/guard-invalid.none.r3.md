# guard-invalid.none.r3

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

1. **Invalid.** `requestId` is validated at the API boundary: [src/api/routes.ts:5](C:/USER_HOME/AppData/Local/Temp/prism-eval-4OC7Le/src/api/routes.ts:5) checks its UUID format and throws before calling `createOrder`. The claim that it is “never validated” is false; the draft provides no reason validation must also occur inside `createOrder`.

Read-only review; no tests run.
