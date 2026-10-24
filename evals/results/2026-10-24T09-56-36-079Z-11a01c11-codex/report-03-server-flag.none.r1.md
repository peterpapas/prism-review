# report-03-server-flag.none.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/case/grouping.js:3 — coordinators can invoke the new grouping method when the flag is off and can pass isTest to bypass safety.

---

1. **Needs rewording.** The missing server flag check is supported; the claimed `isTest` safety bypass is not.

   Evidence: `client.js:2` gates visibility on `flags.groupDrafts`, but `grouping.js:2` accepts coordinators and line 4 inserts groups without checking that flag. The server flag helper in `flags.js` is unused. However, `isTest` returns an empty preview before insertion (line 3), after authorization—it does not bypass any demonstrated safety check.

   Suggested comment at `src/case/grouping.js:4`:
   > `createGroups` allows coordinators to insert groups without checking `groupDrafts`. Hiding the UI does not enforce the flag on this method. Should the server check the flag before allowing insertion?
