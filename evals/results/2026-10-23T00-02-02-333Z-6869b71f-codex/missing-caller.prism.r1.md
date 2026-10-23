# missing-caller.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/billing/charge.ts:12 — `charge()` runs before the order is persisted, so a failed insert still bills the customer.

---

Draft 1 — **Invalid. Evidence: Disproved.** `src/billing/charge.ts` exists in neither snapshot, and no billing or `charge()` call appears in the repository. The actual path is `postOrder` → `createOrder` → `orders.insertOne`; insertion only appends to an in-memory array. The claimed customer charge cannot occur in the examined code.

An incidental defect was found while tracing persistence:

[P2] `src/orders/create.ts:9` — Concurrent requests with the same request ID can create duplicate orders. Evidence: both calls can complete `findOne` before either inserts; `insertOne` unconditionally appends, and the request ID index is not unique. UUID validation does not prevent two requests using the same valid UUID. Fix: make creation atomic per request ID and return the existing order on conflict. Proof: **Supported**.

Snapshot: local repository `C:/USER_HOME/AppData/Local/Temp/prism-eval-3bGPpG`, using `git diff HEAD~1...HEAD`. Base `16b5965602c5e9738953c3083ff5c3bcd9f185e3`; head `88a15e1bbb5729ef88bd9312f6f0d43ac48506c8`. Both were re-read and remained unchanged.

Coverage: checked the one pasted draft, `PR.md`, both changed source files, schema/storage implementation, fixture, and base versions. The fixture covers sequential calls only. Remote threads and external consumers were not examined; no overall PR recommendation is offered. The referenced Gate example was absent.

Proposed test, **not run**: reset storage, concurrently call `postOrder` twice with the same valid UUID, then assert one stored order and the same order returned to both callers. No files were edited or comments posted.

**Suggested comments for the user to consider**

1. At head `src/orders/create.ts:9` (added diff line): “Concurrent requests with the same request ID can both pass `findOne` and insert separate orders because insertion does not enforce uniqueness. Please make creation atomic per request ID and return the existing order on conflict.”
