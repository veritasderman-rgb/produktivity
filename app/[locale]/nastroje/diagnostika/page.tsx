import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import {
  AiDiagnostika,
  type DiagAudience,
  type DiagPath,
  type DiagTip,
} from "@/components/AiDiagnostika";
import { collectDiagTipSlugs, DIAG_PATH_IDS } from "@/lib/diagnostika";
import { getTip } from "@/lib/tips";
import { formatDuration, formatStepCount, getPath } from "@/lib/paths";
import { audienceHref, audiences } from "@/lib/audiences";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const CS_URL = "https://www.produktivni.cz/nastroje/diagnostika";
const EN_URL = "https://www.productive.tips/nastroje/diagnostika";

const T = {
  cs: {
    metaTitle: "Diagnostika: na které úrovni AI jste",
    description:
      "Dvanáct otázek o tom, jak doopravdy používáte AI. Výsledek: vaše úroveň 1–5 podle žebříku chat → kontext → data → rutiny → agent, a osobní plán — tři návody a jedna cesta.",
    eyebrow: "Nástroj · diagnostika",
    heading: "Na které úrovni AI jste",
    lead: "Rozdíl mezi lidmi, kterým AI šetří minuty, a těmi, kterým šetří hodiny, není v modelu — je v úrovni, na které AI používají. Dvanáct otázek, tři minuty, žádná registrace. Na konci vaše úroveň a plán, co přesně udělat dál.",
    backToTools: "← Všechny nástroje",
    loading: "Načítám diagnostiku…",
    disclaimer:
      "Diagnostika je vodítko, ne známkování. Úroveň není osobní skóre — je v pořádku mít poštu na čtyřce a klientské nabídky na dvojce. Rozhoduje typ práce a cena chyby.",
  },
  en: {
    metaTitle: "Diagnostic: which AI level you are on",
    description:
      "Twelve questions about how you really use AI. The result: your level 1–5 on the chat → context → data → routines → agent ladder, plus a personal plan — three guides and one path.",
    eyebrow: "Tool · diagnostic",
    heading: "Which AI level you are on",
    lead: "The difference between people whose AI saves minutes and those whose AI saves hours is not the model — it is the level they use it on. Twelve questions, three minutes, no sign-up. At the end: your level and a plan for what exactly to do next.",
    backToTools: "← All tools",
    loading: "Loading the diagnostic…",
    disclaimer:
      "The diagnostic is a pointer, not a grade. A level is not a personal score — it is fine to run your email on level four and your client proposals on level two. What decides is the type of work and the cost of a mistake.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  return {
    title: t.metaTitle,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? EN_URL : CS_URL,
      languages: { cs: CS_URL, en: EN_URL, "x-default": CS_URL },
    },
    openGraph: {
      title: t.metaTitle,
      description: t.description,
      images: [ogImage(t.metaTitle, locale)],
    },
  };
}

/** Aby build nehlásil tentýž chybějící slug pro každou stránku znovu. */
const warned = new Set<string>();

/** Rozřeší slugy návodů na ověřené odkazy — chybějící vypadnou s hláškou buildu. */
function resolveTips(locale: Locale): Record<string, DiagTip> {
  const dict = getDict(locale).tipCard;
  const out: Record<string, DiagTip> = {};
  for (const slug of collectDiagTipSlugs()) {
    const tip = getTip(slug, locale);
    if (!tip) {
      const key = `${locale}:tip:${slug}`;
      if (!warned.has(key)) {
        warned.add(key);
        console.warn(
          `[diagnostika] Návod „${slug}“ v jazyce ${locale} neexistuje — z plánu vypadne.`,
        );
      }
      continue;
    }
    out[slug] = {
      slug,
      title: tip.title,
      href: localePath(locale, `/tipy/${slug}`),
      meta: tip.isMega ? dict.megaBadge : `${tip.minutes} ${dict.minShort}`,
    };
  }
  return out;
}

/** Rozřeší doporučené cesty — chybějící vypadnou s hláškou buildu. */
function resolvePaths(locale: Locale): Record<string, DiagPath> {
  const out: Record<string, DiagPath> = {};
  for (const id of DIAG_PATH_IDS) {
    const path = getPath(id, locale);
    if (!path) {
      const key = `${locale}:path:${id}`;
      if (!warned.has(key)) {
        warned.add(key);
        console.warn(
          `[diagnostika] Cesta „${id}“ v jazyce ${locale} neexistuje — doporučení vypadne.`,
        );
      }
      continue;
    }
    out[id] = {
      id,
      title: path.title,
      lead: path.lead,
      href: path.href,
      meta: `${formatStepCount(path.stepCount, locale)} · ${formatDuration(path.totalMinutes)}`,
    };
  }
  return out;
}

export default async function DiagnostikaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const tips = resolveTips(locale);
  const paths = resolvePaths(locale);
  const diagAudiences: DiagAudience[] = audiences.map((a) => ({
    id: a.id,
    name: a.name[locale],
    href: audienceHref(a, locale),
  }));

  return (
    <div className="mx-auto max-w-[760px] px-[var(--page-pad)] py-14">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "en" ? "Tools" : "Nástroje", path: "/nastroje" },
          { name: t.heading, path: "/nastroje/diagnostika" },
        ])}
      />
      <Link href={p("/nastroje")} className="draw-link text-[13px] font-bold">
        {t.backToTools}
      </Link>
      <p className="eyebrow mt-6 mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(28px,4.8vw,44px)]">{t.heading}</h1>
      <p className="prose-a mt-4 text-[16.5px]">{t.lead}</p>

      <div className="mt-12 border-t-2 border-hairline-strong pt-10">
        <Suspense
          fallback={<p className="font-mono text-[13px] text-faint">{t.loading}</p>}
        >
          <AiDiagnostika locale={locale} tips={tips} paths={paths} audiences={diagAudiences} />
        </Suspense>
      </div>

      <p className="mt-14 border-t border-hairline pt-6 text-[13px] leading-relaxed text-faint">
        {t.disclaimer}
      </p>
    </div>
  );
}
