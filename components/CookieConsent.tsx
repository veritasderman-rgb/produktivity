"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import {
  readConsent,
  readConsentOnServer,
  subscribeConsent,
  writeConsent,
  type ConsentChoice,
} from "@/lib/consent";

export type CookiesDict = {
  text: string;
  more: string;
  accept: string;
  reject: string;
};

export function CookieConsent({ dict, privacyHref }: { dict: CookiesDict; privacyHref: string }) {
  // localStorage je externí úložiště mimo React — čteme ho přes
  // useSyncExternalStore, ať se lišta po volbě sama překreslí. Serverový
  // snapshot vrací hotovou volbu, takže se při hydrataci nic nemihne.
  const choice = useSyncExternalStore<ConsentChoice | null>(
    subscribeConsent,
    readConsent,
    readConsentOnServer,
  );

  if (choice !== null) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t-2 border-hairline-strong bg-paper px-[var(--page-pad)] py-4">
      <div className="mx-auto flex max-w-[var(--page-max)] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[70ch] text-[13.5px] leading-relaxed text-muted">
          {dict.text}{" "}
          <Link href={privacyHref} className="draw-link font-semibold">
            {dict.more}
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => writeConsent("denied")}
            className="border border-hairline-strong px-4 py-2.5 text-[13px] font-bold transition-colors hover:bg-hairline"
          >
            {dict.reject}
          </button>
          <button
            type="button"
            onClick={() => writeConsent("granted")}
            className="bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {dict.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
