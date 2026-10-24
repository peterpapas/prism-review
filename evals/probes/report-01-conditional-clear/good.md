Draft 1 src/case/connection.js:7 — Stands. The absent-connection branch uses an id-only selector at src/case/connection.js:7; the intervening read at src/case/connection.js:4 leaves a reconnect window. Skip the write when absent or condition it on connection $exists false.

Suggested comments: none.
