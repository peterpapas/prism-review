#!/usr/bin/env node
// Rebuild the expanded Codex comparison from its saved, unmodified run rows.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = 'evals/results/2026-10-24T09-56-36-079Z-11a01c11-codex';
const output = join(root, 'assets/eval-expanded-codex.svg');
const rows = JSON.parse(readFileSync(join(root, run, 'rows.json'), 'utf8'));
const arms = [
  { id: 'none', label: 'No skill', color: '#e9af80' },
  { id: 'prism', label: 'PRism', color: '#6fe0d0' },
].map((arm) => ({ ...arm, rows: rows.filter((row) => row.arm === arm.id) }));

assert.equal(rows.length, 80, 'this chart describes the 40-probe, one-run-per-arm comparison');
for (const arm of arms) {
  assert.equal(arm.rows.length, 40, `expected forty ${arm.id} cells`);
  assert.equal(new Set(arm.rows.map((row) => `${row.probe}.${row.run}`)).size, 40, 'duplicate or missing cells');
  assert.ok(arm.rows.every((row) => Number.isFinite(row.tokens) && Number.isFinite(row.seconds)), 'tokens and time must be recorded');
}
const byProbe = new Map();
for (const row of rows) {
  const pair = byProbe.get(row.probe) ?? {};
  pair[row.arm] = row;
  byProbe.set(row.probe, pair);
}
assert.equal(byProbe.size, 40);
assert.ok([...byProbe.values()].every((pair) => pair.none && pair.prism));

const passes = (arm) => arm.rows.filter((row) => row.pass).length;
const tokens = (arm) => arm.rows.reduce((sum, row) => sum + row.tokens, 0);
const meanSeconds = (arm) => arm.rows.reduce((sum, row) => sum + row.seconds, 0) / 40;
const pairs = { both: 0, prism: 0, none: 0, neither: 0 };
for (const { none, prism } of byProbe.values()) {
  pairs[none.pass && prism.pass ? 'both' : prism.pass ? 'prism' : none.pass ? 'none' : 'neither'] += 1;
}
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function barPanel(y, title, scale, scaleLabel, value, format) {
  const x = 344;
  const width = 548;
  const bars = arms.map((arm, index) => {
    const amount = value(arm);
    const top = y + 47 + index * 38;
    return `<text x="88" y="${top + 19}" class="arm">${esc(arm.label)}</text>
      <rect x="${x}" y="${top}" width="${width}" height="24" rx="5" fill="#243c4b"/>
      <rect x="${x}" y="${top}" width="${Math.round(width * amount / scale)}" height="24" rx="5" fill="${arm.color}"/>
      <text x="912" y="${top + 19}" class="value">${esc(format(amount))}</text>`;
  }).join('\n');
  return `<g><rect x="64" y="${y}" width="1072" height="140" rx="14" fill="#142b3b" stroke="#2e4b5a"/>
    <text x="88" y="${y + 29}" class="metric">${esc(title)}</text>
    <text x="1098" y="${y + 29}" class="scale">0–${esc(scaleLabel)}</text>${bars}</g>`;
}

const pairTiles = [
  { key: 'both', label: 'Both passed', color: '#89b8d7' },
  { key: 'prism', label: 'PRism only', color: '#6fe0d0' },
  { key: 'none', label: 'No skill only', color: '#e9af80' },
  { key: 'neither', label: 'Neither passed', color: '#9a9ba9' },
].map((tile, index) => {
  const x = 88 + index * 261;
  return `<g><rect x="${x}" y="387" width="244" height="89" rx="10" fill="#203b4a"/>
    <text x="${x + 16}" y="424" class="tileNumber" fill="${tile.color}">${pairs[tile.key]}</text>
    <text x="${x + 70}" y="424" class="tileLabel">${esc(tile.label)}</text></g>`;
}).join('\n');

const tokenScale = Math.ceil(Math.max(...arms.map(tokens)) / 100000) * 100000;
const timeScale = Math.ceil(Math.max(...arms.map(meanSeconds)) / 10) * 10;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="865" viewBox="0 0 1200 865" role="img" aria-labelledby="title desc">
  <title id="title">PRism versus no skill on forty synthetic review probes</title>
  <desc id="desc">One Codex run per probe and arm. Strict regex grader passes: no skill ${passes(arms[0])} of 40, PRism ${passes(arms[1])} of 40. Pair outcomes: both ${pairs.both}, PRism only ${pairs.prism}, no skill only ${pairs.none}, neither ${pairs.neither}. Total CLI tokens: ${tokens(arms[0])} and ${tokens(arms[1])}. Mean elapsed seconds: ${meanSeconds(arms[0]).toFixed(1)} and ${meanSeconds(arms[1]).toFixed(1)}. Scores are wording-sensitive and are not accuracy rates.</desc>
  <defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1727"/><stop offset="1" stop-color="#132e3a"/></linearGradient>
    <style>.eyebrow{font:700 15px Arial,sans-serif;letter-spacing:3px;fill:#77dfcf}.heading{font:700 34px Arial,sans-serif;fill:#eef7f9}.sub{font:18px Arial,sans-serif;fill:#b6ced9}.metric{font:700 18px Arial,sans-serif;fill:#e9f5f6}.scale{font:14px Arial,sans-serif;fill:#9cb9c8;text-anchor:end}.arm{font:700 17px Arial,sans-serif;fill:#e6f2f4}.value{font:700 18px Arial,sans-serif;fill:#f4f9fa}.tileNumber{font:700 36px Arial,sans-serif}.tileLabel{font:16px Arial,sans-serif;fill:#e6f2f4}.foot{font:15px Arial,sans-serif;fill:#c3d4dd}</style>
  </defs>
  <rect width="1200" height="865" rx="22" fill="url(#bg)"/>
  <text x="64" y="55" class="eyebrow">EXPANDED CODEX COMPARISON</text>
  <text x="64" y="98" class="heading">What changed with PRism?</text>
  <text x="64" y="128" class="sub">40 synthetic probes · one run per arm · gpt-6.1-sol</text>
  ${barPanel(156, 'Strict rubric matches', 40, '40 probes', passes, (n) => `${n}/40`)}
  <rect x="64" y="312" width="1072" height="179" rx="14" fill="#142b3b" stroke="#2e4b5a"/>
  <text x="88" y="342" class="metric">Paired probe outcomes</text>
  <text x="1098" y="342" class="scale">40 pairs total</text>
  ${pairTiles}
  ${barPanel(506, 'Total CLI tokens', tokenScale, `${tokenScale / 1000}k`, tokens, (n) => n.toLocaleString('en-US'))}
  ${barPanel(656, 'Mean elapsed time per probe', timeScale, `${timeScale} s`, meanSeconds, (n) => `${n.toFixed(1)} s`)}
  <text x="64" y="832" class="foot">Strict regex rules are wording-sensitive. These counts are not review accuracy on live PRs.</text>
  <text x="64" y="852" class="foot">Read the run notes for audited disagreements, setup, and limits.</text>
</svg>
`;

if (process.argv.includes('--check')) {
  assert.equal(readFileSync(output, 'utf8'), svg, 'expanded chart is stale; run node evals/render-expanded-chart.mjs');
  console.log('expanded chart matches saved run');
} else {
  writeFileSync(output, svg);
  console.log(`wrote ${output}`);
}
