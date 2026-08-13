# Jak pracuje… — šablona rozhovoru

Pracovní podklad pro rubriku „Jak pracuje…". Tenhle soubor se nikde nepublikuje —
loader `lib/interviews.ts` čte z téhle složky jen soubory `.mdx`.

**Pravidlo číslo jedna: nic si nevymýšlíme.** Do rubriky jde jen to, co dotyčný
člověk skutečně napsal a co před vydáním schválil. Žádné doplňování odpovědí,
žádné „dotvoření pro plynulost", žádné složené postavy z několika lidí.

---

## Část 1 — Co poslat člověku

Otázek je 18. U každé stačí pár vět, celé vyplnění zabere zhruba 30 minut.
Kdo nechce na něco odpovídat, otázku prostě přeskočí — vypadne z výsledného textu.

### Kdo jste a co děláte

1. Jak byste popsal/a svou práci někomu, kdo o vašem oboru nikdy neslyšel?
2. Jak dlouho to děláte a co jste dělal/a předtím?
3. Kolik z vaší práce je hluboká soustředěná práce a kolik reagování na ostatní?

### Jak vypadá váš den

4. Popište svůj včerejšek hodinu po hodině, jak doopravdy proběhl — ne jak by ideálně měl vypadat.
5. V kolik hodin vám to myslí nejlíp a co v tu dobu děláte?
6. Co váš den nejčastěji rozbije a jak se z toho dostáváte zpátky?

### Systém a nástroje

7. Kde máte úkoly a jak se tam dostávají? (Konkrétně: název aplikace, papír, kalendář…)
8. Jak si plánujete den nebo týden — a kdy to děláte?
9. Vyjmenujte pět nástrojů, bez kterých byste se neobešel/neobešla.
10. Co děláte s e-mailem a zprávami? Kolikrát denně je otevíráte?
11. Máte nějaký rituál na začátek nebo konec pracovního dne?

### Co jste zkusili a zavrhli

12. Který populární systém nebo nástroj vám nesedl a proč?
13. Co jste dělal/a před pěti lety a dnes už vám to přijde jako ztráta času?

### Jak používáte AI

14. K čemu konkrétně jste použil/a AI v posledním týdnu?
15. Kde vám AI naopak nepomáhá — nebo kde ji vědomě nechcete?
16. Máte prompt nebo postup, který používáte opakovaně? Klidně ho sem vypište celý.

### Co byste poradil/a někomu na začátku

17. Kdyby měl někdo ve vaší profesi udělat jedinou změnu, která mu vrátí nejvíc času, jaká by to byla?

### Jedna věc, kterou děláte jinak než ostatní

18. Co ve vašem systému působí na okolí divně, ale vám to funguje?

---

## Část 2 — Jak z odpovědí udělat `.mdx`

### Soubor

- Cesta: `content/rozhovory/<slug>.mdx`, anglická mutace `content/en/rozhovory/<slug>.mdx`
  (stejný slug v obou jazycích — držíme tím hreflang).
- Slug: jméno bez diakritiky, kebab-case — `jana-novakova`.
- Fotka (nepovinná): `public/img/rozhovory/<slug>.webp`, čtverec, ideálně 600 × 600 px.
  Cesta se do frontmatteru píše jako `/img/rozhovory/<slug>.webp`. Fotku publikujeme
  jen s výslovným souhlasem.

### Frontmatter

```yaml
---
name: "Jméno Příjmení"
role: "profese, firma"
excerpt: "Jedna až dvě věty, které prodají rozhovor v přehledu. Konkrétně, ne obecně."
date: "2026-08-13"
photo: "/img/rozhovory/jmeno-prijmeni.webp"
minutes: 8
---
```

| Pole      | Povinné | Poznámka                                                             |
| --------- | ------- | -------------------------------------------------------------------- |
| `name`    | ano     | Skutečné jméno zpovídaného.                                           |
| `role`    | ano     | Profese, případně firma — zobrazuje se pod nadpisem i v přehledu.     |
| `excerpt` | ano     | Perex, zobrazí se v přehledu i jako meta description.                 |
| `date`    | ano     | Datum vydání, `YYYY-MM-DD`. Řadí rubriku od nejnovějšího.             |
| `photo`   | ne      | Bez ní se rozhovor vykreslí bez fotky.                                |
| `minutes` | ne      | Když chybí, spočítá se z délky textu (200 slov za minutu).            |
| `title`   | ne      | Přepíše automatický titulek „Jak pracuje {jméno}".                    |

Nadpis `# …` do těla **nepatří** — titulek vyrábí stránka sama.

### Struktura těla

Jeden blok otázek = jedna sekce `##`. Nadpisy sekcí zároveň tvoří obsah rozhovoru
(rozbalovací seznam se ukáže od čtyř sekcí výš), takže je pište krátce a lidsky.

Otázka je **tučný odstavec**, odpověď hned pod ní obyčejným odstavcem.

```mdx
## Kdo jste a co děláte

**Jak byste popsal svou práci někomu, kdo o vašem oboru nikdy neslyšel?**

Odpověď přesně tak, jak ji dotyčný napsal.

**Jak dlouho to děláte?**

Další odpověď.

## Jak vypadá váš den

**Popište svůj včerejšek hodinu po hodině.**

…
```

Doporučené názvy sekcí (dají se přizpůsobit tomu, co z rozhovoru vyšlo):
`Kdo je …` · `Jak vypadá den` · `Systém a nástroje` · `Co nefungovalo` ·
`AI v praxi` · `Rada na začátek` · `Jedna věc jinak`.

### Co se v textu smí a nesmí

- **Smí se:** krátit délku, sjednotit interpunkci, opravit překlepy, přeskupit
  pořadí otázek uvnitř bloku, vypustit otázku, na kterou nikdo neodpověděl.
- **Nesmí se:** měnit smysl odpovědi, doplňovat větu, kterou nikdo neřekl,
  vymýšlet čísla, jména nástrojů nebo citáty, spojovat dva lidi do jednoho rozhovoru.
- Před vydáním pošlete hotový text k autorizaci a vydávejte až po písemném souhlasu.

### Co lze v MDX použít navíc

- `<kbd>Ctrl</kbd>` pro klávesové zkratky.
- Blok kódu ohraničený ```` ``` ```` — u dlouhých promptů; čtenář dostane tlačítko „zkopírovat".
- `<Pojem …>` se do textu doplňuje automaticky ze slovníku, ručně ho psát nemusíte.

### Kontrola před vydáním

1. `npm run build` projde bez chyby.
2. Rozhovor se objevil v `/rozhovory` a odkaz na detail funguje.
3. Fotka (pokud je) leží v `public/img/rozhovory/` a v hlavičce se zobrazuje.
4. Autorizace je písemně potvrzená.
