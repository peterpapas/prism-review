# Discovery lenses

Use these selectively in Review. Falsification and evidence classification are mandatory verification steps in `SKILL.md`, not discovery lenses. A lens never increases severity or evidence strength.

| Lens | Probe | Countercheck |
|---|---|---|
| Invariants | Which ownership, uniqueness, ordering, or state rule must hold? | Test the exact boundary and whether a constraint applies to this operation. |
| Inversion | What concrete input or sequence fails: timeout, retry, stale state, partial input? | Trace the recovery path for that sequence, including failure of recovery. |
| Contracts | Which caller, consumer, schema, or user promise changes? | Trace visible consumers; label inaccessible external consumers unknown. |
| Second-order | What changes elsewhere, later, or under load? | Check bounds, fallback behaviour, and deployment assumptions. |
| Chesterton's Fence | Why did removed or bypassed code exist? | Use history as a clue, then verify the original risk is actually gone. History alone cannot prove redundancy. |
| Steelman | What safer or simpler alternative avoids a concrete harm? | Report only if the current design creates an evidenced defect; otherwise treat it as a design preference. |

Select by change type, without a fixed count: contracts and invariants for API or schema; inversion for state and retry logic; history for removed guards; second-order for jobs and scale. Check security trust boundaries when credentials or user input change, reversibility for destructive migrations, and observability for background failure paths. Docs-only changes need claim and link checks, not forced code lenses.
