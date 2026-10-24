# report-03-server-flag.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/grouping.js:3 — coordinators can invoke the new grouping method when the flag is off and can pass isTest to bypass safety.

---

Draft 1 — **Needs rewording (weaker).** The missing flag check is supported; the claim that `isTest` bypasses safety is disproved.

- `grouping.js:2` permits coordinators without checking `groupDrafts`. With `isTest` absent or false, execution reaches `store.insert` even when the UI flag is off.
- `isTest` is checked **after** authorization and returns an empty preview without writing. It bypasses neither authorization nor an existing safety check.

[P2] src/case/grouping.js:2 — Coordinators can create groups while the feature flag is disabled. Evidence: `client.js:2` gates visibility, but `createGroups` never invokes the server flag helper before insertion. Fix: enforce the feature flag on the server before allowing creation. Proof: **Supported**, by code tracing; not executed.

Target: local repository `<LOCAL_HOME>\AppData\Local\Temp\prism-eval-q1AI3n`, `HEAD~1...HEAD`, obtained with `git diff`. Both SHAs were rechecked and remained unchanged:

- Base: `3b3b54e8e299da4e01d2c41c0d38d83a2c176143`
- Head: `ce0c2fcaa2eef60b2abc9caa8dd9955f76056cdd`

Coverage: read all four changed files and unchanged `context.js`; searched for callers and guards. The single pasted draft was fully assessed. No callers, middleware, or tests are supplied, so external exposure remains unknown. No GitHub threads were available for deduplication. No additional findings or overall PR recommendation from this scoped Gate. The referenced `references/example.md` is absent.

Proposed test, **not run**: disable `groupDrafts`, invoke `createGroups` as a coordinator with `isTest: false`, and assert rejection with no store insertion. Nothing was edited, executed as a test, or posted.

**Suggested comments for the user to consider**

1. **[P2] `src/case/grouping.js:2` (head-side added line):** A coordinator passes this guard and reaches `store.insert` even when `groupDrafts` is disabled. The flag currently controls only UI visibility. Please enforce the flag server-side before allowing group creation.
