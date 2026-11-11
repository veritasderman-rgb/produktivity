import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getFeed, type FeedItem, type FeedKind } from "@/lib/whats-new";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

// Fronta publikování: nový článek se tu objeví v den svého `date` (lib/publish.ts).
export const revalidate = 3600;

/** Kolik posledních položek stránka ukazuje a kolik nejvýš z jednoho dne. */
const LIMIT = 40;
const PER_DAY = 6;

const T = {
  cs: {
    title: "Co je nového",
    description:
      "Všechno, co na Produktivní.cz nově vyšlo: tipy, AI novinky a díly seriálu o agentech, seřazené podle data vydání.",
    eyebrow: "Nově vydáno",
    heading: "Co je nového",
    lead: "Nové tipy, AI novinky a díly seriálu o agentech tak, jak vycházely. Každý pracovní den přibude jeden.",
    kinds: { tip: "Tip", ai: "AI novinka", agent: "Agenti" } as Record<FeedKind, string>,
    more: (n: number) => `a dalších ${n} z toho dne`,
    all: "Všechny tipy →",
    rss: "Odebírat přes RSS",
    ctaEyebrow: "Nechcete sem chodit?",
    ctaDesc: "Jednou týdně vám to nejlepší z nových článků pošlu e-mailem.",
  },
  en: {
    title: "What's new",
    description:
      "Everything newly published on Productive: tips, AI news and parts of the agents series, ordered by publication date.",
    eyebrow: "Newly published",
    heading: "What's new",
    lead: "New tips, AI news and parts of the agents series in the order they came out. One more every working day.",
    kinds: { tip: "Tip", ai: "AI news", agent: "Agents" } as Record<FeedKind, string>,
    more: (n: number) => `and ${n} more from that day`,
    all: "All tips →",
    rss: "Follow via RSS",
    ctaEyebrow: "Would you rather not check back?",
    ctaDesc: "Once a week I email the best of the new articles.",
  },
};

const CS_DAYS = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];

function dayLabel(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  if (locale === "en") {
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return `${CS_DAYS[date.getUTCDay()]} ${d}. ${m}. ${y}`;
}

function groupByDay(items: FeedItem[]): [string, FeedItem[]][] {
  const groups = new Map<string, FeedItem[]>();
  for (const item of items) {
    const list = groups.get(item.date);
    if (list) list.push(item);
    else groups.set(item.date, [item]);
  }
  return [...groups.entries()];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale];
  const csUrl = "https://www.produktivni.cz/nove";
  const enUrl = "https://www.productive.tips/nove";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: { title: t.title, description: t.description, images: [ogImage(t.title, locale)] },
  };
}

export default async function WhatsNewPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale];
  const p = (path: string) => localePath(locale, path);
  // Den s hromadným importem by jinak zabral celou stránku — z každého dne
  // jen PER_DAY položek a počet zbylých.
  const days: { date: string; shown: FeedItem[]; rest: number }[] = [];
  let budget = LIMIT;
  for (const [date, items] of groupByDay(getFeed(locale))) {
    if (budget <= 0) break;
    const shown = items.slice(0, Math.min(PER_DAY, budget));
    budget -= shown.length;
    days.push({ date, shown, rest: items.length - shown.length });
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>
      {locale === "cs" && (
        <p className="mt-3 text-[14px]">
          <a href="/rss.xml" className="draw-link font-semibold">
            {t.rss}
          </a>
        </p>
      )}

      {days.map(({ date, shown, rest }) => {
        return (
          <section key={date} className="mt-10 border-t-2 border-hairline-strong pt-5">
            <h2 className="eyebrow text-accent">
              <time dateTime={date}>{dayLabel(date, locale)}</time>
            </h2>
            <ul>
              {shown.map((item) => (
                <li key={item.path} className="border-b border-hairline py-4">
                  <p className="eyebrow mb-1 text-faint">{t.kinds[item.kind]}</p>
                  <p className="text-[17px] leading-snug font-bold">
                    <Link href={p(item.path)} className="draw-link">
                      {item.title}
                    </Link>
                  </p>
                  <p className="mt-1.5 max-w-[68ch] text-[14.5px] leading-relaxed text-muted">
                    {item.excerpt}
                  </p>
                </li>
              ))}
            </ul>
            {rest > 0 && (
              <p className="mt-3 text-[14px] text-muted">
                {t.more(rest)} ·{" "}
                <Link href={p("/tipy")} className="draw-link font-semibold text-ink">
                  {t.all}
                </Link>
              </p>
            )}
          </section>
        );
      })}

      <div className="mt-16 max-w-xl">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 text-[14.5px] text-muted">{t.ctaDesc}</p>
        <NewsletterForm source="nove" locale={locale} />
      </div>
    </div>
  );
}
