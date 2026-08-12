"use client";

import { useEffect, useState } from "react";

/** Tenký akcentní pruh nahoře — kolik článku je za vámi. Jen na detailu článku. */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setProgress(max > 0 ? Math.min(100, Math.max(0, (el.scrollTop / max) * 100)) : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-50 h-[3px]"
      aria-hidden="true"
    >
      <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
    </div>
  );
}
