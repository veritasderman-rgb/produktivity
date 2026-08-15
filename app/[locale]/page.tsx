import Link from "next/link";
import { countGuides, getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllPrompts } from "@/lib/prompts";
import { audienceHref, audiences, formatTipCount, tipsForAudience } from "@/lib/audiences";
import { getShelves } from "@/lib/shelves";
import { formatDuration, formatStepCount, getPaths } from "@/lib/paths";
import { NewsletterForm } from "@/components/NewsletterForm";
import { RotatingClaim } from "@/components/RotatingClaim";
import { NewsletterPopup } from "@/components/NewsletterPopup";
import { Reveal } from "@/components/Reveal";
import { tipOfTheDay } from "@/lib/related";
import { formatCount, getDict, isLocale, localePath, type Locale } from "@/lib/i18n";

export const revalidate = 3600; // tip dne se obměňuje bez nového deploye

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = getDict(locale).home;
  const p = (path: string) => localePath(locale, path);

  // Živá čísla — všechno se počítá za běhu buildu, nic není napsané natvrdo.
  const tips = getAllTips(locale);
  const guides = countGuides(locale);
  const chapters = getAllChapters(locale);
  const series = new Set(chapters.map((c) => c.section)).size;
  const prompts = getAllPrompts(locale).length;

  const stats = [
    { label: t.statsTips, value: formatCount(tips.length), href: "/tipy" },
    { label: t.statsGuides, value: formatCount(guides), href: "/tipy?typ=pruvodce" },
    { label: t.statsChapters, value: formatCount(chapters.length), href: "/prirucka" },
    { label: t.statsPrompts, value: formatCount(prompts), href: "/prompty" },
  ];

  const professions = audiences.map((audience) => ({
    key: audience.id,
    href: audienceHref(audience, locale),
    title: audience.name[locale],
    meta: formatTipCount(tipsForAudience(audience.id, locale).length, locale),
  }));

  const shelves = getShelves(locale);
  const learningPaths = getPaths(locale);
  const latest = tips.slice(0, 4);
  const daily = tips.length > 0 ? tipOfTheDay(tips) : null;

  const tipMeta = (isGuide: boolean, minutes: number) =>
    isGuide ? t.shelfGuide : `${minutes} ${t.minShort}`;

  return (
    <>
      {/* Hero + hledání + živá čísla */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14 sm:py-16">
          <h1 className="display display-hero text-[clamp(34px,6vw,58px)]">
            <RotatingClaim claims={t.heroClaims} />
          </h1>
          <p className="mt-5 max-w-[58ch] text-[17px] leading-relaxed text-muted">{t.lead}</p>

          <form
            action={p("/hledat")}
            method="get"
            role="search"
            className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="home-search" className="sr-only">
              {t.searchLabel}
            </label>
            <input
              id="home-search"
              type="search"
              name="q"
              autoComplete="off"
              placeholder={t.searchPlaceholder}
              className="min-w-0 flex-1 border-[1.5px] border-hairline-strong bg-card px-5 py-4 text-[16px] outline-offset-[-2px]"
            />
            <button
              type="submit"
              className="flex-none border-[1.5px] border-ink bg-ink px-7 py-4 text-[15.5px] font-bold text-paper transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              {t.searchSubmit}
            </button>
          </form>

          {/* Vstup podle času místo tématu — párový filtr k hledání výš. */}
          <p className="mt-4">
            <Link
              href={p("/deset-minut")}
              className="inline-block border-[1.5px] border-hairline-strong bg-card px-4 py-2 text-[13.5px] font-bold no-underline transition-colors hover:border-accent hover:text-accent"
            >
              {t.tenMinutes}
            </Link>
          </p>

          <dl className="mt-9 grid grid-cols-2 gap-px border border-hairline bg-hairline sm:grid-cols-4">
            {stats.map((s) => (
              <Link
                key={s.label}
                href={p(s.href)}
                className="group bg-paper px-5 py-4 no-underline transition-colors hover:bg-surface"
              >
                <dt className="eyebrow text-faint transition-colors group-hover:text-accent">{s.label}</dt>
                <dd className="display tabular mt-1.5 text-[clamp(21px,3vw,28px)]">{s.value}</dd>
              </Link>
            ))}
          </dl>
        </div>
      </section>

      {/* Profesní dlaždice */}
      <section className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
          <Reveal>
            <p className="eyebrow text-faint">{t.audienceEyebrow}</p>
            <h2 className="display mt-2 text-[clamp(22px,3.4vw,30px)]">{t.audienceTitle}</h2>
            <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-muted">
              {t.audienceLead}
            </p>
          </Reveal>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {professions.map((profession) => (
              <li key={profession.key}>
                <Link
                  href={profession.href}
                  className="linkblock h-full border border-hairline bg-card p-5 transition-colors hover:border-hairline-strong"
                >
                  <span className="block text-[17px] leading-tight font-bold tracking-[-0.01em]">
                    <span className="draw-link">{profession.title}</span>
                  </span>
                  <span className="eyebrow tabular mt-3 block text-faint">{profession.meta}</span>
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={p("/tipy")}
                className="linkblock h-full border border-hairline bg-card p-5 transition-colors hover:border-hairline-strong"
              >
                <span className="block text-[17px] leading-tight font-bold tracking-[-0.01em]">
                  <span className="draw-link">{t.audienceNotSure}</span>
                </span>
                <span className="eyebrow tabular mt-3 block text-faint">
                  {t.audienceNotSureMeta(tips.length)}
                </span>
              </Link>
            </li>
          </ul>
          <p className="mt-6 text-[14px] text-muted">
            {t.startPre}{" "}
            <Link href={p("/start")} className="draw-link font-bold text-ink">
              {t.startLink}
            </Link>
            {t.startPost}
          </p>
        </div>
      </section>

      {/* Cesty — přirozený druhý krok po „kdo jste“ */}
      {learningPaths.length > 0 && (
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="eyebrow text-faint">{t.pathsEyebrow}</p>
                <h2 className="display mt-2 text-[clamp(22px,3.4vw,30px)]">{t.pathsTitle}</h2>
                <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-muted">
                  {t.pathsLead}
                </p>
              </div>
              <Link href={p("/cesty")} className="draw-link text-[14px] font-bold">
                {t.pathsAll}
              </Link>
            </div>
            <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {learningPaths.map((path) => (
                <li key={path.id}>
                  <Link
                    href={path.href}
                    className="linkblock h-full border border-hairline bg-card p-5 transition-colors hover:border-hairline-strong"
                  >
                    <span className="eyebrow tabular block text-faint">
                      {formatStepCount(path.stepCount, locale)} ·{" "}
                      {formatDuration(path.totalMinutes)}
                    </span>
                    <span className="mt-2.5 block text-[17px] leading-tight font-bold tracking-[-0.01em]">
                      <span className="draw-link">{path.title}</span>
                    </span>
                    <span className="mt-2.5 block text-[13.5px] leading-relaxed text-muted">
                      {path.forWhom}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Tematické police */}
      {shelves.length > 0 && (
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
            <Reveal>
              <p className="eyebrow text-faint">{t.shelvesEyebrow}</p>
              <h2 className="display mt-2 text-[clamp(22px,3.4vw,30px)]">{t.shelvesTitle}</h2>
              <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-muted">
                {t.shelvesLead}
              </p>
            </Reveal>
            <div className="mt-8 border-t border-hairline">
              {shelves.map((shelf) => (
                <div
                  key={shelf.id}
                  className="grid gap-5 border-b border-hairline py-8 md:grid-cols-[minmax(0,280px)_minmax(0,1fr)] md:gap-10"
                >
                  <div>
                    <p className="eyebrow text-faint">{shelf.eyebrow}</p>
                    <h3 className="display mt-2 text-[20px]">{shelf.title}</h3>
                    <p className="mt-2.5 font-serif text-[14.5px] leading-[1.6] text-muted">
                      {shelf.lead}
                    </p>
                    <Link
                      href={shelf.href}
                      className="draw-link mt-4 inline-block text-[13.5px] font-bold"
                    >
                      {shelf.linkLabel}
                    </Link>
                  </div>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {shelf.tips.map((tip) => (
                      <li key={tip.slug}>
                        <Link
                          href={p(`/tipy/${tip.slug}`)}
                          className="linkblock h-full border border-hairline bg-card p-4 transition-colors hover:border-hairline-strong"
                        >
                          <span className="block text-[15px] leading-[1.35] font-bold">
                            <span className="draw-link">{tip.title}</span>
                          </span>
                          <span className="eyebrow mt-2.5 block text-faint">
                            {tipMeta(tip.isGuide, tip.minutes)}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Interaktivní nástroje */}
      <section className="border-b border-hairline bg-surface">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
            <div>
              <p className="eyebrow text-faint">{t.toolsEyebrow}</p>
              <h2 className="display mt-2 text-[clamp(22px,3.4vw,30px)]">{t.toolsTitle}</h2>
              <p className="mt-3 max-w-[58ch] text-[15.5px] leading-relaxed text-muted">
                {t.toolsLead}
              </p>
            </div>
            <Link href={p("/nastroje")} className="draw-link text-[14px] font-bold">
              {t.toolsAll}
            </Link>
          </div>
          <ul className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {t.tools.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={p(tool.href)}
                  className="linkblock h-full border border-hairline bg-card p-5 transition-colors hover:border-hairline-strong"
                >
                  <span className="eyebrow block text-faint">{tool.meta}</span>
                  <span className="mt-2.5 block text-[16px] leading-tight font-bold tracking-[-0.01em]">
                    <span className="draw-link">{tool.label}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Příručka */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)]">
          <Reveal>
            <Link href={p("/prirucka")} className="linkblock py-14">
              <p className="eyebrow mb-2 text-faint">{t.handbookEyebrow}</p>
              <h2 className="display text-[clamp(22px,3vw,28px)]">{t.handbookTitle}</h2>
              <p className="prose-a mt-4 max-w-2xl text-[15.5px]">{t.handbookDesc}</p>
              <p className="eyebrow tabular mt-4 text-faint">
                {t.handbookMeta(chapters.length, series)}
              </p>
              <span className="draw-link mt-5 inline-block text-[14px] font-bold">
                {t.handbookCta}
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Nejnovější + tip dne */}
      {latest.length > 0 && (
        <section className="border-b border-hairline">
          <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-12">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-2">
              <div>
                <p className="eyebrow text-faint">{t.latestEyebrow}</p>
                <h2 className="display mt-2 text-[clamp(20px,3vw,26px)]">{t.latestTitle}</h2>
              </div>
              <Link href={p("/tipy")} className="draw-link text-[14px] font-bold">
                {t.latestAll(tips.length)}
              </Link>
            </div>
            <ul className="mt-6 border-t border-hairline">
              {latest.map((tip) => (
                <li
                  key={tip.slug}
                  className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3.5"
                >
                  <Link
                    href={p(`/tipy/${tip.slug}`)}
                    className="draw-link min-w-0 text-[15.5px] font-bold"
                  >
                    {tip.title}
                  </Link>
                  <span className="eyebrow flex-none text-faint">
                    {tipMeta(tip.isGuide, tip.minutes)}
                  </span>
                </li>
              ))}
            </ul>
            {daily && (
              <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px]">
                <span className="eyebrow flex-none text-faint">{t.dailyLabel}</span>
                <Link href={p(`/tipy/${daily.slug}`)} className="draw-link min-w-0 font-bold">
                  {daily.title}
                </Link>
              </p>
            )}
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-16">
        <Reveal>
          <div className="max-w-xl">
            <p className="eyebrow mb-2 text-faint">{t.newsletterEyebrow}</p>
            <h2 className="display text-[clamp(22px,3vw,28px)]">{t.newsletterTitle}</h2>
            <p className="prose-a mt-4 mb-6 text-[15.5px]">
              {t.newsletterDescA}
              <strong>{t.newsletterDescStrong}</strong>
              {t.newsletterDescB}
            </p>
            <NewsletterForm source="homepage" locale={locale} />
          </div>
        </Reveal>
      </section>
      <NewsletterPopup locale={locale} />
    </>
  );
}
