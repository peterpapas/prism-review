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
