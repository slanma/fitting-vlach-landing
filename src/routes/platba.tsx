import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import QRCode from "qrcode";
import { Button } from "@/components/ui/button";
import { buildSpayd, accountToIban } from "@/lib/qr-platba";
import { BANK_ACCOUNTS, PAYMENT_DUE_DAYS } from "@/lib/shop";

export const Route = createFileRoute("/platba")({
  head: () => ({
    meta: [
      { title: "QR platba" },
      // Interní pomůcka — nemá co dělat ve vyhledávačích.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Page,
});

function Page() {
  const [accountId, setAccountId] = useState(BANK_ACCOUNTS[0]?.id ?? "");
  const [customAccount, setCustomAccount] = useState("");
  const [customRecipient, setCustomRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [vs, setVs] = useState("");
  const [message, setMessage] = useState("");
  const [withDueDate, setWithDueDate] = useState(true);
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  const useCustom = accountId === "__vlastni";
  const picked = BANK_ACCOUNTS.find((a) => a.id === accountId);
  const account = useCustom ? customAccount : (picked?.account ?? "");
  const recipient = useCustom ? customRecipient : (picked?.recipient ?? "");

  const iban = account.trim() ? accountToIban(account.trim()) : null;
  const amountNum = Number(amount.replace(",", "."));
  const amountValid = Number.isFinite(amountNum) && amountNum > 0;

  const due = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + PAYMENT_DUE_DAYS);
    return d;
  }, []);

  const spayd =
    iban && amountValid
      ? buildSpayd({
          account: account.trim(),
          amount: amountNum,
          variableSymbol: vs,
          message,
          recipient,
          dueDate: withDueDate ? due : null,
        })
      : null;

  useEffect(() => {
    if (!spayd) {
      setDataUrl(null);
      return;
    }
    let alive = true;
    QRCode.toDataURL(spayd, { margin: 1, width: 320, errorCorrectionLevel: "M" })
      .then((url) => alive && setDataUrl(url))
      .catch(() => alive && setDataUrl(null));
    return () => {
      alive = false;
    };
  }, [spayd]);

  const field = "h-10 w-full rounded-sm border border-border bg-card px-3 text-sm";

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-3xl px-5 py-12 md:px-10">
        <span className="label-tech">Interní nástroj</span>
        <h1 className="mt-3 text-2xl font-medium text-ink">QR platba</h1>
        <span className="rule-gold mt-5" />
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
          Vyberte účet, zadejte částku a variabilní symbol. QR kód si stáhněte a pošlete zákazníkovi
          e-mailem. Zákazníkovi se nikde nevytváří sám.
        </p>

        {BANK_ACCOUNTS.length === 0 && (
          <p className="mt-6 rounded-sm border border-gold/40 bg-gold/5 p-4 text-xs leading-relaxed text-ink">
            Zatím není uložený žádný účet. Můžete ho zadat ručně níže, nebo si je nechat
            přednastavit v <code>src/lib/shop.ts</code> v poli <code>BANK_ACCOUNTS</code>.
          </p>
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="ucet" className="label-tech">
                Účet
              </label>
              <select
                id="ucet"
                className={`${field} mt-2`}
                value={accountId}
                onChange={(e) => setAccountId(e.target.value)}
              >
                {BANK_ACCOUNTS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} — {a.account}
                  </option>
                ))}
                <option value="__vlastni">Zadat jiný účet…</option>
              </select>
            </div>

            {useCustom && (
              <>
                <div>
                  <label htmlFor="cislo" className="label-tech">
                    Číslo účtu
                  </label>
                  <input
                    id="cislo"
                    className={`${field} mt-2`}
                    placeholder="19-2000145399/0800"
                    value={customAccount}
                    onChange={(e) => setCustomAccount(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="prijemce" className="label-tech">
                    Příjemce
                  </label>
                  <input
                    id="prijemce"
                    className={`${field} mt-2`}
                    value={customRecipient}
                    onChange={(e) => setCustomRecipient(e.target.value)}
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="castka" className="label-tech">
                Částka v Kč
              </label>
              <input
                id="castka"
                inputMode="decimal"
                className={`${field} mt-2`}
                placeholder="12500"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="vs" className="label-tech">
                Variabilní symbol
              </label>
              <input
                id="vs"
                inputMode="numeric"
                className={`${field} mt-2`}
                placeholder="2608200042"
                value={vs}
                onChange={(e) => setVs(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Číslice z čísla objednávky, např. z FV-2608200042.
              </p>
            </div>

            <div>
              <label htmlFor="zprava" className="label-tech">
                Zpráva pro příjemce
              </label>
              <input
                id="zprava"
                className={`${field} mt-2`}
                placeholder="Objednavka FV-2608200042"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <label className="flex items-center gap-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                checked={withDueDate}
                onChange={(e) => setWithDueDate(e.target.checked)}
              />
              Uvést splatnost ({PAYMENT_DUE_DAYS} dní)
            </label>
          </div>

          <div className="space-y-4">
            {account.trim() && !iban && (
              <p className="rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs leading-relaxed text-ink">
                Číslo účtu neprošlo kontrolou. Zkontrolujte ho — QR kód se schválně nevytvoří, aby
                platba neskončila u někoho cizího.
              </p>
            )}

            {dataUrl ? (
              <>
                <img
                  src={dataUrl}
                  alt="QR platba"
                  width={320}
                  height={320}
                  className="rounded-sm border border-border bg-white"
                />
                <dl className="space-y-1 text-sm">
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Účet:</dt>
                    <dd className="text-ink">{account}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">IBAN:</dt>
                    <dd className="text-ink">{iban}</dd>
                  </div>
                  <div className="flex gap-2">
                    <dt className="text-muted-foreground">Částka:</dt>
                    <dd className="text-ink">{amountNum.toFixed(2)} Kč</dd>
                  </div>
                </dl>
                <Button asChild variant="outline" className="w-full">
                  <a href={dataUrl} download={`qr-platba-${vs || "bez-vs"}.png`}>
                    Stáhnout QR kód
                  </a>
                </Button>
              </>
            ) : (
              <div className="flex h-[320px] w-[320px] max-w-full items-center justify-center rounded-sm border border-dashed border-border text-xs text-muted-foreground">
                Vyplňte účet a částku
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
