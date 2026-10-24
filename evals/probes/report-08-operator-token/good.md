Draft 1 src/case/login.js:3 — Resolved at head. The earlier truthy check allowed an object such as $ne into the login lookup, a security operator-injection risk. The final string guard at src/case/login.js:2 rejects object tokens before the database call.

Suggested comments: none.
