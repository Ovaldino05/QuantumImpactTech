#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { check, checkTools, listTargets, version } from '../src/index.js';

const HELP = `schema-caniuse ${version}

Check whether a JSON Schema (or a list of tool definitions) works with LLM providers.

Usage:
  schema-caniuse <file.json> [--target <id>[,<id>...]] [--tools] [--json] [--quiet]
  schema-caniuse --list

Options:
  --target   Target ids (default: all). Known: ${listTargets().join(', ')}
  --tools    Treat the file as an array of tool definitions (or {"tools": [...]})
  --json     Print machine-readable JSON
  --quiet    Hide "info" issues (undocumented keywords)
  --list     List known targets

Exit code is 1 when any target reports an error.`;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

if (flag('--help') || flag('-h') || args.length === 0) {
  console.log(HELP);
  process.exit(args.length === 0 ? 1 : 0);
}
if (flag('--list')) {
  for (const id of listTargets()) console.log(id);
  process.exit(0);
}

const file = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--target');
let input;
try {
  input = JSON.parse(readFileSync(file, 'utf8'));
} catch (e) {
  console.error(`Cannot read JSON from ${file}: ${e.message}`);
  process.exit(2);
}

const ids = (opt('--target') ?? listTargets().join(',')).split(',').map((s) => s.trim());
const asTools = flag('--tools') || Array.isArray(input) || Array.isArray(input?.tools);
const results = ids.map((id) => (asTools ? checkTools(Array.isArray(input) ? input : input.tools, id) : check(input, id)));

if (flag('--quiet')) for (const r of results) r.issues = r.issues.filter((i) => i.severity !== 'info');

if (flag('--json')) {
  console.log(JSON.stringify(results, null, 2));
} else {
  const icon = { error: '✖', warning: '⚠', info: 'ℹ' };
  for (const r of results) {
    console.log(`\n${r.ok ? '✔' : '✖'} ${r.target}`);
    for (const i of r.issues) {
      const where = [i.tool, i.path || '(root)'].filter(Boolean).join(' ');
      console.log(`  ${icon[i.severity]} ${where}  ${i.message}`);
    }
  }
  console.log('');
}

process.exit(results.every((r) => r.ok) ? 0 : 1);
