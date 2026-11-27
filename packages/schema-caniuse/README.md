# schema-caniuse

**Can I use this JSON Schema with OpenAI, Claude or Gemini?**

[Español](README.es.md)

Every LLM provider accepts a *different subset* of JSON Schema for structured outputs and tool calling. OpenAI strict mode rejects `allOf`. Gemini silently ignores `minLength`. Claude's SDK strips `maximum` before sending. Today every agent framework keeps its own hand-written list of these rules, and the lists drift out of date.

`schema-caniuse` is a **shared, sourced, versioned compatibility database** plus a zero-dependency checker — the same idea as [caniuse](https://caniuse.com) for browsers, applied to LLM schemas.

- Every fact cites the provider's official documentation and a verification date.
- Unknown is reported as **unknown**, never guessed.
- Points to the exact location of each problem with a JSON Pointer.
- Works on plain schemas and on tool lists (MCP `inputSchema`, OpenAI `parameters`, Anthropic `input_schema`), including per-request limits such as Claude's 24 optional parameters.

## Install

```sh
npm install schema-caniuse
```

## CLI

```sh
npx schema-caniuse schema.json                 # all targets
npx schema-caniuse tools.json --target anthropic-strict
npx schema-caniuse schema.json --json --quiet  # for CI
```

```
✖ openai-strict
  ✖ (root)  "additionalProperties" must be set to false
  ✖ /properties/email  Property "email" must be listed in "required"
✔ gemini
  ⚠ /properties/customer/minLength  "minLength" is accepted but not enforced
```

Exit code `1` if any target has an error — drop it into CI to catch broken tool schemas before your users do.

## API

```js
import { check, checkTools, support } from 'schema-caniuse';

support('openai-strict', 'allOf');   // 'unsupported'
support('gemini', 'minLength');      // 'ignored'

const r = check(mySchema, 'openai-strict');
r.ok;      // false
r.issues;  // [{ severity: 'error', path: '/properties/x/allOf', keyword: 'allOf', message: '...' }]

checkTools(mcpServerTools, 'anthropic-strict'); // applies per-request limits across all tools
```

The raw data is importable for frameworks that want to build their own transforms:

```js
import data from 'schema-caniuse/data/targets.json' with { type: 'json' };
```

## Targets

| id | Provider | On unsupported keyword |
|---|---|---|
| `openai-strict` | OpenAI Structured Outputs / strict functions | API error |
| `anthropic-strict` | Claude strict tools / structured outputs | SDK strips it |
| `gemini` | Gemini structured output | silently ignored |

Statuses: `supported` · `ignored` · `stripped` · `unsupported` · `unknown`.

## Contributing data

Providers change constantly. A data correction is the most valuable contribution: edit `data/targets.json`, cite the official source, update `verified`, add a test. See [CONTRIBUTING.md](../../CONTRIBUTING.md).

## Status

`0.1.0` — early. The data covers what each provider documents explicitly as of the `verified` date. Live API verification (calling each provider with test schemas) is on the roadmap.

## License

MIT
