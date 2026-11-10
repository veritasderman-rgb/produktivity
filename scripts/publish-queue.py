#!/usr/bin/env python3
"""Vypíše frontu publikování: články, které mají `date` v budoucnu.

Web takové články neukáže, dokud jejich den nenastane (lib/publish.ts).
Skript slouží rutině i člověku: ukáže, co čeká, kdy vyjde a které
nejbližší pracovní dny jsou ještě volné.

  python3 scripts/publish-queue.py            # fronta + 10 volných pracovních dnů
  python3 scripts/publish-queue.py --free 5   # jiný počet volných dnů
"""
import argparse
import datetime as dt
import re
from pathlib import Path
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parent.parent / "content"
SECTIONS = ["tipy", "ai", "agenti"]
DATE_RE = re.compile(r'^date:\s*["\']?(\d{4}-\d{2}-\d{2})', re.M)
TITLE_RE = re.compile(r'^title:\s*["\']?(.+?)["\']?\s*$', re.M)
DAYS = ["po", "út", "st", "čt", "pá", "so", "ne"]


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("--free", type=int, default=10, help="kolik volných pracovních dnů vypsat")
    args = ap.parse_args()

    today = dt.datetime.now(ZoneInfo("Europe/Prague")).date()
    queue = []
    for section in SECTIONS:
        for f in sorted((ROOT / section).glob("*.mdx")):
            head = f.read_text(encoding="utf-8").split("\n---", 1)[0]
            m = DATE_RE.search(head)
            if not m:
                continue
            day = dt.date.fromisoformat(m.group(1))
            if day > today:
                t = TITLE_RE.search(head)
                queue.append((day, section, f.stem, t.group(1) if t else ""))

    print(f"Dnes (Praha): {today.isoformat()}")
    if not queue:
        print("Fronta je prázdná.")
    else:
        print(f"Ve frontě: {len(queue)}")
        for day, section, slug, title in sorted(queue):
            print(f"  {day.isoformat()} {DAYS[day.weekday()]}  {section}/{slug}  — {title}")

    taken = {day for day, *_ in queue}
    free, day = [], today
    while len(free) < args.free:
        day += dt.timedelta(days=1)
        if day.weekday() < 5 and day not in taken:
            free.append(day)
    print("Nejbližší volné pracovní dny:")
    print("  " + ", ".join(f"{d.isoformat()} ({DAYS[d.weekday()]})" for d in free))


if __name__ == "__main__":
    main()
