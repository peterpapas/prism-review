export const orderSchema = {
  requestId: { type: 'string', index: true },
};

export type Order = { requestId: string; state: string };

// In-memory stand-in for the collection so the fixture can be executed by tests/fixture-oracle.test.mjs.
// The requestId index is NOT unique: insertOne never rejects a duplicate.
const rows: Order[] = [];
export const orders = {
  async findOne(query: { requestId: string }): Promise<Order | null> {
    return rows.find((r) => r.requestId === query.requestId) ?? null;
  },
  async insertOne(order: Order): Promise<Order> {
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
