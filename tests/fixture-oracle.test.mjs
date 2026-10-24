// Executable oracle for the fixtures: the "race" fixture really does duplicate under concurrency,
// and the "clean" fixture really does not. Without this, those labels are authored claims.
// Node strips the fixture's TypeScript types on import (Node >= 22.18 / 23.6 without flags).
import test from 'node:test';
import assert from 'node:assert/strict';

const race = await import('../evals/fixture/src/orders/create.ts');
const raceDb = await import('../evals/fixture/src/orders/schema.ts');
const clean = await import('../evals/fixture-clean/src/orders/create.ts');
const cleanDb = await import('../evals/fixture-clean/src/orders/schema.ts');
const { happyPath } = await import('../evals/fixture/spec/orders.fixture.ts');
const { concurrentSameKey } = await import('../evals/fixture-clean/spec/orders.fixture.ts');

test('race fixture: two concurrent createOrder calls with one requestId persist two orders', async () => {
  raceDb.orders.reset();
  await Promise.all([race.createOrder('id-1'), race.createOrder('id-1')]);
  assert.equal(await raceDb.orders.count(), 2, 'the defect the drafts are about');
});

test('race fixture: its own sequential test cannot see the defect', async () => {
  assert.equal(await happyPath(), 1, 'sequential calls look idempotent, which is why the test is not evidence');
});

test('clean fixture: two concurrent createOrder calls persist exactly one order', async () => {
  assert.equal(await concurrentSameKey(), 1);
});

test('clean fixture: the duplicate-key path returns the persisted order', async () => {
  cleanDb.orders.reset();
  const [a, b] = await Promise.all([clean.createOrder('id-2'), clean.createOrder('id-2')]);
  assert.deepEqual(a, b);
  assert.equal(await cleanDb.orders.count(), 1);
});

test('route guard rejects a non-UUID before createOrder runs (the guard-invalid probe)', async () => {
  const { postOrder } = await import('../evals/fixture/src/api/routes.ts');
  raceDb.orders.reset();
  await assert.rejects(() => postOrder('not-a-uuid'), /Invalid UUID/);
  assert.equal(await raceDb.orders.count(), 0);
});

test('resolved-later fixture: the final unique constraint and duplicate-key path return one order', async () => {
  const { createOrder } = await import('../evals/fixture-resolved/src/orders/create.ts');
  const { orders, orderSchema } = await import('../evals/fixture-resolved/src/orders/schema.ts');
  orders.reset();
  const [first, second] = await Promise.all([createOrder('id-resolved'), createOrder('id-resolved')]);
  assert.equal(orderSchema.requestId.unique, true);
  assert.deepEqual(first, second);
  assert.equal(orders.count(), 1);
});

test('auth-missing fixture: the new write route succeeds without a user', async () => {
  const { getOrder, postOrder } = await import('../evals/fixture-auth/src/api/routes.ts');
  assert.throws(() => getOrder({}), /Unauthorized/);
  assert.deepEqual(await postOrder({ body: { requestId: 'id-1' } }), { requestId: 'id-1' });
});

test('auth-covered control: the new write route requires a user', async () => {
  const { postOrder } = await import('../evals/fixture-auth-clean/src/api/routes.ts');
  assert.throws(() => postOrder({ body: { requestId: 'id-1' } }), /Unauthorized/);
  assert.deepEqual(await postOrder({ user: { id: 'u-1' }, body: { requestId: 'id-1' } }), { requestId: 'id-1' });
});

test('mock-blind fixture: the happy-path test stubs persistence and invokes one call', async () => {
  const { happyPath: mockedHappyPath } = await import('../evals/fixture-mock/spec/orders.fixture.ts');
  assert.deepEqual(await mockedHappyPath(), { requestId: 'id-1' });
});

test('unbounded-limit fixture: a caller-supplied million reaches the collection unchanged', async () => {
  const { listOrders } = await import('../evals/fixture-unbounded/src/api/routes.ts');
  assert.equal(await listOrders({ query: { limit: '1000000' } }), 1_000_000);
});

test('swallowed-error fixture: a database failure becomes null', async () => {
  const { createOrder } = await import('../evals/fixture-swallowed/src/orders/create.ts');
  assert.equal(await createOrder('id-1'), null);
});

test('logging-pii fixture: the route logs the entire body, including a token', async () => {
  const { postOrder } = await import('../evals/fixture-logging/src/api/routes.ts');
  const originalLog = console.log;
  const calls = [];
  console.log = (...args) => calls.push(args);
  try {
    const body = { requestId: 'id-1', email: 'person@example.test', apiToken: 'fake-token' };
    await postOrder({ body });
    assert.deepEqual(calls, [['order request', body]]);
  } finally {
    console.log = originalLog;
  }
});

test('style-as-defect fixture: renaming the local preserves behavior', async () => {
  const base = await import('../evals/fixture-style/base/src/orders/create.ts');
  const head = await import('../evals/fixture-style/src/orders/create.ts');
  assert.deepEqual(head.createOrder('  id-1  '), base.createOrder('  id-1  '));
});

test('field parsing fixture: the draft accepts partial tokens and the final revision rejects them', async () => {
  const draft = await import('../evals/fixture-field-parse/drafted/src/api/dimensions.ts');
  const head = await import('../evals/fixture-field-parse/src/api/dimensions.ts');
  assert.equal(draft.parseDimension('1200px'), 1200);
  assert.equal(draft.parseDimension('1e3'), 1);
  assert.equal(head.parseDimension('1200px'), null);
  assert.equal(head.parseDimension('1e3'), null);
  assert.equal(head.parseDimension('1200'), 1200);
});

test('field loading fixture: a rejected request still clears the loading flag', async () => {
  const { lookup } = await import('../evals/fixture-field-loading/src/search/lookup.ts');
  const state = { loading: false, results: ['stale'], error: null };
  await lookup(() => Promise.reject(new Error('offline')), state);
  assert.deepEqual(state, { loading: false, results: [], error: 'offline' });
});

test('field observer fixture: both feature and fallback branches release subscriptions', async () => {
  const { mountSection } = await import('../evals/fixture-field-observer/src/ui/sectionView.ts');
  const target = {};
  const calls = [];
  const scroll = { add: (handler) => calls.push(['add', handler]), remove: (handler) => calls.push(['remove', handler]) };
  const stopObserver = mountSection(target, () => ({
    observe: (value) => calls.push(['observe', value]),
    disconnect: () => calls.push(['disconnect']),
  }), scroll);
  stopObserver();
  assert.deepEqual(calls.map(([name]) => name), ['observe', 'disconnect']);
  const stopFallback = mountSection(target, null, scroll);
  stopFallback();
  assert.deepEqual(calls.slice(2).map(([name]) => name), ['add', 'remove']);
  assert.equal(calls[2][1], calls[3][1], 'the same listener is removed');
});

test('field restore fixture: writes are ordered and stop at the first conflict', async () => {
  const { restore, MarkerConflict } = await import('../evals/fixture-field-restore/src/markers/restore.ts');
  const visited = [];
  const markers = [
    { id: 'c', expected: 'new', before: 'old' },
    { id: 'b', expected: 'new', before: 'old' },
    { id: 'a', expected: 'new', before: 'old' },
  ];
  await assert.rejects(() => restore(markers, {
    updateIfUnchanged: async (marker) => {
      visited.push(marker.id);
      return { count: marker.id === 'b' ? 0 : 1 };
    },
  }), MarkerConflict);
  assert.deepEqual(visited, ['a', 'b'], 'c is not scheduled after b conflicts');
});

test('field restore fixture: the route runs restoration inside one rollback boundary', async () => {
  const { handleRestore } = await import('../evals/fixture-field-restore/src/markers/route.ts');
  const rows = new Map([['a', 'new'], ['b', 'other']]);
  const markers = [
    { id: 'a', expected: 'new', before: 'old' },
    { id: 'b', expected: 'new', before: 'old' },
  ];
  await assert.rejects(() => handleRestore(markers, {
    transaction: async (work) => {
      const before = new Map(rows);
      try {
        return await work({ updateIfUnchanged: async (marker) => {
          if (rows.get(marker.id) !== marker.expected) return { count: 0 };
          rows.set(marker.id, marker.before);
          return { count: 1 };
        } });
      } catch (error) {
        rows.clear();
        for (const [id, value] of before) rows.set(id, value);
        throw error;
      }
    },
  }), /marker changed/);
  assert.deepEqual([...rows], [['a', 'new'], ['b', 'other']]);
});
