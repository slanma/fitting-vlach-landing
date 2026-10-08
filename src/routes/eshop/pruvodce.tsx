import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { GolfovyProfil } from "@/components/site/GolfovyProfil";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Pruvodce } from "@/components/site/eshop/Pruvodce";
import { KINDS, type ClubKind } from "@/data/pruvodce";
import { SITE_URL } from "@/lib/site";

const title = "Golfový profil a průvodce výběrem hole — Vlach Fitting";
const description =
  "Pár kliknutí o vaší hře: zjistěte, kde máte rezervu, co vyřeší správná hůl a jestli vám pomůže fitting. Anonymně. Pak vyberte konkrétní hůl PING.";

export const Route = createFileRoute("/eshop/pruvodce")({
  validateSearch: (s: Record<string, unknown>): { hul?: ClubKind } =>
    KINDS.some((k) => k.id === s["hul"]) ? { hul: s["hul"] as ClubKind } : {},
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:url", content: `${SITE_URL}/eshop/pruvodce` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/eshop/pruvodce` }],
  }),
  component: Page,
});

function Page() {
  const { hul } = Route.useSearch();
  // S ?hul=… (odkaz z detailu hole) rovnou výběr hole, jinak nejdřív golfový profil.
  const [club, setClub] = useState<ClubKind | null | undefined>(hul ?? undefined);
  const mode = club === undefined ? "profil" : "hul";
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-5 py-14 md:px-10 lg:py-20">
        <Link
          to="/eshop"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" /> E-shop
        </Link>
        <span className="label-tech mt-8 block">
          {mode === "profil" ? "Golfový profil" : "Průvodce výběrem hole"}
        </span>
        <h1 className="mt-3 text-2xl font-medium leading-snug text-ink sm:text-3xl">
          {mode === "profil" ? "Kde vám hůl pomůže nejvíc?" : "Která hůl vám sedne?"}
        </h1>
        <span className="rule-gold mt-5" />
        <p className="mt-6 max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">
          {mode === "profil"
            ? "Pár kliknutí. Driver vám nejde, ale železa ano? Přesně takové rozdíly fitting řeší."
            : "Pár otázek o vaší hře. Ukážeme, která hůl PING vám teď pomůže nejvíc — a kam se můžete posunout, až se vaše hra zlepší."}
        </p>
        <div className="mt-10">
          {mode === "profil" ? (
            <GolfovyProfil onPickClub={(k) => setClub(k)} />
          ) : (
            <Pruvodce key={club ?? "x"} initialKind={club ?? undefined} />
          )}
        </div>
        <div className="mt-6 text-sm">
          {mode === "profil" ? (
            <button
              type="button"
              onClick={() => setClub(null)}
              className="text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
            >
              Přeskočit a rovnou vybrat hůl →
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setClub(undefined)}
              className="text-muted-foreground underline-offset-4 hover:text-ink hover:underline"
            >
              ← Golfový profil: kde vám hůl pomůže nejvíc
            </button>
          )}
        </div>
        <p className="mt-10 text-xs leading-relaxed text-muted-foreground">
          PING® je registrovaná ochranná známka společnosti Karsten Manufacturing Corporation.
          Doporučení je orientační; konečnou hůl určí fitting.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
