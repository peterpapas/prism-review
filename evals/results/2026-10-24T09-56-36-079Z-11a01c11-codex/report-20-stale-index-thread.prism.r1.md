# report-20-stale-index-thread.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 3bda411b751ee63d1e6cf760bc328ad632b86e02; current head is 1e77da3f39c5684becc0c19a3e3e20c4aed4c6d2. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Visible submitted review threads:
https://github.com/example/project/pull/20#discussion_r2000 — index missing on channelId; original draft was raised before the index was added.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/webhook.js:2 — the channel lookup has no index; add one before shipping.

---

Draft 1 — **Resolved; already raised.**

The draft at `src/case/webhook.js:2` says the channel lookup has no index. At draft commit `3bda411`, `src/case/indexes.js` exported an empty index list. Current head `1e77da3` adds:

```js
{ keys: { channelId: 1 }, partialFilter: { channelId: { $exists: true } } }
```

This declares an index for the lookup’s `channelId` field. The original missing declaration was also [already raised in the supplied submitted thread](https://github.com/example/project/pull/20#discussion_r2000). Do not post the duplicate draft. Evidence outcome: **Disproved at the current snapshot**.

Target: local repository range `HEAD~1...HEAD`, obtained with `git diff`. Base `3bda411b751ee63d1e6cf760bc328ad632b86e02` and head `1e77da3f39c5684becc0c19a3e3e20c4aed4c6d2` were rechecked and remained unchanged. No remote repository identity was configured.

Coverage: read the complete diff, `PR.md`, webhook, index declaration, and context file; compared the original declaration and lookup. Draft source: your one pasted draft; submitted-thread context was supplied by you, not independently retrieved. The example reference was unavailable.

Open question: runtime index installation is not shown in this fixture, so deployment was not verified. No tests were run or proposed for this declaration check.

**No supported findings in the material examined.** Coverage was limited to this draft; no overall PR recommendation.

**Suggested comments for the user to consider**

None.
