import { createServerFn } from "@tanstack/react-start";
import { requireAdmin } from "./admin-session.server";
import {
  db,
  dbConfigured,
  q,
  ORDER_STATUSES,
  type BankAccountRow,
  type OrderRow,
  type OrderStatus,
  type VoucherRow,
} from "./db";
import { paidEmail, paymentRequestEmail, sendEmail, statusEmail } from "./emails";
import { loadSettings, saveSetting } from "./nastaveni";
import { accountToIban, buildSpayd } from "./qr-platba";
import { qrPng, toBase64 } from "./qr-png";
import { PAYMENT_DUE_DAYS, VOUCHER_VALID_MONTHS } from "./shop";
import { products } from "@/data/eshop";

/**
 * Serverové funkce administrace. Každá začíná `requireAdmin()` — bez
 * platného přihlášení se nic nevrátí ani nezmění.
 */

// ---------------------------------------------------------------------------
// Objednávky
// ---------------------------------------------------------------------------

export const listOrders = createServerFn({ method: "GET" })
  .validator((d: { status?: string | null; search?: string; page?: number; perPage?: number }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!dbConfigured()) {
      return {
        rows: [] as OrderRow[],
        total: 0,
        counts: {} as Record<string, number>,
        all: 0,
        page: 1,
        perPage: 10,
        notConfigured: true,
      };
    }
    const perPage = [10, 20, 50].includes(Number(data.perPage)) ? Number(data.perPage) : 10;
    const page = Math.max(1, Math.floor(Number(data.page) || 1));
    const parts: string[] = [];
    if (data.status && ORDER_STATUSES.includes(data.status as OrderStatus))
      parts.push(`status=eq.${data.status}`);
    const s = (data.search ?? "")
      .trim()
      .replace(/[(),*]/g, " ")
      .trim();
    if (s) {
      const v = q(`*${s}*`);
      parts.push(
        `or=(number.ilike.${v},customer->>email.ilike.${v},customer->>name.ilike.${v},customer->>phone.ilike.${v})`,
      );
    }
    parts.push(
      "select=id,number,created_at,status,customer,delivery,payment,total,paid_at",
      "order=created_at.desc",
      `limit=${perPage}`,
      `offset=${(page - 1) * perPage}`,
    );
    const { rows, total } = await db.selectCount<OrderRow>("vf_orders", parts.join("&"));
    const all = await db.select<{ status: OrderStatus }>("vf_orders", "select=status&limit=10000");
    const counts: Record<string, number> = {};
    for (const r of all) counts[r.status] = (counts[r.status] ?? 0) + 1;
    return { rows, total, counts, all: all.length, page, perPage, notConfigured: false };
  });

export const getOrder = createServerFn({ method: "GET" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const [order] = await db.select<OrderRow>("vf_orders", `id=eq.${q(data.id)}&limit=1`);
    if (!order)
      return { order: null, vouchers: [] as VoucherRow[], accounts: [] as BankAccountRow[] };
    const vouchers = await db.select<VoucherRow>(
      "vf_vouchers",
      `order_id=eq.${q(order.id)}&order=created_at`,
    );
    const { bank_accounts } = await loadSettings();
    return { order, vouchers, accounts: bank_accounts };
  });

async function findOrder(id: string) {
  const [o] = await db.select<OrderRow>("vf_orders", `id=eq.${q(id)}&limit=1`);
  return o ?? null;
}

/** Kód poukazu bez zaměnitelných znaků (0/O, 1/I/L). */
function voucherCode(): string {
  const abc = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const r = crypto.getRandomValues(new Uint8Array(8));
  const s = [...r].map((b) => abc[b % abc.length]).join("");
  return `VF-${s.slice(0, 4)}-${s.slice(4)}`;
}

/** Vystaví poukazy k zaplacené objednávce (jen jednou — při opakování vrátí existující). */
async function issueVouchers(o: OrderRow): Promise<VoucherRow[]> {
  const existing = await db.select<VoucherRow>("vf_vouchers", `order_id=eq.${q(o.id)}`);
  if (existing.length) return existing;
  const out: VoucherRow[] = [];
  const valid = new Date();
  valid.setMonth(valid.getMonth() + VOUCHER_VALID_MONTHS);
  for (const line of o.items) {
    if (!products.find((x) => x.slug === line.slug)?.digital) continue;
    for (let i = 0; i < line.qty; i++) {
      out.push(
        await db.insert<VoucherRow>("vf_vouchers", {
          code: voucherCode(),
          order_id: o.id,
          order_number: o.number,
          value: line.unit,
          remaining: line.unit,
          valid_until: valid.toISOString().slice(0, 10),
          status: "aktivni",
        }),
      );
    }
  }
  return out;
}

async function mail(
  o: OrderRow,
  m: { subject: string; html: string },
  attachments?: { name: string; content: string }[],
) {
  try {
    await sendEmail({
      to: o.customer.email,
      toName: o.customer.name,
      ...m,
      ...(attachments ? { attachments } : {}),
    });
    return " Zákazníkovi odešel e-mail.";
  } catch {
    return " E-mail zákazníkovi se NEPODAŘILO odeslat.";
  }
}

export const setOrderStatus = createServerFn({ method: "POST" })
  .validator(
    (d: {
      id: string;
      status: OrderStatus;
      notify: boolean;
      tracking?: string | null | undefined;
    }) => d,
  )
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    await requireAdmin();
    const o = await findOrder(data.id);
    if (!o || !ORDER_STATUSES.includes(data.status))
      return { ok: false, message: "Objednávka nenalezena." };
    const patch: Partial<OrderRow> = { status: data.status };
    if (data.tracking !== undefined)
      patch.tracking = (data.tracking ?? "").trim().slice(0, 60) || null;
    const [u] = await db.update<OrderRow>("vf_orders", `id=eq.${q(o.id)}`, patch);
    const updated = u ?? { ...o, ...patch };
    if (data.status === "zrusena")
      await db.update("vf_vouchers", `order_id=eq.${q(o.id)}`, { status: "zruseno" });
    let mailed = "";
    if (
      data.notify &&
      data.status !== o.status &&
      (data.status === "odeslano" || data.status === "zrusena")
    ) {
      mailed = await mail(updated, statusEmail(updated, data.status));
    }
    return { ok: true, message: `Stav změněn.${mailed}` };
  });

export const markPaid = createServerFn({ method: "POST" })
  .validator((d: { id: string; notify: boolean }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    await requireAdmin();
    const o = await findOrder(data.id);
    if (!o) return { ok: false, message: "Objednávka nenalezena." };
    const patch: Partial<OrderRow> = { paid_at: o.paid_at ?? new Date().toISOString() };
    if (o.status === "nova") patch.status = "zpracovava";
    const [u] = await db.update<OrderRow>("vf_orders", `id=eq.${q(o.id)}`, patch);
    const updated = u ?? { ...o, ...patch };
    const vouchers = await issueVouchers(updated);
    const mailed = data.notify
      ? await mail(
          updated,
          paidEmail(
            updated,
            vouchers.filter((v) => v.status === "aktivni"),
          ),
        )
      : "";
    const v = vouchers.length ? ` Poukazů: ${vouchers.length}.` : "";
    return { ok: true, message: `Platba zaznamenána.${v}${mailed}` };
  });

export const sendPaymentRequest = createServerFn({ method: "POST" })
  .validator((d: { id: string; accountId: string }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; message: string }> => {
    await requireAdmin();
    const o = await findOrder(data.id);
    const acc = (await loadSettings()).bank_accounts.find((a) => a.id === data.accountId);
    if (!o || !acc) return { ok: false, message: "Chybí objednávka nebo bankovní účet." };
    const iban = accountToIban(acc.account);
    const due = new Date();
    due.setDate(due.getDate() + PAYMENT_DUE_DAYS);
    const spayd = buildSpayd({
      account: acc.account,
      amount: Number(o.total),
      variableSymbol: o.vs,
      message: `Objednavka ${o.number}`,
      recipient: "Vapesport Vlach s.r.o.",
      dueDate: due,
    });
    if (!iban || !spayd)
      return { ok: false, message: "Číslo účtu neprošlo kontrolou — oprav ho v Nastavení." };
    const png = toBase64(await qrPng(spayd));
    const r = await mail(
      o,
      paymentRequestEmail(o, { name: acc.name, account: acc.account, iban }, due),
      [{ name: `qr-platba-${o.number}.png`, content: png }],
    );
    return { ok: !r.includes("NEPODAŘILO"), message: `Výzva k platbě:${r}` };
  });

export const saveOrderNote = createServerFn({ method: "POST" })
  .validator((d: { id: string; admin_note: string; tracking?: string | null | undefined }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    const patch: Partial<OrderRow> = { admin_note: data.admin_note.slice(0, 4000) || null };
    if (data.tracking !== undefined)
      patch.tracking = (data.tracking ?? "").trim().slice(0, 60) || null;
    await db.update("vf_orders", `id=eq.${q(data.id)}`, patch);
    return { ok: true };
  });

export const deleteOrder = createServerFn({ method: "POST" })
  .validator((d: { id: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    // Vystavené poukazy zůstávají platné (order_id se jen odpojí) — byly zaplacené.
    await db.remove("vf_orders", `id=eq.${q(data.id)}`);
    return { ok: true };
  });

// ---------------------------------------------------------------------------
// Nastavení — bankovní účty
// ---------------------------------------------------------------------------

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  await requireAdmin();
  return loadSettings();
});

export const saveBankAccounts = createServerFn({ method: "POST" })
  .validator((d: { accounts: { id?: string; name: string; account: string }[] }) => d)
  .handler(
    async ({ data }): Promise<{ ok: boolean; message: string; accounts: BankAccountRow[] }> => {
      await requireAdmin();
      if (!dbConfigured()) {
        return {
          ok: false,
          message: "Účty se ukládají do databáze — nejdřív ji připoj (Supabase).",
          accounts: [],
        };
      }
      const clean: BankAccountRow[] = [];
      for (const a of (data.accounts ?? []).slice(0, 10)) {
        const name = String(a.name ?? "")
          .trim()
          .slice(0, 60);
        const account = String(a.account ?? "")
          .trim()
          .slice(0, 40);
        if (!account) continue;
        if (!accountToIban(account)) {
          return {
            ok: false,
            message: `Účet „${account}" neprošel kontrolou. Zkontroluj IBAN nebo číslo účtu.`,
            accounts: [],
          };
        }
        clean.push({ id: a.id || crypto.randomUUID(), name: name || "Účet", account });
      }
      await saveSetting("bank_accounts", clean);
      return { ok: true, message: "Uloženo.", accounts: clean };
    },
  );

// ---------------------------------------------------------------------------
// Poukazy
// ---------------------------------------------------------------------------

export const listVouchers = createServerFn({ method: "GET" })
  .validator((d: { search?: string }) => d)
  .handler(async ({ data }) => {
    await requireAdmin();
    if (!dbConfigured()) return [] as VoucherRow[];
    const s = (data.search ?? "")
      .trim()
      .toUpperCase()
      .replace(/[(),*]/g, " ")
      .trim();
    const filter = s
      ? `or=(code.ilike.${q(`*${s}*`)},order_number.ilike.${q(`*${s}*`)},recipient.ilike.${q(`*${s}*`)})&`
      : "";
    return db.select<VoucherRow>("vf_vouchers", `${filter}order=created_at.desc&limit=300`);
  });

export const updateVoucher = createServerFn({ method: "POST" })
  .validator(
    (d: {
      code: string;
      remaining?: number;
      status?: VoucherRow["status"];
      recipient?: string;
      note?: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    await requireAdmin();
    const patch: Partial<VoucherRow> = {};
    if (typeof data.remaining === "number" && data.remaining >= 0)
      patch.remaining = Math.round(data.remaining);
    if (data.status && ["aktivni", "uplatneno", "zruseno"].includes(data.status))
      patch.status = data.status;
    if (data.recipient !== undefined) patch.recipient = data.recipient.slice(0, 120) || null;
    if (data.note !== undefined) patch.note = data.note.slice(0, 1000) || null;
    if (patch.remaining === 0 && !patch.status) patch.status = "uplatneno";
    await db.update("vf_vouchers", `code=eq.${q(data.code)}`, patch);
    return { ok: true };
  });

/** Veřejné: stránka poukazu podle kódu (kód je náhodný, neuhodnutelný). */
export const publicVoucher = createServerFn({ method: "GET" })
  .validator((d: { code: string }) => d)
  .handler(async ({ data }) => {
    if (!dbConfigured()) return null;
    const code = String(data.code ?? "")
      .toUpperCase()
      .slice(0, 20);
    if (!/^VF-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) return null;
    const [v] = await db.select<VoucherRow>(
      "vf_vouchers",
      `code=eq.${q(code)}&select=code,value,remaining,valid_until,recipient,status&limit=1`,
    );
    return v ?? null;
  });
