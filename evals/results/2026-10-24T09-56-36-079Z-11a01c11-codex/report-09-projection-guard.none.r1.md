# report-09-projection-guard.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 911918ed9ad8c152abdf6d2fd74332596ea3c73a; current head is aac0b46cc35196be9e1337ba4c9f3348999e3412. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/invite.js:4 — the invite guard reads accessType, but the projection excludes it.

---

1. **Resolved.** At draft commit `911918e`, the projection on line 2 included only `{ name: 1 }`, while the guard on line 4 read `project.accessType`. Current head `aac0b46` adds `accessType: 1` to that projection, fixing the omission. Do not post this comment.
