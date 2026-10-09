---
# KONCEPT — zatím neodesláno. Do archivu (/newsletter/archiv) patří až po
# rozeslání: pak soubor přesunout do content/newsletter/firemni-znalostni-baze-pro-ai.mdx
# a smazat tenhle komentář. Loader čte jen .mdx přímo v content/newsletter/,
# takže tahle složka se nikde nepublikuje.
number: 1
subject: "Proč AI ve firmě odpovídá každému jinak (a jak to spravit)"
preheader: "První číslo newsletteru Produktivní.cz: firemní znalostní báze jako vlastní MCP server, Gemini skills, ChatGPT Space a co jsme na webu opravili."
date: "2026-10-09"
---

Dobrý den,

tohle je první číslo newsletteru Produktivní.cz. Od příštího týdne vám každý čtvrtek ráno pošlu jeden tip do hloubky, pár odkazů, které stojí za kliknutí, a prompt, který si zkopírujete a vyzkoušíte ještě ten den. A když vám něco nebude sedět, stačí odpovědět na tenhle e-mail. Čtu to já, ne robot.

Ve firmách teď s AI pracuje skoro každý. A skoro každý dostává jiné odpovědi: obchodník nabídku s loňskou cenou, marketérka posty, které znějí jako od jiné firmy, nováček obecnou radu podle zákoníku práce místo interní směrnice. Model přitom nedělá nic špatně. **Jen o vaší firmě nic neví** a co neví, to si přesvědčivě domyslí.

První číslo má proto jedno velké téma, nejdelší návod, jaký na webu zatím máme. K tomu dvě AI novinky a krátce o tom, co jsme na webu opravili.

## Tip týdne: firemní znalostní báze, na kterou dosáhne každý chat

Obvyklá rada zní „nahrajte AI správné dokumenty“. Jenže jeden kolega nahraje ceník z února, druhý z června a třetí žádný. Dvacet lidí pak dostává dvacet verzí pravdy.

Klíčová myšlenka: **řešením není lepší model ani lepší prompt, ale jeden zdroj pravdy pro celou firmu.** Firemní znalosti dostanou jedno místo a každý zaměstnanec se k němu připojí ze svého běžného Claude. Návod ho staví v sedmi krocích:

- **Složka** — všechny materiály na jedno místo: PDF, prezentace, ceník v Excelu, brand manuál, přepisy školení. Staré verze a osobní údaje pryč.
- **Claude Cowork** — projde složku a vytěží z ní čisté markdownové soubory s hlavičkou: co to je, kdo to vlastní, odkdy to platí.
- **GitHub** — soubory se uloží do soukromého repozitáře. Každá změna má autora a datum a jde vrátit.
- **Claude Code** — nad repozitářem postaví MCP server s nástroji typu „hledej“, „brand“ nebo „kdo to ví“.
- **Vercel** — na něm server běží a po každé změně znalostí se sám nasadí znovu.
- **Konektor** — zaměstnanci si server přidají v Claude jako vlastní konektor a firemní znalosti mají v každém chatu.
- **Neon** — databáze zaznamenává dotazy, hlavně ty, na které báze odpověď nemá. Ty jsou nejcennějším výstupem celého systému, protože říkají, co do báze doplnit.

Programovat umět nemusíte, server napíše Claude Code. Vy rozhodujete, schvalujete a testujete na otázkách, u kterých znáte správnou odpověď. Kromě licencí Claude je provoz levný: GitHub i Neon stačí v bezplatném tarifu, Vercel pro firmu chce tarif Pro (řádově 20 dolarů měsíčně za člena týmu). Hlavní náklad je čas: dva až čtyři týdny kalendářně, z toho zhruba týden soustředěné práce jednoho člověka.

Jedno pravidlo platí nad vším: **do báze patří jen to, co smí vidět každý, kdo se k ní připojí.** Server nerozlišuje, jestli se ptá jednatel, nebo brigádník na recepci. Osobní údaje, mzdy, smlouvy s konkrétními zákazníky a hesla do ní nepatří vůbec. A když měříte dotazy, řekněte lidem předem, co se loguje a proč.

Celý návod vede po stopách provozní ředitelky firmy se 45 lidmi a obsahuje přes 30 promptů k okopírování, včetně brandových materiálů od PDF po podklady k videu: [Firemní znalostní báze pro AI: ze šuplíku plného PDF vlastní MCP server](https://www.produktivni.cz/tipy/firemni-znalostni-baze-mcp-server) (úspora: hodiny týdně na každého, kdo ve firmě pracuje s AI).

A rada na začátek: nezačínejte celou firmou. Vezměte jednu oblast a jeden tým, třeba ceník a servisní postupy pro obchod. Za týden máte funkční řetězec a důkaz pro zbytek firmy.

## AI novinky týdne

[Gemini přidává skills: opakované instrukce spustíte lomítkem](https://www.produktivni.cz/ai/gemini-skills-nahrazuji-gems). Skill je uložená instrukce, kterou zavoláte lomítkem, a na rozdíl od Gems jde víc skills kombinovat najednou („/týdenní-report /styl-komunikace“). Ve Workspace se zpřístupňují od 5. října, v aplikaci Gemini od 13. října. Skills postupně nahradí Gems (u osobních účtů už v listopadu) a existující Gems se převedou samy. Teď je dobrá chvíle projít, které Gems opravdu používáte.

[ChatGPT Space: sdílené stránky a zápisy ze schůzek na jednom místě](https://www.produktivni.cz/ai/chatgpt-space-pages-schuzky). OpenAI představil sdílený prostor pro tým se stránkami, které se umí samy aktualizovat z propojených nástrojů, a plugin Meetings na zápisy ze schůzek. Space je jen na plánech Pro, Business a Enterprise, Meetings zatím v betě a jen na macOS. Nahrávání schůzek vyžaduje souhlas účastníků.

## Co jsme na webu opravili

Každý týden znovu ověřujeme velké návody proti oficiální dokumentaci a každou opravu zapisujeme veřejně. Za poslední dva týdny:

- **Cowork už není jen na počítači.** Podle nápovědy Anthropicu běží i na claude.ai a v mobilní aplikaci (placené tarify, úlohy v cloudu, zatím beta). K místní složce na disku se ale pořád dostanete jen přes aplikaci pro počítač.
- **Přepis v Google Meet bez češtiny.** Přepisy jsou jen ve vyšších edicích Workspace (od Business Standard) a čeština mezi podporovanými jazyky není. Upozornění jsme doplnili do obou návodů na zápisy z porad.
- **DuckDB načte Excel samo.** Rozšíření pro Excel se při prvním použití stáhne samo, jen musíte být online. Čte jen `.xlsx`, starší `.xls` ne.

Celý seznam i s tím, co jsme ověřit nedokázali: [Změny na webu](https://www.produktivni.cz/zmeny).

## Stojí za kliknutí

- [MCP konektory: USB-C pro AI](https://www.produktivni.cz/tipy/mcp-konektory-usb-c-pro-ai) — pokud vám „MCP server“ v tipu týdne nic neříká, začněte tady. Co to je, jak připojit poštu nebo kalendář a jak nastavit oprávnění podle nejmenších práv.
- [Knihovna promptů: neopisujte, co už funguje](https://www.produktivni.cz/tipy/ai-knihovna-promptu) — druhá polovina srovnatelné kvality. Když dva obchodníci zadávají nabídku stejným promptem nad stejnou bází, dostanou srovnatelný výsledek.
- [Onboarding nováčka: Projekt, který odpovídá za vás](https://www.produktivni.cz/tipy/onboarding-novacka-ai-projekt) — menší bratr firemní báze pro tým do deseti lidí. Funguje hned a bez serveru.

## Prompt k okopírování

Dřív než začnete stavět bázi, zjistěte, jak na tom vaše podklady jsou. Vezměte dva až tři dokumenty k jednomu tématu (dvě verze ceníku, směrnici a její novelu, katalog z ledna a z června) a nechte AI najít rozpory. U Terezy z návodu podobná kontrola odhalila šest rozporů ve firemních dokumentech, o kterých nikdo nevěděl.

Firemní dokumenty ale patří jen do AI nástroje, který má vaše firma schválený a který má smluvní ochranu dat. Do osobního nebo bezplatného účtu je nevkládejte. A ani do firemního nedávejte dokumenty s osobními údaji zákazníků nebo zaměstnanců: jména a kontakty předem vymažte nebo nahraďte zástupným textem.

```text
Přikládám [počet] dokumentů k tématu [téma, např. ceník servisu].
Nic nepřepisuj ani neopravuj, jen je porovnej a vrať mi:

1. ROZPORY — kde dva dokumenty tvrdí o téže věci něco jiného
   (cena, lhůta, postup, název). U každého oba dokumenty
   a obě tvrzení doslovně.
2. BEZ DATA PLATNOSTI — dokumenty s cenami nebo lhůtami,
   u kterých není poznat, odkdy platí.
3. CO CHYBÍ — pět otázek, které by k tématu položil kolega
   nebo zákazník a na které tyhle dokumenty neodpoví.

Pravidla:
- tvrzení cituj přesně, nic nezaokrouhluj a nedomýšlej
- kde si nejsi jistý (nečitelný sken, nejasná tabulka), napiš to
- nerozhoduj, která verze platí, to rozhodnu já
```

A otázka na závěr: **na co se vás kolegové ptají pořád dokola?** Odpovězte mi jedním řádkem. Přesně takové otázky patří do firemní báze jako první.

Mějte hezký víkend,

Josef

*P.S. Chcete s AI začít systematicky? E-mailový kurz [AI za týden](https://www.produktivni.cz/kurz) je zdarma: sedm dní, sedm krátkých e-mailů, každý den jedna dovednost.*
