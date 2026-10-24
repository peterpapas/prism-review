# field-loading-finally.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/search/lookup.ts:6 — a rejected request leaves loading true because it resets only after success.

---

1. **Invalid.** In [src/search/lookup.ts:11](src/search/lookup.ts#L11), the `finally` block sets `state.loading = false` after both success and rejection. The diff shows that cleanup already existed before this PR. Do not post this comment.
