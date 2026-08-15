import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";
import { getAllPrompts } from "@/lib/prompts";

export const revalidate = 3600;

// llms.txt — strojově čitelný přehled webu pro AI crawlery a asistenty.
// Formát dle llmstxt.org: H1 + shrnutí + sekce s odkazy.
export async function GET() {
  const chapters = getAllChapters();
  const tips = getAllTips();
  const news = getAllNews();
  const enChapters = getAllChapters("en");
  const enTips = getAllTips("en");
  const prompts = getAllPrompts();

  const lines: string[] = [
    "# Produktivní.cz",
    "",
    "> Česká příručka produktivity od Josefa Pavlovice: ověřené systémy (GTD, Inbox Zero, time-blocking, Pomodoro, SCRUM/Kanban/OKR), " +
      `${tips.length} praktických tipů s návody a AI novinky přeložené do praxe. Obsah je psaný česky, průběžně aktualizovaný člověkem i AI. Anglická verze: https://www.productive.tips`,
    "",
    "Plná verze s kompletními texty kapitol a nejobsáhlejších návodů: https://www.produktivni.cz/llms-full.txt (anglicky: https://www.productive.tips/llms-full.txt)",
    "",
    "Kurátorovaný výběr vybavení pro produktivitu: https://www.produktivni.cz/gadgety",
    "",
    `Databáze promptů — ${prompts.length} hotových promptů pro ChatGPT, Claude a Gemini, vytažených z článků a připravených ke zkopírování: https://www.produktivni.cz/prompty (anglicky: https://www.productive.tips/prompty)`,
    "",
    "E-mailový kurz zdarma „AI za týden“ — sedm dní, sedm krátkých e-mailů, každý den jedna dovednost a jeden prompt k vyzkoušení: https://www.produktivni.cz/kurz (anglicky: https://www.productive.tips/kurz)",
    "",
    "## Příručka (kapitoly)",
    "",
    ...chapters.map((c) => `- [${c.title}](https://www.produktivni.cz/prirucka/${c.slug}): ${c.excerpt}`),
    "",
    "## Tipy & triky",
    "",
    `Kompletní seznam ${tips.length} tipů: https://www.produktivni.cz/tipy (filtry: kategorie, platforma, cílová skupina)`,
    "",
    ...tips.slice(0, 40).map((t) => `- [${t.title}](https://www.produktivni.cz/tipy/${t.slug}): ${t.excerpt}`),
    "",
    "## AI novinky",
    "",
    ...news.map((n) => `- [${n.title}](https://www.produktivni.cz/ai/${n.slug}): ${n.excerpt}`),
  ];

  if (enChapters.length > 0 || enTips.length > 0) {
    lines.push("", "## English version", "");
    lines.push(...enChapters.map((c) => `- [${c.title}](https://www.productive.tips/prirucka/${c.slug}): ${c.excerpt}`));
    if (enTips.length > 0) lines.push(`- [All ${enTips.length} tips in English](https://www.productive.tips/tipy)`);
  }

  lines.push("", "## Kontakt", "", "- Josef Pavlovic: https://josefpavlovic.cz", "- E-mail: josef@josefpavlovic.cz", "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
