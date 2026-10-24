# report-13-required-field.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at c428723a357aaa98cbf253585775782c25bd8b17; current head is 431135d3357e13132e888a16a10e5fcc72715915. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/refresh.js:3 — trivial: test that lastActivity is absent after the last activity is removed.

---

Draft 1 — **Invalid. Evidence: Disproved.**

“Test that `lastActivity` is absent after the last activity is removed” asserts behavior the store forbids. At both the draft and current snapshots, [store.js:3](/<LOCAL_HOME>/AppData/Local/Temp/prism-eval-m9GLkf/src/case/store.js:3) rejects `$unset.lastActivity` and updates without a truthy `$set.lastActivity`.

The earlier `refreshActivity` attempted that forbidden unset. Current [refresh.js:3](/<LOCAL_HOME>/AppData/Local/Temp/prism-eval-m9GLkf/src/case/refresh.js:3) instead sets `{ kind: 'created' }`, satisfying the existing constraint. The earlier implementation failure is resolved; the draft’s requested absence assertion was invalid even when written.

A useful replacement test would call `refreshActivity` with no latest activity and the real `createGroups()` store, then assert that it resolves to `{ kind: 'created' }`. Proposed only; not run.

Snapshot: local `HEAD~1...HEAD`, obtained with Git diff; base `c428723a357aaa98cbf253585775782c25bd8b17`, head `431135d3357e13132e888a16a10e5fcc72715915`. Both were rechecked before reporting.

Coverage: examined the complete diff, all three source files at both snapshots, and `PR.md`. One user-pasted draft was supplied and checked. No tests or callers are present; remote review threads were not examined. The referenced `references/example.md` is absent. No remaining open questions affect this disposition.

**No supported findings in the material examined.** This gate does not support an overall PR recommendation.

**Suggested comments for the user to consider**

None. Do not post draft 1 as written.
