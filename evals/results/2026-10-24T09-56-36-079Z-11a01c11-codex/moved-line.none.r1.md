# moved-line.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 0a19a302ae80871acc4cc88f05eb635c87b3af96; current head is 6b9c762deadd1c14f49cf31a2f6893a5187f6937. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race.

---

1. **Needs rewording** — The read then insert remains unchanged; the original insert anchor moved from line 9 to [line 14](src/orders/create.ts:14). Concurrent calls can both pass the lookup at line 9 and reach insertion. The schema declares `index: true`, with no uniqueness constraint.

   Suggested wording: “Concurrent calls with the same `requestId` can both pass this lookup and reach insertion. Could creation enforce idempotency atomically?”

   Caveat: `schema.ts` contains stub methods with no persistence, so actual duplicate stored orders cannot be verified from this repository.
