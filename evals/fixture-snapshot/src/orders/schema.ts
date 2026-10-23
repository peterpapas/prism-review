export const orderSchema = { requestId: { type: 'string', index: true, unique: true } };
export class DuplicateKeyError extends Error {}
const rows: { requestId: string }[] = [];
export const orders = {
  async findOne(query: { requestId: string }) { return rows.find((row) => row.requestId === query.requestId) ?? null; },
  async insertOne(order: { requestId: string }) {
    if (rows.some((row) => row.requestId === order.requestId)) throw new DuplicateKeyError('duplicate key');
    rows.push(order);
    return order;
  },
};
