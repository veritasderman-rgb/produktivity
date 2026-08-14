/* Infografické komponenty příručky — čisté CSS/SVG, hover animace, tokeny tématu.
   Používají se přímo v MDX kapitolách: <Stats>, <Timeline>, <Bars>, <Matrix>, <Flow>, <Donut>. */

type StatItem = { value: string; label: string; sub?: string };

export function Stats({ items }: { items: StatItem[] }) {
  return (
    <div className="ig ig-stats" style={{ ["--cols" as string]: Math.min(items.length, 4) }}>
      {items.map((s) => (
        <div key={s.label} className="ig-stat">
          <span className="ig-stat-value tabular">{s.value}</span>
          <span className="ig-stat-label">{s.label}</span>
          {s.sub && <span className="ig-stat-sub">{s.sub}</span>}
        </div>
      ))}
    </div>
  );
}

type TimelineItem = { time: string; title: string; desc?: string };

export function Timeline({ title, items }: { title?: string; items: TimelineItem[] }) {
  return (
    <div className="ig">
      {title && <div className="ig-title">{title}</div>}
      <ol className="ig-timeline">
        {items.map((t) => (
          <li key={t.time + t.title} className="ig-tl-row">
            <span className="ig-tl-time tabular">{t.time}</span>
            <span className="ig-tl-dot" aria-hidden="true" />
            <span className="ig-tl-body">
              <span className="ig-tl-title">{t.title}</span>
              {t.desc && <span className="ig-tl-desc">{t.desc}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

type BarItem = { label: string; value: number; display?: string };

export function Bars({ title, items, max }: { title?: string; items: BarItem[]; max?: number }) {
  const top = max ?? Math.max(...items.map((b) => b.value));
  return (
    <div className="ig">
      {title && <div className="ig-title">{title}</div>}
      <div className="ig-bars">
        {items.map((b) => (
          <div key={b.label} className="ig-bar-row">
            <span className="ig-bar-label">{b.label}</span>
            <span className="ig-bar-track">
              <span className="ig-bar-fill" style={{ width: `${Math.round((b.value / top) * 100)}%` }} />
            </span>
            <span className="ig-bar-value tabular">{b.display ?? b.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type Quadrant = { title: string; action: string; examples: string };

/** Eisenhowerova matice — poradí quadrantů: [urgentní+důležité, důležité, urgentní, ani jedno] */
export function Matrix({ quadrants }: { quadrants: [Quadrant, Quadrant, Quadrant, Quadrant] }) {
  const meta = [
    { tag: "Urgentní + důležité", hot: false },
    { tag: "Důležité, neurgentní", hot: true },
    { tag: "Urgentní, nedůležité", hot: false },
    { tag: "Ani jedno", hot: false },
  ];
  return (
    <div className="ig">
      <div className="ig-matrix">
        {quadrants.map((q, i) => (
          <div key={q.title} className={`ig-quad${meta[i].hot ? " ig-quad-hot" : ""}`}>
            <span className="ig-quad-tag">{meta[i].tag}</span>
            <span className="ig-quad-title">{q.title}</span>
            <span className="ig-quad-action">{q.action}</span>
            <span className="ig-quad-ex">{q.examples}</span>
          </div>
        ))}
      </div>
      <p className="ig-note">Kvadrant „Důležité, neurgentní“ je místo, kde vzniká skutečný pokrok — plánujte si pro něj čas dřív, než ho urgence sežerou.</p>
    </div>
  );
}

type FlowStep = { title: string; desc?: string };

export function Flow({ title, steps }: { title?: string; steps: FlowStep[] }) {
  return (
    <div className="ig">
      {title && <div className="ig-title">{title}</div>}
      <ol className="ig-flow">
        {steps.map((s, i) => (
          <li key={s.title} className="ig-flow-step">
            <span className="ig-flow-no tabular">{i + 1}</span>
            <span className="ig-flow-title">{s.title}</span>
            {s.desc && <span className="ig-flow-desc">{s.desc}</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Donut({ value, label, sub }: { value: number; label: string; sub?: string }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const filled = (Math.min(Math.max(value, 0), 100) / 100) * c;
  return (
    <div className="ig ig-donut-wrap">
      <svg className="ig-donut" viewBox="0 0 128 128" role="img" aria-label={`${value} % — ${label}`}>
        <circle cx="64" cy="64" r={r} className="ig-donut-track" />
        <circle
          cx="64"
          cy="64"
          r={r}
          className="ig-donut-fill"
          strokeDasharray={`${filled} ${c - filled}`}
          transform="rotate(-90 64 64)"
        />
        <text x="64" y="70" textAnchor="middle" className="ig-donut-num tabular">
          {value}&thinsp;%
        </text>
      </svg>
      <div className="ig-donut-side">
        <span className="ig-donut-label">{label}</span>
        {sub && <span className="ig-donut-sub">{sub}</span>}
      </div>
    </div>
  );
}
