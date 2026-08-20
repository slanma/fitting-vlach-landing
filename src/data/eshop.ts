/**
 * Katalog e-shopu.
 *
 * CENY JSOU ORIENTAČNÍ PLACEHOLDERY — přepiš je před spuštěním.
 * Produkt se skryje nastavením `active: false`.
 *
 * `madeToOrder: true` znamená zboží stavěné na míru zákazníkovi. U něj
 * podle § 1837 občanského zákoníku nelze odstoupit od smlouvy do 14 dnů
 * a e-shop na to zákazníka výslovně upozorní ještě před objednáním.
 */

export type Product = {
  slug: string;
  name: string;
  category: "hole" | "prislusenstvi";
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
};

export const products: Product[] = [
  {
    slug: "ping-zeleza-na-miru",
    name: "Železa PING — stavba na míru",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: true,
    short: "Sada želez sestavená podle vašich naměřených hodnot.",
    description:
      "Železa stavěná na míru po fittingu. Délka, lie úhel, shaft i grip vycházejí z vašich naměřených hodnot, ne z tabulky. Konkrétní model a konfiguraci potvrdíme po měření — cena se odvíjí od počtu holí a zvoleného shaftu.",
    options: [
      { label: "Počet holí", values: ["1 hůl", "2 hole", "Sada 5–PW", "Jiné"] },
      { label: "Shaft", values: ["Ocel", "Grafit", "Doporučte mi"] },
      { label: "Ruka", values: ["Pravá", "Levá"] },
    ],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "ping-driver-na-miru",
    name: "Driver PING — stavba na míru",
    category: "hole",
    brand: "PING",
    price: 0,
    priceFrom: true,
    short: "Driver nastavený na váš launch, spin a disperzi.",
    description:
      "Driver vybraný a sestavený podle naměřených dat z fittingu — loft, shaft a délka podle rychlosti a charakteru vašeho švihu. Konfigurace se potvrzuje po měření.",
    options: [
      { label: "Loft", values: ["9°", "10,5°", "12°", "Doporučte mi"] },
      { label: "Ruka", values: ["Pravá", "Levá"] },
    ],
    madeToOrder: true,
    active: true,
  },
  {
    slug: "golfova-rukavice",
    name: "Golfová rukavice",
    category: "prislusenstvi",
    brand: "PING",
    price: 0,
    priceFrom: false,
    short: "Kožená rukavice, běžné velikosti skladem.",
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

export const activeProducts = () => products.filter((p) => p.active);

export const findProduct = (slug: string) =>
  products.find((p) => p.slug === slug && p.active) ?? null;

export function formatPrice(value: number, from = false): string {
  if (value <= 0) return "Cena na dotaz";
  const formatted = new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(value);
  return from ? `od ${formatted}` : formatted;
}
