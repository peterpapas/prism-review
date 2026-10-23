import { orders } from './schema.ts';
export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;
  return orders.insertOne({ requestId });
}
