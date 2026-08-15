# Ověřovací běh — fakta proti živým nástrojům

Instrukce pro agenta týdenní ověřovací rutiny. Cíl: u velkých návodů ověřit,
že popsané funkce, limity a cesty v menu **pořád platí** — proti aktuální
oficiální dokumentaci nástrojů, ne po paměti.

Ověření je jiná událost než redakční úprava:

- `updated` = poslední revize textu (řádek „Naposledy ověřeno" v detailu),
- `tested` = datum, kdy byla **fakta článku ověřena proti živým nástrojům**.
  Zobrazuje se v detailu jako druhý řádek („Fakta ověřena proti nástrojům: …")
  s odkazem na `/zmeny`.

## Zásada číslo 1

**`tested` se zapisuje JEN po skutečném ověření konkrétního článku — nikdy
plošně skriptem.** Žádné hromadné doplňování data do frontmatteru, žádné
„ověřeno" bez provedených kontrol níže. Článek bez `tested` žádný řádek
nezobrazuje a to je v pořádku — nepravdivá stopa je horší než žádná.

## 1. Výběr fronty

```
python3 scripts/verification-queue.py --limit 10
```

Skript vypíše velké návody (tělo > 18 000 znaků) seřazené podle `tested`
vzestupně: nikdy neověřené první, pak nejstarší ověření. Z fronty vezmi
tolik článků, kolik stihneš **důkladně** — radši 3 skutečně ověřené než 10
proklikaných. Výstup: slug, titul, tested, kategorie.

## 2. Co u článku ověřovat

Přečti celé tělo `content/tipy/<slug>.mdx` a každé ověřitelné tvrzení
zkontroluj přes WebSearch/WebFetch proti **oficiální dokumentaci** nástroje
(docs, help center, changelog výrobce; blogy třetích stran jen jako vodítko):

1. **Názvy funkcí a režimů** — jmenuje se funkce pořád takhle? Nepřejmenoval
   výrobce režim (např. jiný název plánu, přejmenovaný „mód")?
2. **Limity bezplatných úrovní** — počty zpráv/souborů/projektů zdarma,
   co spadlo za paywall, co je nově zdarma.
3. **Cesty v menu** — sekvence typu Nastavení → X → Y sedí s aktuálním UI?
   Nezměnila se klávesová zkratka?
4. **Existence zmíněných nástrojů** — nástroj pořád existuje, nebyl ukončen,
   přejmenován nebo pohlcen jiným produktem? Vedou odkazy tam, kam mají?

Co ověřit nejde (dokumentace mlčí, zdroje si odporují), nech být a poznamenej
to v changelogu — nehádej.

## 3. Při nálezu driftu

Když realita nesedí s textem:

- **oprav text v obou jazycích** — `content/tipy/<slug>.mdx` i
  `content/en/tipy/<slug>.mdx` (pokud existuje); oprava musí být věcně shodná,
- **přepiš `updated`** na dnešní datum (došlo k redakční úpravě),
- drž tón webu (česky, bez balastu, konkrétní čísla — viz `docs/RUTINA.md`).

Bez nálezu se text ani `updated` nemění.

## 4. Vždy po ověření článku

- **Zapiš `tested: "YYYY-MM-DD"`** (dnešní datum) do frontmatteru CS souboru
  i EN verze, pokud existuje — ale jen když ověření opravdu proběhlo (viz
  zásada č. 1).
- **Přidej záznam do changelogu** `content/zmeny/` — formát převezmi
  z `content/zmeny/README.md`. Pokud README ještě neexistuje, drž se obecného
  tvaru záznamu:
  - **datum** běhu (YYYY-MM-DD),
  - **co se změnilo / co bylo ověřeno** — u driftu stručně „co bylo → co je",
    u čistého ověření „fakta ověřena, beze změn",
  - **dotčené slugy** článků.

## 5. Konec běhu

Krátké shrnutí: kolik článků ověřeno, kolik driftů nalezeno a opraveno, co
ověřit nešlo. Změny jdou standardní cestou přes pull request (viz
`docs/RUTINA.md` — nikdy netlač přímo do výchozí větve, nic se nepublikuje
bez lidského schválení).
