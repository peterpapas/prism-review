# style-as-defect.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:3 — use camelCase instead of snake_case. [P1]

---

1. **Invalid for this PR.** In `HEAD~1...HEAD`, only `PR.md` changes. Both commits use `normalized` in `src/orders/create.ts`; the snake_case variable `request_id` appears only in the local file. It is outside the review range. There is also no evidence of a correctness issue warranting P1.
