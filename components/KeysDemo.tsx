"use client";

import { useEffect, useRef } from "react";

/**
 * Klávesy zkratky, které se „samy mačkají". Server i první render klienta
 * kreslí přesně stejný statický markup jako dřív (žádný hydration mismatch) —
 * animace se dělá až po hydrataci přes classList na DOM uzlech, žádný React
 * state (a tedy ani react-hooks/set-state-in-effect).
 *
 * Pořadí mačkání kopíruje logiku zkratky:
 * - kombinace s modifikátory (Ctrl/Cmd/Alt/…): modifikátory se postupně
 *   zmáčknou a DRŽÍ, pak ťukne poslední klávesa, pak se vše pustí najednou;
 * - sekvence bez modifikátorů (např. dvojité zmáčknutí): klávesy ťukají
 *   postupně jedna po druhé;
 * - více kombinací (varianty zkratky) se předvádí za sebou s mezerou.
 *
 * Smyčka: celá sekvence → 2,5 s pauza → znovu. Běží jen ve viewportu
 * (IntersectionObserver) a jen bez prefers-reduced-motion.
 */

const MODIFIER_RE = /^(ctrl|control|strg|cmd|command|⌘|alt|option|⌥|shift|⇧|win|windows|⊞|fn|meta|super)$/i;

type Interval = { down: number; up: number };

/** Ms mezi koncem sekvence a dalším kolem smyčky. */
const LOOP_PAUSE = 2500;

/** Časová osa stisků: pro každou klávesu (v pořadí flat) intervaly „je dole". */
function buildTimeline(combos: string[][]): { intervals: Interval[][]; total: number } {
  const intervals: Interval[][] = combos.flat().map(() => []);
  let t = 400; // krátký nádech po vjezdu do viewportu
  let flat = 0;
  for (const combo of combos) {
    const holds = combo.length > 1 && combo.slice(0, -1).every((k) => MODIFIER_RE.test(k));
    if (holds) {
      // modifikátory dolů postupně a drží…
      const downs = combo.slice(0, -1).map((_, i) => t + i * 200);
      t = downs[downs.length - 1] + 260;
      const finalDown = t; // …ťukne poslední klávesa…
      t += 280;
      const allUp = t; // …a vše se pustí najednou
      combo.forEach((_, i) => {
        intervals[flat + i].push(i < combo.length - 1 ? { down: downs[i], up: allUp } : { down: finalDown, up: allUp });
      });
      t += 200;
    } else {
      // sekvence: ťuk, ťuk, ťuk
      for (let i = 0; i < combo.length; i++) {
        intervals[flat + i].push({ down: t, up: t + 170 });
        t += 340;
      }
    }
    flat += combo.length;
    t += 650; // mezera mezi variantami zkratky
  }
  return { intervals, total: t - 650 + LOOP_PAUSE };
}

export function KeysDemo({ keys }: { keys: string[][] }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const caps = Array.from(root.querySelectorAll<HTMLElement>(".key"));
    if (caps.length === 0) return;
    const { intervals, total } = buildTimeline(keys);

    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const e = (now - start) % total;
      caps.forEach((el, i) => {
        el.classList.toggle("is-down", intervals[i].some((iv) => e >= iv.down && e < iv.up));
      });
      raf = requestAnimationFrame(tick);
    };
    const reset = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      caps.forEach((el) => el.classList.remove("is-down"));
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!raf) {
            start = 0; // po návratu do viewportu jede sekvence od začátku
            raf = requestAnimationFrame(tick);
          }
        } else {
          reset();
        }
      },
      { threshold: 0.6 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      reset();
    };
  }, [keys]);

  return (
    <p ref={ref} className="keys-demo mt-6 border-y border-hairline py-4 text-[18px]">
      {keys.map((combo, ci) => (
        <span key={ci} className="mr-6 inline-block">
          {combo.map((k, i) => (
            <span key={k + i}>
              {i > 0 && <span className="mx-1.5 text-faint">+</span>}
              <kbd className="key">{k}</kbd>
            </span>
          ))}
        </span>
      ))}
    </p>
  );
}
