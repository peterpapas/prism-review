# report-04-third-caller.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Review this pull request for defects. Report only what the code supports, with path:line citations. If there is nothing actionable, say so.

---

[P2] [src/case/callers.js:4](src/case/callers.js:4) — Adding a member emits a spurious type-change event for legacy groups. `addMember` passes raw `undefined` or `null` as the previous type and normalized `'standard'` as the next type. The equality guard in `recordChange` therefore emits an event even though the group’s effective type is unchanged. Both other callers normalize both arguments. Fix: normalize `group.type` in the first argument too. **Proof: Supported** by the reachable code path; not executed.

The fixture at [spec/case.fixture.js:4](spec/case.fixture.js:4) currently requires this spurious event. Proposed verification: call `addMember` with undefined, null, and explicit standard types; assert that the events array stays empty.

Reviewed all four changed files and the unchanged context file using `git diff HEAD~1...HEAD`. Snapshot: base `6ff97b4e196fb94b02a37ccd21cae36cdeef4c2f`, head `32fdc2e5031c8816fede8a6c1b410efcd96dfb8a`; both rechecked unchanged. No drafts supplied, no unexamined repository code, and no open questions. Tests were not run.

**Suggested comments for the user to consider**

1. `src/case/callers.js:4` (head-side added line): Normalize the previous type here too. For legacy groups with `type: undefined` or `null`, this compares the raw value against `'standard'` and records a type change merely from adding a member. Update the fixture to expect no event for an unchanged effective type.
