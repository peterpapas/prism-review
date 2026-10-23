Draft 1 src/orders/create.ts:9 — Resolved. At the base revision, the read and insert could race because requestId had only a non-unique index. At head, src/orders/schema.ts:2 makes it unique and src/orders/create.ts:10 returns the persisted order after a duplicate key. This was a real draft when written, but the later push fixed it.

Suggested comments: none.
