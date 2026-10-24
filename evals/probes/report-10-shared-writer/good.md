Draft 1 src/case/activity.js:2 — Resolved. The earlier shared writer used createdAt, so an edit of an old message via src/case/edit.js:3 could move activity backwards. At head src/case/activity.js:2 uses now for the timestamp again.

Suggested comments: none.
