import type { MetadataRoute } from "next";

// AI crawleři jsou vítáni — obsah webu má být nalezitelný i v AI odpovědích.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
    ],
    sitemap: "https://produktivni.cz/sitemap.xml",
  };
}
