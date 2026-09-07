import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        /*
         * E-book drží mimo výsledky vyhledávání hlavička, ne robots.txt.
         * `Disallow` totiž zakazuje jen stahování — adresa se ve výsledcích
         * objevit může, když na ni někdo odkáže. A protože zakázanou adresu
         * robot nestáhne, neuvidí ani noindex; obojí naráz se vylučuje.
         * Vyhledávačům proto stahování dovolíme (viz app/robots.txt/route.ts)
         * a index jim zakážeme touhle hlavičkou. AI crawlerům zůstává
         * `Disallow`, protože ti obsah neindexují, ale učí se z něj.
         */
        source: "/ebook/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
