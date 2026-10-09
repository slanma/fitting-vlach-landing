import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

/** Lákadlo na golfový profil na úvodní stránce. */
export function ProfilTeaser() {
  return (
    <section className="px-5 py-16 md:px-10">
      <Link
        to="/eshop/pruvodce"
        className="group mx-auto flex max-w-5xl flex-col gap-6 border border-gold/50 bg-card p-7 shadow-soft transition-shadow hover:shadow-card sm:p-10 md:flex-row md:items-center"
      >
        <div className="min-w-0 flex-1">
          <span className="label-tech">Golfový profil · 5 kliknutí</span>
          <p className="mt-3 text-xl font-medium leading-snug text-ink sm:text-2xl">
            Driver vám nejde, ale železa ano? Nebo naopak?
          </p>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
            Pár rychlých kliknutí a uvidíte, kde máte rezervu, co se dá vyřešit správnou holí a
            jestli vám pomůže fitting. Anonymně, bez registrace.
          </p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-2 bg-gold px-5 py-3 text-sm font-medium text-background">
          Vyplnit profil{" "}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </span>
      </Link>
    </section>
  );
}
