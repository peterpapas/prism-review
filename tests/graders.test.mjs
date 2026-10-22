// Every behaviour grader is proven before any paid run: the good reference must pass,
// the bad reference must fail, and the fixture each probe points at must exist.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { probes, buildPrompt } from '../evals/probes.mjs';
import { citationCheck, grade, graders } from '../evals/graders.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('every probe has a grader, a fixture, a PR body and reference outputs', () => {
  for (const p of probes) {
    assert.ok(graders[p.id], `${p.id}: no grader`);
    assert.ok(existsSync(join(root, 'evals', p.fixture, 'src')), `${p.id}: fixture ${p.fixture} missing`);
    assert.ok(existsSync(join(root, 'evals', p.fixture, p.prBody)), `${p.id}: ${p.prBody} missing`);
    for (const f of ['good.md', 'bad.md']) assert.ok(existsSync(join(root, 'evals/probes', p.id, f)), `${p.id}: ${f} missing`);
  }
});

for (const p of probes) {
  const fixtureDir = join(root, 'evals', p.fixture);
  test(`${p.id}: good reference passes`, () => {
    const r = grade(p.id, readFileSync(join(root, 'evals/probes', p.id, 'good.md'), 'utf8'), fixtureDir);
    assert.ok(r.pass, r.reasons.join('; '));
    assert.equal(r.citations.bad.length, 0, 'good reference must cite only real lines');
  });
  test(`${p.id}: bad reference fails`, () => {
    const r = grade(p.id, readFileSync(join(root, 'evals/probes', p.id, 'bad.md'), 'utf8'), fixtureDir);
    assert.equal(r.pass, false, 'bad reference was accepted');
  });
}

test('citation check flags absent files and out-of-range lines, and allows only the exact quoted draft citation', () => {
  const fixtureDir = join(root, 'evals/fixture');
  const r = citationCheck('see src/orders/create.ts:3 and src/orders/create.ts:999 and src/nope.ts:1 and src/billing/charge.ts:12', fixtureDir, ['src/billing/charge.ts:12']);
  assert.equal(r.total, 3);
  assert.deepEqual(r.bad, ['src/orders/create.ts:999 (outside file)', 'src/nope.ts:1 (no such file)']);
  assert.deepEqual(citationCheck('src/billing/charge.ts:40', fixtureDir, ['src/billing/charge.ts:12']).bad, ['src/billing/charge.ts:40 (no such file)'], 'other lines of the missing file are still invented');
});

test('prompts never ask the agent to write, post or run tests', () => {
  for (const p of probes) {
    const prompt = buildPrompt(p);
    assert.match(prompt, /Only read; do not edit files, run tests, or post anything/);
    if (p.mode === 'Gate') assert.ok(p.drafts.every((d) => prompt.includes(d)), `${p.id}: a draft is missing from the prompt`);
    else assert.equal(p.drafts.length, 0, `${p.id}: Review probes carry no drafts`);
  }
});
