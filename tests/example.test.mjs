import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const example = readFileSync(join(root, 'skills/prism-review/references/example.md'), 'utf8');
const fixture = join(root, 'evals/fixture');

test('worked example cites real fixture lines', () => {
  const refs = [...example.matchAll(/\b(src\/[\w/.-]+):([0-9]+)\b/g)];
  assert.ok(refs.length >= 5, 'expected source citations in the worked example');
  for (const [, path, number] of refs) {
    const file = join(fixture, path);
    assert.ok(existsSync(file), `${path} is absent`);
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    assert.ok(Number(number) >= 1 && Number(number) <= lines.length, `${path}:${number} is outside the file`);
  }
});

test('worked example counterevidence and caveat match the fixture', () => {
  const route = readFileSync(join(fixture, 'src/api/routes.ts'), 'utf8');
  const schema = readFileSync(join(fixture, 'src/orders/schema.ts'), 'utf8');
  const create = readFileSync(join(fixture, 'src/orders/create.ts'), 'utf8');
  const orderTest = readFileSync(join(fixture, 'spec/orders.fixture.ts'), 'utf8');
  assert.match(route, /requestId: 'uuid'/);
  assert.match(route, /Invalid UUID/);
  assert.match(route, /return createOrder\(requestId\)/);
  assert.match(schema, /index: true/);
  assert.doesNotMatch(schema, /unique: true/);
  assert.ok(create.indexOf('findOne(') < create.indexOf('insertOne('));
  assert.doesNotMatch(orderTest, /Promise\.all|parallel/i);
});
