import type { Metadata } from "next";
import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";
import { SearchAll, type SearchDoc } from "@/components/SearchAll";

export const metadata: Metadata = {
  title: "Hledat",
  description: "Fulltextové hledání napříč příručkou, tipy a AI novinkami.",
};

export default function SearchPage() {
  const docs: SearchDoc[] = [
    ...getAllChapters().map((c) => ({
      type: "kapitola" as const,
      slug: c.slug,
      title: c.title,
      excerpt: c.excerpt,
    })),
    ...getAllTips().map((t) => ({
      type: "tip" as const,
      slug: t.slug,
      title: t.title,
      excerpt: t.excerpt,
    })),
    ...getAllNews().map((n) => ({
      type: "ai" as const,
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
    })),
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{docs.length} položek obsahu</p>
      <h1 className="display mb-8 text-[clamp(30px,5vw,48px)]">Hledat</h1>
      <SearchAll docs={docs} />
    </div>
  );
}
