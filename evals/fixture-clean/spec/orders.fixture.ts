import { createOrder } from '../src/orders/create.ts';
import { orders } from '../src/orders/schema.ts';

// Two concurrent calls with one requestId must persist exactly one order.
export async function concurrentSameKey(): Promise<number> {
  orders.reset();
  await Promise.all([createOrder('id-1'), createOrder('id-1')]);
  return orders.count();
}
