export function Keycap({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`key-pressable grid place-items-center border-2 border-hairline-strong bg-card text-accent select-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: Math.max(6, Math.round(size * 0.2)),
        boxShadow: "0 4px 0 var(--key-shadow)",
        font: `800 ${Math.round(size * 0.5)}px/1 var(--font-sans)`,
        letterSpacing: "-0.02em",
      }}
    >
      P
    </span>
  );
}
