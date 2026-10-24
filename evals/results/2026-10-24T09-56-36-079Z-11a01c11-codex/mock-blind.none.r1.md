# mock-blind.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. spec/orders.fixture.ts:5 — the happy-path test proves concurrent duplicate requests are safe; drop the race concern.

---

1. **Invalid.** `spec/orders.fixture.ts:6` replaces `insertOne` with a stub, and line 8 calls `createOrder` only once. It exercises neither concurrent duplicate requests nor real persistence, so it cannot justify dropping the race concern. `src/orders/create.ts:3–5` still performs a separate lookup followed by an insert.

   Suggested replacement: “This fixture bypasses persistence and makes only one call, so it does not establish safety for concurrent duplicate requests.”
