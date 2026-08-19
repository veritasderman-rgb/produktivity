import type { Metadata } from "next";
import Link from "next/link";
import { getAllNews } from "@/lib/news";
import { getAllTips } from "@/lib/tips";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TipCard } from "@/components/TipCard";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "AI & produktivita",
    description:
      "Novinky ze světa AI nástrojů přeložené do praxe: co umí, co to znamená pro vaši práci a jak to nasadit ještě dnes.",
    eyebrow: "Novinky přeložené do praxe",
    heading: "AI & produktivita",
    leadA: "AI mění pravidla produktivity rychleji, než stíháme číst. Tady najdete novinky ",
    leadStrong: "přeložené do praxe",
    leadB: ": co nový nástroj či funkce umí, co to znamená pro vaši práci a jak to zapojit ještě dnes. Novinky sbírá automatizovaná rutina — a každou schvaluje lidská redakce.",
    itemLabel: "AI novinka",
    readTime: "min čtení",
    readMore: "Číst celou novinku",
    emptyTitle: "První novinky jsou na cestě",
    emptyDesc: "Rutina právě začala sbírat. První AI přehledy se tu objeví během pár dní.",
    tipsEyebrow: "Návody krok za krokem",
    tipsTitle: "Všechny AI tipy",
    tipsLead: "Od prvního promptu po rutiny, které pracují za vás, když spíte.",
    ctaEyebrow: "Nezmeškejte nic",
    ctaDesc: "Nejdůležitější AI novinky posíláme i v týdenním newsletteru.",
  },
  en: {
    title: "AI & productivity",
    description:
      "News from the world of AI tools translated into practice: what it does, what it means for your work and how to put it to use today.",
    eyebrow: "News translated into practice",
    heading: "AI & productivity",
    leadA: "AI is rewriting the rules of productivity faster than anyone can read. What you get here is news ",
    leadStrong: "translated into practice",
    leadB: ": what the new tool or feature does, what it means for your work and how to put it to use today. An automated routine collects the news — a human editor approves every single item.",
    itemLabel: "AI update",
    readTime: "min read",
    readMore: "Read the full update",
    emptyTitle: "The first updates are on their way",
    emptyDesc: "The routine has just started collecting. The first AI briefings will show up here within days.",
    tipsEyebrow: "Step-by-step guides",
    tipsTitle: "All AI tips",
    tipsLead: "From your first prompt to routines that work for you while you sleep.",
    ctaEyebrow: "Do not miss anything",
    ctaDesc: "The AI news that matters also goes out in the weekly newsletter.",
  },
};

function formatDate(iso: string, locale: Locale) {
  const [y, m, d] = iso.split("-").map(Number);
  if (locale === "en") {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    });
  }
  return `${d}. ${m}. ${y}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://www.produktivni.cz/ai";
  const enUrl = "https://www.productive.tips/ai";
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

export default async function AiPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const news = getAllNews(locale);
  const aiTips = getAllTips(locale).filter((tip) => tip.category === "ai");

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        {t.leadA}
        <strong className="text-ink">{t.leadStrong}</strong>
        {t.leadB}
      </p>

      {news.length > 0 ? (
        <div className="mt-10 grid gap-5">
          {news.map((n) => (
            <article key={n.slug} className="border border-hairline-strong bg-card p-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow text-faint">
                  {t.itemLabel} · {formatDate(n.date, locale)}
                </span>
                <span className="eyebrow text-faint">
                  {n.minutes} {t.readTime}
                </span>
              </div>
              <h2 className="text-[19px] leading-snug font-bold">
                <Link href={p(`/ai/${n.slug}`)} className="hover:text-accent">
                  {n.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">{n.excerpt}</p>
              <Link
                href={p(`/ai/${n.slug}`)}
                className="mt-4 inline-block draw-link text-[13px] font-bold"
              >
                {t.readMore}
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">{t.emptyTitle}</p>
          <p className="text-[14.5px] text-muted">{t.emptyDesc}</p>
        </div>
      )}

      {aiTips.length > 0 && (
        <section className="mt-16 border-t-2 border-hairline-strong pt-10">
          <p className="eyebrow mb-2 text-faint">{t.tipsEyebrow}</p>
          <h2 className="display text-[clamp(24px,4vw,34px)]">{t.tipsTitle}</h2>
          <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">{t.tipsLead}</p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {aiTips.map((tip, i) => (
              <TipCard key={tip.slug} tip={tip} index={aiTips.length - i} locale={locale} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-12 max-w-xl">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 text-[14.5px] text-muted">{t.ctaDesc}</p>
        <NewsletterForm source="ai-sekce" locale={locale} />
      </div>
    </div>
  );
}
