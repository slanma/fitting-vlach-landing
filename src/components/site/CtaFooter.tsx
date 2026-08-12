import { ArrowRight, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import course from "@/assets/cta-course.jpg";

const perks = [
  { icon: FileText, label: "Nezávislá konzultace" },
  { icon: Clock, label: "Individuální přístup" },
  { icon: CheckCircle2, label: "Vždy jen jeden hráč na místě" },
];

export function CtaFooter() {
  return (
    <section id="kontakt" className="bg-card">
      <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-2">
        <img
          src={course}
          alt="Golfista na hřišti v podvečerním světle"
          loading="lazy"
          width={1200}
          height={1008}
          className="h-64 w-full object-cover sm:h-80 lg:h-full"
        />
        <div className="px-5 py-14 md:px-12 lg:py-20">
          <h2 className="text-2xl font-medium leading-snug text-ink sm:text-3xl">
            Výsledek neuvidíte na papíře.
            <span className="block">Uvidíte ho na hřišti.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
            Jestliže na prvním odpališti cítíte, že hůl sedí a míč letí tam, kam má — to je ten
            pocit, o který při fittingu běží.
          </p>
          <Button asChild size="lg" className="mt-9 w-full sm:w-auto">
            <a href="mailto:info@fittingvlach.cz">
              Domluvit osobní konzultaci
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>

          <ul className="mt-10 grid gap-4 border-t border-border pt-7 sm:grid-cols-3">
            {perks.map((p) => (
              <li key={p.label} className="flex items-start gap-3">
                <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span className="min-w-0 text-xs leading-relaxed text-muted-foreground">
                  {p.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-5 py-7 md:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="shrink-0 font-display text-lg text-ink">FV</span>
            <span className="truncate font-display text-xs uppercase tracking-[0.16em] text-muted-foreground">
              Fitting Vlach
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Fitting Vlach
          </span>
        </div>
      </div>
    </section>
  );
}
