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
  // --- Drivery ---
  "g440-max-hl-driver": {
    id: "g440-max-hl-driver",
    name: "G440 MAX HL",
    tagline: "Lehčí driver, který míč snadno dostane do vzduchu.",
    forWho: "Pro klidnější švih, kdy míč letí nízko nebo krátce.",
    nextWhen: "Až driverem doletíte pravidelně přes 200 m.",
    url: `${PING}/drivers/g440-max-hl-driver`,
  },
  "g440-k-driver": {
    id: "g440-k-driver",
    name: "G440 K",
    tagline: "Maximální stabilita — odpustí i rány mimo střed.",
    forWho: "Pro hráče, kteří chtějí hlavně rovnou ránu bez rozptylu.",
    nextWhen: "Až budete trefovat střed hlavy většinu ran.",
    url: `${PING}/drivers/g440-k-driver`,
    badge: "Novinka",
  },
  "g440-max-driver": {
    id: "g440-max-driver",
    name: "G440 MAX",
    tagline: "Nejuniverzálnější driver — délka i odpuštění v rovnováze.",
    forWho: "Pro většinu hráčů od začátků až po single handicap.",
    nextWhen: "Až máte rychlý švih a míč se vám spíš „vznáší“ s velkou rotací.",
    url: `${PING}/drivers/g440-max-driver`,
  },
  "g440-lst-driver": {
    id: "g440-lst-driver",
    name: "G440 LST",
    tagline: "Nízká rotace a pronikavý let pro rychlé švihy.",
    forWho: "Pro silné a stabilní hráče, kteří chtějí každý metr navíc.",
    url: `${PING}/drivers/g440-lst-driver`,
  },
  "g440-sft-driver": {
    id: "g440-sft-driver",
    name: "G440 SFT",
    tagline: "Pomáhá srovnat ránu, která uhýbá doprava (slice).",
    forWho: "Pro hráče, kterým míč pravidelně utíká doprava (u praváka).",
    nextWhen: "Až slice zmizí, vyzkoušejte G440 MAX.",
    url: `${PING}/drivers/g440-sft-driver`,
  },
  "g-le4-driver": {
    id: "g-le4-driver",
    name: "G Le4",
    tagline: "Dámský driver — lehký, s vysokým letem.",
    forWho: "Pro hráčky, které chtějí snadnou výšku a délku.",
    url: `${PING}/drivers/g-le4-driver`,
    badge: "Novinka",
  },
  "prodi-g-driver": {
    id: "prodi-g-driver",
    name: "Prodi G",
    tagline: "Juniorský driver v délkách podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    url: `${PING}/juniors/prodi-g-driver`,
  },

  // --- Dlouhé rány: hybridy, dřeva, driving irony ---
  "g440-hl-hybrid": {
    id: "g440-hl-hybrid",
    name: "G440 HL hybrid",
    tagline: "Nejsnazší dlouhá rána z trávy — lehký a vysoký let.",
    forWho: "Pro klidnější švih a hráče, kterým dlouhá železa nejdou.",
    nextWhen: "Až míč z trávy zvedáte bez problémů.",
    url: `${PING}/hybrids/g440-hl-hybrid`,
  },
  "g440-hybrid": {
    id: "g440-hybrid",
    name: "G440 hybrid",
    tagline: "Náhrada dlouhých želez — odpustí a poletí výš.",
    forWho: "Pro většinu hráčů místo želez 3–5.",
    nextWhen: "Až chcete víc délky z fairwaye a z odpaliště.",
    url: `${PING}/hybrids/g440-hybrid`,
  },
  "g440-max-fairway": {
    id: "g440-max-fairway",
    name: "G440 MAX dřevo",
    tagline: "Univerzální fairwayové dřevo z trávy i z týčka.",
    forWho: "Pro hráče, kteří chtějí druhou nejdelší hůl v bagu.",
    nextWhen: "Až máte rychlý švih a chcete nižší, pronikavější let.",
    url: `${PING}/fairways/g440-max-fairway`,
  },
  "g440-lst-fairway": {
    id: "g440-lst-fairway",
    name: "G440 LST dřevo",
    tagline: "Nižší rotace a víc kontroly pro silné hráče.",
    forWho: "Pro rychlé švihy, kterým MAX letí zbytečně vysoko.",
    nextWhen: "Pokud chcete místo dřeva přesnou nízkou ránu, zkuste driving iron.",
    url: `${PING}/fairways/g440-lst-fairway`,
  },
  icrossover: {
    id: "icrossover",
    name: "iCrossover",
    tagline: "Driving iron — vzhled železa, odpuštění hybridu.",
    forWho: "Pro dobré hráče, kteří chtějí nízkou přesnou ránu proti větru.",
    url: `${PING}/driving-irons/icrossover`,
  },
  "g440-sft-fairway": {
    id: "g440-sft-fairway",
    name: "G440 SFT dřevo",
    tagline: "Dřevo, které pomáhá proti ráně doprava.",
    forWho: "Pro hráče se slicem i u dlouhých ran.",
    url: `${PING}/fairways/g440-sft-fairway`,
  },
  "g-le4-fairway": {
    id: "g-le4-fairway",
    name: "G Le4 dřevo",
    tagline: "Dámské dřevo — lehké, s vysokým letem.",
    forWho: "Pro hráčky.",
    url: `${PING}/fairways/g-le4-fairway`,
    badge: "Novinka",
  },
  "prodi-g-fairway": {
    id: "prodi-g-fairway",
    name: "Prodi G dřevo / hybrid",
    tagline: "Juniorské dlouhé hole podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    url: `${PING}/juniors/prodi-g-fairway`,
  },

  // --- Železa ---
  "g440-hl-iron": {
    id: "g440-hl-iron",
    name: "G440 HL",
    tagline: "Lehká železa, která míč snadno zvednou.",
    forWho: "Pro klidnější švih a hráče, kterým železa letí nízko.",
    nextWhen: "Až železem 7 doletíte pravidelně přes 120 m.",
    url: `${PING}/irons/g440-hl-iron`,
  },
  "g740-iron": {
    id: "g740-iron",
    name: "G740",
    tagline: "Nejvíc odpouštějící železa s důrazem na délku.",
    forWho: "Pro začínající a rekreační hráče — rány mimo střed nebolí.",
    nextWhen: "Až trefujete střed čím dál častěji a chcete víc kontroly.",
    url: `${PING}/irons/g740-iron`,
    badge: "Novinka",
  },
  "g440-iron": {
    id: "g440-iron",
    name: "G440",
    tagline: "Odpouštějící železa pro stabilní posun ve hře.",
    forWho: "Pro hráče zhruba od handicapu 36 do 15.",
    nextWhen: "Až se dostanete k handicapu kolem 15 a chcete štíhlejší hlavu.",
    url: `${PING}/irons/g440-iron`,
  },
  "i540-iron": {
    id: "i540-iron",
    name: "i540",
    tagline: "Štíhlý vzhled hráčského železa, ale s délkou navíc.",
    forWho: "Pro zlepšující se hráče, kteří chtějí vzhled i výkon.",
    nextWhen: "Až chcete hlavně kontrolu vzdálenosti a tvarování rány.",
    url: `${PING}/irons/i540-iron`,
    badge: "Novinka",
  },
  "i240-iron": {
    id: "i240-iron",
    name: "i240",
    tagline: "Hráčské železo — kontrola, cit a přesné vzdálenosti.",
    forWho: "Pro hráče zhruba pod handicap 12, kteří trefují střed.",
    nextWhen: "Až hrajete jednociferný handicap a chcete tour železo.",
    url: `${PING}/irons/i240-iron`,
  },
  "blueprint-t-iron": {
    id: "blueprint-t-iron",
    name: "Blueprint T",
    tagline: "Tourové železo s trochou odpuštění.",
    forWho: "Pro velmi dobré hráče a jednociferný handicap.",
    nextWhen: "Nejvyšší stupeň: čistý blade Blueprint S.",
    url: `${PING}/irons/blueprint-t-iron`,
  },
  "blueprint-s-iron": {
    id: "blueprint-s-iron",
    name: "Blueprint S",
    tagline: "Čistý blade — maximální cit a tvarování rány.",
    forWho: "Pro špičkové hráče, kteří trefují střed téměř vždy.",
    url: `${PING}/irons/blueprint-s-iron`,
  },
  "g-le4-iron": {
    id: "g-le4-iron",
    name: "G Le4 železa",
    tagline: "Dámská železa — lehká, s vysokým letem.",
    forWho: "Pro hráčky.",
    url: `${PING}/irons/g-le4-iron`,
    badge: "Novinka",
  },
  "prodi-g-irons": {
    id: "prodi-g-irons",
    name: "Prodi G železa",
    tagline: "Juniorská železa podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
    url: `${PING}/juniors/prodi-g-irons`,
  },

  // --- Wedge ---
  "chipr-wedge": {
    id: "chipr-wedge",
    name: "ChipR",
    tagline: "Čipr — kolem greenu se hraje jako s patrem.",
    forWho: "Pro hráče, kterým čipy „hrabou“ nebo letí přes green.",
    nextWhen: "Až čipujete jistě a chcete i vyšší rány přes překážku.",
    url: `${PING}/wedges/chipr-wedge`,
  },
  "bunkr-wedge": {
    id: "bunkr-wedge",
    name: "BunkR",
    tagline: "Wedge postavený na vyhrání bunkru na první pokus.",
    forWho: "Pro hráče, pro které je písek noční můra.",
    nextWhen: "Až se bunkru přestanete bát, přejděte na klasický wedge.",
    url: `${PING}/wedges/bunkr-wedge`,
  },
  "s259-wedge": {
    id: "s259-wedge",
    name: "s259",
    tagline: "Nejnovější řada wedgí PING pro kontrolu a spin.",
    forWho: "Pro hráče, kteří chtějí dávat míč blíž k jamce.",
    nextWhen: "Pro tour grindy a jemné ladění zkuste s159.",
    url: `${PING}/wedges/s259-wedge`,
    badge: "Novinka",
  },
  "s159-wedge": {
    id: "s159-wedge",
    name: "s159",
    tagline: "Tourové wedge s výběrem grindů pro každý typ rány.",
    forWho: "Pro zkušené hráče, kteří s wedgí tvarují rány.",
    url: `${PING}/wedges/s159-wedge`,
  },
  "chipr-le-wedge": {
    id: "chipr-le-wedge",
    name: "ChipR Le",
    tagline: "Dámský čipr — jednoduché rány kolem greenu.",
    forWho: "Pro hráčky.",
    url: `${PING}/wedges/chipr-le-wedge`,
  },

  // --- Puttery ---
  "putter-mallet": {
    id: "putter-mallet",
    name: "Mallet (např. Tyne H, Ketsch G, Fetch)",
    tagline: "Velká stabilní hlava pro rovný pohyb tam a zpět.",
    forWho: "Pro hráče, jejichž patr jde rovně a chtějí jistotu na krátkých puttech.",
    url: `${PING}/putters`,
  },
  "putter-mid": {
    id: "putter-mid",
    name: "Mid-mallet / blade (např. Anser D, B60)",
    tagline: "Kompromis mezi stabilitou a citem.",
    forWho: "Pro mírně obloukový pohyb.",
    url: `${PING}/putters`,
  },
  "putter-blade": {
    id: "putter-blade",
    name: "Blade (např. Anser 2)",
    tagline: "Klasický tvar, který přirozeně kopíruje oblouk.",
    forWho: "Pro výrazně obloukový pohyb a hráče, kteří chtějí cit.",
    url: `${PING}/putters`,
  },
  "g-le4-putter": {
    id: "g-le4-putter",
    name: "G Le4 puttery (Anser 2D, Louise, Oslo)",
    tagline: "Dámské puttery v délkách a vahách pro hráčky.",
    forWho: "Pro hráčky.",
    url: `${PING}/womens`,
    badge: "Novinka",
  },
  "prodi-g-putters": {
    id: "prodi-g-putters",
    name: "Prodi G puttery",
    tagline: "Juniorské puttery podle výšky dítěte.",
    forWho: "Pro děti a mládež.",
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
  driver: ["g440-max-hl-driver", "g440-k-driver", "g440-max-driver", "g440-lst-driver"],
  dlouhe: ["g440-hl-hybrid", "g440-hybrid", "g440-max-fairway", "g440-lst-fairway", "icrossover"],
  zeleza: [
    "g440-hl-iron",
    "g740-iron",
    "g440-iron",
    "i540-iron",
    "i240-iron",
    "blueprint-t-iron",
    "blueprint-s-iron",
  ],
  wedge: ["chipr-wedge", "bunkr-wedge", "s259-wedge", "s159-wedge"],
  putter: ["putter-mallet", "putter-mid", "putter-blade"],
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
      wedge: "chipr-le-wedge",
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
    if (len === 0) {
      i = 0;
      why.push("Při kratším švihu pomůže lehčí hůl, která míč snadno zvedne.");
    } else if (a["smer"] === "ruzne" || hcp <= 1) {
      i = 1;
      why.push("Největší rezervu máte v rozptylu — stabilní hlava srovná i rány mimo střed.");
    } else if (len >= 3 && hcp >= 2 && a["smer"] === "dobre") {
      i = 3;
      why.push("Máte rychlý a stabilní švih — nižší rotace přidá metry.");
    } else {
      i = 2;
      why.push("Univerzální volba, která přidá délku a odpustí chyby.");
    }
    if (a["smer"] === "doprava")
      why.push("Míč vám utíká doprava — zvažte i verzi SFT, která to koriguje.");
    if (a["smer"] === "kratce")
      why.push("Chybějící délku často vyřeší správný loft a shaft — to změříme.");
    return pack(kind, i, why, a["smer"] === "doprava" ? "g440-sft-driver" : undefined);
  }

  if (kind === "dlouhe") {
    const score = (lv(kind, "hcp", a) + lv(kind, "zvednout", a) * 1.4) / 2.4; // 0–3
    const i = score >= 2.8 ? 4 : clamp(score, 3);
    const why = [
      i <= 1
        ? "Hybrid je nejjednodušší cesta, jak dostat dlouhou ránu do vzduchu."
        : i <= 3
          ? "Míč zvedáte — fairwayové dřevo vám přidá délku z trávy i z odpaliště."
          : "Jste silný hráč — driving iron dá nízkou, přesnou ránu i proti větru.",
    ];
    if (a["smer"] === "doprava") why.push("Na slice existuje verze SFT, která ránu srovná.");
    return pack(kind, i, why, a["smer"] === "doprava" ? "g440-sft-fairway" : undefined);
  }

  if (kind === "zeleza") {
    const hcp = lv(kind, "hcp", a);
    const hit = lv(kind, "stred", a);
    const prio = lv(kind, "priorita", a);
    // 1 = G740 … 5 = Blueprint T; Blueprint S jen pro špičku s důrazem na kontrolu.
    let i = clamp(1 + ((hcp + hit) / 2) * 1.1 + prio * 0.5, 5);
    if (hcp === 3 && hit === 3 && prio === 1) i = 6;
    const why = [
      i <= 2
        ? "Odpouštějící hlava vám vrátí délku i u ran, které netrefíte přesně."
        : i <= 4
          ? "Trefujete čím dál líp — štíhlejší hlava přidá kontrolu a cit."
          : "Trefujete střed — tourové železo vám dá maximum kontroly.",
      "Na fittingu nastavíme délku a lie úhel — u želez rozhodují nejvíc.",
    ];
    // Lehčí verze pro klidnější švih — jako tip pro začínající.
    return pack(kind, i, why, hcp === 0 ? "g440-hl-iron" : undefined);
  }

  if (kind === "wedge") {
    const hcp = lv(kind, "hcp", a);
    if (a["problem"] === "cipy")
      return pack(kind, 0, ["Čipr hrajete jako putter — žádné hrabání do země."]);
    if (a["problem"] === "bunkr")
      return pack(kind, 1, ["Široká spodní hrana vás z písku vyveze napoprvé."]);
    const i = a["problem"] === "nic" && hcp >= 2 ? 3 : 2;
    return pack(kind, i, [
      "Správný loft a grind vám pomůže dávat míč blíž k jamce.",
      "Mezery mezi lofty navážeme na vaše železa.",
    ]);
  }

  // putter
  const i = a["pohyb"] === "velky" ? 2 : a["pohyb"] === "oblouk" ? 1 : 0;
  const why = [
    a["pohyb"] === "nevim"
      ? "Typ pohybu změříme na fittingu — zatím doporučujeme stabilní mallet."
      : "Tvar hlavy má odpovídat tomu, jak se váš putter pohybuje.",
  ];
  if (a["chyba"] === "kratke" || a["chyba"] === "oboji")
    why.push("Na krátké putty pomůže víc stability a lepší zarovnání.");
  if (a["chyba"] === "dlouhe" || a["chyba"] === "oboji")
    why.push("Odhad síly zlepší správná délka a váha putteru.");
  return pack(kind, i, why);
}
