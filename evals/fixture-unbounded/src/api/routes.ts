import { orders } from '../orders/schema.ts';

export const listOrders = async (req: any) => {
  const limit = Number(req.query.limit ?? 1000);
  return orders.findMany({ limit });
};
