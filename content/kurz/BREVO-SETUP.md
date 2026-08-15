# Nastavení kurzu „AI za týden" v Brevu

Stručný návod, jak z textů v `content/kurz/den-1.md` … `den-7.md` udělat funkční
automatickou sérii sedmi e-mailů. Celé to zabere zhruba hodinu, opakovat se to
už nemusí.

## Jak to funguje

Formulář na stránce `/kurz` posílá e-mail na `/api/subscribe`. Ta route vytvoří
kontakt v Brevu, přidá ho do seznamu podle `BREVO_LIST_ID` a **nastaví mu
atribut `SOURCE` na hodnotu `kurz`** (formulář na stránce kurzu posílá
`source="kurz"`, ostatní formuláře posílají jiné hodnoty, např.
`newsletter-page`).

Právě podle atributu `SOURCE` se pozná, komu se má kurz rozeslat.

## 1. Atribut SOURCE

Contacts → Settings → Contact attributes. Zkontrolujte, že existuje atribut
`SOURCE` typu **Text**. Když ho tam nevidíte, založte ho ručně — Brevo ho sice
při prvním kontaktu vytvoří samo, ale automatizace ho potřebuje znát dopředu.

## 2. Sedm e-mailových šablon — HOTOVO

Šablony jsou v Brevu **už založené** (Campaigns → Templates), aktivní,
s odesílatelem Josef Pavlovic a reply-to `josef@josefpavlovic.cz`.
Vygenerovaly se z `content/kurz/den-N.md` a `content/kurz/en/day-N.md`,
prompty jsou v nich zachované znak po znaku.

| Den | CS — ID | EN — ID |
|---|---|---|
| 1 | 13 | 20 |
| 2 | 14 | 21 |
| 3 | 15 | 22 |
| 4 | 16 | 23 |
| 5 | 17 | 24 |
| 6 | 18 | 25 |
| 7 | 19 | 26 |

Tagy: `kurz-cs` a `kurz-en` — podle nich šablony v Brevu snadno vyfiltrujete.

**Když upravíte text v `content/kurz/`**, změna se do Brevu nepropíše sama.
Buď ji přeneste ručně, nebo si nechte šablonu založit znovu a v automatizaci
přepněte na nové ID.

**Poznámka k odkazům:** Brevo si ke všem odkazům samo přidává UTM parametry
(link tracking), včetně odhlašovacího. Je to jeho výchozí chování; kdyby vadilo,
dá se sledování odkazů v nastavení Brevu vypnout.

## 3. Automatizace — VYŘEŠENO V APLIKACI (Brevo Automations nejsou potřeba)

Brevo API tvorbu automatizací nepodporuje, proto rozesílku řeší web sám:

- **Den 1** posílá `/api/subscribe` okamžitě po přihlášení (`SOURCE=kurz`),
  šablona dle jazyka (CS 13 / EN 20), a kontaktu nastaví atribut `KURZ_DEN=1`.
- **Dny 2–7** posílá denní cron `/api/kurz-drip` (Vercel Cron, 06:00 UTC,
  viz `vercel.json`): projde kontakty listu, a komu od přihlášení uběhl další
  den, pošle následující šablonu a posune `KURZ_DEN`. Max jeden díl na kontakt
  a den; odhlášení (blacklist) kontakt z rozesílky vyřazuje automaticky.
- Atributy `KURZ_DEN` (číslo) a `LOCALE` (text) si cron/route založí samy.

**Doporučené:** ve Vercelu nastavte proměnnou `CRON_SECRET` (libovolný dlouhý
řetězec) — cron endpoint pak přijímá jen podepsaná volání. Bez ní se spoléhá
na hlavičku Vercel Cronu.

Chcete-li přesto použít Brevo Automations (hezčí statistiky), postavte je
podle šablon výše a **vypněte cron** smazáním záznamu z `vercel.json` —
jinak by odběratelé dostávali díly dvakrát.

## 4. Než to pustíte

- Přihlaste se přes `/kurz` vlastním e-mailem a ověřte, že se kontakt v Brevu
  založil **s atributem SOURCE = kurz**.
- V automatizaci dočasně zkraťte čekání na pár minut, projděte všech sedm
  e-mailů, zkontrolujte odkazy a zalomení promptů, pak čekání vraťte na 1 day.
- Zkontrolujte, že se odhlašovací odkaz opravdu odhlašuje.

## 5. Po kurzu

Po Dni 7 kontakt zůstává v běžném newsletteru — v posledním e-mailu je to
napsané. Nic dalšího nastavovat nemusíte.

## Kde co změnit

- Texty e-mailů: `content/kurz/den-1.md` … `den-7.md` (po úpravě je potřeba
  přenést změnu i do šablony v Brevu, nekopíruje se to samo).
- Stránka s přihlášením: `app/[locale]/kurz/page.tsx`.
- Odesílání kontaktu do Brevu a atribut `SOURCE`: `app/api/subscribe/route.ts`.
- Proměnné prostředí: `BREVO_API_KEY`, `BREVO_LIST_ID`, `BREVO_SENDER_EMAIL`.

## English version

Anglická verze je **druhá, samostatná automatizace** se stejnou strukturou —
jen se šablonami ID 20 až 26 a podmínkou `LOCALE` **equals** `en`.

Rozlišení jazyka **už je vyřešené**: formulář posílá spolu se `source` i
`locale` a `app/api/subscribe/route.ts` z něj ukládá atribut `LOCALE`
(`cs` / `en`). Obě jazykové mutace posílají `SOURCE = kurz`, takže bez
`LOCALE` by se automatizace navzájem přebíjely.

**Než anglickou automatizaci zapnete:** ověřte v Contacts → Settings →
Contact attributes, že atribut `LOCALE` typu Text existuje. Brevo ho založí
samo při prvním kontaktu, ale automatizace ho potřebuje znát dopředu.

Seznam (list) může být stejný jako pro český kurz, nebo — pokud chcete mít
anglické odběratele odděleně i pro běžný newsletter po skončení kurzu —
samostatný `BREVO_LIST_ID_EN`; v tom případě v `subscribe/route.ts` podle
`locale` vybírejte správný list.

## Kapacita účtu

Účet běží na **volném tarifu**. Sedmidenní kurz spotřebuje 7 odeslání na
jednoho odběratele, takže při 269 zbývajících kreditech obslouží zhruba
38 lidí. Než kurz začnete propagovat, zkontrolujte zůstatek kreditů.
