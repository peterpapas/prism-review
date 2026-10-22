# PR: idempotent order creation

Adds `createOrder` (src/orders/create.ts) and wires it to the API through
`postOrder` (src/api/routes.ts). Base commit holds the schema and the test;
head commit adds the two new files.
