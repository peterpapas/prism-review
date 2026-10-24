# resolved-later.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at bd227b718064c957ec4cf5e4b20d22b64cdbceb2; current head is 804b9a741a1c4a49c6348ece51cca90134210cd8. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race; add a unique constraint.

---

1. **Resolved — do not post.** The draft predates the fix in `804b9a7`. `src/orders/schema.ts:2` now declares `requestId` unique, and lines 13–14 reject duplicates before inserting, without an intervening `await`. `src/orders/create.ts:7–11` catches `DuplicateKeyError` and retrieves the existing order. Concurrent callers can still pass the initial read, but duplicate insertion is now prevented and handled.

Read-only inspection; no tests run.
