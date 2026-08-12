"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export type NavAiItem = { href: string; label: string };

/**
 * Položka „AI“ v hlavní navigaci s rozbalovacím podmenu.
 * Desktop: otevírá hover i klik, zavírá Escape, klik mimo a odjetí myší.
 * Klávesnice: Enter/mezera otevře, šipky procházejí položky, Escape zavře a vrátí fokus.
 */
export function NavAi({
  label,
  menuLabel,
  overview,
  groupLabel,
  items,
  footer,
}: {
  label: string;
  menuLabel: string;
  overview: NavAiItem;
  groupLabel: string;
  items: NavAiItem[];
  footer: NavAiItem;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback((refocus = false) => {
    setOpen(false);
    if (refocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [open]);

  function focusItem(index: number) {
    const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[role='menuitem']");
    if (!links?.length) return;
    const i = (index + links.length) % links.length;
    links[i].focus();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.stopPropagation();
      close(true);
      return;
    }
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        requestAnimationFrame(() => focusItem(0));
        return;
      }
      const links = Array.from(
        menuRef.current?.querySelectorAll<HTMLAnchorElement>("a[role='menuitem']") ?? [],
      );
      const current = links.indexOf(document.activeElement as HTMLAnchorElement);
      focusItem(current < 0 ? 0 : current + (e.key === "ArrowDown" ? 1 : -1));
    }
  }

  const itemClass =
    "block px-4 py-2.5 text-[14px] font-semibold text-ink no-underline transition-colors hover:bg-surface hover:text-accent focus-visible:bg-surface focus-visible:text-accent";

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onKeyDown={onKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={menuLabel}
        onClick={() => setOpen((v) => !v)}
        className="draw-link inline-flex items-center gap-1.5 px-2.5 py-2 text-[14px] font-semibold"
      >
        {label}
        <span aria-hidden="true" className={`text-[9px] leading-none transition-transform ${open ? "rotate-180" : ""}`}>
          ▼
        </span>
      </button>

      <div
        ref={menuRef}
        role="menu"
        aria-label={menuLabel}
        hidden={!open}
        className="absolute top-full left-0 z-20 min-w-[232px] border border-hairline-strong bg-paper py-1 shadow-[0_4px_0_var(--key-shadow)]"
      >
        <Link role="menuitem" href={overview.href} className={itemClass} onClick={() => close()}>
          {overview.label}
        </Link>
        <div className="my-1 border-t border-hairline" />
        <p className="eyebrow px-4 py-1.5 text-faint">{groupLabel}</p>
        {items.map((item) => (
          <Link
            key={item.href}
            role="menuitem"
            href={item.href}
            className={itemClass}
            onClick={() => close()}
          >
            {item.label}
          </Link>
        ))}
        <div className="my-1 border-t border-hairline" />
        <Link role="menuitem" href={footer.href} className={itemClass} onClick={() => close()}>
          {footer.label}
        </Link>
      </div>
    </div>
  );
}

/**
 * Mobilní varianta podmenu: vodorovně scrollovatelný pruh chipů pod hlavní navigací.
 * Nezabírá výšku ani nepotřebuje rozbalování.
 */
export function NavAiChips({ label, items }: { label: string; items: NavAiItem[] }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto border-t border-hairline px-4 py-2 sm:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <span className="eyebrow flex-none pr-1 text-faint">{label}</span>
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex-none border border-hairline bg-paper px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] whitespace-nowrap text-ink uppercase no-underline transition-colors hover:border-ink hover:text-accent"
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
