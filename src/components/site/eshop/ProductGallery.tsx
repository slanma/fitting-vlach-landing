import { useCallback, useState } from "react";
import { Check, X } from "lucide-react";

export type Hotspot = {
  /** Na které fotce (0 = první). */
  image: number;
  /** Pozice v procentech fotky. */
  x: number;
  y: number;
  title: string;
  text: string;
};

/**
 * Galerie produktu. Když má produkt `hotspots`, jsou na fotce klikací body:
 * po ťuknutí ukážou krátké vysvětlení a označí se jako prozkoumané.
 */
export function ProductGallery({
  images,
  alt,
  hotspots = [],
}: {
  images: string[];
  alt: string;
  hotspots?: Hotspot[] | undefined;
}) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [ratio, setRatio] = useState<number | null>(null);

  // Poměr stran fotky — i když se načetla dřív, než se stránka „oživila“.
  const measure = useCallback((im: HTMLImageElement | null) => {
    if (im && im.complete && im.naturalHeight) setRatio(im.naturalWidth / im.naturalHeight);
  }, []);

  const here = hotspots.map((h, i) => ({ ...h, i })).filter((h) => h.image === active);
  const current = open !== null ? hotspots[open] : null;

  function toggle(i: number) {
    setOpen(open === i ? null : i);
    setSeen((s) => new Set(s).add(i));
  }

  return (
    <div className="mt-8">
      {hotspots.length > 0 && (
        <div className="mb-3 flex items-center justify-between gap-3 text-sm">
          <span className="text-ink">
            <span className="mr-2 inline-block h-2.5 w-2.5 animate-pulse rounded-full bg-gold align-middle" />
            Prozkoumejte rukavici — klikněte na body
          </span>
          <span className="shrink-0 font-display text-xs uppercase tracking-[0.14em] text-muted-foreground">
            {seen.size === hotspots.length
              ? "Vše prozkoumáno ✓"
              : `Prozkoumáno ${seen.size}/${hotspots.length}`}
          </span>
        </div>
      )}

      <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden border border-border bg-white p-6">
        <div
          className="relative h-full max-w-full"
          style={ratio ? { aspectRatio: String(ratio) } : undefined}
        >
          <img
            ref={measure}
            src={images[active]}
            alt={alt}
            className="h-full w-full object-contain"
            onLoad={(e) => {
              const im = e.currentTarget;
              if (im.naturalHeight) setRatio(im.naturalWidth / im.naturalHeight);
            }}
          />
          {ratio &&
            here.map((h) => {
              const on = open === h.i;
              const done = seen.has(h.i);
              return (
                <button
                  key={h.i}
                  type="button"
                  aria-label={h.title}
                  aria-expanded={on}
                  onClick={() => toggle(h.i)}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {!done && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-gold/60" />
                  )}
                  <span
                    className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-white shadow-card transition-transform group-hover:scale-110 ${
                      on ? "scale-110 bg-ink" : "bg-gold"
                    }`}
                  >
                    {done && !on ? (
                      <Check className="h-3.5 w-3.5 text-white" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                </button>
              );
            })}
        </div>

        {current && current.image === active && (
          <div className="animate-in fade-in slide-in-from-bottom-2 absolute bottom-3 right-4 hidden w-72 sm:block border border-gold/50 bg-background/95 p-4 shadow-card backdrop-blur duration-200">
            <button
              type="button"
              aria-label="Zavřít"
              onClick={() => setOpen(null)}
              className="absolute right-2 top-2 text-muted-foreground hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="pr-6 text-sm font-medium text-ink">{current.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{current.text}</p>
          </div>
        )}
      </div>

      {current && current.image === active && (
        <div className="animate-in fade-in relative mt-3 border border-gold/50 bg-background/95 p-4 shadow-card backdrop-blur duration-200 sm:hidden">
          <button
            type="button"
            aria-label="Zavřít"
            onClick={() => setOpen(null)}
            className="absolute right-2 top-2 text-muted-foreground hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="pr-6 text-sm font-medium text-ink">{current.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{current.text}</p>
        </div>
      )}

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => {
            const count = hotspots.filter((h) => h.image === i).length;
            return (
              <button
                key={src}
                type="button"
                aria-label={`Fotka ${i + 1}`}
                onClick={() => {
                  setActive(i);
                  setOpen(null);
                }}
                className={`relative h-16 w-20 overflow-hidden border bg-white ${i === active ? "border-ink" : "border-border"}`}
              >
                <img src={src} alt="" className="h-full w-full object-contain p-1" />
                {count > 0 && (
                  <span className="absolute right-0.5 top-0.5 rounded-full bg-gold px-1.5 text-[0.6rem] font-medium leading-4 text-white">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
