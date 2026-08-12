import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "Začněte tady: minimalistický průvodce produktivitou",
  description:
    "Jeden notes, tři značky, čtyři minuty denně. Nejjednodušší funkční systém produktivity — a checklisty pro první měsíc.",
};

const marks = [
  { mark: "•", label: "úkol" },
  { mark: "×", label: "hotovo" },
  { mark: ">", label: "přesunuto" },
  { mark: "–", label: "poznámka" },
  { mark: "!", label: "důležité" },
  { mark: "?", label: "otázka" },
];

const checklists = [
  {
    title: "První týden: základ",
    items: [
      "Vypsat všechny současné úkoly a projekty na jedno místo",
      "Vybrat JEDEN nástroj (notes / Apple Notes / Google Keep / Notion)",
      "Vyčistit pracovní stůl a vypnout zbytečné notifikace",
      "Každé ráno 2 minuty: nová stránka, datum, úkoly dne",
      "Každý večer 2 minuty: označit hotové, přesunout zbytek",
    ],
  },
  {
    title: "Týdny 2–4: systém",
    items: [
      "Vytvořit inbox a základní kategorie projektů (GTD)",
      "Najít své produktivní hodiny a zablokovat 1 deep work blok denně",
      "Definovat kontexty (@doma, @práce, @počítač)",
      "Naplánovat týdenní revizi (30 minut, pevný čas)",
      "Připravit prostředí pro soustředění: rituál, playlist, čistý stůl",
    ],
  },
  {
    title: "Každý měsíc: údržba",
    items: [
      "Audit systému: co funguje, co drhne, co zjednodušit",
      "Revize projektů a dlouhodobých cílů, přehodnocení priorit",
      "Automatizovat jednu rutinní věc (filtry, šablony, zkratky)",
    ],
  },
];

export default function StartPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">Začněte tady</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">
        Jeden notes.<br />Tři značky. Čtyři minuty denně.
      </h1>
      <div className="prose-a mt-6">
        <p>
          Problém většiny lidí není, že by měli málo nástrojů — mají jich <strong>příliš mnoho</strong>.
          Poznámky v telefonu, úkoly v aplikaci, termíny v kalendáři, nápady na lístečcích.
          A v té složitosti se ztrácí to nejdůležitější: schopnost zachytit a zpracovat, co den přináší.
        </p>
        <p>
          Tenhle průvodce je opak. Jeden notes (nebo jedna aplikace, kterou už v telefonu máte)
          a princip, který se naučíte za minutu: <strong>cokoli přijde do hlavy, okamžitě zapište.</strong>{" "}
          Mozek není stavěný na skladování úkolů — je stavěný na jejich vytváření a řešení.
        </p>
      </div>

      <h2 className="display mt-12 mb-4 text-[clamp(20px,3vw,28px)]">Značky</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {marks.map((m) => (
          <div key={m.mark} className="border border-hairline-strong bg-card p-3 text-center">
            <span className="block font-mono text-[22px] font-bold text-ink">{m.mark}</span>
            <span className="eyebrow text-faint">{m.label}</span>
          </div>
        ))}
      </div>

      <h2 className="display mt-12 mb-4 text-[clamp(20px,3vw,28px)]">Denní rytmus</h2>
      <div className="prose-a">
        <ul>
          <li><strong>Ráno (2 minuty):</strong> nová stránka, datum, přepsat nedodělky ze včerejška, přidat dnešní úkoly.</li>
          <li><strong>Během dne:</strong> zapisovat vše IHNED. Žádné lístečky, žádné „pak si to zapíšu". I drobnosti, i nápady, které se zdají hloupé, i věci, které si „určitě zapamatujete".</li>
          <li><strong>Večer (2 minuty):</strong> označit hotové (×), přesunout nedokončené na zítřek (&gt;), zkontrolovat, že nic nechybí.</li>
        </ul>
        <p>
          A když se systém zhroutí (stane se): zastavte se, vypište <em>všechno</em> z hlavy,
          označte tři nejdůležitější věci — a začněte znovu. Bez výčitek.
        </p>
      </div>

      <h2 className="display mt-12 mb-4 text-[clamp(20px,3vw,28px)]">Checklisty pro první měsíc</h2>
      <div className="grid gap-4">
        {checklists.map((c) => (
          <section key={c.title} className="border border-hairline-strong bg-card p-5">
            <h3 className="mb-3 text-[16px] font-bold">{c.title}</h3>
            <ul className="space-y-2">
              {c.items.map((item) => (
                <li key={item} className="flex gap-3 text-[14.5px] text-muted">
                  <span className="mt-0.5 inline-block h-[16px] w-[16px] flex-none border-[1.5px] border-hairline-strong bg-paper" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="prose-a mt-10">
        <p>
          <strong>Tři pravidla na závěr:</strong> jednoduchý systém, který používáte, porazí dokonalý
          systém, který je složitý. Jeden notes všude porazí deset aplikací. Psát hned porazí
          pamatovat si na později.
        </p>
        <p>
          Až vám tenhle základ přiroste k ruce, pokračujte{" "}
          <Link href="/prirucka">příručkou</Link> — kapitoly na sebe navazují přesně v tomhle pořadí.
        </p>
      </div>

      <div className="mt-12 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">Jeden tip týdně</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">
          Newsletter vás provede příručkou v rozumném tempu — a hned dostanete e-book Top 30 tipů.
        </p>
        <div className="max-w-md">
          <NewsletterForm source="start" />
        </div>
      </div>
    </div>
  );
}
