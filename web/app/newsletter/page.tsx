import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Newsletter",
  description:
    "Jeden produktivní tip týdně do e-mailu. Dvě minuty čtení, hodiny úspor. Žádný spam.",
};

export default function NewsletterPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="max-w-2xl">
        <p className="eyebrow mb-2 text-blue">Každý čtvrtek ráno</p>
        <h1 className="display text-[clamp(30px,5vw,48px)]">Jeden tip týdně</h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-muted">
          Krátký e-mail s tím nejlepším z týdne: jeden tip do hloubky, pár odkazů
          za pozornost a občas AI novinka, která stojí za vyzkoušení. Přečtete za
          dvě minuty u kafe.
        </p>
        <ul className="mt-6 mb-8 space-y-2 text-[15px] font-semibold">
          <li className="flex gap-3"><span className="text-blue" aria-hidden="true">→</span> Žádný spam, žádné „akční nabídky"</li>
          <li className="flex gap-3"><span className="text-blue" aria-hidden="true">→</span> Odhlášení jedním klikem, kdykoli</li>
          <li className="flex gap-3"><span className="text-blue" aria-hidden="true">→</span> Bonus po přihlášení: připravujeme e-book <strong>Top 30 tipů</strong></li>
        </ul>
        <div className="max-w-md">
          <NewsletterForm source="newsletter-page" />
        </div>
      </div>
    </div>
  );
}
