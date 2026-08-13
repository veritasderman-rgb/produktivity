#!/usr/bin/env python3
"""Doplní `updated: "<datum>"` do frontmatteru všech .mdx v obsahových složkách.

Stopa aktuálnosti obsahu: každý tip a kapitola nese datum poslední revize.
Skript je idempotentní — soubory, které pole `updated` už mají, nechá být.
Mění se výhradně vložení jednoho řádku do frontmatteru; nic jiného
(pořadí polí, uvozovky, tělo článku, koncové řádky) se nepřepisuje.

Použití:
    python3 scripts/set-updated.py [--date 2026-08-12] [--dry-run]
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent

# (složka, pole, za které se `updated` vkládá)
TARGETS = [
    ("content/tipy", "date"),
    ("content/en/tipy", "date"),
    ("content/prirucka", "minutes"),
    ("content/en/prirucka", "minutes"),
]

DEFAULT_DATE = "2026-08-12"
FIELD_RE = re.compile(r"^([A-Za-z_][\w-]*)\s*:")


def frontmatter_bounds(lines: list[str]) -> tuple[int, int] | None:
    """Vrátí (start, end) indexy řádků `---` ohraničujících frontmatter."""
    if not lines or lines[0].rstrip("\n") != "---":
        return None
    for i in range(1, len(lines)):
        if lines[i].rstrip("\n") == "---":
            return 0, i
    return None


def process(path: Path, anchor: str, date: str, dry_run: bool) -> str:
    """Vloží `updated` do jednoho souboru. Vrací stav: added / skipped / error."""
    text = path.read_text(encoding="utf-8")
    lines = text.splitlines(keepends=True)

    bounds = frontmatter_bounds(lines)
    if bounds is None:
        print(f"  ! {path}: chybí frontmatter", file=sys.stderr)
        return "error"
    start, end = bounds

    fields = {}
    for i in range(start + 1, end):
        m = FIELD_RE.match(lines[i])
        if m:
            fields.setdefault(m.group(1), i)

    if "updated" in fields:
        return "skipped"

    at = fields.get(anchor)
    if at is None:
        print(f"  ! {path}: chybí pole `{anchor}`, vkládám na konec frontmatteru", file=sys.stderr)
        at = end - 1

    new_line = f'updated: "{date}"\n'
    lines.insert(at + 1, new_line)

    if not dry_run:
        path.write_text("".join(lines), encoding="utf-8")
    return "added"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--date", default=DEFAULT_DATE, help=f"ISO datum revize (výchozí {DEFAULT_DATE})")
    ap.add_argument("--dry-run", action="store_true", help="jen vypsat, nic nezapisovat")
    args = ap.parse_args()

    if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", args.date):
        print(f"Datum musí být ve tvaru YYYY-MM-DD, dostal jsem {args.date!r}", file=sys.stderr)
        return 2

    totals = {"added": 0, "skipped": 0, "error": 0}
    for rel, anchor in TARGETS:
        directory = REPO / rel
        if not directory.is_dir():
            print(f"{rel}: složka neexistuje, přeskakuji")
            continue
        counts = {"added": 0, "skipped": 0, "error": 0}
        for file in sorted(directory.glob("*.mdx")):
            counts[process(file, anchor, args.date, args.dry_run)] += 1
        for k in totals:
            totals[k] += counts[k]
        print(f"{rel}: {counts['added']} doplněno, {counts['skipped']} už mělo, {counts['error']} chyb")

    print(f"celkem: {totals['added']} doplněno, {totals['skipped']} už mělo, {totals['error']} chyb")
    return 1 if totals["error"] else 0


if __name__ == "__main__":
    sys.exit(main())
