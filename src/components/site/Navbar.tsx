import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";

/**
 * Sekce žijí na domovské stránce, proto se odkazuje přes `to="/"` s kotvou.
 * Obyčejné `#kotva` by na e-shopu ani na právních stránkách nefungovalo —
 * tam totiž žádná taková sekce není.
 */
const links = [
  { label: "O mně", hash: "o-mne" },
  { label: "Hloubkový fitting", hash: "hloubkovy-fitting" },
  { label: "Pro koho", hash: "pro-koho" },
  { label: "Proces", hash: "hloubkovy-fitting" },
  { label: "FAQ", hash: "faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const cart = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-10">
        <Link to="/" hash="hero" className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 font-display text-2xl leading-none tracking-tight text-ink">
            FV
          </span>
          <span className="min-w-0 border-l border-border pl-3">
            <span className="block truncate font-display text-sm font-medium uppercase tracking-[0.16em] text-ink">
              Vlach Fitting
            </span>
            <span className="label-tech block text-[0.6rem]">Golf Fitting</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/"
              hash={l.hash}
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/eshop"
            className="text-sm text-muted-foreground transition-colors hover:text-ink"
          >
            E-shop
          </Link>
          <Button asChild variant="outline" size="sm">
            <Link to="/" hash="kontakt">
              Kontakt
            </Link>
          </Button>
          <button
            type="button"
            aria-label={`Košík, ${cart.count} položek`}
            onClick={() => cart.setOpen(true)}
            className="relative flex h-9 w-9 items-center justify-center rounded-sm border border-border text-ink"
          >
            <ShoppingBag className="h-4 w-4" />
            {cart.count > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.6rem] font-medium text-background">
                {cart.count}
              </span>
            )}
          </button>
        </nav>

        <button
          type="button"
          aria-label="Otevřít menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-border text-ink lg:hidden"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <nav className="border-t border-border bg-background px-5 pb-6 pt-2 lg:hidden">
          {links.map((l) => (
            <Link
              key={l.label}
              to="/"
              hash={l.hash}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/eshop"
            onClick={() => setOpen(false)}
            className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
          >
            E-shop
          </Link>
          <Button asChild variant="outline" className="mt-4 w-full">
            <Link to="/" hash="kontakt" onClick={() => setOpen(false)}>
              Kontakt
            </Link>
          </Button>
        </nav>
      )}
    </header>
  );
}
