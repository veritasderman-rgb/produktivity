"use client";

/* Klientská vrstva infografik — čistě vizuální vylepšení po hydrataci.
   Server (a no-JS, tisk, llms-full.txt, reduced-motion) vždy renderuje plné
   hodnoty; tady se jen po vjezdu do viewportu přehraje animace:
   - <StatValue>  — číselná část hodnoty naběhne od nuly (rAF, přímé psaní
     do textContent přes ref; žádný setState → žádný re-render, žádný konflikt
     s pravidlem react-hooks/set-state-in-effect),
   - <FlowList>   — <ol> dostane třídu .ig-in, CSS keyframes pak postupně
     rozsvítí kroky a „dokreslí" šipky (viz globals.css). */

import { Fragment, useEffect, useMemo, useRef, type ReactNode } from "react";

/** Délka náběhu počítadla. */
const COUNT_MS = 800;

const NUM_RE = /\d+(?:[.,]\d+)?/g;
const LETTER_RE = /\p{L}/u;

type NumSeg = { kind: "num"; text: string; target: number; decimals: number; sep: string };
type TextSeg = { kind: "text"; text: string };
type Seg = NumSeg | TextSeg;

/**
 * Rozřeže hodnotu na statický text a animovatelná čísla: „~30 min" → „~", 30,
 * „ min". Číslo přilepené k písmenu („2FA") není veličina — zůstává statické.
 * Desetinná čárka i tečka se zachovávají („2,5" naběhne jako 0,0 → 2,5).
 */
function parseValue(value: string): Seg[] {
  const segs: Seg[] = [];
  let last = 0;
  for (const m of value.matchAll(NUM_RE)) {
    const start = m.index;
    const raw = m[0];
    const before = value[start - 1];
    const after = value[start + raw.length];
    if (start > last) segs.push({ kind: "text", text: value.slice(last, start) });
    if ((before && LETTER_RE.test(before)) || (after && LETTER_RE.test(after))) {
      segs.push({ kind: "text", text: raw });
    } else {
      const sepIdx = raw.search(/[.,]/);
      const sep = sepIdx === -1 ? "" : raw[sepIdx];
      const decimals = sep ? raw.length - sepIdx - 1 : 0;
      segs.push({ kind: "num", text: raw, target: Number(raw.replace(",", ".")), decimals, sep });
    }
    last = start + raw.length;
  }
  if (last < value.length) segs.push({ kind: "text", text: value.slice(last) });
  return segs;
}

function formatAt(seg: NumSeg, k: number): string {
  const n = seg.target * k;
  return seg.decimals ? n.toFixed(seg.decimals).replace(".", seg.sep) : String(Math.round(n));
}

/**
 * Hodnota statistiky s počítadlem. SSR i první paint ukazují plnou hodnotu;
 * po vjezdu do viewportu čísla naběhnou od nuly (~800 ms, ease-out kubická).
 * Hodnoty bez čísla („ano") se nemění vůbec.
 */
export function StatValue({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const segs = useMemo(() => parseValue(value), [value]);
  const hasNum = segs.some((s) => s.kind === "num");

  useEffect(() => {
    const el = ref.current;
    if (!hasNum || !el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Už odscrollováno nad viewport — nechat plnou hodnotu, nic nepřehrávat.
    if (el.getBoundingClientRect().bottom < 0) return;

    const nums = segs.filter((s): s is NumSeg => s.kind === "num");
    const spans = Array.from(el.querySelectorAll<HTMLElement>("[data-ig-num]"));
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / COUNT_MS, 1);
          const k = 1 - (1 - p) ** 3; // ease-out cubic
          spans.forEach((s, i) => {
            s.textContent = formatAt(nums[i], k);
          });
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.5 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      // Při unmountu / přerušení nesmí zůstat mezistav — vrátit plnou hodnotu.
      spans.forEach((s, i) => {
        s.textContent = nums[i].text;
      });
    };
  }, [segs, hasNum]);

  return (
    <span ref={ref} className="ig-stat-value tabular">
      {segs.map((s, i) =>
        s.kind === "num" ? (
          <span key={i} data-ig-num>
            {s.text}
          </span>
        ) : (
          <Fragment key={i}>{s.text}</Fragment>
        ),
      )}
    </span>
  );
}

/**
 * Obal kroků <Flow>: po vjezdu do viewportu přidá <ol> třídu .ig-in — CSS
 * animace (globals.css) pak kroky postupně rozsvítí a dokreslí šipky.
 * Bez třídy je vše viditelné, takže SSR/no-JS/tisk nic neskrývá.
 */
export function FlowList({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().bottom < 0) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.classList.add("ig-in");
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ol ref={ref} className="ig-flow">
      {children}
    </ol>
  );
}
