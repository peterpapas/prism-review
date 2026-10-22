// Tier 0: the skill files say what the README says they say. No API key, no network.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dir = join(root, 'skills/prism-review');
const skill = readFileSync(join(dir, 'SKILL.md'), 'utf8');
const lenses = readFileSync(join(dir, 'references/lenses.md'), 'utf8');
const readme = readFileSync(join(root, 'README.md'), 'utf8');
const fm = skill.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';

test('frontmatter: name equals the skill directory name, description has text', () => {
  assert.equal(fm.match(/^name: (.+)$/m)?.[1], basename(dir));
  // Inline scalar, or a folded/literal block scalar followed by at least one indented non-empty line.
  assert.match(fm, /^description: (?:[^>|\s].*|[>|][-+]?\s*\r?\n\s+\S)/m);
});

test('no private repository or company names in any text file outside evals/results', () => {
  const walk = (d) => readdirSync(d, { withFileTypes: true }).flatMap((e) => e.name.startsWith('.') || e.name === 'node_modules' || (d === join(root, 'evals') && e.name === 'results') ? [] : e.isDirectory() ? walk(join(d, e.name)) : /\.(md|mjs|js|ts|json|svg|txt|ya?ml)$/.test(e.name) ? [join(d, e.name)] : []);
  const PRIVATE = new RegExp(['mentor', 'loop'].join(''), 'i'); // split so this file does not match itself
  for (const f of walk(root)) assert.doesNotMatch(readFileSync(f, 'utf8'), PRIVATE, `${f.slice(root.length + 1)} mentions a private name`);
});

test('lenses.md defines exactly six lenses and SKILL.md links to it', () => {
  const rows = [...lenses.matchAll(/^\| ([^|]+?) \|/gm)].map((m) => m[1]).filter((n) => n !== 'Lens' && !/^-+$/.test(n));
  assert.deepEqual([...rows].sort(), ['Invariants', 'Inversion', 'Contracts', 'Second-order', "Chesterton's Fence", 'Steelman'].sort());
  assert.match(skill, /\(references\/lenses\.md\)/);
  assert.match(lenses, /not discovery lenses/, 'lenses.md must say falsification and evidence labelling are not lenses');
});

test('evidence outcomes are all defined and only two are actionable', () => {
  for (const w of ['Confirmed', 'Supported', 'Unverified', 'Disproved']) assert.ok(skill.includes(`**${w}:**`), `missing ${w}`);
  assert.match(skill, /Only Confirmed or Supported findings may become suggested comments/);
});

test('gate dispositions are the five the README lists', () => {
  for (const s of ['Stands', 'Resolved', 'Reword', 'Invalid', 'Cannot verify']) {
    assert.match(skill, new RegExp(`^\\| ${s} \\|`, 'm'), `SKILL.md table lacks ${s}`);
    assert.ok(readme.includes(s), `README lacks ${s}`);
  }
});

test('read-only boundary appears in the opening paragraph, before any step', () => {
  const idx = skill.search(/does not post, approve, request changes, resolve threads, edit files, or run tests/);
  assert.ok(idx > -1, 'boundary sentence missing');
  assert.ok(idx < skill.indexOf('\n## '), 'boundary sentence must come before the first section heading');
});

test('no invented confidence percentages in the skill or references', () => {
  assert.doesNotMatch(skill, /\d{1,3}\s?%\s*(?:confiden|certain|sure|likely|probab)/i);
  assert.doesNotMatch(lenses, /\d{1,3}\s?%\s*(?:confiden|certain|sure|likely|probab)/i);
  assert.match(skill, /do not invent percentages/);
});

test('every relative link, href and src in SKILL.md and README resolves', () => {
  const check = (text, base, label) => {
    const targets = [
      ...[...text.matchAll(/\]\(((?!https?:|#|mailto:)[^)]+)\)/g)].map((m) => m[1]),
      ...[...text.matchAll(/(?:href|src)="((?!https?:|#|mailto:)[^"]+)"/g)].map((m) => m[1]),
    ];
    assert.ok(targets.length > 0, `${label}: expected at least one relative link`);
    for (const t of targets) assert.ok(existsSync(join(base, t.split('#')[0])), `${label}: ${t} does not resolve`);
  };
  check(skill, dir, 'SKILL.md');
  check(readme, root, 'README.md');
});
