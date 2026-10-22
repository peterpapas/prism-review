#!/usr/bin/env node
// Regenerate the README graphic from the committed pilot rows. No new agent calls.
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const source = 'evals/results/2026-10-22T12-21-09-claude/rows.json';
const output = join(root, 'assets/eval-pilot.svg');
const rows = JSON.parse(readFileSync(join(root, source), 'utf8'));
const arms = [
  { id: 'none', label: 'Baseline*', color: '#e9af80' },
  { id: 'prism', label: 'PRism', color: '#6fe0d0' },
].map((arm) => ({ ...arm, rows: rows.filter((row) => row.arm === arm.id) }));

assert.equal(rows.length, 10, 'this graphic describes the ten-cell pilot only');
for (const arm of arms) assert.equal(arm.rows.length, 5, `expected five ${arm.id} cells`);

const passed = (arm) => arm.rows.filter((row) => row.pass).length;
const cost = (arm) => arm.rows.reduce((sum, row) => sum + row.cost, 0);
const seconds = (arm) => arm.rows.reduce((sum, row) => sum + row.seconds, 0) / arm.rows.length;
const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');

function panel(y, title, scale, scaleLabel, value, format) {
  const x = 336;
  const width = 570;
  const bars = arms.map((arm, index) => {
    const amount = value(arm);
    const barWidth = Math.max(1, Math.round(width * amount / scale));
    const top = y + 51 + index * 39;
    return `<text x="88" y="${top + 18}" class="arm">${esc(arm.label)}</text>
      <rect x="${x}" y="${top}" width="${width}" height="24" rx="5" fill="#1f3345"/>
      <rect x="${x}" y="${top}" width="${barWidth}" height="24" rx="5" fill="${arm.color}"/>
      <text x="930" y="${top + 18}" class="value">${esc(format(amount))}</text>`;
  }).join('\n');
  return `<g>
    <rect x="64" y="${y}" width="1072" height="142" rx="14" fill="#14283a" stroke="#294153"/>
    <text x="88" y="${y + 31}" class="metric">${esc(title)}</text>
    <text x="906" y="${y + 31}" class="scale">scale 0–${esc(scaleLabel)}</text>
    ${bars}
  </g>`;
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="670" viewBox="0 0 1200 670" role="img" aria-labelledby="title desc">
  <title id="title">PRism first pilot: five grader passes in both arms</title>
  <desc id="desc">${passed(arms[0])} of five synthetic probes passed in the baseline arm and ${passed(arms[1])} of five in the PRism arm. Total recorded cost was ${cost(arms[0]).toFixed(3)} US dollars for the baseline and ${cost(arms[1]).toFixed(3)} for PRism. Mean elapsed time was ${seconds(arms[0]).toFixed(0)} and ${seconds(arms[1]).toFixed(0)} seconds. One run per cell. The baseline was contaminated by an available legacy skill, so these bars do not establish a performance difference.</desc>
  <defs>
    <linearGradient id="bg" x2="1" y2="1"><stop stop-color="#0b1727"/><stop offset="1" stop-color="#132a39"/></linearGradient>
    <style>
      .eyebrow{font:700 15px Arial,sans-serif;letter-spacing:3px;fill:#77dfcf}
      .heading{font:700 35px Arial,sans-serif;fill:#eef7f9}
      .sub{font:18px Arial,sans-serif;fill:#b6ced9}
      .metric{font:700 18px Arial,sans-serif;fill:#e9f5f6}
      .scale{font:14px Arial,sans-serif;fill:#9cb9c8}
      .arm{font:700 17px Arial,sans-serif;fill:#e6f2f4}
      .value{font:700 18px Arial,sans-serif;fill:#f4f9fa}
      .foot{font:15px Arial,sans-serif;fill:#c3d4dd}
    </style>
  </defs>
  <rect width="1200" height="670" rx="22" fill="url(#bg)"/>
  <text x="64" y="55" class="eyebrow">FIRST RECORDED PILOT</text>
  <text x="64" y="98" class="heading">What the harness observed</text>
  <text x="64" y="126" class="sub">Five synthetic probes · one run per arm · Claude Sonnet</text>
  ${panel(151, 'Grader passes', 5, '5 probes', passed, (n) => `${n}/5`)}
  ${panel(306, 'Total recorded cost', 0.6, '$0.60', cost, (n) => `$${n.toFixed(3)}`)}
  ${panel(461, 'Mean elapsed time', 30, '30 s', seconds, (n) => `${n.toFixed(0)} s`)}
  <rect x="64" y="629" width="8" height="8" rx="2" fill="#e9af80"/>
  <text x="82" y="637" class="foot">* Baseline had the legacy pr-gate skill available. In-sample graders. Descriptive only; no quality claim.</text>
</svg>
`;

if (process.argv.includes('--check')) {
  assert.equal(readFileSync(output, 'utf8'), svg, 'pilot chart is stale; run node evals/render-pilot-chart.mjs');
  console.log('pilot chart matches committed rows');
} else {
  writeFileSync(output, svg);
  console.log(`wrote ${output}`);
}
