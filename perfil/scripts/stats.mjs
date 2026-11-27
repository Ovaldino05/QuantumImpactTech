#!/usr/bin/env node
// Renders a branded "live impact" card with REAL numbers from the GitHub GraphQL
// API and the npm registry. No third-party stats service. Runs in GitHub Actions.
//
//   GITHUB_TOKEN=... node scripts/stats.mjs <outDir> [--user Ovaldino05] [--npm schema-caniuse]
//   node scripts/stats.mjs <outDir> --sample      (renders placeholder values for local preview only)
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const args = process.argv.slice(2);
const outDir = args.find((a) => !a.startsWith('--')) ?? 'dist';
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const user = opt('--user', process.env.USERNAME ?? 'Ovaldino05');
const npmPackages = opt('--npm', 'schema-caniuse').split(',').filter(Boolean);
const sample = args.includes('--sample');

async function gql(query, variables) {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json();
  if (body.errors) throw new Error(JSON.stringify(body.errors));
  return body.data;
}

async function npmDownloads(pkg) {
  const res = await fetch(`https://api.npmjs.org/downloads/point/last-month/${encodeURIComponent(pkg)}`);
  if (!res.ok) return null; // not published yet
  const body = await res.json();
  return typeof body.downloads === 'number' ? body.downloads : null;
}

async function collect() {
  if (sample) {
    return { repos: 0, stars: 0, followers: 0, contributions: 0, externalMerged: 0, downloads: null };
  }
  const d = await gql(
    `query($login: String!, $q: String!) {
      user(login: $login) {
        followers { totalCount }
        repositories(ownerAffiliations: OWNER, isFork: false, privacy: PUBLIC, first: 100) {
          totalCount nodes { stargazerCount }
        }
        contributionsCollection { contributionCalendar { totalContributions } }
      }
      search(query: $q, type: ISSUE, first: 1) { issueCount }
    }`,
    { login: user, q: `is:pr is:merged author:${user} -user:${user}` }
  );
  const u = d.user;
  const dl = await Promise.all(npmPackages.map(npmDownloads));
  const published = dl.filter((x) => x !== null);
  return {
    repos: u.repositories.totalCount,
    stars: u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0),
    followers: u.followers.totalCount,
    contributions: u.contributionsCollection.contributionCalendar.totalContributions,
    externalMerged: d.search.issueCount,
    downloads: published.length ? published.reduce((a, b) => a + b, 0) : null,
  };
}

const THEMES = {
  dark: { bg: '#0F1118', border: '#232634', text: '#FFFFFF', muted: '#9AA3B2', tile: '#141722' },
  light: { bg: '#FFFFFF', border: '#D9DEE8', text: '#0B0D12', muted: '#4B5563', tile: '#F5F7FB' },
};
const FONT = "'Segoe UI','Inter','Helvetica Neue',Arial,sans-serif";
const fmt = (n) => (n === null ? '—' : new Intl.NumberFormat('en-US').format(n));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function render(stats, theme, date) {
  const t = THEMES[theme];
  const tiles = [
    ['Contributions (last year)', fmt(stats.contributions)],
    ['Public repositories', fmt(stats.repos)],
    ['Stars earned', fmt(stats.stars)],
    ['Merged PRs to other projects', fmt(stats.externalMerged)],
    ['npm downloads (last month)', stats.downloads === null ? 'pending' : fmt(stats.downloads)],
    ['Followers', fmt(stats.followers)],
  ];
  const w = 360, h = 92, gap = 16, x0 = 32, y0 = 72;
  const cells = tiles.map(([label, value], i) => {
    const x = x0 + (i % 3) * (w + gap), y = y0 + Math.floor(i / 3) * (h + gap);
    return `<g transform="translate(${x},${y})">
    <rect width="${w}" height="${h}" rx="14" fill="${t.tile}" stroke="${t.border}"/>
    <text x="20" y="52" font-family="${FONT}" font-size="30" font-weight="700" fill="${value === 'pending' ? t.muted : 'url(#a)'}">${esc(value)}</text>
    <text x="20" y="76" font-family="${FONT}" font-size="13" fill="${t.muted}">${esc(label)}</text>
  </g>`;
  }).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="330" viewBox="0 0 1200 330" role="img" aria-labelledby="st">
  <title id="st">Live impact for ${esc(user)}: ${tiles.map(([l, v]) => `${l} ${v}`).join(', ')}</title>
  <defs><linearGradient id="a" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
  <rect x=".5" y=".5" width="1199" height="329" rx="20" fill="${t.bg}" stroke="${t.border}"/>
  <text x="32" y="46" font-family="${FONT}" font-size="13" letter-spacing="3" fill="${t.muted}">LIVE IMPACT  ·  REAL DATA</text>
  ${cells}
  <text x="32" y="310" font-family="${FONT}" font-size="12" fill="${t.muted}">Source: GitHub GraphQL API and npm registry · updated ${esc(date)} UTC</text>
</svg>
`;
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const stats = await collect();
  const date = new Date().toISOString().slice(0, 16).replace('T', ' ');
  mkdirSync(outDir, { recursive: true });
  for (const theme of Object.keys(THEMES)) writeFileSync(join(outDir, `stats-${theme}.svg`), render(stats, theme, date));
  writeFileSync(join(outDir, 'stats.json'), JSON.stringify({ user, date, ...stats }, null, 2));
  console.log(JSON.stringify(stats));
}
