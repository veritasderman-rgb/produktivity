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
    tools: "Nástroje",
    gadgets: "Gadgety",
    training: "Školení",
    search: "Hledat",
    subscribe: "Odebírat",
    aiOverview: "AI přehled",
    forProfession: "Pro profesi",
    aiMenu: "Rozbalit menu AI",
  },
  pro: {
    hubEyebrow: "Rozcestník",
    hubTitle: "Produktivita podle profese",
    hubMetaTitle: "AI a produktivita podle profese",
    hubDescription:
      "Vyberte si svoji profesi a dostanete jen tipy, které dávají smysl pro váš den: učitelé, studenti, manažeři, marketing, vývojáři, freelanceři a rodiče.",
    hubLead:
      "Sedm skupin, sedm různých dnů. Vyberte tu svoji a uvidíte jen tipy, které vám sedí — od velkých návodů po zkratky na pět vteřin.",
    eyebrow: "Pro profesi",
    forPrefix: "Pro",
    titlePrefix: "AI a produktivita pro",
    startEyebrow: "Doporučený start",
    startTitle: "Začněte těmito návody",
    startLead: "Tři velké návody, které pokryjí většinu toho, co vám ujídá den. Zbytek už jde sám.",
    allEyebrow: "Všechno pro vás",
    allTitle: "Všechny tipy",
    allLead: "Filtrujte podle kategorie, platformy nebo hledejte — seznam níž je už zúžený na vaši profesi.",
    emptyTitle: "Tipy pro tuhle skupinu se právě chystají",
    emptyDesc: "Obsah přibývá každý den. Nechte si dát vědět e-mailem, nebo se zatím mrkněte na všechny tipy.",
    otherEyebrow: "Další profese",
    otherTitle: "Nejste to úplně vy?",
    allProfessions: "Všechny profese",
    allTipsLink: "Všechny tipy",
    browse: "Zobrazit tipy",
    ctaEyebrow: "Jeden tip týdně",
    ctaDesc: "Posílám jeden použitelný tip týdně. Dvě minuty čtení, hodiny úspor.",
    tipsWord: { one: "tip", few: "tipy", many: "tipů" },
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
      ucitel: "Učitelé", marketer: "Marketing", rodic: "Rodiče",
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
    tools: "Tools",
    gadgets: "Gadgets",
    training: "Training",
    search: "Search",
    subscribe: "Subscribe",
    aiOverview: "AI overview",
    forProfession: "For your profession",
    aiMenu: "Open the AI menu",
  },
  pro: {
    hubEyebrow: "Where to start",
    hubTitle: "Productivity by profession",
    hubMetaTitle: "AI and productivity by profession",
    hubDescription:
      "Pick your profession and get only the tips that fit your day: teachers, students, managers, marketing, developers, freelancers and parents.",
    hubLead:
      "Seven groups, seven very different days. Pick yours and you will only see the tips that fit — from in-depth guides to five-second shortcuts.",
    eyebrow: "For your profession",
    forPrefix: "For",
    titlePrefix: "AI and productivity for",
    startEyebrow: "Recommended start",
    startLead: "Three in-depth guides that cover most of what eats your day. The rest gets easy after that.",
    startTitle: "Start with these guides",
    allEyebrow: "Everything for you",
    allTitle: "All the tips",
    allLead: "Filter by category or platform, or just search — the list below is already narrowed down to your profession.",
    emptyTitle: "Tips for this group are on their way",
    emptyDesc: "New content lands every day. Get a heads-up by email, or browse all the tips in the meantime.",
    otherEyebrow: "Other professions",
    otherTitle: "Not quite you?",
    allProfessions: "All professions",
    allTipsLink: "All tips",
    browse: "See the tips",
    ctaEyebrow: "One tip a week",
    ctaDesc: "I send one usable tip a week. Two minutes to read, hours saved.",
    tipsWord: { one: "tip", few: "tips", many: "tips" },
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
      ucitel: "Teachers", marketer: "Marketers", rodic: "Parents",
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
