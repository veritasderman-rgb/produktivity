import type { Metadata } from "next";
import Link from "next/link";
import { formatDuration, formatStepCount, getPaths } from "@/lib/paths";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const CS_URL = "https://produktivni.cz/cesty";
const EN_URL = "https://productive.tips/cesty";

const T = {
  cs: {
    title: "Cesty",
    metaTitle: "Cesty — návody v pořadí, které dává smysl",
    description:
      "Pojmenované sekvence kroků napříč knihovnou: od chaosu k systému, prvních 14 dní s AI, AI ve firmě, data bez tabulkového pekla a klidnější domácnost.",
    eyebrow: "Rozcestník",
    heading: "Cesty",
    lead: "Knihovna má stovky návodů, ale nikde neříká, čím začít. Cesta je pojmenovaná sekvence kroků: víte, co po sobě, co z toho budete mít a kolik času to zabere. Postup si odškrtáváte a zůstane vám ve vašem prohlížeči.",
    forWhom: "Pro koho",
    open: "Otevřít cestu",
    stepsHead: "Začíná to takhle",
    more: (n: number) => `a dalších ${n}`,
    empty: "Cesty se právě chystají. Než přibudou, mrkněte na příručku nebo na tipy.",
    handbook: "Příručka produktivity",
    tips: "Všechny tipy",
  },
  en: {
    title: "Paths",
    metaTitle: "Paths — the guides in an order that makes sense",
    description:
      "Named sequences of steps across the library: from chaos to a system, your first 14 days with AI, AI at the company, data without spreadsheet hell and a calmer household.",
    eyebrow: "Where to start",
    heading: "Paths",
    lead: "The library has hundreds of guides but never says which one comes first. A path is a named sequence of steps: what follows what, what you get out of it and how long it takes. You tick the steps off and the progress stays in your browser.",
    forWhom: "Who it is for",
    open: "Open the path",
    stepsHead: "It starts like this",
    more: (n: number) => `and ${n} more`,
    empty: "The paths are on their way. In the meantime, take a look at the handbook or the tips.",
    handbook: "Productivity handbook",
    tips: "All the tips",
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
  };
}

/** Kolik kroků se ukáže jako ochutnávka na kartě cesty. */
const PREVIEW_STEPS = 3;

export default async function PathsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const allPaths = getPaths(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.title, path: "/cesty" }])} />

      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>

      {allPaths.length > 0 ? (
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {allPaths.map((path) => {
            const preview = path.steps.slice(0, PREVIEW_STEPS);
            const rest = path.steps.length - preview.length;
            return (
              <section
                key={path.id}
                className="flex flex-col border-2 border-hairline-strong bg-card p-6 shadow-[0_4px_0_#141414]"
              >
                <p className="eyebrow tabular text-faint">
                  {formatStepCount(path.stepCount, locale)} ·{" "}
                  {formatDuration(path.totalMinutes)}
                </p>
                <h2 className="display mt-2 text-[clamp(20px,2.8vw,25px)]">
                  <Link href={path.href} className="draw-link">
                    {path.title}
                  </Link>
                </h2>
                <p className="mt-3 font-serif text-[15px] leading-[1.65] text-muted">{path.lead}</p>

                <p className="mt-4 border-t border-hairline pt-4 text-[14px] leading-relaxed text-muted">
                  <span className="eyebrow mr-2 text-faint">{t.forWhom}</span>
                  {path.forWhom}
                </p>

                <p className="eyebrow mt-5 text-faint">{t.stepsHead}</p>
                <ol className="mt-2.5 space-y-1.5 text-[14px] font-semibold">
                  {preview.map((step, i) => (
                    <li key={step.id} className="flex gap-2.5">
                      <span className="tabular font-mono text-[12px] text-faint" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="min-w-0">{step.title}</span>
                    </li>
                  ))}
                  {rest > 0 && (
                    <li className="flex gap-2.5 text-faint">
                      <span className="font-mono text-[12px]" aria-hidden="true">
                        +
                      </span>
                      <span>{t.more(rest)}</span>
                    </li>
                  )}
                </ol>

                <p className="mt-6">
                  <Link
                    href={path.href}
                    className="inline-block bg-ink px-5 py-3 text-[13.5px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
                  >
                    {t.open} →
                  </Link>
                </p>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="text-[14.5px] text-muted">{t.empty}</p>
        </div>
      )}

      <p className="mt-12 flex flex-wrap gap-x-6 gap-y-2 text-[14.5px] font-bold">
        <Link href={p("/prirucka")} className="draw-link">
          {t.handbook}
        </Link>
        <Link href={p("/tipy")} className="draw-link">
          {t.tips}
        </Link>
      </p>
    </div>
  );
}
