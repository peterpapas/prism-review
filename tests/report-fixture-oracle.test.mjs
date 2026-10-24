// Executable checks for the most consequential report-derived fixture claims.
// These prove synthetic fixture behavior, not the inaccessible source PRs.
import test from 'node:test';
import assert from 'node:assert/strict';

test('01: an id-only cleanup erases a connection created during the intervening read', async () => {
  const { revokeAndClear } = await import('../evals/fixture-report-01-conditional-clear/src/case/connection.js');
  const row = { id: 'u1' };
  await revokeAndClear('u1', {
    get: async () => ({ ...row }),
    otherRead: async () => { row.connection = { id: 'new', grant: 'new-grant' }; },
    update: async (selector) => {
      if (selector.id === row.id && (!selector['connection.id'] || selector['connection.id'] === row.connection?.id)) delete row.connection;
    },
  });
  assert.equal(row.connection, undefined);
});

test('02: the second fall-back hour can yield a next row before now', async () => {
  const { nextRow } = await import('../evals/fixture-report-02-dst-partial-fix/src/case/schedule.js');
  const now = new Date('2024-11-03T06:10:00Z');
  assert.equal(nextRow(now, 30).toISOString(), '2024-11-03T05:30:00.000Z');
  assert.ok(nextRow(now, 30) < now);
});

test('03: a client flag does not gate a server write, while isTest stays read-only', async () => {
  const { createGroups } = await import('../evals/fixture-report-03-server-flag/src/case/grouping.js');
  const { canShowGrouping } = await import('../evals/fixture-report-03-server-flag/src/case/client.js');
  let writes = 0;
  const store = { insert: async () => { writes += 1; return { ok: true }; } };
  assert.equal(canShowGrouping({ groupDrafts: false }), false);
  await createGroups({ coordinator: true }, { groups: ['g'] }, store);
  assert.equal(writes, 1);
  await createGroups({ coordinator: true }, { isTest: true, groups: ['g'] }, store);
  assert.equal(writes, 1);
});

test('04: only the untouched third caller emits a false type-change message', async () => {
  const { editName, removeMember, addMember } = await import('../evals/fixture-report-04-third-caller/src/case/callers.js');
  const events = [];
  const legacy = { type: undefined };
  editName(legacy, events);
  removeMember(legacy, events);
  assert.deepEqual(events, []);
  addMember(legacy, events);
  assert.deepEqual(events, ['group type changed to standard']);
});

test('05: zero matches means missing, while an unchanged match still succeeds', async () => {
  const prior = await import('../evals/fixture-report-05-matched-count/base/src/case/sync.js');
  const head = await import('../evals/fixture-report-05-matched-count/src/case/sync.js');
  const { createStore } = await import('../evals/fixture-report-05-matched-count/src/case/store.js');
  const rows = new Map([['a', { externalId: 'same' }]]);
  const store = createStore(rows);
  assert.deepEqual(await prior.syncExternalId('missing', 'x', store), { ok: true });
  await assert.rejects(() => head.syncExternalId('missing', 'x', store), /not found/);
  assert.deepEqual(await head.syncExternalId('a', 'same', store), { ok: true });
});

test('06: same-ID alias move deletes associations only in the earlier revision', async () => {
  const prior = await import('../evals/fixture-report-06-same-destination/base/src/case/move.js');
  const head = await import('../evals/fixture-report-06-same-destination/src/case/move.js');
  const crm = () => {
    const state = { associations: ['owner'], role: true };
    return { state, api: {
      find: async () => 'contact-1', upsert: async () => 'contact-1', copyAssociations: async () => {},
      deleteAssociations: async () => { state.associations = []; },
      clearRole: async () => { state.role = false; },
    } };
  };
  const old = crm();
  await prior.moveContact('old@example.test', 'alias@example.test', old.api);
  assert.deepEqual(old.state, { associations: [], role: false });
  const fixed = crm();
  await head.moveContact('old@example.test', 'alias@example.test', fixed.api);
  assert.deepEqual(fixed.state, { associations: ['owner'], role: true });
});

test('07: the later resource check stops an outsider before calendar write', async () => {
  const prior = await import('../evals/fixture-report-07-resource-auth/base/src/case/calendar.js');
  const head = await import('../evals/fixture-report-07-resource-auth/src/case/calendar.js');
  let pushes = 0;
  const db = { getMeeting: async () => ({ ownerId: 'owner', ownerCalendar: 'cal' }),
    assertCanEdit: async (user, meeting) => { if (user.id !== meeting.ownerId) throw new Error('forbidden'); } };
  const calendar = { push: async () => { pushes += 1; } };
  await prior.syncMeeting({ id: 'outsider' }, 'meeting-1', db, calendar);
  assert.equal(pushes, 1);
  await assert.rejects(() => head.syncMeeting({ id: 'outsider' }, 'meeting-1', db, calendar), /forbidden/);
  assert.equal(pushes, 1);
});

test('08: an object token reaches the old raw selector but fails the new string guard', async () => {
  const prior = await import('../evals/fixture-report-08-operator-token/base/src/case/login.js');
  const head = await import('../evals/fixture-report-08-operator-token/src/case/login.js');
  let calls = 0;
  const collection = { findOneAndDelete: async ({ token }) => {
    calls += 1;
    return token?.$ne === null ? { userId: 'other-user' } : null;
  } };
  assert.equal(await prior.redeemToken({ $ne: null }, collection), 'other-user');
  assert.equal(await head.redeemToken({ $ne: null }, collection), null);
  assert.equal(calls, 1);
});

test('09: projection omission makes the old invite-only guard ineffective', async () => {
  const prior = await import('../evals/fixture-report-09-projection-guard/base/src/case/invite.js');
  const head = await import('../evals/fixture-report-09-projection-guard/src/case/invite.js');
  const db = { findOne: async (_id, projection) => Object.fromEntries(
    Object.entries({ name: 'demo', accessType: 'invite-only' }).filter(([key]) => projection[key])
  ) };
  assert.equal(await prior.canInvite('p1', db), true);
  assert.equal(await head.canInvite('p1', db), false);
});

test('10: reverting the shared timestamp keeps old edits at current activity time', async () => {
  const prior = await import('../evals/fixture-report-10-shared-writer/base/src/case/edit.js');
  const head = await import('../evals/fixture-report-10-shared-writer/src/case/edit.js');
  const message = { id: 'm1', createdAt: 100 };
  const oldGroup = {}, fixedGroup = {};
  prior.editMessage(oldGroup, message, 500);
  head.editMessage(fixedGroup, message, 500);
  assert.equal(oldGroup.lastActivity.timestamp, 100);
  assert.equal(fixedGroup.lastActivity.timestamp, 500);
});

test('12: a blanket 202 policy would accept authentication and rate-limit failures', async () => {
  const { removeLink } = await import('../evals/fixture-report-12-status-202/src/case/remove.js');
  const logger = { error() {} };
  for (const status of [404, 401, 403, 429]) {
    assert.deepEqual(await removeLink('x', { delete: async () => ({ status }) }, logger), { status: 202, originalStatus: status });
  }
});

test('13: the old unset violates the required-field contract; the fallback passes', async () => {
  const prior = await import('../evals/fixture-report-13-required-field/base/src/case/refresh.js');
  const head = await import('../evals/fixture-report-13-required-field/src/case/refresh.js');
  const { createGroups } = await import('../evals/fixture-report-13-required-field/src/case/store.js');
  await assert.rejects(() => prior.refreshActivity('g1', null, createGroups()), /required/);
  assert.deepEqual(await head.refreshActivity('g1', null, createGroups()), { kind: 'created' });
});

test('16: the lazy route wrapper supplies projectId', async () => {
  const { route } = await import('../evals/fixture-report-16-wrapper-props/src/case/routes.js');
  assert.equal(await route.Page({ projectId: 'p1' }), 'loaded p1');
});

test('17: email remains an argument but is omitted from the log allowlist', async () => {
  const { invite } = await import('../evals/fixture-report-17-logged-args/src/case/invite.js');
  const original = console.info;
  const calls = [];
  console.info = (...args) => calls.push(args);
  try {
    assert.equal(invite('person@example.test', 'p1'), true);
    assert.deepEqual(calls, [['invite', { projectId: 'p1' }]]);
  } finally { console.info = original; }
});

test('18: the route constant is a string and the test fallback is weak', async () => {
  const { reportUrl, ROUTE_PATHS } = await import('../evals/fixture-report-18-route-shape/src/case/paths.js');
  const { weakTest } = await import('../evals/fixture-report-18-route-shape/spec/path.fixture.js');
  assert.equal(reportUrl('7'), '/reports/7');
  assert.equal(ROUTE_PATHS.REPORTS.path, undefined);
  assert.equal(weakTest(), true);
  assert.equal('/reports/WRONG'.includes(ROUTE_PATHS.REPORTS.path ? ROUTE_PATHS.REPORTS.path : '/reports'), true);
});
