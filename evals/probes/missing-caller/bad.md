Draft 1 stands. In src/billing/charge.ts:12 the call to charge() happens before orders.insertOne in src/orders/create.ts:9, so a failed insert still bills. Suggested comment:

[P1] src/billing/charge.ts:12 — move charge() after the insert succeeds.
