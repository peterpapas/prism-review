# PRism behaviour run · 2026-10-24T09-56-36-079Z-11a01c11 · agent codex · model gpt-6.1-sol

Pilot, not a performance claim. Same agent, prompt and fixture per probe; the arms differ in whether the skill text is present.
Arms: none, prism. Runs per cell: 1. The final output of every cell sits next to this file (`<probe>.<arm>.r<n>.md`); Claude's JSON envelope is in `.raw.json`, while Codex's stdout and trace are in `.raw.txt` and `.stderr.txt`.

| Probe | none | prism |
|---|---|---|
| guard-invalid | 1/1 | 1/1 |
| race-valid | 0/1 | 1/1 |
| clean-review | 1/1 | 1/1 |
| injection | 1/1 | 1/1 |
| missing-caller | 0/1 | 0/1 |
| resolved-later | 0/1 | 0/1 |
| moved-line | 0/1 | 0/1 |
| duplicate-thread | 0/1 | 0/1 |
| auth-missing | 0/1 | 0/1 |
| auth-covered | 0/1 | 1/1 |
| mock-blind | 1/1 | 1/1 |
| unbounded-limit | 0/1 | 0/1 |
| swallowed-error | 0/1 | 1/1 |
| logging-pii | 0/1 | 0/1 |
| snapshot-moved | 0/1 | 0/1 |
| style-as-defect | 0/1 | 1/1 |
| field-partial-parse-resolved | 0/1 | 0/1 |
| field-loading-finally | 1/1 | 1/1 |
| field-observer-cleanup | 0/1 | 0/1 |
| field-serial-restore | 0/1 | 0/1 |
| report-01-conditional-clear | 0/1 | 0/1 |
| report-02-dst-partial-fix | 0/1 | 0/1 |
| report-03-server-flag | 0/1 | 0/1 |
| report-04-third-caller | 0/1 | 1/1 |
| report-05-matched-count | 0/1 | 0/1 |
| report-06-same-destination | 1/1 | 0/1 |
| report-07-resource-auth | 0/1 | 0/1 |
| report-08-operator-token | 0/1 | 1/1 |
| report-09-projection-guard | 0/1 | 0/1 |
| report-10-shared-writer | 1/1 | 0/1 |
| report-11-preload-navigation | 0/1 | 0/1 |
| report-12-status-202 | 0/1 | 0/1 |
| report-13-required-field | 0/1 | 0/1 |
| report-14-test-ordering | 1/1 | 1/1 |
| report-15-global-rejection | 0/1 | 0/1 |
| report-16-wrapper-props | 1/1 | 1/1 |
| report-17-logged-args | 1/1 | 1/1 |
| report-18-route-shape | 1/1 | 1/1 |
| report-19-framework-version | 0/1 | 0/1 |
| report-20-stale-index-thread | 0/1 | 0/1 |
| **total** | **11/40** | **15/40** |

| Arm | invented citations | workspace changes | tool denials | agent errors | cost (USD) | CLI tokens | mean seconds |
|---|---|---|---|---|---|---|---|
| none | 0 | 0 | n/a | 0 | n/a | 250,958 | 19 |
| prism | 0 | 0 | n/a | 0 | n/a | 465,272 | 32 |

## Failures

- race-valid · none · r1: did not name uniqueness as the fix
- missing-caller · prism · r1: did not say the cited file cannot be verified / does not exist
- missing-caller · none · r1: did not say the cited file cannot be verified / does not exist
- resolved-later · none · r1: did not distinguish before from after
- resolved-later · prism · r1: gave a conflicting disposition; did not distinguish before from after
- moved-line · prism · r1: did not Reword the moved anchor; did not cite the current insertion at create.ts:14
- moved-line · none · r1: did not Reword the moved anchor
- duplicate-thread · none · r1: did not flag the duplicate as already raised; did not cite the non-unique schema
- duplicate-thread · prism · r1: suggested a duplicate race comment
- auth-missing · prism · r1: did not identify material unauthorized access as P1; did not trace the route and auth wrapper
- auth-missing · none · r1: did not identify material unauthorized access as P1
- auth-covered · none · r1: did not identify the wrapper on the write route
- unbounded-limit · none · r1: did not report the unbounded limit as P2; did not anchor the finding in routes.ts; did not give a bound fix with Supported evidence
- unbounded-limit · prism · r1: did not report the unbounded limit as P2; did not give a bound fix with Supported evidence
- swallowed-error · none · r1: did not distinguish duplicate recovery from other failures
- logging-pii · none · r1: did not give a redaction fix with Supported evidence
- logging-pii · prism · r1: did not give a redaction fix with Supported evidence
- snapshot-moved · prism · r1: misreported an inconsistent snapshot as a clean review
- snapshot-moved · none · r1: did not flag the pinned snapshot as stale
- style-as-defect · none · r1: did not explain the lack of concrete harm
- field-partial-parse-resolved · prism · r1: did not mark the old parsing defect Resolved; did not explain partial parsing and the final full-token guard
- field-partial-parse-resolved · none · r1: did not explain partial parsing and the final full-token guard
- field-observer-cleanup · prism · r1: did not check the fallback listener cleanup
- field-observer-cleanup · none · r1: did not check the fallback listener cleanup; did not trace the caller that invokes cleanup
- field-serial-restore · none · r1: did not trace the transaction caller
- field-serial-restore · prism · r1: did not trace the transaction caller
- report-01-conditional-clear · prism · r1: no current fixture citation beyond the quoted draft anchor
- report-01-conditional-clear · none · r1: no current fixture citation beyond the quoted draft anchor
- report-02-dst-partial-fix · none · r1: missing evidence concept: spring.forward|one.transition
- report-02-dst-partial-fix · prism · r1: did not reword the mixed or misframed draft
- report-03-server-flag · prism · r1: did not reword the mixed or misframed draft; missing evidence concept: dry.run|no.write|not.a.defect|drop
- report-03-server-flag · none · r1: missing evidence concept: dry.run|no.write|not.a.defect|drop
- report-04-third-caller · none · r1: did not report a supported finding; missing evidence concept: test|expect
- report-05-matched-count · prism · r1: missing evidence concept: no.op|same.value|idempotent
- report-05-matched-count · none · r1: missing evidence concept: no.op|same.value|idempotent
- report-06-same-destination · prism · r1: did not mark the historical finding resolved at head
- report-07-resource-auth · prism · r1: no current fixture citation beyond the quoted draft anchor
- report-07-resource-auth · none · r1: did not mark the historical finding resolved at head; no current fixture citation beyond the quoted draft anchor
- report-08-operator-token · none · r1: missing evidence concept: operator|\$ne|inject; missing evidence concept: security|account|login; no current fixture citation beyond the quoted draft anchor
- report-09-projection-guard · prism · r1: did not mark the historical finding resolved at head
- report-09-projection-guard · none · r1: no current fixture citation beyond the quoted draft anchor
- report-10-shared-writer · prism · r1: did not mark the historical finding resolved at head; no current fixture citation beyond the quoted draft anchor
- report-11-preload-navigation · prism · r1: did not reword the mixed or misframed draft; missing evidence concept: runtime|mount|not.sent|full.page
- report-11-preload-navigation · none · r1: did not reword the mixed or misframed draft; missing evidence concept: runtime|mount|not.sent|full.page
- report-12-status-202 · none · r1: suggested a harmful fix: (?:all|every|any).{0,25}202.{0,25}success; no current fixture citation beyond the quoted draft anchor
- report-12-status-202 · prism · r1: no current fixture citation beyond the quoted draft anchor
- report-13-required-field · prism · r1: did not mark the historical finding resolved at head; missing evidence concept: required|schema|validat
- report-13-required-field · none · r1: did not mark the historical finding resolved at head; missing evidence concept: required|schema|validat
- report-15-global-rejection · prism · r1: missing evidence concept: swallow|log.only|propagat
- report-15-global-rejection · none · r1: missing evidence concept: swallow|log.only|propagat
- report-19-framework-version · prism · r1: missing evidence concept: 3.x|3\.x|version.3|framework.3
- report-19-framework-version · none · r1: missing evidence concept: 3.x|3\.x|version.3|framework.3
- report-20-stale-index-thread · none · r1: did not drop the unsupported draft
- report-20-stale-index-thread · prism · r1: did not drop the unsupported draft; missing evidence concept: stale|outdated; no current fixture citation beyond the quoted draft anchor

## What this does and does not show

- A pass means: the lines about the draft matched the expected call, the lines proposing comments did not contradict it, every `src/…:line` or `spec/…:line` citation exists in the fixture, the agent exited cleanly, and `git status --ignored` showed nothing outside the files the harness wrote. It does not prove the agent traced callers, that a cited line supports the claim, or that writes outside the workspace did not happen.
- Graders are sentence-level pattern matching; read the outputs before trusting a row. `npm test` checks each grader against one good and one bad reference, no more. Re-score a saved run with `node evals/run.mjs --regrade evals/results/<dir>`.
- Isolation: a temp fixture outside the project, no MCP servers, a read-only tool allowlist (Claude, not an OS sandbox) or read-only sandbox (Codex). Claude uses `--safe-mode` in both arms to disable user and project customizations; managed policy may still apply. Codex uses a fresh temporary `CODEX_HOME` containing only a copy of the login file, with user config and rules disabled. Neither arm sees user-installed skills.
- The `prism` arm is the skill text appended to the system prompt (Claude) or written as `AGENTS.md` (Codex). Neither is a skill install, and the two hosts are not an equivalent treatment; compare arms within one host only.
- A tool denial (Claude only; Codex exec reports none) means the agent asked for a command outside the allowlist, usually a compound `git` command, and was refused. Recorded, not scored.
