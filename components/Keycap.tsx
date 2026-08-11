export function Keycap({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`grid place-items-center rounded-[10px] border-2 border-hairline-strong bg-card text-accent select-none ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: "0 4px 0 var(--key-shadow)",
        font: `800 ${Math.round(size * 0.48)}px/1 var(--font-sans)`,
        fontStretch: "120%",
      }}
    >
      P
    </span>
  );
}
