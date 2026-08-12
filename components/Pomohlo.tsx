"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import type { Locale } from "@/lib/i18n";

const T = {
  cs: {
    question: "Pomohlo vám to?",
    yes: "Ano, pomohlo",
    no: "Ne, nepomohlo",
    thanks: "Díky za zpětnou vazbu.",
  },
  en: {
    question: "Was this helpful?",
    yes: "Yes, it helped",
    no: "No, it didn't",
    thanks: "Thanks for the feedback.",
  },
};

/** Anonymní palec nahoru/dolů na konci článku. Bez backendu — jen událost v analytice. */
export function Pomohlo({ slug, locale = "cs" }: { slug: string; locale?: Locale }) {
  const t = T[locale] ?? T.cs;
  const [voted, setVoted] = useState(false);

  const vote = (value: "up" | "down") => {
    track("tip-feedback", { slug, vote: value });
    setVoted(true);
  };

  return (
    <div className="mt-14 border-t border-hairline pt-6">
      {voted ? (
        <p className="eyebrow text-accent" role="status">
          {t.thanks}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-4">
          <p className="eyebrow text-faint">{t.question}</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => vote("up")}
              aria-label={t.yes}
              title={t.yes}
              className="border border-hairline bg-paper px-3.5 py-1.5 text-[16px] leading-none transition-colors hover:border-accent"
            >
              👍
            </button>
            <button
              type="button"
              onClick={() => vote("down")}
              aria-label={t.no}
              title={t.no}
              className="border border-hairline bg-paper px-3.5 py-1.5 text-[16px] leading-none transition-colors hover:border-accent"
            >
              👎
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
