import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllChapters, getChapter, getSectionLabels } from "@/lib/chapters";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { OknaDemo } from "@/components/OknaDemo";
import { PredPo } from "@/components/PredPo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Disclaimer } from "@/components/Disclaimer";
import { TipCard } from "@/components/TipCard";
import { getAllTips } from "@/lib/tips";
import { tipsForChapter } from "@/lib/related";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { annotateGlossary } from "@/lib/annotate";
import { Pojem } from "@/components/Pojem";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { CopyPre } from "@/components/CopyPre";
import { PrintButton } from "@/components/PrintButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { SaveButton } from "@/components/SaveButton";
import { BackToTop } from "@/components/BackToTop";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { extractHeadings, flatText, slugify } from "@/lib/toc";
import { formatReviewed, reviewedLabel } from "@/lib/reviewed";

const T = {
  cs: {
    breadcrumb: "Příručka",
    ogLabel: "produktivni.cz · příručka",
    readTime: "min čtení",
    toc: "Obsah článku",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
    print: "Vytisknout / uložit PDF",
    navAria: "Další kapitoly",
    prev: "← Předchozí",
    next: "Další →",
    relatedTitle: "Související tipy",
    ctaEyebrow: "Chcete pokračovat v tempu?",
    ctaDesc: "Každý týden jeden tip z příručky do e-mailu — v pořadí, které dává smysl.",
  },
  en: {
    breadcrumb: "Handbook",
    ogLabel: "productive.tips · handbook",
    readTime: "min read",
    toc: "In this article",
    copy: { copy: "Copy", copied: "Copied ✓" },
    print: "Print / save as PDF",
    navAria: "More chapters",
    prev: "← Previous",
    next: "Next →",
    relatedTitle: "Related tips",
    ctaEyebrow: "Want to keep the momentum?",
    ctaDesc: "One tip from the handbook by email each week — in an order that makes sense.",
  },
};

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllChapters(params.locale).map((ch) => ({ slug: ch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const ch = getChapter(slug, locale);
  if (!ch) return {};
  const csUrl = `https://produktivni.cz/prirucka/${slug}`;
  const enUrl = `https://productive.tips/prirucka/${slug}`;
  return {
    title: ch.title,
    description: ch.excerpt,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: ch.title,
      description: ch.excerpt,
      images: [`/api/og?title=${encodeURIComponent(ch.title)}&label=${encodeURIComponent(t.ogLabel)}`],
    },
  };
}

/** Minimální počet H2, od kterého se vyplatí ukázat obsah článku. */
const TOC_MIN_HEADINGS = 4;

/** Komponenty pro MDX se vyrábějí podle jazyka — kvůli popiskům tlačítka „zkopírovat". */
function makeMdxComponents(locale: Locale) {
  const copy = (T[locale] ?? T.cs).copy;
  return {
    Pojem,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="table-scroll">
        <table {...props} />
      </div>
    ),
    kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
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
    OknaDemo,
    PredPo,
  };
}

function heroImage(slug: string): string | null {
  const file = path.join(process.cwd(), "public", "img", "prirucka", `${slug}.webp`);
  return fs.existsSync(file) ? `/img/prirucka/${slug}.webp` : null;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const ch = getChapter(slug, locale);
  if (!ch) notFound();

  const chapters = getAllChapters(locale);
  const sectionLabels = getSectionLabels(locale);
  const idx = chapters.findIndex((c) => c.slug === ch.slug);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const hero = heroImage(ch.slug);
  const related = tipsForChapter(ch.slug, getAllTips(locale));
  const headings = extractHeadings(ch.body);
  const reviewed = formatReviewed(ch.updated, locale);

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <ReadingProgress />
      <JsonLd data={articleJsonLd({ locale, path: `/prirucka/${ch.slug}`, title: ch.title, description: ch.excerpt, dateModified: ch.updated, section: sectionLabels[ch.section] })} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.breadcrumb, path: "/prirucka" }, { name: ch.title, path: `/prirucka/${ch.slug}` }])} />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/prirucka")} className="hover:underline">{t.breadcrumb}</Link>
        {" · "}
        {sectionLabels[ch.section]} · {ch.minutes} {t.readTime}
      </p>
      <h1 className="display text-[clamp(28px,4.5vw,44px)]" style={{ textTransform: "none" }}>
        {ch.title}
      </h1>
      {reviewed && (
        <p className="eyebrow mt-3 text-faint">
          {reviewedLabel[locale]}: <time dateTime={ch.updated}>{reviewed}</time>
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <SaveButton type="kapitola" slug={ch.slug} title={ch.title} locale={locale} />
        <PrintButton label={t.print} />
      </div>
      <p className="mt-4 border-b border-hairline pb-6 text-[17px] leading-relaxed text-muted">
        {ch.excerpt}
      </p>
      {hero && (
        <Image
          src={hero}
          alt={locale === "en" ? `Illustration for: ${ch.title}` : `Ilustrace ke kapitole: ${ch.title}`}
          width={1280}
          height={720}
          className="mt-8 w-full border border-hairline-strong"
          priority
        />
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
      <div className={`prose-a mt-6 ${headings.length >= TOC_MIN_HEADINGS ? "prose-numbered" : "prose-marked"}`}>
        {/* blockJS: false — obsah je náš vlastní z repa; výrazy v props infografik jsou nutné */}
        <MDXRemote source={annotateGlossary(ch.body, locale)} components={makeMdxComponents(locale)} options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      <Disclaimer locale={locale} />
      <nav className="print-hide mt-14 grid gap-3 border-t-2 border-hairline-strong pt-6 sm:grid-cols-2" aria-label={t.navAria}>
        {prev ? (
          <Link href={p(`/prirucka/${prev.slug}`)} className="group border border-hairline bg-card p-4 hover:border-accent">
            <span className="eyebrow text-faint">{t.prev}</span>
            <span className="mt-1 block text-[14.5px] font-bold group-hover:text-accent">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={p(`/prirucka/${next.slug}`)} className="group border border-hairline bg-card p-4 text-right hover:border-accent">
            <span className="eyebrow text-faint">{t.next}</span>
            <span className="mt-1 block text-[14.5px] font-bold group-hover:text-accent">{next.title}</span>
          </Link>
        )}
      </nav>

      {related.length > 0 && (
        <div className="print-hide mt-12">
          <p className="eyebrow mb-4 text-faint">{t.relatedTitle}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((r, i) => (
              <TipCard key={r.slug} tip={r} index={i + 1} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <div className="print-hide mt-12">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`kapitola-${ch.slug}`} locale={locale} />
        </div>
      </div>
      <BackToTop locale={locale} />
      <NewsletterPopup locale={locale} />
    </article>
  );
}
