import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { activeProducts, formatPrice } from "@/data/eshop";
import { SITE_URL } from "@/lib/site";

const title = "E-shop — Fitting Vlach";
const description =
  "Golfové hole PING stavěné na míru a příslušenství. Konfiguraci potvrzujeme po fittingu, platba QR kódem.";

export const Route = createFileRoute("/eshop/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/eshop` }],
  }),
  component: Eshop,
});

function Eshop() {
  const items = activeProducts();
  const groups = [
    { key: "hole" as const, label: "Hole" },
    { key: "prislusenstvi" as const, label: "Příslušenství" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 py-14 md:px-10 lg:py-20">
        <span className="label-tech">E-shop</span>
        <h1 className="mt-4 text-2xl font-medium leading-snug text-ink sm:text-3xl">
          Hole a příslušenství
        </h1>
        <span className="rule-gold mt-5" />
        <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          Hole se stavějí na míru podle hodnot naměřených při fittingu, proto u nich uvádíme cenu
          „od" — konečnou potvrdíme po domluvě konfigurace. Příslušenství je běžné skladové zboží.
        </p>

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
                      <span className="font-display text-base text-ink">
                        {formatPrice(p.price, p.priceFrom)}
                      </span>
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
