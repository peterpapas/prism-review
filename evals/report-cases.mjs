// Synthetic reconstructions from user-supplied, anonymized research notes.
// The source PRs were not available here. These are authored fixture hypotheses,
// not independently verified ground truth or measured agent outcomes.
const context = '// Small synthetic PR fixture. All names and values are invented.\n';

export const reportCases = [
  {
    id: 'report-01-conditional-clear', verdict: 'stands', mode: 'Gate',
    draft: 'src/case/connection.js:7 — the empty-connection branch clears by id only; a reconnect between read and write is wiped. Condition the absent state or skip the write.',
    expect: 'Stands: the missing selector condition can erase a new connection.',
    required: ['reconnect', 'unconditional|id.only|missing.condition', 'skip|\\$exists|conditional'],
    head: { 'src/case/connection.js': String.raw`export async function revokeAndClear(id, db) {
  const current = await db.get(id);
  if (current.connection) await db.revoke(current.connection.grant);
  await db.otherRead();
  const selector = current.connection
    ? { id, 'connection.id': current.connection.id }
    : { id };
  await db.update(selector, { $unset: { connection: 1 } });
}` },
    pr: 'A queued cleanup job now runs for profiles with and without a saved connection. A second read can occur before the final write.',
    good: 'Draft 1 src/case/connection.js:7 — Stands. The absent-connection branch uses an id-only selector at src/case/connection.js:7; the intervening read at src/case/connection.js:4 leaves a reconnect window. Skip the write when absent or condition it on connection $exists false.',
    bad: 'Draft 1 src/case/connection.js:7 — Invalid. The earlier read makes reconnect impossible.',
  },
  {
    id: 'report-02-dst-partial-fix', verdict: 'reword', mode: 'Gate',
    draft: 'src/case/schedule.js:13 — Resolved: setting wall-clock fields fixes both daylight-saving transitions.',
    expect: 'Reword: spring-forward is fixed, but the repeated fall-back hour can still produce a past instant.',
    required: ['fall.back|repeated.hour', 'past|before.now|earlier.than.now', 'spring.forward|one.transition'],
    head: { 'src/case/schedule.js': String.raw`// Toy zone: repeated 01:xx resolves to the first occurrence.
export function wallToInstant(day, hour, minute) {
  const first = Date.UTC(2024, 10, 3, hour + 4, minute);
  if (day === 'fall' && hour === 1) return first;
  return Date.UTC(2024, 10, 3, hour + 5, minute);
}
export function nextRow(now, stepMinutes) {
  const localHour = now.getUTCHours() === 6 ? 1 : now.getUTCHours() - 4;
  const localMinute = now.getUTCMinutes();
  const floor = Math.floor(localMinute / stepMinutes) * stepMinutes;
  let candidate = wallToInstant('fall', localHour, floor);
  if (candidate < now.getTime()) candidate = wallToInstant('fall', localHour, floor + stepMinutes);
  return new Date(candidate);
}` },
    pr: 'A wall-clock conversion replaced elapsed-minute arithmetic. The existing fall-back test begins after the repeated hour.',
    good: 'Draft 1 src/case/schedule.js:13 — Reword. Spring-forward arithmetic is corrected, but the repeated fall-back hour still resolves 01:30 to its first occurrence; src/case/schedule.js:12-13 can return an instant before now. Add a repeated-hour test and advance until the candidate is at or after now.',
    bad: 'Draft 1 src/case/schedule.js:13 — Resolved. Both transitions now return future rows.',
  },
  {
    id: 'report-03-server-flag', verdict: 'reword', mode: 'Gate',
    draft: 'src/case/grouping.js:3 — coordinators can invoke the new grouping method when the flag is off and can pass isTest to bypass safety.',
    expect: 'Reword: keep the missing server flag check; drop the unrelated isTest claim.',
    required: ['server.side|method|backend', 'flag', 'isTest', 'dry.run|no.write|not.a.defect|drop'],
    forbiddenSuggested: ['isTest.{0,35}(?:bypass|defect|unsafe)'],
    head: {
      'src/case/grouping.js': String.raw`export async function createGroups(user, input, store) {
  if (!user || (!user.admin && !user.coordinator)) throw new Error('forbidden');
  if (input.isTest) return { preview: true, groups: [] };
  return store.insert({ groups: input.groups });
}`,
      'src/case/client.js': String.raw`export function canShowGrouping(flags) {
  return Boolean(flags.groupDrafts);
}`,
      'src/case/flags.js': String.raw`export function isEnabledOnServer(flags, name) {
  return Boolean(flags[name]);
}`,
    },
    pr: 'The new grouping UI is hidden by a client flag. The server method was widened to coordinators.',
    good: 'Draft 1 src/case/grouping.js:3 — Reword. The client flag at src/case/client.js:2 does not protect the server method at src/case/grouping.js:3; use the server helper in src/case/flags.js:1 and test flag-off calls. Drop the isTest sub-claim: src/case/grouping.js:3 makes it a no-write dry run.',
    bad: 'Draft 1 src/case/grouping.js:3 — Stands, including the isTest bypass; the client flag is sufficient.',
  },
  {
    id: 'report-04-third-caller', verdict: 'finding', mode: 'Review',
    expect: 'Supported finding: a third caller still passes an unnormalized legacy type and its test encodes the wrong message.',
    required: ['addMember|members', 'normaliz', 'test|expect'],
    head: {
      'src/case/activity.js': String.raw`export const normalizeType = (value) => value ?? 'standard';
export function recordChange(previous, next, events) {
  if (previous === next) return;
  events.push('group type changed to ' + next);
}`,
      'src/case/callers.js': String.raw`import { normalizeType, recordChange } from './activity.js';
export function editName(group, events) { recordChange(normalizeType(group.type), normalizeType(group.type), events); }
export function removeMember(group, events) { recordChange(normalizeType(group.type), normalizeType(group.type), events); }
export function addMember(group, events) { recordChange(group.type, normalizeType(group.type), events); }`,
      'spec/case.fixture.js': String.raw`import { addMember } from '../src/case/callers.js';
const events = [];
addMember({ type: undefined }, events);
if (events[0] !== 'group type changed to standard') throw new Error('unexpected message');`,
    },
    pr: 'Two activity callers were updated to normalize legacy type values. A third member-edit path remains.',
    good: '[P2] src/case/callers.js:4 — Supported. addMember still passes the raw legacy type, so recordChange sees undefined versus standard and emits a false type-change message. The expectation in spec/case.fixture.js:4 encodes the bug; normalize the previous value there too.',
    bad: 'No supported findings. All three callers normalize legacy types.',
  },
  {
    id: 'report-05-matched-count', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/sync.js:2 — throw 404 when modifiedCount is zero after the external sync.',
    expect: 'Resolved at head: the old ignored result was fixed using matched count; modified count would reject idempotent syncs.',
    required: ['matched', 'modified', 'no.op|same.value|idempotent'],
    head: {
      'src/case/sync.js': String.raw`export async function syncExternalId(id, externalId, store) {
  const count = await store.update(id, { externalId });
  if (count === 0) throw new Error('not found');
  return { ok: true };
}`,
      'src/case/store.js': String.raw`export function createStore(rows) {
  return { update(id, patch) {
    const row = rows.get(id);
    if (!row) return 0;
    Object.assign(row, patch);
    return 1; // number of matched documents, including no-op matches
  } };
}`,
    },
    prior: {
      'src/case/sync.js': String.raw`export async function syncExternalId(id, externalId, store) {
  await store.update(id, { externalId });
  return { ok: true };
}`,
      'src/case/store.js': String.raw`export function createStore(rows) {
  return { update(id, patch) {
    const row = rows.get(id);
    if (!row) return 0;
    Object.assign(row, patch);
    return 1; // number of matched documents, including no-op matches
  } };
}`,
    },
    pr: 'The earlier revision ignored the update result. The store returns matched-document count, including an unchanged match. A later push checks zero matches.',
    good: 'Draft 1 src/case/sync.js:2 — Resolved at head. The earlier code ignored a missing record, but the current check at src/case/sync.js:3 uses matched count from src/case/store.js:6: zero means deleted, while an idempotent no-op sync still succeeds. A modifiedCount check would reject an unchanged record.',
    bad: 'Draft 1 src/case/sync.js:2 — Stands. modifiedCount zero always means the record is missing.',
  },
  {
    id: 'report-06-same-destination', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/move.js:5 — if both emails resolve to the same contact, copy-then-delete removes its own associations.',
    expect: 'Resolved: a later push returns before deletion when source and destination IDs match.',
    required: ['same|equal|alias', 'early.return|returns.before|skip', 'before|earlier|draft'],
    head: { 'src/case/move.js': String.raw`export async function moveContact(oldEmail, newEmail, crm) {
  const sourceId = await crm.find(oldEmail);
  const targetId = await crm.upsert(newEmail);
  if (sourceId === targetId) return targetId;
  await crm.copyAssociations(sourceId, targetId);
  await crm.deleteAssociations(sourceId);
  await crm.clearRole(sourceId);
  return targetId;
}` },
    prior: { 'src/case/move.js': String.raw`export async function moveContact(oldEmail, newEmail, crm) {
  const sourceId = await crm.find(oldEmail);
  const targetId = await crm.upsert(newEmail);
  await crm.copyAssociations(sourceId, targetId);
  await crm.deleteAssociations(sourceId);
  await crm.clearRole(sourceId);
  return targetId;
}` },
    pr: 'A draft warned about email aliases resolving to the same CRM contact. A later push added a same-ID guard.',
    good: 'Draft 1 src/case/move.js:5 — Resolved. Before the later push, an alias could make source and destination the same, then delete the only associations. At head src/case/move.js:4 returns early before the delete; the branch now skips it.',
    bad: 'Draft 1 src/case/move.js:5 — Stands. The merged code still deletes on same-ID moves.',
  },
  {
    id: 'report-07-resource-auth', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/calendar.js:4 — any signed-in user can sync a meeting ID onto its owner calendar; require resource-level edit access.',
    expect: 'Resolved: a later push checks edit access before the external write.',
    required: ['resource|meeting|record', 'assertCanEdit|edit.access|authoriz', 'before|earlier|draft'],
    head: {
      'src/case/calendar.js': String.raw`export async function syncMeeting(user, meetingId, db, calendar) {
  if (!user) throw new Error('login required');
  const meeting = await db.getMeeting(meetingId);
  await db.assertCanEdit(user, meeting);
  await calendar.push(meeting.ownerCalendar, meeting);
}`,
    },
    prior: { 'src/case/calendar.js': String.raw`export async function syncMeeting(user, meetingId, db, calendar) {
  if (!user) throw new Error('login required');
  const meeting = await db.getMeeting(meetingId);
  await calendar.push(meeting.ownerCalendar, meeting);
}` },
    pr: 'The method originally checked login only. The final revision invokes the existing resource edit assertion before calendar sync.',
    good: 'Draft 1 src/case/calendar.js:4 — Resolved. At the earlier revision login alone let a caller submit another meeting ID. At head src/case/calendar.js:4 invokes assertCanEdit for that resource before the external calendar write at src/case/calendar.js:5.',
    bad: 'Draft 1 src/case/calendar.js:4 — Stands. There is still no resource authorization.',
  },
  {
    id: 'report-08-operator-token', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/login.js:3 — should the client token be validated before the raw lookup?',
    expect: 'Resolved at merge, but recognize the original Mongo operator injection as a security issue.',
    required: ['operator|\\$ne|inject', 'string', 'security|account|login'],
    head: { 'src/case/login.js': String.raw`export async function redeemToken(token, collection) {
  if (typeof token !== 'string' || token.length === 0) return null;
  const row = await collection.findOneAndDelete({ token, expiresAt: { $gt: Date.now() } });
  return row?.userId ?? null;
}` },
    prior: { 'src/case/login.js': String.raw`export async function redeemToken(token, collection) {
  if (!token) return null;
  const row = await collection.findOneAndDelete({ token, expiresAt: { $gt: Date.now() } });
  return row?.userId ?? null;
}` },
    pr: 'An earlier version sent a truthy client token into a raw database selector. A later push requires a string.',
    good: 'Draft 1 src/case/login.js:3 — Resolved at head. The earlier truthy check allowed an object such as $ne into the login lookup, a security operator-injection risk. The final string guard at src/case/login.js:2 rejects object tokens before the database call.',
    bad: 'Draft 1 src/case/login.js:3 — Invalid. A truthy token could never affect the database selector.',
  },
  {
    id: 'report-09-projection-guard', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/invite.js:4 — the invite guard reads accessType, but the projection excludes it.',
    expect: 'Resolved: the final query projects the field used by the guard.',
    required: ['projection|projected|select', 'accessType', 'before|earlier|draft'],
    head: { 'src/case/invite.js': String.raw`export async function canInvite(id, db) {
  const project = await db.findOne(id, { name: 1, accessType: 1 });
  if (!project) return false;
  if (project.accessType === 'invite-only') return false;
  return true;
}` },
    prior: { 'src/case/invite.js': String.raw`export async function canInvite(id, db) {
  const project = await db.findOne(id, { name: 1 });
  if (!project) return false;
  if (project.accessType === 'invite-only') return false;
  return true;
}` },
    pr: 'A draft identified a guard reading an omitted projected field. The final revision includes it.',
    good: 'Draft 1 src/case/invite.js:4 — Resolved. The earlier projection omitted accessType, making the guard ineffective. Head src/case/invite.js:2 includes accessType in the projection used by the guard at src/case/invite.js:4.',
    bad: 'Draft 1 src/case/invite.js:4 — Stands. accessType is still missing from the projected document.',
  },
  {
    id: 'report-10-shared-writer', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/activity.js:2 — using an old message createdAt for every activity edit moves the group activity timestamp backwards.',
    expect: 'Resolved: a later push restores now as the shared writer timestamp.',
    required: ['edit|other.caller|shared', 'createdAt|old.timestamp', 'now|current.time'],
    head: {
      'src/case/activity.js': String.raw`export function addActivity(group, message, now) {
  group.lastActivity = { messageId: message.id, timestamp: now };
}`,
      'src/case/edit.js': String.raw`import { addActivity } from './activity.js';
export function editMessage(group, originalMessage, now) {
  addActivity(group, originalMessage, now);
}`,
    },
    prior: {
      'src/case/activity.js': String.raw`export function addActivity(group, message, now) {
  group.lastActivity = { messageId: message.id, timestamp: message.createdAt };
}`,
      'src/case/edit.js': String.raw`import { addActivity } from './activity.js';
export function editMessage(group, originalMessage, now) {
  addActivity(group, originalMessage, now);
}`,
    },
    pr: 'An earlier shared-writer change used message creation time. An edit caller passes the original old message; the final push restores current activity time.',
    good: 'Draft 1 src/case/activity.js:2 — Resolved. The earlier shared writer used createdAt, so an edit of an old message via src/case/edit.js:3 could move activity backwards. At head src/case/activity.js:2 uses now for the timestamp again.',
    bad: 'Draft 1 src/case/activity.js:2 — Stands. The merged writer still uses createdAt.',
  },
  {
    id: 'report-11-preload-navigation', verdict: 'reword', mode: 'Gate',
    draft: 'src/case/head.js:2 — move the font preload to the destination page only to save bandwidth on other pages.',
    expect: 'Reword: route-only server head markup is not sent on client navigation; a runtime load would be needed.',
    required: ['client.side|client.navigation', 'preload|font', 'runtime|mount|not.sent|full.page'],
    head: {
      'src/case/head.js': String.raw`export function fullPageHead() {
  return '<link rel="preload" href="/fonts/display-heavy.woff2" as="font">';
}`,
      'src/case/router.js': String.raw`export function navigateInClient(path, render) {
  history.pushState({}, '', path);
  render(path); // no full-page HTML response or new server head
}`,
    },
    pr: 'The font is needed by a page reached through client-side navigation. The global preload removes a visible font swap at the cost of one extra download.',
    good: 'Draft 1 src/case/head.js:2 — Reword. A route-only server preload would not be sent on client-side navigation through src/case/router.js:3, so the font jump returns. Keep the global preload or load the font at runtime when that page mounts; the bandwidth tradeoff needs evidence.',
    bad: 'Draft 1 src/case/head.js:2 — Stands. A page-specific server head always runs on client navigation.',
  },
  {
    id: 'report-12-status-202', verdict: 'reword', mode: 'Gate',
    draft: 'src/case/remove.js:5 — treat every 202 response as success, since an association may already be gone.',
    expect: 'Reword: handle 404 specifically; broad 202 acceptance swallows other client errors.',
    required: ['404', '401|403|429|other.4', '202|status'],
    forbiddenSuggested: ['(?:all|every|any).{0,25}202.{0,25}success'],
    head: { 'src/case/remove.js': String.raw`export async function removeLink(id, provider, logger) {
  const response = await provider.delete(id);
  if (response.status === 200) return { removed: true };
  if (response.status >= 500) throw new Error('provider unavailable');
  const result = { status: 202, originalStatus: response.status };
  logger.error('manual repair needed', result);
  return result;
}` },
    pr: 'The provider can return 404 for an already-deleted association, but the helper maps all other non-5xx failures to 202 as well.',
    good: 'Draft 1 src/case/remove.js:5 — Reword. The 202 mapping at src/case/remove.js:5 also includes 401, 403 and 429; only 5xx is thrown at src/case/remove.js:4. Accepting every 202 would hide real failures. Handle 404 as already removed and preserve other 4xx errors.',
    bad: 'Draft 1 src/case/remove.js:5 — Stands. All 202 results should count as successful deletion.',
  },
  {
    id: 'report-13-required-field', verdict: 'resolved', mode: 'Gate',
    draft: 'src/case/refresh.js:3 — trivial: test that lastActivity is absent after the last activity is removed.',
    expect: 'Resolved at merge; the original branch was a blocking schema validation failure, not a missing absence assertion.',
    required: ['required|schema|validat', 'fail|throw|reject|crash', 'fallback|created'],
    head: {
      'src/case/refresh.js': String.raw`export async function refreshActivity(groupId, latest, groups) {
  if (latest) return groups.update(groupId, { $set: { lastActivity: latest } });
  return groups.update(groupId, { $set: { lastActivity: { kind: 'created' } } });
}`,
      'src/case/store.js': String.raw`export function createGroups() {
  return { update(_id, patch) {
    if (patch.$unset?.lastActivity) throw new Error('lastActivity is required');
    if (!patch.$set?.lastActivity) throw new Error('lastActivity is required');
    return patch.$set.lastActivity;
  } };
}`,
    },
    prior: {
      'src/case/refresh.js': String.raw`export async function refreshActivity(groupId, latest, groups) {
  if (latest) return groups.update(groupId, { $set: { lastActivity: latest } });
  return groups.update(groupId, { $unset: { lastActivity: 1 } });
}`,
      'src/case/store.js': String.raw`export function createGroups() {
  return { update(_id, patch) {
    if (patch.$unset?.lastActivity) throw new Error('lastActivity is required');
    if (!patch.$set?.lastActivity) throw new Error('lastActivity is required');
    return patch.$set.lastActivity;
  } };
}`,
    },
    pr: 'The collection requires lastActivity on every validated update. The earlier unset failed validation. The final push sets a valid created-event fallback.',
    good: 'Draft 1 src/case/refresh.js:3 — Resolved at head, but the original was not trivial. Unsetting a required field fails validation in src/case/store.js:3, so an absence assertion was the wrong test. The final branches at src/case/refresh.js:2-3 keep lastActivity valid with a fallback.',
    bad: 'Draft 1 src/case/refresh.js:3 — Invalid because lastActivity is optional and no failure occurs.',
  },
  {
    id: 'report-14-test-ordering', verdict: 'reword', mode: 'Gate',
    draft: 'spec/cancel.fixture.js:3 — no tests cover sequence claiming for series and single cancellations; add both end-state tests.',
    expect: 'Reword: the tests exist; the gap is whether the claim precedes notification.',
    required: ['existing|already', 'order|before.notification|moment|spy|capture', 'sequence|claim'],
    head: {
      'src/case/cancel.js': String.raw`export async function cancel(all, sequence, notify) {
  if (all) await sequence.claim();
  await notify();
}`,
      'spec/cancel.fixture.js': String.raw`import { cancel } from '../src/case/cancel.js';
// These tests assert only the sequence at the end, not at notify time.
export async function seriesTest(sequence, notify) { await cancel(true, sequence, notify); if (sequence.value !== 1) throw new Error('no claim'); }
export async function singleTest(sequence, notify) { await cancel(false, sequence, notify); if (sequence.value !== 0) throw new Error('unexpected claim'); }`,
    },
    pr: 'An existing pair of tests checks final sequence values. The new change promises the claim happens before a notification is built.',
    good: 'Draft 1 spec/cancel.fixture.js:3 — Reword. The series and single end-state tests already exist at spec/cancel.fixture.js:3-4. The missing assertion is ordering: capture sequence.value when notify runs at src/case/cancel.js:3, or spy on the calls, to prove claim precedes notification.',
    bad: 'Draft 1 spec/cancel.fixture.js:3 — Stands. Add duplicate end-state tests; no sequence tests exist.',
  },
  {
    id: 'report-15-global-rejection', verdict: 'invalid', mode: 'Gate',
    draft: 'src/case/job.js:3 — an async rejection in defer is unhandled and can terminate the server; catch and log it locally.',
    expect: 'Invalid as stated: startup installs a process-wide rejection handler; a log-only local catch would swallow the failure.',
    required: ['unhandledRejection|process.wide|global.handler', 'startup|boot|logger', 'swallow|log.only|propagat'],
    head: {
      'src/case/boot.js': String.raw`export function installErrorTracking(processLike, tracker) {
  processLike.on('unhandledRejection', (error) => tracker.capture(error));
}`,
      'src/case/job.js': String.raw`export function queueCleanup(defer, work) {
  defer(async () => {
    await work();
  });
}`,
      'src/case/server.js': String.raw`import { installErrorTracking } from './boot.js';
import { queueCleanup } from './job.js';
export function startServer(processLike, tracker, defer, work) {
  installErrorTracking(processLike, tracker);
  queueCleanup(defer, work);
}`,
    },
    pr: 'The boot module installs the global error tracker before background jobs start. The job deliberately lets failures reach that tracker.',
    good: 'Draft 1 src/case/job.js:3 — Invalid as stated. src/case/server.js:4 invokes startup tracking before the job, and src/case/boot.js:2 registers unhandledRejection with the error tracker. The claim that this rejection has no handler is false. A log-only local catch would swallow failure; local context could be added without hiding it.',
    bad: 'Draft 1 src/case/job.js:3 — Stands. No rejection handler exists; catch and only log.',
  },
  {
    id: 'report-16-wrapper-props', verdict: 'invalid', mode: 'Gate',
    draft: 'src/case/routes.js:2 — the page gets no projectId prop, so it never loads.',
    expect: 'Invalid: the route wrapper injects URL params before rendering the page.',
    required: ['wrapper|withParams|lazyLoad', 'useParams|params|route', 'projectId'],
    head: {
      'src/case/routes.js': String.raw`import { withParams } from './wrapper.js';
export const route = { path: '/projects/:projectId', Page: withParams(() => import('./page.js')) };`,
      'src/case/wrapper.js': String.raw`export function withParams(loadPage) {
  return async function render(routeParams) {
    const Page = (await loadPage()).Page;
    return Page({ ...routeParams });
  };
}`,
      'src/case/page.js': String.raw`export function Page({ projectId }) {
  return projectId ? 'loaded ' + projectId : 'missing';
}`,
    },
    pr: 'The route uses a lazy wrapper that supplies route params to the page.',
    good: 'Draft 1 src/case/routes.js:2 — Invalid. The /projects/:projectId route at src/case/routes.js:2 goes through withParams, which spreads route params into Page at src/case/wrapper.js:4. projectId is supplied.',
    bad: 'Draft 1 src/case/routes.js:2 — Stands. The wrapper cannot provide route parameters.',
  },
  {
    id: 'report-17-logged-args', verdict: 'invalid', mode: 'Gate',
    draft: 'src/case/invite.js:2 — email was removed from the parameter list, so invite validation fails.',
    expect: 'Invalid: email was removed only from the logging list, not the actual argument list.',
    required: ['third|logging|logged', 'second|params|argument', 'email'],
    head: {
      'src/case/method.js': String.raw`export function defineMethod(name, params, logged, handler) {
  return (...args) => {
    const values = Object.fromEntries(params.map((key, index) => [key, args[index]]));
    console.info(name, Object.fromEntries(Object.entries(values).filter(([key]) => logged.includes(key))));
    return handler(values);
  };
}`,
      'src/case/invite.js': String.raw`import { defineMethod } from './method.js';
export const invite = defineMethod('invite', ['email', 'projectId'], ['projectId'], ({ email, projectId }) => {
  if (!email || !projectId) throw new Error('invalid');
  return true;
});`,
    },
    pr: 'The PR removes email from a log allowlist while retaining it in the positional argument schema.',
    good: 'Draft 1 src/case/invite.js:2 — Invalid. The second list at src/case/invite.js:2 still contains email as a parameter. The third list is logging-only by src/case/method.js:4; removing email there keeps it out of logs without breaking validation.',
    bad: 'Draft 1 src/case/invite.js:2 — Stands. email is no longer passed to the handler.',
  },
  {
    id: 'report-18-route-shape', verdict: 'invalid', mode: 'Gate',
    draft: 'src/case/paths.js:3 — REPORTS is a route object; pass REPORTS.path or replace throws.',
    expect: 'Invalid: REPORTS is already a string; the proposed .path access would be undefined.',
    required: ['string', '\\.path', 'undefined|throw|crash'],
    head: {
      'src/case/paths.js': String.raw`export const ROUTE_PATHS = { REPORTS: '/reports/:id' };
export function reportUrl(id) {
  return ROUTE_PATHS.REPORTS.replace(':id', String(id));
}`,
      'spec/path.fixture.js': String.raw`import { reportUrl, ROUTE_PATHS } from '../src/case/paths.js';
export function weakTest() {
  return reportUrl('7').includes(ROUTE_PATHS.REPORTS.path ? ROUTE_PATHS.REPORTS.path : '/reports');
}`,
    },
    pr: 'The route constant is a path string. A test contains an unrelated always-fallback ternary.',
    good: 'Draft 1 src/case/paths.js:3 — Invalid. ROUTE_PATHS.REPORTS is already a string at src/case/paths.js:1, so replace at src/case/paths.js:3 works. REPORTS.path would be undefined and make the proposed fix crash. Separately, spec/path.fixture.js:3 has a weak fallback assertion.',
    bad: 'Draft 1 src/case/paths.js:3 — Stands. Add .path before replace.',
  },
  {
    id: 'report-19-framework-version', verdict: 'invalid', mode: 'Gate',
    draft: 'src/case/count.js:2 — this framework lacks countDocuments; replace it with count(true).',
    expect: 'Invalid: the declared version supports countDocuments and a server lint rule rejects count().',
    required: ['3.x|3\\.x|version.3|framework.3', 'lint|banned|deprecated', 'countDocuments'],
    head: {
      'src/case/count.js': String.raw`export async function countActive(collection) {
  return collection.countDocuments({ active: true });
}`,
      'src/case/release.js': String.raw`export const frameworkRelease = '3.2.0';`,
      'src/case/lint.js': String.raw`export const serverRules = { 'no-deprecated-count': { banned: 'count', replacement: 'countDocuments', level: 'error' } };`,
    },
    pr: 'The project declares framework 3.x and its server lint rule bans deprecated count().',
    good: 'Draft 1 src/case/count.js:2 — Invalid. The declared framework 3.x version at src/case/release.js:1 supports countDocuments, and the error-level lint rule at src/case/lint.js:1 bans count() in favor of countDocuments. The suggested replacement would fail lint.',
    bad: 'Draft 1 src/case/count.js:2 — Stands. Use count(true) because countDocuments is unavailable.',
  },
  {
    id: 'report-20-stale-index-thread', verdict: 'invalid', mode: 'Gate',
    draft: 'src/case/webhook.js:2 — the channel lookup has no index; add one before shipping.',
    expect: 'Invalid repeated draft: the final index exists, and the PR description is stale.',
    required: ['index', 'stale|outdated', 'already.raised|duplicate|repeated'],
    head: {
      'src/case/webhook.js': String.raw`export async function receive(channelId, secret, db) {
  const profile = await db.profiles.findOne({ channelId });
  if (!profile || profile.secret !== secret) return false;
  return true;
}`,
      'src/case/indexes.js': String.raw`export const indexes = [{ keys: { channelId: 1 }, partialFilter: { channelId: { $exists: true } } }];`,
    },
    prior: {
      'src/case/webhook.js': String.raw`export async function receive(channelId, secret, db) {
  const profile = await db.profiles.findOne({ channelId });
  if (!profile || profile.secret !== secret) return false;
  return true;
}`,
      'src/case/indexes.js': String.raw`export const indexes = [];`,
    },
    threads: ['https://github.com/example/project/pull/20#discussion_r2000 — index missing on channelId; original draft was raised before the index was added.'],
    pr: 'The description still says “index TODO”, although the code now declares the index. A submitted thread raised the original issue before the fix.',
    good: 'Draft 1 src/case/webhook.js:2 — Invalid as a repeated current finding. The earlier issue was already raised at https://github.com/example/project/pull/20#discussion_r2000; head src/case/indexes.js:1 declares a partial channelId index. The PR description is stale. No duplicate comment should be posted.',
    bad: 'Draft 1 src/case/webhook.js:2 — Stands. The stale PR description proves the index is missing; post another comment.',
  },
];

// Every fixture also includes a common context file so the harness can make
// the base commit before applying the case-specific head.
export const reportContext = context;
