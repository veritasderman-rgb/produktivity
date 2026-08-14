"use client";

import { useSyncExternalStore } from "react";

export type Claim = { a: string; accent: string; b: string };

/* Náhodný výběr proběhne jednou při načtení modulu na klientu.
   Server vždy kreslí claim 0 (klasický) — useSyncExternalStore pak po hydrataci
   bezpečně přepne na náhodný, bez hydration erroru a bez setState v efektu. */
const picked = Math.random();

const subscribe = () => () => {};

/** Rotující hero claim: server ukáže klasiku, každá návštěva pak jednu z variant. */
export function RotatingClaim({ claims }: { claims: Claim[] }) {
  const idx = useSyncExternalStore(
    subscribe,
    () => Math.floor(picked * claims.length),
    () => 0,
  );
  const c = claims[idx] ?? claims[0];
  return (
    <>
      {c.a}
      <span className="text-accent">{c.accent}</span>
      {c.b}
    </>
  );
}
