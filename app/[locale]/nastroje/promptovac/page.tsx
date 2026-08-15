import type { Metadata } from "next";
import Link from "next/link";
import { PromptBuilder, type PromptSample } from "@/components/PromptBuilder";
import { getAllPrompts, type PromptEntry } from "@/lib/prompts";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/**
 * Skládačka promptů. lib/prompts.ts čte soubory přes node:fs, takže celá
 * databáze zůstává na serveru — do klienta posíláme jen malý vzorek
 * (label, slug, prvních 300 znaků) předtříděný podle typu úkolu.
 */

const T = {
  cs: {
    title: "Promptovač: skládačka promptů",
    description:
      "Vyberte roli, úkol, vstup, výstup a omezení — složí se z toho hotový prompt, který jde upravit a zkopírovat. Plus tři nejbližší hotové prompty z naší databáze.",
    eyebrow: "Nástroj · AI",
    heading: "Promptovač",
    lead: "Dobrý prompt není delší, je konkrétnější. Rozdíl mezi obecnou a použitelnou odpovědí dělá pět věcí: kdo má AI být, co má udělat, s čím pracuje, jak má vypadat výstup a co dělat nesmí. Naklikejte je a text se složí sám.",
    howTitle: "Pět dílků, ze kterých se prompt skládá",
    how: [
      ["Role", "Kdo má AI být. Role není kostým — zužuje slovník, míru detailu i to, co bude považovat za důležité."],
      ["Úkol", "Jedno sloveso. Napsat, shrnout, porovnat, zkontrolovat, naplánovat, vysvětlit. Dva úkoly najednou znamenají dva prompty."],
      ["Vstup", "Co dodáváte. Nejčastější chyba je předpokládat, že AI vidí něco, co jste jí neposlali."],
      ["Výstup", "Formát, ve kterém odpověď potřebujete. Když ho nezadáte, dostanete odstavce — a odstavce se špatně používají."],
      ["Omezení", "Délka, tón, jazyk a hlavně dvě věty, které šetří nejvíc času: „vycházej jen z dodaných podkladů“ a „když nevíš, řekni to“."],
    ] as [string, string][],
    dataLabel: "Bezpečnost dat",
    dataBody:
      "Do promptu nevkládejte osobní údaje, klientská data, hesla ani interní dokumenty, pokud to pravidla vaší firmy výslovně nedovolují. Citlivé věci před vložením anonymizujte a používejte pracovní účty s ochranou dat.",
    readTitle: "Kam dál",
    links: [
      {
        href: "/prirucka/prompt-jako-dovednost",
        title: "Prompt jako dovednost",
        desc: "Proč fungují zrovna tyhle části a jak prompt ladit, když první odpověď nesedí.",
      },
      {
        href: "/prompty",
        title: "Databáze promptů",
        desc: "Přes tisíc hotových promptů vytažených z návodů — k okopírování jedním kliknutím.",
      },
    ],
  },
  en: {
    title: "Prompt builder",
    description:
      "Pick a role, a task, the input, the output format and the constraints — it assembles a finished prompt you can edit and copy. Plus the three closest ready-made prompts from our library.",
    eyebrow: "Tool · AI",
    heading: "Prompt builder",
    lead: "A good prompt is not longer, it is more specific. Five things separate a generic answer from a usable one: who the AI should be, what it should do, what it works with, what the output should look like and what it must not do. Click them together and the text writes itself.",
    howTitle: "The five pieces a prompt is made of",
    how: [
      ["Role", "Who the AI should be. A role is not a costume — it narrows the vocabulary, the level of detail and what gets treated as important."],
      ["Task", "One verb. Write, summarize, compare, review, plan, explain. Two tasks at once means two prompts."],
      ["Input", "What you supply. The most common mistake is assuming the AI can see something you never sent it."],
      ["Output", "The format you need the answer in. Leave it out and you get paragraphs — and paragraphs are hard to use."],
      ["Constraints", "Length, tone, language and above all the two lines that save the most time: “use only the material I provided” and “say so when you do not know”."],
    ] as [string, string][],
    dataLabel: "Data safety",
    dataBody:
      "Do not put personal data, client records, passwords or internal documents into a prompt unless your company policy explicitly allows it. Anonymize anything sensitive first and use work accounts with data protection in place.",
    readTitle: "Read next",
    links: [
      {
        href: "/prirucka/prompt-jako-dovednost",
        title: "Prompting as a skill",
        desc: "Why these particular parts work and how to adjust a prompt when the first answer misses.",
      },
      {
        href: "/prompty",
        title: "Prompt library",
        desc: "Over a thousand ready-made prompts pulled out of the guides — copy any of them with one click.",
      },
    ],
  },
};

/**
 * Klíčová slova, podle kterých se hotový prompt přiřadí k typu úkolu.
 * Bez diakritiky a malými písmeny — porovnává se přes norm().
 */
const TASK_KEYWORDS: Record<string, string[]> = {
  write: ["napis", "sepis", "formuluj", "prepis ", "sepsat", "write ", "draft ", "rewrite"],
  summarize: ["shrn", "souhrn", "summar", "extrahuj", "vytahni", "zestrucni", "condense"],
  compare: ["porovn", "srovn", "compar", "rozdil mezi", "versus", "vyber z"],
  review: [
    "zkontroluj", "kontrola", "najdi chyby", "oponuj", "oponent", "zreviduj",
    "posud", "zhodnot", "review", "critique", "find the",
  ],
  plan: ["naplanuj", "rozvrh", "harmonogram", "rozdel na kroky", "plan na", "schedule", "roadmap", "postup, jak"],
  explain: ["vysvetl", "explain", "co znamena", "nauc me", "priklad, ktery", "teach me"],
};

function norm(s: string): string {
  return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function tasksFor(entry: PromptEntry): string[] {
  const hay = norm(`${entry.label} ${entry.text.slice(0, 400)}`);
  return Object.keys(TASK_KEYWORDS).filter((task) =>
    TASK_KEYWORDS[task].some((kw) => hay.includes(kw)),
  );
}

/**
 * Reprezentativní vzorek ~40 promptů: z každého typu úkolu vybere sedm kusů
 * rovnoměrně rozprostřených po celé databázi a z různých článků.
 */
function buildSamples(entries: PromptEntry[]): PromptSample[] {
  const tagged = entries.map((e) => ({ entry: e, tasks: tasksFor(e) }));
  const picked = new Map<string, PromptEntry>();

  for (const task of Object.keys(TASK_KEYWORDS)) {
    const hits = tagged.filter((x) => x.tasks.includes(task)).map((x) => x.entry);
    if (!hits.length) continue;
    const want = 7;
    const stride = Math.max(1, Math.floor(hits.length / want));
    const seenSlugs = new Set<string>();
    let taken = 0;
    for (let i = 0; i < hits.length && taken < want; i += stride) {
      const e = hits[i];
      if (seenSlugs.has(e.slug)) continue;
      seenSlugs.add(e.slug);
      picked.set(e.id, e);
      taken++;
    }
  }

  return [...picked.values()].map((e) => ({
    id: e.id,
    label: e.label,
    slug: e.slug,
    title: e.title,
    excerpt: e.text.length > 300 ? `${e.text.slice(0, 300).trimEnd()}…` : e.text,
    tasks: tasksFor(e),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://www.produktivni.cz/nastroje/promptovac";
  const enUrl = "https://www.productive.tips/nastroje/promptovac";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function PromptBuilderPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const samples = buildSamples(getAllPrompts(locale));

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>

      <PromptBuilder samples={samples} locale={locale} />

      <section aria-labelledby="dilky" className="mt-14">
        <h2 id="dilky" className="display text-[20px]">
          {t.howTitle}
        </h2>
        <dl className="mt-4 border-t-2 border-hairline-strong">
          {t.how.map(([term, desc]) => (
            <div key={term} className="border-b border-hairline py-4">
              <dt className="text-[15px] font-bold">{term}</dt>
              <dd className="mt-1 max-w-[62ch] text-[14px] leading-relaxed text-muted">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <aside className="mt-10 border border-hairline-strong bg-surface p-5" aria-label={t.dataLabel}>
        <p className="eyebrow mb-2 text-faint">{t.dataLabel}</p>
        <p className="text-[13.5px] leading-relaxed text-muted">{t.dataBody}</p>
      </aside>

      <section aria-labelledby="kamdal" className="mt-12">
        <h2 id="kamdal" className="display text-[20px]">
          {t.readTitle}
        </h2>
        <div className="mt-4 border-t-2 border-hairline-strong">
          {t.links.map((l) => (
            <Link key={l.href} href={p(l.href)} className="linkblock border-b border-hairline py-4">
              <span className="draw-link text-[16px] font-bold">{l.title}</span>
              <span className="mt-1.5 block max-w-[60ch] text-[13.5px] leading-relaxed text-muted">
                {l.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
