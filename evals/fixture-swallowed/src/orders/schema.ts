export const orders = {
  async insertOne(_order: { requestId: string; state: string }) { throw new Error('database unavailable'); },
};
