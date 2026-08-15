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
import { Disclaimer } from "@/components/Disclaimer";
import { TipCard } from "@/components/TipCard";
import { chapterForTip, relatedTips } from "@/lib/related";
import { annotateGlossary } from "@/lib/annotate";
import { Pojem } from "@/components/Pojem";
import { JsonLd, articleJsonLd, breadcrumbJsonLd, faqJsonLd, howToJsonLd } from "@/components/JsonLd";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";
import { CopyPre } from "@/components/CopyPre";
import { KeysDemo } from "@/components/KeysDemo";
import { TypewriterPre } from "@/components/TypewriterPre";
import { PrintButton } from "@/components/PrintButton";
import { ReadingProgress } from "@/components/ReadingProgress";
import { BackToTop } from "@/components/BackToTop";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { Pomohlo } from "@/components/Pomohlo";
import { SaveButton } from "@/components/SaveButton";
import { extractHeadings, extractHowToSteps, flatText, slugify } from "@/lib/toc";
import { formatReviewed, reviewedLabel } from "@/lib/reviewed";
import { changesForSlug } from "@/lib/changes";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { OknaDemo } from "@/components/OknaDemo";
import { PredPo } from "@/components/PredPo";

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
    print: "Vytisknout / uložit PDF",
    tested: "Fakta ověřena proti nástrojům",
    changeHistory: "Historie změn tohoto návodu →",
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
    print: "Print / save as PDF",
    tested: "Facts verified against the tools",
    changeHistory: "Change history for this guide →",
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
  const csUrl = `https://www.produktivni.cz/tipy/${slug}`;
  const enUrl = `https://www.productive.tips/tipy/${slug}`;
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

/**
 * Obsah prvního ```text bloku v těle článku — ten jediný dostane psací efekt
 * (TypewriterPre). Detekce běží nad zdrojem už při přípravě stránky, ne přes
 * počítadlo v renderu: annotateGlossary nechává kódové ploty netknuté, takže
 * obsah bloku ve zdroji === textContent vyrenderovaného <pre> (po trim).
 */
function firstTextBlock(body: string): string | null {
  const m = /```text[^\n]*\n([\s\S]*?)```/.exec(body);
  const content = m?.[1].trim();
  return content ? content : null;
}

/**
 * Komponenty pro MDX se vyrábějí podle jazyka — kvůli popiskům tlačítka
 * „zkopírovat". `typewriter` = obsah prvního ```text bloku (viz
 * firstTextBlock); `pre`, jehož text se s ním shoduje, dostane psací efekt.
 * Zámek `typewriterUsed` žije v closure per volání (per request), takže
 * paralelní rendery si nic nesdílí a případný duplicitní blok se stejným
 * obsahem se animuje jen jednou. Ostatní bloky jedou beze změny přes CopyPre.
 */
function makeMdxComponents(locale: Locale, typewriter: string | null = null) {
  const copy = (T[locale] ?? T.cs).copy;
  let typewriterUsed = false;
  return {
    kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
    Pojem,
    table: (props: React.HTMLAttributes<HTMLTableElement>) => (
      <div className="table-scroll">
        <table {...props} />
      </div>
    ),
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => {
      const isFirstText =
        typewriter !== null && !typewriterUsed && flatText(props.children).trim() === typewriter;
      if (isFirstText) typewriterUsed = true;
      return (
        <CopyPre label={copy}>
          {isFirstText ? (
            <TypewriterPre>
              <pre {...props} />
            </TypewriterPre>
          ) : (
            <pre {...props} />
          )}
        </CopyPre>
      );
    },
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
  /* Ověření faktů proti živým nástrojům — silnější stopa než `updated`; zapisuje ho jen ověřovací běh (docs/OVEROVANI.md). */
  const tested = formatReviewed(tip.tested, locale);
  /* Odkaz na rubriku „Co se změnilo" — jen když má tip aspoň jeden záznam v changelogu. */
  const hasChangelog = changesForSlug(tip.slug).length > 0;
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
      {tested && tip.tested && (
        <p className="eyebrow mt-1 text-faint">
          <Link href={p("/zmeny")} className="hover:underline">
            {t.tested}: <time dateTime={tip.tested}>{tested}</time>
          </Link>
        </p>
      )}
      {hasChangelog && (
        <p className="eyebrow mt-1 text-faint">
          <Link href={p("/zmeny")} className="hover:underline">
            {t.changeHistory}
          </Link>
        </p>
      )}
      <div className="mt-4 flex flex-wrap items-end gap-2">
        <SaveButton type="tip" slug={tip.slug} title={tip.title} locale={locale} />
        {tip.isGuide && <PrintButton label={t.print} />}
      </div>
      {tip.keys.length > 0 && <KeysDemo keys={tip.keys} />}
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
      <div className={`prose-a mt-6 ${headings.length >= TOC_MIN_HEADINGS ? "prose-numbered" : "prose-marked"}`}>
        {/* blockJS: false — obsah je náš vlastní z repa; výrazy v props infografik jsou nutné */}
        <MDXRemote source={annotateGlossary(tip.body, locale)} components={makeMdxComponents(locale, firstTextBlock(tip.body))} options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>
      {tip.category === "ai" && <DataDisclaimer locale={locale} />}
      {chapter && (
        <p className="print-hide mt-10 border border-hairline bg-surface p-4 text-[14px] text-muted">
          {t.chapterPre}{" "}
          <Link href={p(`/prirucka/${chapter.slug}`)} className="draw-link font-bold text-ink">
            {chapter.title}
          </Link>
          .
        </p>
      )}
      {related.length > 0 && (
        <div className="print-hide mt-12">
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
      <Disclaimer locale={locale} />
      <div className="print-hide mt-14 border-t-2 border-hairline-strong pt-8">
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
