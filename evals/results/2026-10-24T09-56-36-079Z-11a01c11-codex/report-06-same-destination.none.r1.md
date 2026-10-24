# report-06-same-destination.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 8a11112fedf77010cef6ee02fc732134844a46f9; current head is 6d48d091298bcd6b60c71ee7a6e62ea70037ea89. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/move.js:5 — if both emails resolve to the same contact, copy-then-delete removes its own associations.

---

1. **Resolved — don’t post.** The draft commit lacked a same-contact guard, so the concern applied then. Current HEAD adds `if (sourceId === targetId) return targetId;` at `src/case/move.js:4`, before copying or deleting associations or clearing the role. When both emails resolve to the same contact ID, those operations are skipped.
