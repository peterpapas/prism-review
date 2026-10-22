import { DuplicateKeyError, orders } from './schema.ts';

export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;

  const order = { requestId, state: 'new' };
  try {
    return await orders.insertOne(order);
  } catch (error) {
    // The unique index on requestId makes a concurrent insert fail here;
    // return the order the other worker persisted.
    if (error instanceof DuplicateKeyError) return orders.findOne({ requestId });
    throw error;
  }
}
