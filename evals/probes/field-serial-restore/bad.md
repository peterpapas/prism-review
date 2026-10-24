Draft 1 src/markers/restore.ts:7 — Stands. Sequential awaits are always slow.

Suggested comments:
- [P1] src/markers/restore.ts:8 — replace the loop with Promise.all.
