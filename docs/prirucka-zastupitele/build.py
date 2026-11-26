#!/usr/bin/env python3
"""Příručka zastupitele: jeden zdroj, tři výstupy (PC HTML, mobilní HTML, tiskové HTML pro PDF)."""
import re, html, pathlib, datetime
import markdown

ROOT = pathlib.Path(__file__).parent
SRC = ROOT / "src"
REPO = pathlib.Path("/home/claude/produktivity/content")
OUT = ROOT / "out"
OUT.mkdir(exist_ok=True)
SITE = "https://www.produktivni.cz"
STAV = "26. 11. 2026"

PARTS = [
    ("Začínáme", ["01-uvod", "02-data", "03-predplatne", "tipy/kontextove-okno-kolik-se-vejde"]),
    ("Připravte si počítač a nástroje", ["05-uklid", "06-konektory", "tipy/paragrafiq-zakony-v-claude-a-chatgpt", "agenti/pracovni-system-pravidla-skill-konektor-rutina"]),
    ("Práce zastupitele", ["tipy/podklady-na-zastupitelstvo-s-ai", "10-usneseni", "tipy/dotaz-zastupitele-nebo-zadost-106", "12-hospodareni", "13-obcane", "agenti/sestava-dashboard-zastupitele-ve-slozce", "z-praxe/nase-marianky-prehled-radnice"]),
    ("Na co si dát pozor", ["tipy/prikyvovani-ai-mate-naprostou-pravdu", "tipy/propaganda-v-odpovedich-chatbotu"]),
    ("Pro poslanecké a krajské kanceláře", ["tipy/interpelace-s-ai"]),
    ("Kam dál", ["20-kam-dal"]),
]

def frontmatter(text):
    m = re.match(r"^---\n(.*?)\n---\n(.*)$", text, re.S)
    if not m:
        return {}, text
    fm, body = m.group(1), m.group(2)
    data = {}
    for key in ("title", "excerpt", "author", "role"):
        mm = re.search(rf'^{key}:\s*"(.*)"\s*$', fm, re.M)
        if mm:
            data[key] = mm.group(1).replace('\\"', '"')
    return data, body

chapters = []  # dict(id, title, part, md, lead, slug)
for pi, (pname, items) in enumerate(PARTS, 1):
    for it in items:
        if "/" in it:
            fm, body = frontmatter((REPO / f"{it}.mdx").read_text())
            title, lead = fm["title"], fm.get("excerpt", "")
            md = body.strip()
            slug = it
        else:
            text = (SRC / f"{it}.md").read_text().strip()
            first, md = text.split("\n", 1)
            title, lead, slug = first.lstrip("# ").strip(), "", None
            md = md.strip()
        chapters.append(dict(title=title, lead=lead, md=md, part=pi, pname=pname, slug=slug))

for i, ch in enumerate(chapters, 1):
    ch["id"] = f"k{i}"
    ch["num"] = i

slugmap = {f"/{c['slug']}": c["id"] for c in chapters if c["slug"]}

def fix_links(md):
    def repl(m):
        path = m.group(1)
        if path in slugmap:
            return f"](#{slugmap[path]})"
        return f"]({SITE}{path})"
    md = re.sub(r"\]\((/[a-z0-9\-/]+)\)", repl, md)
    md = re.sub(r"\]\((https://www\.produktivni\.cz)(/[a-z0-9\-/]+)\)",
                lambda m: f"](#{slugmap[m.group(2)]})" if m.group(2) in slugmap else m.group(0), md)
    return md

# Příloha: všechny prompty (bloky ```text / ``` mimo stromy složek a příkazy)
prompts = []
for ch in chapters:
    for block in re.findall(r"```(?:text)?\n(.*?)```", ch["md"], re.S):
        b = block.strip()
        if "├──" in b or b.startswith("claude mcp") or b.startswith("#") or len(b) < 80:
            continue
        prompts.append((ch, b))
pmd = "Všechny prompty z příručky na jednom místě. Hranaté závorky nahraďte svými údaji.\n\n"
for ch, b in prompts:
    pmd += f"**{ch['title']}** ([kapitola {ch['num']}](#{ch['id']}))\n\n```text\n{b}\n```\n\n"
chapters.append(dict(title="Příloha: všechny prompty", lead="", md=pmd, part=len(PARTS), pname=PARTS[-1][0], slug=None, id="prompty", num=None))

MD = markdown.Markdown(extensions=["tables", "fenced_code", "sane_lists"])
def to_html(md):
    MD.reset()
    h = MD.convert(fix_links(md))
    h = h.replace("<table>", '<div class="tablewrap"><table>').replace("</table>", "</table></div>")
    h = re.sub(r'<a href="(https?://[^"]+)"', r'<a href="\1" target="_blank" rel="noopener"', h)
    return h

for ch in chapters:
    ch["html"] = to_html(ch["md"])

def chapter_html(ch):
    num = f'<span class="chnum">{ch["num"]:02d}</span>' if ch["num"] else '<span class="chnum">+</span>'
    lead = f'<p class="lead">{html.escape(ch["lead"])}</p>' if ch["lead"] else ""
    src = ""
    if ch["slug"]:
        src = f'<p class="src">Článek na webu: <a href="{SITE}/{ch["slug"]}" target="_blank" rel="noopener">produktivni.cz/{ch["slug"]}</a></p>'
    return f'<section class="chapter" id="{ch["id"]}"><header class="chhead">{num}<h1>{html.escape(ch["title"])}</h1>{lead}</header><div class="body">{ch["html"]}{src}</div></section>'

def toc_html(cls="toc"):
    out, cur = [f'<nav class="{cls}">'], None
    for ch in chapters:
        if ch["part"] != cur:
            if cur is not None:
                out.append("</ol>")
            cur = ch["part"]
            out.append(f'<p class="tocpart">{ch["part"]}. {html.escape(ch["pname"])}</p><ol>')
        n = f'{ch["num"]:02d}' if ch["num"] else "+"
        out.append(f'<li><a href="#{ch["id"]}"><span>{n}</span>{html.escape(ch["title"])}</a></li>')
    out.append("</ol></nav>")
    return "\n".join(out)

def body_with_parts(divider):
    out, cur = [], None
    for ch in chapters:
        if ch["part"] != cur and ch["num"]:
            cur = ch["part"]
            out.append(divider(cur, ch["pname"]))
        out.append(chapter_html(ch))
    return "\n".join(out)

TITLE = "Příručka pirátského zastupitele: AI v práci zastupitele"
GFONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Roboto+Condensed:wght@400;700&family=Roboto:ital,wght@0,400;0,500;0,700;1,400&display=swap&subset=latin-ext" rel="stylesheet">'
HEAD = lambda extra, css: f'''<!doctype html><html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex, nofollow"><title>{TITLE}</title>{extra}<style>{css}</style></head>'''

BASE = (ROOT / "base.css").read_text()
COPYJS = """<script>document.querySelectorAll('pre').forEach(p=>{const b=document.createElement('button');b.className='copy';b.type='button';b.textContent='Kopírovat';b.onclick=()=>{navigator.clipboard.writeText(p.innerText.replace(/Kopírovat$|Zkopírováno$/,'').trim()).then(()=>{b.textContent='Zkopírováno';setTimeout(()=>b.textContent='Kopírovat',1500)})};p.appendChild(b)});</script>"""

# --- PC ---
pc_div = lambda n, name: f'<div class="partband"><span>Část {n}</span><h2>{html.escape(name)}</h2></div>'
pc = HEAD(GFONTS, BASE + (ROOT / "pc.css").read_text()) + f'''<body>
<aside class="side"><a class="brand" href="#top">PIRÁTI · PŘÍRUČKA ZASTUPITELE</a>{toc_html()}<div class="sidelinks"><a class="btn" href="prirucka-zastupitele.pdf" download>Stáhnout PDF</a><a href="mobil.html">Verze pro mobil</a></div></aside>
<main id="top"><header class="hero"><p class="eyebrow">Piráti · stav k {STAV}</p><h1>AI v práci<br>zastupitele</h1><p class="herolead">Praktická příručka pro pirátské zastupitele: pravidla pro data, úklid v počítači, konektory včetně Piráti KB a Hlídače státu, podklady, usnesení, dotazy a dashboard.</p></header>
{body_with_parts(pc_div)}
<footer class="foot">Josef Pavlovic · <a href="{SITE}" target="_blank" rel="noopener">produktivni.cz</a> · stav k {STAV} · Není to stanovisko strany ani právní rada.</footer></main>{COPYJS}</body></html>'''
(OUT / "pc.html").write_text(pc)

# --- Mobil ---
mob = HEAD(GFONTS, BASE + (ROOT / "mobil.css").read_text()) + f'''<body>
<header class="bar"><a href="#top" class="barbrand">PŘÍRUČKA ZASTUPITELE</a><a href="#obsah" class="barbtn">Obsah</a></header>
<main id="top"><section class="hero"><p class="eyebrow">Piráti · stav k {STAV}</p><h1>AI v práci zastupitele</h1><p class="herolead">Pravidla pro data, úklid v počítači, konektory, podklady, usnesení, dotazy a dashboard.</p><div class="herobtns"><a class="btn" href="prirucka-zastupitele.pdf" download>PDF</a><a class="btn ghost" href="pc.html">Verze pro PC</a></div></section>
<section id="obsah" class="mtoc"><h2>Obsah</h2>{toc_html("toc mob")}</section>
{body_with_parts(pc_div)}
<footer class="foot">Josef Pavlovic · produktivni.cz · stav k {STAV}<br>Není to stanovisko strany ani právní rada.</footer></main>
<a href="#obsah" class="fab" aria-label="Obsah">☰</a>{COPYJS}</body></html>'''
(OUT / "mobil.html").write_text(mob)

# --- Tisk (PDF) ---
fonts = pathlib.Path("/home/claude/book/fonts.css").read_text()
pr_div = lambda n, name: f'<section class="partpage"><span>Část {n}</span><h2>{html.escape(name)}</h2></section>'
toc_print = toc_html("toc print")
prn = HEAD("", fonts + BASE + (ROOT / "print.css").read_text()) + f'''<body>
<section class="cover"><p class="eyebrow">Piráti · příručka zastupitele</p><h1>AI v práci<br>zastupitele</h1><p class="coverlead">Pravidla pro data, úklid v počítači, konektory včetně Piráti KB a Hlídače státu, podklady, usnesení, dotazy a žádosti o informace, kontrola hospodaření, dashboard a veřejný přehled radnice.</p><div class="coverfoot"><p>Josef Pavlovic · produktivni.cz</p><p>Stav k {STAV}</p></div></section>
<section class="tocpage"><h2>Obsah</h2>{toc_print}<p class="webver">Webové verze: produktivni.cz/zastupitele/pc.html · produktivni.cz/zastupitele/mobil.html</p></section>
{body_with_parts(pr_div)}
</body></html>'''
(OUT / "print.html").write_text(prn)
print(len(chapters), "kapitol,", len(prompts), "promptů")
