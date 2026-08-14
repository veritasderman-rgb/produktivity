/** Vloží JSON-LD strukturovaná data do stránky. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify výstup je bezpečný — data jsou naše vlastní, ne uživatelská
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const BASE = "https://produktivni.cz";
const EN_BASE = "https://productive.tips";

export const personJsonLd = {
  "@type": "Person",
  "@id": `${BASE}/#josef`,
  name: "Josef Pavlovic",
  url: "https://josefpavlovic.cz",
  email: "josef@josefpavlovic.cz",
  jobTitle: "Productivity trainer & consultant",
  sameAs: ["https://josefpavlovic.cz", "https://skorezdravotnictvi.cz", BASE],
};

export function websiteJsonLd(locale: "cs" | "en") {
  const isEn = locale === "en";
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE}/#website`,
    url: isEn ? EN_BASE : BASE,
    name: isEn ? "Productive" : "Produktivní.cz",
    description: isEn
      ? "Proven productivity systems, daily tips and tricks, shortcuts and AI news."
      : "Ověřené systémy produktivity, denní tipy a triky, zkratky a AI novinky.",
    inLanguage: isEn ? "en" : "cs",
    publisher: personJsonLd,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${isEn ? EN_BASE : BASE}/hledat?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleJsonLd(opts: {
  locale: "cs" | "en";
  path: string;
  title: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  section?: string;
  /** TL;DR článku — propíše se jako `abstract`. */
  tldr?: string;
}) {
  const url = `${opts.locale === "en" ? EN_BASE : BASE}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: opts.title,
    description: opts.description,
    inLanguage: opts.locale,
    url,
    mainEntityOfPage: url,
    ...(opts.datePublished ? { datePublished: opts.datePublished } : {}),
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
    ...(opts.section ? { articleSection: opts.section } : {}),
    ...(opts.tldr ? { abstract: opts.tldr } : {}),
    author: personJsonLd,
    publisher: personJsonLd,
    image: `${BASE}/api/og?title=${encodeURIComponent(opts.title)}`,
  };
}

/** FAQPage z frontmatter pole `faq` — mainEntity s Question/acceptedAnswer. */
export function faqJsonLd(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/**
 * HowTo pro mega návody s číslovaným postupem (H2 „Fáze N: …" apod.).
 * Kroky dodává parser `extractHowToSteps` — když žádné nenajde, HowTo se nevkládá.
 * Article JSON-LD zůstává, HowTo je navíc.
 */
export function howToJsonLd(opts: {
  locale: "cs" | "en";
  path: string;
  title: string;
  description?: string;
  steps: { id: string; text: string }[];
}) {
  const url = `${opts.locale === "en" ? EN_BASE : BASE}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: opts.title,
    ...(opts.description ? { description: opts.description } : {}),
    inLanguage: opts.locale,
    step: opts.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.text,
      url: `${url}#${s.id}`,
    })),
  };
}

export function breadcrumbJsonLd(
  locale: "cs" | "en",
  crumbs: { name: string; path: string }[],
) {
  const base = locale === "en" ? EN_BASE : BASE;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${base}${c.path}`,
    })),
  };
}
