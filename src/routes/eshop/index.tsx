import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ClubArt } from "@/components/site/eshop/Pruvodce";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { activeProducts, priceLabel } from "@/data/eshop";
import { SITE_URL } from "@/lib/site";
import { breadcrumbSchema } from "@/lib/structured-data";

const title = "E-shop — Vlach Fitting";
const description =
  "Golfové hole PING stavěné na míru — driver, fairwayové dřevo, železa, wedge a putter — a rukavice HIRZL. Osobní odběr v Ostravě-Hrabové.";

export const Route = createFileRoute("/eshop/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/eshop` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/eshop` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            breadcrumbSchema([
              { name: "Úvod", url: `${SITE_URL}/` },
              { name: "E-shop", url: `${SITE_URL}/eshop` },
            ]),
          ],
        }),
      },
    ],
  }),
  component: Eshop,
});

function Eshop() {
  const items = activeProducts();
  const groups = [
    { key: "hole" as const, label: "Hole" },
    { key: "poukazy" as const, label: "Dárkové poukazy" },
    { key: "prislusenstvi" as const, label: "Příslušenství" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-14 md:px-10 lg:py-20">
        <span className="label-tech">E-shop</span>
        <h1 className="mt-4 text-2xl font-medium leading-snug text-ink sm:text-3xl">
          Hole, dárkové poukazy a příslušenství
        </h1>
        <span className="rule-gold mt-5" />
        <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Hole PING stavíme na míru podle hodnot naměřených při fittingu, proto je u nich cena na
          dotaz — stačí zavolat nebo napsat. Dárkový poukaz a příslušenství objednáte přes košík:
          poukaz přijde e-mailem, příslušenství vyzvednete v Ostravě-Hrabové.
        </p>

        <Link
          to="/eshop/pruvodce"
          className="group mt-10 flex flex-col gap-5 border border-gold/50 bg-card p-6 shadow-soft transition-shadow hover:shadow-card sm:flex-row sm:items-center"
        >
          <span className="flex shrink-0 gap-2 text-gold">
            <ClubArt kind="driver" className="h-16 w-20 rounded-sm bg-gold/10 p-1.5" />
            <ClubArt kind="zeleza" className="h-16 w-20 rounded-sm bg-gold/10 p-1.5" />
            <ClubArt kind="putter" className="h-16 w-20 rounded-sm bg-gold/10 p-1.5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="label-tech">Golfový profil a průvodce výběrem hole</span>
            <span className="mt-1 block text-lg font-medium text-ink">
              Nevíte, která hůl vám sedne?
            </span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Odpovězte na 3–4 otázky o své hře a uvidíte, co vám pomůže teď — a kam se posunout
              dál.
            </span>
          </span>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-gold">
            Spustit průvodce{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </Link>

        {groups.map((g) => {
          const list = items.filter((p) => p.category === g.key);
          if (list.length === 0) return null;
          return (
            <section key={g.key} className="mt-12">
              <h2 className="font-display text-sm uppercase tracking-[0.16em] text-ink">
                {g.label}
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((p) => (
                  <article
                    key={p.slug}
                    className="flex flex-col border border-border bg-card p-6 shadow-soft transition-shadow hover:shadow-card"
                  >
                    {p.images?.[0] && (
                      <Link
                        to="/eshop/$slug"
                        params={{ slug: p.slug }}
                        className="-mx-6 -mt-6 mb-5 block aspect-[4/3] overflow-hidden border-b border-border bg-background"
                      >
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          loading="lazy"
                          className="h-full w-full object-contain p-4 transition-transform duration-300 hover:scale-[1.03]"
                        />
                      </Link>
                    )}
                    <span className="label-tech">{p.brand}</span>
                    <h3 className="mt-3 text-lg font-medium leading-snug text-ink">{p.name}</h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {p.short}
                    </p>
                    {p.madeToOrder && (
                      <span className="mt-4 self-start rounded-sm border border-gold/40 px-2 py-1 text-[0.65rem] uppercase tracking-wider text-gold">
                        Na míru
                      </span>
                    )}
                    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                      <span className="font-display text-base text-ink">{priceLabel(p)}</span>
                      <Link
                        to="/eshop/$slug"
                        params={{ slug: p.slug }}
                        className="text-sm font-medium text-gold hover:opacity-75"
                      >
                        Detail
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <p className="mt-14 text-xs leading-relaxed text-muted-foreground">
          PING® je registrovaná ochranná známka společnosti Karsten Manufacturing Corporation.
          Uvedení značky slouží k popisu nabízeného zboží.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
