import { useState } from "react";
import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowLeft, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { findProduct, priceLabel, unitPrice, formatPrice } from "@/data/eshop";
import { useCart } from "@/lib/cart";
import { SITE_URL } from "@/lib/site";
import { VAT_PAYER } from "@/lib/shop";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contact";
import { productJsonLd } from "@/lib/structured-data";

/** Který krok průvodce otevřít z detailu hole. */
const GUIDE_KIND: Record<string, string> = {
  "ping-driver": "driver",
  "ping-fairwayove-drevo": "dlouhe",
  "ping-zeleza": "zeleza",
  "ping-wedge": "wedge",
  "ping-putter": "putter",
};

const OLD_SLUGS: Record<string, string> = {
  "ping-zeleza-na-miru": "ping-zeleza",
  "ping-driver-na-miru": "ping-driver",
  "golfova-rukavice": "golfova-rukavice-hirzl",
};

export const Route = createFileRoute("/eshop/$slug")({
  loader: ({ params }) => {
    // Staré adresy z první verze e-shopu — už jsou ve vyhledávačích.
    const moved = OLD_SLUGS[params.slug];
    if (moved) throw redirect({ to: "/eshop/$slug", params: { slug: moved }, statusCode: 301 });
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
        { property: "og:url", content: `${SITE_URL}/eshop/${loaderData.slug}` },
      ],
      links: [{ rel: "canonical", href: `${SITE_URL}/eshop/${loaderData.slug}` }],
      scripts: [{ type: "application/ld+json", children: productJsonLd(loaderData) }],
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
        {product.images && product.images.length > 0 && (
          <Gallery images={product.images} alt={product.name} />
        )}
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

        {product.madeToOrder ? (
          <div className="mt-8 border-t border-border pt-6">
            <span className="font-display text-xl text-ink">{priceLabel(product)}</span>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Hůl stavíme na míru podle hodnot z fittingu, proto cenu sdělujeme individuálně.
              Zavolejte nebo napište — domluvíme fitting a po měření dostanete nabídku s konečnou
              konfigurací a cenou.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <a href={PHONE_HREF}>
                  <Phone className="mr-2 h-4 w-4" /> {PHONE_DISPLAY}
                </a>
              </Button>
              <Button asChild size="lg" variant="outline">
                <a
                  href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Dotaz na cenu: ${product.name}`)}&body=${encodeURIComponent(
                    `Dobrý den,\n\nmám zájem o ${product.name}.\n\nJméno:\nTelefon:\nHandicap / hřiště:\nSoučasné hole:\n\nDěkuji.`,
                  )}`}
                >
                  <Mail className="mr-2 h-4 w-4" /> Napsat e-mail
                </a>
              </Button>
            </div>
            {GUIDE_KIND[product.slug] && (
              <Link
                to="/eshop/pruvodce"
                search={{ hul: GUIDE_KIND[product.slug] as "driver" }}
                className="mt-6 flex items-center justify-between gap-4 border border-gold/50 bg-card p-4 text-sm hover:shadow-card"
              >
                <span>
                  <span className="block font-medium text-ink">Nevíte, který model?</span>
                  <span className="text-muted-foreground">
                    Průvodce vám ho najde podle vaší hry.
                  </span>
                </span>
                <span className="font-medium text-gold">Spustit průvodce →</span>
              </Link>
            )}
            <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
              Hole stavěné na míru podle vašich hodnot nelze vrátit v 14denní lhůtě pro odstoupení
              od smlouvy (§ 1837 písm. d) občanského zákoníku).
            </p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col items-start gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-display text-xl text-ink">
                {product.priceBy
                  ? formatPrice(unitPrice(product, config) ?? 0)
                  : priceLabel(product)}
              </span>
              <span className="block text-xs text-muted-foreground">
                {VAT_PAYER ? "včetně DPH" : "nejsme plátci DPH"} ·{" "}
                {product.digital
                  ? "pošleme e-mailem k vytištění"
                  : "skladem · osobní odběr zdarma, Zásilkovna 150 Kč, PPL 200 Kč"}
              </span>
            </div>
            <Button size="lg" onClick={() => cart.add(product, config)}>
              Do košíku
            </Button>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

function Gallery({ images, alt }: { images: string[]; alt: string }) {
  const [active, setActive] = useState(0);
  return (
    <div className="mt-8">
      <div className="aspect-[4/3] overflow-hidden border border-border bg-card">
        <img src={images[active]} alt={alt} className="h-full w-full object-contain p-6" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`Fotka ${i + 1}`}
              onClick={() => setActive(i)}
              className={`h-16 w-20 overflow-hidden border bg-card ${i === active ? "border-ink" : "border-border"}`}
            >
              <img src={src} alt="" className="h-full w-full object-contain p-1" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
