/* Ilustrace stránky příručky — čisté SVG v tokenech tématu (inkoust, akcent,
   tvrdý stín). Serverové komponenty, žádný JS: dekorace jsou aria-hidden
   a na malých displejích se skrývají, aby nebraly místo obsahu. */

/** Otevřená kniha s akcentovou záložkou — hlavička příručky. */
export function BookArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 190"
      width="240"
      height="190"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* tvrdý stín pod knihou */}
      <path
        d="M28 150 L120 172 L212 150 L212 158 L120 180 L28 158 Z"
        fill="var(--key-shadow)"
      />
      {/* desky */}
      <path
        d="M28 36 L120 58 L212 36 L212 150 L120 172 L28 150 Z"
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* hřbet */}
      <path d="M120 58 L120 172" stroke="var(--ink)" strokeWidth="2.5" />
      {/* vnitřní hrany stránek */}
      <path
        d="M38 46 L112 63 L112 160 L38 143 Z"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M202 46 L128 63 L128 160 L202 143 Z"
        fill="var(--surface)"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* řádky textu vlevo */}
      <path d="M48 62 L102 74" stroke="var(--ink)" strokeWidth="2" strokeLinecap="square" />
      <path d="M48 74 L102 86" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      <path d="M48 86 L102 98" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      <path d="M48 98 L88 107" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      <path d="M48 112 L102 124" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      <path d="M48 124 L94 134" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      {/* řádky textu vpravo — první dva akcentem: rozečtená kapitola */}
      <path d="M138 74 L192 62" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" />
      <path d="M138 86 L192 74" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="square" />
      <path d="M138 98 L192 86" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      <path d="M138 110 L178 101" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      <path d="M138 124 L192 112" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      {/* záložka */}
      <path
        d="M164 26 L180 22 L180 54 L172 48 L164 58 Z"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Kvízový lístek se zaškrtnutou odpovědí — box „Nevíte, kde začít?“. */
export function QuizArt({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 190 160"
      width="190"
      height="160"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      {/* tvrdý stín karty */}
      <rect x="26" y="22" width="140" height="122" fill="var(--key-shadow)" />
      {/* karta */}
      <rect
        x="20"
        y="16"
        width="140"
        height="122"
        fill="var(--paper)"
        stroke="var(--ink)"
        strokeWidth="2.5"
      />
      {/* titulek lístku */}
      <path d="M34 36 L110 36" stroke="var(--ink)" strokeWidth="3" strokeLinecap="square" />
      <path d="M34 46 L86 46" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      {/* možnost A */}
      <rect x="34" y="60" width="14" height="14" stroke="var(--ink)" strokeWidth="2" />
      <path d="M56 67 L128 67" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      {/* možnost B — zaškrtnutá akcentem */}
      <rect x="34" y="84" width="14" height="14" stroke="var(--ink)" strokeWidth="2" />
      <path
        d="M36 90 L40 96 L48 82"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      <path d="M56 91 L142 91" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="square" />
      {/* možnost C */}
      <rect x="34" y="108" width="14" height="14" stroke="var(--ink)" strokeWidth="2" />
      <path d="M56 115 L120 115" stroke="var(--hairline)" strokeWidth="2" strokeLinecap="square" />
      {/* otazníková klávesa v rohu */}
      <rect x="138" y="30" width="30" height="30" fill="var(--key-shadow)" />
      <rect
        x="134"
        y="26"
        width="30"
        height="30"
        rx="4"
        fill="var(--accent)"
        stroke="var(--ink)"
        strokeWidth="2"
      />
      <text
        x="149"
        y="47"
        textAnchor="middle"
        fill="var(--accent-ink)"
        fontSize="18"
        fontWeight="800"
        fontFamily="inherit"
      >
        ?
      </text>
    </svg>
  );
}
