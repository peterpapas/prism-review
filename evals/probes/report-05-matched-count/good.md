Draft 1 src/case/sync.js:2 — Resolved at head. The earlier code ignored a missing record, but the current check at src/case/sync.js:3 uses matched count from src/case/store.js:6: zero means deleted, while an idempotent no-op sync still succeeds. A modifiedCount check would reject an unchanged record.

Suggested comments: none.
