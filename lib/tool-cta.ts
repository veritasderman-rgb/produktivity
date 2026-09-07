import type { Locale } from "@/lib/i18n";

/**
 * Texty přihlašovacího bloku pod interaktivními nástroji (/nastroje/*).
 *
 * Nástroje jsou místo s nejvyšším zájmem na celém webu: kdo právě dokončil
 * audit času nebo kvíz, má výsledek v ruce a je nejochotnější nechat e-mail.
 * Do téhle chvíle na nich nebyl žádný sběr kontaktů.
 *
 * Copy proto navazuje na to, co člověk právě dodělal — ne obecné „odebírejte
 * newsletter". Klíč zároveň slouží jako `source` do Brevo (`nastroj-<klíč>`),
 * takže jde po pár týdnech změřit, který nástroj skutečně konvertuje.
 */
export const TOOL_CTA_KEYS = [
  "kviz",
  "audit-casu",
  "diagnostika",
  "sazba",
  "promptovac",
  "pomodoro",
] as const;

export type ToolCtaKey = (typeof TOOL_CTA_KEYS)[number];

type Copy = { eyebrow: string; desc: string };

const COPY: Record<Locale, Record<ToolCtaKey, Copy>> = {
  cs: {
    kviz: {
      eyebrow: "Máte výsledek. Co s ním?",
      desc: "Systém se nezavádí za odpoledne. Jeden tip týdně do e-mailu vám s tím pomůže — a e-book Top 30 tipů dostanete hned.",
    },
    "audit-casu": {
      eyebrow: "Víte, kam vám mizí čas",
      desc: "Nejtěžší část přijde teď: udržet to. Posílám jeden použitelný tip týdně, dvě minuty čtení.",
    },
    diagnostika: {
      eyebrow: "Víte, kde vám AI pomůže",
      desc: "Zavádět to po jednom kroku je snazší než všechno naráz. Jeden tip týdně vám ten krok připomene.",
    },
    sazba: {
      eyebrow: "Sazbu máte spočítanou",
      desc: "Co dál šetří freelancerovi čas i peníze, posílám jednou týdně. Bez balastu.",
    },
    promptovac: {
      eyebrow: "Prompt máte. Co dál?",
      desc: "Nové prompty a AI postupy posílám jednou týdně — hotové ke zkopírování.",
    },
    pomodoro: {
      eyebrow: "Soustředění je návyk",
      desc: "Jeden tip týdně, jak si ho udržet i ve dnech, kdy to nejde. Dvě minuty čtení.",
    },
  },
  en: {
    kviz: {
      eyebrow: "You have the result. Now what?",
      desc: "A system does not land in an afternoon. One tip a week helps it stick — and the Top 30 tips e-book arrives right away.",
    },
    "audit-casu": {
      eyebrow: "Now you know where the time goes",
      desc: "The hard part starts now: keeping it up. I send one usable tip a week, two minutes to read.",
    },
    diagnostika: {
      eyebrow: "You know where AI will help",
      desc: "Rolling it out one step at a time beats doing everything at once. One tip a week keeps the next step in view.",
    },
    sazba: {
      eyebrow: "Your rate is worked out",
      desc: "What else saves a freelancer time and money goes out once a week. No filler.",
    },
    promptovac: {
      eyebrow: "You have the prompt. What next?",
      desc: "New prompts and AI workflows go out once a week — ready to copy.",
    },
    pomodoro: {
      eyebrow: "Focus is a habit",
      desc: "One tip a week on keeping it, even on the days it will not come. Two minutes to read.",
    },
  },
};

/** Props pro `<NewsletterCta>` pod daným nástrojem. */
export function toolCta(key: ToolCtaKey, locale: Locale = "cs") {
  const copy = (COPY[locale] ?? COPY.cs)[key];
  return { eyebrow: copy.eyebrow, desc: copy.desc, source: `nastroj-${key}` };
}
