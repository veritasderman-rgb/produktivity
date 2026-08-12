import Link from "next/link";
import { getAllTips } from "@/lib/tips";
import { TipCard } from "@/components/TipCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/Reveal";
import { tipOfTheDay } from "@/lib/related";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

export const revalidate = 3600; // tip dne se obměňuje bez nového deploye

const T = {
  cs: {
    eyebrow: "Ověřené systémy · denní tipy · AI novinky",
    heroA: "Každý den o kousek ",
    heroAccent: "rychlejší",
    heroB: ".",
    lead: "Produktivita není dřina navíc — je to pár správných návyků, zkratek a nástrojů. Najdete je tady: česky, bez balastu a průběžně aktualizované, protože doba (a hlavně AI) kráčí rychle.",
    ctaTips: "Začít zrychlovat",
    ctaHandbook: "Číst příručku",
    startPre: "Nevíte kudy?",
    startLink: "Začněte tady",
    startPost: " — jeden notes, tři značky, čtyři minuty denně.",
    dailyLabel: "Tip dne",
    freshEyebrow: "Čerstvé",
    freshTitle: "Nejnovější tipy",
    allTips: (n: number) => `Všech ${n} tipů`,
    handbookEyebrow: "Základ",
    handbookTitle: "Příručka produktivity",
    handbookDesc:
      "Kompletní know-how na jednom místě: GTD, Inbox Zero, Pomodoro, práce s energií i pozorností, výběr nástrojů. Léta praxe srovnaná do kapitol, které dávají smysl po sobě i na přeskáčku.",
    handbookCta: "Otevřít příručku",
    trainingEyebrow: "Pro firmy",
    trainingTitle: "Školení na míru",
    trainingDesc:
      "Nemáte čas to celé číst? Přijedu a naučím váš tým to podstatné za půl dne — od e-mailů a porad až po AI nástroje, které reálně šetří hodiny.",
    trainingCta: "Nabídka školení",
    newsletterEyebrow: "Newsletter",
    newsletterTitle: "Jeden tip týdně do e-mailu",
    newsletterDescA: "To nejlepší z týdne v jednom krátkém e-mailu. Přečtete za dvě minuty, ušetří vám hodiny. Jako bonus hned získáte e-book ",
    newsletterDescStrong: "Top 30 tipů",
    newsletterDescB: ".",
  },
  en: {
    eyebrow: "Proven systems · daily tips · AI updates",
    heroA: "A little ",
    heroAccent: "faster",
    heroB: " every day.",
    lead: "Productivity is not extra work — it is a handful of the right habits, shortcuts and tools. You will find them here: no fluff, kept current, because the world (and AI most of all) moves fast.",
    ctaTips: "Start speeding up",
    ctaHandbook: "Read the handbook",
    startPre: "Not sure where to begin?",
    startLink: "Start here",
    startPost: " — one notebook, three marks, four minutes a day.",
    dailyLabel: "Tip of the day",
    freshEyebrow: "Fresh",
    freshTitle: "Latest tips",
    allTips: (n: number) => `All ${n} tips`,
    handbookEyebrow: "The foundation",
    handbookTitle: "Productivity handbook",
    handbookDesc:
      "The complete know-how in one place: GTD, Inbox Zero, Pomodoro, managing energy and attention, picking your tools. Years of practice sorted into chapters that work in order — or in any order you like.",
    handbookCta: "Open the handbook",
    trainingEyebrow: "For companies",
    trainingTitle: "Training built for your team",
    trainingDesc:
      "No time to read all of it? I will come over and teach your team what matters in half a day — from email and meetings to the AI tools that genuinely save hours.",
    trainingCta: "See the training",
    newsletterEyebrow: "Newsletter",
    newsletterTitle: "One tip a week in your inbox",
    newsletterDescA: "The best of the week in one short email. Two minutes to read, hours saved. You also get the e-book ",
    newsletterDescStrong: "Top 30 tips",
    newsletterDescB: " right away.",
  },
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const tips = getAllTips(locale);
  const latest = tips.slice(0, 3);
  const daily = tips.length > 0 ? tipOfTheDay(tips) : null;

  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-20 sm:py-24">
          <p className="eyebrow mb-6 text-faint">{t.eyebrow}</p>
          <h1 className="display display-hero text-[clamp(38px,7vw,72px)]">
            {t.heroA}
            <span className="text-accent">{t.heroAccent}</span>
            {t.heroB}
          </h1>
          <p className="prose-a mt-7 text-[18px]">{t.lead}</p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href={p("/tipy")}
              className="border-[1.5px] border-ink bg-ink px-7 py-4 text-[15.5px] font-bold text-paper transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              {t.ctaTips}
            </Link>
            <Link
              href={p("/prirucka")}
              className="border-[1.5px] border-hairline-strong px-7 py-4 text-[15.5px] font-bold transition-colors hover:border-accent hover:text-accent"
            >
              {t.ctaHandbook}
            </Link>
          </div>
          <p className="mt-6 text-[14px] text-muted">
            {t.startPre}{" "}
            <Link href={p("/start")} className="draw-link font-bold text-ink">
              {t.startLink}
            </Link>
            {t.startPost}
          </p>
        </div>
      </section>

      {/* Tip dne */}
      {daily && (
        <section className="border-b border-hairline bg-surface">
          <div className="mx-auto flex max-w-[var(--page-max)] flex-wrap items-center gap-x-10 gap-y-4 px-[var(--page-pad)] py-8">
            <p className="eyebrow flex-none text-accent">{t.dailyLabel}</p>
            <p className="min-w-0 flex-1 text-[15.5px] leading-snug">
              <Link href={p(`/tipy/${daily.slug}`)} className="draw-link font-bold">
                {daily.title}
              </Link>
              <span className="mt-1 block font-serif text-[13.5px] text-muted">{daily.excerpt}</span>
            </p>
            <span className="eyebrow flex-none text-faint">{daily.saves}</span>
          </div>
        </section>
      )}

      {/* Nejnovější tipy */}
      {latest.length > 0 && (
        <section className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-24">
          <Reveal>
            <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow mb-2 text-faint">{t.freshEyebrow}</p>
                <h2 className="display text-[clamp(24px,4vw,34px)]">{t.freshTitle}</h2>
              </div>
              <Link href={p("/tipy")} className="draw-link text-[14px] font-bold">
                {t.allTips(tips.length)}
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 md:grid-cols-3">
            {latest.map((tip, i) => (
              <Reveal key={tip.slug} delay={i * 0.08}>
                <TipCard tip={tip} index={tips.length - i} locale={locale} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* Příručka + školení */}
      <section className="border-y border-hairline">
        <div className="mx-auto grid max-w-[var(--page-max)] px-[var(--page-pad)] md:grid-cols-2">
          <Reveal className="md:border-r md:border-hairline">
            <Link href={p("/prirucka")} className="linkblock py-18 md:pr-12">
              <p className="eyebrow mb-2 text-faint">{t.handbookEyebrow}</p>
              <h2 className="display text-[clamp(22px,3vw,28px)]">{t.handbookTitle}</h2>
              <p className="prose-a mt-4 text-[15.5px]">{t.handbookDesc}</p>
              <span className="draw-link mt-6 inline-block text-[14px] font-bold">
                {t.handbookCta}
              </span>
            </Link>
          </Reveal>
          <Reveal delay={0.12}>
            <Link href={p("/skoleni")} className="linkblock py-18 md:pl-12">
              <p className="eyebrow mb-2 text-faint">{t.trainingEyebrow}</p>
              <h2 className="display text-[clamp(22px,3vw,28px)]">{t.trainingTitle}</h2>
              <p className="prose-a mt-4 text-[15.5px]">{t.trainingDesc}</p>
              <span className="draw-link mt-6 inline-block text-[14px] font-bold">
                {t.trainingCta}
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-24">
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
    </>
  );
}
