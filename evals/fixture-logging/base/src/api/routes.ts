import { createOrder } from '../orders/create.ts';
export const postOrder = async (req: any) => createOrder(req.body.requestId);
