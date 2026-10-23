# guard-invalid.prism.r3

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

Draft 1 — **Invalid. Evidence: Disproved.** The claim that `requestId` is “never validated as a UUID” is contradicted by `src/api/routes.ts:5`: `postOrder` checks UUID format and throws before calling `createOrder`. The helper itself accepts strings, and the existing fixture deliberately calls it with `'id-1'`. No requirement that the helper independently enforce UUID format was found.

An incidental defect surfaced while checking this path:

[P2] src/orders/create.ts:9 — Concurrent requests can create duplicate orders for the same `requestId`, breaking idempotency. Evidence: both calls can complete `findOne` before either inserts; `src/orders/schema.ts` provides no uniqueness enforcement, and `insertOne` unconditionally appends. Fix: enforce uniqueness atomically and return the existing order on conflict. Proof: Supported.

Snapshot: local repository `C:/USER_HOME\AppData\Local\Temp\prism-eval-cbDi6p`, range `HEAD~1...HEAD`, obtained with `git diff`. Both SHAs were rechecked and remained unchanged:

- Base: `58056f6c6b97273732927332b309e85cd82891ca`
- Head: `2f671025ce2c3af3422839be1c0786b520e46ba3`

Coverage: read `PR.md`, both added source files, the complete schema/store, and the sequential fixture; searched visible callers. Draft source was your single pasted comment. Remote review threads and external consumers were not examined. The referenced `references/example.md` was unavailable. This was a focused Gate, so no overall approval recommendation is warranted.

Proposed checks, **not run**: verify an invalid UUID is rejected before insertion; concurrently submit two calls with the same valid UUID and assert one stored order. Nothing was edited or posted.

**Suggested comments for the user to consider**

1. `src/orders/create.ts:9` (head-side added line): “Two concurrent requests with the same `requestId` can both observe no existing order and insert duplicates. The store does not enforce uniqueness. Please make creation atomic for this key and return the existing order on conflict.”
