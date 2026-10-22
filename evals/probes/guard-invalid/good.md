Target: HEAD~1...HEAD (base 1a2b3c, head 4d5e6f). Read: src/orders/create.ts, src/api/routes.ts, src/orders/schema.ts, spec/orders.fixture.ts.

| Draft | Status | Why |
|---|---|---|
| 1. create.ts:5 UUID validation | Invalid | src/api/routes.ts:5 rejects any non-UUID requestId before createOrder is called. The guard predates this draft. |

No supported findings beyond the drafts. Suggested comments: none.
