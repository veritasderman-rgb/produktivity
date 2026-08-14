import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PathProgress, type ProgressStep } from "@/components/PathProgress";
import { NewsletterForm } from "@/components/NewsletterForm";
import { formatDuration, getPath, getPaths } from "@/lib/paths";
import { isLocale, locales, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const T = {
  cs: {
    breadcrumb: "Cesty",
    eyebrow: "Cesta",
    forWhom: "Pro koho",
    time: "Celkový čas",
    steps: "Kroků",
    kind: { tip: "Návod", chapter: "Kapitola" },
    ogLabel: "produktivni.cz · cesta",
    saveNote:
      "Odškrtnuté kroky se ukládají jen ve vašem prohlížeči. Nikam se neposílají a na jiném zařízení je neuvidíte.",
    nextEyebrow: "Co dál",
    nextTitle: "Navazující cesta",
    nextCta: "Otevřít cestu",
    allPaths: "Všechny cesty",
    ctaEyebrow: "Chcete držet tempo?",
    ctaDesc:
      "Jeden použitelný tip týdně do e-mailu. Dvě minuty čtení — a cesta se posune sama.",
  },
  en: {
    breadcrumb: "Paths",
    eyebrow: "Path",
    forWhom: "Who it is for",
    time: "Total time",
    steps: "Steps",
    kind: { tip: "Tip", chapter: "Chapter" },
    ogLabel: "productive.tips · path",
    saveNote:
      "Ticked steps are stored in your browser only. Nothing is sent anywhere and you will not see them on another device.",
    nextEyebrow: "What next",
    nextTitle: "The path that follows",
    nextCta: "Open the path",
    allPaths: "All the paths",
    ctaEyebrow: "Want to keep the pace?",
    ctaDesc: "One usable tip a week by email. Two minutes to read — and the path moves along by itself.",
  },
};

/**
 * Dvojice { locale, slug } pro OBA jazyky. Vrátit prázdné pole pro jeden
 * z jazyků by v Next 16 tiše zahodilo celou trasu.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    getPaths(locale).map((path) => ({ locale, slug: path.id })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const path = getPath(slug, locale);
  if (!path) return {};
  const csUrl = `https://produktivni.cz/cesty/${slug}`;
  const enUrl = `https://productive.tips/cesty/${slug}`;
  return {
    title: path.title,
    description: path.lead,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: path.title,
      description: path.lead,
      images: [
        `/api/og?title=${encodeURIComponent(path.title)}&label=${encodeURIComponent(t.ogLabel)}`,
      ],
    },
  };
}

export default async function PathDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const path = getPath(slug, locale);
  if (!path) notFound();

  const steps: ProgressStep[] = path.steps.map((step) => ({
    id: step.id,
    title: step.title,
    href: step.href,
    outcome: step.outcome,
    minutes: step.minutes,
    kindLabel: t.kind[step.kind],
  }));

  const facts = [
    { label: t.time, value: formatDuration(path.totalMinutes) },
    { label: t.steps, value: String(path.stepCount) },
  ];

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: t.breadcrumb, path: "/cesty" },
          { name: path.title, path: `/cesty/${path.id}` },
        ])}
      />

      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/cesty")} className="hover:underline">
          {t.breadcrumb}
        </Link>
        {" · "}
        {t.eyebrow}
      </p>

      <h1 className="display text-[clamp(28px,4.5vw,44px)]">{path.title}</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-muted">{path.lead}</p>

      <p className="mt-5 max-w-[62ch] text-[15px] leading-relaxed text-muted">
        <span className="eyebrow mr-2 text-faint">{t.forWhom}</span>
        {path.forWhom}
      </p>

      <dl className="mt-7 grid grid-cols-2 gap-px border border-hairline bg-hairline">
        {facts.map((f) => (
          <div key={f.label} className="bg-paper px-5 py-4">
            <dt className="eyebrow text-faint">{f.label}</dt>
            <dd className="display tabular mt-1.5 text-[clamp(19px,2.6vw,24px)]">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10 border-t border-hairline pt-10">
        <PathProgress storageKey={path.storageKey} steps={steps} locale={locale} />
      </div>

      <p className="mt-6 text-[13px] leading-relaxed text-faint">{t.saveNote}</p>

      {/* ------------------------------ co dál ------------------------------ */}
      <section className="mt-14 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.nextEyebrow}</p>
        {path.next ? (
          <>
            <p className="eyebrow text-accent">{t.nextTitle}</p>
            <h2 className="display mt-2 text-[clamp(20px,3vw,26px)]">
              <Link href={path.next.href} className="draw-link">
                {path.next.title}
              </Link>
            </h2>
            <p className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={path.next.href}
                className="inline-block bg-ink px-5 py-3 text-[13.5px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
              >
                {t.nextCta} →
              </Link>
              <Link href={p("/cesty")} className="draw-link text-[14px] font-bold">
                {t.allPaths}
              </Link>
            </p>
          </>
        ) : (
          <p className="mt-2 text-[15px]">
            <Link href={p("/cesty")} className="draw-link font-bold">
              {t.allPaths} →
            </Link>
          </p>
        )}
      </section>

      <section className="mt-12">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source={`cesta-${path.id}`} locale={locale} />
        </div>
      </section>
    </article>
  );
}
