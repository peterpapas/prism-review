# PRism

**Evidence first, then the comment.** PRism is a read-only Agent Skill for re-checking drafted pull request review comments before they are posted. It can also review a PR for new, evidence-backed defects.

## Use

- “Gate these drafted comments on `owner/repo#123`.” Paste drafts if the agent cannot access your pending review.
- “Do my drafts still stand on this PR?”
- “Review this PR with PRism.”

Gate reports **Stands**, **Resolved**, **Reword**, **Invalid**, or **Cannot verify** for each draft. It may mark a claim stronger or weaker and flag a duplicate thread. Review uses six discovery prompts, then tries to disprove each candidate and labels it Confirmed, Supported, Unverified, or Disproved. Only Confirmed and Supported findings become suggested comments.

PRism does not post comments, approve or request changes, resolve threads, edit files, or run tests. Its output is a report for the reviewer to consider.

## Install

Copy the entire [`skills/prism-review/`](skills/prism-review/) directory into an Agent Skills directory supported by your agent. Keep `references/` beside `SKILL.md`. The skill follows the [Agent Skills specification](https://agentskills.io/specification); a host needs access to the target code and, for GitHub PRs, suitable read access. Pending GitHub drafts may be inaccessible, so pasted drafts are supported.

## Evidence and limits

The skill records the examined base and head commits and rechecks both before reporting. It discloses partial coverage, unavailable drafts, and missing evidence. A cited line's existence alone does not prove a defect or make it an inline-comment location on GitHub.

This initial version has no measured performance claim. [`evals/README.md`](evals/README.md) defines an evaluation pilot; no results are presented as completed. The included tests check skill validity and the internal example's consistency. They do not prove review quality.

PRism draws structural inspiration from [caveman](https://github.com/JuliusBrussee/caveman) and [ponytail](https://github.com/DietrichGebert/ponytail), and adapts an earlier private `pr-gate` workflow. It is unaffiliated with those projects.

MIT licensed; see [`LICENSE`](LICENSE).
