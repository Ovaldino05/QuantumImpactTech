export type Status = 'supported' | 'ignored' | 'stripped' | 'unsupported' | 'unknown';
export type Severity = 'error' | 'warning' | 'info';

export interface Issue {
  target: string;
  severity: Severity;
  /** JSON Pointer to the offending location ('' = root). */
  path: string;
  keyword: string | null;
  message: string;
  tool?: string | null;
}

export interface Stats {
  objectProperties: number;
  enumValues: number;
  maxDepth: number;
  optionalParameters: number;
  unionParameters: number;
}

export interface CheckResult {
  target: string;
  ok: boolean;
  issues: Issue[];
  stats: Stats;
}

export interface Target {
  name: string;
  provider: string;
  onUnsupported: 'error' | 'strip' | 'ignore';
  verified: string;
  sources: string[];
  rules: Record<string, boolean>;
  limits: Record<string, number>;
  formats?: string[];
  keywords: Record<string, Status>;
}

export const version: string;
export const targets: Record<string, Target>;
export function listTargets(): string[];
export function support(targetId: string, keyword: string): Status;
export function check(schema: object, targetId: string): CheckResult;
export function checkAll(schema: object, targetIds?: string[]): CheckResult[];
export function checkTools(
  tools: object[],
  targetId: string
): { target: string; ok: boolean; issues: Issue[]; tools: (CheckResult & { tool: string })[] };
