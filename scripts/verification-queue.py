#!/usr/bin/env python3
"""Fronta článků k ověření faktů proti živým nástrojům.

Vypíše velké návody (tělo > 18 000 znaků, hranice shodná s `isGuide`
v lib/tips.ts) seřazené podle pole `tested` vzestupně: články bez `tested`
první (nikdy neověřeno), pak od nejstaršího ověření. Pracuje nad českým
zdrojem pravdy `content/tipy/`.

Používá ho týdenní ověřovací rutina — postup běhu viz docs/OVEROVANI.md.
Skript pouze čte; pole `tested` zapisuje výhradně ověřovací běh po
skutečném ověření, nikdy plošně.

Použití:
    python3 scripts/verification-queue.py [--limit N]   # default 10, 0 = vše
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
TIPS_DIR = REPO / "content" / "tipy"

# Hranice velkého průvodce — drž v souladu s GUIDE_CHARS v lib/tips.ts.
GUIDE_CHARS = 18000

FIELD_RE = re.compile(r'^([A-Za-z_][\w-]*)\s*:\s*"?(.*?)"?\s*$')


def parse(path: Path) -> dict | None:
    """Vrátí {slug, title, category, tested, chars} nebo None (není guide / bez frontmatteru)."""
    text = path.read_text(encoding="utf-8")
    parts = text.split("---", 2)
    if len(parts) < 3:
        print(f"  ! {path.name}: chybí frontmatter", file=sys.stderr)
        return None
    body = parts[2]
    if len(body) < GUIDE_CHARS:
        return None
    fields = {}
    for line in parts[1].splitlines():
        m = FIELD_RE.match(line)
        if m:
            fields.setdefault(m.group(1), m.group(2))
    return {
        "slug": path.stem,
        "title": fields.get("title", "?"),
        "category": fields.get("category", "?"),
        "tested": fields.get("tested") or None,
        "chars": len(body),
    }


def main() -> int:
    ap = argparse.ArgumentParser(description="Fronta velkých návodů k ověření faktů.")
    ap.add_argument("--limit", type=int, default=10, help="kolik článků vypsat (default 10, 0 = vše)")
    args = ap.parse_args()

    if not TIPS_DIR.is_dir():
        print(f"Složka {TIPS_DIR} neexistuje.", file=sys.stderr)
        return 2

    guides = [g for f in sorted(TIPS_DIR.glob("*.mdx")) if (g := parse(f))]
    # Bez `tested` první (nikdy neověřeno), pak vzestupně od nejstaršího; remíza dle slugu.
    guides.sort(key=lambda g: (g["tested"] is not None, g["tested"] or "", g["slug"]))

    queue = guides if args.limit <= 0 else guides[: args.limit]
    never = sum(1 for g in guides if g["tested"] is None)
    print(f"Velkých návodů: {len(guides)}, bez ověření: {never}. Fronta ({len(queue)}):\n")
    for g in queue:
        tested = g["tested"] or "nikdy"
        print(f"  {g['slug']}\n    titul: {g['title']}\n    tested: {tested} · kategorie: {g['category']} · {g['chars']} zn.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
