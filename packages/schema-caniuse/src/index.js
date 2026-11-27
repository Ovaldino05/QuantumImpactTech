import { readFileSync } from 'node:fs';
import { createApi } from './core.js';

const data = JSON.parse(readFileSync(new URL('../data/targets.json', import.meta.url), 'utf8'));
const api = createApi(data);

/** Dataset version (date the data was last reviewed). */
export const version = api.version;
/** Raw compatibility data, keyed by target id. */
export const targets = api.targets;
export const { listTargets, support, check, checkAll, checkTools } = api;
export { createApi };
