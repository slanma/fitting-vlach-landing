import { Layers, Wallet } from "lucide-react";

const blocks = [
  {
    icon: Layers,
    title: "Progresivní přístup k výbavě",
    points: [
      "Začínáme s 1–2 klíčovými holemi (např. železo 7 nebo 8) přesně na míru vašim fyzickým parametrům (výška, lie úhel, tuhost shaftu).",
      "Jakmile hůl dokonale zvládnete a stabilizujete techniku, postupně doplňujeme kratší i delší železa a dřeva.",
      "Čím rychleji se zlepšujete, tím rychleji se váš bag rozrůstá. Vždy hrajete s holí, na kterou se můžete spolehnout.",
    ],
  },
  {
    icon: Wallet,
    title: "Ekonomický a funkční smysl",
    points: [
      "Ochrana před zbytečnými výdaji – vyhnete se nákupu setů z výprodejů, které v 90 % případů hráči nesednou a po první sezóně končí v koutě.",
      "Dlouhodobá investice – správně postavené hole na míru vám bez problémů vydrží sloužit 6 i více let.",
      "Klid v hlavě – investujete postupně a máte jistotu, že žádná hůl v bagu není zbytečná.",
    ],
  },
];

export function BagPhilosophy() {
  return (
    <section id="filozofie" className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 lg:py-24">
        <span className="label-tech">Filozofie postupného bagu</span>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <h2 className="text-2xl font-medium leading-snug text-ink sm:text-3xl">
            Nemusíte mít v bagu hned 14 holí. Mějte jen ty, které vám přinášejí výsledky.
          </h2>
          <div>
            <span className="rule-gold" />
            <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
              Nejčastější chybou začínajících i mírně pokročilých hráčů je nákup velkého
              univerzálního setu, ze kterého většinu holí na hřišti jen nosí. Stavíme hru na
              postupné progresi — dostáváte pouze hole, které vaše tělo a švih dokážou reálně
              využít.
            </p>
          </div>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {blocks.map((b) => (
            <article
              key={b.title}
              className="border border-border bg-card p-7 shadow-soft transition-shadow hover:shadow-card"
            >
              <b.icon className="h-6 w-6 text-gold" strokeWidth={1.4} />
              <h3 className="mt-6 text-lg font-medium leading-snug text-ink">{b.title}</h3>
              <ol className="mt-6 space-y-5">
                {b.points.map((p, i) => (
                  <li key={p} className="flex gap-4">
                    <span className="label-tech mt-1 shrink-0 text-olive">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-muted-foreground">{p}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
