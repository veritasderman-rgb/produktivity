import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllNews, getNewsItem } from "@/lib/news";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { NewsletterForm } from "@/components/NewsletterForm";

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const n = getNewsItem(slug);
  if (!n) return {};
  return { title: n.title, description: n.excerpt };
}

const mdxComponents = {
  kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
  Stats,
  Timeline,
  Bars,
  Matrix,
  Flow,
  Donut,
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = getNewsItem(slug);
  if (!n) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-4 text-faint">
        <Link href="/ai" className="hover:underline">AI &amp; produktivita</Link>
        {" · "}
        {formatDate(n.date)} · {n.minutes} min čtení
      </p>
      <h1 className="display text-[clamp(26px,4.5vw,42px)]" style={{ textTransform: "none" }}>
        {n.title}
      </h1>
      <p className="mt-4 border-b border-hairline pb-6 text-[17px] leading-relaxed text-muted">
        {n.excerpt}
      </p>
      <div className="prose-a mt-6">
        {/* blockJS: false — obsah je náš vlastní z repa */}
        <MDXRemote source={n.body} components={mdxComponents} options={{ blockJS: false }} />
      </div>
      {n.source && (
        <p className="mt-8 border-t border-hairline pt-4 text-[13.5px] text-faint">
          Zdroj:{" "}
          <a href={n.source} className="border-b border-accent font-semibold text-muted hover:text-accent" rel="noopener noreferrer" target="_blank">
            {n.sourceName ?? new URL(n.source).hostname}
          </a>
        </p>
      )}
      <div className="mt-12">
        <p className="eyebrow mb-2 text-faint">AI novinky každý týden</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">
          To podstatné ze světa AI a produktivity v týdenním newsletteru.
        </p>
        <div className="max-w-md">
          <NewsletterForm source={`ai-${n.slug}`} />
        </div>
      </div>
    </article>
  );
}
