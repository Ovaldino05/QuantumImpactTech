import { createApi } from './lib/core.js';

const OWNER = 'Ovaldino05';
const REPO = 'QuantumImpactTech';
const NPM = 'schema-caniuse';
const GH = 'https://api.github.com';

/* ---------- i18n ---------- */
const ES = {
  skip: 'Saltar al contenido',
  'nav.about': 'Sobre mí', 'nav.projects': 'Proyectos', 'nav.playground': 'Playground', 'nav.impact': 'Impacto',
  'nav.roadmap': 'Hoja de ruta', 'nav.blog': 'Blog', 'nav.contact': 'Contacto',
  'hero.eyebrow': 'QuantumImpactTech · Iniciativa de código abierto',
  'hero.lead': 'Construyo infraestructura abierta y verificable donde se cruzan la IA, el software y las finanzas, empezando por herramientas que todo desarrollador que trabaja con LLMs necesita y nadie quiere mantener solo.',
  'hero.try': 'Probar schema-caniuse', 'hero.code': 'Ver el código', 'hero.follow': 'Seguir en GitHub',
  'about.eyebrow': 'Sobre mí', 'about.title': 'Estudiante. Constructor. Finanzas y software.',
  'about.edu': 'Formación', 'about.edu.p': 'Estudiante de primer año de Desarrollo de Aplicaciones Tecnológicas.',
  'about.bg': 'Trayectoria', 'about.bg.h': 'Administración financiera',
  'about.bg.p': 'Formación académica previa en administración financiera; por eso me importan la exactitud, el riesgo y la trazabilidad en el software.',
  'about.focus': 'Enfoque', 'about.focus.h': 'Herramientas de IA para desarrolladores',
  'about.focus.p': 'Bibliotecas pequeñas, con fuentes y probadas. Cada afirmación enlaza a una fuente; cada métrica de este sitio se consulta en vivo.',
  'projects.eyebrow': 'Proyectos', 'projects.title': 'Centro de proyectos',
  'projects.sub': 'QuantumImpactTech es una iniciativa de código abierto, no una empresa. Cada proyecto incluye pruebas, política de seguridad y hoja de ruta pública.',
  'projects.flag': 'Insignia · v0.1.0',
  'projects.sc.p': '¿Puedo usar este JSON Schema con OpenAI, Claude o Gemini? Cada proveedor acepta un subconjunto distinto y cada framework mantiene su propia lista desactualizada. schema-caniuse es un solo conjunto de datos compartido, con fuentes y versionado, más un verificador y una CLI sin dependencias.',
  'projects.src': 'Código', 'projects.docs': 'Documentación', 'projects.demo': 'Demo en vivo', 'projects.contrib': 'Contribuir',
  'projects.npm': 'Paquete npm: publicación pendiente.',
  'projects.research': 'Investigación',
  'projects.sfep.p': 'SDK abierto para la Factura Electrónica de Panamá (SFEP, DGI). El código empieza solo después de estudiar y resumir la ficha técnica oficial.',
  'projects.track': 'Ver avance', 'projects.devhub': 'Centro de desarrolladores', 'projects.devhub.h': 'Contribuye en 10 minutos',
  'projects.devhub.p': 'Corrige un dato de un proveedor: edita un JSON, cita la documentación oficial y agrega una prueba. Es una contribución real y fusionable.',
  'projects.guide': 'Guía de contribución', 'projects.sec': 'Seguridad', 'projects.sec.h': 'Seguro por defecto',
  'projects.sec.p': 'OpenSSF Scorecard, Dependabot, reporte privado de vulnerabilidades y publicación en npm sin tokens mediante OIDC.',
  'projects.policy': 'Política de seguridad',
  'play.eyebrow': 'Interactivo', 'play.title': 'Playground de schema-caniuse',
  'play.sub': 'Pega un JSON Schema o una lista de herramientas (MCP, OpenAI o Anthropic). Ejecuta la biblioteca real en tu navegador; no se sube nada.',
  'play.input': 'Tu esquema', 'play.run': 'Verificar compatibilidad', 'play.output': 'Resultados',
  'impact.eyebrow': 'Panel de impacto', 'impact.title': 'Números reales, consultados en vivo',
  'impact.sub': 'Obtenidos de las APIs públicas de GitHub y npm al abrir esta página. Nada aquí es estimado.',
  'impact.goals': 'Metas a 12 meses', 'impact.goals.note': 'Objetivos, no resultados. Una meta solo se marca cumplida con evidencia pública.',
  'roadmap.eyebrow': 'Hoja de ruta pública', 'roadmap.title': 'Lo que sigue', 'roadmap.sub': 'Cargado en vivo desde los milestones e issues de GitHub.',
  'roadmap.full': 'Hoja de ruta completa →',
  'contrib.eyebrow': 'Código abierto', 'contrib.title': 'Contribuciones',
  'contrib.sub': 'Pull requests fusionados en proyectos que no son míos. La lista empieza vacía y crece solo con trabajo real y revisado.',
  'blog.eyebrow': 'Blog', 'blog.title': 'Artículos',
  'blog.p1.h': 'Tu esquema funciona en Claude. ¿Funcionará en Gemini?',
  'blog.p1.p': 'Por qué la compatibilidad de JSON Schema entre LLMs necesita una base de datos compartida y con fuentes.',
  'contact.eyebrow': 'Contacto', 'contact.title': 'Construyamos juntos',
  'contact.sub': 'La mejor forma de contactarme es GitHub: abre un issue, propone una corrección de datos o saluda.',
  'contact.issue': 'Abrir un issue',
  footer: '© 2026 Ovaldino Palacio · QuantumImpactTech es una iniciativa de código abierto, no una empresa registrada. Código bajo MIT. Partes de este sitio y sus proyectos se escribieron con asistencia de IA y fueron revisadas por el autor.',
};
const UI = {
  en: { phrases: ['Open infrastructure for AI developers', 'Fintech · Developer tooling · Security', 'Built in Panama. Made for the world.'],
    ok: 'compatible', none: 'No issues.', invalid: 'Invalid JSON', loading: 'Loading…', offline: 'Could not reach the API right now (rate limit or offline).',
    stats: ['Stars', 'Forks', 'Open issues', 'Contributors', 'npm downloads (last month)', 'Merged PRs to other projects'],
    pending: 'not yet published', goal: 'Goal', target: 'Target', current: 'Current', progress: 'Progress',
    goals: ['Monthly npm downloads', 'Merged PRs to other projects (12 mo)', 'External contributors (one repo)', 'Dependent repositories', 'OpenSSF Criticality Score'],
    noExternal: 'No merged external pull requests yet. The first ones are in preparation.', due: 'due', open: 'open', data: 'Data version' },
  es: { phrases: ['Infraestructura abierta para desarrolladores de IA', 'Fintech · Herramientas · Seguridad', 'Hecho en Panamá. Para el mundo.'],
    ok: 'compatible', none: 'Sin problemas.', invalid: 'JSON inválido', loading: 'Cargando…', offline: 'No se pudo consultar la API ahora (límite de uso o sin conexión).',
    stats: ['Estrellas', 'Forks', 'Issues abiertos', 'Colaboradores', 'Descargas npm (último mes)', 'PRs fusionados en otros proyectos'],
    pending: 'aún no publicado', goal: 'Meta', target: 'Objetivo', current: 'Actual', progress: 'Progreso',
    goals: ['Descargas mensuales en npm', 'PRs fusionados en otros proyectos (12 meses)', 'Colaboradores externos (un repo)', 'Repositorios dependientes', 'OpenSSF Criticality Score'],
    noExternal: 'Aún no hay pull requests externos fusionados. Los primeros están en preparación.', due: 'vence', open: 'abiertos', data: 'Versión de datos' },
};

const params = new URLSearchParams(location.search);
let lang = params.get('lang') === 'es' ? 'es' : (safeGet('lang') === 'es' ? 'es' : 'en');
const EN = {};
document.querySelectorAll('[data-i18n]').forEach((el) => { EN[el.dataset.i18n] = el.textContent; });

function safeGet(k) { try { return localStorage.getItem(k); } catch { return null; } }
function safeSet(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } }

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const v = lang === 'es' ? ES[el.dataset.i18n] : EN[el.dataset.i18n];
    if (v) el.textContent = v;
  });
  const b = document.getElementById('lang');
  b.textContent = lang === 'es' ? 'EN' : 'ES';
  b.setAttribute('aria-label', lang === 'es' ? 'Switch to English' : 'Cambiar a español');
  renderGoals(lastStats);
  renderStats(lastStats);
  renderExternal(lastStats);
  runCheck();
}
document.getElementById('lang').addEventListener('click', () => { lang = lang === 'es' ? 'en' : 'es'; safeSet('lang', lang); applyLang(); });
document.getElementById('theme').addEventListener('click', () => {
  const t = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  document.documentElement.dataset.theme = t; safeSet('theme', t);
});

/* ---------- typing ---------- */
const typedEl = document.getElementById('typed');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
(async function type() {
  let i = 0;
  if (reduce) { typedEl.textContent = UI[lang].phrases[0]; return; }
  for (;;) {
    const p = UI[lang].phrases[i++ % UI[lang].phrases.length];
    for (let n = 0; n <= p.length; n++) { typedEl.textContent = p.slice(0, n); await sleep(42); }
    await sleep(1800);
    for (let n = p.length; n >= 0; n--) { typedEl.textContent = p.slice(0, n); await sleep(16); }
    await sleep(250);
  }
})();
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

/* ---------- reveal ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && e.target.classList.add('in')), { threshold: .08 }) : null;
document.querySelectorAll('.reveal').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));

/* ---------- playground ---------- */
const SAMPLE = {
  type: 'object',
  properties: {
    customer: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    total: { type: 'number', minimum: 0 },
    tags: { type: 'array', items: { type: 'string' }, uniqueItems: true },
    discount: { allOf: [{ type: 'number' }, { maximum: 50 }] },
  },
  required: ['customer', 'total'],
};
let api = null;
const schemaEl = document.getElementById('schema');
const resultsEl = document.getElementById('results');
const targetsEl = document.getElementById('targets');
schemaEl.value = JSON.stringify(SAMPLE, null, 2);

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

function runCheck() {
  if (!api) return;
  let input;
  try { input = JSON.parse(schemaEl.value); } catch (e) {
    resultsEl.innerHTML = `<span class="sev-error">${UI[lang].invalid}: ${esc(e.message)}</span>`; return;
  }
  const ids = [...targetsEl.querySelectorAll('input:checked')].map((i) => i.value);
  const tools = Array.isArray(input) ? input : Array.isArray(input?.tools) ? input.tools : null;
  const icon = { error: '✖', warning: '⚠', info: 'ℹ' };
  resultsEl.innerHTML = ids.map((id) => {
    const r = tools ? api.checkTools(tools, id) : api.check(input, id);
    const rows = r.issues.map((i) => `<div class="sev-${i.severity}">${icon[i.severity]} <span class="path">${esc([i.tool, i.path || '(root)'].filter(Boolean).join(' '))}</span> ${esc(i.message)}</div>`).join('');
    return `<h4 class="${r.ok ? 'ok' : 'sev-error'}">${r.ok ? '✔' : '✖'} ${esc(id)}</h4>${rows || `<div class="ok">${UI[lang].none}</div>`}`;
  }).join('');
}

fetch('lib/targets.json').then((r) => r.json()).then((data) => {
  api = createApi(data);
  targetsEl.innerHTML = api.listTargets().map((id) =>
    `<label><input type="checkbox" value="${esc(id)}" checked> ${esc(id)}</label>`).join('');
  document.getElementById('dataver').textContent = `${UI[lang].data}: ${data.version}`;
  targetsEl.addEventListener('change', runCheck);
  runCheck();
}).catch(() => { resultsEl.textContent = UI[lang].offline; });
document.getElementById('run').addEventListener('click', runCheck);
let t;
schemaEl.addEventListener('input', () => { clearTimeout(t); t = setTimeout(runCheck, 400); });

/* ---------- impact ---------- */
let lastStats = null;
async function getJSON(url) { const r = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } }); if (!r.ok) throw new Error(r.status); return r.json(); }

async function loadStats() {
  const s = { stars: null, forks: null, issues: null, contributors: null, downloads: null, external: null, externalItems: [], ok: true };
  try {
    const repo = await getJSON(`${GH}/repos/${OWNER}/${REPO}`);
    s.stars = repo.stargazers_count; s.forks = repo.forks_count; s.issues = repo.open_issues_count;
    const contrib = await getJSON(`${GH}/repos/${OWNER}/${REPO}/contributors?per_page=100&anon=1`);
    s.contributors = contrib.length;
    const ext = await getJSON(`${GH}/search/issues?q=${encodeURIComponent(`is:pr is:merged author:${OWNER} -user:${OWNER}`)}&per_page=10`);
    s.external = ext.total_count; s.externalItems = ext.items;
  } catch { s.ok = false; }
  try {
    const r = await fetch(`https://api.npmjs.org/downloads/point/last-month/${NPM}`);
    if (r.ok) { const d = await r.json(); s.downloads = d.downloads; }
  } catch { /* npm unreachable */ }
  lastStats = s; renderStats(s); renderGoals(s); renderExternal(s);
  if (s.downloads !== null) document.getElementById('npm-note').innerHTML = `<a href="https://www.npmjs.com/package/${NPM}">npmjs.com/package/${NPM}</a>`;
}

function fmt(n) { return n === null || n === undefined ? '—' : new Intl.NumberFormat(lang).format(n); }

function renderStats(s) {
  const el = document.getElementById('stats');
  if (!s) { el.innerHTML = `<div class="card label">${UI[lang].loading}</div>`; return; }
  const L = UI[lang].stats;
  const vals = [s.stars, s.forks, s.issues, s.contributors, s.downloads, s.external];
  el.innerHTML = vals.map((v, i) => {
    const pending = i === 4 && v === null;
    return `<div class="card"><div class="stat ${pending ? 'pending' : 'grad'}">${pending ? UI[lang].pending : fmt(v)}</div><div class="label">${L[i]}</div></div>`;
  }).join('') + (s.ok ? '' : `<p class="note">${UI[lang].offline}</p>`);
}

function renderGoals(s) {
  const U = UI[lang];
  const rows = [
    [U.goals[0], 200000, s?.downloads ?? 0, `https://www.npmjs.com/package/${NPM}`],
    [U.goals[1], 100, s?.external ?? 0, `https://github.com/search?q=is%3Apr+is%3Amerged+author%3A${OWNER}+-user%3A${OWNER}&type=pullrequests`],
    [U.goals[2], 20, Math.max(0, (s?.contributors ?? 1) - 1), `https://github.com/${OWNER}/${REPO}/graphs/contributors`],
    [U.goals[3], 500, null, `https://deps.dev/npm/${NPM}`],
    [U.goals[4], 0.4, null, 'https://github.com/ossf/criticality_score'],
  ];
  document.getElementById('goals').innerHTML =
    `<thead><tr><th>${U.goal}</th><th>${U.target}</th><th>${U.current}</th><th>${U.progress}</th></tr></thead><tbody>` +
    rows.map(([g, target, cur, link]) => {
      const pct = cur === null ? 0 : Math.min(100, (cur / target) * 100);
      return `<tr><td>${esc(g)}</td><td>${fmt(target)}</td><td><a href="${link}">${cur === null ? '—' : fmt(cur)}</a></td>
      <td><div class="bar-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct.toFixed(1)}"><div class="bar-fill" style="width:${pct}%"></div></div></td></tr>`;
    }).join('') + '</tbody>';
}

function renderExternal(s) {
  const el = document.getElementById('external');
  if (!s || !s.externalItems.length) { el.innerHTML = `<p class="label" style="margin:0">${UI[lang].noExternal}</p>`; return; }
  el.innerHTML = s.externalItems.map((pr) => {
    const repo = pr.repository_url.split('/repos/')[1];
    return `<div class="issue"><span class="tag live">merged</span><a href="${pr.html_url}">${esc(repo)} — ${esc(pr.title)}</a></div>`;
  }).join('');
}

/* ---------- roadmap ---------- */
async function loadRoadmap() {
  const el = document.getElementById('milestones');
  try {
    const [ms, issues] = await Promise.all([
      getJSON(`${GH}/repos/${OWNER}/${REPO}/milestones?state=open&sort=due_on`),
      getJSON(`${GH}/repos/${OWNER}/${REPO}/issues?state=open&per_page=50`),
    ]);
    el.innerHTML = ms.map((m) => {
      const its = issues.filter((i) => !i.pull_request && i.milestone && i.milestone.number === m.number);
      return `<div class="card"><span class="tag">${UI[lang].due} ${esc((m.due_on || '').slice(0, 10))}</span><h3>${esc(m.title)}</h3>
        ${its.map((i) => `<div class="issue"><span class="label">#${i.number}</span><a href="${i.html_url}">${esc(i.title)}</a></div>`).join('')}</div>`;
    }).join('') || `<p class="label">—</p>`;
  } catch { el.innerHTML = `<p class="note">${UI[lang].offline}</p>`; }
}

renderStats(null);
renderGoals(null);
applyLang();
loadStats();
loadRoadmap();
