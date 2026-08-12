import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllTips } from "@/lib/tips";
import { TipBrowser } from "@/components/TipBrowser";

export const metadata: Metadata = {
  title: "Tipy & triky",
  description:
    "Krátké, okamžitě použitelné tipy: klávesové zkratky, aplikace, workflow a AI triky. Filtrujte podle platformy, kategorie i toho, kdo jste.",
};

export default function TipsPage() {
  const tips = getAllTips();
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">
        {tips.length} tipů · průběžně přibývají
      </p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">Tipy &amp; triky</h1>
      <p className="mt-4 mb-8 max-w-[56ch] text-[16px] leading-relaxed text-muted">
        Každý tip = jedna konkrétní věc, kterou uděláte líp nebo rychleji.
        Filtrujte podle toho, co používáte a kdo jste — nebo prostě hledejte.
      </p>
      <Suspense>
        <TipBrowser tips={tips} />
      </Suspense>
    </div>
  );
}
