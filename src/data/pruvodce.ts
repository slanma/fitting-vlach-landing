/**
 * PRŮVODCE VÝBĚREM HOLE — data a pravidla doporučení.
 *
 * Texty jsou vlastní (ne z ping.com) a schválně obecné. Petr je může upravit:
 * všechno, co zákazník vidí, je v tomhle souboru.
 *
 * FOTKY: nahraj do public/images/hole/<id>.jpg (např. g440-max-driver.jpg)
 * a u modelu doplň `image: "/images/hole/g440-max-driver.jpg"`. Bez fotky se
 * ukáže stylizovaná kresba hole.
 *
 * ŽEBŘÍČEK (`ladder`) je řazený od nejvíc odpouštějící hole po tu, která
 * chce nejvíc techniky. Průvodce podle odpovědí vybere stupeň a ukáže,
 * kam se dá jít dál.
 */

export type ClubKind = "driver" | "dlouhe" | "zeleza" | "wedge" | "putter";
export type Line = "std" | "lady" | "junior";

export type Model = {
  id: string;
  name: string;
  /** Jedna věta — co ta hůl dělá. */
  tagline: string;
  /** Pro koho je. */
  forWho: string;
  /** Kdy je čas přejít na další stupeň žebříčku. */
  nextWhen?: string;
  url: string;
  image?: string;
  badge?: string;
};

const PING = "https://eu.ping.com/en-gb/golf-clubs";

export const MODELS: Record<string, Model> = {
  // --- Drivery (G440: K, MAX, LST, SFT) ---
  "g440-k-driver": {
    id: "g440-k-driver",
    name: "G440 K",
    tagline: "Maximální stabilita — nejvíc odpouští rány mimo střed.",
    forWho: "Pro hráče, kteří chtějí hlavně rovnou ránu bez rozptylu.",
    nextWhen: "Až budete trefovat střed hlavy většinu ran.",
    image: "/images/hole/g440-k-driver.jpg",
    url: `${PING}/drivers/g440-k-driver`,
    badge: "Novinka",
  },
  "g440-max-driver": {
    id: "g440-max-driver",
    name: "G440 MAX",
    tagline: "Nejuniverzálnější driver — délka i odpuštění v rovnováze.",
    forWho: "Pro většinu hráčů, od začátků až po nízký handicap.",
    nextWhen: "Až máte rychlý švih a míč se vám „vznáší“ s velkou rotací.",
    image: "/images/hole/g440-max-driver.jpg",
    url: `${PING}/drivers/g440-max-driver`,
  },
  "g440-lst-driver": {
    id: "g440-lst-driver",
    name: "G440 LST",
    tagline: "Nízká rotace a pronikavý let pro rychlé švihy.",
    forWho: "Pro silné a stabilní hráče, kteří chtějí každý metr navíc.",
    image: "/images/hole/g440-lst-driver.jpg",
    url: `${PING}/drivers/g440-lst-driver`,
  },
  "g440-sft-driver": {
    id: "g440-sft-driver",
    name: "G440 SFT",
    tagline: "Pomáhá srovnat ránu, která uhýbá doprava (slice).",
    forWho: "Pro hráče, kterým míč pravidelně utíká doprava (u praváka).",
    image: "/images/hole/g440-sft-driver.jpg",
    url: `${PING}/drivers/g440-sft-driver`,
  },
  "g-le4-driver": {
    id: "g-le4-driver",
    name: "G Le4",
    tagline: "Dámský driver — lehký, s vysokým letem.",
    forWho: "Pro hráčky, které chtějí snadnou výšku a délku.",
    image: "/images/hole/g-le4-driver.jpg",
    url: `${PING}/drivers/g-le4-driver`,
    badge: "Novinka",
  },
  "prodi-g-driver": {
    id: "prodi-g-driver",
    name: "Prodi G",
    tagline: "Juniorský driver v délkách podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    image: "/images/hole/prodi-g-driver.jpg",
    url: `${PING}/juniors/prodi-g-driver`,
  },

  // --- Dlouhé rány: hybrid, dřeva (MAX, LST, SFT), driving iron ---
  "g440-hybrid": {
    id: "g440-hybrid",
    name: "G440 hybrid",
    tagline: "Náhrada dlouhých želez — odpustí a poletí výš.",
    forWho: "Pro většinu hráčů místo želez 3–5 (lofty 2H–7H).",
    nextWhen: "Až míč z trávy zvedáte bez problémů a chcete víc délky.",
    image: "/images/hole/g440-hybrid.jpg",
    url: `${PING}/hybrids/g440-hybrid`,
  },
  "g440-sft-fairway": {
    id: "g440-sft-fairway",
    name: "G440 SFT dřevo",
    tagline: "Nejsnazší dřevo z trávy, které navíc srovná ránu doprava.",
    forWho: "Pro hráče, kteří hrají dřevo hlavně z fairwaye nebo bojují se slicem.",
    nextWhen: "Až slice zmizí a chcete univerzální dřevo i z odpaliště.",
    image: "/images/hole/g440-sft-fairway.jpg",
    url: `${PING}/fairways/g440-sft-fairway`,
  },
  "g440-max-fairway": {
    id: "g440-max-fairway",
    name: "G440 MAX dřevo",
    tagline: "Univerzální fairwayové dřevo z trávy i z týčka.",
    forWho: "Pro většinu hráčů — pět loftů od 3 do 9.",
    nextWhen: "Až máte rychlý švih a chcete nižší, pronikavější let.",
    image: "/images/hole/g440-max-fairway.jpg",
    url: `${PING}/fairways/g440-max-fairway`,
  },
  "g440-lst-fairway": {
    id: "g440-lst-fairway",
    name: "G440 LST dřevo",
    tagline: "Nižší rotace a víc délky pro rychlé švihy.",
    forWho: "Pro silné hráče, kterým MAX letí zbytečně vysoko.",
    nextWhen: "Pokud chcete místo dřeva přesnou nízkou ránu, zkuste driving iron.",
    image: "/images/hole/g440-lst-fairway.jpg",
    url: `${PING}/fairways/g440-lst-fairway`,
  },
  "idi-driving-iron": {
    id: "idi-driving-iron",
    name: "iDi",
    tagline: "Driving iron — vzhled železa, přesná nízká rána.",
    forWho: "Pro dobré hráče, kteří chtějí kontrolu z odpaliště i proti větru.",
    image: "/images/hole/idi-driving-iron.jpg",
    url: `${PING}/driving-irons/idi`,
    badge: "Novinka",
  },
  "g-le4-fairway": {
    id: "g-le4-fairway",
    name: "G Le4 dřevo / hybrid",
    tagline: "Dámská dřeva a hybridy — lehké, s vysokým letem.",
    forWho: "Pro hráčky.",
    image: "/images/hole/g-le4-fairway.jpg",
    url: `${PING}/fairways/g-le4-fairway`,
    badge: "Novinka",
  },
  "prodi-g-fairway": {
    id: "prodi-g-fairway",
    name: "Prodi G dřevo / hybrid",
    tagline: "Juniorské dlouhé hole podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    image: "/images/hole/prodi-g-fairway.jpg",
    url: `${PING}/juniors/prodi-g-fairway`,
  },

  // --- Železa (od nejvíc odpouštějících po tourová) ---
  "g740-iron": {
    id: "g740-iron",
    name: "G740",
    tagline: "Nejvíc odpouštějící železa s důrazem na délku.",
    forWho: "Pro začínající a rekreační hráče — rány mimo střed nebolí.",
    nextWhen: "Až trefujete střed čím dál častěji a chcete víc kontroly.",
    image: "/images/hole/g740-iron.jpg",
    url: `${PING}/irons/g740-iron`,
    badge: "Novinka",
  },
  "g440-iron": {
    id: "g440-iron",
    name: "G440",
    tagline: "Odpouštějící železa s čistším vzhledem.",
    forWho: "Pro hráče zhruba od handicapu 36 do 15.",
    nextWhen: "Až se dostanete k handicapu kolem 15 a chcete štíhlejší hlavu.",
    image: "/images/hole/g440-iron.jpg",
    url: `${PING}/irons/g440-iron`,
  },
  "i540-iron": {
    id: "i540-iron",
    name: "i540",
    tagline: "Štíhlý vzhled hráčského železa, ale s délkou navíc.",
    forWho: "Pro zlepšující se hráče, kteří chtějí vzhled i výkon.",
    nextWhen: "Až chcete hlavně kontrolu vzdálenosti a tvarování rány.",
    image: "/images/hole/i540-iron.jpg",
    url: `${PING}/irons/i540-iron`,
    badge: "Novinka",
  },
  "i240-iron": {
    id: "i240-iron",
    name: "i240",
    tagline: "Hráčské železo — kontrola, cit a přesné vzdálenosti.",
    forWho: "Pro dobré hráče, kteří trefují střed.",
    nextWhen: "Až hrajete nízký handicap a chcete kované železo.",
    url: `${PING}/irons/i240-iron`,
  },
  "blueprint-s-iron": {
    id: "blueprint-s-iron",
    name: "Blueprint S",
    tagline: "Kované hráčské železo, které přidává trochu odpuštění.",
    forWho: "Pro velmi dobré hráče s nízkým handicapem.",
    nextWhen: "Nejvyšší stupeň: tourový blade Blueprint T.",
    image: "/images/hole/blueprint-s-iron.jpg",
    url: `${PING}/irons/blueprint-s-iron`,
  },
  "blueprint-t-iron": {
    id: "blueprint-t-iron",
    name: "Blueprint T",
    tagline: "Tourový blade — maximální cit a tvarování rány.",
    forWho: "Pro špičkové hráče, kteří trefují střed téměř vždy.",
    image: "/images/hole/blueprint-t-iron.jpg",
    url: `${PING}/irons/blueprint-t-iron`,
  },
  "g-le4-iron": {
    id: "g-le4-iron",
    name: "G Le4 železa",
    tagline: "Dámská železa — lehká, s vysokým letem.",
    forWho: "Pro hráčky.",
    image: "/images/hole/g-le4-iron.jpg",
    url: `${PING}/irons/g-le4-iron`,
    badge: "Novinka",
  },
  "prodi-g-irons": {
    id: "prodi-g-irons",
    name: "Prodi G železa",
    tagline: "Juniorská železa podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    image: "/images/hole/prodi-g-irons.jpg",
    url: `${PING}/juniors/prodi-g-irons`,
  },

  // --- Wedge ---
  "bunkr-wedge": {
    id: "bunkr-wedge",
    name: "BunkR",
    tagline: "Wedge postavený na vyhrání bunkru na první pokus.",
    forWho: "Pro hráče, pro které je písek noční můra.",
    nextWhen: "Až se bunkru přestanete bát, přejděte na s259.",
    url: `${PING}/wedges/bunkr-wedge`,
  },
  "s259-wedge": {
    id: "s259-wedge",
    name: "s259",
    tagline: "Nejnovější wedge PING — spin a kontrola, šest grindů.",
    forWho: "Pro hráče všech úrovní; loft a grind vybereme na fittingu.",
    image: "/images/hole/s259-wedge.jpg",
    url: `${PING}/wedges/s259-wedge`,
    badge: "Novinka",
  },
  "g-le4-wedge": {
    id: "g-le4-wedge",
    name: "G Le4 wedge (PW, UW, SW)",
    tagline: "Dámské wedge ze sady G Le4 — lehké a snadno hratelné.",
    forWho: "Pro hráčky.",
    image: "/images/hole/g-le4-wedge.jpg",
    url: `${PING}/irons/g-le4-iron`,
    badge: "Novinka",
  },

  // --- Puttery (Scottsdale TEC podle pohybu putteru) ---
  "putter-rovne": {
    id: "putter-rovne",
    name: "Scottsdale TEC Hayden / Ally Blue Onset",
    tagline: "Stabilní mallet pro rovný pohyb tam a zpět.",
    forWho: "Pro hráče, jejichž putter jde rovně a chtějí jistotu na krátkých puttech.",
    image: "/images/hole/putter-rovne.jpg",
    url: `${PING}/putters`,
    badge: "Novinka",
  },
  "putter-oblouk": {
    id: "putter-oblouk",
    name: "Scottsdale TEC Ketsch Onset / Ally Blue H",
    tagline: "Mallet vyvážený pro mírně obloukový pohyb.",
    forWho: "Pro hráče, jejichž putter se pohybuje v mírném oblouku.",
    image: "/images/hole/putter-oblouk.jpg",
    url: `${PING}/putters`,
    badge: "Novinka",
  },
  "putter-velky-oblouk": {
    id: "putter-velky-oblouk",
    name: "Scottsdale TEC Ketsch 4",
    tagline: "Mallet s krkem Anser pro výrazně obloukový pohyb.",
    forWho: "Pro hráče, jejichž putter se výrazně otevírá a zavírá.",
    image: "/images/hole/putter-velky-oblouk.jpg",
    url: `${PING}/putters`,
    badge: "Novinka",
  },
  "g-le4-putter": {
    id: "g-le4-putter",
    name: "G Le4 puttery (Anser 2D, Louise, Oslo)",
    tagline: "Dámské puttery v délkách a vahách pro hráčky.",
    forWho: "Pro hráčky.",
    image: "/images/hole/g-le4-putter.jpg",
    url: `${PING}/womens`,
    badge: "Novinka",
  },
  "prodi-g-putters": {
    id: "prodi-g-putters",
    name: "Prodi G puttery",
    tagline: "Juniorské puttery podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    image: "/images/hole/prodi-g-putters.jpg",
    url: `${PING}/juniors/prodi-g-putters`,
  },
};

// ---------------------------------------------------------------------------
// Otázky
// ---------------------------------------------------------------------------

export type Option = { id: string; label: string; hint?: string; level?: number };
export type Question = { id: string; title: string; options: Option[] };

export const KINDS: { id: ClubKind; label: string; hint: string }[] = [
  { id: "driver", label: "Odpaliště", hint: "Delší a rovnější rána driverem" },
  { id: "dlouhe", label: "Dlouhé rány", hint: "Dřeva a hybridy z fairwaye" },
  { id: "zeleza", label: "Rány na green", hint: "Železa ze 100–180 m" },
  { id: "wedge", label: "Krátká hra", hint: "Čipy, pitche a bunkry" },
  { id: "putter", label: "Patování", hint: "Méně patů na jamku" },
];

export const LINES: Option[] = [
  { id: "std", label: "Pro mě", hint: "Dospělý hráč" },
  { id: "lady", label: "Pro hráčku", hint: "Dámská řada G Le — lehčí hole" },
  { id: "junior", label: "Pro dítě", hint: "Juniorská řada Prodi G" },
];

const HANDICAP: Question = {
  id: "hcp",
  title: "Jak na tom jste s handicapem?",
  options: [
    { id: "zacinam", label: "Začínám", hint: "Bez handicapu nebo 54–37", level: 0 },
    { id: "36", label: "36–19", hint: "Hraju pravidelně", level: 1 },
    { id: "18", label: "18–10", hint: "Dobrý rekreační hráč", level: 2 },
    { id: "9", label: "Pod 10", hint: "Zkušený hráč", level: 3 },
  ],
};

export const QUESTIONS: Record<ClubKind, Question[]> = {
  driver: [
    HANDICAP,
    {
      id: "smer",
      title: "Kam vám většinou letí míč z odpaliště?",
      options: [
        { id: "doprava", label: "Utíká doprava", hint: "Slice (u praváka)" },
        { id: "ruzne", label: "Pokaždé jinam", hint: "Velký rozptyl" },
        { id: "kratce", label: "Rovně, ale krátce", hint: "Chybí délka" },
        { id: "dobre", label: "Rovně a daleko", hint: "Chci ještě víc" },
      ],
    },
    {
      id: "delka",
      title: "Kolik zhruba doletíte driverem?",
      options: [
        { id: "170", label: "Do 170 m", level: 0 },
        { id: "210", label: "170–210 m", level: 1 },
        { id: "240", label: "210–240 m", level: 2 },
        { id: "250", label: "Přes 240 m", level: 3 },
      ],
    },
  ],
  dlouhe: [
    HANDICAP,
    {
      id: "zvednout",
      title: "Jak se vám daří zvednout míč dlouhou holí z trávy?",
      options: [
        { id: "nejde", label: "Spíš ne", hint: "Míč letí nízko nebo po zemi", level: 0 },
        { id: "obcas", label: "Občas", hint: "Někdy ano, někdy ne", level: 1 },
        { id: "vetsinou", label: "Většinou ano", level: 2 },
        { id: "vzdy", label: "Bez problémů", hint: "Chci spíš nižší, přesnou ránu", level: 3 },
      ],
    },
    {
      id: "smer",
      title: "Uhýbají vám dlouhé rány doprava?",
      options: [
        { id: "doprava", label: "Ano, často", hint: "Slice (u praváka)" },
        { id: "ne", label: "Ne, spíš ne" },
      ],
    },
  ],
  zeleza: [
    HANDICAP,
    {
      id: "stred",
      title: "Jak často trefíte železem střed?",
      options: [
        { id: "malokdy", label: "Málokdy", level: 0 },
        { id: "obcas", label: "Občas", level: 1 },
        { id: "vetsinou", label: "Většinou", level: 2 },
        { id: "skoro-vzdy", label: "Skoro vždy", level: 3 },
      ],
    },
    {
      id: "priorita",
      title: "Co je pro vás důležitější?",
      options: [
        { id: "delka", label: "Délka a jistota", hint: "Ať to hlavně doletí", level: -1 },
        { id: "rovnovaha", label: "Obojí", hint: "Délka i kontrola", level: 0 },
        { id: "kontrola", label: "Kontrola", hint: "Přesné vzdálenosti a tvar rány", level: 1 },
      ],
    },
  ],
  wedge: [
    {
      id: "problem",
      title: "Co vás kolem greenu trápí nejvíc?",
      options: [
        { id: "cipy", label: "Čipy", hint: "Hrabu do země nebo přestřelím green" },
        { id: "bunkr", label: "Bunkry", hint: "Z písku se nedostanu napoprvé" },
        { id: "spin", label: "Vzdálenost a spin", hint: "Chci dávat míč blíž k jamce" },
        { id: "nic", label: "Nic zásadního", hint: "Chci víc možností a grindů" },
      ],
    },
    HANDICAP,
  ],
  putter: [
    {
      id: "pohyb",
      title: "Jak se pohybuje váš putter?",
      options: [
        { id: "rovne", label: "Rovně tam a zpět", hint: "Hlava jde po přímce" },
        { id: "oblouk", label: "V mírném oblouku" },
        { id: "velky", label: "Ve výrazném oblouku", hint: "Hlava se otevírá a zavírá" },
        { id: "nevim", label: "Nevím", hint: "Změříme na fittingu" },
      ],
    },
    {
      id: "chyba",
      title: "Kde ztrácíte nejvíc ran?",
      options: [
        { id: "kratke", label: "Krátké putty", hint: "Do 2 metrů" },
        { id: "dlouhe", label: "Dlouhé putty", hint: "Neodhadnu sílu" },
        { id: "oboji", label: "Obojí" },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Žebříčky a výběr doporučení
// ---------------------------------------------------------------------------

export const LADDERS: Record<ClubKind, string[]> = {
  driver: ["g440-k-driver", "g440-max-driver", "g440-lst-driver"],
  dlouhe: [
    "g440-hybrid",
    "g440-sft-fairway",
    "g440-max-fairway",
    "g440-lst-fairway",
    "idi-driving-iron",
  ],
  zeleza: [
    "g740-iron",
    "g440-iron",
    "i540-iron",
    "i240-iron",
    "blueprint-s-iron",
    "blueprint-t-iron",
  ],
  wedge: ["bunkr-wedge", "s259-wedge"],
  putter: ["putter-rovne", "putter-oblouk", "putter-velky-oblouk"],
};

export type Answers = Record<string, string>;

export type Recommendation = {
  model: Model;
  /** Žebříček k zobrazení a pozice doporučené hole v něm. */
  ladder: Model[];
  index: number;
  /** Proč — krátké věty složené z odpovědí. */
  why: string[];
  /** Doplňková možnost (např. SFT proti slice). */
  alternative?: Model;
};

const lv = (kind: ClubKind, qid: string, a: Answers) =>
  QUESTIONS[kind].find((q) => q.id === qid)?.options.find((o) => o.id === a[qid])?.level ?? 0;

const clamp = (n: number, max: number) => Math.max(0, Math.min(max, Math.round(n)));

function pack(kind: ClubKind, index: number, why: string[], alternative?: string): Recommendation {
  const ladder = LADDERS[kind].map((id) => MODELS[id]!);
  return {
    model: ladder[index]!,
    ladder,
    index,
    why,
    ...(alternative ? { alternative: MODELS[alternative]! } : {}),
  };
}

function single(id: string, why: string[]): Recommendation {
  return { model: MODELS[id]!, ladder: [MODELS[id]!], index: 0, why };
}

export function recommend(kind: ClubKind, line: Line, a: Answers): Recommendation {
  // Juniorská a dámská řada mají vlastní hole — žebříček je tam jeden stupeň.
  if (line === "junior") {
    const id = {
      driver: "prodi-g-driver",
      dlouhe: "prodi-g-fairway",
      zeleza: "prodi-g-irons",
      wedge: "prodi-g-irons",
      putter: "prodi-g-putters",
    }[kind];
    return single(id, [
      "Juniorské hole mají délku, váhu i tuhost podle výšky a síly dítěte.",
      "Na fittingu dítě změříme, ať hůl nebrzdí jeho pohyb.",
    ]);
  }
  if (line === "lady") {
    const id = {
      driver: "g-le4-driver",
      dlouhe: "g-le4-fairway",
      zeleza: "g-le4-iron",
      wedge: "g-le4-wedge",
      putter: "g-le4-putter",
    }[kind];
    return single(id, [
      "Dámská řada G Le je lehčí a staví míč výš — přesně to většině hráček přidá délku.",
      "Délku a grip doladíme na fittingu podle výšky a rukou.",
    ]);
  }

  if (kind === "driver") {
    const hcp = lv(kind, "hcp", a);
    const len = lv(kind, "delka", a);
    const why: string[] = [];
    let i: number;
    if (len === 0 || a["smer"] === "ruzne" || hcp <= 1) {
      i = 0;
      why.push("Největší rezervu máte v rozptylu — nejstabilnější hlava srovná i rány mimo střed.");
    } else if (len >= 3 && hcp >= 2 && a["smer"] === "dobre") {
      i = 2;
      why.push("Máte rychlý a stabilní švih — nižší rotace přidá metry.");
    } else {
      i = 1;
      why.push("Univerzální volba, která přidá délku a odpustí chyby.");
    }
    if (a["smer"] === "doprava")
      why.push(
        "Míč vám utíká doprava — verze SFT tu chybu přímo koriguje, porovnáme obě na fittingu.",
      );
    if (a["smer"] === "kratce")
      why.push("Chybějící délku často vyřeší správný loft a shaft — to změříme.");
    return pack(kind, i, why, a["smer"] === "doprava" ? "g440-sft-driver" : undefined);
  }

  if (kind === "dlouhe") {
    const score = (lv(kind, "hcp", a) + lv(kind, "zvednout", a) * 1.4) / 2.4; // 0–3
    const slice = a["smer"] === "doprava";
    // 0 hybrid · 1 SFT dřevo · 2 MAX dřevo · 3 LST dřevo · 4 iDi
    let i = score >= 2.8 ? 4 : clamp(score, 3);
    if (slice && i >= 1 && i <= 2) i = 1; // slice z trávy → SFT
    const why = [
      i === 0
        ? "Hybrid je nejjednodušší cesta, jak dostat dlouhou ránu do vzduchu."
        : i === 1
          ? "SFT je nejsnazší dřevo z trávy a pomáhá srovnat ránu doprava."
          : i <= 3
            ? "Míč zvedáte — fairwayové dřevo vám přidá délku z trávy i z odpaliště."
            : "Jste silný hráč — driving iron dá nízkou, přesnou ránu i proti větru.",
    ];
    if (slice && i !== 1) why.push("Na slice existuje dřevo SFT, které ránu srovná.");
    return pack(kind, i, why, slice && i !== 1 ? "g440-sft-fairway" : undefined);
  }

  if (kind === "zeleza") {
    const hcp = lv(kind, "hcp", a);
    const hit = lv(kind, "stred", a);
    const prio = lv(kind, "priorita", a);
    // 0 G740 · 1 G440 · 2 i540 · 3 i240 · 4 Blueprint S · 5 Blueprint T (jen špička s důrazem na kontrolu)
    let i = clamp(Math.floor(((hcp + hit) / 2) * 1.25 + prio * 0.5 + 0.4), 4);
    if (hcp === 3 && hit === 3 && prio === 1) i = 5;
    const why = [
      i <= 1
        ? "Odpouštějící hlava vám vrátí délku i u ran, které netrefíte přesně."
        : i <= 3
          ? "Trefujete čím dál líp — štíhlejší hlava přidá kontrolu a cit."
          : "Trefujete střed — kované železo vám dá maximum kontroly.",
      "Na fittingu nastavíme délku a lie úhel — u želez rozhodují nejvíc.",
    ];
    return pack(kind, i, why);
  }

  if (kind === "wedge") {
    if (a["problem"] === "bunkr")
      return pack(kind, 0, ["Široká spodní hrana vás z písku vyveze napoprvé."]);
    const why =
      a["problem"] === "cipy"
        ? [
            "Na čipy pomůže wedge se správným loftem a bounce — hůl pak klouže po trávě a nehrabe.",
            "Loft a grind vybereme na fittingu podle toho, jak čipujete.",
          ]
        : [
            "Správný loft a grind vám pomůže dávat míč blíž k jamce.",
            "Mezery mezi lofty navážeme na vaše železa.",
          ];
    return pack(kind, 1, why);
  }

  // putter
  const i = a["pohyb"] === "velky" ? 2 : a["pohyb"] === "oblouk" ? 1 : 0;
  const why = [
    a["pohyb"] === "nevim"
      ? "Typ pohybu změříme na fittingu — zatím doporučujeme model pro rovný pohyb."
      : "Tvar hlavy má odpovídat tomu, jak se váš putter pohybuje.",
  ];
  if (a["chyba"] === "kratke" || a["chyba"] === "oboji")
    why.push("Na krátké putty pomůže víc stability a lepší zarovnání.");
  if (a["chyba"] === "dlouhe" || a["chyba"] === "oboji")
    why.push("Odhad síly zlepší správná délka a váha putteru.");
  return pack(kind, i, why);
}

// ---------------------------------------------------------------------------
// Co doladíme na fittingu — průvodce vybere jen hlavu, zbytek se měří.
// U driveru a dřev se lie schválně neuvádí.
// ---------------------------------------------------------------------------

export type FitStep = { label: string; text: string };

const HEAD: FitStep = {
  label: "Hlava",
  text: "Model, který sedí k vaší hře — ten jste právě vybrali v průvodci.",
};
const GRIP: FitStep = {
  label: "Grip",
  text: "Tloušťka gripu podle velikosti ruky. Moc tenký nebo tlustý grip nenápadně otevírá či zavírá plochu.",
};
const LONG: FitStep[] = [
  HEAD,
  {
    label: "Loft",
    text: "Úhel plochy. Správný loft dá míči ideální výšku letu — a ta rozhoduje o délce rány.",
  },
  {
    label: "Shaft",
    text: "Tvrdost a váha podle rychlosti a rytmu vašeho švihu. Nevhodný shaft umí poslat míč doprava i doleva.",
  },
  {
    label: "Délka",
    text: "Delší hůl neznamená delší ránu. Správná délka znamená častěji střed plochy.",
  },
  GRIP,
];

export const FIT_STEPS: Record<ClubKind, FitStep[]> = {
  driver: LONG,
  dlouhe: LONG,
  zeleza: [
    HEAD,
    {
      label: "Shaft",
      text: "Ocel, nebo grafit? Tvrdost a váha podle švihu — u želez rozhoduje o přesnosti vzdáleností.",
    },
    { label: "Délka", text: "Podle výšky a délky paží, aby se vám nad míčem dobře stálo." },
    {
      label: "Lie",
      text: "Úhel mezi shaftem a zemí. Jeden stupeň vedle a míč odchází bokem, i když je rána dobrá.",
    },
    GRIP,
  ],
  wedge: [
    HEAD,
    {
      label: "Loft a bounce",
      text: "Mezery mezi wedgemi navážeme na vaše železa, bounce vybereme podle trávy a vašeho pohybu.",
    },
    {
      label: "Délka",
      text: "Aby wedge seděl do sestavy a kontrola krátkých ran byla stejná jako u želez.",
    },
    { label: "Lie", text: "Spodní hrana musí ležet na zemi rovně, jinak se krátká rána stáčí." },
    GRIP,
  ],
  putter: [
    {
      label: "Hlava",
      text: "Tvar hlavy podle toho, jak se váš putter pohybuje — ten jste vybrali v průvodci.",
    },
    {
      label: "Délka",
      text: "Správná délka postaví oči přímo nad míč — pak míříte tam, kam se díváte.",
    },
    { label: "Lie", text: "Aby spodní hrana ležela na greenu celou délkou a míč se rozjel rovně." },
    { label: "Váha hlavy", text: "Těžší hlava uklidní pohyb, lehčí dá víc citu na dlouhé putty." },
    { label: "Grip", text: "Tvar a tloušťka gripu ovlivní, jak moc pracují zápěstí." },
  ],
};

// ---------------------------------------------------------------------------
// Pravák / levák — u leváka se otočí směry v textech (slice jde doleva).
// ---------------------------------------------------------------------------

export type Hand = "R" | "L" | "?";

export const HANDS: { id: Hand; label: string; hint: string }[] = [
  { id: "R", label: "Pravák", hint: "K cíli stojím levým bokem" },
  { id: "L", label: "Levák", hint: "K cíli stojím pravým bokem" },
  {
    id: "?",
    label: "Ještě nevím",
    hint: "Většinou to sedí s rukou, kterou házíte míčkem. Ověříme na fittingu.",
  },
];

/** Pro leváka prohodí doprava ↔ doleva a „u praváka“ → „u leváka“. Pro praváka vrátí text beze změny. */
export function mirror(text: string, hand: Hand | null | undefined): string {
  if (hand !== "L") return text;
  return text
    .replace(/Doprava/g, "\u0001")
    .replace(/doprava/g, "\u0002")
    .replace(/Doleva/g, "Doprava")
    .replace(/doleva/g, "doprava")
    .replace(/\u0001/g, "Doleva")
    .replace(/\u0002/g, "doleva")
    .replace(/u praváka/g, "u leváka");
}
