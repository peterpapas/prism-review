# duplicate-thread.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Visible submitted review threads:
https://github.com/example/orders/pull/7#discussion_r123456 — read then insert can race; enforce requestId uniqueness (src/orders/schema.ts:2).

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race; add a unique constraint.

---

Draft 1 **stands — already raised** in the [submitted thread](https://github.com/example/orders/pull/7#discussion_r123456). Avoid posting a duplicate.

[P2] `src/orders/create.ts:9` — Concurrent calls with the same requestId can both read no existing order at line 4, then both insert. `src/orders/schema.ts:2` declares an ordinary index; `insertOne` unconditionally pushes a row. UUID validation in `postOrder` does not prevent repeated IDs. Fix: enforce requestId uniqueness atomically and return the existing order on a duplicate conflict so concurrent retries remain idempotent. **Proof: Supported**, traced but not executed.

The supplied fixture only exercises sequential calls, so it does not disprove the race. Proposed test, **not run**: reset the collection, invoke two concurrent `postOrder` calls with the same valid UUID, and assert one stored order and both calls returning that order.

Snapshot: local repository, `HEAD~1...HEAD`, obtained with `git diff`:

- Base: `706504ff487f44b8e5cdb3e4719ac08beeff3ed8`
- Head: `622d274904bac3105e657152e0125ff93de73c6d`

Both SHAs were rechecked and unchanged. Line 9 is on the current added side of the diff.

Coverage: read `PR.md`, the complete creation function, route validation, schema/storage implementation, and fixture, including base versions of the schema and fixture. Gated the single user-pasted draft; thread information came from your supplied summary. Other GitHub drafts and threads were not retrieved. No additional findings or open questions within this draft’s scope; no overall PR recommendation from this targeted gate. Nothing was edited, executed as a test, or posted.

**Suggested comments for the user to consider**

1. None to add: the supported defect is already covered by the submitted thread.
