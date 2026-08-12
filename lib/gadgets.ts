// Kurátorovaný seznam gadgetů pro /gadgety.
// AFFILIATE: až budou schválené partnerské účty (eHub/Alza, Amazon Associates,
// Impact/Logitech…), stačí u položky vyplnit `affiliateUrl` — stránka ho
// automaticky upřednostní před běžným odkazem. Nic jiného se měnit nemusí.

export type GadgetLink = {
  shop: string;
  url: string;
  affiliateUrl?: string;
};

export type Gadget = {
  slug: string;
  name: string;
  nameEn?: string;
  blurb: { cs: string; en: string };
  why: { cs: string; en: string };
  tipSlug?: string; // související tip na webu
  links: { cs: GadgetLink[]; en: GadgetLink[] };
};

export type GadgetCategory = {
  slug: string;
  title: { cs: string; en: string };
  intro: { cs: string; en: string };
  items: Gadget[];
};

const alza = (q: string): GadgetLink => ({
  shop: "Alza",
  url: `https://www.alza.cz/search.htm?exps=${encodeURIComponent(q)}`,
});
const amazon = (q: string): GadgetLink => ({
  shop: "Amazon",
  url: `https://www.amazon.com/s?k=${encodeURIComponent(q)}`,
});

export const gadgetCategories: GadgetCategory[] = [
  {
    slug: "soustredeni",
    title: { cs: "Soustředění", en: "Focus" },
    intro: {
      cs: "Nejdražší, co máte, je pozornost. Tyhle věci ji chrání fyzicky — bez aplikací a notifikací.",
      en: "Your attention is the most expensive thing you own. This gear protects it physically — no apps, no notifications.",
    },
    items: [
      {
        slug: "pomodoro-timer",
        name: "Fyzický Pomodoro timer",
        nameEn: "Physical Pomodoro timer",
        blurb: {
          cs: "Otočná kostka nebo Time Timer s viditelně ubývajícím časem. Otočíte — a jede blok soustředění.",
          en: "A flip cube or a Time Timer with visibly shrinking time. Flip it over and your focus block is running.",
        },
        why: {
          cs: "Hmatatelný časovač funguje líp než další aplikace: vidíte čas mizet a telefon zůstává v šuplíku.",
          en: "A tangible timer beats yet another app: you watch the time melt away and your phone stays in the drawer.",
        },
        tipSlug: "fyzicky-pomodoro-timer",
        links: {
          cs: [alza("time timer kuchyňská minutka kostka")],
          en: [amazon("time timer pomodoro cube")],
        },
      },
      {
        slug: "anc-sluchatka",
        name: "Sluchátka s aktivním potlačením hluku",
        nameEn: "Noise-cancelling headphones",
        blurb: {
          cs: "Sony WH-1000XM5, Bose QuietComfort nebo AirPods Pro — ticho na přání v openspace i doma.",
          en: "Sony WH-1000XM5, Bose QuietComfort or AirPods Pro — silence on demand, in an open office or at home.",
        },
        why: {
          cs: "Jediný gadget, u kterého se investice vrací každý den: hluboká práce i tam, kde to jinak nejde.",
          en: "The one gadget that pays you back daily: deep work even in places where it is otherwise impossible.",
        },
        tipSlug: "noise-cancelling-sluchatka",
        links: {
          cs: [alza("sluchátka aktivní potlačení hluku")],
          en: [amazon("noise cancelling headphones")],
        },
      },
      {
        slug: "denni-svetlo",
        name: "Lampa s denním světlem",
        nameEn: "Daylight lamp",
        blurb: {
          cs: "10 000 luxů na ranní nastartování cirkadiánního rytmu — hlavně v zimě, kdy slunce nestíhá.",
          en: "10,000 lux to kick-start your circadian rhythm in the morning — especially in winter when the sun does not show up.",
        },
        why: {
          cs: "Ranní světlo je nejlevnější „nootropikum“: líp se vstává, líp se spí, stabilnější energie.",
          en: "Morning light is the cheapest “nootropic” there is: easier mornings, better sleep, steadier energy.",
        },
        tipSlug: "svetlo-a-rano",
        links: {
          cs: [alza("lampa denní světlo 10000 lux")],
          en: [amazon("light therapy lamp 10000 lux")],
        },
      },
    ],
  },
  {
    slug: "psani-a-poznamky",
    title: { cs: "Psaní a poznámky", en: "Writing & notes" },
    intro: {
      cs: "Nástroje, kterých se dotýkáte osm hodin denně. Tady se kvalita pozná nejrychleji.",
      en: "The tools you touch eight hours a day. This is where quality shows fastest.",
    },
    items: [
      {
        slug: "eink-tablet",
        name: "E-ink tablet na poznámky",
        nameEn: "E-ink note-taking tablet",
        blurb: {
          cs: "reMarkable, Kindle Scribe nebo Boox: papírový zážitek psaní, digitální archiv a žádné notifikace.",
          en: "reMarkable, Kindle Scribe or Boox: the feel of paper, a digital archive and zero notifications.",
        },
        why: {
          cs: "Poznámky z porad a čtení dlouhých dokumentů bez pokušení „jen mrknout na mail“.",
          en: "Meeting notes and long-document reading without the temptation to “just check email real quick”.",
        },
        tipSlug: "eink-tablet-poznamky",
        links: {
          cs: [alza("e-ink tablet poznámky")],
          en: [amazon("e-ink tablet notes remarkable")],
        },
      },
      {
        slug: "kvalitni-klavesnice",
        name: "Kvalitní klávesnice",
        nameEn: "A proper keyboard",
        blurb: {
          cs: "Logitech MX Keys pro tiché kanceláře, mechanická (Keychron a spol.) pro radost z psaní.",
          en: "Logitech MX Keys for quiet offices, a mechanical board (Keychron and friends) for the joy of typing.",
        },
        why: {
          cs: "Píšete na ní celý den. Rozdíl mezi mizernou a skvělou klávesnicí je rozdíl v únavě rukou i chuti psát.",
          en: "You type on it all day. The gap between a bad and a great keyboard shows up in your hands and your motivation.",
        },
        links: {
          cs: [alza("Logitech MX Keys")],
          en: [amazon("Logitech MX Keys mechanical keyboard")],
        },
      },
      {
        slug: "ergonomicka-mys",
        name: "Ergonomická myš",
        nameEn: "An ergonomic mouse",
        blurb: {
          cs: "Logitech MX Master s horizontálním kolečkem a gesty, nebo vertikální myš proti bolesti zápěstí.",
          en: "Logitech MX Master with a horizontal wheel and gestures, or a vertical mouse to save your wrist.",
        },
        why: {
          cs: "Programovatelná tlačítka + kolečko na palec = desítky ušetřených pohybů denně. Zápěstí poděkuje.",
          en: "Programmable buttons plus a thumb wheel save dozens of movements a day. Your wrist will thank you.",
        },
        links: {
          cs: [alza("Logitech MX Master")],
          en: [amazon("Logitech MX Master 3S")],
        },
      },
    ],
  },
  {
    slug: "pracovni-misto",
    title: { cs: "Pracovní místo", en: "Workspace" },
    intro: {
      cs: "Ergonomie není luxus — je to prevence. Záda a krk si pamatují každý měsíc u špatného stolu.",
      en: "Ergonomics is not a luxury — it is prevention. Your back and neck remember every month at a bad desk.",
    },
    items: [
      {
        slug: "dokovaci-stanice",
        name: "USB-C dokovací stanice",
        nameEn: "USB-C docking station",
        blurb: {
          cs: "Monitor, síť, periferie a nabíjení jedním kabelem. Připojení notebooku za dvě vteřiny.",
          en: "Monitor, network, peripherals and charging through one cable. Your laptop is docked in two seconds.",
        },
        why: {
          cs: "Eliminuje každodenní rituál zapojování čtyř kabelů — malé tření, které se sčítá.",
          en: "Kills the daily four-cable ritual — small friction that compounds.",
        },
        tipSlug: "dokovaci-stanice",
        links: {
          cs: [alza("USB-C dokovací stanice")],
          en: [amazon("USB-C docking station")],
        },
      },
      {
        slug: "monitorove-rameno",
        name: "Monitorové rameno / stojan",
        nameEn: "Monitor arm / stand",
        blurb: {
          cs: "Horní hrana displeje do výšky očí — a stůl najednou o třetinu větší.",
          en: "Top edge of the screen at eye level — and suddenly your desk is a third bigger.",
        },
        why: {
          cs: "Nejlevnější řešení bolesti krku ze sedavé práce. Detail, který řeší roky nepohodlí.",
          en: "The cheapest fix for desk-job neck pain. A detail that solves years of discomfort.",
        },
        tipSlug: "monitor-vyska-oci",
        links: {
          cs: [alza("monitorové rameno")],
          en: [amazon("monitor arm")],
        },
      },
      {
        slug: "vyskove-stavitelny-stul",
        name: "Výškově stavitelný stůl",
        nameEn: "Standing desk",
        blurb: {
          cs: "Střídání sezení a stání během dne. Elektrický s pamětí poloh, ať přepnutí nic nestojí.",
          en: "Alternate sitting and standing through the day. Electric with memory presets, so switching costs nothing.",
        },
        why: {
          cs: "Nejlepší poloha je ta příští: pohyb během dne drží energii i záda.",
          en: "The best posture is the next one: movement during the day keeps both energy and back in shape.",
        },
        tipSlug: "stul-a-pohyb",
        links: {
          cs: [alza("výškově stavitelný stůl elektrický")],
          en: [amazon("electric standing desk")],
        },
      },
    ],
  },
  {
    slug: "na-cesty",
    title: { cs: "Na cesty", en: "On the go" },
    intro: {
      cs: "Druhá sada všeho, co žije v tašce — a nikdy se odtud nevyndavá.",
      en: "A second set of everything that lives in your bag — and never leaves it.",
    },
    items: [
      {
        slug: "gan-nabijecka",
        name: "GaN nabíječka + kabel navíc",
        nameEn: "GaN charger + a spare cable",
        blurb: {
          cs: "Malá, lehká, utáhne notebook i telefon. Jedna u stolu, druhá trvale v tašce.",
          en: "Small, light, powers both laptop and phone. One at the desk, one permanently in the bag.",
        },
        why: {
          cs: "Eliminace celé kategorie starostí za pár stovek — konec přebalování a zapomínání.",
          en: "Eliminates an entire category of worries — no more repacking and forgetting.",
        },
        tipSlug: "druha-nabijecka",
        links: {
          cs: [alza("GaN nabíječka 65W")],
          en: [amazon("GaN charger 65W")],
        },
      },
      {
        slug: "powerbanka",
        name: "Powerbanka s USB-C PD",
        nameEn: "USB-C PD power bank",
        blurb: {
          cs: "Aspoň 20 000 mAh s Power Delivery — dobije telefon několikrát a v nouzi i notebook.",
          en: "At least 20,000 mAh with Power Delivery — charges a phone several times and a laptop in a pinch.",
        },
        why: {
          cs: "Telefon na 5 % je stresor, který jde koupit pryč.",
          en: "A phone at 5% is a stressor you can simply buy away.",
        },
        links: {
          cs: [alza("powerbanka 20000 USB-C PD")],
          en: [amazon("power bank 20000 usb-c pd")],
        },
      },
      {
        slug: "cestovni-sluchatka",
        name: "Špuntová ANC sluchátka",
        nameEn: "ANC earbuds",
        blurb: {
          cs: "Do vlaku a letadla, kde velká sluchátka překážejí. AirPods Pro, Sony WF a spol.",
          en: "For trains and planes where over-ears get in the way. AirPods Pro, Sony WF and friends.",
        },
        why: {
          cs: "Cesta vlakem s potlačením hluku = 2 hodiny soustředěné práce navíc.",
          en: "A train ride with noise cancelling on = two extra hours of focused work.",
        },
        links: {
          cs: [alza("bezdrátová špuntová sluchátka ANC")],
          en: [amazon("wireless earbuds noise cancelling")],
        },
      },
    ],
  },
];
