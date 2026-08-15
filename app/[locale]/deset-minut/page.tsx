import type { Metadata } from "next";
import Link from "next/link";
import { getAllTipMetas } from "@/lib/tips";
import { QuickPick } from "@/components/QuickPick";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/* „Mám 10 minut" — vstup pro čtenáře, jehož filtr není téma, ale čas.
   Server jen staticky vybere kandidáty (rychlé tipy do 10 minut čtení,
   bez velkých průvodců) a lehká metadata předá klientské komponentě,
   která losuje. Žádný Math.random tady v RSC — stránka je statická. */

const T = {
  cs: {
    title: "Mám 10 minut",
    description:
      "Máte jen chvilku? Jeden náhodný rychlý tip do 10 minut čtení — a tlačítko na další. Žádné velké průvodce, jen věci hotové do kávy.",
    eyebrow: (n: number) => `${n} rychlých tipů do 10 minut`,
    heading: "Mám 10 minut",
    lead: "Filtr tady není téma, ale čas: všechno níž přečtete do deseti minut. Nelíbí se první? Losujte, dokud nesedne.",
    allTips: "Všechny tipy",
  },
  en: {
    title: "I have 10 minutes",
    description:
      "Only have a moment? One random quick tip under 10 minutes of reading — and a button for the next one. No in-depth guides, just things done before your coffee cools.",
    eyebrow: (n: number) => `${n} quick tips under 10 minutes`,
    heading: "I have 10 minutes",
    lead: "The filter here is not the topic but the time: everything below reads in under ten minutes. First one not for you? Roll again until it fits.",
    allTips: "All the tips",
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
  const csUrl = "https://www.produktivni.cz/deset-minut";
  const enUrl = "https://www.productive.tips/deset-minut";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function TenMinutesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;

  // Kandidáti: rychlé čtení (≤ 10 min) a žádné velké průvodce.
  const quick = getAllTipMetas(locale).filter((tip) => tip.minutes <= 10 && !tip.isGuide);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow tabular mb-2 text-faint">{t.eyebrow(quick.length)}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 mb-9 max-w-[56ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>

      <QuickPick tips={quick} locale={locale} />

      <p className="mt-10 border-t border-hairline pt-6">
        <Link href={localePath(locale, "/tipy")} className="draw-link text-[13.5px] font-bold">
          {t.allTips} →
        </Link>
      </p>
    </div>
  );
}
