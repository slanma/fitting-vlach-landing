import { useEffect, useMemo, useState } from "react";
import { Download, Mail, Trash2, X, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminField } from "@/components/admin/AdminShell";
import {
  deleteOrder,
  getOrder,
  markPaid,
  saveOrderNote,
  sendPaymentRequest,
  setOrderStatus,
} from "@/lib/admin-api";
import {
  ORDER_STATUSES,
  STATUS_LABEL,
  type BankAccountRow,
  type OrderRow,
  type OrderStatus,
  type VoucherRow,
} from "@/lib/db";
import { vatBreakdown } from "@/lib/dph";
import { accountToIban, buildSpayd } from "@/lib/qr-platba";
import { qrSvg } from "@/lib/qr-kod";
import { PAYMENT_DUE_DAYS } from "@/lib/shop";

const kc = (n: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(Math.round(n));

export const statusTone: Record<OrderStatus, string> = {
  nova: "bg-gold/15 text-ink",
  zpracovava: "bg-sky-600/10 text-ink",
  odeslano: "bg-emerald-600/10 text-emerald-800",
  dorucena: "bg-emerald-600/15 text-emerald-900",
  zrusena: "bg-destructive/10 text-destructive",
};

export function StatusBadge({ s }: { s: OrderStatus }) {
  return (
    <span className={`inline-block rounded-sm px-2 py-0.5 text-xs font-medium ${statusTone[s]}`}>
      {STATUS_LABEL[s]}
    </span>
  );
}

/** Detail objednávky jako na vapesport.cz — okno nad seznamem. */
export function OrderModal({
  id,
  onClose,
  onChanged,
}: {
  id: string;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [order, setOrder] = useState<OrderRow | null | undefined>(undefined);
  const [vouchers, setVouchers] = useState<VoucherRow[]>([]);
  const [accounts, setAccounts] = useState<BankAccountRow[]>([]);
  const [accountId, setAccountId] = useState("");
  const [tracking, setTracking] = useState("");
  const [note, setNote] = useState("");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function load() {
    const r = await getOrder({ data: { id } });
    setOrder(r.order);
    setVouchers(r.vouchers);
    setAccounts(r.accounts);
    setAccountId((cur) => cur || r.accounts[0]?.id || "");
    setTracking(r.order?.tracking ?? "");
    setNote(r.order?.admin_note ?? "");
  }
  useEffect(() => {
    load().catch(() => setOrder(null));
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [id]);

  const acc = accounts.find((a) => a.id === accountId);
  const qr = useMemo(() => {
    if (!order || !acc) return null;
    const due = new Date();
    due.setDate(due.getDate() + PAYMENT_DUE_DAYS);
    const spayd = buildSpayd({
      account: acc.account,
      amount: Number(order.total),
      variableSymbol: order.vs,
      message: `Objednavka ${order.number}`,
      recipient: "Vapesport Vlach s.r.o.",
      dueDate: due,
    });
    if (!spayd) return null;
    const svg = qrSvg(spayd, 240);
    return {
      href: `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`,
      iban: accountToIban(acc.account),
    };
  }, [order, acc]);

  async function run(fn: () => Promise<{ message?: string } | { ok: boolean }>) {
    setBusy(true);
    setMsg(null);
    try {
      const r = await fn();
      if ("message" in r && r.message) setMsg(r.message);
      await load();
      onChanged();
    } catch {
      setMsg("Akce se nepovedla. Zkus to prosím znovu.");
    } finally {
      setBusy(false);
    }
  }

  const o = order;
  const shipped = o && (o.delivery.id === "ppl" || o.delivery.id === "zasilkovna");

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/60 p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-3xl rounded-sm border border-border bg-background p-6 shadow-card sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          aria-label="Zavřít"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-ink"
        >
          <X className="h-5 w-5" />
        </button>

        {o === undefined ? (
          <p className="text-sm text-muted-foreground">Načítám…</p>
        ) : o === null ? (
          <p className="text-sm text-muted-foreground">Objednávka nenalezena.</p>
        ) : (
          <div className="space-y-8 text-sm">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="font-mono text-base font-semibold text-ink">{o.number}</h2>
                <StatusBadge s={o.status} />
                {o.paid_at && (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-emerald-600/10 px-2 py-0.5 text-xs font-medium text-emerald-800">
                    <CheckCircle2 className="h-3 w-3" /> Zaplaceno{" "}
                    {new Date(o.paid_at).toLocaleDateString("cs-CZ")}
                  </span>
                )}
              </div>
              <p className="mt-1 text-muted-foreground">
                Vytvořeno {new Date(o.created_at).toLocaleString("cs-CZ")}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <h3 className="font-medium text-ink">Zákazník</h3>
                <p className="mt-2 text-ink">{o.customer.name}</p>
                <p>
                  <a
                    className="text-muted-foreground hover:underline"
                    href={`mailto:${o.customer.email}`}
                  >
                    {o.customer.email}
                  </a>
                </p>
                <p>
                  <a
                    className="text-muted-foreground hover:underline"
                    href={`tel:${o.customer.phone}`}
                  >
                    {o.customer.phone}
                  </a>
                </p>
                {o.no_marketing && (
                  <p className="mt-1 text-xs text-destructive">Nechce obchodní sdělení</p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-ink">Doprava a platba</h3>
                <p className="mt-2 text-muted-foreground">
                  Doprava:{" "}
                  <span className="text-ink">
                    {o.delivery.label} ({o.delivery.price ? kc(o.delivery.price) : "zdarma"})
                  </span>
                </p>
                <p className="text-muted-foreground">
                  Platba:{" "}
                  <span className="text-ink">
                    {o.payment.label}
                    {o.payment.fee ? ` (${kc(o.payment.fee)})` : ""}
                  </span>
                </p>
                {o.pickup_point && (
                  <p className="text-muted-foreground">
                    Výdejní místo:{" "}
                    <span className="text-ink">
                      {o.pickup_point.name}
                      {o.pickup_point.id ? ` (#${o.pickup_point.id})` : ""}
                    </span>
                  </p>
                )}
                {o.address && (
                  <p className="text-muted-foreground">
                    Adresa:{" "}
                    <span className="text-ink">
                      {o.address.street}, {o.address.zip} {o.address.city}
                    </span>
                  </p>
                )}
              </div>
            </div>

            {o.customer.note && (
              <div>
                <h3 className="font-medium text-ink">Poznámka zákazníka</h3>
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground">{o.customer.note}</p>
              </div>
            )}

            <Breakdown o={o} />

            {vouchers.length > 0 && (
              <div>
                <h3 className="font-medium text-ink">Vystavené poukazy</h3>
                <ul className="mt-2 space-y-1">
                  {vouchers.map((v) => (
                    <li key={v.code}>
                      <a
                        className="font-mono underline underline-offset-4"
                        href={`/poukaz/${v.code}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {v.code}
                      </a>{" "}
                      <span className="text-muted-foreground">
                        — {kc(v.value)}, zbývá {kc(v.remaining)}, platí do{" "}
                        {new Date(v.valid_until).toLocaleDateString("cs-CZ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {o.payment.id === "prevod" && (
              <div className="border-t border-border pt-6">
                <h3 className="font-medium text-ink">Podklady k platbě</h3>
                {accounts.length === 0 ? (
                  <p className="mt-2 text-muted-foreground">
                    Není nastavený žádný účet. Přidej ho v{" "}
                    <a className="underline" href="/admin/nastaveni">
                      Nastavení
                    </a>
                    .
                  </p>
                ) : (
                  <div className="mt-3 grid gap-5 sm:grid-cols-[1fr_auto]">
                    <div className="space-y-3">
                      <label className="grid gap-1 text-xs text-muted-foreground">
                        Bankovní účet
                        <select
                          className={adminField}
                          value={accountId}
                          onChange={(e) => setAccountId(e.target.value)}
                        >
                          {accounts.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.name} — {a.account}
                            </option>
                          ))}
                        </select>
                      </label>
                      <p className="font-mono text-xs leading-relaxed text-ink">
                        IBAN: {qr?.iban ?? "—"}
                        <br />
                        Částka: {Number(o.total)} CZK
                        <br />
                        VS: {o.vs}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {qr && (
                          <Button asChild variant="outline" size="sm">
                            <a href={qr.href} download={`qr-platba-${o.number}.svg`}>
                              <Download className="mr-2 h-4 w-4" /> Stáhnout QR kód
                            </a>
                          </Button>
                        )}
                        <Button
                          size="sm"
                          disabled={busy || !qr}
                          onClick={() =>
                            run(() => sendPaymentRequest({ data: { id: o.id, accountId } }))
                          }
                        >
                          <Mail className="mr-2 h-4 w-4" /> Odeslat výzvu k platbě
                        </Button>
                        {!o.paid_at && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => run(() => markPaid({ data: { id: o.id, notify } }))}
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" /> Platba přijata
                          </Button>
                        )}
                      </div>
                    </div>
                    {qr && (
                      <img
                        src={qr.href}
                        alt="QR platba"
                        width={160}
                        height={160}
                        className="rounded-sm border border-border bg-white p-1"
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="font-medium text-ink">Změnit stav</h3>
              {shipped && (
                <label className="grid max-w-sm gap-1 text-xs text-muted-foreground">
                  Číslo zásilky (pošle se zákazníkovi při „Odesláno")
                  <input
                    className={adminField}
                    value={tracking}
                    onChange={(e) => setTracking(e.target.value)}
                  />
                </label>
              )}
              <div className="flex flex-wrap gap-2">
                {ORDER_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={busy || s === o.status}
                    onClick={() => {
                      if (s === "zrusena" && !confirm("Opravdu zrušit objednávku?")) return;
                      run(() =>
                        setOrderStatus({ data: { id: o.id, status: s, notify, tracking } }),
                      );
                    }}
                    className={`rounded-full border px-3 py-1 text-xs ${
                      s === o.status
                        ? "border-ink bg-ink text-background"
                        : "border-border text-muted-foreground hover:text-ink"
                    }`}
                  >
                    {s === "odeslano" && o.delivery.id === "osobni"
                      ? "Připraveno k vyzvednutí"
                      : STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                />
                Poslat zákazníkovi e-mail (při platbě, odeslání a zrušení)
              </label>
              <label className="grid gap-1 text-xs text-muted-foreground">
                Interní poznámka
                <textarea
                  className="min-h-16 rounded-sm border border-border bg-card px-3 py-2 text-sm"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </label>
              <Button
                variant="outline"
                size="sm"
                disabled={busy}
                onClick={() =>
                  run(() => saveOrderNote({ data: { id: o.id, admin_note: note, tracking } }))
                }
              >
                Uložit poznámku
              </Button>
              {msg && <p className="text-ink">{msg}</p>}
            </div>

            <div className="border-t border-border pt-6">
              <Button
                variant="outline"
                size="sm"
                className="border-destructive/50 text-destructive hover:bg-destructive/5"
                disabled={busy}
                onClick={async () => {
                  if (!confirm(`Smazat objednávku ${o.number}? Nelze vrátit.`)) return;
                  await deleteOrder({ data: { id: o.id } });
                  onChanged();
                  onClose();
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Smazat objednávku
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Breakdown({ o }: { o: OrderRow }) {
  const b = vatBreakdown(o);
  return (
    <div>
      <h3 className="font-medium text-ink">Fakturační rozpis</h3>
      <div className="mt-3 overflow-x-auto rounded-sm border border-border bg-card">
        <table className="w-full min-w-[520px]">
          <thead className="border-b border-border text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-2 text-left font-normal">Produkt</th>
              <th className="px-4 py-2 text-right font-normal">Ks</th>
              <th className="px-4 py-2 text-right font-normal">
                Cena za ks<span className="block text-[0.65rem]">bez DPH</span>
              </th>
              <th className="px-4 py-2 text-right font-normal">DPH</th>
              <th className="px-4 py-2 text-right font-normal">
                Celkem<span className="block text-[0.65rem]">bez DPH</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {b.lines.map((l, i) => (
              <tr key={i}>
                <td className="px-4 py-2 text-ink">
                  {l.name}
                  {l.detail && (
                    <span className="block text-xs text-muted-foreground">{l.detail}</span>
                  )}
                  {l.rate === 0 && (
                    <span className="block text-xs text-muted-foreground">
                      víceúčelový poukaz — DPH při uplatnění
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-right">{l.qty}</td>
                <td className="px-4 py-2 text-right">{kc(l.unitNet)}</td>
                <td className="px-4 py-2 text-right text-muted-foreground">
                  {l.rate ? kc(l.unitVat) : "—"}
                </td>
                <td className="px-4 py-2 text-right">{kc(l.totalNet)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={4} className="px-4 py-2 text-ink">
                Mezisoučet bez DPH
              </td>
              <td className="px-4 py-2 text-right">{kc(b.goodsNet)}</td>
            </tr>
            <tr className="text-muted-foreground">
              <td colSpan={4} className="px-4 py-2">
                {b.extrasLabel} (bez DPH)
              </td>
              <td className="px-4 py-2 text-right">{kc(b.extrasNet)}</td>
            </tr>
            <tr className="text-muted-foreground">
              <td colSpan={4} className="px-4 py-2">
                Hodnota DPH 21 %
              </td>
              <td className="px-4 py-2 text-right">{kc(b.vat)}</td>
            </tr>
            <tr className="bg-muted/50 font-semibold text-ink">
              <td colSpan={4} className="px-4 py-3 uppercase">
                Celkem k úhradě
              </td>
              <td className="px-4 py-3 text-right text-base">{kc(b.total)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
