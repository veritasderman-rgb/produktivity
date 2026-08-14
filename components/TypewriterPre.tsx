"use client";

import { useEffect, useRef } from "react";

/**
 * Psací efekt pro první ```text blok článku. Skutečný <pre> s plným textem
 * je v DOM od začátku (SEO, tlačítko „zkopírovat" v CopyPre čte právě jeho
 * textContent) — efekt je čistě vizuální: přes blok se položí neprůhledný
 * overlay, do kterého se „napíše" prvních ~80 znaků, pak overlay zmizí
 * a zbytek textu se ukáže najednou.
 *
 * Žádný React state (lint react-hooks/set-state-in-effect): overlay je
 * v markupu vždy, ale schovaný; JS ho po hydrataci ukáže třídou is-typing
 * a píše přímo do textContent přes requestAnimationFrame. Server render
 * je tedy plný statický text — žádný hydration mismatch.
 *
 * Jede jednou při vjezdu do viewportu, pak už nikdy. Při
 * prefers-reduced-motion se nespustí vůbec.
 */
export function TypewriterPre({
  children,
  chars = 80,
  cps = 25,
}: {
  children: React.ReactNode;
  /** Kolik znaků od začátku se „napíše". */
  chars?: number;
  /** Rychlost psaní ve znacích za sekundu. */
  cps?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const outRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const out = outRef.current;
    if (!wrap || !out) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let played = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || played) return;
        played = true;
        io.disconnect();

        const full = wrap.querySelector("pre")?.textContent ?? "";
        const head = full.slice(0, chars);
        if (!head) return;
        wrap.classList.add("is-typing");
        const t0 = performance.now();
        const step = (now: number) => {
          const n = Math.min(head.length, Math.floor(((now - t0) / 1000) * cps));
          out.textContent = head.slice(0, n);
          if (n < head.length) {
            raf = requestAnimationFrame(step);
          } else {
            // krátká pauza s kurzorem, pak se ukáže celý text najednou
            timer = setTimeout(() => wrap.classList.remove("is-typing"), 400);
          }
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.25 },
    );
    io.observe(wrap);

    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (timer) clearTimeout(timer);
      wrap.classList.remove("is-typing");
    };
  }, [chars, cps]);

  return (
    <div ref={wrapRef} className="tw-wrap">
      {children}
      <div className="tw-overlay" aria-hidden="true">
        <span ref={outRef} />
        <span className="tw-caret" />
      </div>
    </div>
  );
}
