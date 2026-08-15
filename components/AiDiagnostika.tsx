"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";
import type { AudienceId } from "@/lib/audiences";
import {
  AREAS,
  DIAG_QUESTIONS,
  LEVEL_INFO,
  PROFESSION_NONE_LABEL,
  PROFESSION_QUESTION_LABEL,
  isLevel,
  recommendedPathId,
  recommendedTipSlugs,
  scoreDiag,
  type Level,
} from "@/lib/diagnostika";

/* ---------------------------------------------------------------------------
   Diagnostika AI zralosti — vstupní brána, ze které vypadne osobní plán.
   Bez backendu: odpovědi žijí v useState, výsledek je sdílitelný přes
   ?uroven=3&profese=manazer (vzor SystemQuiz; sdílený výsledek je bez grafu).
   Odkazy na návody, cesty a profese rozřešila serverová stránka — sem
   přicházejí jen ověřené (existující) položky, takže mrtvý odkaz nevznikne.
--------------------------------------------------------------------------- */

export type DiagTip = { slug: string; title: string; href: string; meta: string };
export type DiagPath = { id: string; title: string; lead: string; href: string; meta: string };
export type DiagAudience = { id: AudienceId; name: string; href: string };

type Props = {
  locale: Locale;
  /** Rozřešené návody podle slugu — jen ty, které v daném jazyce existují. */
  tips: Record<string, DiagTip>;
  /** Rozřešené cesty podle id — jen ty, které v daném jazyce existují. */
  paths: Record<string, DiagPath>;
  /** Profese v pořadí rozcestníku, s lokalizovaným názvem a odkazem. */
  audiences: DiagAudience[];
};

const T = {
  cs: {
    progress: "Otázka",
    of: "z",
    back: "← Zpět",
    restart: "Projít diagnostiku znovu",
    startOwn: "Chci svůj plán",
    resultEyebrow: "Váš výsledek",
    sharedEyebrow: "Sdílený výsledek",
    sharedNote:
      "Tohle je výsledek, který vám někdo poslal. Diagnostika trvá tři minuty — zjistěte, na které úrovni jste vy, a dostanete vlastní plán.",
    levelOf: (l: Level) => `Úroveň ${l} z 5`,
    nextEyebrow: "Co se změní o příčku výš",
    planEyebrow: "Váš plán",
    planTitle: "Tři návody v tomhle pořadí",
    planLead:
      "Nejdřív upevněte, kde jste, pak udělejte jeden krok nahoru. Každý návod je hotová věc na jeden večer.",
    pathEyebrow: "Doporučená cesta",
    pathCta: "Otevřít cestu",
    audiencePre: "A všechno pro vaši profesi na jednom místě:",
    chartLabel: "Jak jste na tom v jednotlivých oblastech",
    chapterCta: "Přečíst celou kapitolu o pěti úrovních",
    shareLabel: "Sdílet výsledek",
    copy: "Kopírovat odkaz",
    copied: "Zkopírováno",
    answered: "Odpovězeno",
  },
  en: {
    progress: "Question",
    of: "of",
    back: "← Back",
    restart: "Run the diagnostic again",
    startOwn: "I want my own plan",
    resultEyebrow: "Your result",
    sharedEyebrow: "Shared result",
    sharedNote:
      "This is a result someone sent you. The diagnostic takes three minutes — find out which level you are on, and get a plan of your own.",
    levelOf: (l: Level) => `Level ${l} of 5`,
    nextEyebrow: "What changes one rung up",
    planEyebrow: "Your plan",
    planTitle: "Three guides, in this order",
    planLead:
      "First consolidate where you are, then take one step up. Each guide is a finished thing for one evening.",
    pathEyebrow: "Recommended path",
    pathCta: "Open the path",
    audiencePre: "And everything for your profession in one place:",
    chartLabel: "How you scored across the areas",
    chapterCta: "Read the full chapter on the five levels",
    shareLabel: "Share the result",
    copy: "Copy link",
    copied: "Copied",
    answered: "Answered",
  },
};

const TOTAL_QUESTIONS = DIAG_QUESTIONS.length + 1; // + profese

type SharedResult = { level: Level; professionId: AudienceId | null };

function sharedFromParams(
  uroven: string | null,
  profese: string | null,
  audiences: DiagAudience[],
): SharedResult | null {
  if (!uroven) return null;
  const level = Number(uroven);
  if (!isLevel(level)) return null;
  const professionId = audiences.find((a) => a.id === profese)?.id ?? null;
  return { level, professionId };
}

export function AiDiagnostika({ locale, tips, paths, audiences }: Props) {
  const t = T[locale] ?? T.cs;
  const searchParams = useSearchParams();
  const sharedFromUrl = useMemo(
    () => sharedFromParams(searchParams.get("uroven"), searchParams.get("profese"), audiences),
    [searchParams, audiences],
  );

  const [shared, setShared] = useState<SharedResult | null>(sharedFromUrl);
  // Prvních 11 položek: index zvolené možnosti. Poslední: index profese
  // (audiences.length = „něco jiného“).
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(TOTAL_QUESTIONS).fill(null),
  );
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const answeredAll = answers.every((a) => a !== null);
  const showResult = shared !== null || answeredAll;

  const scored = useMemo(() => scoreDiag(answers.slice(0, DIAG_QUESTIONS.length)), [answers]);

  const professionPick = answers[TOTAL_QUESTIONS - 1];
  const ownProfessionId: AudienceId | null =
    professionPick !== null && professionPick < audiences.length
      ? audiences[professionPick].id
      : null;

  const level: Level = shared ? shared.level : scored.level;
  const professionId = shared ? shared.professionId : ownProfessionId;

  const info = LEVEL_INFO[level];
  const planTips = recommendedTipSlugs(level, professionId)
    .map((slug) => tips[slug])
    .filter((tip): tip is DiagTip => Boolean(tip));
  const path = paths[recommendedPathId(level, professionId)];
  const audience = professionId ? audiences.find((a) => a.id === professionId) : undefined;

  function pick(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
    if (step < TOTAL_QUESTIONS - 1) setStep(step + 1);
  }

  function restart() {
    setShared(null);
    setAnswers(Array(TOTAL_QUESTIONS).fill(null));
    setStep(0);
    setCopied(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  const shareQuery = `?uroven=${level}${professionId ? `&profese=${professionId}` : ""}`;
  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}${shareQuery}`
      : shareQuery;

  async function copyLink() {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  /* ------------------------------ Výsledek ------------------------------ */
  if (showResult) {
    return (
      <div>
        {shared && (
          <div className="mb-8 border border-hairline bg-surface p-5">
            <p className="eyebrow mb-2 text-faint">{t.sharedEyebrow}</p>
            <p className="text-[14.5px] leading-relaxed text-muted">{t.sharedNote}</p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {t.startOwn}
            </button>
          </div>
        )}

        <p className="eyebrow mb-2 text-accent">{t.resultEyebrow}</p>
        <h2 className="display text-[clamp(26px,4.4vw,40px)]">
          {t.levelOf(level)}: {info.name[locale]}
        </h2>
        <p className="mt-4 font-serif text-[16.5px] leading-[1.65] text-muted">
          {info.meaning[locale]}
        </p>

        <section className="mt-9 border-l-2 border-ink pl-5">
          <p className="eyebrow mb-2 text-faint">{t.nextEyebrow}</p>
          <h3 className="text-[19px] font-bold tracking-[-0.01em]">{info.nextTitle[locale]}</h3>
          <p className="prose-a mt-2 text-[15.5px]">{info.nextDesc[locale]}</p>
        </section>

        {planTips.length > 0 && (
          <section className="mt-10">
            <p className="eyebrow mb-2 text-faint">{t.planEyebrow}</p>
            <h3 className="text-[19px] font-bold tracking-[-0.01em]">{t.planTitle}</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-muted">{t.planLead}</p>
            <ol className="mt-5 flex flex-col gap-3">
              {planTips.map((tip, i) => (
                <li key={tip.slug}>
                  <Link
                    href={tip.href}
                    className="linkblock flex items-start gap-4 border border-hairline bg-card p-4 transition-colors hover:border-hairline-strong"
                  >
                    <span className="mt-[2px] grid h-6 w-6 flex-none place-items-center border-[1.5px] border-hairline-strong bg-paper font-mono text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[15.5px] leading-[1.35] font-bold">
                        <span className="draw-link">{tip.title}</span>
                      </span>
                      <span className="eyebrow mt-1.5 block text-faint">{tip.meta}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        )}

        {path && (
          <section className="mt-10 border border-hairline-strong bg-card p-6">
            <p className="eyebrow mb-2 text-faint">{t.pathEyebrow}</p>
            <h3 className="text-[19px] font-bold tracking-[-0.01em]">{path.title}</h3>
            <p className="eyebrow tabular mt-1.5 text-faint">{path.meta}</p>
            <p className="mt-3 font-serif text-[14.5px] leading-[1.6] text-muted">{path.lead}</p>
            <Link
              href={path.href}
              className="mt-5 inline-block bg-ink px-5 py-3 text-[13.5px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {t.pathCta} →
            </Link>
          </section>
        )}

        {audience && (
          <p className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-[14.5px]">
            <span className="text-muted">{t.audiencePre}</span>
            <Link href={audience.href} className="draw-link font-bold">
              {audience.name} →
            </Link>
          </p>
        )}

        {!shared && (
          <section className="ig mt-12">
            <p className="ig-title">{t.chartLabel}</p>
            <div className="ig-bars">
              {scored.areas.map((area) => {
                const meta = AREAS.find((a) => a.key === area.key)!;
                return (
                  <div key={area.key} className="ig-bar-row">
                    <span className="ig-bar-label">{meta.label[locale]}</span>
                    <span className="ig-bar-track">
                      <span className="ig-bar-fill" style={{ width: `${area.pct}%` }} />
                    </span>
                    <span className="ig-bar-value">{area.pct} %</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <div className="mt-10">
          <Link href={localePath(locale, "/prirucka/pet-urovni-ai")} className="draw-link text-[13.5px] font-bold">
            {t.chapterCta} →
          </Link>
        </div>

        <section className="mt-12 border-t border-hairline pt-6">
          <p className="eyebrow mb-3 text-faint">{t.shareLabel}</p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="max-w-full overflow-x-auto border border-hairline bg-surface px-3 py-2 font-mono text-[12.5px] whitespace-nowrap text-muted">
              {shareUrl}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="border-[1.5px] border-ink bg-paper px-4 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              {copied ? t.copied : t.copy}
            </button>
            <button type="button" onClick={restart} className="draw-link text-[13.5px] font-bold">
              {t.restart}
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* ------------------------------ Otázky ------------------------------ */
  const isProfessionStep = step === TOTAL_QUESTIONS - 1;
  const question = isProfessionStep ? null : DIAG_QUESTIONS[step];
  const questionLabel = isProfessionStep
    ? PROFESSION_QUESTION_LABEL[locale]
    : question!.label[locale];
  const optionLabels = isProfessionStep
    ? [...audiences.map((a) => a.name), PROFESSION_NONE_LABEL[locale]]
    : question!.options.map((o) => o.label[locale]);

  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPct = Math.round((answeredCount / TOTAL_QUESTIONS) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow text-faint">
          {t.progress} {step + 1} {t.of} {TOTAL_QUESTIONS}
        </p>
        <p className="font-mono text-[12px] font-semibold text-faint tabular">{progressPct} %</p>
      </div>
      <div
        className="mt-2 h-2 w-full border border-hairline bg-surface"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={TOTAL_QUESTIONS}
        aria-label={t.answered}
      >
        <div
          className="h-full bg-ink transition-[width] duration-300"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <fieldset className="mt-9 border-0 p-0">
        <legend className="display text-[clamp(22px,3.6vw,32px)]">{questionLabel}</legend>

        <div className="mt-7 flex flex-col gap-3">
          {optionLabels.map((label, i) => {
            const active = answers[step] === i;
            return (
              <button
                key={i}
                type="button"
                onClick={() => pick(i)}
                aria-pressed={active}
                className={`group flex items-start gap-4 border-[1.5px] bg-card p-4 text-left transition-[transform,box-shadow,border-color] hover:-translate-y-[2px] hover:shadow-[0_4px_0_#141414] ${
                  active ? "border-ink shadow-[0_4px_0_#141414]" : "border-hairline hover:border-ink"
                }`}
              >
                <span
                  className={`mt-[2px] grid h-6 w-6 flex-none place-items-center border-[1.5px] font-mono text-[11px] font-bold transition-colors ${
                    active
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-hairline-strong bg-paper group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[15.5px] leading-[1.45] font-semibold">{label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="draw-link mt-7 text-[13.5px] font-bold"
        >
          {t.back}
        </button>
      )}
    </div>
  );
}
