Draft 1 stands. `createOrder` in src/orders/create.ts:3 accepts any string, so add UUID validation at the top of the function. Suggested comment:

[P2] src/orders/create.ts:3 — validate requestId as a UUID before querying.
