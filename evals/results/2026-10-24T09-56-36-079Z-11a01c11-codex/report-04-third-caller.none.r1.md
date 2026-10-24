# report-04-third-caller.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Review this pull request for defects. Report only what the code supports, with path:line citations. If there is nothing actionable, say so.

---

- **[P2] Normalize the previous type in `addMember`** — [src/case/callers.js:4](src/case/callers.js#L4). When `group.type` is `undefined` or `null`, this passes the raw value as `previous` and `'standard'` as `next`. `recordChange` consequently emits “group type changed to standard” even though no type change occurred. Normalize both arguments, as the other callers do, to prevent a false activity entry.
