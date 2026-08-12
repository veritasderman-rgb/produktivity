import Link from "next/link";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";
import {
  audienceBase,
  audienceHref,
  audiences,
  formatTipCount,
  tipsForAudience,
} from "@/lib/audiences";
import { getDict, type Locale } from "@/lib/i18n";

const CS_BASE = "https://produktivni.cz";
const EN_BASE = "https://productive.tips";

export function audienceIndexMetadata(locale: Locale): Metadata {
  const t = getDict(locale).pro;
  const csUrl = `${CS_BASE}${audienceBase("cs")}`;
  const enUrl = `${EN_BASE}${audienceBase("en")}`;
  return {
    title: t.hubMetaTitle,
    description: t.hubDescription,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

/** Rozcestník profesí — karta na každou cílovku. */
export function AudienceIndex({ locale }: { locale: Locale }) {
  const t = getDict(locale).pro;
  const cards = audiences.map((a) => ({
    audience: a,
    count: tipsForAudience(a.id, locale).length,
  }));

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.hubEyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.hubTitle}</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">{t.hubLead}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {cards.map(({ audience, count }) => (
          <Link
            key={audience.id}
            href={audienceHref(audience, locale)}
            className="linkblock flex flex-col border border-hairline bg-card p-6 transition-colors hover:border-hairline-strong"
          >
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <span className="eyebrow text-faint">{t.eyebrow}</span>
              <span className="eyebrow tabular text-faint">{formatTipCount(count, locale)}</span>
            </div>
            <h2 className="text-[21px] leading-tight font-bold tracking-[-0.02em]">
              <span className="draw-link">{audience.name[locale]}</span>
            </h2>
            <p className="mt-3 grow font-serif text-[14.5px] leading-[1.6] text-muted">
              {audience.description[locale]}
            </p>
            <span className="draw-link mt-4 text-[13.5px] font-bold">{t.browse}</span>
          </Link>
        ))}
      </div>

      <div className="mt-14 max-w-xl border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 text-[14.5px] text-muted">{t.ctaDesc}</p>
        <NewsletterForm source="pro-rozcestnik" locale={locale} />
      </div>
    </div>
  );
}
