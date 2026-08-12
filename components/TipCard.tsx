import Link from "next/link";
import type { Tip } from "@/lib/tips";
import { getDict, localePath, type Locale } from "@/lib/i18n";

export function TipCard({ tip, index, locale = "cs" }: { tip: Tip; index: number; locale?: Locale }) {
  const t = getDict(locale).tipCard;
  const href = localePath(locale, `/tipy/${tip.slug}`);
  return (
    <article className="tipcard">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <span className="eyebrow text-faint">
          {t.categories[tip.category] ?? tip.category} · {t.platforms[tip.platform] ?? tip.platform}
        </span>
        <span className="tipcard-no tabular">{String(index).padStart(3, "0")}</span>
      </div>
      {tip.isMega && (
        <p className="mb-2.5">
          <span className="mega-badge">
            {t.megaBadge} · {tip.minutes} {t.minShort}
          </span>
        </p>
      )}
      <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">
        <Link href={href} className="draw-link">
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
        <Link href={href} className="draw-link text-[13.5px] font-bold">
          {t.read}
        </Link>
        <span className="eyebrow text-faint">
          {tip.saves}
          {!tip.isMega && ` · ${tip.minutes} ${t.minShort}`}
        </span>
      </div>
    </article>
  );
}
