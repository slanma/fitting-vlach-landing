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
    slug: "golfova-rukavice-hirzl",
    name: "Golfová rukavice HIRZL",
    category: "prislusenstvi",
    brand: "HIRZL",
    // DOPLNIT cenu v Kč vč. DPH — do té doby se rukavice v e-shopu nezobrazí.
    price: 0,
    priceFrom: false,
    short: "Golfová rukavice HIRZL, běžné velikosti skladem.",
    description:
      "Rukavice na pravou i levou ruku v běžných velikostech. Když si velikostí nejste jistí, zavolejte — změříme ji při návštěvě.",
    options: [
      { label: "Velikost", values: ["S", "M", "M/L", "L", "XL"] },
      { label: "Ruka", values: ["Levá (pro praváky)", "Pravá (pro leváky)"] },
    ],
    madeToOrder: false,
    active: true,
  },
];

const hasPrice = (p: Product) =>
  p.priceBy ? Object.values(p.priceBy.prices).some((v) => v > 0) : p.price > 0;

/** Lze koupit přes košík: skladové zboží s vyplněnou cenou. */
export const isPurchasable = (p: Product) => p.active && !p.madeToOrder && hasPrice(p);

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
