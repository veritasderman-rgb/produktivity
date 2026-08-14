"use client";

/* Přepínač „před / po" — dva stavy textu s crossfade přechodem (~300 ms).
   Víceřádkový obsah lze v MDX zapsat sekvencí \n uvnitř uvozovek — komponenta
   ji převede na skutečné řádky. Volitelné `auto` přepne 1× při vjezdu do
   viewportu (po 1,5 s), pak už jen ručně. Reduced-motion: globals.css zkrátí
   přechody na 0, přepínání tlačítky funguje beze změny. */

import { useEffect, useRef, useState } from "react";

const naRadky = (s: string) => s.replace(/\\n/g, "\n");

export function PredPo({
  pred,
  po,
  popisekPred = "Před",
  popisekPo = "Po",
  auto = false,
}: {
  pred: string;
  po: string;
  popisekPred?: string;
  popisekPo?: string;
  auto?: boolean;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const spusteno = useRef(false);
  const [aktivni, setAktivni] = useState<"pred" | "po">("pred");

  useEffect(() => {
    if (!auto) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    let casovac: ReturnType<typeof setTimeout> | undefined;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !spusteno.current) {
          spusteno.current = true;
          casovac = setTimeout(() => setAktivni("po"), 1500);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (casovac) clearTimeout(casovac);
    };
  }, [auto]);

  return (
    <div ref={ref} className="ig pp">
      <div className="pp-tabs">
        <button
          type="button"
          className="pp-tab"
          aria-pressed={aktivni === "pred"}
          onClick={() => setAktivni("pred")}
        >
          {popisekPred}
        </button>
        <button
          type="button"
          className="pp-tab"
          aria-pressed={aktivni === "po"}
          onClick={() => setAktivni("po")}
        >
          {popisekPo}
        </button>
      </div>
      <div className="pp-body">
        <pre className={`pp-pane${aktivni === "pred" ? " is-on" : ""}`} aria-hidden={aktivni !== "pred"}>
          {naRadky(pred)}
        </pre>
        <pre className={`pp-pane${aktivni === "po" ? " is-on" : ""}`} aria-hidden={aktivni !== "po"}>
          {naRadky(po)}
        </pre>
      </div>
    </div>
  );
}
