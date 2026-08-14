"use client";

import { useSyncExternalStore } from "react";

/* Šipka „zpět nahoru" — kruhové tlačítko vpravo dole na detailu článku.
   Objeví se až po delším scrollu, klik plynule vrátí na začátek
   (při prefers-reduced-motion skokem). Stav čteme přes useSyncExternalStore:
   server vykreslí „skryto", klient se po připojení dorovná — žádné setState
   v efektu (lint react-hooks/set-state-in-effect). */

const SHOW_AFTER_PX = 800;

const T = {
  cs: { label: "Zpět nahoru" },
  en: { label: "Back to top" },
};

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  window.addEventListener("resize", onChange);
  return () => {
    window.removeEventListener("scroll", onChange);
    window.removeEventListener("resize", onChange);
  };
}

/* Snapshot je boolean — React překreslí jen při změně hodnoty,
   takže scroll listener nepotřebuje další throttle. */
function getSnapshot(): boolean {
  return window.scrollY > SHOW_AFTER_PX;
}

function getServerSnapshot(): boolean {
  return false;
}

export function BackToTop({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const t = T[locale] ?? T.cs;
  const visible = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!visible) return null;

  const scrollTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollTop}
      aria-label={t.label}
      className="fixed right-4 bottom-4 z-40 grid h-11 w-11 place-items-center rounded-full border-[1.5px] border-hairline-strong bg-card text-[18px] font-bold text-ink shadow-[0_4px_0_var(--key-shadow)] transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
