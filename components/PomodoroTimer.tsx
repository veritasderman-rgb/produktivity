"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Pomodoro časovač — 25/5/15, bez backendu.
   Odpočet jede proti reálnému času (deadline), ne proti počtu tiků, takže
   nezaostává, když prohlížeč uspí interval na neaktivní záložce.
--------------------------------------------------------------------------- */

type Phase = "work" | "short" | "long";

const LONG_EVERY = 4;

const DEFAULTS: Record<Phase, number> = { work: 25, short: 5, long: 15 };

const T = {
  cs: {
    phases: { work: "Práce", short: "Krátká pauza", long: "Dlouhá pauza" },
    start: "Spustit",
    pause: "Pauza",
    resume: "Pokračovat",
    reset: "Reset",
    skip: "Přeskočit fázi",
    completed: "Dokončené bloky",
    settings: "Nastavení",
    minutes: "min",
    workLen: "Práce",
    shortLen: "Krátká pauza",
    longLen: "Dlouhá pauza",
    sound: "Zvukový signál",
    autoContinue: "Pokračovat automaticky",
    notify: "Notifikace",
    notifyAsk: "Povolit notifikace",
    notifyOn: "Notifikace zapnuté",
    notifyBlocked: "Notifikace jsou v prohlížeči zablokované",
    notifyUnsupported: "Notifikace tenhle prohlížeč neumí",
    doneTitleWork: "Konec bloku",
    doneBodyWork: "Máte za sebou blok práce. Vstaňte od stolu.",
    doneTitleBreak: "Konec pauzy",
    doneBodyBreak: "Pauza skončila. Zpátky do práce.",
    nextUp: "Následuje",
    ofFour: "do dlouhé pauzy",
    methodEyebrow: "Jak to funguje",
    methodTitle: "Pomodoro v pěti větách",
    method: [
      "Vyberte jednu věc, na které budete pracovat — ne tři.",
      "Spusťte pětadvacet minut a do konce se nevěnujte ničemu jinému. Když něco přiletí, zapište si to a vraťte se.",
      "Po odpískání vstaňte a pět minut nedělejte nic užitečného. Pauza je součást metody, ne odměna.",
      "Po čtyřech blocích si dejte delší pauzu, patnáct až třicet minut.",
      "Když blok přerušíte, nepočítá se. Není to trest — je to měřítko, kolik nerušeného času reálně máte.",
    ],
    chapterCta: "Kapitola: Pomodoro a time-blocking",
    tipCta: "Tip: Pomodoro pro studium",
    interrupted: "Přerušení",
    interruptedNote:
      "Časovač běží i na neaktivní záložce — zbývající čas se ukazuje v titulku okna.",
  },
  en: {
    phases: { work: "Focus", short: "Short break", long: "Long break" },
    start: "Start",
    pause: "Pause",
    resume: "Resume",
    reset: "Reset",
    skip: "Skip phase",
    completed: "Completed blocks",
    settings: "Settings",
    minutes: "min",
    workLen: "Focus",
    shortLen: "Short break",
    longLen: "Long break",
    sound: "Sound alert",
    autoContinue: "Continue automatically",
    notify: "Notifications",
    notifyAsk: "Enable notifications",
    notifyOn: "Notifications enabled",
    notifyBlocked: "Notifications are blocked in this browser",
    notifyUnsupported: "This browser does not support notifications",
    doneTitleWork: "Block finished",
    doneBodyWork: "That is one block of focus done. Get up from the desk.",
    doneTitleBreak: "Break over",
    doneBodyBreak: "The break is done. Back to work.",
    nextUp: "Next up",
    ofFour: "until the long break",
    methodEyebrow: "How it works",
    methodTitle: "Pomodoro in five sentences",
    method: [
      "Pick one thing to work on — not three.",
      "Start twenty-five minutes and touch nothing else until the bell. If something lands, write it down and go back.",
      "When it rings, stand up and do nothing useful for five minutes. The break is part of the method, not a reward.",
      "After four blocks take a longer break, fifteen to thirty minutes.",
      "If a block gets interrupted, it does not count. That is not a punishment — it is a measure of how much uninterrupted time you actually get.",
    ],
    chapterCta: "Chapter: Pomodoro and time-blocking",
    tipCta: "Tip: Pomodoro for studying",
    interrupted: "Interruptions",
    interruptedNote:
      "The timer keeps running on an inactive tab — the remaining time shows in the window title.",
  },
};

/* Stav povolení notifikací je mimo React (browser API), takže ho čteme přes
   useSyncExternalStore — hydratace startuje na „default“ a hned po připojení
   se srovná se skutečností. */
type NotifyState = "unsupported" | "default" | "granted" | "denied";

let notifyListeners: (() => void)[] = [];

function subscribeNotify(cb: () => void) {
  notifyListeners.push(cb);
  return () => {
    notifyListeners = notifyListeners.filter((l) => l !== cb);
  };
}

function emitNotifyChange() {
  for (const l of notifyListeners) l();
}

function getNotifySnapshot(): NotifyState {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission as NotifyState;
}

function getNotifyServerSnapshot(): NotifyState {
  return "default";
}

function fmt(totalSeconds: number) {
  const s = Math.max(0, Math.round(totalSeconds));
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function PomodoroTimer({ locale }: { locale: Locale }) {
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const [durations, setDurations] = useState<Record<Phase, number>>(DEFAULTS);
  const [phase, setPhase] = useState<Phase>("work");
  const [running, setRunning] = useState(false);
  const [remaining, setRemaining] = useState(DEFAULTS.work * 60);
  const [completed, setCompleted] = useState(0);
  const [cycle, setCycle] = useState(0); // bloky práce od poslední dlouhé pauzy
  const [soundOn, setSoundOn] = useState(true);
  const [autoContinue, setAutoContinue] = useState(true);
  const notifyState = useSyncExternalStore(
    subscribeNotify,
    getNotifySnapshot,
    getNotifyServerSnapshot,
  );

  // Ref drží zbývající čas synchronně — efekt s intervalem z něj čte při startu.
  const remainingRef = useRef(remaining);
  const setRemainingSync = useCallback((value: number) => {
    remainingRef.current = value;
    setRemaining(value);
  }, []);

  const audioRef = useRef<AudioContext | null>(null);
  const baseTitleRef = useRef<string>("");

  /* ------------------------------- zvuk -------------------------------- */
  const beep = useCallback((times: number) => {
    if (typeof window === "undefined") return;
    const Ctor =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return;
    const ctx = audioRef.current ?? new Ctor();
    audioRef.current = ctx;
    if (ctx.state === "suspended") void ctx.resume();
    const start = ctx.currentTime + 0.02;
    for (let i = 0; i < times; i++) {
      const at = start + i * 0.3;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(880, at);
      gain.gain.setValueAtTime(0.0001, at);
      gain.gain.exponentialRampToValueAtTime(0.22, at + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.24);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(at);
      osc.stop(at + 0.26);
    }
  }, []);

  /* --------------------------- notifikace ------------------------------ */
  const askNotify = useCallback(async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    await Notification.requestPermission();
    emitNotifyChange();
  }, []);

  const notify = useCallback((title: string, body: string) => {
    if (typeof window === "undefined" || !("Notification" in window)) return;
    if (Notification.permission !== "granted") return;
    try {
      new Notification(title, { body });
    } catch {
      /* Safari na iOS notifikace ze stránky neumí — tiše ignorujeme. */
    }
  }, []);

  /* ------------------------- přechod mezi fázemi ----------------------- */
  const advance = useCallback(
    (opts: { manual: boolean }) => {
      const wasWork = phase === "work";
      let nextPhase: Phase = "work";
      let nextCycle = cycle;

      if (wasWork) {
        nextCycle = cycle + 1;
        nextPhase = nextCycle % LONG_EVERY === 0 ? "long" : "short";
      } else {
        nextPhase = "work";
      }

      if (!opts.manual) {
        if (wasWork) setCompleted((c) => c + 1);
        if (soundOn) beep(wasWork ? 2 : 3);
        notify(
          wasWork ? t.doneTitleWork : t.doneTitleBreak,
          wasWork ? t.doneBodyWork : t.doneBodyBreak,
        );
      }

      setCycle(nextCycle);
      setPhase(nextPhase);
      setRemainingSync(durations[nextPhase] * 60);
      // Ruční přeskočení nechává časovač v tom stavu, v jakém byl.
      setRunning(opts.manual ? running : autoContinue);
    },
    [
      phase,
      cycle,
      running,
      soundOn,
      beep,
      notify,
      durations,
      autoContinue,
      setRemainingSync,
      t.doneTitleWork,
      t.doneTitleBreak,
      t.doneBodyWork,
      t.doneBodyBreak,
    ],
  );

  const advanceRef = useRef(advance);
  useEffect(() => {
    advanceRef.current = advance;
  }, [advance]);

  /* ------------------------------ odpočet ------------------------------ */
  useEffect(() => {
    if (!running) return;
    const deadline = Date.now() + remainingRef.current * 1000;
    const id = window.setInterval(() => {
      const left = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setRemainingSync(left);
      if (left <= 0) {
        window.clearInterval(id);
        advanceRef.current({ manual: false });
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [running, phase, setRemainingSync]);

  /* --------------------------- titulek stránky ------------------------- */
  useEffect(() => {
    baseTitleRef.current = document.title;
    return () => {
      document.title = baseTitleRef.current;
    };
  }, []);

  useEffect(() => {
    if (running) {
      document.title = `${fmt(remaining)} · ${t.phases[phase]}`;
    } else {
      document.title = baseTitleRef.current;
    }
  }, [running, remaining, phase, t.phases]);

  /* ----------------------------- ovládání ------------------------------ */
  function toggle() {
    if (!running) {
      // AudioContext se musí probudit uživatelským gestem.
      if (soundOn && audioRef.current?.state === "suspended") {
        void audioRef.current.resume();
      }
      if (remainingRef.current <= 0) setRemainingSync(durations[phase] * 60);
    }
    setRunning((r) => !r);
  }

  function reset() {
    setRunning(false);
    setPhase("work");
    setCycle(0);
    setCompleted(0);
    setRemainingSync(durations.work * 60);
  }

  function changeDuration(which: Phase, value: number) {
    const minutes = Math.min(90, Math.max(1, Math.round(value) || 1));
    setDurations((d) => ({ ...d, [which]: minutes }));
    if (!running && which === phase) setRemainingSync(minutes * 60);
  }

  const total = durations[phase] * 60;
  const progress = total > 0 ? Math.min(1, Math.max(0, 1 - remaining / total)) : 0;
  const isBreak = phase !== "work";
  const nextPhase: Phase =
    phase === "work" ? ((cycle + 1) % LONG_EVERY === 0 ? "long" : "short") : "work";
  const toLong = LONG_EVERY - (cycle % LONG_EVERY);

  return (
    <div>
      {/* ------------------------------ časovač ------------------------------ */}
      <section
        className="border-2 border-hairline-strong bg-card p-6 shadow-[0_4px_0_#141414] sm:p-9"
        aria-label={t.phases[phase]}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {(["work", "short", "long"] as Phase[]).map((ph) => (
              <span
                key={ph}
                className={`border px-2.5 py-1.5 font-mono text-[10.5px] font-semibold tracking-[0.12em] uppercase ${
                  ph === phase
                    ? isBreak
                      ? "border-accent bg-accent text-accent-ink"
                      : "border-ink bg-ink text-paper"
                    : "border-hairline text-faint"
                }`}
              >
                {t.phases[ph]}
              </span>
            ))}
          </div>
          <p className="font-mono text-[11.5px] font-semibold text-faint">
            {toLong} × {t.phases.work} {t.ofFour}
          </p>
        </div>

        <p
          className="tabular mt-8 text-center font-mono leading-none font-bold text-[clamp(64px,17vw,148px)]"
          style={{ color: isBreak ? "var(--accent)" : "var(--ink)" }}
          /* Odečítání po sekundách by odečítačku obrazovky zahltilo — hlásíme
             jen změnu fáze, ne každý tik. */
          aria-hidden="true"
        >
          {fmt(remaining)}
        </p>
        <p className="sr-only" aria-live="polite">
          {t.phases[phase]}
        </p>

        <div className="mt-7 h-2.5 w-full border border-hairline bg-surface">
          <div
            className="h-full transition-[width] duration-200 ease-linear motion-reduce:transition-none"
            style={{
              width: `${Math.round(progress * 100)}%`,
              background: isBreak ? "var(--accent)" : "var(--ink)",
            }}
          />
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={toggle}
            className="min-w-[168px] bg-ink px-8 py-4 font-mono text-[13px] font-bold tracking-[0.1em] text-paper uppercase transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {running ? t.pause : remaining === total ? t.start : t.resume}
          </button>
          <button
            type="button"
            onClick={() => advance({ manual: true })}
            className="border-[1.5px] border-ink bg-paper px-5 py-4 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-ink hover:text-paper"
          >
            {t.skip}
          </button>
          <button
            type="button"
            onClick={reset}
            className="border-[1.5px] border-hairline bg-paper px-5 py-4 font-mono text-[12px] font-semibold tracking-[0.08em] text-muted uppercase transition-colors hover:border-ink hover:text-ink"
          >
            {t.reset}
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-hairline pt-6">
          <div>
            <p className="eyebrow text-faint">{t.completed}</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="tabular font-mono text-[28px] leading-none font-bold">
                {completed}
              </span>
              <span className="flex flex-wrap gap-1" aria-hidden="true">
                {Array.from({ length: Math.min(completed, 16) }).map((_, i) => (
                  <span key={i} className="block h-3 w-3 bg-ink" />
                ))}
              </span>
            </div>
          </div>
          <p className="max-w-[34ch] text-[12.5px] leading-relaxed text-faint">
            {t.nextUp}: {t.phases[nextPhase]} · {durations[nextPhase]} {t.minutes}
          </p>
        </div>
      </section>

      {/* ----------------------------- nastavení ----------------------------- */}
      <section className="mt-6 border border-hairline bg-surface p-6">
        <p className="eyebrow mb-4 text-faint">{t.settings}</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {(
            [
              ["work", t.workLen],
              ["short", t.shortLen],
              ["long", t.longLen],
            ] as [Phase, string][]
          ).map(([key, label]) => (
            <label key={key} className="flex flex-col gap-2">
              <span className="text-[13px] font-semibold">{label}</span>
              <span className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={90}
                  value={durations[key]}
                  onChange={(e) => changeDuration(key, Number(e.target.value))}
                  className="tabular w-20 border-[1.5px] border-hairline-strong bg-paper px-3 py-2 font-mono text-[14px] font-semibold"
                />
                <span className="font-mono text-[12px] text-faint">{t.minutes}</span>
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-hairline pt-5">
          <label className="flex items-center gap-2.5 text-[13.5px] font-semibold">
            <input
              type="checkbox"
              checked={soundOn}
              onChange={(e) => setSoundOn(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            {t.sound}
          </label>
          <label className="flex items-center gap-2.5 text-[13.5px] font-semibold">
            <input
              type="checkbox"
              checked={autoContinue}
              onChange={(e) => setAutoContinue(e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            {t.autoContinue}
          </label>

          {notifyState === "default" && (
            <button
              type="button"
              onClick={askNotify}
              className="draw-link text-[13.5px] font-bold"
            >
              {t.notifyAsk} →
            </button>
          )}
          {notifyState === "granted" && (
            <span className="font-mono text-[12px] text-faint">{t.notifyOn}</span>
          )}
          {notifyState === "denied" && (
            <span className="font-mono text-[12px] text-faint">{t.notifyBlocked}</span>
          )}
          {notifyState === "unsupported" && (
            <span className="font-mono text-[12px] text-faint">{t.notifyUnsupported}</span>
          )}
        </div>
        <p className="mt-4 text-[12.5px] leading-relaxed text-faint">{t.interruptedNote}</p>
      </section>

      {/* ------------------------------ metoda ------------------------------ */}
      <section className="mt-14">
        <p className="eyebrow mb-2 text-faint">{t.methodEyebrow}</p>
        <h2 className="display text-[clamp(21px,3.2vw,28px)]">{t.methodTitle}</h2>
        <div className="prose-a mt-4 text-[16.5px]">
          <ol>
            {t.method.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ol>
        </div>
        <div className="mt-7 flex flex-wrap items-center gap-4">
          <Link
            href={p("/prirucka/pomodoro-a-time-blocking")}
            className="bg-ink px-5 py-3 text-[13.5px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {t.chapterCta} →
          </Link>
          <Link href={p("/tipy/student-pomodoro")} className="draw-link text-[13.5px] font-bold">
            {t.tipCta} →
          </Link>
        </div>
      </section>
    </div>
  );
}
