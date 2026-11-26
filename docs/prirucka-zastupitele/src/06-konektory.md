# Konektory: jak je připojit

Konektor (MCP server) napojí AI na aplikaci nebo databázi. Místo hádání z paměti AI čte zdroj a cituje ho. Rozdíl mezi chatem bez konektorů a s konektory bývá větší než rozdíl mezi modely.

## Obecný postup

- **Claude (web, desktop i mobil):** Nastavení › Konektory. Buď konektor najdete v adresáři, nebo zvolíte **Přidat vlastní konektor**, vložíte adresu serveru a případně se přihlásíte. V chatu ho pak zapnete tlačítkem konektorů.
- **ChatGPT:** Settings › Connectors, přidat vlastní konektor s adresou serveru. Vlastní konektory jsou jen v placených plánech.
- **Claude Code:** v terminálu `claude mcp add --transport http NAZEV ADRESA`.

Názvy položek v nastavení se občas mění. Když položku nenajdete, hledejte v nastavení slovo „Connectors“ nebo „Konektory“.

| konektor | k čemu | adresa nebo kde ho najít | přihlášení |
|---|---|---|---|
| **Piráti KB** | program, stanoviska, šablony, profil obce, volby, hlasování | `https://piratekb-veritasderman-3065s-projects.vercel.app/mcp` | není potřeba |
| **Hlídač státu** | smlouvy, zakázky, dotace, firmy, politici | `https://mcp.api.hlidacstatu.cz` | účet na hlidacstatu.cz |
| **Paragrafiq** | zákony a judikatura s citací paragrafu | adresář konektorů v Claude, plugin v ChatGPT | účet Paragrafiq, kredity |
| **Gmail, Google Kalendář** | korespondence, termíny, lhůty | vestavěné konektory v Claude | účet Google |
| **Beeper** | WhatsApp, Messenger, Signal v jednom | lokálně přes Beeper Desktop | aplikace Beeper |

## Piráti KB

Znalostní báze strany: lidé a funkce, program a stanoviska s rozlišením oficiálního postoje a názoru jednotlivce, šablony (dotaz zastupitele, žádost podle 106, stížnost, odvolání, tisková zpráva), výpočet lhůt, profil obce, výsledky voleb a zvolení Piráti, hlasování ve Sněmovně, Senátu, EP a Zastupitelstvu hl. m. Prahy, kontrola textu před zveřejněním.

**Připojení (Claude):**

1. Otevřete claude.ai › Nastavení › Konektory › **Přidat vlastní konektor**.
2. Vložte adresu `https://piratekb-veritasderman-3065s-projects.vercel.app/mcp` a potvrďte. Přihlášení zatím není potřeba, server obsahuje jen veřejná data.
3. Konektor se objeví na webu, v desktopové i mobilní aplikaci. V chatu ho zapněte tlačítkem konektorů.

**ChatGPT:** stejná adresa v Settings › Connectors. **Claude Code:**

```bash
claude mcp add --transport http piratekb https://piratekb-veritasderman-3065s-projects.vercel.app/mcp
```

**Ověření:** zeptejte se „Použij piratekb a řekni mi, jaké barvy má pirátské logo.“ Správná odpověď obsahuje `#fec934` (Pirati Yellow) a odkaz na styleguide.

**Bez instalace:** na adrese `https://piratekb-veritasderman-3065s-projects.vercel.app/chat` je jednoduchý webový chat nad stejnými daty, s denním limitem otázek.

**Co vyzkoušet:**

- „Udělej profil obce [název] a vypiš zvolené zastupitele z voleb 2026.“
- „Najdi šablonu dotazu zastupitele a vyplň ji pro [obec] a téma [téma].“
- „Co říká program Pirátů k [téma]? Rozliš oficiální stanovisko a názory jednotlivců.“
- „Zkontroluj tenhle text před zveřejněním.“

Data jsou z velké části automaticky vytěžená z veřejných zdrojů a nejsou všechna kurátorovaná. Každá odpověď má odkaz na zdroj, otevřete ho.

## Hlídač státu

Pro zastupitele nejdůležitější konektor: registr smluv, veřejné zakázky, dotace, insolvence, sponzoring stran, platy politiků, rozhodnutí ÚOHS i stenozáznamy Sněmovny.

1. Zaregistrujte se na hlidacstatu.cz. MCP server je jen pro registrované uživatele.
2. V Claude: Nastavení › Konektory › **Přidat vlastní konektor**, adresa `https://mcp.api.hlidacstatu.cz`.
3. Při prvním použití se otevře přihlášení. Když se neotevře, konektor v seznamu odpojte a znovu připojte.
4. V ChatGPT: Settings › Connectors, stejná adresa, ověření **OAuth**.

Návod k připojení: [mcp.api.hlidacstatu.cz](https://mcp.api.hlidacstatu.cz/). Jak s daty pracovat: [Hlídač státu jako novinářský nástroj](https://www.produktivni.cz/tipy/hlidac-statu-pro-novinare) a [Prověrka obchodního partnera](https://www.produktivni.cz/tipy/proverka-obchodniho-partnera-hlidac-statu).

## Gmail a Google Kalendář

V Claude jsou mezi konektory přímo. AI prohledá poštu, shrne vlákna, připraví koncept odpovědi, v kalendáři najde termíny, vytvoří událost a lhůtu. Na týmových a firemních plánech je musí nejdřív povolit správce. Návod: [Google Workspace connectors](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors).

**Pozor na zápis:** e-mail nechte jen ke čtení a konceptům. Odeslání vždy ručně.

## Beeper (pokročilé)

Beeper sjednotí chaty z WhatsAppu, Messengeru, Signalu a dalších sítí do jedné aplikace. AI z nich umí vytáhnout sliby a termíny. Konektor běží jen lokálně na vašem počítači:

1. Nainstalujte Beeper Desktop a nechte ho spuštěný.
2. V Beeperu zapněte Settings › Developers › **Beeper Desktop API**.
3. Připojte Claude Desktop nebo Claude Code podle [dokumentace Beeper MCP](https://developers.beeper.com/desktop-api/mcp).

Do webového chatu se nepřipojuje.

## Bezpečnost konektorů

- **Nejdřív čtení, zápis až po zkušenosti.** Nejdřív zjistěte, kde se model plete.
- **Nevratné akce schvaluje člověk:** odeslání, publikování, mazání, platby.
- **Pozor na slovo „spravovat“:** obvykle zahrnuje i zápis a mazání. Volte nejužší rozsah.
- **Cizí obsah bez práva odesílat:** konektor, který čte e-maily od neznámých lidí nebo web, by neměl mít zároveň právo něco odesílat. Cizí text může obsahovat skryté pokyny pro AI.
- **Jednou za čtvrtletí** konektory projděte a nepoužívané odpojte.

Přehled dalších konektorů: [produktivni.cz/konektory](https://www.produktivni.cz/konektory) a [Které nástroje mají MCP konektor](https://www.produktivni.cz/tipy/mcp-konektory-nastroje).
