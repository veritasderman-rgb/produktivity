"use client";

import { useEffect } from "react";
import { track } from "@vercel/analytics";

/** Pošle jednu událost do Vercel Analytics a GA4 (GA jen se souhlasem) při zobrazení stránky. */
export function TrackOnce({ event, gaEvent, data }: { event: string; gaEvent?: string; data?: Record<string, string> }) {
  useEffect(() => {
    track(event, data);
    if (gaEvent) {
      const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
      w.gtag?.("event", gaEvent, data);
    }
    // Událost patří k načtení stránky, ne ke změně props.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
