Draft 1 src/case/refresh.js:3 — Resolved at head, but the original was not trivial. Unsetting a required field fails validation in src/case/store.js:3, so an absence assertion was the wrong test. The final branches at src/case/refresh.js:2-3 keep lastActivity valid with a fallback.

Suggested comments: none.
