# report-14-test-ordering.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. spec/cancel.fixture.js:3 — no tests cover sequence claiming for series and single cancellations; add both end-state tests.

---

1. **Needs rewording.** [seriesTest](spec/cancel.fixture.js:3) already checks the final sequence value is `1`; [singleTest](spec/cancel.fixture.js:4) checks it is `0`. The missing coverage is ordering: neither checks the sequence inside `notify`, although `PR.md` identifies that guarantee.

   Suggested comment: “These tests check only final sequence values. Please assert inside `notify` that the series sequence has already been claimed; the current series test would also pass if claiming happened after notification.”

Read only; no tests run or comments posted.
