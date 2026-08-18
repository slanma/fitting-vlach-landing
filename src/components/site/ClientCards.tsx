import { Flag, Activity, TrendingUp } from "lucide-react";

const cards = [
  {
    icon: Flag,
    title: "Začínáte a chcete investovat chytře?",
    text: "Nenechte se vmanipulovat do nákupu plného setu, ze kterého většinu holí nevyužijete. Začněte s 1–2 holemi přesně na vaše dispozice a bag doplňujte postupně s tím, jak roste vaše jistota.",
  },
  {
    icon: Activity,
    title: "Hrajete dlouho, ale posun se zastavil?",
    text: "Máte v bagu plnou výbavu, ale reálně věříte jen dvěma holím? Najdeme příčinu stagnace, odstraníme „mrtvou váhu“ a doplníme jen hole, které vám vrátí kontrolu nad hrou.",
  },
  {
    icon: TrendingUp,
    title: "Chcete ze svého švihu vymáčknout maximum?",
    text: "Pracujeme s reálnými čísly z měření. Vyladíme každý detail sestavy tak, aby vám vracel maximum výkonu a konzistence při stejné námaze.",
    facts: [
      { label: "", value: "" },
      { label: "", value: "" },
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
