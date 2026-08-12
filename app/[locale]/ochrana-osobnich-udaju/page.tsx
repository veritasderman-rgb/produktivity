import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ochrana osobních údajů",
  description:
    "Jaké osobní údaje Produktivní.cz zpracovává, proč, jak dlouho a jaká máte práva.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">Právní informace</p>
      <h1 className="display text-[clamp(26px,4vw,40px)]">Ochrana osobních údajů</h1>
      <div className="prose-a mt-8">
        <p>
          Vaše soukromí beru vážně — koneckonců polovina téhle příručky je o tom,
          jak se bránit digitálnímu šumu. Tady je přehledně a lidsky sepsáno,
          jaké údaje tento web zpracovává a proč.
        </p>

        <h2>Kdo údaje zpracovává</h2>
        <p>
          Správcem osobních údajů je <strong>Josef Pavlovic</strong> (provozovatel
          webu Produktivní.cz). Kontakt:{" "}
          <a href="mailto:josef@josefpavlovic.cz">josef@josefpavlovic.cz</a>.
        </p>

        <h2>Jaké údaje sbírám a proč</h2>
        <ul>
          <li>
            <strong>Newsletter:</strong> e-mailovou adresu — abych vám mohl posílat
            týdenní newsletter a jednorázově doručit e-book. Právním základem je váš
            souhlas (přihlášení k odběru), který můžete kdykoli odvolat odhlašovacím
            odkazem v každém e-mailu.
          </li>
          <li>
            <strong>Poptávka školení:</strong> jméno, pracovní e-mail, název firmy,
            velikost týmu a text poptávky — abych vám mohl odpovědět a připravit
            nabídku. Právním základem je jednání o smlouvě z vašeho podnětu.
          </li>
        </ul>
        <p>
          Žádné další osobní údaje web aktivně nesbírá. Nepoužívám reklamní ani
          sledovací cookies.
        </p>

        <h2>Kdo mi s tím pomáhá (zpracovatelé)</h2>
        <ul>
          <li>
            <strong>Brevo</strong> (Sendinblue GmbH, EU) — rozesílka newsletteru
            a správa kontaktů. Vaše adresa je uložena u nich.
          </li>
          <li>
            <strong>Vercel</strong> (Vercel Inc.) — hosting webu a anonymní
            měření návštěvnosti (Vercel Web Analytics), které funguje{" "}
            <strong>bez cookies</strong> a bez identifikace konkrétních osob.
          </li>
        </ul>

        <h2>Jak dlouho údaje držím</h2>
        <ul>
          <li>Newsletter: do odvolání souhlasu (odhlášení).</li>
          <li>Poptávky školení: po dobu jednání a následně po dobu nezbytnou pro
            případné navazující služby, nejdéle 3 roky od poslední komunikace.</li>
        </ul>

        <h2>Vaše práva</h2>
        <p>
          Podle GDPR máte právo na přístup ke svým údajům, jejich opravu či výmaz,
          omezení zpracování, přenositelnost a právo vznést námitku. Stačí napsat na{" "}
          <a href="mailto:josef@josefpavlovic.cz">josef@josefpavlovic.cz</a> —
          odpovídám do 30 dnů, obvykle mnohem dřív. Pokud byste nebyli spokojeni,
          můžete se obrátit na Úřad pro ochranu osobních údajů (uoou.gov.cz).
        </p>

        <h2>Změny tohoto dokumentu</h2>
        <p>
          Pokud se způsob zpracování změní (např. přibude nový nástroj), aktualizuji
          tuto stránku. Poslední aktualizace: srpen 2026.
        </p>

        <p>
          Máte otázku? <Link href="/o-projektu">Napište mi</Link> — na rovinu a bez
          právničiny.
        </p>
      </div>
    </div>
  );
}
