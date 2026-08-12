import { Flag, Activity, TrendingUp } from "lucide-react";

const cards = [
  {
    icon: Flag,
    title: "Začínáte, nebo vás omezuje zdraví?",
    text: "Správně vybraná hůl vám pomůže hrát lehčeji, s menší námahou a větší jistotou. Společně najdeme sestavu, která odpovídá vašemu pohybu — a pomůže vám si golf užít naplno.",
  },
  {
    icon: Activity,
    title: "Hrajete dlouho, ale skóre se nelepší?",
    text: "I malá úprava v délce, lie, loftu nebo shaftu může zásadně zlepšit konzistenci, kontrolu a vzdálenost. Získáte nástroje, které promění vaše úsilí ve výsledky.",
  },
  {
    icon: TrendingUp,
    title: "Chcete ze svého švihu vymáčknout maximum?",
    text: "Pracujeme s reálnými čísly z měření. Vyladíme každý detail sestavy tak, aby vám vracel maximum výkonu při stejné námaze.",
    facts: [
      { label: "Effort", value: "−24 %" },
      { label: "Consistency", value: "+37 %" },
    ],
  },
];

export function ClientCards() {
  return (
    <section id="pro-koho" className="surface-sand">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-24">
        <span className="label-tech">Pro koho</span>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {cards.map((c) => (
            <article
              key={c.title}
              className="flex flex-col border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-card"
            >
              <c.icon className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.4} />
              <h3 className="mt-6 text-lg font-medium leading-snug text-ink">{c.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{c.text}</p>
              {c.facts && (
                <dl className="mt-7 space-y-3 border-t border-border pt-5">
                  {c.facts.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4">
                      <dt className="label-tech">{f.label}</dt>
                      <dd className="font-display text-lg text-olive">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
