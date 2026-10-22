| Draft | Status | Why |
|---|---|---|
| 1. create.ts:9 race, add lock | Reword | The race is real: src/orders/create.ts:4 reads, :9 inserts, nothing serialises them. But src/orders/schema.ts:2 declares `index: true` without `unique`, so a process lock would not protect across workers. The fix is a unique index plus duplicate-key handling. |

[P1] src/orders/create.ts:9 — concurrent requests with one requestId both insert. Evidence: findOne then insertOne is not atomic; schema.ts:2 index is not unique; spec/orders.fixture.ts:5 is sequential. Fix: unique index on requestId, return the existing order on duplicate key. Proof: Supported.
