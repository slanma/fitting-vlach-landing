/**
 * QR platba podle českého standardu SPAYD (Short Payment Descriptor).
 * Řetězec se vykreslí jako QR kód a banka ho načte do platebního příkazu.
 */

const W_PREFIX = [10, 5, 8, 4, 2, 1];
const W_ACCOUNT = [6, 3, 7, 9, 10, 5, 8, 4, 2, 1];

/** Kontrola české bankovní váhy modulo 11. */
function validPart(digits: string, weights: number[]): boolean {
  const padded = digits.padStart(weights.length, "0");
  const sum = [...padded].reduce((acc, d, i) => acc + Number(d) * (weights[i] ?? 0), 0);
  return sum % 11 === 0;
}

/** Modulo 97 nad řetězcem, kde písmena mají hodnotu A=10 … Z=35. */
function mod97(input: string): number {
  let rest = 0;
  for (const ch of input) {
    const val = /[0-9]/.test(ch) ? ch : (ch.charCodeAt(0) - 55).toString();
    for (const d of val) rest = (rest * 10 + Number(d)) % 97;
  }
  return rest;
}

/**
 * Převede české číslo účtu na IBAN. Vrátí `null`, když číslo neprojde
 * kontrolou — raději QR nezobrazit než poslat peníze jinam.
 */
export function accountToIban(account: string): string | null {
  const m = account.trim().match(/^(?:(\d{1,6})-)?(\d{1,10})\/(\d{4})$/);
  if (!m) return null;
  const prefix = m[1] ?? "0";
  const number = m[2] ?? "";
  const bank = m[3] ?? "";
  if (!validPart(prefix, W_PREFIX) || !validPart(number, W_ACCOUNT)) return null;
  const bban = bank + prefix.padStart(6, "0") + number.padStart(10, "0");
  const check = String(98 - mod97(bban + "CZ00")).padStart(2, "0");
  return "CZ" + check + bban;
}

/** Diakritiku a středníky ze zprávy pryč — SPAYD zvládá jen ASCII. */
function ascii(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/[*;]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export type SpaydInput = {
  account: string;
  amount: number;
  variableSymbol: string;
  message: string;
  recipient?: string | null;
  dueDate?: Date | null;
};

/** Sestaví SPAYD řetězec. Vrátí `null`, když je účet nepoužitelný. */
export function buildSpayd({
  account,
  amount,
  variableSymbol,
  message,
  recipient,
  dueDate,
}: SpaydInput): string | null {
  const iban = accountToIban(account);
  if (!iban) return null;

  const parts = [
    "SPD*1.0",
    `ACC:${iban}`,
    `AM:${amount.toFixed(2)}`,
    "CC:CZK",
    `X-VS:${variableSymbol.replace(/\D/g, "").slice(0, 10)}`,
    `MSG:${ascii(message).slice(0, 60)}`,
  ];
  if (recipient) parts.push(`RN:${ascii(recipient).slice(0, 35)}`);
  if (dueDate) {
    const d = dueDate;
    const stamp =
      d.getFullYear().toString() +
      String(d.getMonth() + 1).padStart(2, "0") +
      String(d.getDate()).padStart(2, "0");
    parts.push(`DT:${stamp}`);
  }
  return parts.join("*");
}

/** Číslo objednávky FV-YYMMDDnnnn; číslice slouží i jako variabilní symbol. */
export function newOrderNumber(prefix: string): { order: string; vs: string } {
  const d = new Date();
  const stamp =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, "0") +
    String(d.getDate()).padStart(2, "0");
  const rand = String(Math.floor(Math.random() * 10000)).padStart(4, "0");
  return { order: `${prefix}-${stamp}${rand}`, vs: stamp + rand };
}
