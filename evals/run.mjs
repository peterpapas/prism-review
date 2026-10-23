#!/usr/bin/env node
// Paired behaviour run: the same headless agent, with and without the PRism skill, on each probe.
//
//   node evals/run.mjs                       # claude, arms none+prism, all probes
//   node evals/run.mjs --agent codex         # codex exec instead of claude -p
//   node evals/run.mjs --probes guard-invalid,clean-review --arms prism
//   node evals/run.mjs --model sonnet --runs 3
//   node evals/run.mjs --dry-run             # build workspaces and grade placeholders only
//
// Each cell: copy the fixture into a temp git repo (base = schema + test, head = the two new files),
// run the agent read-only from that directory, save its final output, grade it, check the tree is
// unchanged. Results land in evals/results/<timestamp>-<agent>/ with a summary.md.
// Nothing here is a performance claim; it is a pilot you can read.
import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { copyFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { basename, dirname, join, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { probes as allProbes, buildPrompt } from './probes.mjs';
import { grade } from './graders.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const valuedFlags = new Set(['agent', 'model', 'arms', 'runs', 'probes', 'regrade']);
function parseArgs(argv) {
  const parsed = {};
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--dry-run') { parsed['dry-run'] = true; continue; }
    const key = arg.startsWith('--') ? arg.slice(2) : '';
    if (!valuedFlags.has(key)) throw new Error(`unknown argument: ${arg}`);
    const value = argv[++i];
    if (!value || value.startsWith('--')) throw new Error(`${arg} requires a value`);
    if (parsed[key] !== undefined) throw new Error(`${arg} supplied more than once`);
    parsed[key] = value;
  }
  return parsed;
}
const args = parseArgs(process.argv.slice(2));
const agent = args.agent ?? 'claude';
if (!['claude', 'codex'].includes(agent)) throw new Error('--agent must be claude or codex');
const model = args.model ?? (agent === 'claude' ? 'sonnet' : 'gpt-6.1-sol');
const arms = (args.arms ?? 'none,prism').split(',');
if (!arms.length || new Set(arms).size !== arms.length || arms.some((arm) => !['none', 'prism'].includes(arm))) throw new Error('--arms must list none and/or prism without duplicates');
const runs = Number(args.runs ?? 1);
if (!Number.isSafeInteger(runs) || runs < 1) throw new Error('--runs must be a positive integer');
const requestedProbes = args.probes?.split(',');
if (requestedProbes && (!requestedProbes.length || new Set(requestedProbes).size !== requestedProbes.length || requestedProbes.some((id) => !allProbes.some((probe) => probe.id === id)))) throw new Error('--probes contains an unknown or duplicate probe ID');
const probes = args.probes ? allProbes.filter((p) => args.probes.split(',').includes(p.id)) : allProbes;
const dry = args['dry-run'] === true;
const regrade = args.regrade ?? null; // --regrade evals/results/<dir>
if (regrade && Object.keys(args).some((key) => key !== 'regrade')) throw new Error('--regrade cannot be combined with run options');

const skillDir = join(root, 'skills/prism-review');
const skillText = [
  readFileSync(join(skillDir, 'SKILL.md'), 'utf8'),
  '\n\n<!-- references/lenses.md -->\n',
  readFileSync(join(skillDir, 'references/lenses.md'), 'utf8'),
].join('');

// Files the harness itself puts in the workspace; their contents are checked after the agent runs.
const HARNESS_FILES = ['.prism-skill.md', 'AGENTS.md'];

const resultsRoot = join(root, 'evals/results');
const stamp = regrade ? basename(regrade).replace(/-(claude|codex)$/, '') : `${new Date().toISOString().replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
const outDir = regrade ? resolve(root, regrade) : join(resultsRoot, `${stamp}-${agent}`);
if (regrade) {
  if (!outDir.startsWith(`${resultsRoot}${sep}`) || !existsSync(join(outDir, 'rows.json'))) throw new Error('--regrade must name an existing evals/results run');
} else {
  mkdirSync(outDir, { recursive: false });
}

function sh(cmd, cmdArgs, cwd, extraEnv = {}) {
  const r = spawnSync(cmd, cmdArgs, { cwd, encoding: 'utf8', env: { ...process.env, ...extraEnv }, maxBuffer: 64 * 1024 * 1024 });
  if (r.error) throw r.error;
  return r;
}

/** Build a two-commit git repo from a fixture so "the PR" is HEAD~1...HEAD. Skill text, if any, is untracked. */
function makeWorkspace(probe, arm) {
  // Outside any path that project-scoped hooks or plugins key on.
  const ws = mkdtempSync(join(tmpdir(), 'prism-eval-'));
  try {
    const src = join(root, 'evals', probe.fixture);
    cpSync(src, ws, { recursive: true, filter: (p) => !/PR(_BODY_INJECTED)?\.md$/.test(p) });
    cpSync(join(src, probe.prBody), join(ws, 'PR.md'));
    const git = (...a) => {
      const r = sh('git', a, ws, { GIT_AUTHOR_NAME: 'fixture', GIT_AUTHOR_EMAIL: 'f@x', GIT_COMMITTER_NAME: 'fixture', GIT_COMMITTER_EMAIL: 'f@x', GIT_CONFIG_GLOBAL: '/dev/null' });
      if (r.status !== 0) throw new Error(`git ${a.join(' ')} failed: ${r.stderr}`);
      return r;
    };
    git('init', '-q');
    git('add', 'src/orders/schema.ts', 'spec');
    git('commit', '-q', '-m', 'base: schema and test');
    git('add', '-A');
    git('commit', '-q', '-m', 'head: add createOrder and route');
    if (arm === 'prism') {
      // Claude gets the text as an appended system prompt; Codex reads AGENTS.md from the cwd.
      // Neither is a skill install, and the two are not equivalent treatments. See evals/README.md.
      writeFileSync(join(ws, agent === 'codex' ? 'AGENTS.md' : '.prism-skill.md'), skillText);
    }
    return ws;
  } catch (error) {
    rmSync(ws, { recursive: true, force: true });
    throw error;
  }
}

function runClaude(ws, prompt, arm) {
  const a = ['-p', prompt, '--safe-mode', '--output-format', 'json', '--permission-mode', 'dontAsk',
    // Tool allowlist, not an OS sandbox: a listed git subcommand that takes --output could still write.
    '--allowedTools', 'Read', 'Grep', 'Glob', 'Bash(git diff:*)', 'Bash(git log:*)', 'Bash(git show:*)', 'Bash(git status:*)',
    'Bash(git rev-parse:*)', 'Bash(git ls-tree:*)', 'Bash(git ls-files:*)', 'Bash(git cat-file:*)', 'Bash(cat:*)', 'Bash(ls:*)',
    // No MCP servers from the user's config (they can write into the cwd and add context).
    '--strict-mcp-config', '--mcp-config', '{"mcpServers":{}}'];
  if (model) a.push('--model', model);
  if (arm === 'prism') a.push('--append-system-prompt-file', join(ws, '.prism-skill.md'));
  const r = sh('claude', a, ws);
  let j = {};
  try { j = JSON.parse(r.stdout); } catch { /* keep raw */ }
  return { text: j.result ?? r.stdout, raw: r.stdout, stderr: r.stderr, cost: j.total_cost_usd, turns: j.num_turns, denials: j.permission_denials ?? [], isError: Boolean(j.is_error) || r.status !== 0, authError: j.api_error_status === 401 };
}

function runCodex(ws, prompt, tag) {
  const out = join(outDir, `${tag}.last.md`);
  // A fresh Codex home carries only authentication: no user config, skills, plugins, or MCP servers.
  const isolatedHome = mkdtempSync(join(tmpdir(), 'prism-codex-home-'));
  const authSource = join(process.env.CODEX_HOME ?? join(homedir(), '.codex'), 'auth.json');
  // Read-only sandbox for model shell commands; -o writes one file outside the fixture workspace.
  const a = ['exec', '--sandbox', 'read-only', '--skip-git-repo-check', '--ephemeral', '--ignore-user-config', '--ignore-rules', '-c', 'mcp_servers={}', '-c', 'features.prefer_mxc=true', '-C', ws, '-o', out];
  if (model) a.push('-m', model);
  a.push(prompt);
  try {
    if (!existsSync(authSource)) throw new Error(`Codex login not found at ${authSource}; run codex login first`);
    copyFileSync(authSource, join(isolatedHome, 'auth.json'));
    const r = sh('codex', a, ws, { CODEX_HOME: isolatedHome });
    const text = existsSync(out) ? readFileSync(out, 'utf8') : r.stdout;
    const tokenMatch = r.stderr.match(/tokens used\s+([\d,]+)/i);
    const blocked = /exec_command failed:[^\n]*blocked by policy/i.test(r.stderr);
    // Codex CLI reports aggregate token use but no structured per-tool denial count in this mode.
    return { text, raw: r.stdout, stderr: r.stderr, cost: undefined, turns: undefined, tokens: tokenMatch ? Number(tokenMatch[1].replaceAll(',', '')) : undefined, denials: null, isError: r.status !== 0 || blocked };
  } finally {
    rmSync(out, { force: true });
    rmSync(isolatedHome, { recursive: true, force: true });
  }
}

const rows = [];
if (regrade) {
  // Re-score saved outputs with the current graders; cost, timing, writes and errors come from the saved rows.
  const saved = JSON.parse(readFileSync(join(outDir, 'rows.json'), 'utf8'));
  for (const old of saved) {
    const probe = allProbes.find((p) => p.id === old.probe);
    const text = readFileSync(join(outDir, `${old.probe}.${old.arm}.r${old.run}.md`), 'utf8').replaceAll('\r\n', '\n').split('\n---\n\n').slice(1).join('\n---\n\n');
    const g = grade(probe.id, text, join(root, 'evals', probe.fixture));
    const pass = g.pass && !old.error && old.wrote.length === 0;
    rows.push({ ...old, pass, reasons: [...g.reasons, ...(old.error ? ['agent exited with an error'] : []), ...(old.wrote.length ? [`workspace changed: ${old.wrote.join(', ')}`] : [])], citations: g.citations });
    console.log(`${pass ? 'PASS' : 'FAIL'}  ${old.probe}.${old.arm}.r${old.run}${g.reasons.length ? `\n      ${g.reasons.join('\n      ')}` : ''}`);
  }
}
for (let run = 1; run <= runs && !regrade; run += 1) {
  for (const probe of probes) {
    // Interleave arm order per probe so neither arm always goes first.
    const order = (run + probes.indexOf(probe)) % 2 ? [...arms].reverse() : arms;
    for (const arm of order) {
      const tag = `${probe.id}.${arm}.r${run}`;
      const ws = makeWorkspace(probe, arm);
      try {
        const expectedHarness = new Map(HARNESS_FILES.filter((path) => existsSync(join(ws, path))).map((path) => [path, readFileSync(join(ws, path))]));
        const prompt = buildPrompt(probe);
        let res;
        const t0 = Date.now();
        if (dry) res = { text: `[dry-run] ${tag}`, raw: '', stderr: '', denials: [], isError: false };
        else res = agent === 'codex' ? runCodex(ws, prompt, tag) : runClaude(ws, prompt, arm);
        if (res.authError) throw new Error('Claude authentication failed (HTTP 401); sign in with `claude auth login` before running evaluations');
        const seconds = (Date.now() - t0) / 1000;
        const st = sh('git', ['status', '--porcelain', '--ignored', '--untracked-files=all', '--', '.'], ws, { GIT_CONFIG_GLOBAL: '/dev/null' });
        if (st.status !== 0) throw new Error(`git status failed in ${ws}: ${st.stderr}`);
        const statusLines = st.stdout.trim() ? st.stdout.trim().split('\n') : [];
        const wrote = statusLines.filter((line) => !expectedHarness.has(line.trimEnd().slice(3)));
        for (const [path, original] of expectedHarness) {
          if (!existsSync(join(ws, path)) || !readFileSync(join(ws, path)).equals(original)) wrote.push(`harness file changed: ${path}`);
        }
        const g = grade(probe.id, res.text, join(root, 'evals', probe.fixture));
        const pass = g.pass && !res.isError && wrote.length === 0;
        const reasons = [...g.reasons, ...(res.isError ? ['agent exited with an error'] : []), ...(wrote.length ? [`workspace changed: ${wrote.join(', ')}`] : [])];
        const row = { probe: probe.id, arm, run, pass, reasons, citations: g.citations, cost: res.cost, turns: res.turns, tokens: res.tokens, seconds, denials: res.denials === null ? null : res.denials.length, wrote, error: res.isError };
        rows.push(row);
        writeFileSync(join(outDir, `${tag}.md`), `# ${tag}\n\nprompt:\n\n${prompt}\n\n---\n\n${res.text}\n`);
        if (res.raw) writeFileSync(join(outDir, `${tag}.${agent === 'claude' ? 'raw.json' : 'raw.txt'}`), res.raw);
        if (res.stderr?.trim()) writeFileSync(join(outDir, `${tag}.stderr.txt`), res.stderr);
        console.log(`${pass ? 'PASS' : 'FAIL'}  ${tag.padEnd(34)} ${seconds.toFixed(0)}s${row.cost !== undefined ? `  $${row.cost.toFixed(3)}` : ''}${reasons.length ? `\n      ${reasons.join('\n      ')}` : ''}`);
      } finally {
        rmSync(ws, { recursive: true, force: true });
      }
    }
  }
}

// Summary
if (!rows.length) throw new Error('no run rows were produced');
const summaryArms = ['none', 'prism'].filter((arm) => rows.some((row) => row.arm === arm));
const summaryProbes = allProbes.filter((probe) => rows.some((row) => row.probe === probe.id));
const cellCounts = summaryProbes.flatMap((probe) => summaryArms.map((arm) => new Set(rows.filter((row) => row.probe === probe.id && row.arm === arm).map((row) => row.run)).size));
const runsPerCell = Math.min(...cellCounts) === Math.max(...cellCounts) ? String(cellCounts[0]) : `varies (${Math.min(...cellCounts)}–${Math.max(...cellCounts)})`;
const summaryAgent = regrade ? basename(outDir).match(/-(claude|codex)$/)?.[1] ?? 'unknown' : agent;
const previousHeading = regrade && existsSync(join(outDir, 'summary.md')) ? readFileSync(join(outDir, 'summary.md'), 'utf8').split(/\r?\n/)[0] : '';
const summaryModel = regrade ? previousHeading.match(/ · model ([^\r\n]+)/)?.[1] : model;
const by = (arm) => rows.filter((r) => r.arm === arm);
const sum = (rs, f) => rs.reduce((s, r) => s + (f(r) ?? 0), 0);
const lines = [
  `# PRism behaviour run · ${stamp} · agent ${summaryAgent}${summaryModel ? ` · model ${summaryModel}` : ''}`,
  '',
  dry ? 'Dry run: placeholder outputs only; no agent was called.' : 'Pilot, not a performance claim. Same agent, prompt and fixture per probe; the arms differ in whether the skill text is present.',
  `Arms: ${summaryArms.join(', ')}. Runs per cell: ${runsPerCell}. The final output of every cell sits next to this file (\`<probe>.<arm>.r<n>.md\`); Claude's JSON envelope is in \`.raw.json\`, while Codex's stdout and trace are in \`.raw.txt\` and \`.stderr.txt\`.`,
  '',
  `| Probe | ${summaryArms.join(' | ')} |`,
  `|---|${summaryArms.map(() => '---').join('|')}|`,
  ...summaryProbes.map((p) => `| ${p.id} | ${summaryArms.map((a) => { const rs = rows.filter((r) => r.probe === p.id && r.arm === a); return `${rs.filter((r) => r.pass).length}/${rs.length}`; }).join(' | ')} |`),
  `| **total** | ${summaryArms.map((a) => `**${by(a).filter((r) => r.pass).length}/${by(a).length}**`).join(' | ')} |`,
  '',
  '| Arm | invented citations | workspace changes | tool denials | agent errors | cost (USD) | CLI tokens | mean seconds |',
  '|---|---|---|---|---|---|---|---|',
  ...summaryArms.map((a) => { const rs = by(a); return `| ${a} | ${sum(rs, (r) => r.citations.bad.length)} | ${sum(rs, (r) => r.wrote.length)} | ${rs.some((r) => r.denials === null) ? 'n/a' : sum(rs, (r) => r.denials)} | ${sum(rs, (r) => (r.error ? 1 : 0))} | ${rs.some((r) => r.cost !== undefined) ? sum(rs, (r) => r.cost).toFixed(3) : 'n/a'} | ${rs.some((r) => r.tokens !== undefined) ? sum(rs, (r) => r.tokens).toLocaleString('en-US') : 'n/a'} | ${(sum(rs, (r) => r.seconds) / Math.max(rs.length, 1)).toFixed(0)} |`; }),
  '',
  '## Failures',
  '',
  ...rows.filter((r) => !r.pass).map((r) => `- ${r.probe} · ${r.arm} · r${r.run}: ${r.reasons.join('; ')}`),
  ...(rows.every((r) => r.pass) ? ['- none'] : []),
  '',
  '## What this does and does not show',
  '',
  '- A pass means: the lines about the draft matched the expected call, the lines proposing comments did not contradict it, every `src/…:line` or `spec/…:line` citation exists in the fixture, the agent exited cleanly, and `git status --ignored` showed nothing outside the files the harness wrote. It does not prove the agent traced callers, that a cited line supports the claim, or that writes outside the workspace did not happen.',
  '- Graders are sentence-level pattern matching; read the outputs before trusting a row. `npm test` checks each grader against one good and one bad reference, no more. Re-score a saved run with `node evals/run.mjs --regrade evals/results/<dir>`.',
  '- Isolation: a temp fixture outside the project, no MCP servers, a read-only tool allowlist (Claude, not an OS sandbox) or read-only sandbox (Codex). Claude uses `--safe-mode` in both arms to disable user and project customizations; managed policy may still apply. Codex uses a fresh temporary `CODEX_HOME` containing only a copy of the login file, with user config and rules disabled. Neither arm sees user-installed skills.',
  '- The `prism` arm is the skill text appended to the system prompt (Claude) or written as `AGENTS.md` (Codex). Neither is a skill install, and the two hosts are not an equivalent treatment; compare arms within one host only.',
  '- A tool denial (Claude only; Codex exec reports none) means the agent asked for a command outside the allowlist, usually a compound `git` command, and was refused. Recorded, not scored.',
  '',
];
writeFileSync(join(outDir, 'summary.md'), lines.join('\n'));
writeFileSync(join(outDir, 'rows.json'), JSON.stringify(rows, null, 2));
console.log(`\nwrote ${outDir}/summary.md`);
