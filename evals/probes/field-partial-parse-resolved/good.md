Draft 1 src/api/dimensions.ts:3 — Resolved. At the drafted revision, `parseInt` accepted `1200px` as 1200 despite the range check. At head, src/api/dimensions.ts:3-4 rejects non-digit tokens before parsing. The original defect was real, but the later push fixed it.

Suggested comments: none.
