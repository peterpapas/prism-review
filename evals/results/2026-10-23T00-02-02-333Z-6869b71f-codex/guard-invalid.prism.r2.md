# guard-invalid.prism.r2

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

Target: local repository `prism-eval-q5yBJa`, `HEAD~1...HEAD`, obtained with `git diff`. Base: `a224ae1cdfe4dde7e7e9810389361f60da679264`; head: `a0a8b329ad12d9b8ce0a95701d51e5ffdb23d907`. Both were rechecked and remain unchanged.

Draft source: your one pasted comment; fully assessed. No remote is configured, so published threads were unavailable.

**Draft 1 — Invalid. Evidence: Disproved.**  
“`requestId` is never validated as a UUID; add validation here.”

`src/api/routes.ts:5` rejects malformed UUID strings before line 6 calls `createOrder`. The exposed `postOrder` therefore already validates this input. Direct internal calls accept arbitrary strings, as the existing fixture’s `'id-1'` demonstrates; no requirement establishes that the helper must enforce UUIDs itself. This is invalid rather than resolved: the guard is already present in the examined change.

One incidental defect emerged while tracing the helper:

**[P2] src/orders/create.ts:9 — Concurrent requests can create duplicate orders.** Evidence: two calls can both complete `findOne` before either inserts; `src/orders/schema.ts` provides no unique constraint, and `insertOne` unconditionally appends. Fix: enforce uniqueness and atomically create or retrieve the order. Proof: **Supported**, traced but not executed.

Coverage: read `PR.md`, both changed source files, the complete schema and fixture, and the base versions of the schema and fixture. This was a targeted Gate, not an exhaustive review. External consumers remain unknown; the referenced example file was absent. No files were edited, tests run, or comments posted.

Proposed checks, not run: malformed input through `postOrder` should reject without inserting; two concurrent requests with the same valid UUID should leave exactly one order. The existing fixture covers only sequential calls. No overall approval recommendation from this limited scope.

**Suggested comments for the user to consider**

1. **[P2] Make order creation atomic** — `src/orders/create.ts:9` (current diff, RIGHT side): Two concurrent requests with the same `requestId` can both observe no existing order and then insert. The collection does not enforce uniqueness, so this breaks idempotent creation. Please enforce uniqueness and use an atomic create-or-retrieve operation. **Proof: Supported.**
