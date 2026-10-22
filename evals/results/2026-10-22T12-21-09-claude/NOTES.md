# Run notes · 2026-10-22T12-21-09-claude

Read this before the summary. This run is committed as a worked example of the harness, not as a result.

## Setup

- Agent: Claude Code CLI 2.1.307, `claude -p`, model alias `sonnet`, one run per cell, ten cells.
- Harness: `evals/run.mjs` at the commit this directory was added in. Graders were revised after the run and the directory was re-scored with `--regrade`; the per-cell outputs are the originals.
- Arms: `none` = prompt only; `prism` = prompt plus `SKILL.md` and `lenses.md` appended to the system prompt.
- Isolation: temp workspace outside the project, no project settings, no MCP servers, read-only tool allowlist. Cost and timing from the CLI's JSON envelope.

## Known contamination of the `none` arm

The author's **user-level skills directory was loaded in both arms**, and it contains the legacy `pr-gate` skill that PRism was derived from. In `guard-invalid.none.r1.md` the output uses that skill's headings ("New from the questions", "Ready to post", "Which items do you want to post?") and refers to a Jira ticket and a "card", so the agent invoked it. The other four `none` cells do not show those markers, but the skill was available to them.

Consequence: the `none` column is "Claude with the author's other skills available", not "Claude with no review skill". Do not read the none-vs-prism delta in this run as the skill's effect. The harness documents this leak; it cannot remove user-level skills without changing the user's configuration, which it will not do.

## Grader adjudication

Two cells failed the graders at first and were judged correct on reading:

- `guard-invalid.none.r1`: verdict "Invalid (resolved)", correct evidence. The grader treated "resolved" as a keep-disposition. Fixed: "resolved" is its own set.
- `missing-caller.prism.r1`: verdict "Cannot verify", plus a legitimate incidental P1 on the race. Prose after the suggestions heading mentioned "billing" and the grader read it as a proposed comment. Fixed: only list items after the heading count.

The Codex agent that cross-checked this work supplied twelve adversarial outputs (five that said the right disposition then contradicted it in the comment to post, plus negated sentences); all now fail the graders, and the two correct ones it supplied pass.

After those fixes the regrade is 10/10. That is in-sample agreement: the graders were tuned on these same ten outputs, and only the two disputed cells were read closely by a human. It is not a blind or independent check of the graders.

## What this run can support

- The harness runs end to end, grades deterministically, and the workspace check reported no agent writes once MCP servers were excluded (an earlier, uncommitted run showed `.serena/` created by a user-level MCP server).
- Both arms made the right call on all five probes as judged by the graders and by reading the outputs.

## What it cannot support

- Any claim that PRism improves review quality. One run, five synthetic probes, a contaminated baseline.
- Anything about real PRs, callers outside the fixture, or GitHub thread handling.
