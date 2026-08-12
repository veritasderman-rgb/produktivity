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

## 2. Sedm e-mailových šablon

Campaigns → Templates → New template, a to sedmkrát.

Pro každý den `den-N.md`:

- **Předmět** = hodnota `subject` z frontmatteru souboru.
- **Preheader** (v Brevu „Preview text") = hodnota `preheader`.
- **Tělo** = text pod frontmatterem, tedy vše pod druhým `---`.
- Odesílatel: Josef Pavlovic, stejná adresa jako u newsletteru.

Poznámky k převodu textu:

- Nadpisy `## Myšlenka dne` apod. udělejte v šabloně jako podnadpisy.
- Bloky v trojitých zpětných apostrofech (```) jsou **prompty k okopírování** —
  dejte je do rámečku s neproporcionálním písmem a světlým pozadím, ať je jasné,
  co se má zkopírovat. Nezalamujte je jinak, než jak jsou napsané.
- Odkazy ve tvaru `[text](https://…)` převeďte na normální odkazy.
- Nezapomeňte na odhlašovací odkaz v patičce (Brevo ho vkládá automaticky, jen
  ověřte, že v šabloně je).

## 3. Automatizace

Automations → Create automation → Custom automation.

**Trigger:** „A contact is added to a list" (seznam s vaším `BREVO_LIST_ID`).

**První krok — podmínka:** Condition → contact attribute `SOURCE` **equals**
`kurz`. Kdo přišel odjinud, větví ven a kurz nedostane.

**Dál v ANO větvi:**

1. Send email → šablona *Den 1*
2. Wait → 1 day
3. Send email → *Den 2*
4. Wait → 1 day
5. Send email → *Den 3*
6. Wait → 1 day
7. Send email → *Den 4*
8. Wait → 1 day
9. Send email → *Den 5*
10. Wait → 1 day
11. Send email → *Den 6*
12. Wait → 1 day
13. Send email → *Den 7*

Den 1 odchází hned po přihlášení, dalších šest po jednodenních pauzách.

**Nastavení automatizace:** zapněte, že kontakt může do automatizace vstoupit
jen jednou — jinak by při opětovném přihlášení dostal celý kurz znovu.

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
