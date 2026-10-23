import { createOrder } from '../orders/create.ts';
export const postOrder = async (req: any) => {
  console.log('order request', req.body); // includes apiToken and email
  return createOrder(req.body.requestId);
};
