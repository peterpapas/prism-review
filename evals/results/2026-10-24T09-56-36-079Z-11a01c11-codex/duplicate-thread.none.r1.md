# duplicate-thread.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Visible submitted review threads:
https://github.com/example/orders/pull/7#discussion_r123456 — read then insert can race; enforce requestId uniqueness (src/orders/schema.ts:2).

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:9 — the read then insert can race; add a unique constraint.

---

1. **Needs rewording — duplicates an existing submitted thread.** The race is valid: `create.ts:4` reads before inserting at line 9, while `schema.ts:2` declares a non-unique index and `insertOne` unconditionally appends rows. However, [the submitted thread](https://github.com/example/orders/pull/7#discussion_r123456) already raises the same race and requests uniqueness enforcement. Don’t post this as a separate finding; consolidate any additional detail into that thread.
