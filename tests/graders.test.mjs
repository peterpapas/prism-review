// Every behaviour grader is proven before any paid run: the good reference must pass,
// the bad reference must fail, and the fixture each probe points at must exist.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { probes, buildPrompt } from '../evals/probes.mjs';
import { citationCheck, grade, graders, suggestionLines } from '../evals/graders.mjs';
import { reportCases } from '../evals/report-cases.mjs';
import { expectedReportFiles } from '../evals/materialize-report-cases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('every probe has a grader, a fixture, a PR body and reference outputs', () => {
  for (const p of probes) {
    assert.ok(graders[p.id], `${p.id}: no grader`);
    assert.ok(existsSync(join(root, 'evals', p.fixture, 'src')), `${p.id}: fixture ${p.fixture} missing`);
    assert.ok(existsSync(join(root, 'evals', p.fixture, p.prBody)), `${p.id}: ${p.prBody} missing`);
    for (const f of ['good.md', 'bad.md']) assert.ok(existsSync(join(root, 'evals/probes', p.id, f)), `${p.id}: ${f} missing`);
  }
});

test('generated report-derived fixtures and references match their declarations', () => {
  const expectedFiles = expectedReportFiles();
  for (const [relative, expected] of expectedFiles) {
    assert.equal(readFileSync(join(root, relative), 'utf8').replaceAll('\r\n', '\n'), expected, `${relative} has drifted`);
  }
  const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const child = join(dir, entry.name);
    return entry.isDirectory() ? walk(child) : [child];
  });
  for (const c of reportCases) {
    for (const relative of [`evals/fixture-${c.id}`, `evals/probes/${c.id}`]) {
      for (const file of walk(join(root, relative))) {
        const normalized = file.slice(root.length + 1).replaceAll('\\', '/');
        assert.ok(expectedFiles.has(normalized), `${normalized} is a stale generated file`);
      }
    }
  }
  assert.equal(reportCases.length, 20);
  assert.equal(new Set(reportCases.map((c) => c.id)).size, 20);
});

test('report-derived draft anchors exist in the revision where they were written', () => {
  for (const c of reportCases) {
    if (!c.draft) continue;
    const match = c.draft.match(/\b((?:src|spec)\/[\w/.-]+\.(?:ts|js|md)):(\d+)\b/);
    assert.ok(match, `${c.id}: no draft anchor`);
    const source = (c.prior ?? c.head)[match[1]] ?? c.head[match[1]];
    assert.ok(source, `${c.id}: draft file absent from source snapshot`);
    assert.ok(Number(match[2]) <= source.split('\n').length, `${c.id}: draft line is outside its source snapshot`);
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

test('a reworded race finding can call the proposed lock incorrect', () => {
  const output = 'Draft 1 src/orders/create.ts:9 — Reword: the process lock is incorrect. src/orders/schema.ts:2 has no unique constraint. Add a unique index to prevent duplicate inserts.';
  assert.equal(grade('race-valid', output, join(root, 'evals/fixture')).pass, true);
});

test('an empty suggested-comments heading is not a proposed comment', () => {
  assert.deepEqual(suggestionLines('Suggested comments: none; the race is already handled.\nNo supported findings.'), []);
  assert.deepEqual(suggestionLines('Suggested comments: n/a because the race is handled.\nNo supported findings.'), []);
});
