import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllInterviews, getInterview, interviewTitle, type Interview } from "@/lib/interviews";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Pojem } from "@/components/Pojem";
import { CopyPre } from "@/components/CopyPre";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { annotateGlossary } from "@/lib/annotate";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { extractHeadings, flatText, slugify } from "@/lib/toc";

const T = {
  cs: {
    breadcrumb: "Jak pracuje…",
    ogLabel: "produktivni.cz · rozhovor",
    readTime: "min čtení",
    toc: "Otázky v rozhovoru",
    ctaEyebrow: "Další rozhovor příště",
    ctaDesc: "Nový rozhovor i tipy posílám jednou týdně e-mailem. Dvě minuty čtení, hodiny úspor.",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
  },
  en: {
    breadcrumb: "How they work",
    ogLabel: "productive.tips · interview",
    readTime: "min read",
    toc: "Questions in this interview",
    ctaEyebrow: "The next interview",
    ctaDesc: "A new interview and the week's tips land in your inbox once a week. Two minutes to read, hours saved.",
    copy: { copy: "Copy", copied: "Copied ✓" },
  },
};

/** Minimální počet H2, od kterého se vyplatí ukázat obsah rozhovoru. */
const TOC_MIN_HEADINGS = 4;

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

/** Dokud v content/rozhovory není žádné .mdx, vrací prázdné pole — to je v pořádku. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllInterviews(params.locale).map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const interview = getInterview(slug, locale);
  if (!interview) return {};
  const title = interviewTitle(interview, locale);
  const csUrl = `https://www.produktivni.cz/rozhovory/${slug}`;
  const enUrl = `https://www.productive.tips/rozhovory/${slug}`;
  return {
    title,
    description: interview.excerpt,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title,
      description: interview.excerpt,
      images: [`/api/og?title=${encodeURIComponent(title)}&label=${encodeURIComponent(t.ogLabel)}`],
    },
  };
}

/** Komponenty pro MDX se vyrábějí podle jazyka — kvůli popiskům tlačítka „zkopírovat". */
function makeMdxComponents(locale: Locale) {
  const copy = (T[locale] ?? T.cs).copy;
  return {
    kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
    Pojem,
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
  };
}

/**
 * JSON-LD: Article, jehož předmětem (a zpovídaným) je reálná osoba.
 * Person se plní výhradně z frontmatteru — žádné dopočítávané údaje.
 */
function intervieweeJsonLd(interview: Interview, locale: Locale) {
  const base = locale === "en" ? "https://www.productive.tips" : "https://www.produktivni.cz";
  const person: Record<string, unknown> = {
    "@type": "Person",
    name: interview.name,
    jobTitle: interview.role,
    ...(interview.photo ? { image: `${base}${interview.photo}` } : {}),
  };
  return {
    ...articleJsonLd({
      locale,
      path: `/rozhovory/${interview.slug}`,
      title: interviewTitle(interview, locale),
      description: interview.excerpt,
      datePublished: interview.date,
      section: locale === "en" ? "Interviews" : "Rozhovory",
    }),
    about: person,
    mentions: person,
  };
}

export default async function InterviewDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const interview = getInterview(slug, locale);
  if (!interview) notFound();

  const title = interviewTitle(interview, locale);
  const headings = extractHeadings(interview.body);

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd data={intervieweeJsonLd(interview, locale)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.breadcrumb, path: "/rozhovory" },
          { name: title, path: `/rozhovory/${interview.slug}` },
        ])}
      />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/rozhovory")} className="hover:underline">
          {t.breadcrumb}
        </Link>
        {" · "}
        {formatDate(interview.date, locale)} · {interview.minutes} {t.readTime}
      </p>

      <header className="flex flex-wrap items-center gap-6">
        {interview.photo && (
          <Image
            src={interview.photo}
            alt={interview.name}
            width={120}
            height={120}
            className="h-30 w-30 shrink-0 border border-hairline-strong object-cover"
            priority
          />
        )}
        <div className="min-w-[16rem] flex-1">
          <h1
            className="display text-[clamp(26px,4.5vw,42px)]"
            style={{ textTransform: "none" }}
          >
            {title}
          </h1>
          <p className="mt-3 text-[15px] font-semibold text-muted">{interview.role}</p>
        </div>
      </header>

      <p className="mt-6 border-y border-hairline py-5 text-[17px] leading-relaxed text-muted">
        {interview.excerpt}
      </p>

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
        <MDXRemote
          source={annotateGlossary(interview.body, locale)}
          components={makeMdxComponents(locale)}
        />
      </div>

      <div className="mt-14 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`rozhovor-${interview.slug}`} locale={locale} />
        </div>
      </div>
    </article>
  );
}
