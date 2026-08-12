import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNews, getNewsItem } from "@/lib/news";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const T = {
  cs: {
    breadcrumb: "AI & produktivita",
    readTime: "min čtení",
    source: "Zdroj:",
    ctaEyebrow: "AI novinky každý týden",
    ctaDesc: "To podstatné ze světa AI a produktivity v týdenním newsletteru.",
  },
  en: {
    breadcrumb: "AI & productivity",
    readTime: "min read",
    source: "Source:",
    ctaEyebrow: "AI news every week",
    ctaDesc: "What matters in AI and productivity, in one weekly newsletter.",
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

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllNews(params.locale).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const n = getNewsItem(slug, locale);
  if (!n) return {};
  const csUrl = `https://produktivni.cz/ai/${slug}`;
  const enUrl = `https://productive.tips/ai/${slug}`;
  return {
    title: n.title,
    description: n.excerpt,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

const mdxComponents = {
  kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
  Stats,
  Timeline,
  Bars,
  Matrix,
  Flow,
  Donut,
};

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const n = getNewsItem(slug, locale);
  if (!n) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd data={articleJsonLd({ locale, path: `/ai/${n.slug}`, title: n.title, description: n.excerpt, datePublished: n.date, section: "AI" })} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.breadcrumb, path: "/ai" }, { name: n.title, path: `/ai/${n.slug}` }])} />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/ai")} className="hover:underline">{t.breadcrumb}</Link>
        {" · "}
        {formatDate(n.date, locale)} · {n.minutes} {t.readTime}
      </p>
      <h1 className="display text-[clamp(26px,4.5vw,42px)]" style={{ textTransform: "none" }}>
        {n.title}
      </h1>
      <p className="mt-4 border-b border-hairline pb-6 text-[17px] leading-relaxed text-muted">
        {n.excerpt}
      </p>
      <div className="prose-a mt-6">
        {/* blockJS: false — obsah je náš vlastní z repa */}
        <MDXRemote source={n.body} components={mdxComponents} options={{ blockJS: false }} />
      </div>
      <DataDisclaimer locale={locale} />
      {n.source && (
        <p className="mt-8 border-t border-hairline pt-4 text-[13.5px] text-faint">
          {t.source}{" "}
          <a href={n.source} className="border-b border-accent font-semibold text-muted hover:text-accent" rel="noopener noreferrer" target="_blank">
            {n.sourceName ?? new URL(n.source).hostname}
          </a>
        </p>
      )}
      <div className="mt-12">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`ai-${n.slug}`} locale={locale} />
        </div>
      </div>
    </article>
  );
}
