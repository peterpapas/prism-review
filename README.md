<p align="center">
  <img src="assets/prism-hero.svg" alt="PRism: one draft comment enters a prism and emerges as an evidence-backed decision" width="900">
</p>

<h1 align="center">PRism</h1>

<p align="center">
  <strong>Evidence first, then the comment.</strong><br>
  A read-only review gate that checks your draft comments against the code before anyone posts them.
</p>

<p align="center">
  <a href="#see-the-difference">See the difference</a> ·
  <a href="#install">Install</a> ·
  <a href="#use">Use</a> ·
  <a href="#how-it-decides">How it decides</a> ·
  <a href="#evidence-and-limits">Evidence &amp; limits</a>
</p>

<p align="center"><sub>Agent Skill · read-only · no posting · experimental</sub></p>

---

## See the difference

You have a comment ready: **“The read then insert can race; add a lock.”** PRism reads beyond the diff before that comment reaches the author.

| Draft comment | PRism's decision |
|---|---|
| “Validate `requestId` as a UUID.” | **Invalid.** The route already validates it before the handler. Drop the comment. |
| “The read then insert can race; add a lock.” | **Reword.** The race is real, but a process lock is the wrong fix across workers. The schema has no unique constraint; suggest uniqueness and duplicate-key handling. |

> `[P1] src/orders/create.ts:9 — concurrent requests with one requestId can create duplicate orders. Evidence: findOne then insertOne is not atomic, and the index is not unique. Fix: enforce uniqueness and handle the duplicate key. Proof: Supported.`

This is an [invented, checkable example](skills/prism-review/references/example.md), not a measured result or a claim about a live PR. **Supported** means the failure path was traced in code; it was not reproduced.

## Two ways in

| Gate drafts — the main workflow | Review a PR |
|---|---|
| Re-check every supplied draft. Keep, correct, drop, or mark it unverified. Report incidental new findings found while checking. | Find new candidates using six discovery lenses, then try to disprove each one before reporting it. |
| “Gate these drafted comments on `owner/repo#123`.” | “Review `owner/repo#123` with PRism.” |

If PRism cannot access your pending GitHub review, paste the drafts. It will **not** pretend it found them or silently turn a Gate request into a different review.

## Install

Copy the entire [`skills/prism-review/`](skills/prism-review/) directory into your agent's skills directory. Keep `SKILL.md` and `references/` together; there is no package, hook, or background service to install. PRism follows the [Agent Skills specification](https://agentskills.io/specification).

```text
your-agent-skills/
└── prism-review/
    ├── SKILL.md
    └── references/
        ├── lenses.md
        └── example.md
```

The agent needs read access to the target code. For GitHub PRs, it also needs appropriate GitHub read access. Pasted drafts work when pending reviews are inaccessible.

## Use

Ask in plain language:

```text
Gate these comments on https://github.com/owner/repo/pull/123:
1. src/api/routes.ts:42 — This route has no authorization.
2. src/orders/create.ts:9 — This read and insert can race.
```

Or say **“Do my drafts still stand?”**, **“Run PRism on this PR”**, or **“Review `base...head` with PRism.”** A Gate request needs drafts; a Review request does not.

PRism ends with a disposition for each draft, new supported findings, open questions, coverage limits, and numbered **suggested comments for you to consider**. It does not post comments, approve, request changes, resolve threads, edit files, or run tests.

## How it decides

```text
Resolve PR and snapshot → read beyond the diff → try to disprove the claim
                        → label the evidence → suggest, question, or drop
```

| Evidence | What PRism can say |
|---|---|
| **Confirmed** | A reproducer or failing test directly shows the failure at the examined commit. Suggest a comment. |
| **Supported** | A reachable code path and impact are traced, but not executed. Suggest a comment and name a confirming test. |
| **Unverified** | Decisive evidence is missing. Ask an open question; do not present it as a defect. |
| **Disproved** | A guard, constraint, or other counterevidence defeats the claim. Drop it. |

Gate uses **Stands · Resolved · Reword · Invalid · Cannot verify**. “Stronger” and “weaker” can qualify a disposition; “already raised” is a separate flag. Severity is based on impact, not on how confident a sentence sounds. The [skill instructions](skills/prism-review/SKILL.md) define the full workflow and the [six lenses](skills/prism-review/references/lenses.md).

## Evidence and limits

PRism records the base and head commits and rechecks both before reporting. It states what it read, what it could not read, and when a comment cannot be anchored to the current GitHub diff. A `path:line` citation proves only that a location exists; the cited code still has to support the claim.

**No performance claim yet.** The [evaluation plan](evals/README.md) describes behaviour probes, a small paired pilot, and what each can establish. The current [tests](tests/example.test.mjs) check the worked example's fixture and citations; they do not measure real-review quality.

PRism takes structural inspiration from [caveman](https://github.com/JuliusBrussee/caveman) and [ponytail](https://github.com/DietrichGebert/ponytail), and adapts an earlier private `pr-gate` workflow. It is a separate, unaffiliated project.

---

<p align="center">
  <strong>Check the claim. Keep the comment worth posting.</strong><br>
  <sub><a href="skills/prism-review/SKILL.md">Skill</a> · <a href="evals/README.md">Evaluation plan</a> · <a href="LICENSE">MIT license</a></sub>
</p>
