import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllChapters, getChapter, sectionLabels } from "@/lib/chapters";
import { Stats, Timeline, Bars, Matrix, Flow, Donut } from "@/components/infographics";
import { NewsletterForm } from "@/components/NewsletterForm";

export function generateStaticParams() {
  return getAllChapters().map((ch) => ({ slug: ch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ch = getChapter(slug);
  if (!ch) return {};
  return { title: ch.title, description: ch.excerpt };
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

function heroImage(slug: string): string | null {
  const file = path.join(process.cwd(), "public", "img", "prirucka", `${slug}.webp`);
  return fs.existsSync(file) ? `/img/prirucka/${slug}.webp` : null;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ch = getChapter(slug);
  if (!ch) notFound();

  const chapters = getAllChapters();
  const idx = chapters.findIndex((c) => c.slug === ch.slug);
  const prev = chapters[idx - 1];
  const next = chapters[idx + 1];
  const hero = heroImage(ch.slug);

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-4 text-faint">
        <Link href="/prirucka" className="hover:underline">Příručka</Link>
        {" · "}
        {sectionLabels[ch.section]} · {ch.minutes} min čtení
      </p>
      <h1 className="display text-[clamp(28px,4.5vw,44px)]" style={{ textTransform: "none" }}>
        {ch.title}
      </h1>
      <p className="mt-4 border-b border-hairline pb-6 text-[17px] leading-relaxed text-muted">
        {ch.excerpt}
      </p>
      {hero && (
        <Image
          src={hero}
          alt=""
          width={1280}
          height={720}
          className="mt-8 w-full border border-hairline-strong"
          priority
        />
      )}
      <div className="prose-a mt-6">
        {/* blockJS: false — obsah je náš vlastní z repa; výrazy v props infografik jsou nutné */}
        <MDXRemote source={ch.body} components={mdxComponents} options={{ blockJS: false }} />
      </div>

      <nav className="mt-14 grid gap-3 border-t-2 border-hairline-strong pt-6 sm:grid-cols-2" aria-label="Další kapitoly">
        {prev ? (
          <Link href={`/prirucka/${prev.slug}`} className="group border border-hairline bg-card p-4 hover:border-accent">
            <span className="eyebrow text-faint">← Předchozí</span>
            <span className="mt-1 block text-[14.5px] font-bold group-hover:text-accent">{prev.title}</span>
          </Link>
        ) : <span />}
        {next && (
          <Link href={`/prirucka/${next.slug}`} className="group border border-hairline bg-card p-4 text-right hover:border-accent">
            <span className="eyebrow text-faint">Další →</span>
            <span className="mt-1 block text-[14.5px] font-bold group-hover:text-accent">{next.title}</span>
          </Link>
        )}
      </nav>

      <div className="mt-12">
        <p className="eyebrow mb-2 text-faint">Chcete pokračovat v tempu?</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">
          Každý týden jeden tip z příručky do e-mailu — v pořadí, které dává smysl.
        </p>
        <div className="max-w-md">
          <NewsletterForm source={`kapitola-${ch.slug}`} />
        </div>
      </div>
    </article>
  );
}
