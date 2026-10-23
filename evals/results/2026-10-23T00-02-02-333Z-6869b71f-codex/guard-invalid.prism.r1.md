# guard-invalid.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

Draft 1 — **Invalid. Evidence: Disproved.** The claim that `requestId` is “never validated as a UUID” is contradicted by `src/api/routes.ts:5`: `postOrder` checks UUID format and throws before calling `createOrder`. The helper itself accepts strings, and the fixture deliberately calls it with `'id-1'`; no requirement establishes that validation must also occur inside the helper. Unknown external callers remain unverified. Do not post this draft.

An incidental finding emerged while tracing the storage path:

[P2] `src/orders/create.ts:9` — Concurrent requests with the same request ID can create duplicate orders, breaking idempotency. Evidence: both calls can finish `findOne` before either inserts; `src/orders/schema.ts:15` unconditionally appends, and the request-ID index is not unique. Fix: make creation atomic per request ID, returning the existing order on conflict. Proof: **Supported**, by code inspection.

Snapshot: local repository `C:/USER_HOME\AppData\Local\Temp\prism-eval-ok1FLS`, `HEAD~1...HEAD`, obtained with `git diff`. Base `d725ec2c04b4cadd64fac1d183e2eac2e42bc80e`; head `06b7d4ae7dcc30c175c5d31920583e899b0c27ef`. Both SHAs were rechecked and unchanged.

Coverage: your one pasted draft was fully gated. Read `PR.md`, both new source files, the schema, and the sequential fixture, including base versions. GitHub threads and external consumers were not examined. The referenced worked example was unavailable. No overall PR recommendation: this was a scoped Gate.

Tests proposed but **not run**: reject an invalid ID through `postOrder` without inserting; concurrently create twice with one valid UUID and assert one stored order. No files were edited or comments posted.

**Suggested comments for the user to consider**

1. `src/orders/create.ts:9` (head-side added line): “Two concurrent calls with the same request ID can both observe no existing order and then insert. The request-ID index is not unique, so this creates duplicates and breaks idempotency. Could creation be atomic per request ID, returning the existing order on conflict?”
