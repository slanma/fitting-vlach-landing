import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroGolf from "@/assets/hero-golf.jpg";

const metrics = [
  { label: "Smash", value: "1.49", unit: "±0.02" },
  { label: "Carry", value: "241", unit: "m" },
  { label: "Disperze", value: "12.4", unit: "m" },
  { label: "Launch", value: "14.7°", unit: "" },
  { label: "Spin", value: "2210", unit: "rpm" },
];

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden surface-sand">
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[52%] lg:block">
        <img
          src={heroGolf}
          alt="Golfová hůl u míčku na trávě v podvečerním světle"
          width={1408}
          height={1008}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-medium leading-[1.15] text-ink sm:text-4xl lg:text-5xl">
            Znáte ten pocit, když trefíte míč naprosto čistě a on letí přesně tam, kam má?
          </h1>
          <p className="mt-7 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Představte si, že s touto jistotou stojíte na každém odpališti. Nejsem tu od toho, abych
            vám změnil hůl. Jsem tu proto, abych vám postavil hůl, která vám s chirurgickou přesností
            pomůže dosáhnout vašich maximálních výkonů.
          </p>
          <Button asChild size="lg" className="mt-9">
            <a href="#kontakt">
              Domluvit osobní konzultaci
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="mt-14 lg:hidden">
          <img
            src={heroGolf}
            alt="Golfová hůl u míčku na trávě v podvečerním světle"
            width={1408}
            height={1008}
            className="h-56 w-full rounded-sm object-cover sm:h-72"
          />
        </div>

        <dl className="mt-12 grid grid-cols-2 divide-border border border-border bg-card shadow-soft sm:grid-cols-3 lg:max-w-3xl lg:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="border-b border-r border-border px-5 py-5 last:border-r-0"
            >
              <dt className="label-tech">{m.label}</dt>
              <dd className="mt-2 font-display text-2xl text-gold">{m.value}</dd>
              {m.unit && <dd className="mt-1 text-xs text-muted-foreground">{m.unit}</dd>}
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
