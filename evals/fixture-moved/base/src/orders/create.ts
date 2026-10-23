import { orders } from './schema.ts';

export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;

  const order = { requestId };
  // The insert is not atomic with the read.
  return orders.insertOne(order);
}
