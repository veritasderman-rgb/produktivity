import type { Metadata } from "next";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "AI & produktivita",
  description:
    "Novinky ze světa AI nástrojů přeložené do praxe: co umí, co to znamená pro vaši práci a jak to nasadit ještě dnes.",
};

export default function AiPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-accent">Připravujeme</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">AI &amp; produktivita</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        AI mění pravidla produktivity rychleji, než stíháme číst. Tahle sekce bude
        novinky <strong className="text-ink">překládat do praxe</strong>: co nový nástroj či
        funkce umí, co to znamená pro vaši práci a jak to zapojit ještě dnes. Obsah
        bude vznikat kombinací automatizovaného sběru novinek a lidské redakce.
      </p>
      <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
        <p className="eyebrow mb-2 text-accent">Nenechte si ujít start</p>
        <p className="mb-5 text-[14.5px] text-muted">
          Přihlaste se k odběru — první AI přehled pošleme, jakmile sekce odstartuje.
        </p>
        <NewsletterForm source="ai-cekarna" />
      </div>
    </div>
  );
}
