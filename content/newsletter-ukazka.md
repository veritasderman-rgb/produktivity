---
subject: "Z porady zápis s úkoly za minutu — a je vidět, co je závazek"
preheader: "Jeden tip do hloubky, tři odkazy za kliknutí a prompt k okopírování. Dvě minuty čtení."
---

Dobré ráno,

znáte to: porada skončí, všichni se rozejdou a zápis „ještě dnes“ se píše až druhý den večer — z paměti, kdy si už nikdo nepamatuje, kdo se k čemu zavázal. Tenhle týden proto jedno velké téma: jak nechat AI roztřídit přepis porady tak, aby v zápise bylo poznat rozdíl mezi „rozhodli jsme“ a „bavili jsme se o tom“.

## Tip týdne: z nahrávky porady zápis s úkoly za minutu

Zápis z porady je přesně ten typ práce, který má dělat stroj — a přesně proto ho lidé nejčastěji odkládají. Výsledkem není chybějící dokument, ale chybějící práce: úkol, který nikdo nezaložil, se neudělá.

Klíčová myšlenka: **AI nemá napsat zápis, ale roztřídit přepis.** Obecné „shrň mi tuhle poradu“ vrátí odstavce typu „tým se shodl na potřebě dalších kroků“, ze kterých se nedá poznat, co má kdo udělat. Zápis musí být strukturovaný podle typu obsahu a tvrdě oddělený do tří kategorií:

- **Rozhodnutí** — uzavřené věci; patří k nim, kdo rozhodl a jaké varianty se zvažovaly.
- **Úkoly** — akce s jedním vlastníkem a termínem. Nikoli „tým se podívá na náklady“, ale „Petr do 15. 5. spočítá náklady varianty B“.
- **Otevřené body** — probíralo se, nerozhodlo se. Kategorie, kterou většina zápisů zamlčuje, a přitom je nejcennější: nedotažené konce se za měsíc vrátí jako problém.

Dvě věci kontrolujte vždy. Modely rády povyšují diskusi na rozhodnutí, protože to zní hotověji — chtějte proto u každého rozhodnutí doslovnou citaci z přepisu, a když chybí, přesuňte bod mezi otevřené. A jména, čísla a termíny: přeslechnutá číslovka je nejtišší chyba, nikdo si jí nevšimne, dokud podle ní někdo nejedná. Hotový zápis rozešlete do třiceti minut po poradě — dokud si všichni pamatují kontext, opraví chybu hned v odpovědi.

Jedno pravidlo platí nad vším: **nahrává se jen se souhlasem účastníků** a citlivá porada patří jen do placeného účtu se smluvní ochranou dat.

Celý návod má sedm fází od souhlasu s nahráváním po prohledávatelný archiv — a všechny prompty k okopírování: [Z nahrávky porady zápis s úkoly za minutu](/tipy/ai-zapis-z-porady) (úspora ~30 minut na poradu).

## Stojí za kliknutí

- [Porada bez agendy se nekoná](/tipy/manazer-porada-agenda) — jednoduché pravidlo, které smaže polovinu porad: kdo poradu svolává, posílá předem agendu a očekávaný výstup. Úspora ~3 h týdně.
- [Hlídač follow-upů: AI si pamatuje, kdo vám neodpověděl](/tipy/ai-follow-up-hlidac) — rutina najde vlákna bez odpovědi, pohlídá lhůty a připraví zdvořilé upomínky. Koncept píše AI, odesíláte vždy vy.
- [Druhý mozek, který odpovídá](/tipy/druhy-mozek-ktery-odpovida) — jak napojit AI na Notion nebo složku s poznámkami, ptát se vlastními slovy a nechat archiv, ať se každý týden doplňuje sám.

## Prompt k okopírování

Z hotového zápisu (nebo rovnou z přepisu) vytáhne jen úkoly ve formátu kdo-co-dokdy — seznam, který jde rovnou vložit do úkolovníku:

```text
Z tohohle zápisu (nebo přepisu) vytáhni JEN úkoly a přepiš je
do jednotného formátu, se kterým můžu pracovat dál.

Pro každý úkol jeden řádek:
[vlastník] — [akce začínající slovesem] — do [datum ve tvaru DD. MM.]

Pravidla:
- jeden úkol = jedna akce = jeden vlastník; složené úkoly rozděl
- relativní termíny převeď na datum; dnes je [datum],
  „do konce týdne“ = [pátek datum], „příští týden“ = [datum]
- když termín nezazněl vůbec, napiš „do ??“ a přidej k řádku
  poznámku, kterou se mám zeptat
- vynech vše, co byl jen nápad, návrh nebo podmíněná věta
  („kdybychom měli čas, mohli bychom…“) — ty vypiš zvlášť
  pod nadpis NEZÁVAZNÉ NÁPADY
- seřaď podle termínu, nejbližší nahoře

Na konec napiš součet: kolik úkolů má kdo.
```

Mějte rychlý týden,

Josef

*Tento e-mail dostáváte, protože jste se přihlásili k odběru na produktivni.cz. [Odhlásit odběr](#) jde jedním klikem, kdykoli a bez otázek.*
