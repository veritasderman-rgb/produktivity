#!/usr/bin/env python3
"""QA kontrola mega-článků: délka, kódové bloky, cizí písmena, frontmatter.

Použití: python3 scripts/qa-mega.py <slug> [<slug>…]
Kontroluje content/tipy/<slug>.mdx (a content/en/tipy/<slug>.mdx, pokud existuje).
"""
import re
import sys
import os

FOREIGN = re.compile(r"[Ѐ-ӿ一-鿿぀-ヿ가-힯Ͱ-Ͽ]")

def check(path, min_len=18000, max_len=100000):
    problems = []
    with open(path, encoding="utf-8") as f:
        t = f.read()
    parts = t.split("---", 2)
    if len(parts) < 3:
        return [f"{path}: chybí frontmatter"]
    body = parts[2]
    if not (min_len <= len(body) <= max_len):
        problems.append(f"{path}: délka těla {len(body)} mimo rozsah {min_len}–{max_len}")
    if t.count("```") % 2 != 0:
        problems.append(f"{path}: lichý počet ``` ohrazení")
    # H1 kontrola jen mimo kódové bloky (ukázky struktury .md souborů jsou legitimní)
    outside_fences = re.sub(r"```.*?```", "", t, flags=re.S)
    if re.search(r"^# ", outside_fences, re.M):
        problems.append(f"{path}: obsahuje H1 mimo kódový blok")
    m = FOREIGN.search(t)
    if m:
        problems.append(f"{path}: cizí písmeno {m.group()!r} na pozici {m.start()}")
    if re.search(r"<\w+@", t):
        problems.append(f"{path}: e-mail ve špičatých závorkách")
    prompts = len(re.findall(r"^```text", t, re.M))
    print(f"OK {path}: tělo {len(body)} zn., {prompts} promptů, {t.count('```')//2} kódových bloků")
    return problems

def main():
    all_problems = []
    for slug in sys.argv[1:]:
        for base in ("content/tipy", "content/en/tipy"):
            p = f"{base}/{slug}.mdx"
            if os.path.exists(p):
                all_problems += check(p)
    if all_problems:
        print("\nPROBLÉMY:")
        for p in all_problems:
            print(" -", p)
        sys.exit(1)
    print("\nVše v pořádku.")

if __name__ == "__main__":
    main()
