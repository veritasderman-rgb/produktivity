import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllTips, getTip } from "@/lib/tips";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { TipCard } from "@/components/TipCard";
import { chapterForTip, relatedTips } from "@/lib/related";
import { annotateGlossary } from "@/lib/annotate";
import { Pojem } from "@/components/Pojem";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    breadcrumb: "Tipy & triky",
    ogLabel: "produktivni.cz · tip",
    chapterPre: "Chcete jít do hloubky? V příručce najdete kapitolu",
    relatedTitle: "Podobné tipy",
    ctaEyebrow: "Líbil se vám tip?",
    ctaDesc: "Každý týden posílám jeden takový do e-mailu. Dvě minuty čtení, hodiny úspor.",
  },
  en: {
    breadcrumb: "Tips & tricks",
    ogLabel: "productive.tips · tip",
    chapterPre: "Want to go deeper? The handbook has a whole chapter on it —",
    relatedTitle: "Similar tips",
    ctaEyebrow: "Liked this tip?",
    ctaDesc: "I send one like it every week by email. Two minutes to read, hours saved.",
  },
};

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

const mdxComponents = {
  kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
  Pojem,
};

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

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd data={articleJsonLd({ locale, path: `/tipy/${tip.slug}`, title: tip.title, description: tip.excerpt, datePublished: tip.date, section: tip.category })} />
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.breadcrumb, path: "/tipy" }, { name: tip.title, path: `/tipy/${tip.slug}` }])} />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/tipy")} className="hover:underline">{t.breadcrumb}</Link>
        {" · "}
        {dict.categories[tip.category] ?? tip.category} ·{" "}
        {dict.platforms[tip.platform] ?? tip.platform} · {tip.saves}
      </p>
      <h1 className="display text-[clamp(26px,4.5vw,42px)] normal-case" style={{ textTransform: "none" }}>
        {tip.title}
      </h1>
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
          alt=""
          width={1280}
          height={720}
          className="mt-8 w-full border border-hairline-strong"
          priority
        />
      )}
      <div className="prose-a mt-6">
        <MDXRemote source={annotateGlossary(tip.body, locale)} components={mdxComponents} />
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
      <div className="mt-14 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`tip-${tip.slug}`} locale={locale} />
        </div>
      </div>
    </article>
  );
}
