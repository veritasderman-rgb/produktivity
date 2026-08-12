---
subject: "Den 3: nepříjemný mail za dvě minuty"
preheader: "Nejtěžší na těžkém mailu není obsah, ale první věta. Tu za vás napíše AI."
---

Dnešní den je z celého kurzu ten, u kterého lidé nejčastěji řeknou „aha". Protože úspora je okamžitá a poznáte ji ještě dnes.

## Myšlenka dne

Nejtěžší na nepříjemném e-mailu není obsah, ale první věta. Víte přesně, co chcete říct — odmítnout, urgovat, omluvit se — a stejně sedíte nad prázdným oknem a dvacet minut hledáte začátek, který nebude znít ani jako výmluva, ani jako útok.

Ta prodleva je drahá. Mail zůstane rozepsaný, odejde pozdě a mezitím vás celý den straší v hlavě.

Řešení není nechat AI psát vaše maily. Řešení je nechat ji napsat **první verzi**, kterou pak za dvě minuty upravíte do svého. Rozjezd před prázdnou stránkou zmizí a zůstane jen ta část, kterou stejně umíte nejlíp — úprava.

Pozor na jednu věc: „napiš odpověď na tenhle mail" nestačí. Model neví, jaký k tomu člověku máte vztah, co mu už jednou slíbil někdo jiný a co v žádném případě slíbit nechcete. Nejdůležitější řádek celého zadání je proto **„co nesmí zaznít"** — bez něj modely rády přidají vstřícnou větu navíc („samozřejmě to zvládneme"), která vás zaváže k něčemu, co jste slíbit nechtěli.

## Prompt na dnešek

Tenhle pokryje osmdesát procent běžných mailů. Uložte si ho jako první do své sbírky.

```
Napiš návrh odpovědi na tento e-mail. Odpověď budu ještě
upravovat, takže chci draft, ne finální verzi.

PŘÍCHOZÍ ZPRÁVA:
[vlož text mailu]

KOMU ODPOVÍDÁM: [vztah — např. klient, se kterým spolupracuju
třetím rokem; vykáme si]
CO CHCI, ABY SE STALO: [výsledek u příjemce, ne téma]
FAKTA, KTERÁ MUSÍ ZAZNÍT: [termíny, čísla, podmínky —
jen to, co je pravda]
CO NESMÍ ZAZNÍT: [co neslibovat, čeho se nedotýkat]
TÓN: [např. věcně a vlídně, bez omluvných úvodů]
DÉLKA: [max 6 vět]

Pravidla:
- nevymýšlej si termíny, ceny ani okolnosti; když ti něco
  chybí, napiš na konec DOPLNIT: [co]
- nezačínej frázemi typu „děkuji za Váš e-mail"
- konec bez „v případě dotazů mě neváhejte kontaktovat"
- navrhni i předmět, pokud se má změnit
```

U opravdu citlivé zprávy si nechte rovnou tři varianty — smířlivou, neutrální a tvrdou — a vyberte. Ušetří to kolo přepisování a hlavně vám ukáže, kde vlastně leží vaše hranice.

To pravidlo o vymýšlení berte vážně: model doplní datum nebo číslo objednávky s naprostou jistotou, i když ho nikdy neviděl. A než kliknete na odeslat, přečtěte si celý mail — **AI navrhuje, vy odesíláte.** Vždycky.

## Celý článek

Včetně hotových zadání na čtyři nejtěžší typy mailů (odmítnutí, urgence, eskalace, omluva) a návodu, jak AI naučit váš hlas: [AI píše první verzi, vy finální](https://produktivni.cz/tipy/ai-prvni-navrh-mailu)

## Mini-úkol na dnešek

Najděte ve schránce mail, který odkládáte nejdéle. Ten jeden. Prožeňte ho promptem výše, upravte draft a odešlete ho ještě dnes.

Zítra si ukážeme, jak zvládnout dlouhý dokument — a jak poznat, že si ho AI nevymyslela.

Josef
