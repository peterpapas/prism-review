Draft 1 src/api/dimensions.ts:3 — Stands. The current code still accepts 1200px because parseInt ignores the suffix.

Suggested comments:
- [P2] src/api/dimensions.ts:5 — reject non-digit dimensions.
