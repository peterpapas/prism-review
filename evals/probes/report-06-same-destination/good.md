Draft 1 src/case/move.js:5 — Resolved. Before the later push, an alias could make source and destination the same, then delete the only associations. At head src/case/move.js:4 returns early before the delete; the branch now skips it.

Suggested comments: none.
