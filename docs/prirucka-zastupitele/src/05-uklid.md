# Úklid v počítači, aby s tím AI mohla pracovat

AI funguje jako násobič. Když máte podklady rozházené ve Stažených souborech, na ploše a v příloze e-mailů, AI ten chaos jen znásobí: najde starou verzi, splete si dvě smlouvy, přehlédne přílohu. Pevná struktura složek je to nejlepší, co pro přesnost výstupů uděláte, a zabere jedno odpoledne.

## Krok 1: jedna kořenová složka

Založte jednu složku pro celou agendu zastupitele, třeba `Zastupitelstvo-Marianske-Lazne`. Ne na ploše a ne ve Stažených souborech.

- **Záloha:** složku mějte na Google Disku, OneDrivu nebo jiném úložišti, které se zálohuje. Než necháte AI soubory přesouvat, musí existovat kopie.
- **Jen veřejné a anonymizované:** do této složky dávejte jen to, co smí vidět AI. Neveřejné materiály rady a dokumenty s osobními údaji patří do jiné složky, ke které AI nepustíte.

## Krok 2: stejná struktura pro všechno

```text
Zastupitelstvo-[obec]/
├── CLAUDE.md             pravidla pro AI (kapitola Pracovní systém)
├── RUTINA.md             jak zpracovat nové podklady (kapitola Dashboard)
├── registr.md            rozcestník: kde co je
├── jednani/
│   └── 2026-12-15/
│       ├── podklady/     PDF z webu obce
│       └── vystupy/      rozbory bodů, otázky, poznámky
├── usneseni/             všechna usnesení od začátku období
├── rozpocet/             rozpočet, rozpočtová opatření, závěrečný účet
├── smlouvy/              výpisy z registru smluv
├── projekty/             jeden soubor na projekt: stav, rozpočet, termín
├── moje-dotazy/          dotazy, žádosti, odpovědi, lhůty
├── obcane/               dotazy občanů BEZ osobních údajů
└── vzory/                vaše hotové texty jako předloha stylu
```

Každé jednání má vlastní složku s datem a uvnitř vždy stejné podsložky. Jakmile strukturu jednou zavedete, AI v desktopové aplikaci ji dodržuje sama a nové soubory ukládá tam, kam patří.

## Krok 3: názvy souborů

- **Datum na začátek:** `2026-12-15_rozbor_bod-7-prodej-pozemku.md`. Soubory se pak samy řadí podle času.
- **Bez mezer, ideálně bez diakritiky:** pomlčky a podtržítka nevadí žádnému nástroji.
- **Jedna verze:** přípona `_koncept` nebo `_final`, nikdy `final2_opravdu_posledni.docx`. Staré verze přesuňte do podsložky `archiv/`.

## Krok 4: PDF, ve kterém jde označit text

AI čte text, ne obrázky. Otevřete PDF a zkuste v něm myší označit větu.

- **Text se označí:** v pořádku.
- **Neoznačí se, je to sken:** převeďte ho na text (OCR). Jde to například v Adobe Acrobatu nebo tak, že PDF otevřete na Google Disku jako Dokument Google. Bez toho AI ze skenu vyčte málo nebo nic a začne domýšlet.

Kde to jde, ukládejte data jako tabulku (`.xlsx`, `.csv`) místo PDF, hlavně rozpočet a seznamy smluv. Čísla z tabulky AI nepřepisuje s chybami.

## Krok 5: co do složky nepatří

- osobní údaje občanů (jména z podnětů, adresy, přílohy žádostí),
- neveřejné materiály rady, uzavřených jednání a klubu,
- hesla, přístupové kódy, API klíče,
- soukromé dokumenty, které s mandátem nesouvisejí.

## Krok 6: nechte AI uklidit staré soubory

Desktopová aplikace Claude nebo ChatGPT umí se složkou pracovat přímo. Pusťte ji jen ke složce, kterou potřebuje, ne k celému disku. Pak zadejte:

```text
Projdi složku Stažené soubory. Vypiš soubory, které se týkají
zastupitelstva obce [název], a ke každému navrhni, do které podsložky
podle struktury v CLAUDE.md patří a jak ho přejmenovat
(RRRR-MM-DD_typ_tema). Soubory s osobními údaji označ zvlášť.
Nic nepřesouvej ani nemaž, dokud seznam neschválím.
```

Seznam si projděte, opravte a teprve pak napište „přesuň podle schváleného seznamu“. Nic nemazat: co nepotřebujete, ať jde do `archiv/`.

## Krok 7: rozcestník

Do souboru `registr.md` patří tabulka: číslo a název jednání, projekty, městské firmy s IČO, kontakty na odbory úřadu (jen pracovní), konektory. U každé položky složka a odkaz na zdroj. AI pak nehledá po celém disku, jde rovnou na místo. Je to rychlejší, levnější a méně omylů. Rozcestník umí AI vyplnit sama, třeba přes konektor Piráti KB a Hlídač státu.

## Jak AI ke složce pustit

- **Claude:** v desktopové aplikaci vyberete složku, se kterou má pracovat. Obecný výklad, jak se AI k souborům na disku dostane, je v článku [Soubory z disku do chatu](https://www.produktivni.cz/agenti/soubory-z-disku-do-chatu).
- **ChatGPT:** desktopová aplikace nebo Codex, rovněž s výběrem složky.
- **Bez desktopové aplikace:** soubory nahrajte do projektu v ChatGPT nebo Claude. Funguje to taky, jen musíte nahrávat ručně.

Jak omezit přístup jen na jednu složku, popisuje [MCP lokálně: dát modelu ruce na vlastním disku](https://www.produktivni.cz/agenti/mcp-lokalne-ruce-na-disku).
