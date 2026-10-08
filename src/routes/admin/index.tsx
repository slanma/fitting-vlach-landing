import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderModal, StatusBadge } from "@/components/admin/OrderModal";
import { listOrders } from "@/lib/admin-api";
import { ORDER_STATUSES, STATUS_LABEL, type OrderRow, type OrderStatus } from "@/lib/db";

export const Route = createFileRoute("/admin/")({
  validateSearch: (s: Record<string, unknown>): { objednavka?: string } =>
    typeof s["objednavka"] === "string" ? { objednavka: s["objednavka"] } : {},
  head: () => ({
    meta: [
      { title: "Objednávky — administrace" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => (
    <AdminShell>
      <Orders />
    </AdminShell>
  ),
});

const kc = (n: number) =>
  new Intl.NumberFormat("cs-CZ", {
    style: "currency",
    currency: "CZK",
    maximumFractionDigits: 0,
  }).format(n);

function Orders() {
  const { objednavka } = Route.useSearch();
  const navigate = useNavigate({ from: "/admin/" });
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [data, setData] = useState<{
    rows: OrderRow[];
    total: number;
    counts: Record<string, number>;
    all: number;
    notConfigured: boolean;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  // Hledání se spustí chvilku po dopsání, ne po každém písmenu.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    listOrders({ data: { status, search: query, page, perPage } })
      .then((r) => {
        setData(r);
        setError(null);
      })
      .catch(() => setError("Objednávky se nepodařilo načíst."));
  }, [status, query, page, perPage, tick]);

  const pages = data ? Math.max(1, Math.ceil(data.total / perPage)) : 1;
  const from = data && data.total ? (page - 1) * perPage + 1 : 0;
  const to = data ? Math.min(page * perPage, data.total) : 0;
  const open = (id?: string) => navigate({ search: id ? { objednavka: id } : {} });

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink">Objednávky</h1>
      {data && (
        <p className="mt-1 text-sm text-muted-foreground">
          {data.total} z {data.all} objednávek
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            className="h-10 w-full rounded-sm border border-border bg-card pl-9 pr-3 text-sm"
            placeholder="Hledat podle čísla, jména, e-mailu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          {([null, ...ORDER_STATUSES] as (OrderStatus | null)[]).map((t) => (
            <button
              key={t ?? "vse"}
              type="button"
              onClick={() => {
                setStatus(t);
                setPage(1);
              }}
              className={`rounded-full border px-3 py-1 text-xs ${status === t ? "border-ink bg-ink text-background" : "border-border text-muted-foreground hover:text-ink"}`}
            >
              {t ? STATUS_LABEL[t] : "Vše"}{" "}
              <span className="opacity-70">{t ? (data?.counts[t] ?? 0) : (data?.all ?? 0)}</span>
            </button>
          ))}
        </div>
      </div>

      {error && <p className="mt-6 text-sm text-destructive">{error}</p>}
      {!data ? (
        <p className="mt-6 text-sm text-muted-foreground">Načítám…</p>
      ) : data.notConfigured ? (
        <p className="mt-6 text-sm text-muted-foreground">
          Databáze ještě není připojená, takže tu zatím žádné objednávky nejsou. Do té doby chodí
          objednávky jen e-mailem.
        </p>
      ) : data.rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Žádné objednávky.</p>
      ) : (
        <>
          <div className="mt-5 overflow-x-auto rounded-sm border border-border bg-card">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-border bg-muted/40 text-left text-xs text-ink">
                <tr>
                  <th className="px-4 py-3 font-medium">Číslo</th>
                  <th className="px-4 py-3 font-medium">Datum</th>
                  <th className="px-4 py-3 font-medium">Zákazník</th>
                  <th className="px-4 py-3 text-right font-medium">Částka</th>
                  <th className="px-4 py-3 font-medium">Stav</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.rows.map((o) => (
                  <tr
                    key={o.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => open(o.id)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {o.number}
                    </td>
                    <td className="px-4 py-3">
                      {new Date(o.created_at).toLocaleDateString("cs-CZ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-ink">{o.customer.name}</span>
                      <span className="block text-xs text-muted-foreground">
                        {o.customer.email}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-medium">{kc(Number(o.total))}</td>
                    <td className="px-4 py-3">
                      <StatusBadge s={o.status} />
                      {o.paid_at && o.status === "nova" && (
                        <span className="ml-2 text-xs text-emerald-800">zaplaceno</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              Zobrazeno{" "}
              <strong className="text-ink">
                {from}–{to}
              </strong>{" "}
              z {data.total}
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2">
                Na stránku:
                <select
                  className="h-8 rounded-sm border border-border bg-card px-2"
                  value={perPage}
                  onChange={(e) => {
                    setPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  {[10, 20, 50].map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                aria-label="Předchozí"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-ink">
                {page} / {pages}
              </span>
              <button
                type="button"
                aria-label="Další"
                disabled={page >= pages}
                onClick={() => setPage(page + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-sm border border-border disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}

      {objednavka && (
        <OrderModal
          id={objednavka}
          onClose={() => open()}
          onChanged={() => setTick((t) => t + 1)}
        />
      )}
    </div>
  );
}
