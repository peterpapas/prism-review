# Run notes · expanded Codex comparison

Read this before using the chart. This is one run on forty small, synthetic fixtures, not a measurement of accuracy on live pull requests.

## Setup

- Codex CLI `0.163.0-alpha.11.2`, model `gpt-6.1-sol`, reasoning effort `none`, one run of every probe in each arm (80 cells).
- Each cell had a fresh temporary Git repository and `CODEX_HOME` with only the local login file. The CLI ignored user config and rules, had no MCP servers, and ran model commands in a read-only sandbox. The arms differed only in whether `SKILL.md` and `references/lenses.md` were supplied as `AGENTS.md`; this measures those instructions, not skill discovery.
- Arm order was interleaved. The graders, fixtures, and skill were held fixed during the run. The output, CLI trace, and grader result for every cell are saved here. Local home paths were replaced with `<LOCAL_HOME>` in the saved text artifacts after grading; no answer text or scores were otherwise changed.
- Twenty report-derived fixtures reconstruct an anonymized user-supplied case report. Its source PRs were not available for independent verification. Four more fixtures were inspired by private project review discussions, but their code is synthetic.
- Codex did not report dollar cost. `tokens` is the CLI's aggregate count and `seconds` is harness wall time; neither is a billing estimate.

## As-run scores

| Measure | No skill | PRism text |
|---|---:|---:|
| Strict regex rubric matches | 11/40 | 15/40 |
| Total CLI tokens | 250,958 | 465,272 |
| Mean wall time per probe | 19.5 s | 31.6 s |
| Invented checked citations / workspace changes / agent errors | 0 / 0 / 0 | 0 / 0 / 0 |

Nine probes passed the strict rubric in both arms, six only with PRism, two only without it, and 23 in neither. These are **rubric matches, not correctness rates**. The PRism arm used 1.85 times the CLI tokens and 1.62 times the wall time in this setup.

## Audit of every discordant pair

This was an unblinded, post-run read of the sixteen final answers in the eight pairs whose strict scores differed. The rubric was not retuned on these outputs.

| Probe | What the final answers show |
|---|---|
| `race-valid` | Both arms kept the race and rejected a process-only lock. No skill recommended “enforce uniqueness”; the rubric's exact keyword check missed it. |
| `auth-covered` | Both arms reported a clean protected route. No skill named `requireAuth` but omitted the file citation required by the rubric. |
| `swallowed-error` | Both arms kept the catch-all error concern. PRism distinguished duplicate recovery from other failures and said to propagate the latter; no skill stopped at identifying the swallowed database failure. |
| `style-as-defect` | Both arms dropped the P1 style draft. No skill cited the absence of a correctness issue, but the rubric wanted an explicit style/preference phrase. |
| `report-04-third-caller` | Both arms found the remaining unnormalized caller. PRism also identified the test expectation that encodes the bug; no skill omitted that point. |
| `report-06-same-destination` | Both arms explicitly said Resolved and described the new same-ID guard. The rubric missed PRism's disposition. |
| `report-08-operator-token` | Both arms said Resolved after the string guard. PRism additionally named an operator object (`$ne`) and the raw lookup; no skill only described a truthy object. |
| `report-10-shared-writer` | Both arms said Resolved and explained that the final code uses the current time. The rubric missed PRism's disposition/citation form. |

PRism supplied more complete evidence in `swallowed-error`, `report-04`, and `report-08`. The strict 15–11 margin cannot be read as four extra correct review decisions: every discordant pair had the same core call in both arms.

## Other checked failures and fixture limits

- `resolved-later.prism` explicitly compared the old non-unique code with the current unique index and duplicate recovery, then said not to post. The rubric still reported a conflicting disposition and missing before/after evidence.
- Both `logging-pii` answers identified the token log as P1 and proposed safe logging. The rubric rejected “redaction” and “allowlisted” because it only accepted narrower word forms; the no-skill answer also omitted the literal `Supported` label.
- `duplicate-thread.prism` linked the existing thread and said “None to add.” A severity-tagged evidence paragraph was treated as a proposed duplicate comment.
- `report-12-status-202.none` explicitly rejected treating every 202 as success and recommended handling 404 alone. A regex matched the harmful phrase inside that negation.
- Both `report-20-stale-index-thread` answers found the new index, called the old draft Resolved, and said not to post. The rubric expected Invalid for the repeated comment. That distinction is ambiguous because the prompt also supplied the old draft revision.
- In `auth-missing` and `unbounded-limit`, the tiny storage stubs do not establish persistent writes or actual large database reads. Both agents were more cautious than the required P1/P2 labels in at least one of these cases. `moved-line` has a similarly thin persistence stub. These fixture/oracle gaps should be repaired before treating their strict failures as reviewer mistakes.

This is a targeted audit of the eight score disagreements plus the examples above, not a blinded adjudication of all eighty answers. A strict pass may still hide a weak explanation, and an uninspected strict failure may be a real omission.

## Interpretation and next experiment

The expanded run shows that PRism text changed the detail and length of some answers and increased token and time use. It does **not** establish a higher correct-decision rate or fewer harmful comments. Several deterministic graders reject sound prose, and some fixture oracles demand claims their toy implementations do not support.

Repair the rubric using separate development examples, strengthen the thin fixtures, and then evaluate pinned public PRs with a blinded reviewer. Preserve this run as the unmodified as-run comparison; do not regrade it silently.
