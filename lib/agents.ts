import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cachedByLocale } from "@/lib/content-cache";
import type { Locale } from "@/lib/i18n";

/**
 * Sekce „Agenti a vlastní AI“ (/agenti) — velký seriál o tom, kde co běží
 * a kdo to smí spustit: lokální modely, brána pro cloudové modely, ovládání
 * z Telegramu, vlastní soubory v chatu a pravidla pro agenty.
 *
 * Obsah leží v content/agenti/*.mdx (cs) a content/en/agenti/*.mdx (en).
 * Dokud tam pro daný jazyk žádný .mdx není, vrací loader prázdné pole
 * a rubrika ukazuje prázdný stav — stejně jako /rozhovory a /z-praxe.
 */

/** Šest tematických linek seriálu. Pořadí je pořadím čtení. */
export const AGENT_TRACKS = ["zaklady", "sestavy", "lokalni-ai", "orchestrace", "ovladani", "data", "rizeni"] as const;
export type AgentTrack = (typeof AGENT_TRACKS)[number];

/** Štítky napříč linkami — jeden článek jich má typicky dva až čtyři. */
export const AGENT_TAGS = [
  "agenti",
  "lokalni-ai",
  "open-weights",
  "hardware",
  "orchestrace",
  "api-klice",
  "naklady",
  "sestava",
  "ovladani",
  "telegram",
  "data",
  "mcp",
  "bezpecnost",
  "rizeni",
] as const;
export type AgentTag = (typeof AGENT_TAGS)[number];

export type AgentSource = { name: string; url: string };

export type AgentArticle = {
  slug: string;
  title: string;
  excerpt: string;
  /** Do které z šesti linek článek patří. */
  track: AgentTrack;
  /** Pořadí uvnitř linky (1–n) — sekce se čte jako seriál, ne jako novinky. */
  order: number;
  tags: AgentTag[];
  /** Kolik toho čtenář musí umět předem. */
  level: "zacatecnik" | "pokrocily";
  date: string;
  /** Datum poslední revize obsahu (ISO). Když chybí, použije se `date`. */
  updated?: string;
  /** Dvě až tři věty shrnutí — zvýrazněný blok pod hero a `abstract` v JSON-LD. */
  tldr?: string;
  /** Odkazy na zdroje pod článkem. U faktických tvrzení povinné. */
  sources: AgentSource[];
  minutes: number;
  body: string;
};

/** Článek bez těla — jediné, co se posílá do výpisů a klientských komponent. */
export type AgentArticleMeta = Omit<AgentArticle, "body" | "tldr" | "sources">;

export function agentMeta(a: AgentArticle): AgentArticleMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- rest destrukturing odděluje data pro server
  const { body: _body, tldr: _tldr, sources: _sources, ...meta } = a;
  return meta;
}

const FENCE_RE = /```[\s\S]*?```/g;

function readingMinutes(body: string): number {
  const words = body.replace(FENCE_RE, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function agentsDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "agenti")
    : path.join(process.cwd(), "content", "agenti");
}

function isTrack(x: unknown): x is AgentTrack {
  return typeof x === "string" && (AGENT_TRACKS as readonly string[]).includes(x);
}

function isTag(x: unknown): x is AgentTag {
  return typeof x === "string" && (AGENT_TAGS as readonly string[]).includes(x);
}

function loadAllAgentArticles(locale: string = "cs"): AgentArticle[] {
  const dir = agentsDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const articles = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      track: isTrack(data.track) ? data.track : "zaklady",
      order: Number(data.order ?? 99),
      tags: Array.isArray(data.tags) ? data.tags.filter(isTag) : [],
      level: data.level === "pokrocily" ? ("pokrocily" as const) : ("zacatecnik" as const),
      date: data.date as string,
      updated: (data.updated ?? data.date) as string | undefined,
      tldr: typeof data.tldr === "string" ? data.tldr.trim() : undefined,
      sources: (Array.isArray(data.sources) ? data.sources : [])
        .filter((s: unknown): s is AgentSource => {
          const source = s as AgentSource | undefined;
          return typeof source?.name === "string" && typeof source?.url === "string";
        })
        .map((s: AgentSource) => ({ name: s.name.trim(), url: s.url.trim() })),
      minutes: Number(data.minutes ?? readingMinutes(content)),
      body: content,
    };
  });
  // Seriál se čte po linkách; uvnitř linky rozhoduje `order`.
  return articles.sort((a, b) => {
    const ta = AGENT_TRACKS.indexOf(a.track);
    const tb = AGENT_TRACKS.indexOf(b.track);
    return ta === tb ? a.order - b.order : ta - tb;
  });
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllAgentArticles: (locale?: string) => AgentArticle[] =
  cachedByLocale(loadAllAgentArticles);

function loadAllAgentMetas(locale: string = "cs"): AgentArticleMeta[] {
  return getAllAgentArticles(locale).map(agentMeta);
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllAgentMetas: (locale?: string) => AgentArticleMeta[] =
  cachedByLocale(loadAllAgentMetas);

export function getAgentArticle(slug: string, locale: string = "cs"): AgentArticle | undefined {
  return getAllAgentArticles(locale).find((a) => a.slug === slug);
}

/** Články jedné linky v pořadí čtení. */
export function agentArticlesByTrack(
  articles: AgentArticleMeta[],
  track: AgentTrack,
): AgentArticleMeta[] {
  return articles.filter((a) => a.track === track);
}

/** Kolik článků nese který štítek — pro čísla u filtru. */
export function countAgentTags(articles: AgentArticleMeta[]): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const a of articles) {
    for (const tag of a.tags) acc[tag] = (acc[tag] ?? 0) + 1;
  }
  return acc;
}

/** Předchozí a další díl seriálu napříč linkami — navigace pod článkem. */
export function agentNeighbours(
  articles: AgentArticleMeta[],
  slug: string,
): { prev?: AgentArticleMeta; next?: AgentArticleMeta } {
  const i = articles.findIndex((a) => a.slug === slug);
  if (i < 0) return {};
  return { prev: articles[i - 1], next: articles[i + 1] };
}

/** Kanonická adresa článku (bez jazykového prefixu). */
export function agentPath(slug: string): string {
  return `/agenti/${slug}`;
}

/** Popisky linek a štítků. Sekce je zatím jen česky, EN se doplní s překlady. */
export const agentLabels: Record<
  Locale,
  { tracks: Record<AgentTrack, { name: string; lead: string }>; tags: Record<AgentTag, string> }
> = {
  cs: {
    tracks: {
      zaklady: {
        name: "Základy",
        lead: "Co je model, co harness a co agent — a proč se ta otázka posunula z „AI ano/ne“ na „kde co běží“.",
      },
      sestavy: {
        name: "Vzorové sestavy",
        lead: "Dvě hotové sestavy od hardwaru po fakturu: co u koho běží, kolik to stojí a proč zrovna takhle.",
      },
      "lokalni-ai": {
        name: "Lokální AI",
        lead: "První model na vlastním stroji: Mac mini, Windows s Nvidií, kolik paměti to sní a kdy lokál stačí.",
      },
      orchestrace: {
        name: "Orchestrace",
        lead: "Jedna brána před všechny modely, API klíče na jednom místě a směrování úloh podle toho, co která umí.",
      },
      ovladani: {
        name: "Ovládání",
        lead: "Velín v kapse: Telegram jako ovládací panel, bezpečná cesta domů a fronta úloh, kterou schvalujete vy.",
      },
      data: {
        name: "Vaše data",
        lead: "Soubory z disku do chatu: jak to doopravdy funguje, co je RAG, co umí MCP a co do cloudu nepatří.",
      },
      rizeni: {
        name: "Řízení a rizika",
        lead: "Agenti jsou produkt roku i riziko roku. Pravidla na jednu stránku a případovky, které stály miliardy.",
      },
    },
    tags: {
      agenti: "AI agenti",
      "lokalni-ai": "Lokální AI",
      "open-weights": "Open weights",
      hardware: "Hardware",
      orchestrace: "Orchestrace",
      "api-klice": "API klíče",
      naklady: "Náklady",
      sestava: "Vzorové sestavy",
      ovladani: "Ovládání",
      telegram: "Telegram",
      data: "Vaše data",
      mcp: "MCP",
      bezpecnost: "Bezpečnost",
      rizeni: "Řízení",
    },
  },
  en: {
    tracks: {
      zaklady: {
        name: "Foundations",
        lead: "Model, harness, agent — and why the question moved from “AI yes or no” to “what runs where”.",
      },
      sestavy: {
        name: "Reference setups",
        lead: "Two complete setups from hardware to invoice: what runs where, what it costs and why it is put together this way.",
      },
      "lokalni-ai": {
        name: "Local AI",
        lead: "Your first model on your own machine: Mac mini, Windows with an Nvidia card, memory, and when local is enough.",
      },
      orchestrace: {
        name: "Orchestration",
        lead: "One gateway in front of every model, API keys in one place, and routing each job to what handles it best.",
      },
      ovladani: {
        name: "Control",
        lead: "A control room in your pocket: Telegram as the panel, a safe route home, and a queue you approve yourself.",
      },
      data: {
        name: "Your data",
        lead: "Files from your disk into the chat: how it really works, what RAG is, what MCP does, what stays off the cloud.",
      },
      rizeni: {
        name: "Governance",
        lead: "Agents are the product of the year and the risk of the year. One page of rules and the case studies behind them.",
      },
    },
    tags: {
      agenti: "AI agents",
      "lokalni-ai": "Local AI",
      "open-weights": "Open weights",
      hardware: "Hardware",
      orchestrace: "Orchestration",
      "api-klice": "API keys",
      naklady: "Cost",
      sestava: "Reference setups",
      ovladani: "Control",
      telegram: "Telegram",
      data: "Your data",
      mcp: "MCP",
      bezpecnost: "Security",
      rizeni: "Governance",
    },
  },
};
