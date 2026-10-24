# report-16-wrapper-props.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/routes.js:2 — the page gets no projectId prop, so it never loads.

---

1. **Invalid — do not post.** `routes.js:2` wraps the page with `withParams`. In `src/case/wrapper.js:2–4`, that wrapper receives `routeParams`, loads the page, and calls `Page({ ...routeParams })`, forwarding `projectId`. `src/case/page.js:2` returns `'loaded ' + projectId` when provided. The draft overlooks this prop forwarding.
