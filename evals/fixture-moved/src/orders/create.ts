// Order creation is shared by the API and retry worker.
// Keep the requestId stable across retries.
// The collection index is declared in schema.ts.
// Callers expect the same order for repeated requests.
// These comments shifted the original review anchor.
import { orders } from './schema.ts';

export async function createOrder(requestId: string) {
  const existing = await orders.findOne({ requestId });
  if (existing) return existing;

  const order = { requestId };
  // The insert is not atomic with the read.
  return orders.insertOne(order);
}
