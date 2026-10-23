import { orders } from './schema.ts';
export async function createOrder(requestId: string) {
  try {
    return await orders.insertOne({ requestId, state: 'new' });
  } catch {
    return null;
  }
}
