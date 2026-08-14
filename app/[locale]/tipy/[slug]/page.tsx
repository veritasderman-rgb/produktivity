import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllTips, getTip } from "@/lib/tips";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { TipCard } from "@/components/TipCard";
import { chapterForTip, relatedTips } from "@/lib/related";
import { annotateGlossary } from "@/lib/annotate";
import { Pojem } from "@/components/Pojem";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, howToJsonLd } from "@/components/JsonLd";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";
import { CopyPre } from "@/components/CopyPre";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BackToTop } from "@/components/BackToTop";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { Pomohlo } from "@/components/Pomohlo";
import { extractHeadings, extractHowToSteps, flatText, slugify } from "@/lib/toc";
import { formatReviewed, reviewedLabel } from "@/lib/reviewed";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";

const T = {
  cs: {
    breadcrumb: "Tipy & triky",
    ogLabel: "produktivni.cz · tip",
    chapterPre: "Chcete jít do hloubky? V příručce najdete kapitolu",
    relatedTitle: "Podobné tipy",
    ctaEyebrow: "Líbil se vám tip?",
    ctaDesc: "Každý týden posílám jeden takový do e-mailu. Dvě minuty čtení, hodiny úspor.",
    readTime: "min čtení",
    doing: (h: number) => `velký návod, provedení ~${h} h`,
    toc: "Obsah článku",
    faq: "Časté otázky",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
  },
  en: {
    breadcrumb: "Tips & tricks",
    ogLabel: "productive.tips · tip",
    chapterPre: "Want to go deeper? The handbook has a whole chapter on it —",
    relatedTitle: "Similar tips",
    ctaEyebrow: "Liked this tip?",
    ctaDesc: "I send one like it every week by email. Two minutes to read, hours saved.",
    readTime: "min read",
    doing: (h: number) => `in-depth guide, doing it ~${h} h`,
    toc: "In this article",
    faq: "Common questions",
    copy: { copy: "Copy", copied: "Copied ✓" },
  },
};

/** Minimální počet H2, od kterého se vyplatí ukázat obsah článku. */
const TOC_MIN_HEADINGS = 4;

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllTips(params.locale).map((tip) => ({ slug: tip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const tip = getTip(slug, locale);
  if (!tip) return {};
  const csUrl = `https://produktivni.cz/tipy/${slug}`;
  const enUrl = `https://productive.tips/tipy/${slug}`;
  return {
    title: tip.title,
    description: tip.excerpt,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: tip.title,
      description: tip.excerpt,
      images: [`/api/og?title=${encodeURIComponent(tip.title)}&label=${encodeURIComponent(t.ogLabel)}`],
    },
  };
}

/** Komponenty pro MDX se vyrábějí podle jazyka — kvůli popiskům tlačítka „zkopírovat". */
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

function heroImage(slug: string): string | null {
  const file = path.join(process.cwd(), "public", "img", "tipy", `${slug}.webp`);
  return fs.existsSync(file) ? `/img/tipy/${slug}.webp` : null;
}

export default async function TipDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const dict = getDict(locale).tipCard;

  const tip = getTip(slug, locale);
  if (!tip) notFound();

  const allTips = getAllTips(locale);
  const chapter = chapterForTip(tip, locale);
  const related = relatedTips(tip, allTips);
  const hero = heroImage(tip.slug);
  const headings = extractHeadings(tip.body);
  const reviewedIso = tip.updated ?? tip.date;
  const reviewed = formatReviewed(reviewedIso, locale);
  /* HowTo jen u velkých průvodců (tělo > 18 000 zn.) s číslovaným postupem v H2. */
  const howToSteps = tip.isGuide ? extractHowToSteps(tip.body) : [];

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <ReadingProgress />
      <JsonLd data={articleJsonLd({ locale, path: `/tipy/${tip.slug}`, title: tip.title, description: tip.excerpt, datePublished: tip.date, dateModified: reviewedIso, section: tip.category, tldr: tip.tldr })} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.breadcrumb, path: "/tipy" }, { name: tip.title, path: `/tipy/${tip.slug}` }])} />
      {tip.faq && <JsonLd data={faqJsonLd(tip.faq)} />}
      {howToSteps.length > 0 && (
        <JsonLd data={howToJsonLd({ locale, path: `/tipy/${tip.slug}`, title: tip.title, description: tip.excerpt, steps: howToSteps })} />
      )}
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/tipy")} className="hover:underline">{t.breadcrumb}</Link>
        {" · "}
        {dict.categories[tip.category] ?? tip.category} ·{" "}
        {dict.platforms[tip.platform] ?? tip.platform} · {tip.saves} · {tip.minutes} {t.readTime}
        {tip.doingHours !== undefined && <> · {t.doing(tip.doingHours)}</>}
      </p>
      <h1 className="display text-[clamp(26px,4.5vw,42px)] normal-case" style={{ textTransform: "none" }}>
        {tip.title}
      </h1>
      {reviewed && (
        <p className="eyebrow mt-3 text-faint">
          {reviewedLabel[locale]}: <time dateTime={reviewedIso}>{reviewed}</time>
        </p>
      )}
      {tip.keys.length > 0 && (
        <p className="mt-6 border-y border-hairline py-4 text-[18px]">
          {tip.keys.map((combo, ci) => (
            <span key={ci} className="mr-6 inline-block">
              {combo.map((k, i) => (
                <span key={k + i}>
                  {i > 0 && <span className="mx-1.5 text-faint">+</span>}
                  <kbd className="key">{k}</kbd>
                </span>
              ))}
            </span>
          ))}
        </p>
      )}
      {hero && (
        <Image
          src={hero}
          alt={locale === "en" ? `Illustration for: ${tip.title}` : `Ilustrace k článku: ${tip.title}`}
          width={1280}
          height={720}
          className="mt-8 w-full border border-hairline-strong"
          priority
        />
      )}
      {tip.tldr && (
        <aside className="tldr mt-8">
          <p className="eyebrow mb-2 text-faint">TL;DR</p>
          <p>{tip.tldr}</p>
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
      <div className="prose-a mt-6">
        {/* blockJS: false — obsah je náš vlastní z repa; výrazy v props infografik jsou nutné */}
        <MDXRemote source={annotateGlossary(tip.body, locale)} components={makeMdxComponents(locale)} options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
      {tip.category === "ai" && <DataDisclaimer locale={locale} />}
      {chapter && (
        <p className="mt-10 border border-hairline bg-surface p-4 text-[14px] text-muted">
          {t.chapterPre}{" "}
          <Link href={p(`/prirucka/${chapter.slug}`)} className="draw-link font-bold text-ink">
            {chapter.title}
          </Link>
          .
        </p>
      )}
      {related.length > 0 && (
        <div className="mt-12">
          <p className="eyebrow mb-4 text-faint">{t.relatedTitle}</p>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((r, i) => (
              <TipCard key={r.slug} tip={r} index={i + 1} locale={locale} />
            ))}
          </div>
        </div>
      )}
      {tip.faq && tip.faq.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-sans text-[24px] font-extrabold tracking-[-0.02em] text-ink">{t.faq}</h2>
          <div className="flex flex-col gap-2">
            {tip.faq.map((item) => (
              <details key={item.q} className="faq-item">
                <summary>{item.q}</summary>
                <p className="faq-a">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}
      <Pomohlo slug={tip.slug} locale={locale} />
      <div className="mt-14 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`tip-${tip.slug}`} locale={locale} />
        </div>
      </div>
      <BackToTop locale={locale} />
      <NewsletterPopup locale={locale} />
    </article>
  );
}
