/**
 * Katalog e-shopu.
 *
 * CENY JSOU ORIENTAČNÍ PLACEHOLDERY — přepiš je před spuštěním.
 * Produkt se skryje nastavením `active: false`.
 *
 * Dva režimy prodeje:
 *
 * - SKLADOVÉ ZBOŽÍ (`madeToOrder: false`) jde přes košík a objednávku.
 *   Musí mít vyplněnou pevnou cenu včetně DPH — spotřebitel ji musí znát
 *   před odesláním objednávky. Dokud je `price: 0`, produkt se v e-shopu
 *   NEZOBRAZÍ (raději nic než „cena na dotaz" s tlačítkem do košíku).
 *
 * - HOLE NA MÍRU (`madeToOrder: true`) se do košíku nevkládají. U produktu
 *   je „Cena na dotaz" a kontakt (telefon, e-mail). Konfigurace a cena se
 *   domluví po fittingu a smlouva vzniká až přijetím Petrovy nabídky.
 *   Od takové smlouvy nelze odstoupit do 14 dnů (§ 1837 písm. d) OZ),
 *   na což web upozorňuje u produktu i v nabídce.
 */

export type Product = {
  slug: string;
  name: string;
  category: "hole" | "prislusenstvi" | "poukazy";
  brand: string;
  /** Cena v Kč včetně DPH. U `priceFrom` jde o cenu „od". */
  price: number;
  priceFrom: boolean;
  short: string;
  description: string;
  /** Volby, které zákazník vybírá (např. „Loft: 9° / 10,5°"). */
  options: { label: string; values: string[] }[];
  madeToOrder: boolean;
  active: boolean;
  /**
   * Cena podle zvolené volby (např. hodnota poukazu). Klíč = hodnota volby
   * `label`, hodnota = cena v Kč vč. DPH. Když je vyplněné, `price` se ignoruje.
   */
  priceBy?: { label: string; prices: Record<string, number> };
  /** Zboží, které jde poslat e-mailem (poukaz) — umožní dopravu „e-mailem". */
  digital?: boolean;
  /**
   * Fotky produktu — cesty k souborům ve složce public/images/eshop/,
   * např. ["/images/eshop/hirzl-rukavice-1.jpg"]. První je hlavní (ve výpisu).
   * Prázdné = karta bez fotky.
   */
  images?: string[];
  /** Nadpis nad argumenty „proč tuhle“ (volitelný). */
  pitch?: string;
  /** Přesvědčivé argumenty — zobrazí se pod popisem jako seznam s fajfkami. */
  highlights?: string[];
  /** Tabulka velikostí výrobce → kalkulačka velikosti pod výběrem „Velikost“. */
  sizeChart?: "hirzl";
  /** Klikací body na fotkách (pozice v % fotky, image = index fotky). */
  hotspots?: { image: number; x: number; y: number; title: string; text: string }[];
  /** Interaktivní srovnání gripu za sucha / vlhka / deště. */
  weatherGrip?: boolean;
};

export const products: Product[] = [
  // --- Hole PING — stavba na míru, cena na dotaz (telefon / e-mail) ---
  {
    slug: "ping-driver",
    name: "Driver PING",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Driver nastavený na váš launch, spin a disperzi.",
    description:
      "Driver vybraný a sestavený podle dat z fittingu — loft, shaft a délka odpovídají rychlosti a charakteru vašeho švihu. Cílem je delší a hlavně rovnější rána z odpaliště.",
    images: ["/images/hole/g440-max-driver.jpg"],
    options: [],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "ping-fairwayove-drevo",
    name: "Fairwayové dřevo PING",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Dřevo pro dlouhé rány z fairwaye i z odpaliště.",
    description:
      "Fairwayové dřevo s loftem a shaftem zvoleným tak, aby navazovalo na váš driver i nejdelší železo a nevznikaly v bagu díry ve vzdálenostech.",
    images: ["/images/hole/g440-max-fairway.jpg"],
    options: [],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "ping-zeleza",
    name: "Železa PING",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Železa sestavená podle vašich naměřených hodnot — klidně jen jedno nebo dvě.",
    description:
      "Délka, lie úhel, shaft i grip vycházejí z vašich naměřených hodnot, ne z tabulky. Nemusíte kupovat celý set — často začínáme jedním nebo dvěma železy a bag doplňujeme postupně.",
    images: ["/images/hole/g440-iron.jpg"],
    options: [],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "ping-wedge",
    name: "Wedge PING",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Wedge s loftem a bounce podle vaší krátké hry a hřišť, kde hrajete.",
    description:
      "Wedge vybíráme podle loftových mezer k vašim železům, podle toho, jak hůl vedete pod míč, a podle podmínek na hřištích, kde nejčastěji hrajete.",
    images: ["/images/hole/s259-wedge.jpg"],
    options: [],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "ping-chipr",
    name: "Chipper PING ChipR",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Čipy putterovým pohybem — bez hrabání do země a bez přestřelených greenů.",
    description:
      "ChipR je samostatná hůl mezi putterem a wedgí: má loft zhruba jako 9 železo, délku putteru a hraje se stejným klidným pohybem jako pat. Je určený na krátké rány kolem greenu z okraje nebo z rafu. Délku, lie i loft nastavíme na fittingu podle vašeho postoje.",
    pitch: "Pro koho je ChipR",
    highlights: [
      "Když čipy hrabou nebo letí přes green — putterový pohyb je jednodušší a opakovatelný, takže odpadá strach z „tlustých“ i „tenkých“ ran.",
      "Na rány do zhruba 35 metrů — z okraje greenu nebo z rafu, kde se míč má hlavně kutálet.",
      "Loft 38,5° a délka putteru — míč krátce vyletí a pak se kutálí jako po patu.",
      "Zaoblená spodní hrana — hůl klouže přes trávu, místo aby se zasekla.",
      "Ušitý na míru — PING ho vyrábí v 10 nastaveních lie, správné vybereme na fittingu.",
    ],
    images: ["/images/eshop/ping-chipr.jpg"],
    options: [],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "ping-putter",
    name: "Putter PING",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Putter s délkou, lie a tvarem hlavy podle vašeho patování.",
    description:
      "Putter vybraný podle vašeho postoje a dráhy patovacího pohybu — délka, lie, loft i tvar hlavy, aby míč odcházel tam, kam míříte.",
    images: ["/images/hole/putter-rovne.jpg"],
    options: [],
    madeToOrder: true,
    active: true,
  },

  // --- Dárkový poukaz — pevné hodnoty, přes košík, PDF e-mailem ---
  {
    slug: "darkovy-poukaz",
    name: "Dárkový poukaz Vlach Fitting",
    category: "poukazy",
    brand: "Vlach Fitting",
    price: 0,
    priceFrom: false,
    short: "Hodnotový poukaz na fitting nebo zboží. Platí 12 měsíců, přijde e-mailem k vytištění.",
    description:
      "Dárkový poukaz lze uplatnit na hloubkový fitting, stavbu holí na míru i na příslušenství, a to najednou nebo postupně až do jeho hodnoty. Platí 12 měsíců od vystavení. Po připsání platby ho pošleme e-mailem — otevřete ho, vytisknete nebo uložíte jako PDF a můžete darovat. Jméno obdarovaného a případné věnování napište do poznámky v košíku.",
    // HODNOTY POUKAZŮ — uprav podle potřeby (text volby musí odpovídat klíči v `prices`).
    options: [{ label: "Hodnota", values: ["1 000 Kč", "2 000 Kč", "3 000 Kč", "5 000 Kč"] }],
    priceBy: {
      label: "Hodnota",
      prices: { "1 000 Kč": 1000, "2 000 Kč": 2000, "3 000 Kč": 3000, "5 000 Kč": 5000 },
    },
    madeToOrder: false,
    digital: true,
    active: true,
  },

  // --- Příslušenství — skladem, pevná cena, přes košík ---
  {
    slug: "hirzl-trust-control-2",
    name: "Golfová rukavice HIRZL Trust Control 2.0",
    category: "prislusenstvi",
    brand: "HIRZL",
    price: 800,
    priceFrom: false,
    short: "Nejprodávanější rukavice HIRZL — hůl neujede ani v dešti.",
    description:
      "Léty prověřená rukavice, kterou nosí trenéři, long driveři i rekreační hráči. Dlaň z klokaní kůže, hřbet z kůže cabretta, barva stříbřitě bílá s černou. Když si velikostí nejste jistí, zavolejte — změříme ji při návštěvě. Ruční praní ve studené vodě, nesušit na topení.",
    pitch: "Proč právě Trust Control 2.0",
    highlights: [
      "Grip za každého počasí — klokaní dlaň s technologií HIRZL GRIPPP drží hůl v suchu, vlhku i v dešti. Nemusíte ji svírat silou, takže švih zůstane uvolněný a směr pod kontrolou.",
      "Dlaň se nepotí — klokaní kůže vlhkost pohltí, ruka zůstává suchá i v horkém dni.",
      "Prodyšná — síťovina na hřbetě a palci odvádí teplo, rukavice se ani po 18 jamkách nelepí.",
      "Nic netlačí — bezešvý ukazováček z klokaní kůže a pružný palec kopírují pohyb ruky.",
      "Delší manžeta s potítkem — pot ze zápěstí nesteče do dlaně.",
    ],
    images: [
      "/images/eshop/hirzl-trust-control-2-1.jpg",
      "/images/eshop/hirzl-trust-control-2-2.jpg",
      "/images/eshop/hirzl-trust-control-2-3.jpg",
    ],
    options: [
      {
        label: "Velikost",
        values: [
          "Pánská S",
          "Pánská M",
          "Pánská ML",
          "Pánská L",
          "Pánská XL",
          "Dámská XS",
          "Dámská S",
          "Dámská M",
          "Dámská L",
        ],
      },
      { label: "Ruka", values: ["Na levou ruku (pro praváky)", "Na pravou ruku (pro leváky)"] },
    ],
    hotspots: [
      {
        image: 0,
        x: 62,
        y: 14,
        title: "Bezešvý ukazováček",
        text: "Na ukazováček tlačí hůl nejvíc. Bez švu nic nedře a rukavice vydrží déle.",
      },
      {
        image: 0,
        x: 40,
        y: 36,
        title: "Prodyšná síťovina",
        text: "Teplo odchází ven, takže se ruka nepaří ani v létě.",
      },
      {
        image: 0,
        x: 79,
        y: 46,
        title: "Pružný palec",
        text: "Síťovina na palci se natáhne s pohybem — palec drží grip, ne látku.",
      },
      {
        image: 0,
        x: 33,
        y: 73,
        title: "Suchý zip s logem",
        text: "Utáhnete přesně tak, jak potřebujete. Rukavice má sedět těsně, ale neškrtit.",
      },
      {
        image: 0,
        x: 44,
        y: 94,
        title: "Manžeta s potítkem",
        text: "Pot ze zápěstí nesteče do dlaně — grip zůstane suchý.",
      },
      {
        image: 1,
        x: 55,
        y: 55,
        title: "Klokaní kůže GRIPPP",
        text: "Pevná a přitom tenká. Upravená tak, aby držela i mokrá — nemusíte hůl svírat silou.",
      },
      {
        image: 1,
        x: 50,
        y: 16,
        title: "Strukturované prsty",
        text: "Drobná struktura kůže přidá tření tam, kde prsty hůl obemykají.",
      },
      {
        image: 1,
        x: 13,
        y: 40,
        title: "Palec na gripu",
        text: "Palec leží na horní straně gripu — kůže tady musí držet nejvíc.",
      },
    ],
    weatherGrip: true,
    sizeChart: "hirzl",
    madeToOrder: false,
    active: true,
  },
  {
    slug: "hirzl-grippp-fit",
    name: "Golfová rukavice HIRZL Grippp Fit",
    category: "prislusenstvi",
    brand: "HIRZL",
    price: 650,
    priceFrom: false,
    short: "Skoro ji necítíte — a hůl vám neujede ani za mokra.",
    description:
      "Pro hráče, kteří chtějí maximální cit. Extra tenká klokaní kůže s pružnou lycrou, barva bílo-černá. Když si velikostí nejste jistí, zavolejte — změříme ji při návštěvě. Ruční praní ve studené vodě, nesušit na topení.",
    pitch: "Proč právě Grippp Fit",
    highlights: [
      "Cit jako bez rukavice — extra tenká kůže a pružná lycra sednou jako druhá kůže. Hůl cítíte i u jemných čipů a patů.",
      "Hůl drží i za mokra — klokaní kůže upravená technologií HIRZL GRIPPP neklouže v suchu, vlhku ani v dešti.",
      "Suchá dlaň — kůže vlhkost pohltí, takže se nepotíte a grip se během kola nemění.",
      "Volné zápěstí — konstrukce „360° Move“ vás při švihu nikde neškrtí.",
      "Zaoblené pružné konečky prstů — nic se nehrne, nic netlačí.",
      "Šikovný detail — mikrofleece na palci pro rychlé otření míčku nebo brýlí.",
    ],
    images: [
      "/images/eshop/hirzl-grippp-fit-1.jpg",
      "/images/eshop/hirzl-grippp-fit-2.jpg",
      "/images/eshop/hirzl-grippp-fit-3.jpg",
    ],
    options: [
      { label: "Velikost", values: ["Pánská S–M", "Pánská ML–XL", "Pánská 2XL", "Dámská S–L"] },
      { label: "Ruka", values: ["Na levou ruku (pro praváky)", "Na pravou ruku (pro leváky)"] },
    ],
    hotspots: [
      {
        image: 0,
        x: 36,
        y: 9,
        title: "Zaoblené konečky",
        text: "Pružná lycra kopíruje prsty — nic se nehrne, nic nepřesahuje.",
      },
      {
        image: 0,
        x: 56,
        y: 40,
        title: "Lycra na hřbetě",
        text: "Natáhne se s rukou jako druhá kůže. Proto ji skoro necítíte.",
      },
      {
        image: 0,
        x: 88,
        y: 45,
        title: "Mikrofleece na palci",
        text: "Rychle otřete míček před patem nebo brýle — bez hledání ručníku.",
      },
      {
        image: 0,
        x: 42,
        y: 78,
        title: "Suchý zip s logem",
        text: "Utáhněte těsně, ale ne natvrdo — rukavice má sedět, ne škrtit.",
      },
      {
        image: 0,
        x: 48,
        y: 93,
        title: "Zápěstí 360° Move",
        text: "Zápěstí se při švihu volně ohýbá na všechny strany, manžeta nikde netlačí.",
      },
      {
        image: 1,
        x: 55,
        y: 64,
        title: "Extra tenká klokaní kůže",
        text: "Čím tenčí kůže, tím víc cítíte hůl — hlavně u čipů a patů.",
      },
      {
        image: 1,
        x: 12,
        y: 50,
        title: "Palec na gripu",
        text: "Palec leží na horní straně gripu — kůže tady drží i za mokra.",
      },
      {
        image: 1,
        x: 77,
        y: 33,
        title: "Lycra mezi prsty",
        text: "Pružné vsadky mezi prsty — prsty se volně hýbou a nic neškrtí.",
      },
    ],
    weatherGrip: true,
    sizeChart: "hirzl",
    madeToOrder: false,
    active: true,
  },
];

const hasPrice = (p: Product) =>
  p.priceBy ? Object.values(p.priceBy.prices).some((v) => v > 0) : p.price > 0;

/** Lze koupit přes košík: skladové zboží s vyplněnou cenou. */
/** Štítek „Na míru“ — každá hůl ho má vždy, i když by se u produktu zapomněl příznak. */
export const isMadeToOrder = (p: Product) => p.madeToOrder || p.category === "hole";

export const isPurchasable = (p: Product) => p.active && !isMadeToOrder(p) && hasPrice(p);

/** Zobrazuje se v e-shopu: zboží na míru vždy, skladové jen s cenou. */
const isVisible = (p: Product) => p.active && (p.madeToOrder || hasPrice(p));

/** Jednotková cena pro konkrétní konfiguraci; `null` = taková varianta neexistuje. */
export function unitPrice(p: Product, config: Record<string, string>): number | null {
  if (!p.priceBy) return p.price > 0 ? p.price : null;
  const v = p.priceBy.prices[config[p.priceBy.label] ?? ""];
  return v && v > 0 ? v : null;
}

export const activeProducts = () => products.filter(isVisible);

export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug && isVisible(p)) ?? null;

/** Text ceny pro výpis a detail. */
export function priceLabel(p: Product): string {
  if (p.madeToOrder) return "Cena na dotaz";
  if (p.priceBy) {
    const vals = Object.values(p.priceBy.prices).filter((v) => v > 0);
    return vals.length > 1 ? `od ${formatPrice(Math.min(...vals))}` : formatPrice(vals[0] ?? 0);
  }
  return formatPrice(p.price, p.priceFrom);
}

export function formatPrice(value: number, from = false): string {
  const formatted = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
  return from ? `od ${formatted}` : formatted;
}
