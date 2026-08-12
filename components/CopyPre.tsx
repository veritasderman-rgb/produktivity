"use client";

import { useRef, useState } from "react";

/**
 * Obal kódového bloku s tlačítkem „zkopírovat" (pro prompty v článcích
 * a databázi promptů). Použití: mdxComponents = { pre: CopyPre } nebo přímo
 * <CopyPre label="…"><pre>…</pre></CopyPre>.
 */
export function CopyPre({
  children,
  label,
}: {
  children: React.ReactNode;
  label?: { copy: string; copied: string };
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const t = label ?? { copy: "Zkopírovat", copied: "Zkopírováno ✓" };

  const copy = async () => {
    const text = ref.current?.querySelector("pre")?.textContent ?? "";
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // starší prohlížeče: označit text nepodporujeme, tlačítko prostě nic neudělá
    }
  };

  return (
    <div ref={ref} className="copy-pre group relative">
      {children}
      <button
        type="button"
        onClick={copy}
        className={`absolute top-2 right-2 border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-wide transition-colors ${
          copied
            ? "border-ink bg-ink text-paper"
            : "border-hairline bg-paper text-muted hover:border-ink hover:text-ink"
        }`}
        aria-live="polite"
      >
        {copied ? t.copied : t.copy}
      </button>
    </div>
  );
}
