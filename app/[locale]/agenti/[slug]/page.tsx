import type { Metadata } from "next";
import Link from "next/link";
import { missingTranslation } from "@/lib/missing-translation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import {
  agentLabels,
  agentNeighbours,
  getAgentArticle,
  getAllAgentArticles,
  getAllAgentMetas,
} from "@/lib/agents";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { CopyPre } from "@/components/CopyPre";
import { NewsletterCta } from "@/components/NewsletterCta";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { Disclaimer } from "@/components/Disclaimer";
import { Pomohlo } from "@/components/Pomohlo";
import { Pojem } from "@/components/Pojem";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BackToTop } from "@/components/BackToTop";
import { SaveButton } from "@/components/SaveButton";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { annotateGlossary } from "@/lib/annotate";
import { extractHeadings, flatText, slugify } from "@/lib/toc";
import { formatReviewed, reviewedLabel } from "@/lib/reviewed";
import { isLocale, otherLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const TOC_MIN_HEADINGS = 4;

const T = {
  cs: {
    breadcrumb: "Agenti a vlastní AI",
    partLabel: "Díl",
    readTime: "min čtení",
    levels: { zacatecnik: "Pro začátečníky", pokrocily: "Pokročilé" } as Record<string, string>,
    toc: "Obsah článku",
    sources: "Zdroje",
    prev: "← Předchozí díl",
    next: "Další díl →",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
    ctaEyebrow: "Další díl vám dojde",
    ctaDesc: "Nové díly seriálu a to podstatné ze světa agentů posílám v týdenním newsletteru.",
  },
  en: {
    breadcrumb: "Agents and your own AI",
    partLabel: "Part",
    readTime: "min read",
    levels: { zacatecnik: "Beginner", pokrocily: "Advanced" } as Record<string, string>,
    toc: "In this article",
    sources: "Sources",
    prev: "← Previous part",
    next: "Next part →",
    copy: { copy: "Copy", copied: "Copied ✓" },
    ctaEyebrow: "Get the next part",
    ctaDesc: "New parts of the series and what matters in the world of agents, in one weekly email.",
  },
};

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllAgentArticles(params.locale).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const article = getAgentArticle(slug, locale);
  if (!article) return {};
  const csUrl = `https://www.produktivni.cz/agenti/${slug}`;
  const enUrl = `https://www.productive.tips/agenti/${slug}`;
  /* Anglický díl nabízíme jen tehdy, když opravdu existuje — jinak by hreflang
     posílal roboty na 404. Stejnou podmínku má sekce v sitemapě. */
  const hasEn = getAllAgentArticles("en").some((a) => a.slug === slug);
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: hasEn ? { cs: csUrl, en: enUrl, "x-default": csUrl } : { cs: csUrl, "x-default": csUrl },
    },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [ogImage(article.title, locale)],
    },
  };
}

function makeMdxComponents(locale: Locale) {
  const copy = (T[locale] ?? T.cs).copy;
  return {
    kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
    Pojem,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="table-scroll">
        <table {...props} />
      </div>
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <CopyPre label={copy}>
        <pre {...props} />
      </CopyPre>
    ),
    h2: ({ children }: { children?: React.ReactNode }) => (
      <h2 id={slugify(flatText(children))} className="scroll-mt-24">
        {children}
      </h2>
    ),
    Stats,
    Timeline,
    Bars,
    Matrix,
    Flow,
    Donut,
  };
}

export default async function AgentArticleDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const labels = agentLabels[locale] ?? agentLabels.cs;
  const p = (path: string) => localePath(locale, path);

  const article = getAgentArticle(slug, locale);
  // Chybí jen překlad? Přepínač jazyka nesmí skončit na 404 — viz lib/missing-translation.ts.
  if (!article) missingTranslation(locale, Boolean(getAgentArticle(slug, otherLocale(locale))), "/agenti");

  const { prev, next } = agentNeighbours(getAllAgentMetas(locale), slug);
  const headings = extractHeadings(article.body);
  const reviewedIso = article.updated ?? article.date;
  const reviewed = formatReviewed(reviewedIso, locale);
  const track = labels.tracks[article.track];

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <ReadingProgress />
      <JsonLd
        data={articleJsonLd({
          locale,
          path: `/agenti/${article.slug}`,
          title: article.title,
          description: article.excerpt,
          datePublished: article.date,
          dateModified: reviewedIso,
          section: track.name,
          tldr: article.tldr,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.breadcrumb, path: "/agenti" },
          { name: article.title, path: `/agenti/${article.slug}` },
        ])}
      />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/agenti")} className="hover:underline">
          {t.breadcrumb}
        </Link>
        {" · "}
        <Link href={`${p("/agenti")}#${article.track}`} className="hover:underline">
          {track.name}
        </Link>
        {" · "}
        {t.partLabel} {String(article.order).padStart(2, "0")} · {t.levels[article.level]} ·{" "}
        {article.minutes} {t.readTime}
      </p>
      <h1 className="display text-[clamp(26px,4.5vw,42px)]" style={{ textTransform: "none" }}>
        {article.title}
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-muted">{article.excerpt}</p>
      {reviewed && (
        <p className="eyebrow mt-3 text-faint">
          {reviewedLabel[locale]}: <time dateTime={reviewedIso}>{reviewed}</time>
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <SaveButton type="agent" slug={article.slug} title={article.title} locale={locale} />
      </div>
      {article.tags.length > 0 && (
        <p className="mt-4 flex flex-wrap gap-x-2 gap-y-1 border-b border-hairline pb-6">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`${p("/agenti")}?stitek=${tag}`}
              className="eyebrow text-faint no-underline hover:text-accent"
            >
              #{labels.tags[tag]}
            </Link>
          ))}
        </p>
      )}
      {article.tldr && (
        <aside className="tldr mt-8">
          <p className="eyebrow mb-2 text-faint">TL;DR</p>
          <p>{article.tldr}</p>
        </aside>
      )}
      {headings.length >= TOC_MIN_HEADINGS && (
        <details className="toc mt-8">
          <summary>{t.toc}</summary>
          <ol>
            {headings.map((h) => (
              <li key={h.id}>
                <a href={`#${h.id}`}>{h.text}</a>
              </li>
            ))}
          </ol>
        </details>
      )}
      <div
        className={`prose-a mt-6 ${headings.length >= TOC_MIN_HEADINGS ? "prose-numbered" : "prose-marked"}`}
      >
        {/* blockJS: false — obsah je náš vlastní z repa; výrazy v props infografik jsou nutné */}
        <MDXRemote
          source={annotateGlossary(article.body, locale)}
          components={makeMdxComponents(locale)}
          options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>
      <DataDisclaimer locale={locale} />
      {article.sources.length > 0 && (
        <section className="mt-10 border-t border-hairline pt-5">
          <p className="eyebrow mb-3 text-faint">{t.sources}</p>
          <ul className="space-y-1.5 text-[13.5px] text-muted">
            {article.sources.map((s) => (
              <li key={s.url}>
                <a
                  href={s.url}
                  className="border-b border-accent font-semibold hover:text-accent"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {s.name}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}
      {(prev || next) && (
        <nav className="print-hide mt-12 grid gap-4 border-t border-hairline pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={p(`/agenti/${prev.slug}`)} className="border border-hairline bg-card p-4 no-underline hover:border-ink">
              <span className="eyebrow block text-faint">{t.prev}</span>
              <span className="mt-1.5 block text-[15px] font-bold text-ink">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={p(`/agenti/${next.slug}`)} className="border border-hairline bg-card p-4 text-right no-underline hover:border-ink">
              <span className="eyebrow block text-faint">{t.next}</span>
              <span className="mt-1.5 block text-[15px] font-bold text-ink">{next.title}</span>
            </Link>
          )}
        </nav>
      )}
      <Pomohlo slug={article.slug} locale={locale} />
      <Disclaimer locale={locale} />
      <NewsletterCta
        eyebrow={t.ctaEyebrow}
        desc={t.ctaDesc}
        source={`agenti-${article.slug}`}
        locale={locale}
      />
      <BackToTop locale={locale} />
      <NewsletterPopup locale={locale} />
    </article>
  );
}
