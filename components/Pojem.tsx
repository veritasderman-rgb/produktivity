/**
 * Podtržený pojem s tooltipem. Vkládá ho automaticky lib/annotate.ts —
 * v obsahu se ručně nepoužívá. Tooltip je čisté CSS (hover i focus/tap).
 */
export function Pojem({ d, children }: { d: string; children: React.ReactNode }) {
  return (
    <span className="pojem" tabIndex={0} data-tip={d}>
      {children}
    </span>
  );
}
