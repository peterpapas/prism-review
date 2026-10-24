# swallowed-error.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — catch returns null for every insert failure, hiding database errors.

---

1. **Stands.** In `src/orders/create.ts:4–6`, `await orders.insertOne(...)` is inside an unconditional `catch` that returns `null`, discarding the error. Previously, insert failures rejected the returned promise. The implementation in `src/orders/schema.ts:2` throws `Error('database unavailable')`, which this change swallows.

   This matches the stated PR intent. No callers are present, so downstream harm cannot be verified.
