# logging-pii.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Review this pull request for defects. Report only what the code supports, with path:line citations. If there is nothing actionable, say so.

---

- **[P1] API token exposed in logs** — [src/api/routes.ts:3](src/api/routes.ts#L3): Logging the entire request body writes `apiToken` and `email` to standard output, exposing credentials and personal information to log readers and collectors. Log only the required identifier, such as `requestId`, or redact sensitive fields before logging.
