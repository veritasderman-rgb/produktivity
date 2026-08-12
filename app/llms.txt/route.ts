import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";

export const revalidate = 3600;

// llms.txt — strojově čitelný přehled webu pro AI crawlery a asistenty.
// Formát dle llmstxt.org: H1 + shrnutí + sekce s odkazy.
export async function GET() {
  const chapters = getAllChapters();
  const tips = getAllTips();
  const news = getAllNews();
  const enChapters = getAllChapters("en");
  const enTips = getAllTips("en");

  const lines: string[] = [
    "# Produktivní.cz",
    "",
    "> Česká příručka produktivity od Josefa Pavlovice: ověřené systémy (GTD, Inbox Zero, time-blocking, Pomodoro, SCRUM/Kanban/OKR), " +
      `${tips.length} praktických tipů s návody a AI novinky přeložené do praxe. Obsah je psaný česky, průběžně aktualizovaný člověkem i AI. Anglická verze: https://produktivni.cz/en`,
    "",
    "Autor školí firemní týmy v produktivitě a AI nástrojích: https://produktivni.cz/skoleni",
    "Kurátorovaný výběr vybavení pro produktivitu: https://produktivni.cz/gadgety",
    "",
    "## Příručka (kapitoly)",
    "",
    ...chapters.map((c) => `- [${c.title}](https://produktivni.cz/prirucka/${c.slug}): ${c.excerpt}`),
    "",
    "## Tipy & triky",
    "",
    `Kompletní seznam ${tips.length} tipů: https://produktivni.cz/tipy (filtry: kategorie, platforma, cílová skupina)`,
    "",
    ...tips.slice(0, 40).map((t) => `- [${t.title}](https://produktivni.cz/tipy/${t.slug}): ${t.excerpt}`),
    "",
    "## AI novinky",
    "",
    ...news.map((n) => `- [${n.title}](https://produktivni.cz/ai/${n.slug}): ${n.excerpt}`),
  ];

  if (enChapters.length > 0 || enTips.length > 0) {
    lines.push("", "## English version", "");
    lines.push(...enChapters.map((c) => `- [${c.title}](https://produktivni.cz/en/prirucka/${c.slug}): ${c.excerpt}`));
    if (enTips.length > 0) lines.push(`- [All ${enTips.length} tips in English](https://produktivni.cz/en/tipy)`);
  }

  lines.push("", "## Kontakt", "", "- Josef Pavlovic: https://josefpavlovic.cz", "- E-mail: josef@josefpavlovic.cz", "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
