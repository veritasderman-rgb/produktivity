import type { Tip } from "./tips";

/** Kategorie tipu → slug nejrelevantnější kapitoly příručky. */
const categoryToChapter: Record<string, { slug: string; title: string }> = {
  ai: { slug: "ai-a-automatizace", title: "AI a automatizace" },
  workflow: { slug: "zakladni-systemy", title: "Základní systémy: inbox, priority, revize" },
  komunikace: { slug: "emailova-komunikace", title: "Profesionální e-mailová komunikace" },
  hardware: { slug: "home-office", title: "Kompletní průvodce efektivním home office" },
  aplikace: { slug: "kategorie-aplikaci", title: "Klíčové kategorie aplikací" },
  zkratky: { slug: "kategorie-aplikaci", title: "Klíčové kategorie aplikací" },
};

export function chapterForTip(tip: Tip): { slug: string; title: string } | null {
  return categoryToChapter[tip.category] ?? null;
}

/** Deterministický výběr podobných tipů (stejná kategorie, pak platforma). */
export function relatedTips(tip: Tip, all: Tip[], count = 3): Tip[] {
  const pool = all.filter((t) => t.slug !== tip.slug);
  const scored = pool
    .map((t) => {
      let score = 0;
      if (t.category === tip.category) score += 4;
      if (t.platform === tip.platform && tip.platform !== "vsude") score += 2;
      if (t.audience.some((a) => tip.audience.includes(a))) score += 1;
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.t.slug < b.t.slug ? -1 : 1));
  // stabilní rozprostření: posun podle hashe slugu, ať různé tipy nabízejí různé sousedy
  const offset = hash(tip.slug) % Math.max(1, scored.length - count);
  return scored.slice(offset, offset + count).map((x) => x.t);
}

/** Kapitola → filtr souvisejících tipů (kategorie + klíčová slova ve slugu). */
const chapterTipConfig: Record<string, { categories?: string[]; slugKeywords?: string[] }> = {
  "predmluva": { categories: ["workflow"] },
  "co-znamena-byt-produktivni": { categories: ["workflow"], slugKeywords: ["tri-hlavni", "tydenni", "timeboxing"] },
  "zakladni-systemy": { categories: ["workflow"], slugKeywords: ["todoist", "tri-hlavni", "tydenni-prehled", "batching"] },
  "psychologie-produktivity": { slugKeywords: ["prvni-krok", "pomodoro", "blokovac", "shutdown", "deep-work"] },
  "telo-a-produktivita": { slugKeywords: ["svetlo", "stul", "monitor", "rezim-spanku", "pomodoro-timer"] },
  "veda-o-produktivite": { slugKeywords: ["toggl", "pomodoro", "rozlozene-uceni", "aktivni-vybavovani"] },
  "getting-things-done": { slugKeywords: ["todoist", "gtd", "notion", "tydenni-prehled", "capture"] },
  "inbox-zero": { slugKeywords: ["gmail", "outlook", "email", "swipe-mail"] },
  "pomodoro-a-time-blocking": { slugKeywords: ["pomodoro", "timeboxing", "kalendar-bloky", "deep-work", "focus-sessions"] },
  "scrum-kanban-okr": { slugKeywords: ["notion", "tydenni-prehled", "checklisty", "async-status"] },
  "kreativni-techniky": { slugKeywords: ["obsidian", "eink", "hlasovy-capture", "diktovani"] },
  "jak-vybrat-system": { categories: ["workflow"], slugKeywords: ["todoist", "notion", "obsidian"] },
  "druhy-mozek": { slugKeywords: ["obsidian", "notion", "web-clipper", "notebooklm", "zavorky"] },
  "zachyceni-informaci": { slugKeywords: ["capture", "web-clipper", "skenujte", "hlasovy", "diktovani", "ios-skenovani"] },
  "vyber-nastroju": { categories: ["aplikace"], slugKeywords: ["univerzalni-ctrl-p"] },
  "kategorie-aplikaci": { categories: ["aplikace"] },
  "digitalni-minimalismus": { slugKeywords: ["mobil-limity", "mobil-sedy", "mobil-prvni", "blokovac", "planovane-souhrny"] },
  "ai-a-automatizace": { categories: ["ai"], slugKeywords: ["rutina-", "n8n"] },
  "home-office": { categories: ["hardware"], slugKeywords: ["deep-work-mode-doma", "dokovaci", "monitor"] },
  "tymova-produktivita": { slugKeywords: ["slack", "teams", "manazer", "async"] },
  "emailova-komunikace": { categories: ["komunikace"], slugKeywords: ["gmail", "outlook", "email"] },
  "produktivita-pri-studiu": { categories: [], slugKeywords: ["student", "anki", "notebooklm", "rozlozene", "aktivni-vybavovani", "vysvetleni-latky"] },
};

export function tipsForChapter(chapterSlug: string, all: Tip[], count = 4): Tip[] {
  const cfg = chapterTipConfig[chapterSlug];
  if (!cfg) return [];
  const scored = all
    .map((t) => {
      let score = 0;
      if (cfg.slugKeywords?.some((k) => t.slug.includes(k))) score += 4;
      if (cfg.categories?.includes(t.category)) score += 2;
      return { t, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || (a.t.slug < b.t.slug ? -1 : 1));
  const offset = scored.length > count ? hash(chapterSlug) % Math.min(3, scored.length - count) : 0;
  return scored.slice(offset, offset + count).map((x) => x.t);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/** Deterministický „tip dne" — stejný pro všechny po celý den. */
export function tipOfTheDay(all: Tip[], date = new Date()): Tip {
  const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}-${date.getUTCDate()}`;
  return all[hash(key) % all.length];
}
