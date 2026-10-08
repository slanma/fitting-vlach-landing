import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicVoucher } from "@/lib/admin-api";
import { formatPrice } from "@/data/eshop";
import { SELLER, sellerSeatText } from "@/lib/prodavajici";
import { PHONE_DISPLAY } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/poukaz/$code")({
  loader: ({ params }) => publicVoucher({ data: { code: params.code } }),
  head: () => ({
    meta: [
      { title: "Dárkový poukaz — Vlach Fitting" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: Voucher,
});

/** Poukaz k vytištění nebo uložení jako PDF (Tisk → Uložit jako PDF). */
function Voucher() {
  const v = Route.useLoaderData();

  if (!v) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-5 text-center text-sm text-muted-foreground">
        Poukaz nebyl nalezen. Zkontrolujte prosím odkaz nebo nám zavolejte na {PHONE_DISPLAY}.
      </div>
    );
  }
  const valid = new Date(v.valid_until).toLocaleDateString("cs-CZ");
  const inactive = v.status !== "aktivni";

  return (
    <div className="min-h-screen bg-background px-5 py-10 print:bg-white print:p-0">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex justify-end print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Vytisknout / uložit jako PDF
          </Button>
        </div>

        <article className="relative border border-gold/50 bg-card p-10 shadow-card print:shadow-none">
          <div className="flex items-start justify-between gap-6">
            <div>
              <span className="font-display text-3xl text-ink">FV</span>
              <p className="label-tech mt-1">Vlach Fitting</p>
            </div>
            <p className="label-tech text-right">Dárkový poukaz</p>
          </div>

          <span className="rule-gold mt-10" />
          <p className="mt-8 font-display text-5xl text-ink">{formatPrice(v.value)}</p>
          {v.remaining !== v.value && v.status === "aktivni" && (
            <p className="mt-2 text-sm text-muted-foreground">
              Zbývá k čerpání: {formatPrice(v.remaining)}
            </p>
          )}
          {v.recipient && <p className="mt-6 text-lg text-ink">pro {v.recipient}</p>}
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            Na hloubkový golfový fitting, stavbu holí na míru nebo příslušenství. Lze čerpat
            najednou i postupně.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-4 border-t border-border pt-6 text-sm">
            <div>
              <dt className="label-tech">Kód poukazu</dt>
              <dd className="mt-1 font-display text-lg tracking-wider text-ink">{v.code}</dd>
            </div>
            <div>
              <dt className="label-tech">Platí do</dt>
              <dd className="mt-1 text-lg text-ink">{valid}</dd>
            </div>
          </dl>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            Termín fittingu domluvíte na {PHONE_DISPLAY} nebo {SELLER.email}. Paskovská 636/275,
            Ostrava-Hrabová · {SITE_URL.replace("https://", "")}
            <br />
            Vydává {SELLER.name}, {sellerSeatText()}, IČO {SELLER.companyId}. Poukaz nelze vyměnit
            za hotovost.
          </p>

          {inactive && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <span className="rotate-[-12deg] border-2 border-destructive px-6 py-2 font-display text-2xl uppercase text-destructive">
                {v.status === "uplatneno" ? "Uplatněno" : "Neplatný"}
              </span>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
