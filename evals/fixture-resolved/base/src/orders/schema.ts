export const orderSchema = {
  requestId: { type: 'string', index: true },
};

export const orders = {
  async findOne(_query: { requestId: string }) { return null; },
  async insertOne(order: { requestId: string }) { return order; },
};
