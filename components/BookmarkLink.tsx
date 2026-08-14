import Link from "next/link";

/**
 * Ikonka záložky v hlavičce (vedle lupy) — odkaz na /ulozene.
 * Serverová komponenta: žádný stav, jen odkaz se SVG ve stylu MagnifierIcon.
 */
export function BookmarkLink({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className={className ?? "draw-link inline-flex items-center px-2.5 py-2"}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <path
          d="M3.75 1.75h8.5v12.5L8 10.8l-4.25 3.45V1.75z"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="miter"
        />
      </svg>
    </Link>
  );
}
