import { DuplicateKeyError, orders } from './schema.ts';
export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;
  try {
    return await orders.insertOne({ requestId });
  } catch (error) {
    if (error instanceof DuplicateKeyError) return orders.findOne({ requestId });
    throw error;
  }
}
