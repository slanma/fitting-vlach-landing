import { Target, Users, ShieldCheck } from "lucide-react";
import fitter from "@/assets/fitter-real.png.asset.json";

const stats = [
  { icon: Target, value: "1000+", label: "realizovaných fittingů" },
  { icon: Users, value: "20+", label: "let zkušeností" },
  { icon: ShieldCheck, value: "Data", label: "měření místo dohadů" },
];

export function Authority() {
  return (
    <section id="o-mne" className="bg-card">
      <div className="mx-auto grid max-w-7xl items-stretch gap-0 lg:grid-cols-2">
        <img
          src={fitter.url}
          alt="Petr Vlach ve fitting studiu"
          loading="lazy"
          width={1194}
          height={1343}
          className="h-72 w-full object-cover sm:h-96 lg:h-full"
        />
        <div className="px-5 py-14 md:px-12 lg:self-center lg:py-20">
          <h2 className="text-2xl font-medium leading-snug text-ink sm:text-3xl">
            Kdo se postará o vaši hru?
            <span className="block">Petr Vlach.</span>
          </h2>
          <span className="rule-gold mt-6" />
          <p className="mt-7 text-[0.95rem] leading-relaxed text-muted-foreground">
            Více než dvě dekády se věnuji golfu a špičkovému fittingu na nejvyšší úrovni. Mám za
            sebou tisíce fittingů hráčů všech výkonnostních kategorií — od rekreačních golfistů po
            profesionály.
          </p>
          <p className="mt-5 text-[0.95rem] leading-relaxed text-muted-foreground">
            Vím, že každý pohyb je jedinečný. Každá hůl funguje jinak. A proto mě fascinuje nejen
            samotné hřiště — je v datech.
          </p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-3">
            {stats.map((s) => (
              <div key={s.value} className="flex items-start gap-3">
                <s.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.5} />
                <div className="min-w-0">
                  <dt className="font-display text-base text-ink">{s.value}</dt>
                  <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.label}</dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
