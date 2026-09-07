import type { Metadata } from "next";
import Link from "next/link";
import { getAllIssueMetas } from "@/lib/newsletter";
import { NewsletterCta } from "@/components/NewsletterCta";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Archiv newsletteru",
    description:
      "Všechna odeslaná čísla newsletteru Produktivní.cz — jeden tip týdně do hloubky, odkazy za pozornost a prompt k okopírování. Přečtěte si je dřív, než zadáte e-mail.",
    eyebrow: "Všechna odeslaná čísla",
    heading: "Archiv newsletteru",
    lead: "Každý čtvrtek ráno odchází jedno číslo: jeden tip do hloubky, pár odkazů a občas AI novinka, která stojí za vyzkoušení. Tady jsou všechna — nic za e-mailem, přečíst si je můžete rovnou.",
    back: "← Zpět na newsletter",
    issueLabel: "Číslo",
    readTime: "min čtení",
    read: "Číst celé číslo",
    emptyTitle: "První číslo teprve odejde",
    emptyDescA: "Archiv se plní tím, co skutečně odešlo — proto je zatím prázdný. Zatím se můžete podívat na ",
    emptySampleLink: "ukázkové číslo",
    emptyDescB: ", které ukazuje, jak každé vydání vypadá.",
    ctaEyebrow: "Chcete číslo každý čtvrtek?",
    ctaDesc: "Přihlaste se a jako první vám hned přijde e-book Top 30 tipů, které vám vrátí hodinu denně.",
  },
  en: {
    title: "Newsletter archive",
    description:
      "Every issue of the Productive newsletter that went out — one tip a week in depth, links worth your attention and a prompt to copy. Read them before you hand over your email.",
    eyebrow: "Every issue sent so far",
    heading: "Newsletter archive",
    lead: "One issue goes out every Thursday morning: a tip in depth, a few links and, now and then, an AI update worth trying. Here they all are — nothing behind an email form.",
    back: "← Back to the newsletter",
    issueLabel: "Issue",
    readTime: "min read",
    read: "Read the full issue",
    emptyTitle: "The first issue is still to come",
    emptyDescA: "The archive fills up with what actually went out, so it is empty for now. In the meantime, take a look at the ",
    emptySampleLink: "sample issue",
    emptyDescB: " to see what every edition looks like.",
    ctaEyebrow: "Want an issue every Thursday?",
    ctaDesc: "Sign up and the Top 30 tips e-book lands in your inbox right away.",
  },
};

function formatDate(iso: string, locale: Locale) {
  if (!/^\d{4}-\d{2}-\d{2}/.test(iso)) return "";
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (locale === "en") {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
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
  const csUrl = "https://www.produktivni.cz/newsletter/archiv";
  const enUrl = "https://www.productive.tips/newsletter/archiv";
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

export default async function NewsletterArchivePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const issues = getAllIssueMetas(locale);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(28px,4.5vw,42px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[58ch] text-[16.5px] leading-relaxed text-muted">{t.lead}</p>
      <p className="mt-4 text-[14px] font-semibold">
        <Link href={p("/newsletter")} className="draw-link">
          {t.back}
        </Link>
      </p>

      {issues.length === 0 ? (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">{t.emptyTitle}</p>
          <p className="text-[14.5px] leading-relaxed text-muted">
            {t.emptyDescA}
            <Link href={p("/newsletter/ukazka")} className="draw-link font-bold text-ink">
              {t.emptySampleLink}
            </Link>
            {t.emptyDescB}
          </p>
        </div>
      ) : (
        <div className="mt-10 border-t-2 border-hairline-strong">
          {issues.map((issue) => (
            <article key={issue.slug} className="border-b border-hairline py-6">
              <p className="eyebrow mb-1.5 text-faint">
                {t.issueLabel} {issue.number} · {formatDate(issue.date, locale)} · {issue.minutes}{" "}
                {t.readTime}
              </p>
              <h2 className="text-[18px] leading-snug font-bold tracking-[-0.01em]">
                <Link href={p(`/newsletter/archiv/${issue.slug}`)} className="draw-link">
                  {issue.subject}
                </Link>
              </h2>
              <p className="mt-2 max-w-[68ch] font-serif text-[14.5px] leading-[1.65] text-muted">
                {issue.preheader}
              </p>
              <Link
                href={p(`/newsletter/archiv/${issue.slug}`)}
                className="mt-3 inline-block draw-link text-[13px] font-bold"
              >
                {t.read}
              </Link>
            </article>
          ))}
        </div>
      )}

      <NewsletterCta
        eyebrow={t.ctaEyebrow}
        desc={t.ctaDesc}
        source="newsletter-archiv"
        locale={locale}
      />
    </div>
  );
}
