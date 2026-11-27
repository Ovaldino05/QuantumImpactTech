"""Generate the profile banners and the schema-caniuse feature card (dark + light).

Run:  python3 brand/generate.py
Output: perfil/assets/*.svg  (pure SVG + SMIL, renders inside GitHub <img>)
"""
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "perfil" / "assets"
FONT = "'Segoe UI', 'Inter', 'Helvetica Neue', Arial, sans-serif"
MONO = "'Cascadia Code', 'JetBrains Mono', 'SFMono-Regular', Consolas, monospace"

THEMES = {
    "dark": dict(err="#F87171", warn="#FBBF24", ok="#34D399", bg1="#07080C", bg2="#11131C", grid="#FFFFFF", grid_op=".035", text="#FFFFFF",
                 muted="#9AA3B2", line="#FFFFFF", line_op=".10", card="#0F1118", border="#232634"),
    "light": dict(err="#DC2626", warn="#B45309", ok="#047857", bg1="#FFFFFF", bg2="#EEF1F8", grid="#0B0D12", grid_op=".05", text="#0B0D12",
                  muted="#4B5563", line="#0B0D12", line_op=".10", card="#FFFFFF", border="#D9DEE8"),
}

PHRASES = [
    "Open infrastructure for AI developers",
    "Fintech  ·  Developer tooling  ·  Security",
    "Built in Panama. Made for the world.",
]
CHAR_W = 13.8  # monospace advance (0.6em) at 24px; textLength pins exact width
CYCLE = 12.0   # seconds for the whole typing loop


def typing(t, x, y):
    n = len(PHRASES)
    slot = 1 / n
    out = []
    for i, p in enumerate(PHRASES):
        w = round(len(p) * CHAR_W)
        a = i * slot
        # appear, type (30% of slot), hold, erase quickly, hidden
        k = [0, a, a + slot * .30, a + slot * .85, a + slot * .95, 1]
        k = [round(min(max(v, 0), 1), 4) for v in k]
        # keyTimes must be strictly non-decreasing and start/end at 0/1
        kt = ";".join(str(v) for v in k)
        widths = f"0;0;{w + 8};{w + 8};0;0"
        xs = ";".join(str(x + v) for v in (0, 0, w + 6, w + 6, 0, 0))
        vis_k = f"0;{k[1]};{k[4]};1" if i else f"0;{k[4]};1"
        vis_v = "0;1;0;0" if i else "1;0;0"
        out.append(f'''
    <clipPath id="clip{i}"><rect x="{x}" y="{y - 26}" height="36" width="{w + 8 if i == 0 else 0}">
      <animate attributeName="width" values="{widths}" keyTimes="{kt}" dur="{CYCLE}s" repeatCount="indefinite"/>
    </rect></clipPath>
    <g opacity="{1 if i == 0 else 0}">
      <animate attributeName="opacity" values="{vis_v}" keyTimes="{vis_k}" dur="{CYCLE}s" calcMode="discrete" repeatCount="indefinite"/>
      <text x="{x}" y="{y}" clip-path="url(#clip{i})" font-family="{MONO}" font-size="24" fill="url(#accent)"
            textLength="{w}" lengthAdjust="spacingAndGlyphs">{p}</text>
      <rect y="{y - 22}" width="3" height="28" fill="{t['text']}" x="{x + (w + 6 if i == 0 else 0)}">
        <animate attributeName="x" values="{xs}" keyTimes="{kt}" dur="{CYCLE}s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
      </rect>
    </g>''')
    return "".join(out)


def network(t):
    nodes = [(820, 70), (905, 120), (990, 75), (1070, 140), (960, 200), (870, 250), (1050, 260), (1130, 210), (780, 180)]
    edges = [(0, 1), (1, 2), (2, 3), (1, 4), (4, 5), (4, 6), (3, 7), (6, 7), (0, 8), (8, 5), (3, 4)]
    s = []
    for a, b in edges:
        (x1, y1), (x2, y2) = nodes[a], nodes[b]
        s.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{t["line"]}" stroke-opacity="{t["line_op"]}" stroke-width="1.2"/>')
    for i, (x, y) in enumerate(nodes):
        d = 3 + (i % 3)
        s.append(f'''<circle cx="{x}" cy="{y}" r="{3 + i % 2}" fill="url(#accent)">
      <animate attributeName="opacity" values=".35;1;.35" dur="{d}s" begin="{i * .4}s" repeatCount="indefinite"/></circle>''')
    # a packet travelling along the graph
    s.append(f'''<circle r="3.5" fill="{t['text']}">
      <animateMotion dur="7s" repeatCount="indefinite" path="M820,70 L905,120 L960,200 L1050,260 L1130,210 L1070,140 L990,75"/>
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.9;1" dur="7s" repeatCount="indefinite"/></circle>''')
    return "\n    ".join(s)


def banner(name, t):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="320" viewBox="0 0 1200 320" role="img" aria-labelledby="title desc">
  <title id="title">Ovaldino Palacio — QuantumImpactTech</title>
  <desc id="desc">Open infrastructure for AI developers. Fintech, developer tooling and security. Built in Panama, made for the world.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{t['bg1']}"/><stop offset="1" stop-color="{t['bg2']}"/></linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient>
    <radialGradient id="glowB"><stop offset="0" stop-color="#3B82F6" stop-opacity=".45"/><stop offset="1" stop-color="#3B82F6" stop-opacity="0"/></radialGradient>
    <radialGradient id="glowV"><stop offset="0" stop-color="#8B5CF6" stop-opacity=".40"/><stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="{t['grid']}" stroke-opacity="{t['grid_op']}"/></pattern>
    <clipPath id="frame"><rect width="1200" height="320" rx="20"/></clipPath>
  </defs>
  <g clip-path="url(#frame)">
    <rect width="1200" height="320" fill="url(#bg)"/>
    <rect width="1200" height="320" fill="url(#grid)"/>
    <circle cx="980" cy="120" r="260" fill="url(#glowV)"><animate attributeName="r" values="240;280;240" dur="9s" repeatCount="indefinite"/></circle>
    <circle cx="760" cy="300" r="220" fill="url(#glowB)"><animate attributeName="r" values="230;190;230" dur="11s" repeatCount="indefinite"/></circle>
    {network(t)}
    <rect x="0" y="0" width="1200" height="2" fill="url(#accent)" opacity=".9"/>
    <rect x="0" y="-60" width="1200" height="60" fill="{t['text']}" opacity=".025">
      <animate attributeName="y" values="-60;320" dur="8s" repeatCount="indefinite"/></rect>
  </g>
  <text x="64" y="84" font-family="{MONO}" font-size="14" letter-spacing="3" fill="{t['muted']}">QUANTUMIMPACTTECH  ·  OPEN SOURCE INITIATIVE</text>
  <text x="62" y="160" font-family="{FONT}" font-size="64" font-weight="700" letter-spacing="-1.5" fill="{t['text']}">Ovaldino Palacio</text>
  <rect x="64" y="182" width="72" height="4" rx="2" fill="url(#accent)"/>
  {typing(t, 64, 232)}
  <text x="64" y="282" font-family="{FONT}" font-size="16" fill="{t['muted']}">Building open, verifiable infrastructure where AI, software and finance meet.</text>
</svg>
'''


def card(t, name):
    providers = [("OpenAI", "strict"), ("Claude", "strict tools"), ("Gemini", "structured")]
    chips = "".join(
        f'<g transform="translate({64 + i * 196},214)"><rect width="180" height="40" rx="20" fill="none" stroke="{t["border"]}"/>'
        f'<circle cx="22" cy="20" r="5" fill="url(#accent)"/><text x="36" y="25" font-family="{FONT}" font-size="14" fill="{t["text"]}">{p}</text>'
        f'<text x="{36 + round(len(p) * 8.6) + 6}" y="25" font-family="{FONT}" font-size="14" fill="{t["muted"]}">{m}</text></g>'
        for i, (p, m) in enumerate(providers))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="300" viewBox="0 0 1200 300" role="img" aria-labelledby="ct cd">
  <title id="ct">schema-caniuse</title>
  <desc id="cd">Can I use this JSON Schema with OpenAI, Claude or Gemini? A sourced compatibility database and checker.</desc>
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient>
    <radialGradient id="glow"><stop offset="0" stop-color="#8B5CF6" stop-opacity=".22"/><stop offset="1" stop-color="#8B5CF6" stop-opacity="0"/></radialGradient>
    <clipPath id="f"><rect width="1200" height="300" rx="20"/></clipPath>
  </defs>
  <g clip-path="url(#f)">
    <rect width="1200" height="300" fill="{t['card']}"/>
    <circle cx="1040" cy="150" r="260" fill="url(#glow)"/>
    <rect x=".5" y=".5" width="1199" height="299" rx="20" fill="none" stroke="{t['border']}"/>
  </g>
  <text x="64" y="70" font-family="{MONO}" font-size="13" letter-spacing="3" fill="{t['muted']}">FLAGSHIP PROJECT  ·  v0.1.0  ·  MIT</text>
  <text x="62" y="122" font-family="{FONT}" font-size="44" font-weight="700" fill="{t['text']}">schema-caniuse</text>
  <text x="64" y="164" font-family="{FONT}" font-size="19" fill="{t['muted']}">Can I use this JSON Schema with OpenAI, Claude or Gemini?</text>
  <text x="64" y="192" font-family="{FONT}" font-size="15" fill="{t['muted']}">Sourced, versioned compatibility data + a zero-dependency checker and CLI.</text>
  {chips}
  <g transform="translate(860,40)">
    <rect width="276" height="220" rx="16" fill="{t['bg1']}" stroke="{t['border']}"/>
    <circle cx="22" cy="22" r="5" fill="#EF4444" opacity=".8"/><circle cx="40" cy="22" r="5" fill="#F59E0B" opacity=".8"/><circle cx="58" cy="22" r="5" fill="#22C55E" opacity=".8"/>
    <text font-family="{MONO}" font-size="13" fill="{t['text']}">
      <tspan x="20" y="62" fill="{t['muted']}">$ npx schema-caniuse s.json</tspan>
      <tspan x="20" y="94" fill="{t['err']}">✖ openai-strict</tspan>
      <tspan x="34" y="116" fill="{t['muted']}">/properties/x/allOf</tspan>
      <tspan x="20" y="146" fill="{t['warn']}">⚠ gemini</tspan>
      <tspan x="34" y="168" fill="{t['muted']}">minLength ignored</tspan>
      <tspan x="20" y="198" fill="{t['ok']}">✔ anthropic-strict</tspan>
    </text>
  </g>
</svg>
'''


STACK = ["C", "C++", "JavaScript", "Node.js", "JSON Schema", "Git", "GitHub Actions", "MCP"]


def stack(t):
    x, chips = 0, []
    for name in STACK:
        w = round(len(name) * 9.0) + 40
        chips.append(f'<g transform="translate({x},0)"><rect x=".5" y=".5" width="{w}" height="35" rx="18" fill="{t['card']}" stroke="{t['border']}"/>'
                     f'<circle cx="17" cy="18" r="4" fill="url(#accent)"/><text x="28" y="23" font-family="{FONT}" font-size="14" fill="{t['text']}">{name}</text></g>')
        x += w + 10
    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="{x}" height="37" viewBox="0 0 {x} 37" role="img" aria-label="Tools: {', '.join(STACK)}">
  <defs><linearGradient id="accent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3B82F6"/><stop offset="1" stop-color="#8B5CF6"/></linearGradient></defs>
  {"".join(chips)}
</svg>
'''


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for name, t in THEMES.items():
        (OUT / f"banner-{name}.svg").write_text(banner(name, t), encoding="utf-8")
        (OUT / f"schema-caniuse-{name}.svg").write_text(card(t, name), encoding="utf-8")
        (OUT / f"stack-{name}.svg").write_text(stack(t), encoding="utf-8")
    print("ok:", sorted(p.name for p in OUT.glob("*.svg")))
