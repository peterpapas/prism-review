# guard-invalid.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

1. **Invalid — do not post.** The API validates `requestId` against a UUID-format regex before calling `createOrder` ([routes.ts:5](C:/USER_HOME/AppData/Local/Temp/prism-eval-KIMZXc/src/api/routes.ts:5)). Although `createOrder` itself accepts any string, no requirement establishes that validation must also occur there; the existing fixture explicitly passes `'id-1'` ([orders.fixture.ts:7](C:/USER_HOME/AppData/Local/Temp/prism-eval-KIMZXc/spec/orders.fixture.ts:7)). The claim that it is “never validated” is false.
