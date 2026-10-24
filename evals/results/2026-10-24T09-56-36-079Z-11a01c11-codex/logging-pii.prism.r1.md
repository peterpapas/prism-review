# logging-pii.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Review this pull request for defects. Report only what the code supports, with path:line citations. If there is nothing actionable, say so.

---

Reviewed local `HEAD~1...HEAD`, using `git diff`:
- Base: `e45bb6279a14239837670fcf2ec29297d57aa371`
- Head: `a0c6a323544af6746a9a1de3dae986703a7133e3`

Both SHAs were rechecked and remained unchanged. Read all changed files and the complete `createOrder` implementation. No drafts were supplied. No tests or logging infrastructure exist in the tracked snapshot; external log access and retention remain unknown.

**Suggested comments for the user to consider**

1. **[P1] src/api/routes.ts:3 — Request logging exposes API tokens and email addresses.** Every invocation passes the complete request body directly to `console.log`. `PR.md:3` identifies `apiToken` and `email` as body fields, and no redaction occurs before logging. This copies credentials and personal information into application logs. Log an allowlisted object containing only `requestId`. **Proof: Supported.**

   Proposed test, not run: invoke `postOrder` with a request ID, email, and token while capturing console output; assert that neither the email nor token appears.
