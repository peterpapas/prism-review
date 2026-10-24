import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

test('README pilot chart matches the committed run rows', () => {
  execFileSync(process.execPath, [join(root, 'evals/render-pilot-chart.mjs'), '--check'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('clean Codex chart matches saved rows and final outputs', () => {
  execFileSync(process.execPath, [join(root, 'evals/render-clean-chart.mjs'), '--check'], {
    cwd: root,
    stdio: 'pipe',
  });
});

test('expanded Codex chart matches the saved forty-probe run', () => {
  execFileSync(process.execPath, [join(root, 'evals/render-expanded-chart.mjs'), '--check'], {
    cwd: root,
    stdio: 'pipe',
  });
});
