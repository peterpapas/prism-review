import { requireAuth } from './middleware.ts';

export const getOrder = requireAuth(async (_req: any) => ({ ok: true }));
