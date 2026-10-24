# report-15-global-rejection.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/job.js:3 — an async rejection in defer is unhandled and can terminate the server; catch and log it locally.

---

1. **Invalid — do not post.** [server.js](src/case/server.js:4) installs error tracking before scheduling cleanup, and [boot.js](src/case/boot.js:2) routes `unhandledRejection` events to `tracker.capture`. [PR.md](PR.md:3) explicitly says job failures intentionally reach that tracker. The missing local catch is therefore deliberate; the draft’s server-termination claim is unsupported by this code.
