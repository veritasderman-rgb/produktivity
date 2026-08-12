---
subject: "Den 5: AI nepočítá, AI píše postup výpočtu"
preheader: "Číslo z chatu nesmí do rozhodnutí. Tady je, co s tabulkou dělat místo toho."
---

Dnešek je krátký, ale zachrání vás před nejtrapnější chybou, jakou s AI můžete udělat: prezentovat číslo, které si model vymyslel.

## Myšlenka dne

Zeptáte se na průměrnou hodnotu objednávky, dostanete „1 847 Kč", vypadá to věrohodně, dáte to do prezentace. Jenže model to číslo nespočítal. **Vygeneroval ho jako text** — jako slovo, které v té větě dávalo smysl.

Jsou dva důvody, proč číslo z chatu nesmí do rozhodnutí. Zaprvé, jazykový model není kalkulačka; generuje pravděpodobné pokračování, ne výsledek operace. Zadruhé, u delší tabulky **nevidí celá data** — pracuje s výřezem a zbytek dopočítá odhadem.

Řešení je jednoduché a funguje vždycky: **AI nemá počítat, AI má napsat postup, který výpočet provede.** Vzorec do Excelu, nebo krátký skript. Ten vrátí stejné číslo pokaždé, dá se zkontrolovat a hlavně ho jde spustit znovu, až přijdou nová data. Rozdíl mezi „AI mi řekla 1 847" a „mám vzorec, který spočítá 1 847" je celý rozdíl mezi hádáním a analýzou.

Výjimka existuje: nástroje, které kód opravdu spouštějí (analýza dat v ChatGPT, Claude s prostředím na kód). Tam je číslo výsledkem výpočtu — ale i tak si nechte ukázat kód a zkontrolujte, co počítá.

A ještě jedna věc, než něco nahrajete: **z exportu ven se jménem, rodným číslem, adresou a e-mailem.** Na analýzu potřebujete částky, data a kategorie, ne identitu zákazníka. Když se bez identifikátoru neobejdete, nahraďte ho pořadovým číslem.

## Prompt na dnešek

Než začnete cokoli počítat, nechte si udělat profil dat. Je to krok, který lidé přeskakují a pak staví závěry na díře v datech.

```
Napiš mi vzorec do Excelu / Google Sheets (a stručně vysvětli,
co dělá), který mi odpoví na tuhle otázku:

OTÁZKA: [např. jaký je průměrný počet dní mezi objednávkou
a zaplacením u zákazníků z kategorie X]

MOJE TABULKA:
- sloupce a co v nich je: [A: datum objednávky, B: datum
  platby, C: kategorie zákazníka, ...]
- počet řádků: [zhruba]
- kde vím o problémech: [např. u části řádků chybí datum
  platby, jsou tam storna se zápornou částkou]

Chci:
1. vzorec ke zkopírování,
2. vysvětlení po částech, ať vím, co počítá,
3. seznam řádků/případů, které vzorec vyřadí nebo zkreslí,
4. jednu kontrolu, kterou si ověřím, že výsledek dává smysl.

Sám žádné číslo nepočítej ani neodhaduj.
```

Ten poslední řádek je celý dnešní den. A bod 4 vás naučí víc než celý zbytek — dobrá kontrola je třeba „součet podskupin musí dát celek".

## Celý článek

Podrobně, včetně explorace neznámého datasetu, hledání trendů a šesti způsobů, jak se splést nad správnými čísly: [Analýza dat s AI: od CSV k závěru, který obhájíte](https://produktivni.cz/tipy/ai-analyza-dat)

## Mini-úkol na dnešek

Vezměte jednu tabulku, kterou máte po ruce, a položte nad ní jednu otázku — promptem výše. Vzorec vložte, výsledek zkontrolujte tou kontrolou z bodu 4.

Když s tabulkami nepracujete, dnešek berte jako pravidlo do zásoby: **žádné číslo z chatu bez postupu, jak vzniklo.**

Zítra se podíváme na to, co přijde, až AI přestane čekat na vaši otázku.

Josef
