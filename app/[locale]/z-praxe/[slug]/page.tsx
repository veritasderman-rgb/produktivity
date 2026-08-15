import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { getAllPracticePosts, getPracticePost, type PracticePost } from "@/lib/practice";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Pojem } from "@/components/Pojem";
import { CopyPre } from "@/components/CopyPre";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { annotateGlossary } from "@/lib/annotate";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { extractHeadings, flatText, slugify } from "@/lib/toc";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { OknaDemo } from "@/components/OknaDemo";
import { PredPo } from "@/components/PredPo";

const T = {
  cs: {
    breadcrumb: "Z praxe",
    ogLabel: "produktivni.cz · z praxe",
    readTime: "min čtení",
    toc: "Obsah článku",
    toolsLabel: "Nástroje v tomhle postupu",
    creditA: "Postup poslal(a) ",
    creditB: ". Text zpracoval Ctrl podle redakční šablony, autor(ka) ho před vydáním autorizoval(a).",
    ctaEyebrow: "Máte vlastní postup?",
    ctaDesc: "Rubriku plní čtenáři. Pošlete, jak AI používáte vy — vyjde pod vaším jménem.",
    ctaLink: "Poslat svůj postup",
    newsletterEyebrow: "Další postup příště",
    newsletterDesc: "Nové příspěvky posílám v týdenním newsletteru spolu s tipy.",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
  },
  en: {
    breadcrumb: "From practice",
    ogLabel: "productive.tips · from practice",
    readTime: "min read",
    toc: "In this article",
    toolsLabel: "Tools in this workflow",
    creditA: "This workflow was sent in by ",
    creditB: ". Ctrl processed the text following the editorial template, and the author approved it before publication.",
    ctaEyebrow: "Got a workflow of your own?",
    ctaDesc: "This series is powered by readers. Send in how you use AI — it will be published under your name.",
    ctaLink: "Send your workflow",
    newsletterEyebrow: "The next one",
    newsletterDesc: "New workflows go out in the weekly newsletter along with the tips.",
    copy: { copy: "Copy", copied: "Copied ✓" },
  },
};

/** Minimální počet H2, od kterého se vyplatí ukázat obsah článku. */
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

/** Dokud v content/z-praxe není žádné .mdx, vrací prázdné pole — to je v pořádku. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getAllPracticePosts(params.locale).map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const post = getPracticePost(slug, locale);
  if (!post) return {};
  const csUrl = `https://produktivni.cz/z-praxe/${slug}`;
  const enUrl = `https://productive.tips/z-praxe/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [
        `/api/og?title=${encodeURIComponent(post.title)}&label=${encodeURIComponent(t.ogLabel)}`,
      ],
    },
  };
}

/** Stejná sada MDX komponent jako u tipů — jen bez psacího efektu prvního bloku. */
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
    OknaDemo,
    PredPo,
  };
}

/**
 * JSON-LD: Article, jehož autorem je čtenář — Person se jménem a profesí
 * z frontmatteru, žádné dopočítávané údaje. Publisher zůstává Josef.
 */
function practiceJsonLd(post: PracticePost, locale: Locale) {
  return {
    ...articleJsonLd({
      locale,
      path: `/z-praxe/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      datePublished: post.date,
      section: locale === "en" ? "From practice" : "Z praxe",
    }),
    author: {
      "@type": "Person",
      name: post.author,
      jobTitle: post.role,
    },
  };
}

export default async function PracticeDetail({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const post = getPracticePost(slug, locale);
  if (!post) notFound();

  const headings = extractHeadings(post.body);

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd data={practiceJsonLd(post, locale)} />
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.breadcrumb, path: "/z-praxe" },
          { name: post.title, path: `/z-praxe/${post.slug}` },
        ])}
      />
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/z-praxe")} className="hover:underline">
          {t.breadcrumb}
        </Link>
        {" · "}
        {formatDate(post.date, locale)} · {post.minutes} {t.readTime}
      </p>

      <h1 className="display text-[clamp(26px,4.5vw,42px)]" style={{ textTransform: "none" }}>
        {post.title}
      </h1>
      <p className="mt-3 text-[15px] font-semibold text-muted">
        {post.author} · {post.role}
      </p>

      <p className="mt-6 border-y border-hairline py-5 text-[17px] leading-relaxed text-muted">
        {post.excerpt}
      </p>

      {post.tools.length > 0 && (
        <p className="eyebrow mt-5 text-faint">
          {t.toolsLabel}: {post.tools.join(" · ")}
        </p>
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
        <MDXRemote
          source={annotateGlossary(post.body, locale)}
          components={makeMdxComponents(locale)}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
        />
      </div>

      <p className="mt-10 border border-hairline bg-surface p-4 text-[14px] leading-relaxed text-muted">
        {t.creditA}
        <strong className="text-ink">{post.author}</strong>
        {t.creditB}
      </p>

      <div className="mt-10 border border-hairline-strong bg-card p-6">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="max-w-[52ch] text-[14.5px] leading-relaxed text-muted">{t.ctaDesc}</p>
        <Link
          href={p("/z-praxe#formular")}
          className="mt-4 inline-block draw-link text-[13px] font-bold"
        >
          {t.ctaLink}
        </Link>
      </div>

      <div className="mt-14 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.newsletterEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.newsletterDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`z-praxe-${post.slug}`} locale={locale} />
        </div>
      </div>
    </article>
  );
}
