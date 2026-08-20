/**
 * Nastavení e-shopu. Vše, co se mění bez zásahu do kódu, je tady.
 *
 * Pole s `null` znamenají „nevyplněno" — e-shop na ně reaguje tak, že
 * příslušnou část nezobrazí nebo upozorní, místo aby ukazoval nesmysl.
 */

/** Bankovní účet ve tvaru `předčíslí-číslo/kód` nebo `číslo/kód`. */
export const BANK_ACCOUNT: string | null = null; // DOPLNIT, např. "2601234567/2010"

/** Jméno příjemce platby v QR kódu. */
export const BANK_RECIPIENT: string | null = null; // DOPLNIT

/**
 * Je prodávající plátce DPH?
 * Podle poskytnutého DIČ to tak vypadá — POTVRDIT před spuštěním.
 * Ovlivňuje text u cen i obchodní podmínky.
 */
export const VAT_PAYER = true;

/** DIČ na fakturách a v obchodních podmínkách (ne ve strukturovaných datech). */
export const VAT_ID_FOR_INVOICES: string | null = "CZ6306141941";

export type Delivery = {
  id: string;
  label: string;
  price: number;
  note: string;
};

/**
 * Způsoby dodání. Osobní odběr je výchozí — hole se stejně přebírají
 * osobně po fittingu. Zásilkovnu nebo přepravce přidej sem, jakmile
 * budou domluvené, a doplň i ceník do obchodních podmínek.
 */
export const DELIVERY: Delivery[] = [
  {
    id: "osobni",
    label: "Osobní odběr v Ostravě-Hrabové",
    price: 0,
    note: "Po domluvě termínu telefonicky. Zboží si vyzvednete na provozovně.",
  },
];

/** Splatnost zálohové platby ve dnech. */
export const PAYMENT_DUE_DAYS = 7;

/** Prefix čísla objednávky. */
export const ORDER_PREFIX = "FV";
