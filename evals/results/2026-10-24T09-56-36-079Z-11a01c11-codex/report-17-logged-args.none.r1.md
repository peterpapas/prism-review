# report-17-logged-args.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/invite.js:2 — email was removed from the parameter list, so invite validation fails.

---

1. **Invalid.** In [invite.js:2](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-N0QF9T/src/case/invite.js:2), `email` remains in the positional parameter schema, `['email', 'projectId']`. Only the logging allowlist excludes it. [method.js:3](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-N0QF9T/src/case/method.js:3) maps both arguments into `values` and passes them to the handler, so this does not break validation. This matches PR.md’s stated intent.
