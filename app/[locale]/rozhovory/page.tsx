import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllInterviews, interviewTitle } from "@/lib/interviews";
import { NewsletterForm } from "@/components/NewsletterForm";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const EMAIL = "josef@josefpavlovic.cz";

const T = {
  cs: {
    title: "Jak pracuje…",
    description:
      "Rubrika rozhovorů o tom, jak si skuteční lidé organizují práci: jaký mají systém, jaké nástroje, co zkusili a zavrhli a jak do toho zapojili AI.",
    eyebrow: "Rubrika rozhovorů",
    heading: "Jak pracuje…",
    leadA: "Většina rad o produktivitě zní hezky, ale nikdo neví, jestli podle nich někdo doopravdy žije. Tahle rubrika je opak: série rozhovorů o ",
    leadStrong: "skutečných systémech skutečných lidí",
    leadB: ". Žádné ideální dny z příruček — konkrétní nástroje, konkrétní rituály a konkrétní věci, které nefungovaly.",
    formatTitle: "Jak rozhovory vypadají",
    format: [
      { strong: "Stejná kostra otázek", rest: " — den, systém, nástroje, slepé uličky, AI, rada na začátek." },
      { strong: "Odpovědi bez úprav", rest: " — krátím jen délku, nikdy smysl. Autorizaci vidí každý před vydáním." },
      { strong: "Jeden rozhovor, jedna profese", rest: " — ať je vidět, jak jinak vypadá den učitelky a den vývojáře." },
    ],
    listEyebrow: "Publikované rozhovory",
    readTime: "min čtení",
    readMore: "Číst rozhovor",
    emptyTitle: "První rozhovory připravujeme",
    emptyDesc:
      "Rubrika právě vzniká a první lidi teď oslovuji. Až budou odpovědi hotové a autorizované, objeví se tady — nic si nevymýšlím a nic nepublikuji bez souhlasu.",
    emptyCta: "Chcete být mezi prvními? Ozvěte se.",
    joinEyebrow: "Výzva k účasti",
    joinTitle: "Chcete být v rubrice?",
    joinLead:
      "Nehledám guru produktivity. Hledám lidi, kteří mají svůj den nějak vyřešený — a umí popsat jak.",
    whoTitle: "Komu to sedne",
    who: [
      "Máte systém, který vám vydržel aspoň rok, a víte proč.",
      "Vaše práce má nějaký háček: směny, malé děti, tři projekty naráz, hluboká soustředěná práce.",
      "Umíte být konkrétní — jméno aplikace, čas na hodinách, věta ze šablony.",
      "Nevadí vám, že rozhovor vyjde pod vaším jménem a profesí.",
    ],
    howTitle: "Co to obnáší",
    how: [
      { strong: "Písemný rozhovor", rest: " — otázky pošlu e-mailem, odpovídáte v klidu a ve svém čase." },
      { strong: "Zhruba 30 minut", rest: " — 15 až 20 otázek, u každé stačí pár vět." },
      { strong: "Autorizace před vydáním", rest: " — text uvidíte hotový a schválíte ho, než jde ven." },
      { strong: "Fotka je dobrovolná", rest: " — bez ní rozhovor vyjde stejně." },
    ],
    ctaButton: "Napsat o rozhovor",
    ctaNote: "Otevře e-mail s předvyplněným předmětem. Stačí pár vět o tom, co děláte.",
    mailSubject: "Rozhovor do rubriky Jak pracuje…",
    mailBody:
      "Dobrý den, Josefe,\n\nrád/a bych se zúčastnil/a rubriky Jak pracuje…\n\nCo dělám:\nProč si myslím, že můj systém stojí za popsání:\n\nDěkuji,\n",
    newsletterEyebrow: "Ať vám první rozhovor neuteče",
    newsletterDesc: "Nové rozhovory posílám v týdenním newsletteru spolu s tipy.",
  },
  en: {
    title: "How they work",
    description:
      "An interview series about how real people organise their work: their system, their tools, what they tried and dropped, and how AI fits in.",
    eyebrow: "Interview series",
    heading: "How they work",
    leadA: "Most productivity advice sounds great, but nobody knows whether anyone actually lives by it. This series is the opposite: interviews about ",
    leadStrong: "the real systems of real people",
    leadB: ". No textbook perfect days — specific tools, specific rituals and the specific things that did not work out.",
    formatTitle: "What the interviews look like",
    format: [
      { strong: "The same set of questions", rest: " — the day, the system, the tools, the dead ends, AI, advice for beginners." },
      { strong: "Answers left as they are", rest: " — I edit for length, never for meaning. Everyone approves the text before it goes out." },
      { strong: "One interview, one profession", rest: " — so you can see how differently a teacher's day and a developer's day look." },
    ],
    listEyebrow: "Published interviews",
    readTime: "min read",
    readMore: "Read the interview",
    emptyTitle: "The first interviews are in the works",
    emptyDesc:
      "The series is just starting and the first people are being approached now. Once the answers are written and approved, they show up here — nothing invented, nothing published without consent.",
    emptyCta: "Want to be among the first? Get in touch.",
    joinEyebrow: "Take part",
    joinTitle: "Want to be in the series?",
    joinLead:
      "I am not looking for productivity gurus. I am looking for people who have their day figured out somehow — and can describe how.",
    whoTitle: "Who fits",
    who: [
      "You have a system that has held up for at least a year, and you know why.",
      "Your work has a catch: shifts, small kids, three projects at once, deep focused work.",
      "You can be specific — the name of the app, the time on the clock, the line from your template.",
      "You are fine with the interview going out under your name and job title.",
    ],
    howTitle: "What it takes",
    how: [
      { strong: "A written interview", rest: " — I send the questions by email, you answer in your own time." },
      { strong: "About 30 minutes", rest: " — 15 to 20 questions, a few sentences each is plenty." },
      { strong: "Approval before publishing", rest: " — you see the finished text and sign it off before it goes live." },
      { strong: "The photo is optional", rest: " — the interview works fine without one." },
    ],
    ctaButton: "Email me about an interview",
    ctaNote: "Opens your email app with the subject filled in. A few sentences about what you do is enough.",
    mailSubject: "Interview for the How they work series",
    mailBody:
      "Hi Josef,\n\nI would like to take part in the How they work series.\n\nWhat I do:\nWhy I think my system is worth describing:\n\nThanks,\n",
    newsletterEyebrow: "Do not miss the first one",
    newsletterDesc: "New interviews go out in the weekly newsletter along with the tips.",
  },
};

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

/** mailto s předvyplněným předmětem i kostrou textu. */
function mailtoHref(subject: string, body: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://produktivni.cz/rozhovory";
  const enUrl = "https://productive.tips/rozhovory";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function InterviewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const interviews = getAllInterviews(locale);
  const mailto = mailtoHref(t.mailSubject, t.mailBody);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        {t.leadA}
        <strong className="text-ink">{t.leadStrong}</strong>
        {t.leadB}
      </p>

      <section className="mt-10 border border-hairline bg-surface p-6">
        <p className="eyebrow mb-4 text-faint">{t.formatTitle}</p>
        <ul className="grid gap-3 text-[14.5px] leading-relaxed text-muted sm:grid-cols-3">
          {t.format.map((f) => (
            <li key={f.strong}>
              <strong className="text-ink">{f.strong}</strong>
              {f.rest}
            </li>
          ))}
        </ul>
      </section>

      {interviews.length > 0 ? (
        <section className="mt-14">
          <p className="eyebrow mb-4 text-faint">{t.listEyebrow}</p>
          <div className="grid gap-5">
            {interviews.map((i) => (
              <article
                key={i.slug}
                className="flex gap-5 border border-hairline-strong bg-card p-6"
              >
                {i.photo && (
                  <Image
                    src={i.photo}
                    alt={i.name}
                    width={96}
                    height={96}
                    className="hidden h-24 w-24 shrink-0 border border-hairline object-cover sm:block"
                  />
                )}
                <div>
                  <p className="eyebrow mb-2 text-faint">
                    {formatDate(i.date, locale)} · {i.minutes} {t.readTime}
                  </p>
                  <h2 className="text-[19px] leading-snug font-bold">
                    <Link href={p(`/rozhovory/${i.slug}`)} className="hover:text-accent">
                      {interviewTitle(i, locale)}
                    </Link>
                  </h2>
                  <p className="mt-1 text-[14px] font-semibold text-muted">{i.role}</p>
                  <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">
                    {i.excerpt}
                  </p>
                  <Link
                    href={p(`/rozhovory/${i.slug}`)}
                    className="mt-4 inline-block draw-link text-[13px] font-bold"
                  >
                    {t.readMore}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-14 max-w-2xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">{t.emptyTitle}</p>
          <p className="text-[14.5px] leading-relaxed text-muted">{t.emptyDesc}</p>
          <a href={mailto} className="mt-4 inline-block draw-link text-[13px] font-bold">
            {t.emptyCta}
          </a>
        </section>
      )}

      <section className="mt-16 border-t-2 border-hairline-strong pt-10">
        <p className="eyebrow mb-2 text-faint">{t.joinEyebrow}</p>
        <h2 className="display text-[clamp(24px,4vw,34px)]">{t.joinTitle}</h2>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">{t.joinLead}</p>

        <div className="mt-8 grid gap-8 sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-3 text-faint">{t.whoTitle}</p>
            <ul className="space-y-2 text-[14.5px] leading-relaxed text-muted">
              {t.who.map((w) => (
                <li key={w} className="border-l-2 border-hairline pl-3">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-3 text-faint">{t.howTitle}</p>
            <ul className="space-y-2 text-[14.5px] leading-relaxed text-muted">
              {t.how.map((h) => (
                <li key={h.strong} className="border-l-2 border-hairline pl-3">
                  <strong className="text-ink">{h.strong}</strong>
                  {h.rest}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8">
          <a
            href={mailto}
            className="inline-block bg-ink px-5 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {t.ctaButton}
          </a>
          <p className="mt-3 max-w-[52ch] text-[13.5px] text-faint">{t.ctaNote}</p>
        </div>
      </section>

      <div className="mt-16 max-w-xl border-t border-hairline pt-8">
        <p className="eyebrow mb-2 text-faint">{t.newsletterEyebrow}</p>
        <p className="mb-5 text-[14.5px] text-muted">{t.newsletterDesc}</p>
        <NewsletterForm source="rozhovory" locale={locale} />
      </div>
    </div>
  );
}
