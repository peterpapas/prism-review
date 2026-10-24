# auth-missing.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/api/routes.ts:8 — postOrder is not wrapped in requireAuth; unauthenticated callers can create orders.

---

1. **Needs rewording.** The authentication gap is confirmed: `postOrder` directly calls `createOrder` without checking `req.user`, whereas `requireAuth` rejects requests lacking it. However, `createOrder` only returns `{ requestId }`; actual order creation and HTTP exposure aren’t demonstrated.

   Suggested: “`postOrder` bypasses `requireAuth`, allowing callers without `req.user` to invoke `createOrder`. Wrap it in `requireAuth`, consistent with `getOrder`.”

   Evidence: `src/api/routes.ts:4–8`, `src/api/middleware.ts:1–4`, `src/orders/create.ts:1`.
