Draft 1 src/case/remove.js:5 — Reword. The 202 mapping at src/case/remove.js:5 also includes 401, 403 and 429; only 5xx is thrown at src/case/remove.js:4. Accepting every 202 would hide real failures. Handle 404 as already removed and preserve other 4xx errors.

Suggested comments: none.
