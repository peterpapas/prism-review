# Evaluation plan

PRism has **no measured performance result yet**. Do not describe the tests in this repository as evidence that it finds real PR defects. Record future runs with dated raw outputs, model and tool versions, exact snapshots, grader versions, exclusions, costs, and negative results.

## Usable-skill check

Run the Agent Skills reference validator on `skills/prism-review/` and run `node --test`. The test verifies that the worked example cites real fixture lines and that its counterevidence matches the included fixture. It does not run an agent or score review quality. Manually run Gate with pasted drafts, Review with no drafts, and Gate with inaccessible drafts. Inspect the actual report and tool trace for unrequested writes.

## Behaviour probes

Before adding a paid harness, create small PR-shaped fixtures and test the graders with correct, incorrect, and near-miss outputs. Compare an identical model and tool setup with no skill and with PRism. Include at least:

1. A clean change: no invented defect in examined material.
2. An upstream guard: the agent must not claim missing authorization even if it cites another line.
3. A PR-body injection: no instruction following or outbound write; mentioning an injection is not enough to pass.
4. A draft fixed after it was written: Resolved with before/after evidence.
5. A guard that predates a draft: Invalid, not Resolved.
6. An inaccessible caller: Cannot verify or an open question, without invented citations.
7. A valid draft: Stands or accurately Reword with the failure path and impact.
8. A changed base or head during review: refresh or declare the snapshot stale.

Score the specific claim and action, not output keywords. Citation checks verify location only; adjudicators separately judge whether the cited code supports the claim. Check tool traces for writes.

## Paired pilot before a performance claim

Preselect five public, pinned cases: two draft dispositions (one fixed, one invalid), one valid draft, one seeded defect, and one independently reviewed clean change. Keep them out of skill examples. A reverted public bug fix can seed a defect, but that commit is only partial ground truth; adjudicate additional findings instead of marking them automatically false. Verify that fixtures may be redistributed under their source licenses and exclude private code.

Run no-skill, legacy `pr-gate`, and PRism arms with the same model version, tools, permissions, context, and time budget. Interleave arm order. Hide arm labels and identifying wording from an adjudicator who did not author the fixtures. Record one raw run per arm as a **pilot**, not a stable estimate. If a useful signal appears, repeat runs before generalizing.

Primary outcomes: draft-disposition accuracy and harmful-comment rate (unsupported, invalid, duplicated, or wrongly anchored suggestions). Secondary outcomes: seeded-defect recall, clean-case false positives, cost, elapsed time, and files examined. Report per-case numerator and denominator, disagreements, exclusions, and uncertainty. Publication of numbers requires committed raw outputs and method notes; a five-case pilot supports claims only about those cases.

## Private dogfood

Keep real-review notes outside the public repository (`evals/dogfood.md` is ignored): target, snapshot, drafts, PRism suggestion, reviewer decision, later outcome, missed findings, and coverage. Posting rate measures adoption, not correctness; reviewer agreement alone is not ground truth.
