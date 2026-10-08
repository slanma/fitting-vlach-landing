import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminShell, adminField } from "@/components/admin/AdminShell";
import { getSettings, saveBankAccounts } from "@/lib/admin-api";
import type { BankAccountRow } from "@/lib/db";
import { accountToIban } from "@/lib/qr-platba";

export const Route = createFileRoute("/admin/nastaveni")({
  head: () => ({
    meta: [{ title: "Nastavení — administrace" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: () => (
    <AdminShell>
      <Nastaveni />
    </AdminShell>
  ),
});

function Nastaveni() {
  const [accounts, setAccounts] = useState<BankAccountRow[] | null>(null);
  const [name, setName] = useState("");
  const [account, setAccount] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getSettings().then((s) => setAccounts(s.bank_accounts));
  }, []);

  async function persist(next: BankAccountRow[]) {
    setBusy(true);
    const r = await saveBankAccounts({ data: { accounts: next } }).catch(() => ({
      ok: false,
      message: "Uložení se nepovedlo.",
      accounts: [] as BankAccountRow[],
    }));
    setBusy(false);
    setMsg({ ok: r.ok, text: r.message });
    if (r.ok) setAccounts(r.accounts);
    return r.ok;
  }

  const valid = account.trim() !== "" && accountToIban(account) !== null;

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-medium text-ink">Nastavení</h1>

      <section className="rounded-sm border border-border bg-card p-6">
        <h2 className="text-lg font-medium text-ink">Bankovní účty</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Účty pro QR platby — vybíráš z nich v detailu objednávky u „Odeslat výzvu k platbě“. První
          účet je předvybraný. objednávky.
        </p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <input
            className={`${adminField} sm:max-w-[11rem]`}
            placeholder="Název banky (např. Fio)"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className={`${adminField} font-mono`}
            placeholder="IBAN nebo číslo účtu (např. 2900000000/2010)"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
          />
          <Button
            disabled={busy || !valid}
            onClick={async () => {
              if (await persist([...(accounts ?? []), { id: "", name, account }])) {
                setName("");
                setAccount("");
              }
            }}
          >
            <Plus className="mr-1 h-4 w-4" /> Přidat
          </Button>
        </div>
        {account.trim() && !valid && (
          <p className="mt-2 text-xs text-destructive">Číslo účtu nebo IBAN neprošel kontrolou.</p>
        )}

        <ul className="mt-5 divide-y divide-border">
          {accounts === null ? (
            <li className="py-3 text-sm text-muted-foreground">Načítám…</li>
          ) : accounts.length === 0 ? (
            <li className="py-3 text-sm text-muted-foreground">Zatím žádný účet.</li>
          ) : (
            accounts.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                <span>
                  <span className="text-ink">{a.name}</span>
                  {i === 0 && (
                    <span className="ml-2 rounded-sm bg-gold/15 px-1.5 py-0.5 text-[0.65rem] uppercase text-ink">
                      výchozí
                    </span>
                  )}
                  <span className="block font-mono text-xs text-muted-foreground">
                    {a.account} · {accountToIban(a.account)}
                  </span>
                </span>
                <span className="flex gap-1">
                  {i > 0 && (
                    <button
                      type="button"
                      title="Nastavit jako výchozí"
                      className="p-2 text-muted-foreground hover:text-ink"
                      disabled={busy}
                      onClick={() => persist([a, ...accounts.filter((x) => x.id !== a.id)])}
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Odebrat"
                    className="p-2 text-muted-foreground hover:text-destructive"
                    disabled={busy}
                    onClick={() =>
                      confirm(`Odebrat účet ${a.name}?`) &&
                      persist(accounts.filter((x) => x.id !== a.id))
                    }
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))
          )}
        </ul>
        {msg && (
          <p className={`mt-3 text-xs ${msg.ok ? "text-ink" : "text-destructive"}`}>{msg.text}</p>
        )}
      </section>

      <section className="rounded-sm border border-dashed border-border p-6 text-sm text-muted-foreground">
        <h2 className="text-base font-medium text-ink">Google Analytics 4</h2>
        <p className="mt-1">Doplníme, až bude e-shop hotový.</p>
      </section>
    </div>
  );
}
