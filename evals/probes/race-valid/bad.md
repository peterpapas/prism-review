Draft 1 is invalid. `createOrder` checks findOne first (src/orders/create.ts:4), so a duplicate cannot be inserted. Drop the comment.
