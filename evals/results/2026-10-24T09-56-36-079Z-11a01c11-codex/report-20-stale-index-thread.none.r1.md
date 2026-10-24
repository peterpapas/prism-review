# report-20-stale-index-thread.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 2569b2273f32fc8571ed065725bc90d4c260c0bd; current head is 52b7929d8cd51a6e2f126959370c2292b1dd62e4. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Visible submitted review threads:
https://github.com/example/project/pull/20#discussion_r2000 — index missing on channelId; original draft was raised before the index was added.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/webhook.js:2 — the channel lookup has no index; add one before shipping.

---

1. **Resolved.** The draft commit had an empty index list, but current head adds a `channelId: 1` index in `src/case/indexes.js:1`, with a partial filter for documents containing `channelId`. This addresses the lookup at `src/case/webhook.js:2`.

   Do not post the draft: it repeats the original issue already raised in [the submitted thread](https://github.com/example/project/pull/20#discussion_r2000). `PR.md` confirms the “index TODO” description is stale.
