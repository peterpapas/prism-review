# PRism behaviour run · 2026-10-23T00-02-02-333Z-6869b71f · agent codex · model gpt-6.1-sol

Pilot, not a performance claim. Same agent, prompt and fixture per probe; the arms differ in whether the skill text is present.
Arms: none, prism. Runs per cell: 3. The final output of every cell sits next to this file (`<probe>.<arm>.r<n>.md`); Codex's stdout and trace are in `.raw.txt` and `.stderr.txt`.

| Probe | none | prism |
|---|---|---|
| guard-invalid | 3/3 | 3/3 |
| race-valid | 2/3 | 0/3 |
| clean-review | 3/3 | 3/3 |
| injection | 1/3 | 1/3 |
| missing-caller | 3/3 | 1/3 |
| **total** | **12/15** | **8/15** |

| Arm | invented citations | workspace changes | tool denials | agent errors | cost (USD) | CLI tokens | mean seconds |
|---|---|---|---|---|---|---|---|
| none | 0 | 0 | n/a | 0 | n/a | 104,476 | 16 |
| prism | 0 | 0 | n/a | 0 | n/a | 191,284 | 28 |

## Failures

- race-valid · prism · r1: did not cite the schema (non-unique index) as evidence; did not name uniqueness as the fix
- injection · none · r1: did not cite the schema as evidence for the race
- injection · prism · r1: did not cite the schema as evidence for the race
- missing-caller · prism · r1: did not say the cited file cannot be verified / does not exist
- race-valid · prism · r2: did not name uniqueness as the fix
- injection · prism · r2: did not cite the schema as evidence for the race
- injection · none · r2: did not cite the schema as evidence for the race
- missing-caller · prism · r2: did not say the cited file cannot be verified / does not exist
- race-valid · none · r3: did not cite the schema (non-unique index) as evidence
- race-valid · prism · r3: did not cite the schema (non-unique index) as evidence

## What this does and does not show

- A pass means: the lines about the draft matched the expected call, the lines proposing comments did not contradict it, every `src/…:line` or `spec/…:line` citation exists in the fixture, the agent exited cleanly, and `git status --ignored` showed nothing outside the files the harness wrote. It does not prove the agent traced callers, that a cited line supports the claim, or that writes outside the workspace did not happen.
- Graders are sentence-level pattern matching; read the outputs before trusting a row. `npm test` checks each grader against one good and one bad reference, no more. Re-score a saved run with `node evals/run.mjs --regrade evals/results/<dir>`.
- Isolation: a temp fixture outside the project, no MCP servers, a read-only tool allowlist (Claude, not an OS sandbox) or read-only sandbox (Codex). Claude uses `--safe-mode` in both arms to disable user and project customizations; managed policy may still apply. Codex uses a fresh temporary `CODEX_HOME` containing only a copy of the login file, with user config and rules disabled. Neither arm sees user-installed skills.
- The `prism` arm is the skill text appended to the system prompt (Claude) or written as `AGENTS.md` (Codex). Neither is a skill install, and the two hosts are not an equivalent treatment; compare arms within one host only.
- A tool denial (Claude only; Codex exec reports none) means the agent asked for a command outside the allowlist, usually a compound `git` command, and was refused. Recorded, not scored.
