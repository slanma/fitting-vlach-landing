import { createFileRoute } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { publicVoucher } from "@/lib/admin-api";
import { formatPrice } from "@/data/eshop";
import { SELLER, sellerSeatText } from "@/lib/prodavajici";
import { PHONE_DISPLAY } from "@/lib/contact";
import { SITE_URL } from "@/lib/site";
import { qrSvg } from "@/lib/qr-kod";

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

const ANY = "Cokoli z nabídky";

/** „Golfové hole" → „na golfové hole"; bez volby → celá nabídka. */
const purposeText = (p?: string | null) =>
  !p || p === ANY
    ? "na golfové poradenství, golfové hole i příslušenství"
    : `na ${p.charAt(0).toLowerCase()}${p.slice(1)}`;

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
  const url = `${SITE_URL}/poukaz/${v.code}`;
  const qr = qrSvg(url, 112, 2);

  return (
    <div
      className="min-h-screen bg-sand px-5 py-10 print:bg-white print:p-0"
      style={{ printColorAdjust: "exact", WebkitPrintColorAdjust: "exact" }}
    >
      <style>{`@page { size: A4 landscape; margin: 12mm; }`}</style>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex justify-end print:hidden">
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" /> Vytisknout / uložit jako PDF
          </Button>
        </div>

        <article className="relative overflow-hidden border border-gold/40 bg-card shadow-card print:shadow-none">
          {/* Fotka s logem */}
          <div className="relative h-44 sm:h-52">
            <img
              src="/images/course-sunset.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-[50%_30%]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/45 to-ink/10" />
            <div className="relative flex h-full items-end justify-between p-8 sm:p-10">
              <div className="flex items-center gap-4 text-white">
                <span className="font-display text-4xl leading-none">FV</span>
                <span className="h-10 w-px bg-gold-soft/70" />
                <span>
                  <span className="block font-display text-sm font-semibold tracking-[0.3em]">
                    VLACH FITTING
                  </span>
                  <span className="block text-[10px] tracking-[0.3em] text-gold-soft">
                    GOLF FITTING
                  </span>
                </span>
              </div>
              <span className="border border-gold-soft/70 px-3 py-1.5 font-display text-[11px] uppercase tracking-[0.25em] text-white">
                Dárkový poukaz
              </span>
            </div>
          </div>

          {/* Obsah + ústřižek */}
          <div className="grid sm:grid-cols-[1fr_auto]">
            <div className="p-8 sm:p-10">
              {v.recipient ? (
                <p className="label-tech">
                  Pro <span className="text-ink">{v.recipient}</span>
                </p>
              ) : (
                <p className="label-tech">Věnujeme vám</p>
              )}
              <p className="mt-4 font-display text-6xl leading-none text-ink sm:text-7xl">
                {formatPrice(v.value)}
              </p>
              <p className="mt-4 font-display text-xl text-gold">{purposeText(v.purpose)}</p>
              {v.remaining !== v.value && v.status === "aktivni" && (
                <p className="mt-3 text-sm text-muted-foreground">
                  Zbývá k čerpání: {formatPrice(v.remaining)}
                </p>
              )}
              <span className="rule-gold mt-8" />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                Poukaz lze čerpat najednou i postupně až do jeho hodnoty. Na uplatnění se stačí
                domluvit předem.
              </p>
            </div>

            {/* Ústřižek */}
            <div className="relative border-t border-dashed border-gold/50 bg-sand/60 p-8 sm:w-56 sm:border-l sm:border-t-0">
              <div className="flex items-start gap-5 sm:block">
                <div
                  className="w-24 shrink-0 bg-white p-1.5 sm:mx-auto sm:w-28 [&_svg]:h-auto [&_svg]:w-full"
                  aria-label="QR kód pro ověření poukazu"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
                <dl className="space-y-4 sm:mt-6 sm:text-center">
                  <div>
                    <dt className="label-tech">Kód poukazu</dt>
                    <dd className="mt-1 font-display text-base tracking-wider text-ink">{v.code}</dd>
                  </div>
                  <div>
                    <dt className="label-tech">Platí do</dt>
                    <dd className="mt-1 text-base text-ink">{valid}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <footer className="border-t border-border px-8 py-5 text-[11px] leading-relaxed text-muted-foreground sm:px-10">
            Uplatnění domluvíte na {PHONE_DISPLAY} nebo {SELLER.email} · Paskovská 636/275,
            Ostrava-Hrabová · {SITE_URL.replace("https://", "")}
            <br />
            Vydává {SELLER.name}, {sellerSeatText()}, IČO {SELLER.companyId}. Poukaz nelze vyměnit za
            hotovost.
          </footer>

          {inactive && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <span className="rotate-[-12deg] border-2 border-destructive bg-background/80 px-6 py-2 font-display text-2xl uppercase text-destructive">
                {v.status === "uplatneno" ? "Uplatněno" : "Neplatný"}
              </span>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
