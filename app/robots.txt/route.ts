import type { NextRequest } from "next/server";

// AI crawleři jsou výslovně vítáni — cíl je být citovaný zdroj v AI odpovědích.
// Přehled obsahu pro LLM: /llms.txt (plné texty: /llms-full.txt)
//
// Route handler místo app/robots.ts: web běží na dvou doménách (produktivni.cz
// a productive.tips) a řádek Sitemap musí ukazovat na doménu, ze které se
// robots.txt zrovna čte. Statické `app/robots.ts` umí jen jednu URL.
// Middleware se na /robots.txt nespouští (matcher ho vynechává), takže Host
// čteme přímo tady — stejná logika jako v middleware.ts.

const EN_DOMAIN = process.env.EN_DOMAIN ?? "productive.tips";

/** Boti, kterým allow říkáme explicitně (nad rámec obecného `*`). */
const AI_BOTS = ["GPTBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended", "CCBot"];

export function GET(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const isEn = host === EN_DOMAIN || host === `www.${EN_DOMAIN}`;
  const base = isEn ? "https://productive.tips" : "https://produktivni.cz";

  const lines = [
    "User-Agent: *",
    "Allow: /",
    "Disallow: /api/",
    "",
    ...AI_BOTS.flatMap((bot) => [`User-Agent: ${bot}`, "Allow: /", ""]),
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
