import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { findProduct, formatPrice } from "@/data/eshop";
import { useCart } from "@/lib/cart";
import { SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/eshop/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return product;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    return {
      meta: [
        { title: `${loaderData.name} — Vlach Fitting` },
        { name: "description", content: loaderData.short },
        { property: "og:title", content: loaderData.name },
        { property: "og:description", content: loaderData.short },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/eshop/${loaderData.slug}` }],
    };
  },
  component: Detail,
});

function Detail() {
  const product = Route.useLoaderData();
  const cart = useCart();
  const [config, setConfig] = useState<Record<string, string>>(() =>
    Object.fromEntries(product.options.map((o) => [o.label, o.values[0] ?? ""])),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-14 md:px-10 lg:py-20">
        <Link
          to="/eshop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> Zpět do e-shopu
        </Link>

        <span className="label-tech mt-8 block">{product.brand}</span>
        <h1 className="mt-3 text-2xl font-medium leading-snug text-ink sm:text-3xl">
          {product.name}
        </h1>
        <span className="rule-gold mt-5" />
        <p className="mt-6 text-[0.95rem] leading-relaxed text-muted-foreground">
          {product.description}
        </p>

        <div className="mt-8 space-y-5">
          {product.options.map((o) => (
            <div key={o.label}>
              <label htmlFor={`opt-${o.label}`} className="label-tech">
                {o.label}
              </label>
              <select
                id={`opt-${o.label}`}
                className="mt-2 h-10 w-full rounded-sm border border-border bg-card px-3 text-sm"
                value={config[o.label] ?? ""}
                onChange={(e) => setConfig((c) => ({ ...c, [o.label]: e.target.value }))}
              >
                {o.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {product.madeToOrder && (
          <p className="mt-8 rounded-sm border border-gold/40 bg-gold/5 p-4 text-xs leading-relaxed text-ink">
            Zboží se staví na míru podle hodnot z fittingu. Cenu i konfiguraci potvrdíme před
            výrobou. U zboží upraveného podle vašeho přání{" "}
            <strong>nelze odstoupit od smlouvy do 14 dnů</strong> (§ 1837 občanského zákoníku).
          </p>
        )}

        <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-display text-xl text-ink">
            {formatPrice(product.price, product.priceFrom)}
          </span>
          <Button size="lg" onClick={() => cart.add(product, config)}>
            Do košíku
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
