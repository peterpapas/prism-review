| Draft | Status | Why |
|---|---|---|
| 1. src/billing/charge.ts:12 | Cannot verify | src/billing/charge.ts does not exist in this repository or in HEAD~1...HEAD. The change touches src/orders/create.ts and src/api/routes.ts only. Need: the billing module or the caller that invokes charge(). |

Open questions: where is charge() called relative to createOrder?
