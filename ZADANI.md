# Zadání webu Produktivni.cz

> **Verze:** 1.1 · **Datum:** 11. 8. 2026
> **Stav:** klíčová rozhodnutí odsouhlasena, čeká se na výběr směru vizuální identity

## Odsouhlasená rozhodnutí (11. 8. 2026)

| Otázka | Rozhodnutí |
|---|---|
| Identita webu | **Osobní brand — Josef Pavlovic** |
| Lead magnet | **Úderný e-book** („Top 30 tipů"), celá příručka žije na webu |
| Sociální kanály (Buffer) | **Instagram, Facebook, LinkedIn** |
| Cena školení | Rozhodne se podle cenové rešerše (viz §9) |
| Doména produktivni.cz | Zatím neregistrována — vyřeší se ve Fázi 3 (nasazení) |
| Vizuální identita | **Vybrán směr A · Přesnost** (švýcarská mřížka, klávesa); akcent změněn z modré na **zelenou** na přání (11. 8.) — viz §10 |

---

## 1. Vize projektu

Produktivni.cz bude **nejaktuálnější český web o produktivitě**. Staví na dvou pilířích:

1. **Ověřené know-how** — kompletní příručka produktivity (systémy GTD, Pomodoro, Kanban, OKR, psychologie, biologie výkonu, nástroje, home office, studium…), rozdělená do přehledných online kapitol.
2. **Živé novinky** — automatizovaná rutina (Claude Code) denně prohledává internet, nachází nové tipy, triky, zkratky, nástroje a AI workflow, a navrhuje je jako obsah ke schválení. Web tak nikdy nezastará — na rozdíl od klasických blogů o produktivitě.

Monetizace a byznys cíl: **sběr kontaktů (newsletter)** a **prodej firemních školení** pro firmy, které nemají čas to celé číst a chtějí know-how předat týmu napřímo.

## 2. Cílové skupiny (čtenáři)

| Persona | Kdo to je | Co hledá | Co mu web dá |
|---|---|---|---|
| **Znalostní pracovník** (25–45) | Programátor, marketér, projekťák — tráví den u počítače | Konkrétní tipy: zkratky, aplikace, automatizace, AI nástroje | Sekce Tipy & triky, srovnání nástrojů, AI novinky |
| **Přetížený profesionál / manažer** | Tone se v e-mailech a schůzkách | Systém: jak si uspořádat práci, prioritizovat, nevyhořet | Příručka (GTD, Inbox Zero, time-blocking), newsletter |
| **Student** | VŠ/SŠ student | Jak se efektivně učit a zvládat zkoušky | Kapitoly o učení, spaced repetition, správa projektů |
| **Firma / HR / team lead** | Chce zvednout produktivitu týmu | Školení na klíč, ne čtení | Stránka Školení pro firmy + poptávkový formulář (lead gen) |

Primární jazyk: **čeština**. Primární trh: ČR/SK.

## 3. Struktura webu (sitemap)

```
produktivni.cz
├── /                      Homepage — hook, nejnovější tipy, cesta do příručky, CTA newsletter
├── /prirucka              Příručka produktivity (evergreen know-how)
│   ├── /zaklady           Co znamená být produktivní, systémy, psychologie, tělo
│   ├── /metody            GTD, Inbox Zero, Pomodoro, time-blocking, SCRUM, Kanban, OKR
│   ├── /nastroje          Druhý mozek, výběr aplikací, kategorie appek, digitální minimalismus
│   └── /situace           Home office, týmová produktivita, e-mail, studium
├── /tipy                  Tipy & triky — krátké karty (zkratky, appky, workflow, AI)
│   └── /tipy/[slug]       Detail tipu (sdílitelný, SEO friendly)
├── /ai                    AI & produktivita — novinky, nástroje, prompty, workflow
├── /skoleni               Školení pro firmy — nabídka, reference, poptávkový formulář
├── /newsletter            Přihlášení k odběru (Brevo) + archiv vydání
├── /o-projektu            Kdo za tím stojí, proč web vznikl
└── /rss.xml               RSS feed (pro čtečky i pro Buffer automatizaci)
```

### Typy obsahu

| Typ | Formát | Zdroj | Frekvence |
|---|---|---|---|
| **Kapitola příručky** | Dlouhý článek (MDX) | Existující příručka (migrace) | Jednorázově + revize |
| **Tip/trik** | Krátká karta: problém → řešení → jak na to (obrázek/video) | AI rutina + ručně | 3–7× týdně |
| **AI novinka** | Krátký článek s kontextem "co to znamená pro vás" | AI rutina | 1–3× týdně |
| **Newsletter** | Souhrn týdne: top tipy + 1 hlubší téma | Generováno z publikovaného obsahu | 1× týdně |
| **Social post** | Obrázek/karusel/krátké video + text | Buffer, vizuály z Gemini | Denně |

## 4. Klíčové funkce

### 4.1 Web (čtenářská část)
- Rychlý, obsahově orientovaný web — statické generování, skvělé SEO, výborná čitelnost na mobilu.
- Fulltextové vyhledávání v tipech i příručce.
- Filtrování tipů podle kategorie (zkratky / aplikace / hardware / AI / workflow) a platformy (Windows / Mac / mobil).
- Každý tip = samostatná URL se strukturovanými daty (SEO) a OG obrázkem (generovaný vizuál).
- Dark mode.

### 4.2 Sběr kontaktů (Brevo)
- Newsletter opt-in box na homepage, pod každým článkem a jako nevtíravý slide-in.
- Lead magnet: **PDF příručka zdarma výměnou za e-mail** (double opt-in přes Brevo).
- Poptávkový formulář školení → kontakt v Brevo s tagem `skoleni-lead` + notifikace na váš e-mail.
- Seznamy v Brevo: `newsletter`, `lead-magnet`, `skoleni-leads`.

### 4.3 Školení pro firmy
- Prodejní stránka: co školení obsahuje (moduly = kapitoly příručky + AI produktivita), formáty (půldenní/celodenní workshop, online), pro koho, orientační cena nebo „cena na vyžádání".
- Poptávkový formulář (jméno, firma, velikost týmu, e-mail, co je pálí).

### 4.4 Automatizační rutina (Claude Code) — „redakční robot"
Naplánovaná rutina (denně):
1. **Sběr:** prohledá internet (novinky v produktivitě, AI nástroje, nové funkce aplikací, zkratky, studie).
2. **Filtr:** porovná s již publikovaným obsahem (žádné duplicity), vyhodnotí relevanci pro české publikum.
3. **Tvorba:** napíše návrh tipu/novinky česky ve formátu webu, vygeneruje vizuál přes **Gemini API** (obrázek, případně krátké video).
4. **Schválení:** otevře Pull Request na GitHubu — **nic nejde ven bez vašeho schválení** (merge = publikace). Volitelně později plná automatika.
5. **Distribuce:** po publikaci naplánuje posty do **Bufferu** (vlastní kanály — upřesníme které: LinkedIn / X / Instagram / Facebook) a jednou týdně sestaví newsletter do Brevo.

### 4.5 Analytika
- Vercel Analytics (návštěvnost, bez cookies — bez cookie lišty).
- Brevo statistiky (open rate, kliky), měření konverzí formulářů.

## 5. Technické řešení

| Vrstva | Volba | Proč |
|---|---|---|
| Framework | **Next.js (App Router) + TypeScript + Tailwind CSS** | Standard pro Vercel, rychlé statické stránky, snadný rozvoj |
| Obsah | **MDX soubory v Git repozitáři** | Žádný externí CMS = nulové náklady; AI rutina přidává obsah jako PR; plná historie verzí |
| Hosting | **Vercel** (free tier stačí na start) | Automatický deploy z GitHubu, preview deploye pro každý PR |
| E-mail/CRM | **Brevo** (API) | Newsletter, lead magnet, správa kontaktů, formuláře |
| Vizuály | **Gemini API** (dodáte API klíč) | Generování obrázků k tipům, OG obrázky, krátká videa pro social |
| Social | **Buffer** (API/MCP) | Plánování postů z publikovaného obsahu |
| Automatizace | **Claude Code rutina** (plánovaná session nad tímto repozitářem) | Sběr novinek, tvorba obsahu, PR workflow |
| Doména | produktivni.cz → Vercel | DNS nasměrujeme po nasazení |

Repozitář: `veritasderman-rgb/produktivity` (GitHub) — kód i obsah na jednom místě.

## 6. Fáze projektu

| Fáze | Obsah | Výstup |
|---|---|---|
| **0. Zadání** *(teď)* | Odsouhlasení tohoto dokumentu | ✅ schválené zadání |
| **1. Základ webu** | Next.js projekt, design, homepage, struktura, deploy na Vercel (dočasná URL) | Klikatelný web na `*.vercel.app` |
| **2. Obsah** | Migrace příručky do kapitol, prvních ~20 tipů (včetně vašich shortcuts), stránka školení | Plnohodnotný obsah |
| **3. Integrace** | Brevo (newsletter + lead magnet + formulář školení), doména produktivni.cz, SEO, RSS | Sbíráme kontakty |
| **4. Automatizace** | Claude Code rutina (sběr → návrh → PR), Gemini vizuály, Buffer napojení, týdenní newsletter | Web se aktualizuje „sám" |
| **5. Provoz** | Ladění podle analytiky, růst obsahu, případně plná automatika publikace | Rutinní provoz |

## 7. Co budu potřebovat od vás

1. ✅ **Schválení tohoto zadání** (případně připomínky — zapracuji).
2. **Gemini API klíč** (zmiňoval jste, že dodáte) — nastavíme jako secret ve Vercelu/GitHubu, nikdy nebude v kódu.
3. **Brevo účet** — API klíč (Settings → API keys).
4. **Buffer** — potvrzení, které kanály napojit (účet už je připojený jako konektor).
5. **Doména produktivni.cz** — máte registrovanou? (potvrdit přístup k DNS).
6. **Vercel účet** — je připojený; potvrdit, pod kterým týmem projekt založit.
7. Rozhodnutí k otevřeným otázkám níže.

## 8. Otevřené otázky k rozhodnutí

~~Otázky 1, 2, 3, 5 rozhodnuty~~ — viz „Odsouhlasená rozhodnutí" nahoře. Zbývá:

1. **Výběr směru vizuální identity** (A / B / C / kombinace) — viz §10.
2. **Cenová politika školení** — rozhodnout na základě rešerše v §9.

## 9. Cenová rešerše: firemní školení produktivity a AI v ČR (08/2026)

Ceny na českém trhu firemních školení produktivity/AI (bez DPH, fixní cena za skupinu obvykle do 15 osob):

| Formát | Rozpětí trhu | Příklady |
|---|---|---|
| Půldenní (4 h) prezenčně | 10 000 – 20 000 Kč | Kovařík: 4h briefing 9 800 Kč; Kubíček: online 4h blok 20 000 Kč |
| Celodenní (8 h) prezenčně | 25 000 – 40 000 Kč | Kovařík: 24 900 Kč; Kubíček: od 40 000 Kč |
| Dvoudenní intenzivní | 50 000 – 80 000 Kč | Kovařík: 49 800 Kč; Kubíček: od 80 000 Kč |
| Online konzultace (2 h) | ~10 000 Kč | Kubíček: 10 000 Kč |
| Otevřené kurzy (na osobu) | 800 – 6 000 Kč/os. | AbecedaPC, VOX, Gradua, GOPAS |

Poznámky z rešerše:
- Etablovaní jednotlivci s osobním brandem (Kovařík, Kubíček, Gamrot) účtují **fixně za skupinu**, ne za osobu — jednodušší prodej pro HR.
- AI školení se prodává dráž než klasický time management — kombinace „produktivita + AI" (naše pozice) míří do vyššího pásma.
- Transparentní ceník „od X Kč" na webu funguje jako filtr leadů; „cena na vyžádání" používají spíš velké vzdělávací domy.

**Doporučená startovní pozice** (k odsouhlasení):
- Půldenní workshop (4 h): **od 15 900 Kč**
- Celodenní workshop (8 h): **od 29 900 Kč**
- Online blok (2 h): **od 8 900 Kč**
- Uvádět na webu transparentně jako „od", fixně za skupinu do 15 lidí; individuální program „na míru" bez ceny.

## 10. Vizuální identita

Vizuální identita je **zásadní priorita** — musí být unikátní pro tento web, žádná šablona.

**Společný koncept: logo = klávesa.** Klávesová zkratka je nejmenší jednotka produktivity — jeden stisk, který šetří čas. Klávesa s písmenem „P" slouží jako logo, favicon, razítko na social vizuálech i vodoznak generovaných obrázků.

Navrženy 3 směry (kompletní vizuální pitch s živými ukázkami: interní artifact „Produktivni.cz — vizuální identita"):

| Směr | Charakter | Paleta | Písmo |
|---|---|---|---|
| **A · Přesnost** (vybráno) | Švýcarský stroj — přísná mřížka, sytá zelená, seriózní i ostré | inkoust `#111417`, papír `#F1F2EF`, zelená `#0E7C3F` (dark mode `#3ECF8E`) | Archivo (šířky 62–125 %) + JetBrains Mono |
| **B · Energie** | Neo-brutal hravost — tlusté obrysy, tvrdé stíny, fialová + limetka | `#17121F`, lila `#F0EDFA`, fialová `#6C3DF4`, limetka `#C9F53C` | Bricolage Grotesque |
| **C · Flow** | Terminál po setmění — tmavý mono svět, fosforová zelená | `#0B0E0C`, text `#C7D0C9`, fosfor `#46F08F`, jantar `#FFB454` | JetBrains Mono |

**Rozhodnuto (11. 8. 2026): směr A · Přesnost.** Hravost směru B lze dávkovaně použít v social vizuálech, C případně jako „režim terminálu" v AI sekci (easter egg).

---

*Po výběru směru identity začíná Fáze 1 — základ webu s design systémem zvoleného směru.*
