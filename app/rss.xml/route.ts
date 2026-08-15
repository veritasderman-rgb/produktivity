import { getAllTips } from "@/lib/tips";

const SITE = "https://www.produktivni.cz";

function escapeXml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function GET() {
  const tips = getAllTips();
  const items = tips
    .map(
      (t) => `    <item>
      <title>${escapeXml(t.title)}</title>
      <link>${SITE}/tipy/${t.slug}</link>
      <guid>${SITE}/tipy/${t.slug}</guid>
      <pubDate>${new Date(t.date).toUTCString()}</pubDate>
      <description>${escapeXml(t.excerpt)}</description>
    </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Produktivní.cz — tipy &amp; triky</title>
    <link>${SITE}</link>
    <description>Denní tipy a triky pro produktivitu: zkratky, aplikace, workflow a AI.</description>
    <language>cs</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
