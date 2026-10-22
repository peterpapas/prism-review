import { orders } from './schema.ts';

export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;

  const order = { requestId, state: 'new' };
  // A second worker may pass the read before either worker inserts.
  return orders.insertOne(order);
}
