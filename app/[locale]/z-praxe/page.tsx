import type { Metadata } from "next";
import Link from "next/link";
import { getAllPracticePosts } from "@/lib/practice";
import { PracticeForm } from "@/components/PracticeForm";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Z praxe",
    description:
      "Rubrika workflow od čtenářů: jak lidé v různých profesích reálně používají AI ve své práci. Konkrétní postupy, konkrétní nástroje, pod jménem autora.",
    eyebrow: "Rubrika od čtenářů",
    heading: "Z praxe",
    leadA: "Návodů, jak by se AI „dala" používat, je plný internet. Tahle rubrika je o něčem jiném: ",
    leadStrong: "jak ji skuteční lidé ve své práci používají doopravdy",
    leadB: ". Postupy posílají čtenáři, každý vyjde pod jménem autora — a žádný si nevymýšlíme.",
    howTitle: "Jak to funguje",
    how: [
      { strong: "Pošlete svůj postup", rest: " — formulářem dole na stránce. Stačí popsat, co jste vyřešili a jak to děláte." },
      { strong: "Ctrl ho zpracuje", rest: " — AI redaktor webu přepíše text do standardní podoby. Váš hlas i fakta zůstávají, mění se jen struktura." },
      { strong: "Josef schválí, vy autorizujete", rest: " — před vydáním čte text Josef a náhled dostanete ke schválení i vy." },
      { strong: "Vyjde s vaším kreditem", rest: " — pod vaším jménem či přezdívkou a profesí." },
    ],
    listEyebrow: "Publikované příspěvky",
    readTime: "min čtení",
    readMore: "Číst celý postup",
    byline: (author: string, role: string) => `${author} · ${role}`,
    emptyTitle: "Rubrika právě startuje",
    emptyDesc:
      "Zatím tu žádný příspěvek není — rubrika začíná touhle výzvou, ne obsahem, který bychom si vymysleli. První zveřejněné postupy budou od skutečných čtenářů, se jménem a profesí.",
    emptyCta: "Chcete být první? Pošlete svůj postup ↓",
    formEyebrow: "Pošlete svůj postup",
    formTitle: "Jak používáte AI vy?",
    formLead:
      "Nemusíte být spisovatel — text před vydáním zpracujeme a vy ho schválíte. Důležité je jediné: aby šlo o skutečný postup, který vám v práci opravdu slouží.",
    formNote:
      "Co se s příspěvkem děje: Ctrl (AI redaktor) ho přepíše do standardní struktury, nic nepřikrášlí a nic si nedomyslí. Josef text schválí a vy dostanete náhled — bez vašeho souhlasu nevyjde nic.",
  },
  en: {
    title: "From practice",
    description:
      "Reader-submitted workflows: how people in different professions actually use AI in their work. Concrete steps, concrete tools, published under the author's name.",
    eyebrow: "A reader-driven series",
    heading: "From practice",
    leadA: "The internet is full of guides on how AI “could” be used. This series is about something else: ",
    leadStrong: "how real people actually use it in their work",
    leadB: ". The workflows come from readers, each one is published under the author's name — and none of them are made up.",
    howTitle: "How it works",
    how: [
      { strong: "Send your workflow", rest: " — using the form at the bottom of this page. Just describe what you solved and how you do it." },
      { strong: "Ctrl processes it", rest: " — the site's AI editor rewrites the text into a standard shape. Your voice and your facts stay, only the structure changes." },
      { strong: "Josef approves, you sign off", rest: " — Josef reads the text before publication and you get a preview to approve too." },
      { strong: "Published with your credit", rest: " — under your name or nickname and your profession." },
    ],
    listEyebrow: "Published workflows",
    readTime: "min read",
    readMore: "Read the full workflow",
    byline: (author: string, role: string) => `${author} · ${role}`,
    emptyTitle: "The series is just starting",
    emptyDesc:
      "There is nothing here yet — the series starts with this open call, not with content we invented. The first published workflows will come from real readers, with a name and a profession.",
    emptyCta: "Want to be first? Send your workflow ↓",
    formEyebrow: "Send your workflow",
    formTitle: "How do you use AI?",
    formLead:
      "You do not have to be a writer — the text gets edited before publication and you approve it. Only one thing matters: it has to be a real workflow that actually serves you at work.",
    formNote:
      "What happens to your submission: Ctrl (the AI editor) rewrites it into the standard structure, embellishing nothing and inventing nothing. Josef approves the text and you get a preview — nothing goes out without your consent.",
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://produktivni.cz/z-praxe";
  const enUrl = "https://productive.tips/z-praxe";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function PracticePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const posts = getAllPracticePosts(locale);

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
        <p className="eyebrow mb-4 text-faint">{t.howTitle}</p>
        <ol className="grid gap-4 text-[14.5px] leading-relaxed text-muted sm:grid-cols-2 lg:grid-cols-4">
          {t.how.map((step, i) => (
            <li key={step.strong} className="border-l-2 border-hairline pl-3">
              <span className="eyebrow block text-faint">{i + 1}</span>
              <strong className="text-ink">{step.strong}</strong>
              {step.rest}
            </li>
          ))}
        </ol>
      </section>

      {posts.length > 0 ? (
        <section className="mt-14">
          <p className="eyebrow mb-4 text-faint">{t.listEyebrow}</p>
          <div className="grid gap-5">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border border-hairline-strong bg-card p-6"
              >
                <p className="eyebrow mb-2 text-faint">
                  {formatDate(post.date, locale)} · {post.minutes} {t.readTime}
                </p>
                <h2 className="text-[19px] leading-snug font-bold">
                  <Link href={p(`/z-praxe/${post.slug}`)} className="hover:text-accent">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-1 text-[14px] font-semibold text-muted">
                  {t.byline(post.author, post.role)}
                </p>
                <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">
                  {post.excerpt}
                </p>
                {post.tools.length > 0 && (
                  <p className="eyebrow mt-3 text-faint">{post.tools.join(" · ")}</p>
                )}
                <Link
                  href={p(`/z-praxe/${post.slug}`)}
                  className="mt-4 inline-block draw-link text-[13px] font-bold"
                >
                  {t.readMore}
                </Link>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <section className="mt-14 max-w-2xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">{t.emptyTitle}</p>
          <p className="text-[14.5px] leading-relaxed text-muted">{t.emptyDesc}</p>
          <a href="#formular" className="mt-4 inline-block draw-link text-[13px] font-bold">
            {t.emptyCta}
          </a>
        </section>
      )}

      <section id="formular" className="mt-16 scroll-mt-24 border-t-2 border-hairline-strong pt-10">
        <p className="eyebrow mb-2 text-faint">{t.formEyebrow}</p>
        <h2 className="display text-[clamp(24px,4vw,34px)]">{t.formTitle}</h2>
        <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">{t.formLead}</p>
        <div className="mt-8 max-w-2xl">
          <PracticeForm locale={locale} />
        </div>
        <p className="mt-6 max-w-[64ch] border-l-2 border-hairline pl-3 text-[13.5px] leading-relaxed text-faint">
          {t.formNote}
        </p>
      </section>
    </div>
  );
}
