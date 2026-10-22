# PR: idempotent order creation

Adds `createOrder` (src/orders/create.ts) and wires it to the API through
`postOrder` (src/api/routes.ts). The schema's requestId index is unique and
`createOrder` handles the duplicate-key path; the test exercises concurrency.
