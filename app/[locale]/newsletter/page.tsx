import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Newsletter",
    description:
      "Jeden produktivní tip týdně do e-mailu. Dvě minuty čtení, hodiny úspor. Žádný spam.",
    eyebrow: "Každý čtvrtek ráno",
    heading: "Jeden tip týdně",
    lead: "Krátký e-mail s tím nejlepším z týdne: jeden tip do hloubky, pár odkazů za pozornost a občas AI novinka, která stojí za vyzkoušení. Přečtete za dvě minuty u kafe.",
    bullets: ["Žádný spam, žádné „akční nabídky“", "Odhlášení jedním klikem, kdykoli"],
    bonusPre: "Bonus hned po přihlášení: e-book ",
    bonusStrong: "Top 30 tipů, které vám vrátí hodinu denně",
    sampleLink: "Podívejte se na ukázkové číslo →",
  },
  en: {
    title: "Newsletter",
    description:
      "One productivity tip a week by email. Two minutes to read, hours saved. No spam.",
    eyebrow: "Every Thursday morning",
    heading: "One tip a week",
    lead: "A short email with the best of the week: one tip in depth, a few links worth your attention and, now and then, an AI update worth trying. Two minutes over coffee.",
    bullets: ["No spam, no “special offers”", "Unsubscribe in one click, any time"],
    bonusPre: "A bonus the moment you sign up: the e-book ",
    bonusStrong: "Top 30 tips that give you back an hour a day",
    sampleLink: "See a sample issue →",
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
  const csUrl = "https://www.produktivni.cz/newsletter";
  const enUrl = "https://www.productive.tips/newsletter";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="max-w-2xl">
        <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
        <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{t.lead}</p>
        <ul className="mt-6 mb-5 space-y-2 text-[15px] font-semibold">
          {t.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="text-faint" aria-hidden="true">→</span> {b}
            </li>
          ))}
          <li className="flex gap-3">
            <span className="text-faint" aria-hidden="true">→</span>{" "}
            <span>
              {t.bonusPre}
              <strong>{t.bonusStrong}</strong>
            </span>
          </li>
        </ul>
        <p className="mb-8 text-[15px] font-bold">
          <Link href={localePath(locale, "/newsletter/ukazka")} className="draw-link">
            {t.sampleLink}
          </Link>
        </p>
        <div className="max-w-md">
          <NewsletterForm source="newsletter-page" locale={locale} />
        </div>
      </div>
    </div>
  );
}
