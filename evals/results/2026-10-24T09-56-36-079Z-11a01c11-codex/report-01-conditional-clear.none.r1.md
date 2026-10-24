# report-01-conditional-clear.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/connection.js:7 — the empty-connection branch clears by id only; a reconnect between read and write is wiped. Condition the absent state or skip the write.

---

1. **Stands.** In [connection.js:7](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-PaKD3l/src/case/connection.js:7), an initially absent connection produces selector `{ id }`. If a reconnect saves a connection after `db.get(id)` and before `db.update(...)`, the unconditional `$unset` removes it. The intervening `await db.otherRead()` provides an explicit opportunity for that interleaving. The populated branch guards against replacement using `connection.id`; the empty branch has no equivalent guard. Conditioning the update on continued absence, or skipping it, addresses the race.
