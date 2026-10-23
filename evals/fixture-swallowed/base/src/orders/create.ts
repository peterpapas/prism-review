import { orders } from './schema.ts';
export async function createOrder(requestId: string) {
  return orders.insertOne({ requestId, state: 'new' });
}
