"use client";

/* Mini-demo správy oken — smyčková čárová animace abstraktní obrazovky.
   Čisté CSS keyframes (globals.css, třídy .od-*), žádné knihovny.
   Běží jen ve viewportu; při prefers-reduced-motion se zobrazí statický
   finální stav (základní pozice v CSS = konec animace). */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Typ = "prichyceni" | "plochy" | "mrizka";

const MQ_REDUKCE = "(prefers-reduced-motion: reduce)";

function odberRedukce(cb: () => void) {
  const mq = window.matchMedia(MQ_REDUKCE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

const VYCHOZI_POPISEK: Record<Typ, string> = {
  prichyceni: "Okno se přichytí na levou polovinu obrazovky, druhé doplní pravou.",
  plochy: "Okno přeskočí z jedné virtuální plochy na druhou a zpět.",
  mrizka: "Čtyři okna se poskládají do mřížky po čtvrtinách obrazovky.",
};

export function OknaDemo({ typ, popisek }: { typ: Typ; popisek?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [bezi, setBezi] = useState(false);
  /* Reduced-motion jako externí stav: na serveru false, na klientovi živě. */
  const staticky = useSyncExternalStore(
    odberRedukce,
    () => window.matchMedia(MQ_REDUKCE).matches,
    () => false,
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      const t = setTimeout(() => setBezi(true));
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(([e]) => setBezi(e.isIntersecting), { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const label = popisek ?? VYCHOZI_POPISEK[typ];

  return (
    <div ref={ref} className={`ig od${staticky ? " od-static" : ""}${bezi ? " is-run" : ""}`}>
      <div className="od-screen" role="img" aria-label={label}>
        {typ === "prichyceni" && (
          <>
            <span className="od-win od-anim od-p-a" />
            <span className="od-win od-anim od-p-b" />
          </>
        )}
        {typ === "plochy" && (
          <>
            <span className="od-desk od-desk-1" />
            <span className="od-desk od-desk-2" />
            <span className="od-win od-anim od-d-win" />
            <span className="od-dot od-anim od-dot-1" />
            <span className="od-dot od-anim od-dot-2" />
          </>
        )}
        {typ === "mrizka" && (
          <>
            <span className="od-win od-anim od-g-1" />
            <span className="od-win od-anim od-g-2" />
            <span className="od-win od-anim od-g-3" />
            <span className="od-win od-anim od-g-4" />
          </>
        )}
      </div>
      {popisek && <p className="ig-note od-note">{popisek}</p>}
    </div>
  );
}
