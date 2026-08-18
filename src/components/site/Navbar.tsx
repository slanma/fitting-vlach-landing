import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "O mně", href: "#o-mne" },
  { label: "Hloubkový Fitting", href: "#deep-fitting" },
  { label: "Pro koho", href: "#pro-koho" },
  { label: "Proces", href: "#deep-fitting" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-4 md:px-10">
        <a href="#hero" className="flex min-w-0 items-center gap-3">
          <span className="shrink-0 font-display text-2xl leading-none tracking-tight text-ink">
            FV
          </span>
          <span className="min-w-0 border-l border-border pl-3">
            <span className="block truncate font-display text-sm font-medium uppercase tracking-[0.16em] text-ink">
              Fitting Vlach
            </span>
            <span className="label-tech block text-[0.6rem]">Golf Fitting</span>
          </span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <Button asChild variant="outline" size="sm">
            <a href="#kontakt">Kontakt</a>
          </Button>
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
            <a
              key={l.label}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block border-b border-border/60 py-3 text-sm text-muted-foreground"
            >
              {l.label}
            </a>
          ))}
          <Button asChild variant="outline" className="mt-4 w-full">
            <a href="#kontakt" onClick={() => setOpen(false)}>
              Kontakt
            </a>
          </Button>
        </nav>
      )}
    </header>
  );
}
