import { requireAuth } from './middleware.ts';
import { createOrder } from '../orders/create.ts';

export const getOrder = requireAuth(async (_req: any) => ({ ok: true }));

export const postOrder = requireAuth(async (req: any) =>
  createOrder(req.body.requestId));
