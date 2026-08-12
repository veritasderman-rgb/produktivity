// Slovník pojmů: tooltipy v článcích + stránka /slovnik.
// match = regulární výraz (bez lomítek, case-insensitive) pokrývající i české pády/tvary.
// def: 1–2 věty, srozumitelné laikovi. ZÁKAZ znaků " < > { } v definicích.

export type GlossaryEntry = {
  id: string;
  term: { cs: string; en: string };
  match: { cs: string; en: string };
  def: { cs: string; en: string };
};

export const glossary: GlossaryEntry[] = [];
