#!/usr/bin/env node
// Materialize the compact report-case declarations as ordinary PRism fixtures.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { reportCases, reportContext } from './report-cases.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

export function expectedReportFiles() {
  const files = new Map();
  for (const c of reportCases) {
    const fixture = `evals/fixture-${c.id}`;
    const base = c.prior ?? {};
    for (const [path, content] of Object.entries({ 'src/case/context.js': reportContext, ...base })) {
      files.set(`${fixture}/base/${path}`, `${content.trimEnd()}\n`);
    }
    for (const [path, content] of Object.entries({ 'src/case/context.js': reportContext, ...c.head })) {
      files.set(`${fixture}/${path}`, `${content.trimEnd()}\n`);
    }
    files.set(`${fixture}/PR.md`, `# Synthetic review case ${c.id}\n\n${c.pr}\n`);
    files.set(`evals/probes/${c.id}/good.md`, `${c.good}\n\nSuggested comments: none.\n`);
    files.set(`evals/probes/${c.id}/bad.md`, `${c.bad}\n`);
  }
  return files;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  for (const [relative, content] of expectedReportFiles()) {
    const path = join(root, relative);
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
}
