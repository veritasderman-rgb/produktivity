#!/usr/bin/env python3
"""Generuje e-book „Top 30 tipů" do public/ebook/ — česky i anglicky.

Obsah je zkrácený výtah z content/tipy/*.mdx (CS) a content/en/tipy/*.mdx (EN).
Vizuální identita podle app/globals.css: papír, inkoust, akcent jen na akcenty.

Spuštění:
    python3 scripts/build-ebook.py            # obě jazykové verze
    python3 scripts/build-ebook.py --lang cs  # jen česká

Vyžaduje: pip install reportlab   (a fonty DejaVu v /usr/share/fonts)
"""

from __future__ import annotations

import argparse
import os
import sys

from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import simpleSplit
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas as pdfcanvas

# --- Identita webu (app/globals.css) --------------------------------------

PAPER = (1.0, 1.0, 1.0)  # #FFFFFF
INK = (0.078, 0.078, 0.078)  # #141414
MUTED = (0.286, 0.294, 0.298)  # #494B4C
HAIRLINE = (0.906, 0.906, 0.894)  # #E7E7E4
ACCENT = (0.839, 0.196, 0.063)  # #D63210

PAGE_W, PAGE_H = A4
MARGIN_L = 54
MARGIN_R = 54
MARGIN_T = 58
MARGIN_B = 56
NUM_COL = 40  # šířka sloupce s číslem tipu
COL_X = MARGIN_L + NUM_COL
COL_W = PAGE_W - MARGIN_R - COL_X
CONTENT_TOP = PAGE_H - MARGIN_T
CONTENT_BOTTOM = MARGIN_B + 22  # nad patičkou

# Dva tipy na stranu — každý tip dostane půl strany.
TIPS_PER_PAGE = 2
SLOT_GAP = 26  # mezera s vlasovou linkou mezi tipy
SLOT_H = (CONTENT_TOP - CONTENT_BOTTOM - SLOT_GAP * (TIPS_PER_PAGE - 1)) / TIPS_PER_PAGE

REG = "DejaVuSans"
BOLD = "DejaVuSans-Bold"

FONT_DIRS = [
    "/usr/share/fonts/truetype/dejavu",
    "/usr/share/fonts/dejavu",
    "/usr/share/fonts/TTF",
    "/Library/Fonts",
]


def register_fonts() -> None:
    """Zaregistruje DejaVu — vestavěné Type1 fonty neumí českou diakritiku."""
    found = {}
    for directory in FONT_DIRS:
        for name, filename in ((REG, "DejaVuSans.ttf"), (BOLD, "DejaVuSans-Bold.ttf")):
            path = os.path.join(directory, filename)
            if name not in found and os.path.exists(path):
                found[name] = path
    missing = {REG, BOLD} - set(found)
    if missing:
        sys.exit(
            f"Chybí fonty {', '.join(sorted(missing))}. "
            "Nainstalujte balíček fonts-dejavu (ověřte: fc-list | grep -i dejavu)."
        )
    for name, path in found.items():
        pdfmetrics.registerFont(TTFont(name, path))


# --- Kreslicí pomůcky ------------------------------------------------------


def wrap(text: str, font: str, size: float, width: float) -> list[str]:
    return simpleSplit(text, font, size, width)


def text_height(text: str, font: str, size: float, width: float, leading: float) -> float:
    return len(wrap(text, font, size, width)) * leading


def draw_wrapped(
    c: pdfcanvas.Canvas,
    text: str,
    x: float,
    y: float,
    font: str,
    size: float,
    width: float,
    leading: float,
    color=INK,
) -> float:
    """Vykreslí zalomený text; y je horní okraj bloku, vrací spodní okraj."""
    c.setFont(font, size)
    c.setFillColorRGB(*color)
    for line in wrap(text, font, size, width):
        y -= leading
        c.drawString(x, y, line)
    return y


def rule(c: pdfcanvas.Canvas, x: float, y: float, width: float, thickness: float, color) -> None:
    c.setStrokeColorRGB(*color)
    c.setLineWidth(thickness)
    c.line(x, y, x + width, y)


def draw_keycaps(c: pdfcanvas.Canvas, keys: list[str], x: float, y: float) -> float:
    """Klávesy jako ostrohranné rámečky (obdoba <kbd> na webu). Vrací spodní okraj."""
    size = 7.2
    height = 13
    pad = 5
    top = y
    cursor = x
    for i, key in enumerate(keys):
        if i:
            c.setFont(REG, 7.5)
            c.setFillColorRGB(*MUTED)
            c.drawString(cursor + 2, top - height + 3.6, "+")
            cursor += 9
        width = pdfmetrics.stringWidth(key, BOLD, size) + 2 * pad
        c.setStrokeColorRGB(*INK)
        c.setLineWidth(1.1)
        c.rect(cursor, top - height, width, height, stroke=1, fill=0)
        c.setFont(BOLD, size)
        c.setFillColorRGB(*INK)
        c.drawString(cursor + pad, top - height + 4.0, key)
        cursor += width
    return top - height


def footer(c: pdfcanvas.Canvas, page_no: int, brand: str) -> None:
    y = MARGIN_B + 2
    rule(c, MARGIN_L, y + 12, PAGE_W - MARGIN_L - MARGIN_R, 0.5, HAIRLINE)
    c.setFont(REG, 7.5)
    c.setFillColorRGB(*MUTED)
    c.drawString(MARGIN_L, y, brand)
    c.drawRightString(PAGE_W - MARGIN_R, y, str(page_no))


# --- Bloky stránek ---------------------------------------------------------


TITLE_SIZE, TITLE_LEAD = 13.5, 16.5
LEAD_SIZE, LEAD_LEAD = 10, 14.2
STEP_SIZE, STEP_LEAD = 9.2, 13.2
STEP_INDENT = 18


def tip_height(tip: dict) -> float:
    """Skutečná výška obsahu tipu — kontroluje se, že se vejde do půlstrany."""
    h = text_height(tip["title"], BOLD, TITLE_SIZE, COL_W, TITLE_LEAD)
    h += 13  # meta řádek
    if tip.get("keys"):
        h += 21
    h += 9
    h += text_height(tip["lead"], REG, LEAD_SIZE, COL_W, LEAD_LEAD)
    h += 12
    for step in tip["steps"]:
        h += text_height(step, REG, STEP_SIZE, COL_W - STEP_INDENT, STEP_LEAD) + 5
    h += 14  # řádek s úsporou
    return h


def draw_tip(c: pdfcanvas.Canvas, tip: dict, number: int, y: float, saves_label: str) -> None:
    """Vykreslí jeden tip do slotu, jehož horní okraj je y."""
    top = y

    # Číslo tipu — jediné velké místo pro akcent.
    c.setFont(BOLD, 21)
    c.setFillColorRGB(*ACCENT)
    c.drawString(MARGIN_L, top - 16, f"{number:02d}")

    y = draw_wrapped(c, tip["title"], COL_X, top, BOLD, TITLE_SIZE, COL_W, TITLE_LEAD)

    c.setFont(REG, 8)
    c.setFillColorRGB(*MUTED)
    y -= 12
    c.drawString(COL_X, y, tip["meta"])

    if tip.get("keys"):
        y = draw_keycaps(c, tip["keys"], COL_X, y - 6) - 4

    y -= 9
    y = draw_wrapped(c, tip["lead"], COL_X, y, REG, LEAD_SIZE, COL_W, LEAD_LEAD)

    y -= 12
    for i, step in enumerate(tip["steps"], 1):
        lines = wrap(step, REG, STEP_SIZE, COL_W - STEP_INDENT)
        c.setFont(BOLD, STEP_SIZE)
        c.setFillColorRGB(*ACCENT)
        c.drawString(COL_X, y - STEP_LEAD, f"{i}.")
        c.setFont(REG, STEP_SIZE)
        c.setFillColorRGB(*INK)
        for line in lines:
            y -= STEP_LEAD
            c.drawString(COL_X + STEP_INDENT, y, line)
        y -= 5

    y -= 14
    c.setFont(BOLD, 8.5)
    c.setFillColorRGB(*MUTED)
    label = f"{saves_label} "
    c.drawString(COL_X, y, label)
    c.setFont(REG, 8.5)
    c.drawString(COL_X + pdfmetrics.stringWidth(label, BOLD, 8.5), y, tip["saves"])


def draw_cover(c: pdfcanvas.Canvas, t: dict) -> None:
    c.setFillColorRGB(*PAPER)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    y = PAGE_H - 96
    c.setFont(BOLD, 9)
    c.setFillColorRGB(*INK)
    c.drawString(MARGIN_L, y, t["brand_caps"])
    y -= 12
    rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 2, INK)

    y -= 118
    y = draw_wrapped(c, t["cover_title"], MARGIN_L, y, BOLD, 33, PAGE_W - MARGIN_L - MARGIN_R - 40, 40)

    y -= 26
    rule(c, MARGIN_L, y, 68, 3, ACCENT)

    y -= 26
    y = draw_wrapped(c, t["cover_lead"], MARGIN_L, y, REG, 12, PAGE_W - MARGIN_L - MARGIN_R - 90, 18, MUTED)

    y = MARGIN_B + 96
    rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 0.5, HAIRLINE)
    y -= 20
    c.setFont(BOLD, 11)
    c.setFillColorRGB(*INK)
    c.drawString(MARGIN_L, y, t["author"])
    y -= 15
    c.setFont(REG, 10)
    c.setFillColorRGB(*MUTED)
    c.drawString(MARGIN_L, y, t["site"])


def draw_contents(c: pdfcanvas.Canvas, t: dict, tips: list[dict], page_no: int) -> None:
    y = CONTENT_TOP
    c.setFont(BOLD, 9)
    c.setFillColorRGB(*INK)
    c.drawString(MARGIN_L, y, t["brand_caps"])
    y -= 10
    rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 2, INK)

    y -= 40
    c.setFont(BOLD, 20)
    c.setFillColorRGB(*INK)
    c.drawString(MARGIN_L, y, t["contents_title"])

    y -= 18
    c.setFont(REG, 9)
    c.setFillColorRGB(*MUTED)
    c.drawString(MARGIN_L, y, t["contents_lead"])

    y -= 24
    for i, tip in enumerate(tips, 1):
        c.setFont(BOLD, 8)
        c.setFillColorRGB(*ACCENT)
        c.drawString(MARGIN_L, y, f"{i:02d}")
        c.setFont(REG, 9)
        c.setFillColorRGB(*INK)
        title = tip["title"]
        max_w = COL_W - 96
        while pdfmetrics.stringWidth(title, REG, 9) > max_w and len(title) > 4:
            title = title[:-2]
            if pdfmetrics.stringWidth(title + "…", REG, 9) <= max_w:
                title += "…"
        c.drawString(MARGIN_L + 22, y, title)
        c.setFont(REG, 7.5)
        c.setFillColorRGB(*MUTED)
        c.drawRightString(PAGE_W - MARGIN_R, y, tip["cat_label"])
        y -= 6
        rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 0.4, HAIRLINE)
        y -= 12

    footer(c, page_no, t["footer"])


def draw_outro(c: pdfcanvas.Canvas, t: dict, page_no: int) -> None:
    y = CONTENT_TOP
    c.setFont(BOLD, 9)
    c.setFillColorRGB(*INK)
    c.drawString(MARGIN_L, y, t["brand_caps"])
    y -= 10
    rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 2, INK)

    y -= 48
    y = draw_wrapped(c, t["outro_title"], MARGIN_L, y, BOLD, 22, PAGE_W - MARGIN_L - MARGIN_R - 60, 27)
    y -= 16
    rule(c, MARGIN_L, y, 68, 3, ACCENT)
    y -= 20
    y = draw_wrapped(c, t["outro_lead"], MARGIN_L, y, REG, 10, PAGE_W - MARGIN_L - MARGIN_R - 60, 15, MUTED)

    y -= 26
    for heading, body in t["outro_items"]:
        rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 0.5, HAIRLINE)
        y -= 18
        c.setFont(BOLD, 11)
        c.setFillColorRGB(*INK)
        c.drawString(MARGIN_L, y, heading)
        y -= 4
        y = draw_wrapped(c, body, MARGIN_L, y, REG, 9, PAGE_W - MARGIN_L - MARGIN_R - 40, 12.6, MUTED)
        y -= 18

    rule(c, MARGIN_L, y, PAGE_W - MARGIN_L - MARGIN_R, 0.5, HAIRLINE)
    y -= 22
    c.setFont(BOLD, 10)
    c.setFillColorRGB(*INK)
    c.drawString(MARGIN_L, y, t["author"])
    y -= 14
    c.setFont(REG, 9)
    c.setFillColorRGB(*MUTED)
    c.drawString(MARGIN_L, y, t["site"])

    footer(c, page_no, t["footer"])


def build(locale: str, out_path: str) -> tuple[int, int]:
    t = STRINGS[locale]
    tips = [dict(tip[locale], cat_label=tip["cat_label"][locale]) for tip in TIPS]

    c = pdfcanvas.Canvas(out_path, pagesize=A4)
    c.setTitle(t["cover_title"])
    c.setAuthor(t["author"])
    c.setSubject(t["cover_lead"])

    draw_cover(c, t)
    c.showPage()

    page_no = 2
    draw_contents(c, t, tips, page_no)
    c.showPage()

    page_no += 1
    for i, tip in enumerate(tips, 1):
        slot = (i - 1) % TIPS_PER_PAGE
        if slot == 0 and i > 1:
            footer(c, page_no, t["footer"])
            c.showPage()
            page_no += 1
        y = CONTENT_TOP - slot * (SLOT_H + SLOT_GAP)
        if slot > 0:
            rule(c, MARGIN_L, y + SLOT_GAP / 2, PAGE_W - MARGIN_L - MARGIN_R, 0.5, HAIRLINE)
        overflow = tip_height(tip) - SLOT_H
        if overflow > 0:
            print(
                f"  varování: tip {i} ({tip['title'][:40]}) přetéká o {overflow:.0f} bodů",
                file=sys.stderr,
            )
        draw_tip(c, tip, i, y, t["saves_label"])
    footer(c, page_no, t["footer"])
    c.showPage()

    page_no += 1
    draw_outro(c, t, page_no)
    c.showPage()

    c.save()
    return page_no, os.path.getsize(out_path)


# --- Texty rámce -----------------------------------------------------------

STRINGS = {
    "cs": {
        "brand_caps": "PRODUKTIVNÍ.CZ",
        "cover_title": "Top 30 tipů, které vám vrátí hodinu denně",
        "cover_lead": "Zkratky, aplikace, AI a systémy. Třicet věcí, které si zkusíte hned — "
        "každá na půl strany, s postupem a s tím, co ušetří.",
        "author": "Josef Pavlovic",
        "site": "produktivni.cz",
        "footer": "Produktivní.cz — Top 30 tipů",
        "contents_title": "Obsah",
        "contents_lead": "Třicet tipů napříč zkratkami, aplikacemi, AI, workflow, komunikací a hardwarem.",
        "saves_label": "Ušetří:",
        "outro_title": "Tohle je jen třicet z několika stovek",
        "outro_lead": "Celé know-how je na webu zdarma a aktualizuje se každý den. "
        "Tady jsou tři místa, kam jít dál.",
        "outro_items": [
            (
                "produktivni.cz/prirucka",
                "Kompletní příručka produktivity — systémy, návyky a nástroje na jednom místě, zdarma.",
            ),
            (
                "produktivni.cz/nastroje/kviz",
                "Nevíte, kde začít? Kvíz vám za dvě minuty poradí systém, který vám sedne.",
            ),
            (
                "produktivni.cz/newsletter",
                "Každý týden jeden tip — dvě minuty čtení, hodiny úspor. Odhlásíte se jedním kliknutím.",
            ),
        ],
    },
    "en": {
        "brand_caps": "PRODUCTIVE.TIPS",
        "cover_title": "30 tips that give you an hour back every day",
        "cover_lead": "Shortcuts, apps, AI and systems. Thirty things you can try right now — "
        "half a page each, with the steps and what it saves.",
        "author": "Josef Pavlovic",
        "site": "productive.tips",
        "footer": "Productive — Top 30 tips",
        "contents_title": "Contents",
        "contents_lead": "Thirty tips across shortcuts, apps, AI, workflow, communication and hardware.",
        "saves_label": "Saves:",
        "outro_title": "This is thirty out of several hundred",
        "outro_lead": "The whole handbook is free on the site and gets updated every day. "
        "Here are three places to go next.",
        "outro_items": [
            (
                "productive.tips/prirucka",
                "The complete productivity handbook — systems, habits and tools in one place, free.",
            ),
            (
                "productive.tips/nastroje/kviz",
                "Not sure where to start? The quiz picks a system that fits you in two minutes.",
            ),
            (
                "productive.tips/newsletter",
                "One tip a week — two minutes to read, hours saved. Unsubscribe with one click.",
            ),
        ],
    },
}

# --- Třicet tipů -----------------------------------------------------------
# Zkrácené výtahy z content/tipy/*.mdx a content/en/tipy/*.mdx.

TIPS = [
    {
        "slug": "ctrl-f-hledani-na-strance",
        "cat_label": {"cs": "zkratky", "en": "shortcuts"},
        "cs": {
            "title": "Ctrl+F: nečtěte stránku, prohledejte ji",
            "meta": "Zkratky · Prohlížeč",
            "keys": ["Ctrl", "F"],
            "lead": "Hledáte na dlouhé stránce konkrétní informaci? Ctrl+F a pár písmen vás tam dostane za dvě vteřiny.",
            "steps": [
                "Stiskněte Ctrl+F (na Macu Cmd+F) — otevře se malé vyhledávací pole.",
                "Napište hledaný výraz. Stránka okamžitě zvýrazní všechny nalezené výskyty.",
                "Enter skočí na další výskyt, Shift+Enter na předchozí — bez myši a bez rolování.",
                "Hledejte krátký, jedinečný fragment místo celé fráze. Hledání je doslovné, ne chytré.",
            ],
            "saves": "~5 min denně",
        },
        "en": {
            "title": "Ctrl+F: don't read the page, search it",
            "meta": "Shortcuts · Browser",
            "keys": ["Ctrl", "F"],
            "lead": "Looking for a specific piece of information on a long page? Ctrl+F and a few letters get you there in two seconds.",
            "steps": [
                "Press Ctrl+F (Cmd+F on Mac) — a small search box opens.",
                "Type your search term. The page immediately highlights every match found.",
                "Enter jumps to the next match, Shift+Enter to the previous one — no mouse, no scrolling.",
                "Search for a short, unique fragment rather than a whole phrase. Search is literal, not smart.",
            ],
            "saves": "~5 min a day",
        },
    },
    {
        "slug": "ctrl-shift-t-obnoveni-panelu",
        "cat_label": {"cs": "zkratky", "en": "shortcuts"},
        "cs": {
            "title": "Zavřeli jste panel omylem? Ctrl+Shift+T ho vrátí",
            "meta": "Zkratky · Prohlížeč",
            "keys": ["Ctrl", "Shift", "T"],
            "lead": "Obnoví naposledy zavřený panel — a opakovaným stisknutím i ty před ním. Funguje i na celá zavřená okna.",
            "steps": [
                "Stiskněte Ctrl+Shift+T (na Macu Cmd+Shift+T). Poslední zavřený panel se vrátí na stejné adrese.",
                "Zkratku můžete stisknout opakovaně: prohlížeč vrací další a další panely od nejnovějšího po starší.",
                "Funguje i po pádu prohlížeče — při dalším spuštění vrátí celé okno se všemi panely.",
                "Na starší stránky sáhněte radši do historie (Ctrl+H). Paměť zkratky není nekonečná.",
            ],
            "saves": "~3 min denně",
        },
        "en": {
            "title": "Closed a tab by mistake? Ctrl+Shift+T brings it back",
            "meta": "Shortcuts · Browser",
            "keys": ["Ctrl", "Shift", "T"],
            "lead": "Reopens the last closed tab — and pressing it again brings back the ones before it. Works for whole closed windows too.",
            "steps": [
                "Press Ctrl+Shift+T (Cmd+Shift+T on Mac). The last closed tab reopens at the same address.",
                "Press it repeatedly: the browser keeps bringing back tabs, from most recent to oldest.",
                "It works after a browser crash too — the next launch restores the entire window with every tab.",
                "For anything older, open your history (Ctrl+H). The shortcut's memory isn't unlimited.",
            ],
            "saves": "~3 min a day",
        },
    },
    {
        "slug": "ctrl-backspace-mazani-slov",
        "cat_label": {"cs": "zkratky", "en": "shortcuts"},
        "cs": {
            "title": "Mažte po slovech, ne po písmenech",
            "meta": "Zkratky · Všude",
            "keys": ["Ctrl", "Backspace"],
            "lead": "Ctrl+Backspace smaže celé slovo vlevo, Ctrl+Delete celé slovo vpravo. Překlepy mizí najednou.",
            "steps": [
                "Umístěte kurzor za slovo, které chcete smazat, nebo kamkoli do jeho poloviny.",
                "Ctrl+Backspace smaže celé slovo vlevo od kurzoru, ne jen jedno písmeno.",
                "Ctrl+Delete smaže celé slovo vpravo — hodí se, když opravujete text před sebou.",
                "Na Macu dělá totéž Option+Delete. Je to chování systému, ne funkce konkrétní aplikace.",
            ],
            "saves": "~2 min denně",
        },
        "en": {
            "title": "Delete word by word, not letter by letter",
            "meta": "Shortcuts · Everywhere",
            "keys": ["Ctrl", "Backspace"],
            "lead": "Ctrl+Backspace deletes the whole word to the left, Ctrl+Delete the whole word to the right. Typos disappear in one go.",
            "steps": [
                "Place your cursor right after the word you want to delete, or anywhere within it.",
                "Ctrl+Backspace deletes the entire word to the left of the cursor, not just one letter.",
                "Ctrl+Delete deletes the entire word to the right — useful when fixing text ahead of you.",
                "On Mac, Option+Delete does the same. It's standard system behavior, not an app feature.",
            ],
            "saves": "~2 min a day",
        },
    },
    {
        "slug": "win-shift-s-vystrizek",
        "cat_label": {"cs": "zkratky", "en": "shortcuts"},
        "cs": {
            "title": "Win+Shift+S: výstřižek obrazovky přesně podle potřeby",
            "meta": "Zkratky · Windows",
            "keys": ["Win", "Shift", "S"],
            "lead": "Nejužitečnější zkratka Windows pro screenshoty — vyberete oblast, okno nebo celou obrazovku a snímek máte ve schránce.",
            "steps": [
                "Stiskněte Win+Shift+S. Obrazovka ztmavne a nahoře se objeví lišta s režimy výběru.",
                "Zvolte režim: obdélníkový výběr, volný tvar, okno, nebo celá obrazovka.",
                "Snímek se automaticky uloží do schránky — stačí ho Ctrl+V vložit tam, kam potřebujete.",
                "Kliknutím na oznámení vpravo dole otevřete editor, kde snímek doupravíte.",
            ],
            "saves": "~4 min denně",
        },
        "en": {
            "title": "Win+Shift+S: a screen clip exactly the way you need it",
            "meta": "Shortcuts · Windows",
            "keys": ["Win", "Shift", "S"],
            "lead": "Windows' most useful shortcut for screenshots — pick a region, a window, or the whole screen, and the shot lands right in your clipboard.",
            "steps": [
                "Press Win+Shift+S. The screen dims and a toolbar with selection modes appears at the top.",
                "Choose the mode you need: rectangular selection, freeform, window, or full screen.",
                "The shot is saved to your clipboard automatically — just Ctrl+V it wherever you need it.",
                "Click the notification in the bottom-right corner to open the snip editor and mark it up.",
            ],
            "saves": "~4 min a day",
        },
    },
    {
        "slug": "mac-quick-look",
        "cat_label": {"cs": "zkratky", "en": "shortcuts"},
        "cs": {
            "title": "Mezerník: náhled souboru bez otevírání aplikace",
            "meta": "Zkratky · macOS",
            "keys": ["mezerník"],
            "lead": "Označte soubor ve Finderu a stiskněte mezerník. PDF, fotky, video i tabulky si prohlédnete okamžitě — bez čekání na aplikaci.",
            "steps": [
                "Ve Finderu označte soubor a stiskněte mezerník. Otevře se velké okno s náhledem.",
                "Šipkami ← → procházíte další soubory ve stejné složce, aniž byste náhled zavírali.",
                "Náhled zvládne PDF i vícestránkové, fotky, videa, tabulky a textové dokumenty.",
                "Označíte-li víc souborů najednou, mezerník nabídne mřížkové zobrazení všech.",
            ],
            "saves": "~5 min denně",
        },
        "en": {
            "title": "Space bar: preview a file without opening an app",
            "meta": "Shortcuts · macOS",
            "keys": ["Space"],
            "lead": "Select a file in Finder and press Space. PDFs, photos, video and spreadsheets appear instantly — no waiting for an app to launch.",
            "steps": [
                "In Finder, select the file and press Space. A large preview window opens.",
                "Use the ← → arrow keys to flip through other files in the same folder without closing it.",
                "Quick Look handles multi-page PDFs, photos, videos, spreadsheets and text documents.",
                "Select multiple files at once and Space offers a grid view of all of them together.",
            ],
            "saves": "~5 min a day",
        },
    },
    {
        "slug": "mobil-mezernik-kurzor",
        "cat_label": {"cs": "zkratky", "en": "shortcuts"},
        "cs": {
            "title": "Podržte mezerník: klávesnice se změní v trackpad",
            "meta": "Zkratky · Mobil",
            "keys": [],
            "lead": "Trefit se prstem doprostřed slova je loterie. Podržení mezerníku promění klávesnici v touchpad pro přesný pohyb kurzoru.",
            "steps": [
                "Při psaní podržte mezerník. Klávesnice zešedne a text pod ní se stane citlivou plochou.",
                "Tažením prstu pohybujete kurzorem v textu přesně podle pohybu prstu.",
                "Jakmile je kurzor na správném místě, prst zvedněte a pokračujte v psaní.",
                "Funguje na iPhonu i na Androidu s klávesnicí Gboard, na obou prakticky identicky.",
            ],
            "saves": "~3 min denně",
        },
        "en": {
            "title": "Hold the space bar: your keyboard turns into a trackpad",
            "meta": "Shortcuts · Mobile",
            "keys": [],
            "lead": "Landing a finger right in the middle of a word is a lottery. Holding the space bar turns your keyboard into a touchpad for precise cursor movement.",
            "steps": [
                "While typing, hold down the space bar. The keyboard turns gray and becomes a sensitive surface.",
                "Drag your finger left, right, up or down to move the cursor to match exactly.",
                "Once the cursor is in the right spot, lift your finger and continue typing.",
                "The gesture works on both iPhone and Android with Gboard, nearly identically.",
            ],
            "saves": "~3 min a day",
        },
    },
    {
        "slug": "excel-flash-fill",
        "cat_label": {"cs": "aplikace", "en": "apps"},
        "cs": {
            "title": "Flash Fill: Excel dokončí vzor za vás",
            "meta": "Aplikace · Všude",
            "keys": ["Ctrl", "E"],
            "lead": "Napište do vedlejšího sloupce první příklad — třeba jméno z e-mailu — a Ctrl+E doplní zbytek podle vzoru. Bez vzorců.",
            "steps": [
                "Do sloupce vedle zdrojových dat napište ručně první výsledek přesně tak, jak má vypadat.",
                "Klikněte zpátky do té buňky a stiskněte Ctrl+E. Excel odvodí vzor a doplní zbytek sloupce.",
                "Než vyplnění potvrdíte, zkontrolujte šedý náhled — u nepravidelných dat se může minout.",
                "Když si Excel není jistý, vyplňte druhý příklad na dalším řádku a stiskněte Ctrl+E znovu.",
            ],
            "saves": "~20 min týdně",
        },
        "en": {
            "title": "Flash Fill: Excel finishes the pattern for you",
            "meta": "Apps · Everywhere",
            "keys": ["Ctrl", "E"],
            "lead": "Type one example into the next column — say, a name pulled from an email address — and Ctrl+E fills in the rest to match. No formulas.",
            "steps": [
                "In the column next to your source data, type the first result by hand, exactly as it should look.",
                "Click back into that cell and press Ctrl+E. Excel infers the pattern and fills the rest.",
                "Check the gray preview before confirming — with irregular data it can miss in places.",
                "When Excel isn't sure, fill in a second example on another row and press Ctrl+E again.",
            ],
            "saves": "~20 min a week",
        },
    },
    {
        "slug": "mac-text-replacement",
        "cat_label": {"cs": "aplikace", "en": "apps"},
        "cs": {
            "title": "Textové zkratky: napište „adr“ a vyskočí celá adresa",
            "meta": "Aplikace · macOS",
            "keys": [],
            "lead": "macOS umí nahrazovat krátké zkratky dlouhými texty systémově — v mailu, prohlížeči i chatu. Nastavte jednou, funguje všude.",
            "steps": [
                "Otevřete Nastavení systému → Klávesnice → Náhrady textu.",
                "Klikněte na + a přidejte záznam: vlevo krátká zkratka, vpravo plný text.",
                "Plný text může mít i víc řádků — třeba celý e-mailový podpis nebo fakturační údaje.",
                "Volte zkratky, které se v běžném textu samy neobjeví, ať se nenahradí něco nechtěného.",
            ],
            "saves": "~10 min denně",
        },
        "en": {
            "title": "Text replacement: type “addr” and the whole address pops out",
            "meta": "Apps · macOS",
            "keys": [],
            "lead": "macOS can replace short shortcuts with long text system-wide — in email, browser and chat alike. Set it up once, works everywhere.",
            "steps": [
                "Open System Settings → Keyboard → Text Replacements.",
                "Click + and add an entry: a short shortcut on the left, the full text on the right.",
                "The full text can span multiple lines — an entire signature, or complete billing details.",
                "Choose shortcuts that wouldn't show up in ordinary text, so nothing unintended gets replaced.",
            ],
            "saves": "~10 min a day",
        },
    },
    {
        "slug": "vlastni-zkratky-vyhledavani",
        "cat_label": {"cs": "aplikace", "en": "apps"},
        "cs": {
            "title": "Vlastní zkratky vyhledávání: „w heslo“ hledá na Wikipedii",
            "meta": "Aplikace · Prohlížeč",
            "keys": [],
            "lead": "Naučte adresní řádek hledat přímo na konkrétních webech — Wikipedie, mapy, interní wiki. Jedno písmeno, mezera, dotaz.",
            "steps": [
                "Otevřete Nastavení prohlížeče → Vyhledávač → Spravovat vyhledávače.",
                "Přidejte nový: název, zkratku (např. „w“) a adresu s parametrem %s na místě dotazu.",
                "Vyzkoušejte: napište do adresního řádku „w Pomodoro“ a prohlížeč skočí rovnou na výsledek.",
                "Adresu s %s zjistíte tak, že na webu něco vyhledáte a zkopírujete výslednou adresu.",
            ],
            "saves": "~4 min denně",
        },
        "en": {
            "title": "Custom search shortcuts: “w query” searches Wikipedia",
            "meta": "Apps · Browser",
            "keys": [],
            "lead": "Teach your address bar to search specific sites directly — Wikipedia, Maps, your internal wiki. One letter, a space, your query.",
            "steps": [
                "Open Browser settings → Search engine → Manage search engines.",
                "Add a new one: a name, the keyword you'll type (e.g. “w”), and a URL with %s where the query goes.",
                "Test it: type “w Pomodoro” into the address bar and the browser jumps straight to the result.",
                "Find the URL with %s by searching on the site and copying the resulting address.",
            ],
            "saves": "~4 min a day",
        },
    },
    {
        "slug": "todoist-prirozeny-jazyk",
        "cat_label": {"cs": "aplikace", "en": "apps"},
        "cs": {
            "title": "Todoist: úkol zadáte jednou větou",
            "meta": "Aplikace · Všude",
            "keys": [],
            "lead": "„každé pondělí v 10 #porady p1“ — datum, opakování, projekt i prioritu Todoist pochopí z textu.",
            "steps": [
                "Pište rovnou do názvu úkolu celou větu, ne jen holé pojmenování.",
                "Znak # uvozuje projekt, / za projektem podprojekt, @ štítek a p1 až p4 prioritu.",
                "Datum s časem se rozpozná z běžných spojení: „zítra“, „příští úterý“, „za dva týdny“.",
                "Než úkol uložíte, mrkněte na náhled pod polem — ukazuje, jak Todoist větu pochopil.",
            ],
            "saves": "~5 min denně",
        },
        "en": {
            "title": "Todoist: add a task in a single sentence",
            "meta": "Apps · Everywhere",
            "keys": [],
            "lead": "“every Monday at 10 #meetings p1” — Todoist picks up the date, recurrence, project and priority straight from the text.",
            "steps": [
                "Type the whole sentence straight into the task name, not just a bare label.",
                "The # symbol introduces a project, / a sub-project, @ a label, and p1 to p4 a priority.",
                "Dates with times are recognized from common phrases: “tomorrow”, “next Tuesday”, “in two weeks”.",
                "Before saving, glance at the preview under the field — it shows how Todoist read the sentence.",
            ],
            "saves": "~5 min a day",
        },
    },
    {
        "slug": "hlasovy-capture",
        "cat_label": {"cs": "aplikace", "en": "apps"},
        "cs": {
            "title": "Hlasové zachycení: nápad zapíšete, i když nemůžete psát",
            "meta": "Aplikace · Mobil",
            "keys": [],
            "lead": "V autě, na procházce, s nákupem v ruce: „Hey Siri, přidej…“ a myšlenka je v systému.",
            "steps": [
                "Krátké úkoly řekněte rovnou asistentovi: „Přidej na nákupní seznam mléko.“",
                "Připomínky s časem: „Připomeň mi zítra v 9 zavolat doktorovi.“",
                "Na delší myšlenky použijte hlasovou poznámku — aplikace ji rovnou přepíšou na text.",
                "Asistenta aktivujete zavoláním nebo podržením tlačítka, i na uzamčeném telefonu.",
            ],
            "saves": "~5 min denně",
        },
        "en": {
            "title": "Voice capture: write down an idea even when you can't type",
            "meta": "Apps · Mobile",
            "keys": [],
            "lead": "In the car, on a walk, with your hands full of groceries: “Hey Siri, add…” and the thought is in the system.",
            "steps": [
                "For quick tasks, use a direct command: “Add milk to my shopping list.”",
                "For reminders with a time attached: “Remind me tomorrow at 9 to call the doctor.”",
                "For longer thoughts, use a voice memo — modern note apps transcribe it to text right away.",
                "Activate the assistant by calling out or holding a button — it works on a locked phone too.",
            ],
            "saves": "~5 min a day",
        },
    },
    {
        "slug": "powertoys-run",
        "cat_label": {"cs": "aplikace", "en": "apps"},
        "cs": {
            "title": "PowerToys Run: spouštěč jako Spotlight na Macu",
            "meta": "Aplikace · Windows",
            "keys": ["Alt", "mezerník"],
            "lead": "Alt+mezerník otevře řádek, který spouští aplikace, hledá soubory, počítá a převádí jednotky. Start menu odchází do důchodu.",
            "steps": [
                "Nainstalujte PowerToys od Microsoftu a povolte v nastavení modul PowerToys Run.",
                "Stiskněte Alt+mezerník. Na obrazovce se objeví jednoduchý vyhledávací řádek.",
                "Pište název aplikace, souboru nebo rovnou matematický výraz, třeba „2490*0.79“.",
                "Výsledky procházíte šipkami a potvrzujete Enterem; první nabízený bývá ten správný.",
            ],
            "saves": "~5 min denně",
        },
        "en": {
            "title": "PowerToys Run: a launcher like Spotlight on the Mac",
            "meta": "Apps · Windows",
            "keys": ["Alt", "Space"],
            "lead": "Alt+Space opens a bar that launches apps, finds files, does math and converts units. The Start menu can retire.",
            "steps": [
                "Install PowerToys from Microsoft and enable the PowerToys Run module in its settings.",
                "Press Alt+Space. A simple search bar appears on screen.",
                "Type an app name, a file name, or a math expression such as “2490*0.79”.",
                "Cycle through results with the arrows and confirm with Enter; the first is usually right.",
            ],
            "saves": "~5 min a day",
        },
    },
    {
        "slug": "ai-role-a-kontext",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "Role, kontext, úkol, formát: anatomie promptu",
            "meta": "AI · Všude",
            "keys": [],
            "lead": "Kvalita odpovědi se rozhoduje v zadání, ne ve výběru modelu. Dobrý prompt drží čtyři díly a každý má svou práci.",
            "steps": [
                "Role nastavuje perspektivu: „Jsi zkušený obchodní právník.“ Rozhoduje, co v odpovědi zůstane.",
                "Kontext je to jediné, co model neví — pro koho to je, co se stalo, jaká máte omezení.",
                "Úkol potřebuje sloveso a rozsah. „Vypiš rizika“, ne „podívej se na to“.",
                "Formát: délka, struktura, tón. A hlavně řekněte i to, co nechcete.",
            ],
            "saves": "~30 min denně",
        },
        "en": {
            "title": "Role, context, task, format: anatomy of a prompt",
            "meta": "AI · Everywhere",
            "keys": [],
            "lead": "The quality of an answer is decided in the request, not in the choice of model. A good prompt holds four parts, each doing its own job.",
            "steps": [
                "Role sets the perspective: “You're an experienced commercial lawyer.” It filters what stays in.",
                "Context is the one thing the model doesn't know — who it's for, what happened, your constraints.",
                "Task needs a verb and a clear scope. “List the risks”, not “take a look at this”.",
                "Format: length, structure, tone. And above all, say what you don't want too.",
            ],
            "saves": "~30 min a day",
        },
    },
    {
        "slug": "ai-vlastni-instrukce",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "Vlastní instrukce: nastavte AI jednou, platí pořád",
            "meta": "AI · Všude",
            "keys": [],
            "lead": "Trvalé instrukce platí v každé nové konverzaci. Fungující sada má čtyři bloky — držte je v tomhle pořadí, model čte odshora.",
            "steps": [
                "Kdo jste: dvě až čtyři věty o profesi, oboru a úrovni znalostí. „Jsem manažer“ nedělá skoro nic.",
                "Jak chcete odpovědi: struktura a rozsah v číslech — kolik odrážek, co má být první.",
                "Jakým tónem: popište tón vztahem. „Piš jako kolega, který nemá čas na zdvořilosti.“",
                "Co nikdy nedělat: tři až šest zákazů. Fungují nejlíp, protože jdou jednoznačně zkontrolovat.",
            ],
            "saves": "~15 min denně",
        },
        "en": {
            "title": "Custom instructions: set up AI once, it applies forever",
            "meta": "AI · Everywhere",
            "keys": [],
            "lead": "Standing instructions apply in every new conversation. A working set has four blocks — keep them in this order, the model reads top to bottom.",
            "steps": [
                "Who you are: two to four sentences on profession, field and level. “I'm a manager” does almost nothing.",
                "How you want answers: structure and length in numbers — how many bullets, what comes first.",
                "What tone: describe it through a relationship. “Write like a colleague with no time for pleasantries.”",
                "What never to do: three to six prohibitions. They work best because they're clearly checkable.",
            ],
            "saves": "~15 min a day",
        },
    },
    {
        "slug": "ai-shrnuti-dokumentu",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "Dlouhý dokument? Nechte AI udělat výtah s čísly stránek",
            "meta": "AI · Všude",
            "keys": [],
            "lead": "Když necháte model rozhodnout o formátu, dostanete plynulý text. Když formát předepíšete, dostanete dokument, ze kterého se dá pracovat.",
            "steps": [
                "Řekněte, kdo výtah bude číst a proč. Bez toho model neumí vybrat, co je podstatné.",
                "Předepište strukturu: o čem dokument je, hlavní body se stranou, čísla, termíny podle data.",
                "Přidejte bod „co dokument NEŘEŠÍ, i když by se to od něj čekalo“. Bývá nejcennější.",
                "Zakažte odhady: „kde si nejsi jistý umístěním, napiš umístění neurčeno“.",
            ],
            "saves": "~30–90 min na dokument",
        },
        "en": {
            "title": "A long document? Let AI make an excerpt with page numbers",
            "meta": "AI · Everywhere",
            "keys": [],
            "lead": "Let the model decide the format and you get flowing prose. Prescribe the format and you get a document you can actually work from.",
            "steps": [
                "Say who will read the excerpt and why. Without that the model can't pick what's relevant.",
                "Prescribe the structure: what it's about, main points with pages, figures, deadlines by date.",
                "Add the point “what the document does NOT address, even though you'd expect it to”. Usually the most valuable.",
                "Ban guessing: “where you're not sure of the location, write location not determined”.",
            ],
            "saves": "~30–90 min per document",
        },
    },
    {
        "slug": "ai-prvni-navrh-mailu",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "AI píše první verzi, vy finální",
            "meta": "AI · Všude",
            "keys": [],
            "lead": "Když model dostane jen příchozí zprávu, domýšlí předvídatelně špatně. Dobré zadání drží čtyři věci: komu — co chci — tón — délka.",
            "steps": [
                "Komu: typ vztahu, ne jméno. Dlouholetý klient, kolega o dvě úrovně výš, protistrana ve sporu.",
                "Co chci: výsledek u příjemce, ne téma. Je to nejsilnější řádek celého briefu.",
                "Tón: jedno až dvě přesná slova. „Věcně, bez omluv.“ Vyhněte se „profesionálně“.",
                "Délka: „max 6 vět“. Bez ní model píše dlouho. A pak platí: AI navrhuje, odesíláte vy.",
            ],
            "saves": "~30 min denně",
        },
        "en": {
            "title": "AI writes the first draft, you write the final one",
            "meta": "AI · Everywhere",
            "keys": [],
            "lead": "Given only the incoming message, the model guesses predictably wrong. A good request holds four things: who — what I want — tone — length.",
            "steps": [
                "Who: the relationship type, not a name. A longtime client, a colleague two levels up, an opposing party.",
                "What I want: the recipient's outcome, not the topic. The single strongest line in the brief.",
                "Tone: one or two precise words. “Matter-of-fact, no apologies.” Avoid “professional”.",
                "Length: “max 6 sentences”. Without it the model writes long. And then: AI drafts, you send.",
            ],
            "saves": "~30 min a day",
        },
    },
    {
        "slug": "ai-zapis-z-porady",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "Z nahrávky porady zápis s úkoly za minutu",
            "meta": "AI · Všude",
            "keys": [],
            "lead": "Zápis musí být strukturovaný podle typu obsahu, ne podle pořadí, v jakém se mluvilo. Stačí tři kategorie, ale oddělené tvrdě.",
            "steps": [
                "Rozhodnutí: jen to, co bylo uzavřeno — znění jednou větou, kdo rozhodl, jaké varianty se zvažovaly.",
                "Úkoly jako tabulka: úkol | vlastník (jedno jméno, nikdy „tým“) | termín | z čeho vyplývá.",
                "Otevřené body: o čem se mluvilo a nedospělo se k závěru. Nejcennější část zápisu.",
                "Zakažte domýšlení: „kde termín nezazněl, napiš TERMÍN NEZAZNĚL, nevymýšlej ho“.",
            ],
            "saves": "~30 min na poradu",
        },
        "en": {
            "title": "From a meeting recording to notes with tasks in a minute",
            "meta": "AI · Everywhere",
            "keys": [],
            "lead": "Notes need to be structured by content type, not by the order things were said. Three categories are enough — kept strictly separate.",
            "steps": [
                "Decisions: only what was actually closed — one declarative sentence, who decided, what was weighed.",
                "Tasks as a table: task | owner (one name, never “the team”) | deadline | where it comes from.",
                "Open items: what was discussed with no conclusion. The most valuable part of the notes.",
                "Ban guessing: “where no deadline was stated, write DEADLINE NOT STATED, don't invent one”.",
            ],
            "saves": "~30 min per meeting",
        },
    },
    {
        "slug": "ai-overovani-faktu",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "AI si vymýšlí s jistotou v hlase. Ověřujte",
            "meta": "AI · Všude",
            "keys": [],
            "lead": "Pravidlo, které si novináři vypěstovali dávno před AI: klíčové tvrzení potřebuje dva nezávislé zdroje, ostatní tvrzení jeden.",
            "steps": [
                "Klíčové je to, na čem stojí závěr nebo co vede k rozhodnutí o penězích. Bývají tři až pět, ne třicet.",
                "Nezávislé znamená, že údaj vznikl dvěma cestami, které o sobě nevědí. Dva články z jedné tiskové zprávy jsou jeden zdroj.",
                "Držte se hierarchie: primární zdroj — studie, oficiální statistika, plné znění — je vždy nejlepší.",
                "Odkazy skutečně otevřete. Model občas ocituje stránku, na které tvrzení vůbec není.",
            ],
            "saves": "reputace",
        },
        "en": {
            "title": "AI makes things up with total confidence. Verify it",
            "meta": "AI · Everywhere",
            "keys": [],
            "lead": "A rule journalists developed long before AI existed: a key claim needs two independent sources, everything else needs one.",
            "steps": [
                "A key claim is one the conclusion rests on, or that leads to a decision about money. Usually three to five, not thirty.",
                "Independent means the figure arose through two paths that don't know about each other. Two articles from one press release are one source.",
                "Follow the hierarchy: a primary source — the study, official statistics, the full text — is always best.",
                "Actually open the links. The model sometimes cites a page the claim isn't on at all.",
            ],
            "saves": "reputation",
        },
    },
    {
        "slug": "mac-live-text",
        "cat_label": {"cs": "ai", "en": "ai"},
        "cs": {
            "title": "Kopírujte text z obrázků a fotek",
            "meta": "AI · macOS",
            "keys": ["Cmd", "C"],
            "lead": "macOS umí označit text na fotce nebo screenshotu jako běžný text. Telefonní číslo z fotky vizitky zkopírujete na dva kliky.",
            "steps": [
                "Otevřete obrázek v Náhledu, ve Fotkách, nebo si ho jen prohlédněte v Quick Looku.",
                "Najeďte kurzorem na text v obrázku — kurzor se změní ze šipky na textový.",
                "Označte pasáž tažením, stiskněte Cmd+C a vložte, kam potřebujete.",
                "Rozpoznávání běží v zařízení, obrázek se nikam neodesílá. U smluv a dokladů je to bezpečnější než online služby.",
            ],
            "saves": "~5 min týdně",
        },
        "en": {
            "title": "Copy text right out of images and photos",
            "meta": "AI · macOS",
            "keys": ["Cmd", "C"],
            "lead": "macOS can select text in a photo or screenshot just like regular text. Grab a phone number off a photo of a business card in two clicks.",
            "steps": [
                "Open the image in Preview, in Photos, or just look at it in Quick Look.",
                "Hover your cursor over text in the image — it switches from an arrow to a text cursor.",
                "Select the passage by dragging, press Cmd+C and paste it wherever you need it.",
                "Recognition runs on the device and the image is never sent anywhere — safer than online services.",
            ],
            "saves": "~5 min a week",
        },
    },
    {
        "slug": "tri-hlavni-ukoly",
        "cat_label": {"cs": "workflow", "en": "workflow"},
        "cs": {
            "title": "Tři úkoly dne: ráno vyberte, večer zkontrolujte",
            "meta": "Workflow · Všude",
            "keys": [],
            "lead": "Ne seznam dvaceti položek, ale tři věci, které dnes musí ven. Všechno ostatní je bonus.",
            "steps": [
                "Ráno, nebo ještě lépe večer předchozího dne, vyberte tři úkoly. Ne víc.",
                "Kritérium: kdyby se dnes stihly jen tyhle tři, den byl dobrý, i kdyby zbytek zůstal netknutý.",
                "Největší z těch tří si dejte jako první, dokud máte nejvíc energie a soustředění.",
                "Večer dvě minuty zpětné vazby a nedokončený úkol přesuňte na konkrétní den, ne zpátky do seznamu.",
            ],
            "saves": "~1 h denně",
        },
        "en": {
            "title": "Three tasks for the day: pick in the morning, check in the evening",
            "meta": "Workflow · Everywhere",
            "keys": [],
            "lead": "Not a list of twenty items, but three things that absolutely must get done today. Everything else is a bonus.",
            "steps": [
                "In the morning — or better, the evening before — pick three tasks. No more.",
                "The criterion: if only these three get done today, it was a good day, even if the rest goes untouched.",
                "Put the biggest of the three first, while you still have the most energy and focus.",
                "In the evening, two minutes of review, and move anything unfinished to a specific day, not back to the list.",
            ],
            "saves": "~1 h a day",
        },
    },
    {
        "slug": "email-dvouminutove-pravidlo",
        "cat_label": {"cs": "workflow", "en": "workflow"},
        "cs": {
            "title": "Dvouminutové pravidlo pro inbox",
            "meta": "Workflow · Všude",
            "keys": [],
            "lead": "Co zabere méně než dvě minuty, udělejte hned při čtení. Delší věci pošlete do úkolovníku — a mail archivujte.",
            "steps": [
                "Mail otevřete jen tehdy, když máte reálně čas s ním něco udělat.",
                "Pod dvě minuty — krátká odpověď, přeposlání, potvrzení — vyřešte hned a mail archivujte.",
                "Nad dvě minuty založte úkol s termínem a mail archivujte. Nezůstává v inboxu jako připomínka.",
                "Cíl je inbox, který po projití zůstane prázdný: každá zpráva už má své místo.",
            ],
            "saves": "~20 min denně",
        },
        "en": {
            "title": "The two-minute rule for your inbox",
            "meta": "Workflow · Everywhere",
            "keys": [],
            "lead": "Anything that takes less than two minutes, do right when you read it. Longer things go to your task list — and archive the email.",
            "steps": [
                "Only open an email when you actually have time to do something about it.",
                "Under two minutes — a short reply, a forward, a confirmation — handle it now and archive it.",
                "Over two minutes, create a task with a deadline and archive the email. It doesn't stay as a reminder.",
                "The goal is an inbox that ends up empty: every message already has its place.",
            ],
            "saves": "~20 min a day",
        },
    },
    {
        "slug": "kalendar-bloky-prace",
        "cat_label": {"cs": "workflow", "en": "workflow"},
        "cs": {
            "title": "Blokujte si v kalendáři čas na soustředěnou práci",
            "meta": "Workflow · Všude",
            "keys": [],
            "lead": "Prázdný kalendář je pozvánka na schůzky. Zablokujte si dopoledne na hlubokou práci dřív, než to udělá někdo jiný.",
            "steps": [
                "Na začátku týdne určete dva až tři bloky po 90 minutách na klíčovou práci.",
                "Vytvořte je jako běžné události v kalendáři, ne jen jako poznámku vedle.",
                "Pojmenujte blok konkrétně: „Návrh rozpočtu Q4“, ne obecné „Focus time“.",
                "Nastavte stav Zaneprázdněn — teprve to zajistí, že vás kolegové při hledání termínu přeskočí.",
            ],
            "saves": "~2 h týdně",
        },
        "en": {
            "title": "Block off calendar time for focused work",
            "meta": "Workflow · Everywhere",
            "keys": [],
            "lead": "An empty calendar is an invitation to meetings. Block off your mornings for deep work before someone else does it for you.",
            "steps": [
                "At the start of the week, pick two or three 90-minute blocks for your most important work.",
                "Create them as real calendar events, not just a note off to the side.",
                "Name the block specifically: “Q4 Budget Draft”, not a generic “Focus time”.",
                "Set the status to Busy — that's what makes colleagues' scheduling tools skip past it.",
            ],
            "saves": "~2 h a week",
        },
    },
    {
        "slug": "tydenni-prehled",
        "cat_label": {"cs": "workflow", "en": "workflow"},
        "cs": {
            "title": "Týdenní přehled: 30 minut, které řídí celý týden",
            "meta": "Workflow · Všude",
            "keys": [],
            "lead": "V pátek nebo v neděli projděte kalendář, úkoly a poznámky. Zavřete resty, naplánujte tři priority — a pondělí začne jasně.",
            "steps": [
                "Zvolte stálý čas a držte se ho: pátek kolem 15:00 nebo neděle večer, 30 minut bez rušení.",
                "Projděte minulý týden, nadcházející kalendář a celý úkolovník napříč projekty.",
                "Vyberte tři priority týdne. Kdyby se stihly jen ty tři, byl to dobrý týden?",
                "Prioritám rovnou přiřaďte bloky v kalendáři, ne jen záznam v seznamu úkolů.",
            ],
            "saves": "~30 min týdně",
        },
        "en": {
            "title": "The weekly review: 30 minutes that run your whole week",
            "meta": "Workflow · Everywhere",
            "keys": [],
            "lead": "On Friday or Sunday, go through your calendar, tasks and notes. Close out loose ends, plan three priorities — and Monday starts with clarity.",
            "steps": [
                "Pick a fixed time and stick to it: Friday around 3 p.m. or Sunday evening, 30 minutes uninterrupted.",
                "Review last week, the upcoming calendar, and your entire task manager across all projects.",
                "Pick three priorities for the week. If only those three got done, was it a good week?",
                "Give the priorities specific blocks in your calendar, not just an entry on a task list.",
            ],
            "saves": "~30 min a week",
        },
    },
    {
        "slug": "mobil-sedy-rezim",
        "cat_label": {"cs": "workflow", "en": "workflow"},
        "cs": {
            "title": "Šedý displej: telefon bez barev láká o polovinu míň",
            "meta": "Workflow · Mobil",
            "keys": [],
            "lead": "Odstíny šedi udělají z telefonu nástroj místo automatu na dopamin. Ideální na pracovní bloky.",
            "steps": [
                "iOS: Zpřístupnění → Obrazovka a velikost textu → Barevné filtry → Odstíny šedi.",
                "Android: Zpřístupnění → Korekce barev → Stupně šedi (umístění se liší podle výrobce).",
                "Přidejte si přepínač do rychlých voleb nebo na trojí kliknutí bočního tlačítka.",
                "Používejte šedou cíleně na pracovní bloky a přepínejte zpět na fotky a navigaci.",
            ],
            "saves": "~30 min denně",
        },
        "en": {
            "title": "Grayscale mode: a colorless phone is half as tempting",
            "meta": "Workflow · Mobile",
            "keys": [],
            "lead": "Grayscale turns your phone into a tool instead of a dopamine machine. Ideal for focus blocks.",
            "steps": [
                "iOS: Accessibility → Display & Text Size → Color Filters → Grayscale.",
                "Android: Accessibility → Color correction → Grayscale (location varies by manufacturer).",
                "Add a toggle to your quick settings, or a triple-click shortcut on the side button.",
                "Use grayscale deliberately during focus blocks and switch back for photos and navigation.",
            ],
            "saves": "~30 min a day",
        },
    },
    {
        "slug": "gmail-zrusit-odeslani",
        "cat_label": {"cs": "komunikace", "en": "communication"},
        "cs": {
            "title": "30 vteřin na vrácení odeslaného mailu",
            "meta": "Komunikace · Gmail",
            "keys": [],
            "lead": "Gmail umí odeslání „podržet“ až 30 vteřin. Překlep v adresátovi nebo zapomenutá příloha přestanou být katastrofa.",
            "steps": [
                "Otevřete Nastavení → Zobrazit všechna nastavení.",
                "V sekci Obecné najděte Zrušit odeslání a nastavte 30 vteřin, nejdelší možnou hodnotu.",
                "Uložte změny tlačítkem dole na stránce.",
                "Po každém odeslání se vlevo dole objeví lišta s tlačítkem Zrušit — mail se vrátí do konceptů.",
            ],
            "saves": "reputace",
        },
        "en": {
            "title": "30 seconds to undo a sent email",
            "meta": "Communication · Gmail",
            "keys": [],
            "lead": "Gmail can “hold” sending for up to 30 seconds. A typo in the recipient or a forgotten attachment stops being a disaster.",
            "steps": [
                "Open Settings → See all settings.",
                "In the General section, find Undo Send and set 30 seconds, the maximum available.",
                "Save your changes with the button at the bottom of the page.",
                "After every send, an Undo bar appears in the bottom left — the email returns to drafts.",
            ],
            "saves": "reputation",
        },
    },
    {
        "slug": "slack-ctrl-k-prepinac",
        "cat_label": {"cs": "komunikace", "en": "communication"},
        "cs": {
            "title": "Slack: Ctrl+K skáče na kanál i kolegu",
            "meta": "Komunikace · Slack",
            "keys": ["Ctrl", "K"],
            "lead": "Rychlý přepínač najde kanál, zprávu i člověka na pár písmen. Nejdůležitější zkratka Slacku.",
            "steps": [
                "Stiskněte Ctrl+K (na Macu Cmd+K) kdekoli ve Slacku, nemusíte být v konkrétním kanálu.",
                "Pište část názvu kanálu nebo jméno kolegy. Přepínač našeptává už po prvních písmenech.",
                "Šipkami vyberte z nabídky a Enterem potvrďte. Slack vás přenese rovnou tam.",
                "Najde i soukromé skupinové konverzace — je to univerzální vstupní bod do čehokoli.",
            ],
            "saves": "~5 min denně",
        },
        "en": {
            "title": "Slack: Ctrl+K jumps to any channel or teammate",
            "meta": "Communication · Slack",
            "keys": ["Ctrl", "K"],
            "lead": "The quick switcher finds a channel, a message or a person in a few keystrokes. Slack's single most important shortcut.",
            "steps": [
                "Press Ctrl+K (Cmd+K on a Mac) anywhere in Slack — no need to be in a particular channel.",
                "Type part of a channel name or a colleague's name. It suggests matches after a few letters.",
                "Use the arrow keys to pick from the suggestions and press Enter. Slack takes you straight there.",
                "It finds private group conversations too — a universal entry point into anything in Slack.",
            ],
            "saves": "~5 min a day",
        },
    },
    {
        "slug": "outlook-pravidla",
        "cat_label": {"cs": "komunikace", "en": "communication"},
        "cs": {
            "title": "Pravidla v Outlooku: pošta se třídí sama",
            "meta": "Komunikace · Outlook",
            "keys": [],
            "lead": "Automatická pravidla přesunou notifikace ze systémů, reporty a kopie do složek. Inbox zůstane jen pro skutečné zprávy.",
            "steps": [
                "Klikněte pravým tlačítkem na zprávu a vyberte Pravidla → Vytvořit pravidlo…",
                "Nastavte podmínku: nejčastěji podle odesílatele nebo podle slov v předmětu.",
                "Jako akci zvolte přesun do složky; složku můžete rovnou v tom kroku založit.",
                "Notifikace ze systémů sveďte do jedné složky a projděte je jednou denně dávkově.",
            ],
            "saves": "~10 min denně",
        },
        "en": {
            "title": "Outlook rules: let your inbox sort itself",
            "meta": "Communication · Outlook",
            "keys": [],
            "lead": "Automatic rules move system notifications, reports and CCs into folders. Your inbox stays reserved for messages that actually need you.",
            "steps": [
                "Right-click a message and choose Rules → Create Rule…",
                "Set the condition: most often the sender, or keywords in the subject line.",
                "Choose “move to folder” as the action; you can create the folder right in that step.",
                "Route system notifications into one catch-all folder and check it once a day in a batch.",
            ],
            "saves": "~10 min a day",
        },
    },
    {
        "slug": "teams-zminky-aktivita",
        "cat_label": {"cs": "komunikace", "en": "communication"},
        "cs": {
            "title": "Filtrujte aktivitu v Teams jen na @zmínky",
            "meta": "Komunikace · Teams",
            "keys": [],
            "lead": "Kanál Aktivita umí ukázat jen zprávy, kde vás někdo zmínil. Zbytek je většinou šum.",
            "steps": [
                "Otevřete Aktivita v levém postranním panelu Teams.",
                "V horní části panelu klikněte na filtr a vyberte @zmínky.",
                "Projděte je a rovnou odpovězte. Je to seznam přesně toho, co od vás někdo konkrétně čeká.",
                "Zbytek aktivity odbavte dávkově jednou nebo dvakrát denně v pevně vyhrazeném čase.",
            ],
            "saves": "~10 min denně",
        },
        "en": {
            "title": "Filter your Teams activity down to just @mentions",
            "meta": "Communication · Teams",
            "keys": [],
            "lead": "The Activity feed can show only messages where someone mentioned you. Everything else is mostly noise.",
            "steps": [
                "Open Activity in the Teams left sidebar.",
                "Click the filter at the top of the panel and choose @Mentions.",
                "Go through them and reply right away. It's exactly what someone is waiting on from you.",
                "Handle the rest of the activity in batches, once or twice a day at a set time.",
            ],
            "saves": "~10 min a day",
        },
    },
    {
        "slug": "noise-cancelling-sluchatka",
        "cat_label": {"cs": "hardware", "en": "hardware"},
        "cs": {
            "title": "Sluchátka s potlačením hluku: soustředění i signál",
            "meta": "Hardware · Všude",
            "keys": [],
            "lead": "ANC sluchátka řeší dva problémy najednou: hluk okolí a kolegy, kteří nepoznají, že nemáte být rušeni.",
            "steps": [
                "Vyberte si sluchátka s aktivním potlačením hluku (ANC), ne jen s fyzickým odhlučněním.",
                "Připravte si playlisty podle režimu práce: na hloubkovou koncentraci instrumentálku nebo bílý šum bez textu.",
                "Berte nasazená sluchátka jako vizuální signál „nerušit“ — týmu to jednou řekněte nahlas.",
                "Nabíjejte je ve chvílích, kdy je stejně nepoužíváte. Vybitá sluchátka jsou nejčastější důvod, proč lidé návyk vzdají.",
            ],
            "saves": "~30 min denně",
        },
        "en": {
            "title": "Noise-cancelling headphones: focus and a signal, both at once",
            "meta": "Hardware · Everywhere",
            "keys": [],
            "lead": "ANC headphones solve two problems at once: ambient noise, and coworkers who can't tell you don't want to be disturbed.",
            "steps": [
                "Choose headphones with active noise cancellation (ANC), not just physical isolation.",
                "Prepare playlists by work mode: instrumental music or white noise with no lyrics for deep focus.",
                "Treat headphones on your head as a visual “do not disturb” signal — tell your team once.",
                "Charge them when you're not using them anyway. Dead headphones are why people give up the habit.",
            ],
            "saves": "~30 min a day",
        },
    },
    {
        "slug": "monitor-vyska-oci",
        "cat_label": {"cs": "hardware", "en": "hardware"},
        "cs": {
            "title": "Horní hrana monitoru do výšky očí",
            "meta": "Hardware · Všude",
            "keys": [],
            "lead": "Krk bolí z monitoru, který je moc nízko. Podložka nebo rameno za pár stovek vyřeší roky nepohodlí.",
            "steps": [
                "Horní hrana displeje má být zhruba ve výšce očí, když sedíte vzpřímeně, na délku natažené paže.",
                "Notebook podložte stojanem. Poslouží i pevná krabice nebo silnější knihy, pokud to drží.",
                "Připojte externí klávesnici a myš, aby ruce zůstaly v přirozené poloze na úrovni loktů.",
                "I ideální poloha škodí bez pohybu — vstaňte a protáhněte se přibližně jednou za hodinu.",
            ],
            "saves": "zdravá záda",
        },
        "en": {
            "title": "Top edge of your monitor at eye level",
            "meta": "Hardware · Everywhere",
            "keys": [],
            "lead": "A neck that hurts from a monitor set too low. A stand or arm for a few dollars fixes years of discomfort.",
            "steps": [
                "The top edge should be roughly at eye level when you sit upright, at arm's length from the screen.",
                "Raise your laptop on a stand. A sturdy box or thick books work too, as long as they're stable.",
                "Connect an external keyboard and mouse so your hands stay in a natural position at elbow level.",
                "Even the ideal position is harmful without movement — stand and stretch roughly once an hour.",
            ],
            "saves": "healthy back",
        },
    },
]

OUTPUTS = {
    "cs": "public/ebook/produktivni-top-30-tipu.pdf",
    "en": "public/ebook/productive-top-30-tips.pdf",
}


def main() -> None:
    parser = argparse.ArgumentParser(description="Sestaví e-book Top 30 tipů.")
    parser.add_argument("--lang", choices=["cs", "en", "all"], default="all")
    args = parser.parse_args()

    assert len(TIPS) == 30, f"Očekáváno 30 tipů, nalezeno {len(TIPS)}"
    register_fonts()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    locales = ["cs", "en"] if args.lang == "all" else [args.lang]
    for locale in locales:
        out = os.path.join(root, OUTPUTS[locale])
        os.makedirs(os.path.dirname(out), exist_ok=True)
        pages, size = build(locale, out)
        print(f"{OUTPUTS[locale]}: {pages} stran, {size / 1024:.0f} kB")


if __name__ == "__main__":
    main()
