export function DataDisclaimer() {
  return (
    <aside className="mt-10 border border-hairline-strong bg-surface p-5" aria-label="Upozornění na bezpečnost dat">
      <p className="eyebrow mb-2 text-faint">Bezpečnost dat</p>
      <p className="text-[13.5px] leading-relaxed text-muted">
        Do AI nástrojů nevkládejte osobní údaje, klientská data, hesla ani interní
        dokumenty, pokud to pravidla vaší firmy výslovně nedovolují. Citlivé údaje
        před vložením anonymizujte, používejte pracovní účty s ochranou dat
        (ne osobní) a řiďte se interními směrnicemi a GDPR. Co jednou odešlete,
        už nemáte pod kontrolou.
      </p>
    </aside>
  );
}
