import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllIssues, getIssue } from "@/lib/newsletter";
import { CopyPre } from "@/components/CopyPre";
import { NewsletterCta } from "@/components/NewsletterCta";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    breadcrumb: "Archiv newsletteru",
    issueLabel: "Číslo",
    readTime: "min čtení",
    back: "← Všechna čísla",
    fromLabel: "Od",
    fromValue: "Josef Pavlovic · Produktivní.cz",
    subjectLabel: "Předmět",
    previewLabel: "Náhled",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
    ctaEyebrow: "Chcete takové číslo každý čtvrtek?",
    ctaDesc: "Přihlaste se a jako bonus vám hned přijde e-book Top 30 tipů, které vám vrátí hodinu denně.",
  },
  en: {
    breadcrumb: "Newsletter archive",
    issueLabel: "Issue",
    readTime: "min read",
    back: "← All issues",
    fromLabel: "From",
    fromValue: "Josef Pavlovic · Productive",
    subjectLabel: "Subject",
    previewLabel: "Preview",
    copy: { copy: "Copy", copied: "Copied ✓" },
    ctaEyebrow: "Want an issue like this every Thursday?",
    ctaDesc: "Sign up and the bonus e-book Top 30 tips lands in your inbox right away.",
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

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllIssues(params.locale).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const issue = getIssue(slug, locale);
  if (!issue) return {};
  const csUrl = `https://www.produktivni.cz/newsletter/archiv/${slug}`;
  const enUrl = `https://www.productive.tips/newsletter/archiv/${slug}`;
  /* Anglická verze čísla existuje jen tehdy, když opravdu odešla — jinak by
     hreflang posílal roboty na 404. Stejná podmínka jako v sitemapě. */
  const hasEn = getAllIssues("en").some((i) => i.slug === slug);
  return {
    title: issue.subject,
    description: issue.preheader,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: hasEn
        ? { cs: csUrl, en: enUrl, "x-default": csUrl }
        : { cs: csUrl, "x-default": csUrl },
    },
    openGraph: {
      title: issue.subject,
      description: issue.preheader,
      images: [ogImage(issue.subject, locale)],
    },
  };
}

/** Prompt v kódovém bloku dostane tlačítko „zkopírovat" — stejně jako v ukázce. */
function makeMdxComponents(locale: Locale) {
  const copy = (T[locale] ?? T.cs).copy;
  return {
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <CopyPre label={copy}>
        <pre {...props} />
      </CopyPre>
    ),
  };
}

export default async function NewsletterIssuePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const issue = getIssue(slug, locale);
  if (!issue) notFound();

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <JsonLd
        data={articleJsonLd({
          locale,
          path: `/newsletter/archiv/${issue.slug}`,
          title: issue.subject,
          description: issue.preheader,
          datePublished: issue.date,
          section: t.breadcrumb,
        })}
      />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.breadcrumb, path: "/newsletter/archiv" },
          { name: issue.subject, path: `/newsletter/archiv/${issue.slug}` },
        ])}
      />
      <div className="mx-auto max-w-[600px]">
        <p className="eyebrow mb-2 text-faint">
          {t.issueLabel} {issue.number} · {formatDate(issue.date, locale)} · {issue.minutes}{" "}
          {t.readTime}
        </p>
        <h1 className="display text-[clamp(24px,4vw,36px)]" style={{ textTransform: "none" }}>
          {issue.subject}
        </h1>
        <p className="mt-4 text-[14px] font-semibold">
          <Link href={p("/newsletter/archiv")} className="draw-link">
            {t.back}
          </Link>
        </p>
      </div>

      {/* E-mail na papíře: úzký sloupec ~600 px s hlavičkou Od/Předmět */}
      <div className="mx-auto mt-10 max-w-[600px] border border-hairline-strong bg-card">
        <div className="border-b border-hairline px-5 py-4 sm:px-7">
          <p className="flex gap-3 text-[13.5px]">
            <span className="eyebrow shrink-0 pt-0.5 text-faint">{t.fromLabel}</span>
            <span className="font-semibold text-ink">{t.fromValue}</span>
          </p>
          <p className="mt-2 flex gap-3 text-[13.5px]">
            <span className="eyebrow shrink-0 pt-0.5 text-faint">{t.subjectLabel}</span>
            <span className="font-bold text-ink">{issue.subject}</span>
          </p>
          <p className="mt-2 flex gap-3 text-[13.5px]">
            <span className="eyebrow shrink-0 pt-0.5 text-faint">{t.previewLabel}</span>
            <span className="text-faint">{issue.preheader}</span>
          </p>
        </div>
        <div className="px-5 py-7 sm:px-7">
          <div className="prose-a">
            {/* blockJS: false — obsah je náš vlastní z repa */}
            <MDXRemote
              source={issue.body}
              components={makeMdxComponents(locale)}
              options={{ blockJS: false, mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[600px]">
        <NewsletterCta
          eyebrow={t.ctaEyebrow}
          desc={t.ctaDesc}
          source={`newsletter-archiv-${issue.slug}`}
          locale={locale}
        />
      </div>
    </div>
  );
}
