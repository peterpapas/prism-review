#!/usr/bin/env node
// Render the clean Codex pilot from its saved rows and final outputs. No model calls.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const run = 'evals/results/2026-10-23T00-02-02-333Z-6869b71f-codex';
const output = join(root, 'assets/eval-clean-codex.svg');
const rows = JSON.parse(readFileSync(join(root, run, 'rows.json'), 'utf8'));
const arms = [
  { id: 'none', label: 'No skill', color: '#e9af80' },
  { id: 'prism', label: 'PRism text', color: '#6fe0d0' },
].map((arm) => ({ ...arm, rows: rows.filter((row) => row.arm === arm.id) }));

assert.equal(rows.length, 30, 'this graphic describes the 30-cell Codex pilot only');
for (const arm of arms) {
  assert.equal(arm.rows.length, 15, `expected fifteen ${arm.id} cells`);
  assert.equal(new Set(arm.rows.map((row) => `${row.probe}.${row.run}`)).size, 15, 'duplicate or missing cells');
  assert.ok(arm.rows.every((row) => Number.isFinite(row.tokens) && Number.isFinite(row.seconds)), 'tokens and time must be recorded');
}

const passes = (arm) => arm.rows.filter((row) => row.pass).length;
const tokens = (arm) => arm.rows.reduce((sum, row) => sum + row.tokens, 0);
const meanSeconds = (arm) => arm.rows.reduce((sum, row) => sum + row.seconds, 0) / arm.rows.length;
const incidental = (arm) => arm.rows.filter((row) => {
  if (!['guard-invalid', 'missing-caller'].includes(row.probe)) return false;
  const text = readFileSync(join(root, run, `${row.probe}.${row.arm}.r${row.run}.md`), 'utf8').split('\n---\n\n').slice(1).join('\n---\n\n');
  return /\[P[0-3]\]/.test(text) && /src\/orders\/create\.ts:9/.test(text) && /concurrent|duplicate orders/i.test(text);
}).length;
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function panel(y, title, scale, scaleLabel, value, format) {
  const x = 355;
  const width = 520;
  const bars = arms.map((arm, index) => {
    const amount = value(arm);
    const top = y + 48 + index * 36;
    const barWidth = amount ? Math.round(width * amount / scale) : 0;
    return `<text x="89" y="${top + 18}" class="arm">${esc(arm.label)}</text>
      <rect x="${x}" y="${top}" width="${width}" height="23" rx="5" fill="#1f3345"/>
      <rect x="${x}" y="${top}" width="${barWidth}" height="23" rx="5" fill="${arm.color}"/>
      <text x="900" y="${top + 18}" class="value">${esc(format(amount))}</text>`;
  }).join('\n');
  return `<g>
    <rect x="64" y="${y}" width="1072" height="136" rx="14" fill="#14283a" stroke="#294153"/>
    <text x="88" y="${y + 29}" class="metric">${esc(title)}</text>
    <text x="1010" y="${y + 29}" class="scale">0–${esc(scaleLabel)}</text>
    ${bars}
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800" role="img" aria-labelledby="title desc">
  <title id="title">PRism clean Codex pilot: a finding benefit with higher token and time use</title>
  <desc id="desc">In five synthetic probes repeated three times, the no-skill arm passed ${passes(arms[0])} of 15 strict grader checks and the PRism arm passed ${passes(arms[1])}. In six unrelated draft-gate cells per arm, the no-skill arm suggested the seeded race ${incidental(arms[0])} times and PRism ${incidental(arms[1])} times. Total CLI tokens were ${tokens(arms[0])} and ${tokens(arms[1])}; mean elapsed seconds were ${meanSeconds(arms[0]).toFixed(0)} and ${meanSeconds(arms[1]).toFixed(0)}. The new-finding count is exploratory and graders are wording-sensitive.</desc>
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1727"/><stop offset="1" stop-color="#132a39"/></linearGradient>
    <style>
      .eyebrow{font:700 15px Arial,sans-serif;letter-spacing:3px;fill:#77dfcf}
      .heading{font:700 34px Arial,sans-serif;fill:#eef7f9}
      .sub{font:18px Arial,sans-serif;fill:#b6ced9}
      .metric{font:700 18px Arial,sans-serif;fill:#e9f5f6}
      .scale{font:14px Arial,sans-serif;fill:#9cb9c8;text-anchor:end}
      .arm{font:700 17px Arial,sans-serif;fill:#e6f2f4}
      .value{font:700 18px Arial,sans-serif;fill:#f4f9fa}
      .foot{font:15px Arial,sans-serif;fill:#c3d4dd}
    </style>
  </defs>
  <rect width="1200" height="800" rx="22" fill="url(#bg)"/>
  <text x="64" y="55" class="eyebrow">CLEAN CODEX PILOT</text>
  <text x="64" y="98" class="heading">What changed with PRism text?</text>
  <text x="64" y="126" class="sub">Five synthetic probes · three runs per arm · gpt-6.1-sol</text>
  ${panel(152, 'Seeded race suggested during unrelated draft gates*', 6, '6 cells', incidental, (n) => `${n}/6`)}
  ${panel(301, 'Strict grader passes†', 15, '15 cells', passes, (n) => `${n}/15`)}
  ${panel(450, 'Total CLI tokens', 200000, '200k', tokens, (n) => n.toLocaleString('en-US'))}
  ${panel(599, 'Mean elapsed time per cell', 35, '35 s', meanSeconds, (n) => `${n.toFixed(0)} s`)}
  <text x="64" y="766" class="foot">* Post-run exploratory count; outputs checked. † Wording-sensitive rules with known false negatives.</text>
  <text x="64" y="787" class="foot">Same isolated Codex model and fixtures. Descriptive only; no claim about real pull requests.</text>
</svg>
`;

if (process.argv.includes('--check')) {
  assert.equal(readFileSync(output, 'utf8'), svg, 'clean chart is stale; run node evals/render-clean-chart.mjs');
  console.log('clean chart matches saved run');
} else {
  writeFileSync(output, svg);
  console.log(`wrote ${output}`);
}
