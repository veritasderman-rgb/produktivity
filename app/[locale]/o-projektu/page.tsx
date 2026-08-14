import type { Metadata } from "next";
import Link from "next/link";
import { Keycap } from "@/components/Keycap";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "O projektu",
    description:
      "Produktivní.cz je osobní projekt Josefa Pavlovice: know-how o produktivitě, které se aktualizuje každý den — člověkem i AI.",
    eyebrow: "O projektu",
    heading: "Kdo za tím stojí",
    bio1A: "Jmenuji se ",
    bio1Name: "Josef Pavlovic",
    bio1B: " a produktivitou se zabývám roky — nejdřív z nutnosti, pak z fascinace. Prošel jsem prostředími, kde se bez systému utopíte během týdne: vedl jsem resortní tým Pirátů pro zdravotnictví, působil jako ",
    bio1Role: "náměstek ministra zdravotnictví",
    bio1C: " a člen správní rady VZP, dnes vedu marketing mezinárodního lázeňského clusteru Ensana. Vedle toho stavím datové projekty jako ",
    bio1D: " — a školím týmy i jednotlivce v time managementu a GTD.",
    bio2A: "Své know-how jsem postupně sepsal do rozsáhlé příručky: systémy jako GTD a Pomodoro, psychologie práce, výběr nástrojů, home office, studium. Jenže doba kráčí rychle. Co platilo před dvěma lety, dnes AI dělá líp, rychleji, nebo úplně jinak. Proto vznikl tento web: ",
    bio2Strong: "živá verze příručky",
    bio2B: ", kde evergreen základy doplňují denní tipy a novinky. Většinu textů píše Ctrl — AI redaktor, kterého jsem si k tomu vycvičil — a každý kus prochází mou redakcí, než se k vám dostane.",
    ctrlTitle: "Kdo je Ctrl",
    ctrl1: "Ctrl je umělá inteligence, která pro tenhle web píše. Jméno má po klávese: stejně jako ona sama nic neudělá, dokud ji nezmáčkne člověk. Dostává ode mě zadání a podklady, píše návody, překládá je do angličtiny, hlídá odkazy a generuje ilustrace.",
    ctrl2A: "Dělba práce je pevná: ",
    ctrl2Strong: "Ctrl navrhuje, já schvaluji",
    ctrl2B: ". Témata zadávám já, hotové texty čtu a schvaluji před vydáním já a odpovědnost za všechno, co tu je, nesu já. Když Ctrl něco splete — a AI se plete — je to moje chyba, že jsem to pustil ven. Najdete-li chybu, napište mi.",
    ctrl3: "Proč to říkám takhle otevřeně? Protože stejný přístup radí celý tenhle web: AI je skvělý nástroj v rukou člověka, který kontroluje výsledek. Bylo by zvláštní to učit a sám to nedodržovat.",
    bio3A: "Víc o mně, mých projektech a tom, co zrovna dělám, najdete na ",
    bio3B: ". Napsat mi můžete na ",
    bio3C: ".",
    whatTitle: "Co tu najdete",
    what: [
      { strong: "Příručku", rest: " — kompletní systém produktivity v kapitolách," },
      { strong: "Tipy & triky", rest: " — důkladné, okamžitě použitelné zlepšováky," },
      { strong: "AI sekci", rest: " — novinky přeložené do praxe," },
      { strong: "Školení", rest: " — když chcete know-how předat celému týmu naráz." },
    ],
    outroA: "Nejlepší způsob, jak zůstat v obraze, je ",
    outroNewsletter: "týdenní newsletter",
    outroB: ". A pokud chcete produktivitu zvednout celé firmě, mrkněte na ",
    outroTraining: "školení",
    outroC: ".",
  },
  en: {
    title: "About",
    description:
      "Produktivni.cz is a personal project by Josef Pavlovic: productivity know-how updated every day — by a human and by AI.",
    eyebrow: "About",
    heading: "Who is behind this",
    bio1A: "My name is ",
    bio1Name: "Josef Pavlovic",
    bio1B: " and I have worked on productivity for years — first out of necessity, then out of fascination. I have spent time in places where you drown within a week without a system: I led the Czech Pirate Party's healthcare policy team, served as ",
    bio1Role: "Deputy Minister of Health",
    bio1C: " and sat on the board of the Czech national health insurer VZP. Today I run marketing for Ensana, an international spa cluster. Alongside that I build data projects such as ",
    bio1D: " — and I train teams and individuals in time management and GTD.",
    bio2A: "Over the years I wrote my know-how down into an extensive handbook: systems like GTD and Pomodoro, the psychology of work, choosing tools, the home office, studying. But the world moves fast. What held true two years ago is now something AI does better, faster, or in a completely different way. That is why this site exists: ",
    bio2Strong: "a living version of the handbook",
    bio2B: ", where the evergreen foundations are complemented by daily tips and news. Most of the writing is done by Ctrl — the AI editor I trained for the job — and every piece passes through my editing before it reaches you.",
    ctrlTitle: "Who is Ctrl",
    ctrl1: "Ctrl is the artificial intelligence that writes for this site. It is named after the key: just like the key, it does nothing until a human presses it. It gets briefs and source material from me, writes the guides, translates them into English, checks the links and generates the illustrations.",
    ctrl2A: "The division of labour is fixed: ",
    ctrl2Strong: "Ctrl drafts, I approve",
    ctrl2B: ". I pick the topics, I read and approve every text before it goes out, and I carry the responsibility for everything published here. When Ctrl gets something wrong — and AI does get things wrong — it is my fault for letting it through. If you spot a mistake, write to me.",
    ctrl3: "Why say this so openly? Because it is exactly what this whole site teaches: AI is a great tool in the hands of a human who checks the result. It would be strange to teach that and not practice it.",
    bio3A: "You will find more about me, my projects and what I am working on right now at ",
    bio3B: ". You can write to me at ",
    bio3C: ".",
    whatTitle: "What you will find here",
    what: [
      { strong: "The handbook", rest: " — the complete productivity system, chapter by chapter," },
      { strong: "Tips & tricks", rest: " — thorough, immediately usable improvements," },
      { strong: "The AI section", rest: " — news translated into practice," },
      { strong: "Training", rest: " — for when you want the know-how handed to a whole team at once." },
    ],
    outroA: "The best way to keep up is the ",
    outroNewsletter: "weekly newsletter",
    outroB: ". And if you want to lift the whole company’s productivity, take a look at the ",
    outroTraining: "training",
    outroC: ".",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://produktivni.cz/o-projektu";
  const enUrl = "https://productive.tips/o-projektu";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <div className="mb-8 flex items-center gap-5">
        <Keycap size={64} />
        <div>
          <p className="eyebrow mb-1 text-faint">{t.eyebrow}</p>
          <h1 className="display text-[clamp(26px,4vw,40px)]">{t.heading}</h1>
        </div>
      </div>
      <div className="prose-a">
        <p>
          {t.bio1A}
          <strong>{t.bio1Name}</strong>
          {t.bio1B}
          <strong>{t.bio1Role}</strong>
          {t.bio1C}
          <a href="https://skorezdravotnictvi.cz" target="_blank" rel="noopener noreferrer">
            SkoreZdravotnictvi.cz
          </a>
          {t.bio1D}
        </p>
        <p>
          {t.bio2A}
          <strong>{t.bio2Strong}</strong>
          {t.bio2B}
        </p>
        <p>
          {t.bio3A}
          <a href="https://josefpavlovic.cz" target="_blank" rel="noopener noreferrer">
            josefpavlovic.cz
          </a>
          {t.bio3B}
          <a href="mailto:josef@josefpavlovic.cz">josef@josefpavlovic.cz</a>
          {t.bio3C}
        </p>
        <h2>{t.ctrlTitle}</h2>
        <p>{t.ctrl1}</p>
        <p>
          {t.ctrl2A}
          <strong>{t.ctrl2Strong}</strong>
          {t.ctrl2B}
        </p>
        <p>{t.ctrl3}</p>
        <h2>{t.whatTitle}</h2>
        <ul>
          {t.what.map((w) => (
            <li key={w.strong}>
              <strong>{w.strong}</strong>
              {w.rest}
            </li>
          ))}
        </ul>
        <p>
          {t.outroA}
          <Link href={p("/newsletter")}>{t.outroNewsletter}</Link>
          {t.outroB}
          <Link href={p("/skoleni")}>{t.outroTraining}</Link>
          {t.outroC}
        </p>
      </div>
    </div>
  );
}
