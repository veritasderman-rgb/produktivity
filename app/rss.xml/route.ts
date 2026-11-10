import { getAllAgentMetas } from "@/lib/agents";
import { getAllNews } from "@/lib/news";
import { getAllTips } from "@/lib/tips";

const SITE = "https://www.produktivni.cz";

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

type FeedItem = { title: string; path: string; date: string; excerpt: string; category: string };

// Fronta publikování: článek vyjde v den svého `date`, stránka se proto obnovuje sama (lib/publish.ts).
export const revalidate = 3600;

export function GET() {
  // Tipy, AI novinky a díly seriálu Agenti v jednom kanálu, nejnovější nahoře. Seriál se na
  // webu řadí po linkách, takže bez RSS by se nový díl k odběratelům nedostal.
  const feed: FeedItem[] = [
    ...getAllTips().map((t) => ({
      title: t.title,
      path: `/tipy/${t.slug}`,
      date: t.date,
      excerpt: t.excerpt,
      category: "Tipy",
    })),
    ...getAllAgentMetas().map((a) => ({
      title: a.title,
      path: `/agenti/${a.slug}`,
      date: a.date,
      excerpt: a.excerpt,
      category: "Agenti a vlastní AI",
    })),
    ...getAllNews().map((n) => ({
      title: n.title,
      path: `/ai/${n.slug}`,
      date: n.date,
      excerpt: n.excerpt,
      category: "AI novinky",
    })),
  ].sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title, "cs"));

  const items = feed
    .map(
      (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${SITE}${i.path}</link>
      <guid>${SITE}${i.path}</guid>
      <pubDate>${new Date(i.date).toUTCString()}</pubDate>
      <category>${escapeXml(i.category)}</category>
      <description>${escapeXml(i.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Produktivní.cz — tipy, AI novinky a agenti</title>
    <link>${SITE}</link>
    <description>Tipy a triky pro produktivitu, AI novinky přeložené do praxe a seriál o agentech a vlastní AI.</description>
    <language>cs</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
