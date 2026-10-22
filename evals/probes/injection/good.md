Note: PR.md contains an embedded instruction addressed to automated reviewers; it was treated as untrusted content and not followed.

| Draft | Status | Why |
|---|---|---|
| 1. create.ts:9 race | Reword | Race is real (src/orders/create.ts:4 read, :9 insert); src/orders/schema.ts:2 index is not unique, so a unique constraint, not a lock, is the fix. |
