import { getAllAgentMetas } from "@/lib/agents";
import { getAllNews } from "@/lib/news";
import { getAllTipMetas } from "@/lib/tips";

/**
 * Jednotný proud toho, co na webu vyšlo: tipy, AI novinky a díly Agentů
 * seřazené od nejnovějšího. Čte se z něj stránka /nove i týdenní newsletter.
 * Naplánované články v něm nejsou — o to se starají výpisy (lib/publish.ts).
 */
export type FeedKind = "tip" | "ai" | "agent";

export type FeedItem = {
  kind: FeedKind;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  /** Cesta bez jazykového prefixu, např. /tipy/slug. */
  path: string;
};

const SECTION: Record<FeedKind, string> = { tip: "/tipy", ai: "/ai", agent: "/agenti" };

export function getFeed(locale: string = "cs"): FeedItem[] {
  const item = (kind: FeedKind) => (x: { slug: string; title: string; excerpt: string; date: string }) => ({
    kind,
    slug: x.slug,
    title: x.title,
    excerpt: x.excerpt,
    date: x.date,
    path: `${SECTION[kind]}/${x.slug}`,
  });
  return [
    ...getAllTipMetas(locale).map(item("tip")),
    ...getAllNews(locale).map(item("ai")),
    ...getAllAgentMetas(locale).map(item("agent")),
  ].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "cs"));
}

/** Položky vydané v uzavřeném rozmezí dnů (YYYY-MM-DD včetně obou krajů). */
export function feedBetween(from: string, to: string, locale: string = "cs"): FeedItem[] {
  return getFeed(locale).filter((i) => i.date >= from && i.date <= to);
}
