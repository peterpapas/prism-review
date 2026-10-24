# Field-inspired review probes

These are small, synthetic reconstructions of situations found while reviewing
merged PR discussions in a private production project. They contain no source
code, reviewer text, repository identity, or links from that project. The
original discussions included automated comments, so each expected disposition
was checked against the changed code and, where relevant, later commits. A bot
warning alone was never treated as ground truth.

| Probe | Review pattern observed | What the fixture tests |
|---|---|---|
| `field-partial-parse-resolved` | A reviewer spotted that bounded `parseInt` still accepts a partial numeric token. A later push added full-token validation before merge. | Preserve the original valid observation while marking the draft Resolved at final head. |
| `field-loading-finally` | An automated warning said a rejected async request could strand a loading flag, although the code already reset it in `finally`. | Trace both success and rejection before endorsing a UI failure claim. |
| `field-observer-cleanup` | An automated warning said a subscription lacked cleanup, while the observer and fallback listener branches each returned cleanup. | Inspect all allocation branches and reject a leak claim when both are released. |
| `field-serial-restore` | An automated warning proposed parallelizing awaits that performed ordered conditional writes inside a transaction. | Recognize the conflict and ordering contract before calling sequential work a performance defect. |

The fixtures and good/bad references are authored oracles. `tests/fixture-oracle.test.mjs`
executes the behaviors that make each label testable. A Tier-1 pass would show
what an agent said on these reconstructions; it would not establish accuracy on
the original private PRs or measure deployment outcomes.
