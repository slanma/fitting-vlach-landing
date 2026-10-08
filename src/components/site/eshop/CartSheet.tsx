import { useId, useState } from "react";
import { X, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, MAX_QTY } from "@/lib/cart";
import { formatPrice } from "@/data/eshop";
import {
  DELIVERY,
  PACKETA_WIDGET_KEY,
  PAYMENT_DUE_DAYS,
  VAT_PAYER,
  deliveryFor,
  paymentsFor,
} from "@/lib/shop";
import { submitOrder } from "@/lib/objednavka";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contact";
import { SELLER } from "@/lib/prodavajici";

type Placed = { order: string | null; customerNotified: boolean; viaMail: boolean };
type Point = { id: string; name: string };

const field = "h-10 w-full rounded-sm border border-border bg-card px-3 text-sm";
const zdarma = (n: number) => (n === 0 ? "zdarma" : formatPrice(n));

declare global {
  interface Window {
    Packeta?: {
      Widget: {
        pick: (
          key: string,
          cb: (p: { id: number | string; name: string; formatedValue?: string } | null) => void,
          opts?: Record<string, unknown>,
        ) => void;
      };
    };
  }
}

/** Načte widget Zásilkovny až ve chvíli, kdy ho zákazník potřebuje. */
function loadPacketa(): Promise<void> {
  if (window.Packeta) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://widget.packeta.com/v6/www/js/library.js";
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("widget"));
    document.head.appendChild(s);
  });
}

/**
 * Košík a objednávka v jednom panelu.
 *
 * Pořadí odpovídá tomu, co zákon chce mít před odesláním: obsah košíku,
 * doprava a platba, údaje, rekapitulace s celkovou cenou, souhlas
 * s podmínkami, možnost odmítnout obchodní sdělení a tlačítko, ze kterého
 * je jasné, že objednávka zavazuje k platbě (§ 1826a OZ).
 */
export function CartSheet() {
  const cart = useCart();
  const id = useId();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [point, setPoint] = useState<Point | null>(null);
  const [pointText, setPointText] = useState("");
  const [delivery, setDelivery] = useState(DELIVERY[0]?.id ?? "");
  const [payment, setPayment] = useState("prevod");
  const [agreed, setAgreed] = useState(false);
  const [noMarketing, setNoMarketing] = useState(false);
  const [sending, setSending] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!cart.open) return null;

  const allDigital = cart.items.length > 0 && cart.items.every((i) => i.digital);
  const deliveries = deliveryFor(allDigital);
  // Když se košík změní (např. přibude rukavice k poukazu), přepne se na platnou možnost.
  const chosen = deliveries.find((d) => d.id === delivery) ?? deliveries[0];
  const payments = paymentsFor(chosen);
  const chosenPay = payments.find((p) => p.id === payment) ?? payments[0];
  const total = cart.total + (chosen?.price ?? 0) + (chosenPay?.fee ?? 0);
  const pickedPoint: Point | null = PACKETA_WIDGET_KEY
    ? point
    : pointText.trim()
      ? { id: "", name: pointText.trim() }
      : null;

  async function pickPoint() {
    try {
      await loadPacketa();
      window.Packeta!.Widget.pick(
        PACKETA_WIDGET_KEY!,
        (p) => {
          if (p) setPoint({ id: String(p.id), name: p.formatedValue || p.name });
        },
        { country: "cz", language: "cs" },
      );
    } catch {
      setError("Výběr výdejních míst se nepodařilo načíst. Zkuste to prosím znovu.");
    }
  }

  async function submit() {
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Vyplňte prosím jméno, e-mail a telefon.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Zkontrolujte prosím tvar e-mailu.");
      return;
    }
    if (
      chosen?.kind === "address" &&
      (!street.trim() || !city.trim() || !/^\d{5}$/.test(zip.replace(/\s/g, "")))
    ) {
      setError("Vyplňte prosím doručovací adresu včetně PSČ (5 číslic).");
      return;
    }
    if (chosen?.kind === "point" && !pickedPoint) {
      setError("Vyberte prosím výdejní místo Zásilkovny.");
      return;
    }
    if (!agreed) {
      setError("Před odesláním je potřeba potvrdit seznámení s obchodními podmínkami.");
      return;
    }
    setSending(true);
    try {
      const res = await submitOrder({
        data: {
          name,
          email,
          phone,
          note,
          delivery: chosen?.id ?? "",
          payment: chosenPay?.id ?? "",
          address: chosen?.kind === "address" ? { street, city, zip } : null,
          point: chosen?.kind === "point" ? pickedPoint : null,
          agreedTerms: agreed,
          noMarketing,
          items: cart.items.map(({ slug, qty, config }) => ({ slug, qty, config })),
        },
      });
      if (res.ok) {
        setPlaced({ order: res.order, customerNotified: res.customerNotified, viaMail: false });
        cart.clear();
      } else {
        setError(
          res.message && res.reason === "neplatne"
            ? res.message
            : `Objednávku se nepodařilo odeslat. Zkuste to prosím znovu, nebo zavolejte na ${PHONE_DISPLAY}.`,
        );
      }
    } catch {
      setError(
        `Objednávku se nepodařilo odeslat. Zkuste to prosím znovu, nebo zavolejte na ${PHONE_DISPLAY}.`,
      );
    } finally {
      setSending(false);
    }
  }

  const radio = (props: {
    name: string;
    checked: boolean;
    onChange: () => void;
    title: string;
    note: string;
  }) => (
    <label className="flex items-start gap-3 text-sm">
      <input
        type="radio"
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
        className="mt-1"
      />
      <span className="min-w-0">
        <span className="block text-ink">{props.title}</span>
        <span className="block text-xs text-muted-foreground">{props.note}</span>
      </span>
    </label>
  );

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`${id}-title`}
    >
      <button
        type="button"
        aria-label="Zavřít košík"
        className="absolute inset-0 bg-ink/40"
        onClick={() => cart.setOpen(false)}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-background shadow-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2
            id={`${id}-title`}
            className="font-display text-sm uppercase tracking-[0.16em] text-ink"
          >
            {placed ? "Objednávka odeslána" : "Košík"}
          </h2>
          <button
            type="button"
            aria-label="Zavřít"
            onClick={() => cart.setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-sm border border-border"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {placed ? (
          <div className="space-y-5 px-5 py-6 text-sm leading-relaxed text-muted-foreground">
            <p>
              Děkujeme, objednávka <strong className="text-ink">{placed.order}</strong> je přijatá.
            </p>
            {placed.customerNotified ? (
              <p>
                Na <strong className="text-ink">{email}</strong> jsme poslali potvrzení s obchodními
                podmínkami a formulářem pro odstoupení.
                {chosenPay?.id === "prevod" &&
                  " Platební údaje s QR kódem vám pošleme v samostatném e-mailu po kontrole objednávky."}
              </p>
            ) : (
              <p>
                Objednávku máme, ale potvrzení se vám nepodařilo doručit. Ozveme se vám — případně
                zavolejte na{" "}
                <a href={PHONE_HREF} className="text-ink underline underline-offset-4">
                  {PHONE_DISPLAY}
                </a>
                .
              </p>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setPlaced(null);
                cart.setOpen(false);
              }}
            >
              Hotovo
            </Button>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="px-5 py-10 text-sm text-muted-foreground">Košík je prázdný.</div>
        ) : (
          <div className="flex flex-1 flex-col">
            <ul className="divide-y divide-border px-5">
              {cart.items.map((i) => (
                <li key={i.key} className="py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink">{i.name}</p>
                      {Object.entries(i.config).map(([k, v]) => (
                        <p key={k} className="text-xs text-muted-foreground">
                          {k}: {v}
                        </p>
                      ))}
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatPrice(i.price)} / ks
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Odebrat ${i.name}`}
                      onClick={() => cart.remove(i.key)}
                      className="shrink-0 text-muted-foreground hover:text-ink"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label="Ubrat kus"
                        className="h-8 w-8 rounded-sm border border-border"
                        onClick={() => cart.setQty(i.key, i.qty - 1)}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm" aria-live="polite">
                        {i.qty}
                      </span>
                      <button
                        type="button"
                        aria-label="Přidat kus"
                        disabled={i.qty >= MAX_QTY}
                        className="h-8 w-8 rounded-sm border border-border disabled:opacity-40"
                        onClick={() => cart.setQty(i.key, i.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-ink">{formatPrice(i.price * i.qty)}</span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-5 border-t border-border px-5 py-5">
              <fieldset>
                <legend className="label-tech">Doprava</legend>
                <div className="mt-2 space-y-2">
                  {deliveries.map((d) =>
                    radio({
                      name: "doprava",
                      checked: chosen?.id === d.id,
                      onChange: () => setDelivery(d.id),
                      title: `${d.label} — ${zdarma(d.price)}`,
                      note: d.note,
                    }),
                  )}
                </div>

                {chosen?.kind === "point" && (
                  <div className="mt-3 rounded-sm border border-border bg-card p-3">
                    {PACKETA_WIDGET_KEY ? (
                      <>
                        {point && <p className="mb-2 text-sm text-ink">{point.name}</p>}
                        <Button type="button" variant="outline" size="sm" onClick={pickPoint}>
                          <MapPin className="mr-2 h-4 w-4" />
                          {point ? "Změnit výdejní místo" : "Vybrat výdejní místo"}
                        </Button>
                      </>
                    ) : (
                      <label className="grid gap-1 text-xs text-muted-foreground">
                        Výdejní místo Zásilkovny (název nebo adresa)
                        <input
                          className={field}
                          value={pointText}
                          onChange={(e) => setPointText(e.target.value)}
                        />
                      </label>
                    )}
                  </div>
                )}

                {chosen?.kind === "address" && (
                  <div className="mt-3 grid gap-3 rounded-sm border border-border bg-card p-3">
                    <label className="grid gap-1 text-xs text-muted-foreground">
                      Ulice a číslo popisné
                      <input
                        className={field}
                        autoComplete="street-address"
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                      />
                    </label>
                    <div className="grid grid-cols-[1fr_7rem] gap-3">
                      <label className="grid gap-1 text-xs text-muted-foreground">
                        Město
                        <input
                          className={field}
                          autoComplete="address-level2"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                        />
                      </label>
                      <label className="grid gap-1 text-xs text-muted-foreground">
                        PSČ
                        <input
                          className={field}
                          inputMode="numeric"
                          autoComplete="postal-code"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                )}
              </fieldset>

              <fieldset>
                <legend className="label-tech">Platba</legend>
                <div className="mt-2 space-y-2">
                  {payments.map((p) =>
                    radio({
                      name: "platba",
                      checked: chosenPay?.id === p.id,
                      onChange: () => setPayment(p.id),
                      title: `${p.label}${p.fee ? ` — ${formatPrice(p.fee)}` : ""}`,
                      note:
                        p.id === "prevod" ? `${p.note} Splatnost ${PAYMENT_DUE_DAYS} dní.` : p.note,
                    }),
                  )}
                </div>
              </fieldset>

              <fieldset className="grid gap-3">
                <legend className="label-tech mb-1">Kontaktní údaje</legend>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Jméno a příjmení
                  <input
                    className={field}
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  E-mail
                  <input
                    className={field}
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  Telefon
                  <input
                    className={field}
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </label>
                <label className="grid gap-1 text-xs text-muted-foreground">
                  {cart.items.some((i) => i.digital)
                    ? "Poznámka — u poukazu jméno obdarovaného (nepovinné)"
                    : "Poznámka (nepovinné)"}
                  <textarea
                    className="min-h-20 rounded-sm border border-border bg-card px-3 py-2 text-sm"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </label>
              </fieldset>

              <div className="rounded-sm border border-border bg-card p-4 text-sm">
                <span className="label-tech">Rekapitulace</span>
                <dl className="mt-2 space-y-1">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Zboží ({cart.count} ks)</dt>
                    <dd className="text-ink">{formatPrice(cart.total)}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">{chosen?.label}</dt>
                    <dd className="text-ink">{zdarma(chosen?.price ?? 0)}</dd>
                  </div>
                  {!!chosenPay?.fee && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">{chosenPay.label}</dt>
                      <dd className="text-ink">{formatPrice(chosenPay.fee)}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3 border-t border-border pt-2">
                    <dt className="font-medium text-ink">Celkem k úhradě</dt>
                    <dd className="font-display text-lg text-ink">{formatPrice(total)}</dd>
                  </div>
                </dl>
                <p className="mt-1 text-xs text-muted-foreground">
                  {VAT_PAYER ? "Ceny jsou uvedeny včetně DPH." : "Prodávající není plátcem DPH."}
                </p>
              </div>

              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Seznámil(a) jsem se s{" "}
                  <a
                    href="/obchodni-podminky"
                    target="_blank"
                    className="text-ink underline underline-offset-4"
                  >
                    obchodními podmínkami
                  </a>{" "}
                  včetně{" "}
                  <a
                    href="/odstoupeni-od-smlouvy"
                    target="_blank"
                    className="text-ink underline underline-offset-4"
                  >
                    poučení o odstoupení od smlouvy
                  </a>{" "}
                  a souhlasím s nimi. Informace o zpracování osobních údajů najdete{" "}
                  <a
                    href="/ochrana-osobnich-udaju"
                    target="_blank"
                    className="text-ink underline underline-offset-4"
                  >
                    zde
                  </a>
                  .
                </span>
              </label>

              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input
                  type="checkbox"
                  checked={noMarketing}
                  onChange={(e) => setNoMarketing(e.target.checked)}
                  className="mt-0.5"
                />
                <span>Nepřeji si dostávat e-mailem novinky o obdobném zboží a službách.</span>
              </label>

              {error && (
                <p role="alert" className="text-xs text-destructive">
                  {error}
                </p>
              )}

              <Button className="w-full" size="lg" onClick={submit} disabled={sending}>
                {sending ? "Odesílám…" : "Objednat s povinností platby"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Prodávající: {SELLER.name} · {SELLER.email}
              </p>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
