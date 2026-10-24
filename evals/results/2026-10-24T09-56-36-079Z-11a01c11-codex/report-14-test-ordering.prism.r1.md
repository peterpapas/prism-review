# report-14-test-ordering.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. spec/cancel.fixture.js:3 — no tests cover sequence claiming for series and single cancellations; add both end-state tests.

---

Draft 1 — **Reword (weaker).** The requested end-state coverage already exists:

- `spec/cancel.fixture.js:3` checks that series cancellation ends with `sequence.value === 1`.
- Line 4 checks that single cancellation ends with `sequence.value === 0`.

The narrower gap is ordering coverage. `PR.md:3` promises claiming before notification, and `src/case/cancel.js:2–3` currently awaits the claim first. Neither fixture itself asserts the sequence value when `notify` runs. Moving the claim after notification could therefore escape these end-state assertions.

[P2] spec/cancel.fixture.js:3 — End-state assertions do not protect the promised claim-before-notification ordering. Evidence: both fixtures assert only after `cancel` returns. Fix: add notification-time assertions. Proof: Supported.

Proposed verification, **not run**: start with sequence value 0; use an asynchronous claim that sets it to 1; assert inside `notify` that series cancellation observes 1 and single cancellation observes 0.

Snapshot: local repository `<LOCAL_HOME>\AppData\Local\Temp\prism-eval-nSlOAX`, range `HEAD~1...HEAD`, obtained with `git diff`. Base `858ac24fc882f4afd00086aac0970aaeb451c44b`; head `77051b9857049d13d89af6df096391675a1cd5c4`. Both were rechecked and unchanged.

Coverage: examined all four tracked files, the complete diff, and repository instructions. The single pasted draft was fully assessed. No test runner, concrete injected callbacks, or review threads were available; whether external callbacks already assert ordering remains unknown. The referenced `references/example.md` is absent. No separate new findings or overall PR recommendation. No files edited, tests run, or comments posted.

**Suggested comments for the user to consider**

1. At `spec/cancel.fixture.js:3` (current diff, RIGHT side): “These fixtures already cover both final sequence values, but they don’t assert the promised ordering. Could we assert inside `notify` that the series claim has completed, and that single cancellation leaves the sequence unchanged? A claim moved after notification could still pass the current end-state checks.”
