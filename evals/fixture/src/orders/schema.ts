export const orderSchema = {
  requestId: { type: 'string', index: true },
};

export const orders: {
  findOne(query: { requestId: string }): Promise<unknown>;
  insertOne(order: { requestId: string; state: string }): Promise<unknown>;
} = {} as never;
