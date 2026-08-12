export type Locale = "cs" | "en";

export const locales: Locale[] = ["cs", "en"];

/** Prefix interních odkazů podle jazyka: cs = bez prefixu, en = /en. */
export function localePath(locale: Locale, path: string): string {
  return locale === "en" ? `/en${path === "/" ? "" : path}` || "/en" : path;
}

const cs = {
  siteName: "Produktivní",
  siteTld: ".cz — rychleji každý den",
  siteTitle: "Produktivní.cz — rychleji každý den",
  siteBrand: "Produktivní.cz",
  siteDescription:
    "Ověřené systémy produktivity, denní tipy a triky, zkratky a AI novinky. Česky, bez balastu, k okamžitému použití.",
  nav: {
    handbook: "Příručka",
    tips: "Tipy & triky",
    ai: "AI",
    prompts: "Prompty",
    gadgets: "Gadgety",
    training: "Školení",
    search: "Hledat",
    subscribe: "Odebírat",
  },
  footer: {
    about:
      "Osobní projekt Josefa Pavlovice. Know-how o produktivitě, které se každý den aktualizuje — člověkem i AI.",
    contentLabel: "Obsah",
    handbook: "Příručka produktivity",
    tips: "Tipy & triky",
    aiSection: "AI & produktivita",
    prompts: "Databáze promptů",
    gadgets: "Gadgety",
    glossary: "Slovník pojmů",
    rss: "RSS",
    coopLabel: "Spolupráce",
    training: "Školení pro firmy",
    course: "E-mailový kurz zdarma",
    newsletter: "Newsletter",
    aboutProject: "O projektu",
    privacy: "Ochrana osobních údajů",
    copyright: "Josef Pavlovic · Produktivní.cz",
  },
  tipCard: {
    read: "Číst celý tip",
    megaBadge: "Velký návod",
    minShort: "min",
    categories: {
      zkratky: "Zkratky", aplikace: "Aplikace", ai: "AI", workflow: "Workflow",
      komunikace: "Komunikace", hardware: "Vybavení",
    } as Record<string, string>,
    platforms: {
      windows: "Windows", mac: "Mac", vsude: "Všude", prohlizec: "Prohlížeč", mobil: "Mobil",
    } as Record<string, string>,
    audiences: {
      manazer: "Manažeři", student: "Studenti", vyvojar: "Vývojáři", freelancer: "Freelanceři",
    } as Record<string, string>,
  },
  langSwitch: { label: "EN", title: "Switch to English", target: "en" as Locale },
};

const en: typeof cs = {
  siteName: "Productive",
  siteTld: "— faster every day",
  siteTitle: "Productive — faster every day",
  siteBrand: "Productive",
  siteDescription:
    "Proven productivity systems, daily tips and tricks, shortcuts and AI news. No fluff, ready to use right away.",
  nav: {
    handbook: "Handbook",
    tips: "Tips & tricks",
    ai: "AI",
    prompts: "Prompts",
    gadgets: "Gadgets",
    training: "Training",
    search: "Search",
    subscribe: "Subscribe",
  },
  footer: {
    about:
      "A personal project by Josef Pavlovic. Productivity know-how updated every day — by a human and AI.",
    contentLabel: "Content",
    handbook: "Productivity handbook",
    tips: "Tips & tricks",
    aiSection: "AI & productivity",
    prompts: "Prompt library",
    gadgets: "Gadgets",
    glossary: "Glossary",
    rss: "RSS",
    coopLabel: "Work with me",
    training: "Corporate training",
    course: "Free email course",
    newsletter: "Newsletter",
    aboutProject: "About",
    privacy: "Privacy policy",
    copyright: "Josef Pavlovic · Productive",
  },
  tipCard: {
    read: "Read the full tip",
    megaBadge: "In-depth guide",
    minShort: "min",
    categories: {
      zkratky: "Shortcuts", aplikace: "Apps", ai: "AI", workflow: "Workflow",
      komunikace: "Communication", hardware: "Gear",
    },
    platforms: {
      windows: "Windows", mac: "Mac", vsude: "Everywhere", prohlizec: "Browser", mobil: "Mobile",
    },
    audiences: {
      manazer: "Managers", student: "Students", vyvojar: "Developers", freelancer: "Freelancers",
    },
  },
  langSwitch: { label: "CS", title: "Přepnout do češtiny", target: "cs" as Locale },
};

const dicts = { cs, en };

export function getDict(locale: Locale) {
  return dicts[locale] ?? dicts.cs;
}

export function isLocale(x: string): x is Locale {
  return x === "cs" || x === "en";
}
