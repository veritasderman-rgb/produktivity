# Rubrika „Co se změnilo" — formát záznamů

Changelog **dopadů, ne novinek**. Každý záznam říká: co se změnilo ve světě AI
nástrojů → kterých návodů na webu se to týká → co jsme s tím udělali. Novinky
bez dopadu na existující obsah sem nepatří (ty patří do `content/ai/`).

## Soubor

Jeden záznam = jeden soubor `YYYY-MM-DD-nazev.md` (kebab-case, bez diakritiky).
Načítá je `lib/changes.ts`, zobrazuje `app/[locale]/zmeny/page.tsx`.

## Frontmatter

```yaml
---
date: "2026-08-15"            # datum záznamu (YYYY-MM-DD), řadí se od nejnovějšího
title: "Titulek česky"
titleEn: "Title in English"
zdroj: "https://…"            # URL oficiálního zdroje (dokumentace, ceník, repozitář); nepovinné
slugs:                        # slugy dotčených tipů z content/tipy/ (bez .mdx)
  - "nazev-tipu"
akce: "overeno"               # overeno | aktualizovano | novy-navod
---
```

- `slugs` se při buildu validují proti `content/tipy/` — neexistující slug
  vypíše `console.warn` a odkaz se vynechá.
- `akce` říká, co jsme se změnou udělali:
  - `overeno` — článek změnu už popisuje správně, jen jsme to ověřili,
  - `aktualizovano` — článek jsme kvůli změně upravili,
  - `novy-navod` — změna byla důvodem k napsání nového návodu.

## Tělo

2–5 vět česky, pak oddělovač `---EN---` na samostatném řádku, pak totéž anglicky.
Prostý text (bez MDX komponent). Formulace musí tvrdit **totéž co dotčený
článek** — před zápisem si přečtěte relevantní pasáž; changelog a článek si
nesmí protiřečit.

```markdown
Co se změnilo a co to znamená pro čtenáře. Co jsme s tím udělali.

---EN---

What changed and what it means for the reader. What we did about it.
```
