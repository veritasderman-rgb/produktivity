import type { Metadata } from "next";
import Link from "next/link";
import { Keycap } from "@/components/Keycap";

export const metadata: Metadata = {
  title: "O projektu",
  description:
    "Produktivní.cz je osobní projekt Josefa Pavlovice: know-how o produktivitě, které se aktualizuje každý den — člověkem i AI.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="mb-8 flex items-center gap-5">
        <Keycap size={64} />
        <div>
          <p className="eyebrow mb-1 text-accent">O projektu</p>
          <h1 className="display text-[clamp(26px,4vw,40px)]">Kdo za tím stojí</h1>
        </div>
      </div>
      <div className="prose-a">
        <p>
          Jmenuji se <strong>Josef Pavlovic</strong> a produktivitou se zabývám roky —
          nejdřív z nutnosti, pak z fascinace. Postupně jsem své know-how sepsal do
          rozsáhlé příručky: systémy jako GTD a Pomodoro, psychologie práce, výběr
          nástrojů, home office, studium.
        </p>
        <p>
          Jenže doba kráčí rychle. Co platilo před dvěma lety, dnes AI dělá líp,
          rychleji, nebo úplně jinak. Proto vznikl tento web: <strong>živá verze
          příručky</strong>, kde evergreen základy doplňují denní tipy a novinky.
          Část obsahu pomáhá sbírat a připravovat AI — každý kus ale prochází mou
          redakcí, než se k vám dostane.
        </p>
        <h2>Co tu najdete</h2>
        <ul>
          <li><strong>Příručku</strong> — kompletní systém produktivity v kapitolách,</li>
          <li><strong>Tipy &amp; triky</strong> — krátké, okamžitě použitelné zlepšováky,</li>
          <li><strong>AI sekci</strong> — novinky přeložené do praxe,</li>
          <li><strong>Školení</strong> — když chcete know-how předat celému týmu naráz.</li>
        </ul>
        <p>
          Nejlepší způsob, jak zůstat v obraze, je{" "}
          <Link href="/newsletter">týdenní newsletter</Link>. A pokud chcete
          produktivitu zvednout celé firmě, mrkněte na{" "}
          <Link href="/skoleni">školení</Link>.
        </p>
      </div>
    </div>
  );
}
