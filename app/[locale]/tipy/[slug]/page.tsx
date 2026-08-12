import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllTips, getTip } from "@/lib/tips";
import { NewsletterForm } from "@/components/NewsletterForm";
import { DataDisclaimer } from "@/components/DataDisclaimer";
import { TipCard } from "@/components/TipCard";
import { chapterForTip, relatedTips } from "@/lib/related";

export function generateStaticParams() {
  return getAllTips().map((tip) => ({ slug: tip.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tip = getTip(slug);
  if (!tip) return {};
  return {
    title: tip.title,
    description: tip.excerpt,
    openGraph: {
      title: tip.title,
      description: tip.excerpt,
      images: [`/api/og?title=${encodeURIComponent(tip.title)}&label=${encodeURIComponent("produktivni.cz · tip")}`],
    },
  };
}

const mdxComponents = {
  kbd: (props: React.HTMLAttributes<HTMLElement>) => <kbd className="key" {...props} />,
};

export default async function TipDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tip = getTip(slug);
  if (!tip) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-4 text-faint">
        <Link href="/tipy" className="hover:underline">Tipy &amp; triky</Link>
        {" · "}
        {tip.category} · {tip.platform} · {tip.saves}
      </p>
      <h1 className="display text-[clamp(26px,4.5vw,42px)] normal-case" style={{ textTransform: "none" }}>
        {tip.title}
      </h1>
      {tip.keys.length > 0 && (
        <p className="mt-6 border-y border-hairline py-4 text-[18px]">
          {tip.keys.map((combo, ci) => (
            <span key={ci} className="mr-6 inline-block">
              {combo.map((k, i) => (
                <span key={k + i}>
                  {i > 0 && <span className="mx-1.5 text-faint">+</span>}
                  <kbd className="key">{k}</kbd>
                </span>
              ))}
            </span>
          ))}
        </p>
      )}
      <div className="prose-a mt-6">
        <MDXRemote source={tip.body} components={mdxComponents} />
      </div>
      {tip.category === "ai" && <DataDisclaimer />}
      {(() => {
        const ch = chapterForTip(tip);
        return ch ? (
          <p className="mt-10 border border-hairline bg-surface p-4 text-[14px] text-muted">
            Chcete jít do hloubky? V příručce najdete kapitolu{" "}
            <Link href={`/prirucka/${ch.slug}`} className="draw-link font-bold text-ink">
              {ch.title}
            </Link>
            .
          </p>
        ) : null;
      })()}
      {(() => {
        const rel = relatedTips(tip, getAllTips());
        return rel.length > 0 ? (
          <div className="mt-12">
            <p className="eyebrow mb-4 text-faint">Podobné tipy</p>
            <div className="grid gap-5 sm:grid-cols-3">
              {rel.map((t, i) => (
                <TipCard key={t.slug} tip={t} index={i + 1} />
              ))}
            </div>
          </div>
        ) : null;
      })()}
      <div className="mt-14 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">Líbil se vám tip?</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">
          Každý týden posílám jeden takový do e-mailu. Dvě minuty čtení, hodiny úspor.
        </p>
        <div className="max-w-md">
          <NewsletterForm source={`tip-${tip.slug}`} />
        </div>
      </div>
    </article>
  );
}
