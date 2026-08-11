import Link from "next/link";
import type { Tip } from "@/lib/tips";

const categoryLabels: Record<string, string> = {
  zkratky: "Zkratky",
  aplikace: "Aplikace",
  ai: "AI",
  workflow: "Workflow",
  komunikace: "Komunikace",
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
    <article className="tipcard">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="eyebrow text-faint">
          {categoryLabels[tip.category] ?? tip.category} · {platformLabels[tip.platform] ?? tip.platform}
        </span>
        <span className="tipcard-no tabular">{String(index).padStart(3, "0")}</span>
      </div>
      <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">
        <Link href={`/tipy/${tip.slug}`} className="draw-link">
          {tip.title}
        </Link>
      </h3>
      {tip.keys.length > 0 && (
        <p className="mt-3.5">
          {tip.keys[0].map((k, i) => (
            <span key={k + i}>
              {i > 0 && <span className="mx-1 text-faint">+</span>}
              <kbd className="key">{k}</kbd>
            </span>
          ))}
        </p>
      )}
      <p className="mt-3 grow font-serif text-[14.5px] leading-[1.6] text-muted">{tip.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <Link href={`/tipy/${tip.slug}`} className="draw-link text-[13.5px] font-bold">
          Číst celý tip
        </Link>
        <span className="eyebrow text-faint">{tip.saves}</span>
      </div>
    </article>
  );
}
