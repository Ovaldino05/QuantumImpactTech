import test from 'node:test';
import assert from 'node:assert/strict';
import { check, checkAll, checkTools, listTargets, support, targets, version } from '../src/index.js';

const strictOk = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: ['integer', 'null'], minimum: 0 },
  },
  required: ['name', 'age'],
  additionalProperties: false,
};

test('exports targets and version', () => {
  assert.match(version, /^\d{4}-\d{2}-\d{2}$/);
  assert.deepEqual(listTargets().sort(), ['anthropic-strict', 'gemini', 'openai-strict']);
  for (const t of Object.values(targets)) {
    assert.ok(t.sources.length > 0, 'every target cites a source');
    assert.match(t.verified, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('support() returns status and defaults to unknown', () => {
  assert.equal(support('openai-strict', 'allOf'), 'unsupported');
  assert.equal(support('gemini', 'minLength'), 'ignored');
  assert.equal(support('anthropic-strict', 'maxLength'), 'stripped');
  assert.equal(support('gemini', 'someMadeUpKeyword'), 'unknown');
  assert.throws(() => support('nope', 'type'), /Unknown target/);
});

test('valid strict schema passes OpenAI', () => {
  const r = check(strictOk, 'openai-strict');
  assert.equal(r.ok, true);
  assert.equal(r.issues.filter((i) => i.severity === 'error').length, 0);
});

test('OpenAI: missing additionalProperties and optional field are errors', () => {
  const r = check({ type: 'object', properties: { a: { type: 'string' } } }, 'openai-strict');
  assert.equal(r.ok, false);
  const kws = r.issues.map((i) => i.keyword);
  assert.ok(kws.includes('additionalProperties'));
  assert.ok(kws.includes('required'));
  assert.equal(r.issues.find((i) => i.keyword === 'required').path, '/properties/a');
});

test('OpenAI: root anyOf and non-object root are errors', () => {
  const r = check({ anyOf: [{ type: 'string' }, { type: 'number' }] }, 'openai-strict');
  assert.ok(r.issues.some((i) => i.message.includes('anyOf')));
  assert.ok(r.issues.some((i) => i.message.includes('type "object"')));
});

test('OpenAI: allOf nested deep is reported with a JSON pointer', () => {
  const schema = {
    ...strictOk,
    properties: { ...strictOk.properties, x: { allOf: [{ type: 'string' }] } },
    required: ['name', 'age', 'x'],
  };
  const r = check(schema, 'openai-strict');
  const issue = r.issues.find((i) => i.keyword === 'allOf');
  assert.equal(issue.severity, 'error');
  assert.equal(issue.path, '/properties/x/allOf');
});

test('OpenAI: unsupported format value is an error', () => {
  const schema = { ...strictOk, properties: { ...strictOk.properties, name: { type: 'string', format: 'uri' } } };
  const r = check(schema, 'openai-strict');
  assert.ok(r.issues.some((i) => i.keyword === 'format' && i.severity === 'error'));
});

test('OpenAI: nesting depth over 10 is an error', () => {
  let node = { type: 'object', properties: {}, required: [], additionalProperties: false };
  const root = node;
  for (let i = 0; i < 11; i++) {
    const child = { type: 'object', properties: {}, required: [], additionalProperties: false };
    node.properties.c = child;
    node.required = ['c'];
    node = child;
  }
  const r = check(root, 'openai-strict');
  assert.equal(r.stats.maxDepth, 12);
  assert.ok(r.issues.some((i) => /levels of object nesting/.test(i.message)));
});

test('OpenAI: enum value limit', () => {
  const big = Array.from({ length: 1001 }, (_, i) => `v${i}`);
  const r = check({ type: 'object', properties: { e: { type: 'string', enum: big } }, required: ['e'], additionalProperties: false }, 'openai-strict');
  assert.equal(r.stats.enumValues, 1001);
  assert.equal(r.ok, false);
});

test('Gemini: ignored keywords are warnings, not errors', () => {
  const r = check({ type: 'object', properties: { s: { type: 'string', minLength: 3 } } }, 'gemini');
  assert.equal(r.ok, true);
  const w = r.issues.find((i) => i.keyword === 'minLength');
  assert.equal(w.severity, 'warning');
  assert.equal(w.path, '/properties/s/minLength');
});

test('Anthropic: stripped constraints warn; additionalProperties required', () => {
  const r = check({ type: 'object', properties: { n: { type: 'number', maximum: 5 } } }, 'anthropic-strict');
  assert.equal(r.ok, false);
  assert.ok(r.issues.some((i) => i.keyword === 'maximum' && i.severity === 'warning'));
  assert.ok(r.issues.some((i) => i.keyword === 'additionalProperties' && i.severity === 'error'));
});

test('undocumented keywords are info only', () => {
  const r = check({ ...strictOk, properties: { ...strictOk.properties, name: { type: 'string', minLength: 1 } } }, 'openai-strict');
  const i = r.issues.find((x) => x.keyword === 'minLength');
  assert.equal(i.severity, 'info');
  assert.equal(r.ok, true);
});

test('checkTools: Anthropic per-request optional-parameter limit across tools', () => {
  const tool = (n) => ({
    name: `t${n}`,
    input_schema: {
      type: 'object',
      additionalProperties: false,
      properties: Object.fromEntries(Array.from({ length: 6 }, (_, i) => [`p${i}`, { type: 'string' }])),
    },
  });
  const ok = checkTools([tool(1), tool(2), tool(3), tool(4)], 'anthropic-strict'); // 24 optional
  assert.equal(ok.ok, true);
  const bad = checkTools([tool(1), tool(2), tool(3), tool(4), tool(5)], 'anthropic-strict'); // 30
  assert.equal(bad.ok, false);
  assert.ok(bad.issues.some((i) => /30 optional parameters/.test(i.message)));
});

test('checkTools understands MCP, OpenAI and Anthropic shapes', () => {
  const s = strictOk;
  const r = checkTools(
    [{ name: 'mcp', inputSchema: s }, { type: 'function', function: { name: 'oa', parameters: s } }, { name: 'an', input_schema: s }],
    'openai-strict'
  );
  assert.deepEqual(r.tools.map((t) => t.tool), ['mcp', 'oa', 'an']);
  assert.equal(r.ok, true);
});

test('checkAll and invalid input', () => {
  assert.equal(checkAll(strictOk).length, listTargets().length);
  assert.equal(check(null, 'gemini').ok, false);
  assert.equal(check([], 'gemini').ok, false);
});

test('boolean subschemas and $defs recursion do not crash', () => {
  const schema = {
    type: 'object',
    properties: { next: { $ref: '#/$defs/node' }, any: true },
    required: ['next', 'any'],
    additionalProperties: false,
    $defs: { node: { type: 'object', properties: { v: { type: 'string' } }, required: ['v'], additionalProperties: false } },
  };
  for (const id of listTargets()) assert.doesNotThrow(() => check(schema, id));
});

test('createApi (browser-safe core) matches the Node entry', async () => {
  const { createApi } = await import('../src/core.js');
  const { readFileSync } = await import('node:fs');
  const api = createApi(JSON.parse(readFileSync(new URL('../data/targets.json', import.meta.url), 'utf8')));
  assert.deepEqual(api.listTargets(), listTargets());
  assert.deepEqual(api.check(strictOk, 'gemini'), check(strictOk, 'gemini'));
});
