import { requireAuth } from './middleware.ts';
import { createOrder } from '../orders/create.ts';

export const getOrder = requireAuth(async (_req: any) => ({ ok: true }));

// New write route is not mounted under an authenticated router.
export const postOrder = async (req: any) =>
  createOrder(req.body.requestId);
