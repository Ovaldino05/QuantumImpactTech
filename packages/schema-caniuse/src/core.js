// Pure core: no Node APIs, runs in browsers, Deno, Bun and Node.
/**
 * Build the API from a compatibility dataset (data/targets.json).
 * @param {{version: string, targets: object}} data
 */
export function createApi(data) {
const targets = data.targets;
const version = data.version;
/** Keywords that only annotate a schema and never affect validation. */
const ANNOTATIONS = new Set(['title', 'description', '$comment', 'examples', '$schema', '$id']);

/** Keywords whose value is a map of name -> subschema. */
const SCHEMA_MAPS = ['properties', 'patternProperties', '$defs', 'definitions', 'dependentSchemas'];
/** Keywords whose value is a single subschema. */
const SCHEMA_SINGLE = ['not', 'if', 'then', 'else', 'contains', 'propertyNames'];
/** Keywords whose value is an array of subschemas. */
const SCHEMA_ARRAYS = ['anyOf', 'oneOf', 'allOf', 'prefixItems'];

/** @returns {string[]} ids of all known targets. */
function listTargets() {
  return Object.keys(targets);
}

/**
 * Look up how a target treats a JSON Schema keyword.
 * @param {string} targetId
 * @param {string} keyword
 * @returns {'supported'|'ignored'|'stripped'|'unsupported'|'unknown'}
 */
function support(targetId, keyword) {
  const t = getTarget(targetId);
  return t.keywords[keyword] ?? 'unknown';
}

function getTarget(targetId) {
  const t = targets[targetId];
  if (!t) {
    throw new Error(`Unknown target "${targetId}". Known: ${listTargets().join(', ')}`);
  }
  return t;
}

function pointer(path) {
  return path.length === 0
    ? ''
    : '/' + path.map((p) => String(p).replace(/~/g, '~0').replace(/\//g, '~1')).join('/');
}

function isObjectSchema(node) {
  const t = node.type;
  return t === 'object' || (Array.isArray(t) && t.includes('object')) || (t === undefined && 'properties' in node);
}

function isUnion(node) {
  return Array.isArray(node.anyOf) || (Array.isArray(node.type) && node.type.length > 1);
}

function severityFor(status, onUnsupported) {
  if (status === 'unsupported') return onUnsupported === 'error' ? 'error' : 'warning';
  if (status === 'ignored' || status === 'stripped') return 'warning';
  if (status === 'unknown') return 'info';
  return null;
}

const MESSAGES = {
  unsupported: 'is not supported',
  ignored: 'is accepted but not enforced',
  stripped: 'is removed by the official SDK before sending',
  unknown: 'is not documented by the provider',
};

/**
 * Check a JSON Schema against one target.
 * @param {object} schema
 * @param {string} targetId
 * @returns {{target: string, ok: boolean, issues: Issue[], stats: Stats}}
 */
function check(schema, targetId) {
  const t = getTarget(targetId);
  const issues = [];
  const stats = { objectProperties: 0, enumValues: 0, maxDepth: 0, optionalParameters: 0, unionParameters: 0 };
  const add = (severity, path, keyword, message) =>
    issues.push({ target: targetId, severity, path: pointer(path), keyword, message });

  if (schema === null || typeof schema !== 'object' || Array.isArray(schema)) {
    add('error', [], null, 'Schema must be a JSON object');
    return { target: targetId, ok: false, issues, stats };
  }

  if (t.rules.rootMustBeObject && !isObjectSchema(schema)) {
    add('error', [], 'type', 'Root schema must be of type "object"');
  }
  if (t.rules.rootAnyOfForbidden && Array.isArray(schema.anyOf)) {
    add('error', [], 'anyOf', 'Root schema must not use "anyOf"');
  }

  walk(schema, [], 0, false);

  for (const [limit, stat, label] of [
    ['maxObjectProperties', 'objectProperties', 'object properties'],
    ['maxEnumValues', 'enumValues', 'enum values'],
    ['maxNestingDepth', 'maxDepth', 'levels of object nesting'],
    ['maxOptionalParametersPerRequest', 'optionalParameters', 'optional parameters'],
    ['maxUnionParametersPerRequest', 'unionParameters', 'union-typed parameters'],
  ]) {
    const max = t.limits[limit];
    if (max !== undefined && stats[stat] > max) {
      add('error', [], null, `Schema has ${stats[stat]} ${label}; limit is ${max}`);
    }
  }

  return { target: targetId, ok: !issues.some((i) => i.severity === 'error'), issues, stats };

  function walk(node, path, depth, isProperty) {
    if (typeof node !== 'object' || node === null) return; // boolean schemas
    const objectLike = isObjectSchema(node);
    const d = objectLike ? depth + 1 : depth;
    if (d > stats.maxDepth) stats.maxDepth = d;
    if (isProperty && isUnion(node)) stats.unionParameters++;

    for (const key of Object.keys(node)) {
      if (ANNOTATIONS.has(key)) continue;
      const status = t.keywords[key] ?? 'unknown';
      const sev = severityFor(status, t.onUnsupported);
      if (sev) add(sev, [...path, key], key, `"${key}" ${MESSAGES[status]} by ${t.name}`);
    }

    if (typeof node.format === 'string' && t.formats && !t.formats.includes(node.format)) {
      add(t.onUnsupported === 'error' ? 'error' : 'warning', [...path, 'format'], 'format',
        `format "${node.format}" is not in the supported list: ${t.formats.join(', ')}`);
    }
    if (Array.isArray(node.enum)) stats.enumValues += node.enum.length;

    if (objectLike) {
      const props = node.properties && typeof node.properties === 'object' ? Object.keys(node.properties) : [];
      const required = Array.isArray(node.required) ? node.required : [];
      stats.objectProperties += props.length;
      stats.optionalParameters += props.filter((p) => !required.includes(p)).length;
      if (t.rules.additionalPropertiesMustBeFalse && node.additionalProperties !== false) {
        add('error', path, 'additionalProperties', '"additionalProperties" must be set to false');
      }
      if (t.rules.allPropertiesRequired) {
        for (const p of props) {
          if (!required.includes(p)) {
            add('error', [...path, 'properties', p], 'required',
              `Property "${p}" must be listed in "required" (use a null union to make it optional)`);
          }
        }
      }
    }

    for (const k of SCHEMA_MAPS) {
      if (node[k] && typeof node[k] === 'object') {
        for (const [name, sub] of Object.entries(node[k])) walk(sub, [...path, k, name], d, k === 'properties');
      }
    }
    for (const k of SCHEMA_SINGLE) if (node[k]) walk(node[k], [...path, k], d, false);
    for (const k of SCHEMA_ARRAYS) {
      if (Array.isArray(node[k])) node[k].forEach((sub, i) => walk(sub, [...path, k, i], d, false));
    }
    if (Array.isArray(node.items)) node.items.forEach((sub, i) => walk(sub, [...path, 'items', i], d, false));
    else if (node.items) walk(node.items, [...path, 'items'], d, false);
    if (node.additionalProperties && typeof node.additionalProperties === 'object') {
      walk(node.additionalProperties, [...path, 'additionalProperties'], d, false);
    }
  }
}

/**
 * Check a schema against several targets (defaults to all).
 * @param {object} schema
 * @param {string[]} [targetIds]
 */
function checkAll(schema, targetIds = listTargets()) {
  return targetIds.map((id) => check(schema, id));
}

/**
 * Check a list of tool definitions (MCP `inputSchema`, OpenAI `parameters`,
 * Anthropic `input_schema`) and apply per-request limits across all tools.
 * @param {object[]} tools
 * @param {string} targetId
 */
function checkTools(tools, targetId) {
  const t = getTarget(targetId);
  const results = tools.map((tool, i) => {
    const fn = tool.function ?? tool;
    const schema = fn.inputSchema ?? fn.input_schema ?? fn.parameters ?? { type: 'object', properties: {} };
    const r = check(schema, targetId);
    const name = fn.name ?? `#${i}`;
    r.issues = r.issues
      .filter((x) => !/^Schema has \d+ (optional|union)/.test(x.message))
      .map((x) => ({ ...x, tool: name }));
    return { tool: name, ...r };
  });
  const issues = results.flatMap((r) => r.issues);
  const total = (k) => results.reduce((s, r) => s + r.stats[k], 0);
  const limits = [
    ['maxStrictToolsPerRequest', tools.length, 'tools'],
    ['maxOptionalParametersPerRequest', total('optionalParameters'), 'optional parameters across all tools'],
    ['maxUnionParametersPerRequest', total('unionParameters'), 'union-typed parameters across all tools'],
  ];
  for (const [limit, value, label] of limits) {
    const max = t.limits[limit];
    if (max !== undefined && value > max) {
      issues.push({ target: targetId, severity: 'error', path: '', keyword: null, tool: null,
        message: `Request has ${value} ${label}; limit is ${max}` });
    }
  }
  return { target: targetId, ok: !issues.some((i) => i.severity === 'error'), issues, tools: results };
}

return { version, targets, listTargets, support, check, checkAll, checkTools };
}
