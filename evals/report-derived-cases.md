# Report-derived review probes

These 20 cases reconstruct an anonymized research report supplied by a user.
The original private PRs, comments, and commit history were not available for
independent inspection here. The synthetic fixtures are authored hypotheses
based on that report. No private code, comment text, repository name, or link
was copied into this public suite. CASE labels map to the supplied report.

| Source case | Probe | Expected behavior |
|---|---|---|
| CASE-01 | `report-01-conditional-clear` | Keep a real check-then-unconditional-write race. |
| CASE-02 | `report-02-dst-partial-fix` | Reword a half-true daylight-saving fix claim. |
| CASE-03 | `report-03-server-flag` | Keep the server flag gap and drop the dry-run sub-claim. |
| CASE-04 | `report-04-third-caller` | Find an unchanged third caller and its misleading test. |
| CASE-05 | `report-05-matched-count` | Mark the missing-result concern resolved and reject a modified-count fix. |
| CASE-06 | `report-06-same-destination` | Mark a copy-then-delete alias bug resolved by a same-ID guard. |
| CASE-07 | `report-07-resource-auth` | Mark missing resource authorization resolved by the edit assertion. |
| CASE-08 | `report-08-operator-token` | Recognize the old operator-injection risk and the final type guard. |
| CASE-09 | `report-09-projection-guard` | Mark a guard's missing projected field resolved. |
| CASE-10 | `report-10-shared-writer` | Mark an old timestamp regression resolved after tracing another caller. |
| CASE-11 | `report-11-preload-navigation` | Reword a route-only preload suggestion that fails on client navigation. |
| CASE-12 | `report-12-status-202` | Reword a broad success rule that would swallow other 4xx failures. |
| CASE-13 | `report-13-required-field` | Recognize a schema crash and the final valid fallback. |
| CASE-14 | `report-14-test-ordering` | Find the real ordering gap instead of asking for existing tests. |
| CASE-15 | `report-15-global-rejection` | Drop a warning that overlooks startup error handling. |
| CASE-16 | `report-16-wrapper-props` | Drop a missing-prop claim after tracing the route wrapper. |
| CASE-17 | `report-17-logged-args` | Distinguish the logging allowlist from the method argument list. |
| CASE-18 | `report-18-route-shape` | Reject a `.path` fix that would turn a string into undefined. |
| CASE-19 | `report-19-framework-version` | Reject advice based on the wrong version and a banned API. |
| CASE-20 | `report-20-stale-index-thread` | Drop a repeated index finding based on a stale PR description. |

Cases 01, 02, 03, 04, 11, 12, 14–19 pin a single review-state fixture.
Cases 05–10, 13, and 20 include an earlier and final revision. The generator
in `materialize-report-cases.mjs` writes conventional fixture folders and
good/bad answers from `report-cases.mjs`. The Tier-0 checks execute selected
fixture behavior and verify each grader rejects its bad answer. Those checks
do not validate the source report or measure an agent's performance. A later
Tier-1 run must save raw outputs and receive human adjudication.
