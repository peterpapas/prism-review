Draft 1 src/search/lookup.ts:6 — Invalid. The awaited request at src/search/lookup.ts:6 is inside try/catch/finally. The finally block at src/search/lookup.ts:11 resets loading after success and rejection, so the claimed stuck spinner is absent.

Suggested comments: none.
