"use client";

/**
 * Tlačítko „Vytisknout / uložit PDF" — otevře systémový tiskový dialog.
 * Čistý tiskový výstup zajišťuje blok `@media print` v globals.css;
 * samo tlačítko se na papíře skrývá (.print-hide).
 */
export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="print-hide eyebrow mt-3 inline-flex items-center gap-1.5 border border-hairline bg-paper px-2.5 py-1.5 text-faint transition-colors hover:border-accent hover:text-accent"
    >
      <span aria-hidden="true">⎙</span>
      {label}
    </button>
  );
}
