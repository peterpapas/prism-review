# report-10-shared-writer.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. The draft was written at 72b1730633cbfcc8a2e465170c6e0982a72242d9; current head is c30550462da5e1ed589d24e0d321953c9c348824. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/activity.js:2 — using an old message createdAt for every activity edit moves the group activity timestamp backwards.

---

1. **Resolved — do not post.** At draft commit `72b1730`, `addActivity` used `message.createdAt`, and the edit caller passes the original message. Current HEAD `c305504` changes the timestamp to `now` in [activity.js:2](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-HKajWk/src/case/activity.js:2), which [edit.js:3](<LOCAL_HOME>/AppData/Local/Temp/prism-eval-HKajWk/src/case/edit.js:3) forwards. The old message’s creation time no longer determines the activity timestamp.

Only read operations were performed; no tests, edits, or posts.
