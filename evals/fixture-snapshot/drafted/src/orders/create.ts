import { orders } from './schema.ts';
export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;
  const order = { requestId };
  // This head was reviewed before the next push.
  return orders.insertOne(order);
}
