[P1] src/orders/create.ts:4 — findOne then insertOne is not atomic, so concurrent requests can create duplicate orders. Fix: add a unique index on requestId.

[P3] src/orders/create.ts:12 — consider logging the duplicate-key path.
