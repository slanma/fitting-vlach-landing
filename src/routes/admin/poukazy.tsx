import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { AdminShell, adminField } from "@/components/admin/AdminShell";
import { listVouchers, updateVoucher } from "@/lib/admin-api";
import type { VoucherRow } from "@/lib/db";
import { formatPrice } from "@/data/eshop";

export const Route = createFileRoute("/admin/poukazy")({
  head: () => ({
    meta: [{ title: "Poukazy — administrace" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => (
    <AdminShell>
      <Vouchers />
    </AdminShell>
  ),
});

const LABEL: Record<VoucherRow["status"], string> = {
  aktivni: "Aktivní",
  uplatneno: "Uplatněný",
  zruseno: "Zrušený",
};

function Vouchers() {
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<VoucherRow[] | null>(null);

  const load = (s = search) => listVouchers({ data: { search: s } }).then(setRows);
  useEffect(() => {
    load("");
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-medium text-ink">Dárkové poukazy</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Když zákazník poukaz uplatní, najdi ho podle kódu a sniž zbývající hodnotu. Při nule se sám
        označí jako uplatněný.
      </p>
      <div className="mt-5 flex max-w-md gap-2">
        <input
          className={adminField}
          placeholder="Kód, číslo objednávky nebo jméno"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
        />
        <Button variant="outline" onClick={() => load()}>
          Hledat
        </Button>
      </div>

      {!rows ? (
        <p className="mt-6 text-sm text-muted-foreground">Načítám…</p>
      ) : rows.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Žádné poukazy.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {rows.map((v) => (
            <VoucherCard key={v.code} v={v} onSaved={() => load()} />
          ))}
        </div>
      )}
    </div>
  );
}

function VoucherCard({ v, onSaved }: { v: VoucherRow; onSaved: () => void }) {
  const [remaining, setRemaining] = useState(String(v.remaining));
  const [recipient, setRecipient] = useState(v.recipient ?? "");
  const [note, setNote] = useState(v.note ?? "");
  const [busy, setBusy] = useState(false);
  const expired = new Date(v.valid_until) < new Date(new Date().toDateString());

  async function save(status?: VoucherRow["status"]) {
    setBusy(true);
    await updateVoucher({
      data: {
        code: v.code,
        remaining: Number(remaining),
        recipient,
        note,
        ...(status ? { status } : {}),
      },
    });
    setBusy(false);
    onSaved();
  }

  return (
    <div className="grid gap-4 border border-border bg-card p-4 text-sm md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end">
      <div>
        <a
          href={`/poukaz/${v.code}`}
          target="_blank"
          rel="noreferrer"
          className="font-display text-base text-ink underline-offset-4 hover:underline"
        >
          {v.code}
        </a>
        <p className="text-xs text-muted-foreground">
          {formatPrice(v.value)} · {v.order_number ?? "ručně"} · platí do{" "}
          {new Date(v.valid_until).toLocaleDateString("cs-CZ")}
          {expired && <span className="text-destructive"> (propadlý)</span>}
        </p>
        <p className="mt-1 text-xs">{LABEL[v.status]}</p>
      </div>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Zbývá (Kč)
        <input
          className={adminField}
          inputMode="numeric"
          value={remaining}
          onChange={(e) => setRemaining(e.target.value.replace(/\D/g, ""))}
        />
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Obdarovaný / poznámka
        <input
          className={adminField}
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="Jméno na poukazu"
        />
        <input
          className={adminField}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Interní poznámka"
        />
      </label>
      <div className="flex gap-2">
        <Button size="sm" disabled={busy} onClick={() => save()}>
          Uložit
        </Button>
        {v.status !== "zruseno" && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => confirm("Zrušit poukaz?") && save("zruseno")}
          >
            Zrušit
          </Button>
        )}
      </div>
    </div>
  );
}
