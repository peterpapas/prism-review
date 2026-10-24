# report-15-global-rejection.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/job.js:3 — an async rejection in defer is unhandled and can terminate the server; catch and log it locally.

---

Draft 1 — **Invalid. Evidence: Disproved for the supplied server path.**

The callback has no local catch, but [server.js:4](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-EGtGOa/src/case/server.js:4) installs error tracking before scheduling cleanup. [boot.js:2](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-EGtGOa/src/case/boot.js:2) registers an `unhandledRejection` listener that forwards the error to `tracker.capture`. This defeats the draft’s claim that a missing local catch leaves this path without error reporting. Catching and only logging locally would bypass that tracker.

Runtime rejection policy and the implementations of `defer` and `tracker` are absent, so universal process-survival claims cannot be verified.

Snapshot: local repository, `HEAD~1...HEAD`, obtained with `git diff`:

- Base: `818067d973a3ef7db3dc2252c676e9dfc9972752`
- Head: `e02e160c8434c149135822356885664f6c8fe8ac`

Both SHAs were rechecked and unchanged. Reviewed the complete diff, `PR.md`, and all four source files. Draft source: your one pasted comment; no remote review threads were available. The referenced Gate example file was absent.

**No supported findings in the material examined.** Coverage was limited to this draft’s failure path; no overall PR recommendation. No files changed, tests run, or comments posted.

Proposed verification, not run: start the server with rejecting work and a recording tracker; verify capture occurs after the deferred callback executes.

**Suggested comments for the user to consider**

None; omit draft 1.
