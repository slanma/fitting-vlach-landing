import { useState } from "react";
import { X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/data/eshop";
import { DELIVERY, ORDER_PREFIX, VAT_PAYER } from "@/lib/shop";
import { newOrderNumber } from "@/lib/qr-platba";
import { EMAIL, PHONE_DISPLAY } from "@/lib/contact";
import { QrPlatba } from "./QrPlatba";

type Placed = { order: string; vs: string; total: number; provisional: boolean };

export function CartSheet() {
  const cart = useCart();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [delivery, setDelivery] = useState(DELIVERY[0]?.id ?? "osobni");
  const [agreed, setAgreed] = useState(false);
  const [placed, setPlaced] = useState<Placed | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!cart.open) return null;

  const chosen = DELIVERY.find((d) => d.id === delivery) ?? DELIVERY[0];
  const total = cart.total + (chosen?.price ?? 0);

  function summary(order: string) {
    const lines = cart.items.map(
      (i) =>
        `- ${i.name} × ${i.qty}` +
        (Object.keys(i.config).length
          ? ` (${Object.entries(i.config)
              .map(([k, v]) => `${k}: ${v}`)
              .join(", ")})`
          : ""),
    );
    return [
      `Objednávka ${order}`,
      "",
      ...lines,
      "",
      `Doprava: ${chosen?.label ?? ""}`,
      `Celkem: ${total.toFixed(2)} Kč`,
      "",
      `Jméno: ${name}`,
      `E-mail: ${email}`,
      `Telefon: ${phone}`,
      note ? `Poznámka: ${note}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }

  function submit() {
    setError(null);
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError("Vyplňte prosím jméno, e-mail a telefon.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Zkontrolujte prosím tvar e-mailu.");
      return;
    }
    if (!agreed) {
      setError("Bez souhlasu s obchodními podmínkami nelze objednávku odeslat.");
      return;
    }
    const { order, vs } = newOrderNumber(ORDER_PREFIX);
    // Objednávka putuje e-mailem — žádná databáze, žádné ukládání osobních údajů na webu.
    const href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(`Objednávka ${order}`)}` +
      `&body=${encodeURIComponent(summary(order))}`;
    window.location.href = href;
    setPlaced({ order, vs, total, provisional: cart.hasMadeToOrder });
  }

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Zavřít košík"
        className="absolute inset-0 bg-ink/40"
        onClick={() => cart.setOpen(false)}
      />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto bg-background shadow-card">
        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-display text-sm uppercase tracking-[0.16em] text-ink">
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
          <div className="space-y-5 px-5 py-6">
            <p className="text-sm leading-relaxed text-muted-foreground">
              Objednávka <strong className="text-ink">{placed.order}</strong> je na cestě e-mailem.
              Ozveme se vám a potvrdíme dostupnost i termín.
            </p>
            <QrPlatba
              amount={placed.total}
              variableSymbol={placed.vs}
              message={`Objednavka ${placed.order}`}
              provisional={placed.provisional}
            />
            <p className="text-xs text-muted-foreground">
              Nedorazil e-mail? Zavolejte na {PHONE_DISPLAY}.
            </p>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                cart.clear();
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
                      <span className="w-6 text-center text-sm">{i.qty}</span>
                      <button
                        type="button"
                        aria-label="Přidat kus"
                        className="h-8 w-8 rounded-sm border border-border"
                        onClick={() => cart.setQty(i.key, i.qty + 1)}
                      >
                        +
                      </button>
                    </div>
                    <span className="text-sm text-ink">
                      {formatPrice(i.price * i.qty, i.priceFrom)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-4 border-t border-border px-5 py-5">
              <div>
                <span className="label-tech">Doprava</span>
                <div className="mt-2 space-y-2">
                  {DELIVERY.map((d) => (
                    <label key={d.id} className="flex items-start gap-3 text-sm">
                      <input
                        type="radio"
                        name="doprava"
                        value={d.id}
                        checked={delivery === d.id}
                        onChange={() => setDelivery(d.id)}
                        className="mt-1"
                      />
                      <span className="min-w-0">
                        <span className="block text-ink">
                          {d.label} — {d.price === 0 ? "zdarma" : formatPrice(d.price)}
                        </span>
                        <span className="block text-xs text-muted-foreground">{d.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                <input
                  className="h-10 rounded-sm border border-border bg-card px-3 text-sm"
                  placeholder="Jméno a příjmení"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  className="h-10 rounded-sm border border-border bg-card px-3 text-sm"
                  placeholder="E-mail"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  className="h-10 rounded-sm border border-border bg-card px-3 text-sm"
                  placeholder="Telefon"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <textarea
                  className="min-h-20 rounded-sm border border-border bg-card px-3 py-2 text-sm"
                  placeholder="Poznámka (handicap, hřiště, na co hole potřebujete…)"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              {cart.hasMadeToOrder && (
                <p className="rounded-sm border border-gold/40 bg-gold/5 p-3 text-xs leading-relaxed text-ink">
                  Košík obsahuje zboží stavěné na míru podle vašich hodnot. U takového zboží{" "}
                  <strong>nelze odstoupit od smlouvy do 14 dnů</strong> (§ 1837 občanského
                  zákoníku). Konfiguraci i cenu vám potvrdíme před výrobou.
                </p>
              )}

              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted-foreground">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Souhlasím s{" "}
                  <a href="/obchodni-podminky" className="text-ink underline underline-offset-4">
                    obchodními podmínkami
                  </a>{" "}
                  a beru na vědomí{" "}
                  <a
                    href="/ochrana-osobnich-udaju"
                    className="text-ink underline underline-offset-4"
                  >
                    zpracování osobních údajů
                  </a>
                  .
                </span>
              </label>

              <div className="flex items-center justify-between border-t border-border pt-4">
                <span className="text-sm text-muted-foreground">Celkem</span>
                <span className="font-display text-lg text-ink">{formatPrice(total)}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {VAT_PAYER ? "Ceny jsou uvedeny včetně DPH." : "Prodávající není plátcem DPH."}
              </p>

              {error && <p className="text-xs text-destructive">{error}</p>}

              <Button className="w-full" size="lg" onClick={submit}>
                Odeslat objednávku
              </Button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
