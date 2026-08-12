import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";
import Link from "next/link";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "AI za týden — e-mailový kurz zdarma",
    description:
      "Sedm dní, sedm krátkých e-mailů. Každý den jedna dovednost a jeden prompt k vyzkoušení hned. Zdarma, bez spamu, odhlášení jedním klikem.",
    eyebrow: "E-mailový kurz zdarma",
    heading: "AI za týden",
    lead: "Sedm dní, sedm krátkých e-mailů. Každý den jedna dovednost a jeden prompt, který si vyzkoušíte hned na vlastní práci. Žádný spam, žádná teorie navíc.",
    bullets: [
      "Jeden e-mail denně, přečtete za tři minuty",
      "Každý díl má prompt k okopírování a mini-úkol na dnešek",
      "Odhlášení jedním klikem, kdykoli",
    ],
    daysTitle: "Co vás čeká",
    days: [
      {
        day: "Den 1",
        topic: "Nezadávejte téma, zadávejte úkol",
        desc: "Proč většina lidí AI po týdnu zavře — a jedna věta, kterou se to obrátí.",
      },
      {
        day: "Den 2",
        topic: "Čtyři díly promptu, který vrátí práci",
        desc: "Role, kontext, úkol, formát. A proč je první odpověď vždycky jen surovina.",
      },
      {
        day: "Den 3",
        topic: "Nepříjemný mail za dvě minuty",
        desc: "Brief, ze kterého vypadne draft k odeslání. Včetně řádku „co nesmí zaznít“.",
      },
      {
        day: "Den 4",
        topic: "Čtyřicet stran za tři minuty",
        desc: "Shrnutí s odkazem na stránku — a tři otázky, které odhalí hezky znějící nesmysl.",
      },
      {
        day: "Den 5",
        topic: "AI nepočítá, AI píše postup výpočtu",
        desc: "Proč číslo z chatu nesmí do rozhodnutí a co s tabulkou dělat místo toho.",
      },
      {
        day: "Den 6",
        topic: "Když AI přestane čekat na vaši otázku",
        desc: "Konektory a rutiny koncepčně — a pravidlo, které u nich nemá výjimku.",
      },
      {
        day: "Den 7",
        topic: "Váš vlastní mini-projekt",
        desc: "Jedna činnost, jeden týden, jedno měřítko. Aby vám z kurzu zůstal návyk.",
      },
    ],
    signupTitle: "Přihlaste se k odběru",
    signupDesc:
      "Zadejte e-mail a první díl vám dorazí obratem. Další pak jeden denně po dobu sedmi dní.",
    gdprTitle: "Ochrana údajů",
    gdprA: "Váš e-mail používám jen k rozeslání tohoto kurzu a k dalšímu odběru newsletteru — nikomu ho nepředávám a neprodávám. Odhlásit se můžete jedním klikem v patičce každého e-mailu. Podrobnosti najdete v ",
    gdprLink: "zásadách ochrany osobních údajů",
    gdprB: ".",
  },
  en: {
    title: "AI in a week — a free email course",
    description:
      "Seven days, seven short emails. One skill and one prompt to try right away, every day. Free, no spam, unsubscribe in one click.",
    eyebrow: "Free email course",
    heading: "AI in a week",
    lead: "Seven days, seven short emails. One skill a day and one prompt you try right away on your own work. No spam, no extra theory.",
    bullets: [
      "One email a day, three minutes to read",
      "Every part comes with a prompt to copy and one small task for today",
      "Unsubscribe in one click, any time",
    ],
    daysTitle: "What is coming",
    days: [
      {
        day: "Day 1",
        topic: "Give it a task, not a topic",
        desc: "Why most people give up on AI within a week — and the one sentence that turns it around.",
      },
      {
        day: "Day 2",
        topic: "The four parts of a prompt that returns work",
        desc: "Role, context, task, format. And why the first answer is always just raw material.",
      },
      {
        day: "Day 3",
        topic: "That awkward email in two minutes",
        desc: "A brief that produces a draft you can send. Including the “what must not be said” line.",
      },
      {
        day: "Day 4",
        topic: "Forty pages in three minutes",
        desc: "A summary with page references — and three questions that expose plausible nonsense.",
      },
      {
        day: "Day 5",
        topic: "AI does not calculate, it writes the calculation",
        desc: "Why a number from the chat must never reach a decision, and what to do with your spreadsheet instead.",
      },
      {
        day: "Day 6",
        topic: "When AI stops waiting for your question",
        desc: "Connectors and routines in principle — plus the rule that has no exception.",
      },
      {
        day: "Day 7",
        topic: "Your own mini project",
        desc: "One activity, one week, one measure. So the course leaves you with a habit.",
      },
    ],
    signupTitle: "Sign up",
    signupDesc:
      "Enter your email and the first part arrives right away. Then one a day for seven days.",
    gdprTitle: "Your data",
    gdprA: "I use your email only to send this course and the newsletter that follows — I never pass it on or sell it. You can unsubscribe in one click from the footer of every email. Details are in the ",
    gdprLink: "privacy policy",
    gdprB: ".",
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
  const csUrl = "https://produktivni.cz/kurz";
  const enUrl = "https://productive.tips/kurz";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="max-w-2xl">
        <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
        <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{t.lead}</p>
        <ul className="mt-6 space-y-2 text-[15px] font-semibold">
          {t.bullets.map((b) => (
            <li key={b} className="flex gap-3">
              <span className="text-faint" aria-hidden="true">→</span> {b}
            </li>
          ))}
        </ul>
      </div>

      <h2 className="display mt-14 mb-6 text-[clamp(20px,3vw,28px)]">{t.daysTitle}</h2>
      <ol className="grid gap-4 sm:grid-cols-2">
        {t.days.map((d, i) => (
          <li key={d.day} className="flex gap-4 border border-hairline bg-card p-5">
            <span
              className="display shrink-0 text-[26px] leading-none text-accent"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div>
              <p className="eyebrow text-faint">{d.day}</p>
              <h3 className="mt-1 text-[16px] font-bold">{d.topic}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-muted">{d.desc}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-16 border-t-2 border-hairline-strong pt-10">
        <h2 className="display mb-2 text-[clamp(20px,3vw,28px)]">{t.signupTitle}</h2>
        <p className="mb-8 max-w-[52ch] text-[15px] text-muted">{t.signupDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source="kurz" locale={locale} />
        </div>
        <div className="mt-10 max-w-[62ch] border border-hairline bg-surface p-5">
          <p className="eyebrow mb-2 text-faint">{t.gdprTitle}</p>
          <p className="text-[14px] leading-relaxed text-muted">
            {t.gdprA}
            <Link
              href={localePath(locale, "/ochrana-osobnich-udaju")}
              className="draw-link font-bold text-ink"
            >
              {t.gdprLink}
            </Link>
            {t.gdprB}
          </p>
        </div>
      </div>
    </div>
  );
}
