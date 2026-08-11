# Redakční rutina Produktivni.cz

Instrukce pro automatizovanou denní session, která sbírá novinky a připravuje
obsah ke schválení. Tento soubor je jediný zdroj pravdy pro chování rutiny —
změny chování dělejte úpravou tohoto souboru, ne úpravou triggeru.

## Cíl

Najít 2–5 skutečně nových, hodnotných tipů nebo AI novinek, napsat je ve
formátu webu a otevřít pull request ke schválení. **Nic se nepublikuje bez
lidského schválení (merge).**

**Dlouhodobý cíl: 500 tipů.** Web míří na ~500 kvalitních tipů; dokud jich je
méně, preferuj tipy před AI novinkami (novinky publikuj jen ty opravdu
podstatné). Kvalita má vždy přednost — 2 dobré tipy jsou lepší než 5 slabých.
Sleduj pokrytí filtrů: kategorie, platformy (hlavně macOS a mobil bývají
podreprezentované) i cílovky (manažeři, studenti, vývojáři, freelanceři) mají
růst rovnoměrně.

## Postup

### 1. Poznej stav webu

- Projdi existující slugy v `content/tipy/` a `content/ai/` — co už máme.
- Přečti si 2–3 existující soubory, ať znáš formát a tón (osobní, česky,
  bez balastu, tykání webu „vy", konkrétní čísla, žádný marketingový vzduch).

### 2. Sběr novinek

Prohledej internet (WebSearch) v těchto oblastech (anglicky i česky, poslední ~týden):

- nové funkce AI nástrojů relevantní pro produktivitu (ChatGPT, Claude, Gemini,
  Copilot, Notion AI, Perplexity…)
- novinky v produktivních aplikacích (Todoist, Notion, Obsidian, Trello, kalendáře)
- nové klávesové zkratky / funkce Windows, macOS, prohlížečů
- zajímavé studie o produktivitě, soustředění, spánku
- nové gadgety pro soustředění a ergonomii

### 3. Filtr

Publikuj jen to, co projde všemi třemi síty:

1. **Nové** — není pokryto existujícím obsahem (zkontroluj slugy i podobná témata).
2. **Užitečné pro české publikum** — běžný znalostní pracovník to použije do týdne.
3. **Ověřené** — minimálně jeden důvěryhodný zdroj; u AI funkcí ověř, že je
   funkce skutečně dostupná (ne jen oznámená na neurčito).

Když nic neprojde, **neotvírej PR** — kvalita má přednost před frekvencí.
Ukonči session poznámkou, co bylo zváženo a proč to neprošlo.

### 4. Tvorba obsahu

**Tip** (`content/tipy/<slug>.mdx`) — krátký, okamžitě použitelný:

```
---
title: "…"
excerpt: "1–2 věty, co to dělá a proč to chtít."
category: "zkratky" | "aplikace" | "ai" | "workflow" | "komunikace" | "hardware"
platform: "windows" | "mac" | "vsude" | "prohlizec" | "mobil"
audience: []        # pro koho hlavně: "manazer" | "student" | "vyvojar" | "freelancer"
                    # prázdné [] = pro všechny; vyplňuj jen když tip cílí na roli
keys: []            # nebo [["Win","V"]] pro zkratky
saves: "~X min denně"
date: "YYYY-MM-DD"  # dnešní datum
---

Úvodní háček (1–2 věty).

## Jak na to

Kroky nebo odrážky. Klávesy jako <kbd>Win</kbd> + <kbd>V</kbd>.

## Pro tip

Bonusová finta navíc (volitelné).
```

**AI novinka** (`content/ai/<slug>.mdx`) — novinka přeložená do praxe:

```
---
title: "…"
excerpt: "Co se stalo a proč vás to zajímá."
date: "YYYY-MM-DD"
source: "https://…"       # hlavní zdroj
sourceName: "Název zdroje"
minutes: 3
---

**Co se stalo:** 1–2 odstavce faktů.

**Co to znamená pro vás:** konkrétní dopad na běžnou práci.

**Jak to vyzkoušet ještě dnes:** kroky 1-2-3.
```

V obou formátech lze používat infografiky `<Stats>`, `<Timeline>`, `<Bars>`,
`<Flow>`, `<Matrix>`, `<Donut>` — viz existující kapitoly v `content/prirucka/`.
Používej je střídmě a jen když nesou data.

### 5. Kontrola

- `npm install && npm run build` musí projít bez chyb.
- Diakritika, formát frontmatteru, unikátní slug.

### 6. Pull request

- Větev: `rutina/obsah-YYYY-MM-DD` ze **stávající výchozí větve**.
- Nikdy netlač přímo do výchozí větve.
- PR (ready for review) s popisem:
  - co přidáváš a proč (1 odstavec na položku),
  - zdroje,
  - **návrhy social postů** pro LinkedIn (profesionální tón) a Instagram/Facebook
    (kratší, živější) ke každé položce — k ručnímu vložení do Bufferu.

### 7. Limity

- Max 5 položek na den, radši 2 kvalitní než 5 slabých.
- Žádné velké refaktory, žádné změny kódu webu — jen obsah v `content/`.
- Nikdy neuváděj nepravdivé údaje; čísla jen se zdrojem.
- **Bezpečnost dat:** u AI obsahu, který vybízí k nahrávání či vkládání dat
  do AI nástrojů, vždy připomeň opatrnost — žádné osobní údaje, klientská
  data ani interní dokumenty bez souhlasu firmy; citlivé údaje anonymizovat.
  (Web zobrazuje u AI obsahu automatický disclaimer, ale text tipu nesmí
  bezpečnost bagatelizovat ani jí protiřečit.)
- Na webu zatím **neuvádíme ceny školení** — žádné částky za školení do obsahu.
