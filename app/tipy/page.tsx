import type { Metadata } from "next";
import { getAllTips } from "@/lib/tips";
import { TipCard } from "@/components/TipCard";

export const metadata: Metadata = {
  title: "Tipy & triky",
  description:
    "Krátké, okamžitě použitelné tipy: klávesové zkratky, aplikace, workflow a AI triky, které šetří čas každý den.",
};

export default function TipsPage() {
  const tips = getAllTips();
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-accent">
        {tips.length} tipů · průběžně přibývají
      </p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">Tipy &amp; triky</h1>
      <p className="mt-4 max-w-[56ch] text-[16px] leading-relaxed text-muted">
        Každý tip = jedna konkrétní věc, kterou uděláte líp nebo rychleji. Žádná
        teorie — přečtete za minutu, používáte navždy.
      </p>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {tips.map((tip, i) => (
          <TipCard key={tip.slug} tip={tip} index={tips.length - i} />
        ))}
      </div>
    </div>
  );
}
