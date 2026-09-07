# Archiv newsletteru — šablona čísla

Pracovní podklad pro rubriku `/newsletter/archiv`. Tenhle soubor se nikde
nepublikuje — loader `lib/newsletter.ts` čte z téhle složky jen soubory `.mdx`.

**Pravidlo číslo jedna: do archivu patří jen to, co skutečně odešlo.** Žádná
čísla dopředu, žádné „ukázkově dopsané" vydání. Na ukázku, jak číslo vypadá,
slouží `/newsletter/ukazka` (zdroj `content/newsletter-ukazka.md`).

## Jak přidat číslo

Po rozeslání uložte jeho kopii sem jako `content/newsletter/<slug>.mdx`,
anglickou mutaci do `content/en/newsletter/<slug>.mdx`. Archiv, sitemapa
i `/llms.txt` se doplní samy.

Slug volte podle tématu, ne podle pořadí (`zapis-z-porady-za-minutu`, ne
`cislo-12`) — adresa pak dává smysl i za dva roky.

## Frontmatter

```
---
number: 12                 # pořadové číslo vydání
subject: "Předmět e-mailu" # slouží i jako titulek stránky a v OG kartě
preheader: "Náhledový text — v archivu funguje jako perex."
date: "YYYY-MM-DD"         # den rozeslání
---
```

Nepovinně `minutes:` — bez něj se čas čtení spočítá z délky textu.

## Tělo

Markdown přesně tak, jak číslo odešlo: oslovení, `## Tip týdne`, odkazy,
prompt v kódovém bloku (dostane tlačítko „zkopírovat"), rozloučení.
Patičku s odhlášením do souboru nekopírujte — na webu nedává smysl.
