import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PiratiSurvey } from "@/components/PiratiSurvey";

// Vstupní dotazník ke školení AI pro poslanecký klub Pirátů. Jen česky a mimo
// vyhledávače — odkaz dostávají účastníci přímo, v sitemapě ani menu není.

export const metadata: Metadata = {
  title: "Školení AI pro poslanecký klub Pirátů — vstupní dotazník",
  description:
    "Krátký dotazník před školením AI: jak dnes AI používáte, co vám bere čas a co si chcete odnést. Na konci dostanete e-mailem doporučené materiály.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://www.produktivni.cz/skoleni/pirati" },
};

export default async function PiratiSurveyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "cs") notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">Školení AI · Poslanecký klub Pirátů</p>
      <h1 className="display text-[clamp(30px,5vw,46px)]">Než se uvidíme na školení</h1>
      <p className="mt-5 max-w-[60ch] text-[16.5px] leading-relaxed text-muted">
        Čtrnáct otázek, zhruba deset minut. Podle odpovědí ušiju školení na to, co opravdu děláte — ne na
        obecné ukázky. Pište konkrétně, správné ani špatné odpovědi tu nejsou.
      </p>
      <p className="mt-3 max-w-[60ch] text-[15px] leading-relaxed text-muted">
        Hned po odeslání vám přijde e-mail s výběrem materiálů z{" "}
        <strong className="text-ink">Produktivní.cz</strong>, které se hodí k vašim odpovědím.
      </p>

      <div className="mt-12">
        <PiratiSurvey />
      </div>
    </div>
  );
}
