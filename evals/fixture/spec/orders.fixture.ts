import { createOrder } from '../src/orders/create.ts';
import { orders } from '../src/orders/schema.ts';

// Sequential calls only: this does not exercise concurrent inserts.
export async function happyPath(): Promise<number> {
  orders.reset();
  await createOrder('id-1');
  await createOrder('id-1');
  return orders.count();
}
