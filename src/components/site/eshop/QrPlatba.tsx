import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { buildSpayd } from "@/lib/qr-platba";
import { BANK_ACCOUNT, BANK_RECIPIENT, PAYMENT_DUE_DAYS } from "@/lib/shop";

type Props = {
  amount: number;
  variableSymbol: string;
  message: string;
  /** U zboží na míru je částka orientační, dokud se nepotvrdí konfigurace. */
  provisional?: boolean;
};

export function QrPlatba({ amount, variableSymbol, message, provisional }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  const due = new Date();
  due.setDate(due.getDate() + PAYMENT_DUE_DAYS);

  const spayd = BANK_ACCOUNT
    ? buildSpayd({
        account: BANK_ACCOUNT,
        amount,
        variableSymbol,
        message,
        recipient: BANK_RECIPIENT,
        dueDate: due,
      })
    : null;

  useEffect(() => {
    if (!spayd) return;
    let alive = true;
    QRCode.toDataURL(spayd, { margin: 1, width: 260, errorCorrectionLevel: "M" })
      .then((url) => alive && setDataUrl(url))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [spayd]);

  if (!BANK_ACCOUNT) {
    return (
      <p className="text-sm text-muted-foreground">
        Platební údaje vám pošleme e-mailem spolu s potvrzením objednávky.
      </p>
    );
  }

  if (!spayd || failed) {
    // Radši žádný QR kód než QR kód s penězi mimo.
    return (
      <div className="text-sm">
        <p className="text-muted-foreground">
          QR kód se nepodařilo vytvořit. Zaplaťte prosím ručně:
        </p>
        <dl className="mt-3 space-y-1">
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Účet:</dt>
            <dd className="font-medium text-ink">{BANK_ACCOUNT}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Variabilní symbol:</dt>
            <dd className="font-medium text-ink">{variableSymbol}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Částka:</dt>
            <dd className="font-medium text-ink">{amount.toFixed(2)} Kč</dd>
          </div>
        </dl>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt={`QR platba, částka ${amount.toFixed(2)} Kč, variabilní symbol ${variableSymbol}`}
          width={260}
          height={260}
          className="rounded-sm border border-border bg-white"
        />
      ) : (
        <div className="h-[260px] w-[260px] animate-pulse rounded-sm border border-border bg-muted" />
      )}

      {/* Na mobilu se QR kód nedá naskenovat týmž telefonem, na kterém svítí. */}
      <dl className="space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Účet:</dt>
          <dd className="font-medium text-ink">{BANK_ACCOUNT}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Variabilní symbol:</dt>
          <dd className="font-medium text-ink">{variableSymbol}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Částka:</dt>
          <dd className="font-medium text-ink">{amount.toFixed(2)} Kč</dd>
        </div>
      </dl>

      {provisional && (
        <p className="rounded-sm border border-gold/40 bg-gold/5 p-3 text-xs leading-relaxed text-ink">
          Částka je orientační. U holí stavěných na míru ji potvrdíme až po domluvě konfigurace —{" "}
          <strong>plaťte prosím až po našem potvrzení</strong>.
        </p>
      )}
    </div>
  );
}
