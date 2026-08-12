import type { MetadataRoute } from "next";

// AI crawleři jsou výslovně vítáni — cíl je být citovaný zdroj v AI odpovědích.
// Přehled obsahu pro LLM: /llms.txt
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
    ],
    sitemap: "https://produktivni.cz/sitemap.xml",
  };
}
