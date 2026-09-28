---
# KONCEPT — zatím neodesláno. Do archivu (/newsletter/archiv) patří až po
# rozeslání: pak soubor přesunout do content/newsletter/tydenni-prehled-za-pet-minut.mdx
# a smazat tenhle komentář. Loader čte jen .mdx přímo v content/newsletter/,
# takže tahle složka se nikde nepublikuje.
number: 1
subject: "Zítra je pátek: týdenní revize za pět minut"
preheader: "První číslo newsletteru Produktivní.cz: jeden tip do hloubky, AI novinka týdne a prompt k okopírování."
date: "2026-10-01"
---

Dobré ráno,

tohle je první číslo newsletteru Produktivní.cz. Od dneška vám každý čtvrtek ráno pošlu jeden tip do hloubky, pár odkazů, které stojí za kliknutí, a prompt, který si zkopírujete a vyzkoušíte ještě ten den. Čtení na dvě minuty. A když vám něco nebude sedět, stačí odpovědět na tenhle e-mail — čtu to já, ne robot.

Dnes je 1. října a začíná poslední čtvrtletí roku. Do Silvestra zbývá přesně třináct pátků — a právě pátek je tématem prvního čísla.

## Tip týdne: týdenní revize za pět minut

Týdenní revizi zná každý, kdo kdy četl o GTD. A skoro každý ji po pár týdnech přestane dělat. Ne proto, že by nefungovala, ale proto, že padá na **sběru**: projít kalendář, úkolovník a poštu a dát dohromady, co se vlastně za týden stalo, zabere půl hodiny. V hektickém týdnu tu půlhodinu nenajdete, a tak revize vypadne přesně ve chvíli, kdy by byla nejvíc potřeba.

Klíčová myšlenka: **sběr je práce pro stroj, rozhodnutí je práce pro člověka.** AI s napojeným kalendářem, úkolovníkem a poštou sestaví v pátek dopoledne jednostránkový přehled v pevné struktuře:

- **Dokončeno** — co se za týden zavřelo. Nevynechávat, jinak má revize příchuť výčitky.
- **Uvázlo** — otevřené věci, které se za týden nepohnuly. Jádro celého přehledu.
- **Spadlo ze stolu** — co bylo v plánu a nestalo se s tím vůbec nic, ani odklad. Tahle sekce v ručních revizích chybí, protože si na ty věci nikdo nevzpomene.
- **Čeká se na druhé** — kde jste hotoví vy a míč je u někoho jiného, s počtem dní.
- **Tři priority na příští týden** — výslovně jako *návrh ke schválení*, každá s odůvodněním.

Vy pak za pět minut odpovíte na čtyři otázky: souhlasí obrázek? Co z „uvázlo“ zruším nebo předám? Které tři priority beru? Komu se mám ozvat? Priority vybírá člověk, ne model — model vidí termíny a hlasitost vláken, ne důležitost.

Dvě pravidla, na kterých to stojí. Přehled chodí **v pátek dopoledne**, ne večer — přehled, který dorazí, když už nic nezměníte, se čte jako výčitka. A přehledy **archivujte**: kdo začne zítra, bude mít na konci roku třináct přehledů za sebou a teprve v řadě uvidí vzorce — třeba úkol, který se v „uvázlo“ objevil jedenáctkrát a nepotřebuje lepší plánování, ale rozhodnutí.

Rutina potřebuje jen právo číst. Pracovní kalendář a poštu napojujte jen přes pracovní účet se smluvní ochranou dat a citlivé složky (personální, právní) z přehledu vynechte.

Celý návod má šest fází od napojení zdrojů po archiv a všechna zadání k okopírování: [Pátek: AI sestaví týdenní přehled, vy ho projdete za pět minut](https://www.produktivni.cz/tipy/ai-tydenni-prehled) (úspora ~25 minut týdně).

## AI novinka týdne

[ChatGPT teď umí naslouchat i pracovat](https://www.produktivni.cz/ai/chatgpt-hlas-pluginy-a-prace) — od 23. září funguje hlasový režim ChatGPT s propojenými aplikacemi (e-mail, kalendář, Slack) a na vyšších placených plánech umí nadiktovaným pokynem rozjet i úkol v ChatGPT Work. Hodí se mezi schůzkami nebo v autě. Jen pozor: hlasem jde spustit i akci, která něco odešle — shrnutí si před potvrzením vždycky přečtěte.

## Stojí za kliknutí

- [Tři úkoly dne: ráno vyberte, večer zkontrolujte](https://www.produktivni.cz/tipy/tri-hlavni-ukoly) — denní protějšek páteční revize. Ne seznam dvaceti položek, ale tři věci, které dnes musí ven.
- [Ranní brief: co dnes čeká na rozhodnutí](https://www.produktivni.cz/tipy/claude-ranni-brief-navod) — stejný princip jako páteční přehled, jen každé ráno: AI projde poštu, kalendář a chat a seřadí, co čeká na vás.
- [Filtry: newslettery ať nikdy nevidí váš inbox](https://www.produktivni.cz/tipy/gmail-filtry-newslettery) — jedno pravidlo přesune newslettery pod štítek a čtete je, až když chcete vy. (Tenhle z filtru klidně vyjměte.)

## Prompt k okopírování

Nemáte AI napojenou na kalendář a úkolovník? Revizi zvládnete i ručně. Vložte do chatu export nebo opis kalendáře a úkolů za tento týden — bez jmen klientů a citlivých údajů — a použijte tohle zadání:

```text
Níže je můj kalendář a seznam úkolů za posledních 7 dní.
Sestav z toho týdenní přehled, přesně v tomto pořadí:

1. DOKONČENO — co se uzavřelo, jedna řádka na položku
2. UVÁZLO — co je otevřené a za týden se nepohnulo
3. SPADLO ZE STOLU — co mělo termín tento týden a nestalo
   se s tím nic
4. ČEKÁ SE NA DRUHÉ — kde je míč u někoho jiného
5. NÁVRH TŘÍ PRIORIT NA PŘÍŠTÍ TÝDEN — u každé jedna věta
   proč, podložená daty výše; označ to jako návrh ke schválení

Pravidla:
- celý přehled se musí vejít na jednu obrazovku
- kde ti chybí data, napiš to; nic si nedomýšlej
- priority jen navrhni, rozhodnu já

[sem vložte kalendář a úkoly]
```

A jedna otázka na závěr: **co vám v týdnu nejčastěji spadne ze stolu?** Odpovězte mi jedním řádkem — z odpovědí budu skládat další čísla.

Mějte klidný pátek,

Josef

*P.S. Chcete s AI začít systematicky? E-mailový kurz [AI za týden](https://www.produktivni.cz/kurz) je zdarma: sedm dní, sedm krátkých e-mailů, každý den jedna dovednost.*
