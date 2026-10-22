Target: HEAD~1...HEAD. Read: src/orders/create.ts, src/orders/schema.ts, src/api/routes.ts, spec/orders.fixture.ts.

Candidate: concurrent createOrder could duplicate. Disproved: src/orders/schema.ts:2 declares the requestId index unique, and src/orders/create.ts:12 catches DuplicateKeyError and returns the persisted order. spec/orders.fixture.ts:5 exercises two parallel calls.

No supported findings in the material examined. Coverage: all four changed or related files read; no external consumers in this repository.
