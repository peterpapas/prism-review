# Worked Gate example

This is an invented fixture, not a claim about a real PR. The source files are in `evals/fixture/` at the repository root. Imagine a PR that adds `createOrder` and two reviewer drafts:

1. `src/orders/create.ts:5` — “Validate `requestId` as a UUID.”
2. `src/orders/create.ts:9` — “The read then insert can race; add a process lock.”

Read `src/api/routes.ts`, `src/orders/schema.ts`, and the order test beyond the changed function. The route validates `requestId` before calling `createOrder`; that guard existed when draft 1 was written. The schema has an ordinary index, and the test uses sequential calls.

| Draft | Disposition | Reason |
|---|---|---|
| 1 | Invalid | `src/api/routes.ts:5` validates UUID before the handler. It was never a missing guard in this fixture. |
| 2 | Reword | `src/orders/create.ts:9` can race. A process lock is insufficient across workers; a unique constraint and duplicate-key handling address the root cause. |

Suggested comment:

`[P1] src/orders/create.ts:9 — concurrent requests with one requestId can create duplicate orders. Evidence: findOne then insertOne is not atomic; src/orders/schema.ts:3 defines a non-unique index, and the test is sequential. Fix: enforce uniqueness and return the existing order on duplicate key. Proof: Supported. Test: two parallel calls with the same ID -> one persisted order.`

The hypothetical reviewer should verify the line is present on the current PR diff before offering it as an inline GitHub comment. The test has not been run, so this is Supported, not Confirmed. No publication occurs.
