import { createOrder } from '../src/orders/create';

// Illustrative fixture: sequential calls do not exercise concurrent inserts.
export async function happyPath() {
  await createOrder('id-1');
  await createOrder('id-1');
}
