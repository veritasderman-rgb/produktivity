import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllChapters, getChapter, getSectionLabels } from "@/lib/chapters";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TipCard } from "@/components/TipCard";
import { getAllTips } from "@/lib/tips";
import { tipsForChapter } from "@/lib/related";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const T = {
  cs: {
    breadcrumb: "Příručka",
    ogLabel: "produktivni.cz · příručka",
    readTime: "min čtení",
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

const mdxComponents = {
  kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
  Stats,
  Timeline,
  Bars,
  Matrix,
  Flow,
  Donut,
};

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

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd data={articleJsonLd({ locale, path: `/prirucka/${ch.slug}`, title: ch.title, description: ch.excerpt, section: sectionLabels[ch.section] })} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.breadcrumb, path: "/prirucka" }, { name: ch.title, path: `/prirucka/${ch.slug}` }])} />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/prirucka")} className="hover:underline">{t.breadcrumb}</Link>
        {" · "}
        {sectionLabels[ch.section]} · {ch.minutes} {t.readTime}
      </p>
      <h1 className="display text-[clamp(28px,4.5vw,44px)]" style={{ textTransform: "none" }}>
        {ch.title}
      </h1>
      <p className="mt-4 border-b border-hairline pb-6 text-[17px] leading-relaxed text-muted">
        {ch.excerpt}
      </p>
      {hero && (
        <Image
          src={hero}
          alt=""
          width={1280}
          height={720}
          className="mt-8 w-full border border-hairline-strong"
          priority
        />
      )}
      <div className="prose-a mt-6">
        {/* blockJS: false — obsah je náš vlastní z repa; výrazy v props infografik jsou nutné */}
        <MDXRemote source={ch.body} components={mdxComponents} options={{ blockJS: false }} />
      </div>

      <nav className="mt-14 grid gap-3 border-t-2 border-hairline-strong pt-6 sm:grid-cols-2" aria-label={t.navAria}>
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
        <div className="mt-12">
          <p className="eyebrow mb-4 text-faint">{t.relatedTitle}</p>
          <div className="grid gap-5 sm:grid-cols-2">
            {related.map((r, i) => (
              <TipCard key={r.slug} tip={r} index={i + 1} locale={locale} />
            ))}
          </div>
        </div>
      )}

      <div className="mt-12">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`kapitola-${ch.slug}`} locale={locale} />
        </div>
      </div>
    </article>
  );
}
