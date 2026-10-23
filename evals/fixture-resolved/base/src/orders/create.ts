import { orders } from './schema.ts';

export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;

  const order = { requestId };
  // Both callers can pass the read before either insert.
  return orders.insertOne(order);
}
