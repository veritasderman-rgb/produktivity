import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Ochrana osobních údajů",
    description:
      "Jaké osobní údaje Produktivní.cz zpracovává, proč, jak dlouho a jaká máte práva.",
    eyebrow: "Právní informace",
    heading: "Ochrana osobních údajů",
    intro:
      "Vaše soukromí beru vážně — koneckonců polovina téhle příručky je o tom, jak se bránit digitálnímu šumu. Tady je přehledně a lidsky sepsáno, jaké údaje tento web zpracovává a proč.",
    controllerTitle: "Kdo údaje zpracovává",
    controllerA: "Správcem osobních údajů je ",
    controllerName: "Josef Pavlovic",
    controllerB: " (provozovatel webu Produktivní.cz). Kontakt: ",
    controllerC: ".",
    dataTitle: "Jaké údaje sbírám a proč",
    dataItems: [
      {
        strong: "Newsletter:",
        rest: " e-mailovou adresu — abych vám mohl posílat týdenní newsletter a jednorázově doručit e-book. Právním základem je váš souhlas (přihlášení k odběru), který můžete kdykoli odvolat odhlašovacím odkazem v každém e-mailu.",
      },
      {
        strong: "Poptávka školení:",
        rest: " jméno, pracovní e-mail, název firmy, velikost týmu a text poptávky — abych vám mohl odpovědět a připravit nabídku. Právním základem je jednání o smlouvě z vašeho podnětu.",
      },
    ],
    dataNote:
      "Žádné další osobní údaje web aktivně nesbírá. Nepoužívám reklamní cookies. Pro měření návštěvnosti používám Google Analytics, které cookies ukládá — podrobnosti níže.",
    processorsTitle: "Kdo mi s tím pomáhá (zpracovatelé)",
    processors: [
      {
        strong: "Brevo",
        rest: " (Sendinblue GmbH, EU) — rozesílka newsletteru a správa kontaktů. Vaše adresa je uložena u nich.",
      },
      {
        strong: "Vercel",
        rest: " (Vercel Inc.) — hosting webu a anonymní měření návštěvnosti (Vercel Web Analytics), které funguje bez cookies a bez identifikace konkrétních osob.",
      },
      {
        strong: "Google Analytics",
        rest: " (Google Ireland Limited) — měření návštěvnosti. Ukládá do vašeho prohlížeče cookies a zpracovává zkrácenou IP adresu a údaje o zařízení, aby rozlišilo opakované návštěvy. Měření můžete odmítnout blokováním cookies v prohlížeči nebo doplňkem Google pro odhlášení z Analytics.",
      },
    ],
    retentionTitle: "Jak dlouho údaje držím",
    retention: [
      "Newsletter: do odvolání souhlasu (odhlášení).",
      "Poptávky školení: po dobu jednání a následně po dobu nezbytnou pro případné navazující služby, nejdéle 3 roky od poslední komunikace.",
    ],
    rightsTitle: "Vaše práva",
    rightsA:
      "Podle GDPR máte právo na přístup ke svým údajům, jejich opravu či výmaz, omezení zpracování, přenositelnost a právo vznést námitku. Stačí napsat na ",
    rightsB:
      " — odpovídám do 30 dnů, obvykle mnohem dřív. Pokud byste nebyli spokojeni, můžete se obrátit na Úřad pro ochranu osobních údajů (uoou.gov.cz).",
    changesTitle: "Změny tohoto dokumentu",
    changes:
      "Pokud se způsob zpracování změní (např. přibude nový nástroj), aktualizuji tuto stránku. Poslední aktualizace: srpen 2026.",
    contactA: "Máte otázku? ",
    contactLink: "Napište mi",
    contactB: " — na rovinu a bez právničiny.",
  },
  en: {
    title: "Privacy policy",
    description:
      "What personal data Produktivni.cz processes, why, for how long and what rights you have.",
    eyebrow: "Legal information",
    heading: "Privacy policy",
    intro:
      "I take your privacy seriously — half of this handbook is about defending yourself from digital noise, after all. Here is a clear, plain-language account of what data this site processes and why.",
    controllerTitle: "Who processes the data",
    controllerA: "The data controller is ",
    controllerName: "Josef Pavlovic",
    controllerB: " (the operator of Produktivni.cz). Contact: ",
    controllerC: ".",
    dataTitle: "What I collect and why",
    dataItems: [
      {
        strong: "Newsletter:",
        rest: " your email address — so I can send you the weekly newsletter and deliver the e-book once. The legal basis is your consent (signing up), which you can withdraw at any time using the unsubscribe link in every email.",
      },
      {
        strong: "Training inquiry:",
        rest: " your name, work email, company name, team size and the text of your inquiry — so I can reply and put a proposal together. The legal basis is pre-contractual negotiation at your request.",
      },
    ],
    dataNote:
      "The site actively collects no other personal data. I use no advertising cookies. For traffic measurement I use Google Analytics, which does store cookies — details below.",
    processorsTitle: "Who helps me with it (processors)",
    processors: [
      {
        strong: "Brevo",
        rest: " (Sendinblue GmbH, EU) — newsletter delivery and contact management. Your address is stored with them.",
      },
      {
        strong: "Vercel",
        rest: " (Vercel Inc.) — website hosting and anonymous traffic measurement (Vercel Web Analytics), which works without cookies and without identifying individuals.",
      },
      {
        strong: "Google Analytics",
        rest: " (Google Ireland Limited) — traffic measurement. It stores cookies in your browser and processes a truncated IP address along with device data in order to tell repeat visits apart. You can opt out by blocking cookies in your browser or by installing Google's Analytics opt-out add-on.",
      },
    ],
    retentionTitle: "How long I keep the data",
    retention: [
      "Newsletter: until you withdraw consent (unsubscribe).",
      "Training inquiries: for the duration of our negotiation and then for as long as any follow-up services require, at most 3 years from our last contact.",
    ],
    rightsTitle: "Your rights",
    rightsA:
      "Under the GDPR you have the right to access your data, to have it corrected or erased, to restrict processing, to data portability and to object. Just write to ",
    rightsB:
      " — I reply within 30 days, usually much sooner. If you are not satisfied, you can turn to the Czech Data Protection Authority (uoou.gov.cz).",
    changesTitle: "Changes to this document",
    changes:
      "If the way data is processed changes (a new tool is added, for example), I will update this page. Last updated: August 2026.",
    contactA: "Got a question? ",
    contactLink: "Write to me",
    contactB: " — straight, and without the legalese.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://www.produktivni.cz/ochrana-osobnich-udaju";
  const enUrl = "https://www.productive.tips/ochrana-osobnich-udaju";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      images: [ogImage(t.title, locale)],
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(26px,4vw,40px)]">{t.heading}</h1>
      <div className="prose-a mt-8">
        <p>{t.intro}</p>

        <h2>{t.controllerTitle}</h2>
        <p>
          {t.controllerA}
          <strong>{t.controllerName}</strong>
          {t.controllerB}
          <a href="mailto:josef@josefpavlovic.cz">josef@josefpavlovic.cz</a>
          {t.controllerC}
        </p>

        <h2>{t.dataTitle}</h2>
        <ul>
          {t.dataItems.map((item) => (
            <li key={item.strong}>
              <strong>{item.strong}</strong>
              {item.rest}
            </li>
          ))}
        </ul>
        <p>{t.dataNote}</p>

        <h2>{t.processorsTitle}</h2>
        <ul>
          {t.processors.map((item) => (
            <li key={item.strong}>
              <strong>{item.strong}</strong>
              {item.rest}
            </li>
          ))}
        </ul>

        <h2>{t.retentionTitle}</h2>
        <ul>
          {t.retention.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>

        <h2>{t.rightsTitle}</h2>
        <p>
          {t.rightsA}
          <a href="mailto:josef@josefpavlovic.cz">josef@josefpavlovic.cz</a>
          {t.rightsB}
        </p>

        <h2>{t.changesTitle}</h2>
        <p>{t.changes}</p>

        <p>
          {t.contactA}
          <Link href={p("/o-projektu")}>{t.contactLink}</Link>
          {t.contactB}
        </p>
      </div>
    </div>
  );
}
