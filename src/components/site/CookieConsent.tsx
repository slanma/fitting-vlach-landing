import { useEffect, useId, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  OPEN_SETTINGS_EVENT,
  readConsent,
  saveConsent,
  trackContactClick,
} from "../../lib/consent";

const btnSolid =
  "inline-flex flex-1 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-none";
const btnOutline =
  "inline-flex flex-1 items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:flex-none";

export function CookieConsent() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const titleId = useId();
  const descId = useId();

  // Zobrazit lištu, pokud ještě není rozhodnuto; reagovat na "Nastavení cookies".
  useEffect(() => {
    const current = readConsent();
    if (!current) setOpen(true);
    else setAnalytics(current.analytics);

    const onOpen = () => {
      setAnalytics(readConsent()?.analytics ?? false);
      setDetails(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_SETTINGS_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, onOpen);
  }, []);

  // Měření kliknutí na telefon a e-mail na celém webu (bez úprav jednotlivých komponent).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const a = target?.closest?.('a[href^="tel:"], a[href^="mailto:"]') as HTMLAnchorElement | null;
      if (!a) return;
      trackContactClick(a.getAttribute("href")!.startsWith("tel:") ? "phone" : "email");
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!open || pathname.startsWith("/admin")) return null;

  const decide = (value: boolean) => {
    saveConsent(value);
    setAnalytics(value);
    setDetails(false);
    setOpen(false);
  };

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby={titleId}
      aria-describedby={descId}
      className="fixed inset-x-3 bottom-3 z-50 max-w-lg rounded-lg border border-border bg-background p-5 text-foreground shadow-lg sm:inset-x-auto sm:bottom-6 sm:left-6"
    >
      <h2 id={titleId} className="text-base font-semibold">
        Cookies na tomto webu
      </h2>
      <p id={descId} className="mt-2 text-sm leading-relaxed text-muted-foreground">
        Košík a golfový profil si web ukládá ve vašem prohlížeči, aby fungoval. S vaším souhlasem
        budeme navíc měřit návštěvnost přes Google Analytics. Bez souhlasu se nic neměří.{" "}
        <Link to="/ochrana-osobnich-udaju" className="underline underline-offset-2 hover:text-foreground">
          Ochrana osobních údajů
        </Link>
      </p>

      {details && (
        <div className="mt-4 space-y-4 border-t border-border pt-4 text-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">Nezbytné</p>
              <p className="mt-0.5 text-muted-foreground">
                Košík, golfový profil a uložení této volby.
              </p>
            </div>
            <span className="shrink-0 text-muted-foreground">Vždy zapnuto</span>
          </div>
          <label className="flex cursor-pointer items-start justify-between gap-4">
            <span>
              <span className="block font-medium">Analytické</span>
              <span className="mt-0.5 block text-muted-foreground">
                Google Analytics – kolik lidí web navštíví a co je zajímá.
              </span>
            </span>
            <input
              type="checkbox"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
              className="mt-1 h-5 w-5 shrink-0 accent-primary"
            />
          </label>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <button type="button" className={btnSolid} onClick={() => decide(false)}>
          Odmítnout vše
        </button>
        <button type="button" className={btnSolid} onClick={() => decide(true)}>
          Přijmout vše
        </button>
        {details ? (
          <button type="button" className={btnOutline} onClick={() => decide(analytics)}>
            Uložit volbu
          </button>
        ) : (
          <button type="button" className={btnOutline} onClick={() => setDetails(true)}>
            Nastavení
          </button>
        )}
      </div>
    </div>
  );
}
