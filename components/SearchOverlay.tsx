"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { localePath, type Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Celowebové hledání jako vrstva (Ctrl+K / Cmd+K).
   Index se skládá server-side v layoutu a chodí sem propem — jen typ, slug
   a titulek, žádné excerpty, ať HTML stránky zbytečně neroste.
--------------------------------------------------------------------------- */

export type SearchIndexItem = {
  type: "tip" | "kapitola" | "ai" | "rozhovor";
  slug: string;
  title: string;
};

export type SearchOverlayLabels = {
  open: string;
  title: string;
  close: string;
  placeholder: string;
  noResults: string;
  allResults: string;
  typeLabel: Record<SearchIndexItem["type"], string>;
};

const typeHref: Record<SearchIndexItem["type"], string> = {
  tip: "/tipy",
  kapitola: "/prirucka",
  ai: "/ai",
  rozhovor: "/rozhovory",
};

/* Stav otevření žije mimo React ve sdíleném store: tlačítka lupy (desktop
   i mobil) i samotná vrstva ho čtou přes useSyncExternalStore, takže se
   obejdeme bez setState v efektu i bez context provideru. */
let overlayOpen = false;
let listeners: (() => void)[] = [];

function emit() {
  for (const l of listeners) l();
}

function subscribe(cb: () => void) {
  listeners.push(cb);
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

const getSnapshot = () => overlayOpen;
const getServerSnapshot = () => false;

export function openSearchOverlay() {
  if (!overlayOpen) {
    overlayOpen = true;
    emit();
  }
}

export function closeSearchOverlay() {
  if (overlayOpen) {
    overlayOpen = false;
    emit();
  }
}

/** Normalizace diakritiky — stejně jako v SearchAll, ať „príručka“ najde „příručka“. */
function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function MagnifierIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <circle cx="6.75" cy="6.75" r="4.75" stroke="currentColor" strokeWidth="1.8" />
      <path d="M10.5 10.5L14.5 14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" />
    </svg>
  );
}

/** Ikona lupy v hlavičce — otevírá vrstvu hledání. */
export function SearchTrigger({ label, className }: { label: string; className?: string }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={openSearchOverlay}
      className={className ?? "draw-link inline-flex items-center px-2.5 py-2"}
    >
      <MagnifierIcon />
    </button>
  );
}

export function SearchOverlay({
  docs,
  locale,
  labels,
}: {
  docs: SearchIndexItem[];
  locale: Locale;
  labels: SearchOverlayLabels;
}) {
  const open = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return docs
      .map((d, order) => {
        const title = normalize(d.title);
        // Shoda od začátku titulku má přednost před shodou kdekoli v titulku.
        let score = 0;
        if (title === q) score = 3;
        else if (title.startsWith(q)) score = 2;
        else if (title.includes(q)) score = 1;
        return { d, score, order };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || a.order - b.order)
      .slice(0, 8)
      .map((x) => x.d);
  }, [docs, query]);

  // Když se seznam zkrátí, zvýraznění se jen přiskřípne — žádný setState v efektu.
  const active = results.length > 0 ? Math.min(activeIndex, results.length - 1) : -1;

  /* Globální zkratka Ctrl+K / Cmd+K — čistý keydown listener, žádná knihovna. */
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (overlayOpen) closeSearchOverlay();
        else openSearchOverlay();
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  /* Po otevření: zámek scrollu a fokus do pole. Cleanup vrací fokus tam,
     odkud se vrstva otevřela. */
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    inputRef.current?.select();
    return () => {
      document.body.style.overflow = prevOverflow;
      prev?.focus();
    };
  }, [open]);

  if (!open) return null;

  const q = query.trim();
  const href = (d: SearchIndexItem) => localePath(locale, `${typeHref[d.type]}/${d.slug}`);
  const allHref =
    localePath(locale, "/hledat") + (q.length >= 2 ? `?q=${encodeURIComponent(q)}` : "");

  function go(d: SearchIndexItem) {
    closeSearchOverlay();
    router.push(href(d));
  }

  /* Focus trap: Tab cykluje uvnitř vrstvy, Escape zavírá. */
  function onWrapKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      closeSearchOverlay();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = wrapRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), input",
    );
    if (!focusables?.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(Math.min(active + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(Math.max(active - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results.length > 0) {
        go(results[Math.max(active, 0)]);
      } else if (q.length >= 2) {
        closeSearchOverlay();
        router.push(allHref);
      }
    }
  }

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-50 overflow-y-auto px-4 pt-[12vh] pb-8"
      style={{ background: "rgba(20,20,20,.35)" }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeSearchOverlay();
      }}
      onKeyDown={onWrapKeyDown}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={labels.title}
        className="mx-auto w-full max-w-[640px] border-2 border-hairline-strong bg-paper shadow-[0_5px_0_var(--key-shadow)]"
      >
        <div className="flex items-center gap-3 border-b border-hairline px-4">
          <MagnifierIcon className="flex-none text-faint" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            placeholder={labels.placeholder}
            aria-label={labels.title}
            className="w-full bg-transparent py-4 text-[16px] outline-none"
          />
          <button
            type="button"
            onClick={closeSearchOverlay}
            aria-label={labels.close}
            className="flex-none border border-hairline px-2 py-1 font-mono text-[10.5px] font-semibold tracking-[0.08em] text-faint uppercase transition-colors hover:border-ink hover:text-ink"
          >
            Esc
          </button>
        </div>

        {q.length >= 2 && results.length > 0 && (
          <ul>
            {results.map((d, i) => (
              <li key={d.type + d.slug}>
                <Link
                  href={href(d)}
                  onClick={() => closeSearchOverlay()}
                  onMouseEnter={() => setActiveIndex(i)}
                  className={`flex items-baseline gap-3 px-4 py-3 no-underline transition-colors ${
                    i === active ? "bg-surface" : ""
                  }`}
                >
                  <span className="eyebrow w-[84px] flex-none text-faint">
                    {labels.typeLabel[d.type]}
                  </span>
                  <span className="text-[14.5px] leading-snug font-bold text-ink">{d.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {q.length >= 2 && results.length === 0 && (
          <p className="px-4 py-5 text-[14px] text-muted">{labels.noResults}</p>
        )}

        <div className="border-t border-hairline px-4 py-3">
          <Link
            href={allHref}
            onClick={() => closeSearchOverlay()}
            className="draw-link text-[13px] font-bold"
          >
            {labels.allResults} →
          </Link>
        </div>
      </div>
    </div>
  );
}
