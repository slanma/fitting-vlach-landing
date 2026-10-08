import { useEffect, useState, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { adminSetup, login, logout, whoAmI, type AdminSetup } from "@/lib/admin-auth";
import { SELLER } from "@/lib/prodavajici";

export const adminField = "h-10 w-full rounded-sm border border-border bg-card px-3 text-sm";

/**
 * Rám administrace: hlídá přihlášení a kreslí horní lištu.
 * Nepřihlášenému ukáže přihlášení kódem z e-mailu.
 */
export function AdminShell({ children }: { children: ReactNode }) {
  const [who, setWho] = useState<string | null | undefined>(undefined);
  const [setup, setSetup] = useState<AdminSetup | null>(null);

  useEffect(() => {
    whoAmI().then((r) => setWho(r.email));
    adminSetup().then(setSetup);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link to="/admin" className="flex items-center gap-3">
            <span className="font-display text-xl text-ink">FV</span>
            <span className="label-tech">Administrace</span>
          </Link>
          {who && (
            <nav className="flex flex-wrap items-center gap-5 text-sm">
              <Link
                to="/admin"
                className="text-muted-foreground hover:text-ink"
                activeOptions={{ exact: true }}
                activeProps={{ className: "text-ink" }}
              >
                Objednávky
              </Link>
              <Link
                to="/admin/poukazy"
                className="text-muted-foreground hover:text-ink"
                activeProps={{ className: "text-ink" }}
              >
                Poukazy
              </Link>
              <Link
                to="/admin/nastaveni"
                className="text-muted-foreground hover:text-ink"
                activeProps={{ className: "text-ink" }}
              >
                Nastavení
              </Link>
              <a href="/" className="text-muted-foreground hover:text-ink">
                Web
              </a>
              <button
                type="button"
                className="text-muted-foreground hover:text-ink"
                onClick={async () => {
                  await logout();
                  setWho(null);
                }}
              >
                Odhlásit
              </button>
            </nav>
          )}
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {who && setup && setup.missing.length > 0 && (
          <div className="mb-6 rounded-sm border border-gold/50 bg-gold/5 p-4 text-xs leading-relaxed text-ink">
            <p className="font-medium">Ještě není zapojeno:</p>
            <ul className="mt-1 list-disc pl-5">
              {setup.missing.map((m) => (
                <li key={m.key}>
                  <code>{m.key}</code> — {m.what}
                </li>
              ))}
            </ul>
            <p className="mt-2 text-muted-foreground">Postup je v souboru ADMIN-NAVOD.md.</p>
          </div>
        )}
        {who === undefined ? (
          <p className="text-sm text-muted-foreground">Načítám…</p>
        ) : who ? (
          children
        ) : (
          <Login
            canLogin={setup?.canLogin ?? true}
            onDone={() => whoAmI().then((r) => setWho(r.email))}
          />
        )}
      </main>
    </div>
  );
}

function Login({ onDone, canLogin }: { onDone: () => void; canLogin: boolean }) {
  const [email, setEmail] = useState<string>(SELLER.email);
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setMsg(null);
    try {
      const r = await login({ data: { email, password } });
      if (r.ok) onDone();
      else setMsg(r.message ?? "Přihlášení se nepovedlo.");
    } catch {
      setMsg("Přihlášení se nepovedlo. Zkuste to prosím znovu.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto mt-10 max-w-sm space-y-4">
      <h1 className="text-xl font-medium text-ink">Přihlášení</h1>
      {!canLogin && (
        <p className="rounded-sm border border-gold/50 bg-gold/5 p-3 text-xs leading-relaxed text-ink">
          Heslo ještě není nastavené. Na hostingu přidej proměnnou <code>ADMIN_PASSWORD</code>{" "}
          (aspoň 10 znaků) a nasaď web znovu.
        </p>
      )}
      <label className="grid gap-1 text-xs text-muted-foreground">
        E-mail
        <input
          className={adminField}
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label className="grid gap-1 text-xs text-muted-foreground">
        Heslo
        <input
          className={adminField}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
        />
      </label>
      {msg && <p className="text-xs text-destructive">{msg}</p>}
      <Button className="w-full" disabled={busy || !password} onClick={submit}>
        {busy ? "Přihlašuji…" : "Přihlásit"}
      </Button>
    </div>
  );
}
