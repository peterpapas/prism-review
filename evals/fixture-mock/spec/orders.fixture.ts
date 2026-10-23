import { createOrder } from '../src/orders/create.ts';
import { orders } from '../src/orders/schema.ts';

export async function happyPath() {
  const realInsert = orders.insertOne;
  orders.insertOne = async (order) => order; // stub: persistence is bypassed
  try {
    return await createOrder('id-1'); // one sequential call only
  } finally {
    orders.insertOne = realInsert;
  }
}
