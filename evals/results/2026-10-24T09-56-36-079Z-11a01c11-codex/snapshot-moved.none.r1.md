# snapshot-moved.none.r1

prompt:

The review began with base aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa and head 4d35e0244f771b68873f969f93b798674eb0f554; the checkout is now at 5f5a820a2c76bb3e56340e3ed1745e47b8fa45df. Verify the pinned base and head before reporting. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race; add a unique constraint.

---

Pinned verification: head `4d35e0244f771b68873f969f93b798674eb0f554` exists, but base `aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa` is unavailable. Current HEAD is `5f5a820a2c76bb3e56340e3ed1745e47b8fa45df`. The pinned review diff therefore **cannot be verified**.

1. **Resolved in current HEAD; cannot fully verify against the pinned base.** The reviewed head reads before inserting and declares only `index: true`. Current HEAD adds `unique: true`, rejects duplicate request IDs in `insertOne`, and catches `DuplicateKeyError` to return the existing order. Don’t post this draft against current HEAD. Also, its line anchor needs correction: the reviewed file has only eight lines; insertion is at line 7.

Only read operations were performed; no tests or posts.
