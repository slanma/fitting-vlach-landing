/**
 * Nastavení e-shopu. Vše, co se mění bez zásahu do kódu, je tady.
 *
 * Pole s `null` znamenají „nevyplněno" — e-shop na ně reaguje tak, že
 * příslušnou část nezobrazí nebo upozorní, místo aby ukazoval nesmysl.
 */

export type BankAccount = {
  id: string;
  /** Popisek, který uvidíš při výběru — ne zákazník. */
  label: string;
  /** Číslo účtu ve tvaru `předčíslí-číslo/kód` nebo `číslo/kód`. */
  account: string;
  recipient: string;
};

/**
 * Účty, ze kterých si vybíráš při vytváření QR platby na stránce /platba.
 * Přidej si jich kolik chceš — první v pořadí je předvybraný.
 *
 * Pozor: čísla účtů se dostanou do veřejného kódu stránky. U bankovního
 * účtu to nevadí (stejně ho posíláš na faktuře), ale nedávej sem nic,
 * co nemá být veřejné.
 */
export const BANK_ACCOUNTS: BankAccount[] = [
  // { id: "hlavni", label: "Hlavní účet (Fio)", account: "2601234567/2010", recipient: "Ing. Petr Vlach" },
  // { id: "druhy",  label: "Druhý účet",        account: "123456-7890123456/0300", recipient: "Ing. Petr Vlach" },
];

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
