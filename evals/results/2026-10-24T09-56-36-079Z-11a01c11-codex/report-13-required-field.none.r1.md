# report-13-required-field.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at c6141cb800c03e71b6713cae659b42d146f56021; current head is 300967ab267cf0d8e7f0d42ad706911f47c419c3. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/refresh.js:3 — trivial: test that lastActivity is absent after the last activity is removed.

---

1. **Invalid as written.** The requested absence violates the store’s requirement: `src/case/store.js:3–4` rejects unsetting or omitting `lastActivity`. At current HEAD, `src/case/refresh.js:3` replaces the draft’s `$unset` with `{ kind: 'created' }`, consistent with `PR.md:3`.

   If you want to retain a test suggestion, use: “Test that removing the last activity sets `lastActivity` to the created-event fallback.”

Read-only inspection only; no tests run.
