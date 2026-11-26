# Komunikace s občany

AI připraví návrh, vy ho pošlete svým hlasem.

- **Dotaz nebo stížnost:** vložte text **bez jména**, k tomu usnesení nebo odpověď úřadu. AI napíše věcnou odpověď: co víme, co uděláte a dokdy. Odpověď nesmí slibovat, co zastupitel sám splnit nemůže.
- **Komentáře na Facebooku:** z vlákna vybrat skutečné dotazy, oddělit je od emocí a navrhnout krátké odpovědi. Trolly nechte být.
- **Newsletter po jednání:** ze zápisu a vašich poznámek pět bodů: co se schválilo, co to znamená pro lidi, jak jste hlasovali a proč.

```text
Napiš odpověď občanovi na tento dotaz (bez jména): [text].
Podklady: [usnesení / odpověď úřadu]. Struktura: co víme, co udělám,
dokdy se ozvu. Do 150 slov, vykání, lidsky. Neslibuj nic, co
zastupitel nemůže splnit sám.
```

Styl si uložte do projektu: oslovení, délka, tykání nebo vykání, co nikdy neslibovat. Před odesláním použijte v Piráti KB kontrolu textu před zveřejněním (`zkontroluj_text`) a ověření tvrzení o Pirátech (`over_tvrzeni`).

## Jednoduchá stránka k projednání

Stránka k veřejnému projednání, petici nebo anketě za večer:

1. **Popis v pěti větách:** „Stránka k veřejnému projednání rekonstrukce náměstí: termín, mapa, tři varianty, formulář na připomínky.“
2. **AI napíše stránku jako artefakt.** Hned ji vidíte, sdílíte odkazem a upravujete větou: „větší písmo, přidej odkaz na podklady“.
3. **Vlastní doména:** nasazení přes hosting s konektorem (například Vercel), odpovědi z formuláře do databáze (Neon nebo Supabase), potvrzení e-mailem (Resend). Postup: [Vlastní web s Claude Code a Vercelem](https://www.produktivni.cz/tipy/web-claude-code-vercel).
4. **GDPR a vypnutí:** sbírejte jen nutné údaje, napište, kdo je správce a kdy data smažete. Po projednání stránku vypněte.

Správcem osobních údajů z formuláře je podle běžného výkladu ten, kdo stránku provozuje (zastupitel nebo místní sdružení), ne obec. Když stránku provozujete z pověření obce, může to být jinak. V pochybnostech se zeptejte pověřence pro ochranu osobních údajů.
