---
subject: "Den 4: čtyřicet stran za tři minuty — a jak to ověřit"
preheader: "Shrnutí s odkazem na stránku. A tři otázky, které odhalí hezky znějící nesmysl."
---

Dnešek má dvě půlky a ty patří k sobě. První je nejrychlejší úspora, jakou AI nabízí. Druhá je jediná dovednost z celého kurzu, kterou nesmíte přeskočit.

## Myšlenka dne

Číst čtyřicet stran od začátku do konce je často špatné pořadí. Nejdřív potřebujete mapu, teprve pak terén.

Jenže „shrň mi tenhle dokument" je nejslabší prompt, jaký můžete napsat — dostanete obecný odstavec, ze kterého nepoznáte, co máte udělat. Dobré shrnutí musí vědět **kdo to čte a proč**, a hlavně musí u každého bodu říct, **kde přesně v dokumentu to stojí**. Ne kvůli formě: díky tomu totiž shrnutí umíte za minutu zkontrolovat.

A tím jsme u druhé půlky. Jazykový model je stroj na pravděpodobné pokračování textu. Když odpověď nezná, nevygeneruje „nevím" — vygeneruje něco, co jako správná odpověď vypadá. Vymyšlená citace má věrohodného autora, vymyšlený paragraf věrohodné číslo. Nebezpečné to není proto, že se model plete, ale proto, že se plete **stejným tónem**, jakým říká pravdu.

U každé odpovědi si proto položte tři otázky:

1. **Mohl to model vědět?** Věci o vaší firmě, vašem klientovi nebo včerejších cenách neví, pokud jste mu je nedal. Když se přesto objeví, jsou vymyšlené.
2. **Je to ověřitelné, nebo jen hezky formulované?** Formulace model umí. Čísla, jména, paragrafy a odkazy se ověřují.
3. **Co by se stalo, kdyby to byla chyba?** Špatný brainstorm nestojí nic. Špatné číslo v nabídce klientovi stojí zakázku.

## Prompt na dnešek

Vezměte dokument, který dnes stejně musíte přečíst — smlouvu, zprávu, zápis, studii.

```
Přikládám dokument [název].
Čtenář: [kdo to bude číst]. Účel: [proč to čte].

Struktura výstupu, dodrž ji přesně:
1. O čem dokument je — 3 věty, žádné obecnosti
2. Deset hlavních bodů. U každého: tvrzení jednou větou
   a v závorce strana nebo kapitola, kde to v dokumentu je
3. Čísla a data k zapamatování: hodnota, co znamená, strana
4. Termíny a lhůty, seřazené podle data
5. Tři pasáže, které si mám přečíst v originále, a proč
6. Co dokument NEŘEŠÍ, i když by se to od něj čekalo

Nic nedoplňuj z obecných znalostí, i kdyby to bylo správně.
Kde si nejsi jistý umístěním v textu, napiš „umístění
neurčeno" místo odhadu.
```

Pak namátkou zkontrolujte tři odrážky v původním souboru. Když sedí, obvykle sedí i zbytek. Když jedna odkazuje na pasáž, která tam není, přestaňte věřit celému shrnutí. A když u většiny bodů stojí „umístění neurčeno", model text vidí nespolehlivě — rozdělte dokument na části.

Nejcennější bývá bod 6. Dokumenty se často poznají spíš podle toho, co v nich chybí.

## Celé články

[Dlouhý dokument? Výtah s čísly stránek](https://produktivni.cz/tipy/ai-shrnuti-dokumentu) a [AI si vymýšlí s jistotou v hlase](https://produktivni.cz/tipy/ai-overovani-faktu)

## Mini-úkol na dnešek

Shrňte jeden reálný dokument a **tři body si ověřte v originále**. Ta kontrola je celý dnešní úkol — je to návyk, který vás jednou zachrání.

Zítra čísla: proč AI nesmí počítat v chatu.

Josef
