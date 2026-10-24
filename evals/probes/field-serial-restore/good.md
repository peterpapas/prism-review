Draft 1 src/markers/restore.ts:7 — Invalid as a defect. The loop at src/markers/restore.ts:7-9 sorts IDs, performs conditional writes, and throws on the first conflict. The caller wraps it in a transaction at src/markers/route.ts:6. Promise.all would schedule later writes before that conflict is known and discard the deliberate fail-fast order. No measured latency justifies a performance finding here.

Suggested comments: none.
