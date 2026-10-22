import { createOrder } from '../orders/create.ts';

const orderInput = { requestId: 'uuid' };
const validateBody = (_schema: unknown) => async (requestId: string) => {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(requestId)) throw new Error('Invalid UUID');
  return createOrder(requestId);
};
export const postOrder = validateBody(orderInput);
