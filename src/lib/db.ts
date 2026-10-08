/**
 * Databáze objednávek a poukazů — Supabase (stejná služba jako vapesport.cz).
 *
 * Volá se jen ze serverových funkcí přes REST API, takže klíč nikdy neopustí
 * server a projekt nepotřebuje žádnou knihovnu navíc.
 *
 * Proměnné prostředí:
 *   SUPABASE_URL               https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  Project Settings → API → service_role (tajný!)
 *
 * Tabulky vytvoří skript supabase/vlachfitting.sql. Všechny mají prefix `vf_`,
 * takže můžou klidně žít i ve stejném projektu jako vapesport.cz.
 */

const env = (k: string) => process.env[k];

export const dbConfigured = () => !!env("SUPABASE_URL") && !!env("SUPABASE_SERVICE_ROLE_KEY");

async function call<T>(method: string, path: string, body?: unknown, prefer?: string): Promise<T> {
  if (!dbConfigured())
    throw new Error("Databáze není připojená (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  const key = env("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const res = await fetch(`${env("SUPABASE_URL")}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase ${res.status}: ${detail.slice(0, 300)}`);
  }
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** SELECT s celkovým počtem řádků (pro stránkování). */
async function selectCount<T>(table: string, query: string): Promise<{ rows: T[]; total: number }> {
  const key = env("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const res = await fetch(`${env("SUPABASE_URL")}/rest/v1/${table}?${query}`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: "count=exact" },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const total = Number((res.headers.get("content-range") ?? "").split("/")[1] ?? 0) || 0;
  return { rows: (await res.json()) as T[], total };
}

export const db = {
  select: <T>(table: string, query = "") => call<T[]>("GET", `${table}?${query}`),
  selectCount,
  insert: <T>(table: string, row: unknown) =>
    call<T[]>("POST", table, row, "return=representation").then((r) => r[0]!),
  update: <T>(table: string, query: string, patch: unknown) =>
    call<T[]>("PATCH", `${table}?${query}`, patch, "return=representation"),
  remove: (table: string, query: string) => call<null>("DELETE", `${table}?${query}`),
};

/** Bezpečné vložení hodnoty do PostgREST filtru (eq.xxx). */
export const q = (v: string) => encodeURIComponent(v);

// ---------------------------------------------------------------------------
// Typy řádků
// ---------------------------------------------------------------------------

/** Stavy shodné s administrací vapesport.cz. Zaplacení se eviduje zvlášť (`paid_at`). */
export type OrderStatus = "nova" | "zpracovava" | "odeslano" | "dorucena" | "zrusena";

export const ORDER_STATUSES: OrderStatus[] = [
  "nova",
  "zpracovava",
  "odeslano",
  "dorucena",
  "zrusena",
];

export const STATUS_LABEL: Record<OrderStatus, string> = {
  nova: "Nová",
  zpracovava: "Zpracovává se",
  odeslano: "Odesláno",
  dorucena: "Doručena",
  zrusena: "Zrušena",
};

export type OrderLine = {
  slug: string;
  name: string;
  qty: number;
  unit: number;
  config: Record<string, string>;
  digital: boolean;
};

export type OrderRow = {
  id: string;
  number: string;
  vs: string;
  created_at: string;
  status: OrderStatus;
  customer: { name: string; email: string; phone: string; note: string };
  address: { street: string; city: string; zip: string } | null;
  pickup_point: { id: string; name: string } | null;
  delivery: { id: string; label: string; price: number };
  payment: { id: string; label: string; fee: number };
  items: OrderLine[];
  total: number;
  no_marketing: boolean;
  admin_note: string | null;
  tracking: string | null;
  paid_at: string | null;
};

export type VoucherRow = {
  code: string;
  order_id: string | null;
  order_number: string | null;
  value: number;
  remaining: number;
  valid_until: string;
  recipient: string | null;
  status: "aktivni" | "uplatneno" | "zruseno";
  note: string | null;
  created_at: string;
};

export type BankAccountRow = { id: string; name: string; account: string };

export type Settings = { bank_accounts: BankAccountRow[] };
