import Link from "next/link";
import type { Tip } from "@/lib/tips";

const categoryLabels: Record<string, string> = {
  zkratky: "Zkratky",
  aplikace: "Aplikace",
  ai: "AI",
  workflow: "Workflow",
  hardware: "Vybavení",
};

const platformLabels: Record<string, string> = {
  windows: "Windows",
  mac: "Mac",
  vsude: "Všude",
  prohlizec: "Prohlížeč",
  mobil: "Mobil",
};

export function TipCard({ tip, index }: { tip: Tip; index: number }) {
  return (
    <article className="flex flex-col border border-hairline-strong bg-card p-5">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="eyebrow text-accent">
          {categoryLabels[tip.category] ?? tip.category} · {platformLabels[tip.platform] ?? tip.platform}
        </span>
        <span className="tabular text-[24px] font-extrabold text-hairline" style={{ fontStretch: "120%" }}>
          {String(index).padStart(3, "0")}
        </span>
      </div>
      <h3 className="text-[16.5px] leading-snug font-bold">
        <Link href={`/tipy/${tip.slug}`} className="hover:text-accent">
          {tip.title}
        </Link>
      </h3>
      {tip.keys.length > 0 && (
        <p className="mt-3">
          {tip.keys[0].map((k, i) => (
            <span key={k + i}>
              {i > 0 && <span className="mx-1 text-faint">+</span>}
              <kbd className="key">{k}</kbd>
            </span>
          ))}
        </p>
      )}
      <p className="mt-3 grow text-[14px] leading-relaxed text-muted">{tip.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <Link
          href={`/tipy/${tip.slug}`}
          className="border-b-2 border-accent pb-0.5 text-[13px] font-bold hover:text-accent"
        >
          Číst celý tip
        </Link>
        <span className="eyebrow text-faint">{tip.saves}</span>
      </div>
    </article>
  );
}
