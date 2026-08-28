import { getAllTipMetas, type TipMeta } from "@/lib/tips";
import { getDict, localePath, type Locale } from "@/lib/i18n";

/** Cílové skupiny (profese) — zdroj pravdy pro landing pages /pro/* (cs) a /for/* (en). */
export type AudienceId =
  | "ucitel"
  | "student"
  | "manazer"
  | "marketer"
  | "vyvojar"
  | "freelancer"
  | "rodic"
  | "novinar";

export type Audience = {
  /** Hodnota v poli `audience` ve frontmatteru tipů. */
  id: AudienceId;
  /** Pořadí v rozcestníku i v navigaci. */
  order: number;
  /** URL segment profese — liší se podle jazyka. */
  slug: Record<Locale, string>;
  /** Název skupiny v 1. pádu množného čísla („Učitelé“). */
  name: Record<Locale, string>;
  /** Tvar do vazby „pro …“ / „for …“ („učitele“ → „AI a produktivita pro učitele“). */
  forWhom: Record<Locale, string>;
  /** Dvě věty: pro koho to je a co z toho má. */
  description: Record<Locale, string>;
};

export const audiences: Audience[] = ([
  {
    id: "ucitel",
    order: 1,
    slug: { cs: "ucitele", en: "teachers" },
    name: { cs: "Učitelé", en: "Teachers" },
    forWhom: { cs: "učitele", en: "teachers" },
    description: {
      cs: "Pro učitele základních a středních škol, lektory a všechny, kdo den co den připravují výuku. Najdete tu přípravu materiálů, opravování a školní administrativu zkrácené na zlomek času — aby zbylo víc prostoru na žáky.",
      en: "For school teachers, lecturers and anyone who prepares lessons day after day. Lesson prep, grading and school admin cut down to a fraction of the time — so more of the day is left for the students.",
    },
  },
  {
    id: "student",
    order: 2,
    slug: { cs: "studenty", en: "students" },
    name: { cs: "Studenti", en: "Students" },
    forWhom: { cs: "studenty", en: "students" },
    description: {
      cs: "Pro studenty středních a vysokých škol, kteří chtějí zvládnout učení bez nočních směn před zkouškou. Poznámky, opakování, zdroje a psaní prací s AI, která pomáhá přemýšlet — ne podvádět.",
      en: "For high school and university students who want to learn without all-nighters before exams. Notes, spaced repetition, sources and writing with AI that helps you think — not cheat.",
    },
  },
  {
    id: "manazer",
    order: 3,
    slug: { cs: "manazery", en: "managers" },
    name: { cs: "Manažeři", en: "Managers" },
    forWhom: { cs: "manažery", en: "managers" },
    description: {
      cs: "Pro vedoucí týmů a projektové manažery, kterým den ukrojí porady, e-maily a rozhodování za ostatní. Systémy na delegování, zápisy z porad a přehled, který drží i ve špatném týdnu.",
      en: "For team leads and project managers whose day is eaten by meetings, email and decisions made for other people. Systems for delegating, meeting notes and an overview that survives a bad week.",
    },
  },
  {
    id: "marketer",
    order: 4,
    slug: { cs: "marketing", en: "marketing" },
    name: { cs: "Marketing", en: "Marketing" },
    forWhom: { cs: "marketéry", en: "marketers" },
    description: {
      cs: "Pro marketéry, contentisty a správce sociálních sítí ve firmách i na volné noze. Rychlejší tvorba obsahu, kampaně, analýzy a copy — s AI v roli mladšího kolegy, kterému zadáváte práci.",
      en: "For marketers, content people and social media managers, in-house or freelance. Faster content, campaigns, analytics and copy — with AI as the junior colleague you hand work to.",
    },
  },
  {
    id: "vyvojar",
    order: 5,
    slug: { cs: "vyvojare", en: "developers" },
    name: { cs: "Vývojáři", en: "Developers" },
    forWhom: { cs: "vývojáře", en: "developers" },
    description: {
      cs: "Pro vývojáře a všechny, kdo žijí v editoru, terminálu a code review. Zkratky, automatizace, AI asistenti a rutiny, které ubírají přepínání kontextu místo aby ho přidávaly.",
      en: "For developers and everyone who lives in an editor, a terminal and code review. Shortcuts, automation, AI assistants and routines that remove context switching instead of adding it.",
    },
  },
  {
    id: "freelancer",
    order: 6,
    slug: { cs: "freelancery", en: "freelancers" },
    name: { cs: "Freelanceři", en: "Freelancers" },
    forWhom: { cs: "freelancery", en: "freelancers" },
    description: {
      cs: "Pro lidi na volné noze, kteří jsou zároveň výroba, obchod i back office. Nabídky, fakturace, klientská komunikace a plánování času tak, aby zbyl i na placenou práci.",
      en: "For solo professionals who are the production line, the sales team and the back office at once. Proposals, invoicing, client comms and time planning that still leaves room for billable work.",
    },
  },
  {
    id: "rodic",
    order: 7,
    slug: { cs: "rodice", en: "parents" },
    name: { cs: "Rodiče", en: "Parents" },
    forWhom: { cs: "rodiče", en: "parents" },
    description: {
      cs: "Pro rodiče, kteří žonglují s prací, domácností a dětským kalendářem naráz. Sdílené seznamy, plánování rodiny a domácí administrativa, kterou za vás z velké části udělá rutina.",
      en: "For parents juggling work, a household and a kids' calendar at the same time. Shared lists, family planning and household admin that a routine can largely take off your hands.",
    },
  },
  {
    id: "novinar",
    order: 8,
    slug: { cs: "novinare", en: "journalists" },
    name: { cs: "Novináři", en: "Journalists" },
    forWhom: { cs: "novináře", en: "journalists" },
    description: {
      cs: "Pro redaktory, editory a všechny, kdo píšou proti uzávěrce. Rešerše s dohledatelnými zdroji, data z veřejných registrů, krácení na přesný rozsah a práce s tónem — s jasnou čárou, kde končí pomocník a začíná autorská odpovědnost.",
      en: "For reporters, editors and anyone writing against a deadline. Research with sources you can trace, data from public registries, cutting to an exact length and working with tone — with a clear line where the assistant ends and your byline begins.",
    },
  },
] satisfies Audience[]).sort((a, b) => a.order - b.order);

/** Základ URL sekce — segment je lokalizovaný: cs /pro, en /for. */
export function audienceBase(locale: Locale): string {
  return locale === "en" ? "/for" : "/pro";
}

/** Interní odkaz na landing page profese (včetně /en prefixu na preview). */
export function audienceHref(audience: Audience, locale: Locale): string {
  return localePath(locale, `${audienceBase(locale)}/${audience.slug[locale]}`);
}

/** Cesta bez prefixu jazyka — pro canonical, hreflang a sitemapu. */
export function audiencePath(audience: Audience, locale: Locale): string {
  return `${audienceBase(locale)}/${audience.slug[locale]}`;
}

export function getAudience(slug: string, locale: Locale): Audience | undefined {
  return audiences.find((a) => a.slug[locale] === slug);
}

export function getAudienceById(id: string): Audience | undefined {
  return audiences.find((a) => a.id === id);
}

/** Najde profesi podle slugu v kterémkoli jazyce — pro přesměrování z cizí jazykové varianty. */
export function getAudienceByAnySlug(slug: string): Audience | undefined {
  return audiences.find((a) => a.slug.cs === slug || a.slug.en === slug);
}

/** Tipy pro danou profesi (jen metadata, bez těla): velké návody první, pak od nejnovějšího. */
export function tipsForAudience(id: string, locale: Locale = "cs"): TipMeta[] {
  return getAllTipMetas(locale)
    .filter((tip) => tip.audience.includes(id))
    .sort((a, b) => {
      if (a.isMega !== b.isMega) return a.isMega ? -1 : 1;
      return a.date < b.date ? 1 : -1;
    });
}

/** „1 tip / 3 tipy / 12 tipů“ — česká trojice, angličtina jen jedno/více. */
export function formatTipCount(n: number, locale: Locale): string {
  const w = getDict(locale).pro.tipsWord;
  if (locale === "en") return `${n} ${n === 1 ? w.one : w.many}`;
  if (n === 1) return `${n} ${w.one}`;
  if (n >= 2 && n <= 4) return `${n} ${w.few}`;
  return `${n} ${w.many}`;
}
