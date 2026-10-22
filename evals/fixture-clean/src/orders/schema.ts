export const orderSchema = {
  requestId: { type: 'string', index: true, unique: true },
};

export type Order = { requestId: string; state: string };

export class DuplicateKeyError extends Error {
  code = 11000;
}

// In-memory stand-in for the collection so the fixture can be executed by tests/fixture-oracle.test.mjs.
// The requestId index IS unique: insertOne rejects a duplicate the way a database would.
const rows: Order[] = [];
export const orders = {
  async findOne(query: { requestId: string }): Promise<Order | null> {
    return rows.find((r) => r.requestId === query.requestId) ?? null;
  },
  async insertOne(order: Order): Promise<Order> {
    if (rows.some((r) => r.requestId === order.requestId)) throw new DuplicateKeyError(`duplicate key: ${order.requestId}`);
    rows.push(order);
    return order;
  },
  async count(): Promise<number> {
    return rows.length;
  },
  reset(): void {
    rows.length = 0;
  },
};
