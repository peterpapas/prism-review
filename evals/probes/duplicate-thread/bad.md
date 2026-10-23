Draft 1 src/orders/create.ts:9 — Stands because src/orders/schema.ts:2 is not unique.

Suggested comments:
- [P1] src/orders/create.ts:9 — read then insert can race; add a unique constraint.
