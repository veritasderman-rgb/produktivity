# Zadání webu Produktivni.cz

> **Verze:** 1.0 (návrh ke schválení) · **Datum:** 11. 8. 2026
> **Stav:** čeká na odsouhlasení — po schválení začíná fáze tvorby (GitHub → Vercel → Brevo)

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

1. **Tón a identita webu** — vystupovat pod vaším jménem (osobní brand, důvěryhodnost pro školení), nebo jako „redakce Produktivni.cz"? *Doporučuji osobní brand.*
2. **Publikační režim rutiny** — začít s režimem „vše přes schvalovací PR" (doporučuji), s výhledem přepnout ověřené typy obsahu (např. krátké tipy) na plnou automatiku?
3. **Lead magnet** — nabídnout ke stažení celou stávající příručku (PDF), nebo z ní vytvořit kratší, údernější „Top 30 tipů" e-book? *Doporučuji kratší e-book, celá příručka žije na webu.*
4. **Cena školení** — uvádět orientační ceník, nebo jen „cena na vyžádání"?
5. **Sociální sítě** — které kanály přes Buffer? (LinkedIn bych bral jako povinný pro B2B školení.)

---

*Po schválení zadání začíná Fáze 1 — základ webu. Připomínky pište přímo k tomuto dokumentu (PR/issue) nebo do konverzace.*
