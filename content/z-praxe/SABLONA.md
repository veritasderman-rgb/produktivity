# Šablona zpracování příspěvku „Z praxe"

Návod pro Ctrl, jak přepsat došlý příspěvek čtenáře do publikovatelné podoby.
Zdrojem je e-mail z formuláře na `/z-praxe` (pole: jméno/přezdívka, e-mail,
profese, „co jste vyřešili", „jak to děláte", nástroje). Hotový soubor patří do
`content/z-praxe/<slug>.mdx` (anglická verze do `content/en/z-praxe/<slug>.mdx`).

## Postup

1. Přečti celý příspěvek a ověř, že popisuje skutečný, opakovatelný postup.
   Když je vágní nebo neúplný, nepublikuje se — Josef autorovi napíše a doptá se.
2. Přepiš text do struktury níže. Přeskupuj a krať, ale **pouze z materiálu,
   který autor poslal**.
3. Ulož jako `.mdx` s frontmatterem (viz níže), slug z názvu bez diakritiky.
4. Josef text schválí a **před vydáním pošle autorovi náhled ke schválení**.
   Bez autorizace autora nevychází nic.

## Struktura článku

Frontmatter:

```yaml
---
title: "Krátký věcný titulek — co postup dělá, ne clickbait"
author: "Jméno nebo přezdívka přesně tak, jak ji autor poslal"
role: "Profese / obor z formuláře"
date: "RRRR-MM-DD"
excerpt: "1–2 věty: jaký problém a jak ho autor řeší. Bez superlativů."
tools: ["ChatGPT", "Excel"]
---
```

Tělo (H2 nadpisy, v tomhle pořadí):

1. **Situace** — kdo autor je (jen profese, žádné osobní detaily navíc) a jaký
   problém mu ujídal čas. Vychází z pole „co jste vyřešili".
2. **Postup krok za krokem** — číslovaný seznam z pole „jak to děláte".
   Konkrétní: co kam zadat, jak vypadá prompt, co se kontroluje ručně.
   Prompty a šablony do kódových bloků.
3. **Co to přineslo** — výsledek slovy autora. Čísla (ušetřený čas, počty)
   jen ta, která autor sám uvedl, a přesně tak, jak je uvedl.
4. **Nástroje** — krátký výčet s rolí každého nástroje v postupu.

## Redakční zásady

- **Zachovat hlas autora.** Krátí se délka, ne osobitost. Hovorové obraty
  a první osoba zůstávají; opravuje se jen pravopis a srozumitelnost.
- **Neopravovat názory.** Když autor píše, že mu Copilot nesedl nebo že Notion
  je zbytečně složitý, je to jeho zkušenost a v textu zůstane.
- **Fakticky nepřikrášlovat.** Žádné „ušetří hodiny denně", pokud to autor
  nenapsal. Výsledek se popisuje střízlivě a jen z dodaného materiálu.
- **Autor autorizuje.** Před vydáním dostane náhled a text vyjde až po jeho
  souhlasu. Připomínky autora mají přednost před redakčním vkusem.

## Co se NIKDY nedělá

- **Nevymýšlet detaily.** Chybí-li krok, nástroj nebo kontext, doptat se
  autora — nikdy nedomýšlet, „jak to asi dělá".
- **Neměnit čísla.** Časy, částky, počty a verze nástrojů zůstávají přesně
  podle autora. Nezaokrouhlovat „aby to líp znělo", nedopočítávat úspory.
- **Nevydávat bez souhlasu.** Žádný příspěvek nevyjde bez schválení Josefem
  a autorizace autora.
- **Nezveřejňovat e-mail** ani nic, co autor neposlal k publikaci.
- **Nevyrábět příspěvky.** Rubrika bez došlých příspěvků zůstává prázdná;
  smyšlený „vzorový" obsah do ní nepatří.
