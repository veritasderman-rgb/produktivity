"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { NewsletterForm } from "./NewsletterForm";

/* Newsletter pop-up — ukáže se, až když čtenář opravdu čte: 40 s viditelné
   stránky A ZÁROVEŇ scroll přes 35 % dokumentu. Zavření (křížek, ESC, klik
   mimo) ho umlčí na 30 dní; po úspěšném přihlášení (klíč
   produktivni:subscribed, nastavuje NewsletterForm) navždy.
   Desktop: karta vpravo dole (nepřekrývá obsah), mobil: bottom sheet.
   Nekrade focus — čtenář čte dál. Vkládá se jen na detaily článků
   a homepage, ne na /newsletter a /kurz. */

const DISMISS_KEY = "produktivni:popup";
const SUBSCRIBED_KEY = "produktivni:subscribed";
const SHOW_AFTER_S = 40;
const SCROLL_FRACTION = 0.35;
const DISMISS_DAYS = 30;

const T = {
  cs: {
    aria: "Přihlášení k newsletteru",
    close: "Zavřít nabídku newsletteru",
    eyebrow: "Jeden tip týdně",
    desc: "To nejlepší z webu v jednom krátkém e-mailu. Dvě minuty čtení, hodiny úspor.",
  },
  en: {
    aria: "Newsletter sign-up",
    close: "Close newsletter offer",
    eyebrow: "One tip a week",
    desc: "The best of the site in one short email. Two minutes to read, hours saved.",
  },
};

/** Smí se popup vůbec ukázat? (localStorage může být i zakázaný — pak nikdy.) */
function isEligible(): boolean {
  try {
    if (window.localStorage.getItem(SUBSCRIBED_KEY) === "1") return false;
    const raw = window.localStorage.getItem(DISMISS_KEY);
    if (raw) {
      const ts = Number(raw);
      if (Number.isFinite(ts) && Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000) {
        return false;
      }
    }
    return true;
  } catch {
    return false;
  }
}

export function NewsletterPopup({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const t = T[locale] ?? T.cs;
  const [open, setOpen] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  /* Hlídání obou podmínek. setOpen se volá jen z timeru/listeneru,
     nikdy synchronně v efektu (lint react-hooks/set-state-in-effect). */
  useEffect(() => {
    if (!isEligible()) return;

    let elapsed = 0; // sekundy s viditelnou stránkou — zaparkovaná záložka se nepočítá
    let timeOk = false;
    let scrollOk = false;
    let opened = false;
    let raf = 0;

    const maybeOpen = () => {
      if (opened || !timeOk || !scrollOk) return;
      opened = true;
      if (isEligible()) setOpen(true); // mezitím se mohl přihlásit jinde
    };

    const interval = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      elapsed += 1;
      if (elapsed >= SHOW_AFTER_S) {
        timeOk = true;
        window.clearInterval(interval);
        maybeOpen();
      }
    }, 1000);

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        if (max <= 0 || el.scrollTop / max >= SCROLL_FRACTION) {
          scrollOk = true;
          window.removeEventListener("scroll", onScroll);
          maybeOpen();
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // krátké stránky nebo obnovená pozice — vyhodnotí se v rAF

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    try {
      window.localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {
      /* Bez úložiště se aspoň zavře — do reloadu se nevrátí. */
    }
  }, []);

  /* ESC a klik mimo kartu zavírají — jako dialog, ale bez krádeže focusu. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) dismiss();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, dismiss]);

  if (!open) return null;

  return (
    <div
      ref={cardRef}
      role="dialog"
      aria-label={t.aria}
      className="popup-in fixed inset-x-0 bottom-0 z-50 max-h-[45vh] overflow-y-auto border-t-[1.5px] border-hairline-strong bg-card p-5 pt-6 shadow-[0_-4px_0_var(--key-shadow)] sm:inset-x-auto sm:right-4 sm:bottom-[76px] sm:max-h-none sm:w-[min(420px,calc(100vw-32px))] sm:border-[1.5px] sm:shadow-[0_4px_0_var(--key-shadow)]"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label={t.close}
        className="absolute top-2 right-2 grid h-8 w-8 place-items-center text-[18px] leading-none text-muted hover:text-accent"
      >
        <span aria-hidden="true">×</span>
      </button>
      <p className="eyebrow text-accent">{t.eyebrow}</p>
      <p className="mt-2 mb-4 max-w-[44ch] text-[15px] font-semibold text-ink">{t.desc}</p>
      <NewsletterForm source="popup" locale={locale} />
    </div>
  );
}
