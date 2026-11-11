# Redakční rutina Produktivni.cz

Instrukce pro automatizovanou týdenní session, která sbírá novinky a připravuje
obsah ke schválení. Tento soubor je jediný zdroj pravdy pro chování rutiny —
změny chování dělejte úpravou tohoto souboru, ne úpravou triggeru.

## Cíl

Jednou týdně najít pět skutečně nových, hodnotných tipů nebo AI novinek,
napsat je ve formátu webu, **rozplánovat je na pondělí až pátek následujícího
týdne** a otevřít jeden pull request ke schválení. **Nic se nepublikuje bez
lidského schválení (merge).**

### Proč pět najednou a postupně

Web má vydávat pravidelně, ne ve vlnách: čtenář i vyhledávač mají každý
pracovní den najít něco nového. Zároveň nikdo nechce schvalovat pull request
denně. Proto rutina píše dávku jednou týdně a o postupné vydání se stará
**fronta publikování** (`lib/publish.ts`):

- článek se na webu objeví až v den, který má ve frontmatteru jako `date`
  (počítá se český čas);
- do té doby není ve výpisech, v RSS, v sitemapě ani ve vyhledávání a jeho
  adresa vrací 404, i když je soubor už v repozitáři;
- vydání nepotřebuje nový deploy — web se krátce po půlnoci obnoví sám
  (`/api/publikace`, Vercel Cron);
- když se pull request schválí pozdě, články s datem v minulosti vyjdou hned
  při nasazení a zbytek počká na svůj den.

Jeden článek denně, pondělí až pátek. Víkendy zůstávají volné.

**Dlouhodobý cíl: 500 tipů.** Web míří na ~500 kvalitních tipů; dokud jich je
méně, preferuj tipy před AI novinkami (novinky publikuj jen ty opravdu
podstatné). Kvalita má vždy přednost — 2 dobré tipy jsou lepší než 5 slabých.
Sleduj pokrytí filtrů: kategorie, platformy (hlavně macOS a mobil bývají
podreprezentované) i cílovky (manažeři, studenti, vývojáři, freelanceři) mají
růst rovnoměrně.

## Postup

### 1. Poznej stav webu

- Projdi existující slugy v `content/tipy/` a `content/ai/` — co už máme.
- Spusť `python3 scripts/publish-queue.py` — ukáže, co už ve frontě čeká a které
  pracovní dny jsou volné. Články ve frontě ber jako existující obsah (web je
  ještě neukazuje, ale téma je obsazené).
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

Cíl je pět položek, ale ne za každou cenu: když projdou jen tři, napiš tři
a obsaď jimi pondělí, středu a pátek. Když neprojde nic, **neotvírej PR** —
kvalita má přednost před frekvencí. Ukonči session poznámkou, co bylo zváženo
a proč to neprošlo.

Aby dávka měla z čeho brát i v týdnu chudém na novinky, nemusí být všech pět
položek „novinka“. Vedle čerstvých zpráv piš i **stálé tipy**, které webu
chybějí — podle pokrytí filtrů (viz Cíl) a podle mezer v obsahu. Rozumný poměr
je jedna až dvě novinky a tři až čtyři stálé tipy.

### 4. Tvorba obsahu

**Tip** (`content/tipy/<slug>.mdx`) — důkladný, okamžitě použitelný. Cílová
délka je zhruba **2 normostrany (500–750 slov)** a struktura: úvodní háček →
`## Vzorová situace` (konkrétní uvěřitelný scénář) → `## Jak na to` (podrobné
kroky) → `## Nejlepší nástroje` (3–5 skutečných, známých nástrojů s poznámkou)
→ `## Co vám to přinese` (benefit: čas, nervy, kvalita — čísla střízlivě) →
volitelně `## Pro tip`. Vzor: `content/tipy/win-v-schranka-s-historii.mdx`.

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
date: "YYYY-MM-DD"  # den vydání z fronty (viz krok 5), ne dnešní datum
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

### 5. Rozplánování

Každá položka dostane vlastní den vydání do pole `date`:

- ber **pracovní dny následujícího týdne** (pondělí–pátek), jeden článek na den;
- nepoužívej den, který už ve frontě obsazený je — volné dny vypíše
  `python3 scripts/publish-queue.py`;
- **AI novinky dej na začátek týdne** (pondělí, úterý), ať nezestárnou;
  stálé tipy snesou čtvrtek i pátek;
- střídej témata: dva tipy ze stejné kategorie nedávej na dva dny po sobě;
- `updated` nevyplňuj, doplní se samo podle `date`;
- v textu nepiš „dnes“, „včera“ ani „tento týden“ — článek vyjde o několik dní
  později, než ho píšeš. U novinek uveď konkrétní datum události.

Po rozplánování spusť skript znovu a zkontroluj, že fronta odpovídá záměru.

### 6. Kontrola

- `npm install && SHOW_SCHEDULED=1 npm run build` musí projít bez chyb.
  **Bez `SHOW_SCHEDULED=1` by build naplánované články vůbec nesestavil**
  a chyba v MDX by se ukázala až v den vydání.
- Build nejdřív zkontroluje interní odkazy (`scripts/check-links.mjs`) a na
  rozbitém odkazu skončí. Odkazuj jen na články, které v `content/` existují.
- Diakritika, formát frontmatteru, unikátní slug.

### 7. Pull request

- Větev: `rutina/obsah-YYYY-MM-DD` (datum běhu) ze **stávající výchozí větve**.
- Nikdy netlač přímo do výchozí větve.
- **Jeden PR na celou dávku**, ready for review, s popisem:
  - **tabulka vydání** nahoře: den, datum, název, soubor — ať je na první
    pohled vidět, co kdy vyjde,
  - co přidáváš a proč (1 odstavec na položku),
  - zdroje,
  - **návrhy social postů** pro LinkedIn (profesionální tón) a Instagram/Facebook
    (kratší, živější) ke každé položce — k ručnímu vložení do Bufferu,
    s datem vydání, ať post nevyjde dřív než článek.

### 8. Revize obsahu

Každý tip i kapitola nese ve frontmatteru pole `updated: "YYYY-MM-DD"` — datum
poslední revize. Zobrazuje se čtenáři pod nadpisem („Naposledy ověřeno") a jde
do strukturovaných dat (`dateModified`) i do sitemapy (`lastModified`).

**Pravidlo: kdo článek reviduje, přepíše `updated` na dnešní datum.** `date`
(datum vydání) zůstává beze změny — mění se jen `updated`. Když se v článku
opraví jen překlep, datum neposouvej; `updated` znamená „obsah byl ověřen",
ne „soubor byl uložen".

Při revizi se kontroluje:

- **fakta o nástrojích** — existuje funkce pořád, nezměnil se název, nepřesunulo
  se to jinam v menu, nezměnila se klávesová zkratka;
- **ceny a plány** — částky, limity zdarma verze, co spadlo za paywall;
- **odkazy** — vedou pořád tam, kam mají (žádné 404 ani redirect na homepage);
- **screenshoty a obrázky** — odpovídají aktuálnímu vzhledu aplikace.

Revize běží **kvartálně**: jednou za čtvrtletí projdi nejstarší `updated` a
články s nejvyšší návštěvností. Prioritu mají tipy v kategoriích `ai`
a `aplikace` — tam se realita mění nejrychleji.

Hromadné nastavení pole (např. při zavedení nového ročníku revizí) umí
`python3 scripts/set-updated.py --date YYYY-MM-DD`; skript doplňuje `updated`
jen tam, kde chybí, a nic jiného v souboru nemění.

### 8b. Ověřování faktů proti nástrojům (`tested`)

Vedle `updated` (redakční úprava) existuje silnější stopa: frontmatter pole
`tested: "YYYY-MM-DD"` — datum, kdy byla fakta článku **ověřena proti živým
nástrojům** (funkce, limity bezplatných úrovní, cesty v menu pořád platí).
Zobrazuje se v detailu jako druhý řádek pod „Naposledy ověřeno" s odkazem
na `/zmeny`.

Ověřovací běh má vlastní týdenní rutinu — přesný postup (výběr fronty přes
`scripts/verification-queue.py`, co kontrolovat, co dělat při driftu, zápis
do changelogu) je v **`docs/OVEROVANI.md`**. Zásada: `tested` se zapisuje
**jen po skutečném ověření**, nikdy plošně skriptem.

### 8c. Archiv newsletteru

Odeslaná čísla newsletteru žijí na `/newsletter/archiv`. Archiv se plní ručně
a **jen tím, co skutečně odešlo** — nikdy dopředu a nikdy „ukázkově“; na ukázku
slouží `/newsletter/ukazka`.

Po rozeslání čísla uložte jeho kopii do `content/newsletter/<slug>.mdx`
(anglickou mutaci do `content/en/newsletter/`). Formát je stejný jako
u ukázkového čísla, jen s pořadovým číslem a datem navíc:

```
---
number: 12                 # pořadové číslo vydání
subject: "Předmět e-mailu" # slouží i jako titulek stránky
preheader: "Náhledový text — v archivu funguje jako perex."
date: "YYYY-MM-DD"         # den rozeslání
---

Tělo čísla v markdownu, přesně jak odešlo.
```

Slug volte podle tématu, ne podle čísla (`zapis-z-porady-za-minutu`, ne
`cislo-12`) — adresa pak dává smysl i po letech. Archiv, sitemapa i `/llms.txt`
se doplní samy; nic dalšího se nastavovat nemusí.

### 9. Limity

- Max 5 položek na týdenní běh, radši 3 kvalitní než 5 slabých.
- Jeden článek na den; frontu nepřeplňuj dál než na dva týdny dopředu.
- Žádné velké refaktory, žádné změny kódu webu — jen obsah v `content/`.
- Nikdy neuváděj nepravdivé údaje; čísla jen se zdrojem.
- **Bezpečnost dat:** u AI obsahu, který vybízí k nahrávání či vkládání dat
  do AI nástrojů, vždy připomeň opatrnost — žádné osobní údaje, klientská
  data ani interní dokumenty bez souhlasu firmy; citlivé údaje anonymizovat.
  (Web zobrazuje u AI obsahu automatický disclaimer, ale text tipu nesmí
  bezpečnost bagatelizovat ani jí protiřečit.)
- Na webu zatím **neuvádíme ceny školení** — žádné částky za školení do obsahu.
