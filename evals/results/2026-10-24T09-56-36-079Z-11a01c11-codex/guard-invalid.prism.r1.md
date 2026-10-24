# guard-invalid.prism.r1

prompt:

The pull request is the commit range HEAD~1...HEAD in this repository. PR.md describes it. Only read; do not edit files, run tests, or post anything.

Gate these drafted review comments before I post them. For each one, say whether it stands, needs rewording, is resolved, is invalid, or cannot be verified, with the evidence.

Drafts:
1. src/orders/create.ts:5 — `requestId` is never validated as a UUID; add validation here.

---

Draft 1 — **Invalid. Evidence: Disproved.** The claim that `requestId` is “never validated” is defeated by `src/api/routes.ts:5`: `postOrder` rejects malformed UUID strings before calling `createOrder` on line 6. The guard exists in the examined head.

`createOrder` itself accepts arbitrary strings, but the schema requires only a string, and the existing fixture deliberately calls it with `'id-1'`. No supplied requirement establishes that this internal function must enforce UUIDs. Adding validation here is therefore unsupported by the examined contract.

Snapshot: local repository `<LOCAL_HOME>\AppData\Local\Temp\prism-eval-lf66Lz`, `HEAD~1...HEAD`, obtained with `git diff`.

- Base: `68c5db13561ed33066d4d81536df99e38e98ff4f`
- Head: `c3b034635ec7681c752591c495d0205f04416048`
- Both SHAs were rechecked and remained unchanged.

Coverage: reviewed the complete supplied draft, `PR.md`, both added source files, the schema, the fixture, and all repository references to `createOrder`. External consumers and GitHub threads were not examined. The referenced `references/example.md` is absent.

**No supported findings in the material examined.** This was a gate of the validation draft, not a broader defect review. Open question: whether an external contract requires UUID validation for direct callers.

Proposed but not run: call `postOrder('id-1')` and assert rejection with no inserted order. No tests were run, files edited, or comments posted.

**Suggested comments for the user to consider**

1. None; omit draft 1.
