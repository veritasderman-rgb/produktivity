import Link from "next/link";
import { Suspense } from "react";
import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TipBrowser } from "@/components/TipBrowser";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import {
  audienceBase,
  audienceHref,
  audiencePath,
  audiences,
  formatTipCount,
  tipsForAudience,
  type Audience,
} from "@/lib/audiences";
import { getDict, localePath, type Locale } from "@/lib/i18n";

const CS_BASE = "https://www.produktivni.cz";
const EN_BASE = "https://www.productive.tips";

/** Doporučený start = tři nejlepší velké návody skupiny. */
const START_COUNT = 3;

/** Absolutní URL obou jazykových mutací — canonical i hreflang. */
export function audienceUrls(audience: Audience) {
  return {
    cs: `${CS_BASE}${audiencePath(audience, "cs")}`,
    en: `${EN_BASE}${audiencePath(audience, "en")}`,
  };
}

export function audienceMetadata(audience: Audience, locale: Locale): Metadata {
  const t = getDict(locale).pro;
  const urls = audienceUrls(audience);
  const title = `${t.titlePrefix} ${audience.forWhom[locale]}`;
  return {
    title,
    description: audience.description[locale],
    alternates: {
      canonical: locale === "en" ? urls.en : urls.cs,
      languages: { cs: urls.cs, en: urls.en, "x-default": urls.cs },
    },
    openGraph: {
      title,
      description: audience.description[locale],
      images: [
        `/api/og?title=${encodeURIComponent(title)}&label=${encodeURIComponent(t.eyebrow)}`,
      ],
    },
  };
}

export function AudienceLanding({
  audience,
  locale,
}: {
  audience: Audience;
  locale: Locale;
}) {
  const t = getDict(locale).pro;
  const dict = getDict(locale).tipCard;
  const p = (path: string) => localePath(locale, path);
  const tips = tipsForAudience(audience.id, locale);
  const start = tips.filter((tip) => tip.isMega).slice(0, START_COUNT);
  const others = audiences.filter((a) => a.id !== audience.id);
  const title = `${t.titlePrefix} ${audience.forWhom[locale]}`;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.hubTitle, path: audienceBase(locale) },
          { name: audience.name[locale], path: audiencePath(audience, locale) },
        ])}
      />

      <p className="eyebrow mb-2 text-faint">
        <Link href={p(audienceBase(locale))} className="hover:text-accent">
          {t.eyebrow}
        </Link>
        {" · "}
        {formatTipCount(tips.length, locale)}
      </p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{title}</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        {audience.description[locale]}
      </p>

      {start.length > 0 && (
        <section className="mt-12 border-t-2 border-hairline-strong pt-9">
          <p className="eyebrow mb-2 text-faint">{t.startEyebrow}</p>
          <h2 className="display text-[clamp(22px,3.6vw,30px)]">{t.startTitle}</h2>
          <p className="mt-3 max-w-[56ch] text-[15px] leading-relaxed text-muted">{t.startLead}</p>
          <div className="mt-7 grid gap-5 sm:grid-cols-3">
            {start.map((tip, i) => (
              <Link
                key={tip.slug}
                href={p(`/tipy/${tip.slug}`)}
                className="linkblock flex flex-col border-[1.5px] border-hairline-strong bg-card p-6 transition-transform hover:-translate-y-[3px] hover:shadow-[0_4px_0_var(--key-shadow)]"
              >
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <span className="mega-badge">{dict.megaBadge}</span>
                  <span className="tabular font-mono text-[13px] font-bold text-faint">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">
                  <span className="draw-link">{tip.title}</span>
                </h3>
                <p className="mt-3 grow font-serif text-[14.5px] leading-[1.6] text-muted">
                  {tip.excerpt}
                </p>
                <span className="eyebrow mt-4 text-faint">
                  {dict.categories[tip.category] ?? tip.category} · {tip.minutes} {dict.minShort}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mt-14 border-t-2 border-hairline-strong pt-9">
        <p className="eyebrow mb-2 text-faint">{t.allEyebrow}</p>
        <h2 className="display text-[clamp(22px,3.6vw,30px)]">{t.allTitle}</h2>
        {tips.length > 0 ? (
          <>
            <p className="mt-3 mb-7 max-w-[56ch] text-[15px] leading-relaxed text-muted">
              {t.allLead}
            </p>
            <Suspense>
              <TipBrowser
                tips={tips}
                locale={locale}
                lockedAudience={audience.id}
                basePath={audiencePath(audience, locale)}
              />
            </Suspense>
          </>
        ) : (
          <div className="mt-7 border border-hairline bg-card p-8">
            <p className="font-bold">{t.emptyTitle}</p>
            <p className="mt-2 max-w-[52ch] text-[14px] text-muted">{t.emptyDesc}</p>
            <Link href={p("/tipy")} className="draw-link mt-4 inline-block text-[13.5px] font-bold">
              {t.allTipsLink}
            </Link>
          </div>
        )}
      </section>

      <section className="mt-14 border-t border-hairline pt-9">
        <p className="eyebrow mb-2 text-faint">{t.otherEyebrow}</p>
        <h2 className="text-[19px] font-bold">{t.otherTitle}</h2>
        <div className="mt-5 flex flex-wrap gap-2">
          {others.map((a) => (
            <Link
              key={a.id}
              href={audienceHref(a, locale)}
              className="border-[1.5px] border-hairline bg-paper px-3.5 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-ink hover:text-accent"
            >
              {a.name[locale]}
            </Link>
          ))}
          <Link
            href={p(audienceBase(locale))}
            className="border-[1.5px] border-ink bg-ink px-3.5 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] text-paper uppercase transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {t.allProfessions}
          </Link>
        </div>
      </section>

      <div className="mt-14 max-w-xl border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 text-[14.5px] text-muted">{t.ctaDesc}</p>
        <NewsletterForm source={`pro-${audience.id}`} locale={locale} />
      </div>
    </div>
  );
}
