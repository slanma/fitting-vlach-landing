/**
 * Nastavení e-shopu uložené v databázi (tabulka vf_settings), aby se dalo
 * měnit z administrace bez zásahu do kódu — stejně jako na vapesport.cz.
 * Volá se jen ze serverových funkcí.
 */
import { db, dbConfigured, type BankAccountRow, type Settings } from "./db";
import { DEFAULT_BANK_ACCOUNTS } from "./shop";

const DEFAULTS: Settings = { bank_accounts: DEFAULT_BANK_ACCOUNTS };

export async function loadSettings(): Promise<Settings> {
  if (!dbConfigured()) return DEFAULTS;
  let rows: { key: string; value: unknown }[];
  try {
    rows = await db.select<{ key: string; value: unknown }>("vf_settings", "select=key,value");
  } catch {
    return DEFAULTS;
  }
  // Dokud administrace nic neuložila, platí výchozí účet z kódu.
  const out: Settings = { ...DEFAULTS };
  for (const r of rows)
    if (r.key === "bank_accounts" && Array.isArray(r.value))
      out.bank_accounts = r.value as BankAccountRow[];
  return out;
}

export async function saveSetting(key: keyof Settings, value: unknown) {
  const existing = await db.select<{ key: string }>("vf_settings", `key=eq.${key}`);
  if (existing.length)
    await db.update("vf_settings", `key=eq.${key}`, {
      value,
      updated_at: new Date().toISOString(),
    });
  else await db.insert("vf_settings", { key, value });
}

/** První účet v seznamu je výchozí — použije se v potvrzení objednávky. */
export async function defaultBankAccount(): Promise<BankAccountRow | null> {
  try {
    return (await loadSettings()).bank_accounts[0] ?? null;
  } catch {
    return null;
  }
}
