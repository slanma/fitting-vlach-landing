import { SELLER } from "./prodavajici";

/**
 * Nastavení e-shopu. Vše, co se mění bez zásahu do logiky, je tady.
 * Doprava a platby odpovídají vapesport.cz (stejná firma, stejní dopravci).
 */

/**
 * Výchozí bankovní účet Vapesport Vlach s.r.o. — platí, dokud se v administraci
 * (Nastavení → Bankovní účty) neuloží jiný seznam. Pak má přednost databáze.
 */
export const DEFAULT_BANK_ACCOUNTS: { id: string; name: string; account: string }[] = [
  { id: "fio", name: "Fio", account: "CZ3220100000002901174453" },
];

export const VAT_PAYER = SELLER.vatPayer;
export const VAT_ID_FOR_INVOICES: string | null = SELLER.vatId;

// ---------------------------------------------------------------------------
// Doprava
// ---------------------------------------------------------------------------

/**
 * `kind` říká, co musí zákazník vyplnit:
 *   pickup  — nic (osobní odběr na provozovně)
 *   address — doručovací adresu (PPL)
 *   point   — výdejní místo (Zásilkovna)
 *   email   — nic, poukaz chodí e-mailem
 */
export type Delivery = {
  id: string;
  label: string;
  price: number;
  note: string;
  kind: "pickup" | "address" | "point" | "email";
  /** Jen pro košík, ve kterém je výhradně zboží posílané e-mailem (poukazy). */
  digitalOnly?: boolean;
};

export const DELIVERY: Delivery[] = [
  {
    id: "email",
    label: "Elektronicky e-mailem",
    price: 0,
    note: "Dárkový poukaz vám pošleme e-mailem po připsání platby.",
    kind: "email",
    digitalOnly: true,
  },
  {
    id: "osobni",
    label: "Osobní odběr v Ostravě-Hrabové",
    price: 0,
    note: "Paskovská 636/275. Na termínu vyzvednutí se domluvíme telefonicky.",
    kind: "pickup",
  },
  {
    id: "zasilkovna",
    label: "Zásilkovna — výdejní místo nebo Z-BOX",
    price: 150, // Kč vč. DPH
    note: "Doručení obvykle do 2 pracovních dnů od expedice.",
    kind: "point",
  },
  {
    id: "ppl",
    label: "PPL — doručení na adresu",
    price: 200, // Kč vč. DPH
    note: "Řidič vás před doručením kontaktuje na telefonu z objednávky.",
    kind: "address",
  },
];

export const deliveryFor = (allDigital: boolean) =>
  DELIVERY.filter((d) => (allDigital ? d.digitalOnly : !d.digitalOnly));

/**
 * Klíč pro widget výběru výdejního místa Zásilkovny (client.packeta.com →
 * Klientská sekce → API klíč). Je veřejný, používá se v prohlížeči. Stejný
 * jako na vapesport.cz (účet VAPESPORT VLACH, s.r.o.). Je to „Klíč API“, ne
 * „API heslo“ — heslo do kódu nikdy nedávat. Při null zákazník napíše místo ručně.
 */
export const PACKETA_WIDGET_KEY: string | null = "fa4c6404b93578af";

// ---------------------------------------------------------------------------
// Platba
// ---------------------------------------------------------------------------

/**
 * Příplatek za dobírku v Kč včetně DPH (stejně jako na vapesport.cz).
 * Nastavením na null se dobírka v košíku přestane nabízet.
 */
export const COD_FEE: number | null = 50;

export type Payment = {
  id: "prevod" | "dobirka" | "hotove";
  label: string;
  fee: number;
  note: string;
};

/** Platby dostupné pro daný způsob dopravy. */
export function paymentsFor(delivery: Delivery | undefined): Payment[] {
  const prevod: Payment = {
    id: "prevod",
    label: "Bankovní převod / QR platba",
    fee: 0,
    note: "Platební údaje s QR kódem vám pošleme e-mailem po kontrole objednávky.",
  };
  if (!delivery) return [prevod];
  if (delivery.kind === "pickup") {
    return [
      prevod,
      {
        id: "hotove",
        label: "Hotově při osobním odběru",
        fee: 0,
        note: "Zaplatíte při vyzvednutí.",
      },
    ];
  }
  if ((delivery.kind === "address" || delivery.kind === "point") && COD_FEE !== null) {
    return [
      prevod,
      { id: "dobirka", label: "Dobírka", fee: COD_FEE, note: "Zaplatíte při převzetí zásilky." },
    ];
  }
  return [prevod];
}

/** Splatnost platby převodem ve dnech. */
export const PAYMENT_DUE_DAYS = 7;

/** Prefix čísla objednávky. */
export const ORDER_PREFIX = "FV";

/** Platnost dárkového poukazu v měsících. */
export const VOUCHER_VALID_MONTHS = 12;
