import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer } from "lucide-react";
import { SELLER } from "@/lib/prodavajici";
import { LegalPage, Section } from "@/components/site/LegalPage";
import { Button } from "@/components/ui/button";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  TERMS_EFFECTIVE,
  WITHDRAWAL_FIELDS,
  withdrawalAddressee,
  shopAddress,
} from "@/data/pravni-texty";

export const Route = createFileRoute("/odstoupeni-od-smlouvy")({
  head: () => ({
    meta: [
      { title: `Odstoupení od smlouvy — ${SITE_NAME}` },
      {
        name: "description",
        content:
          "Poučení o odstoupení od smlouvy do 14 dnů a vzorový formulář pro e-shop Vlach Fitting.",
      },
      { property: "og:url", content: `${SITE_URL}/odstoupeni-od-smlouvy` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/odstoupeni-od-smlouvy` }],
  }),
  component: Page,
});

function Page() {
  const shop = shopAddress();
  return (
    <LegalPage title="Odstoupení od smlouvy" updated={TERMS_EFFECTIVE}>
      <Section heading="Jak odstoupit">
        <p>
          Zboží koupené v e-shopu můžete vrátit do 14 dnů od převzetí bez udání důvodu. Stačí nám v
          této lhůtě poslat oznámení na <strong className="text-ink">{SELLER.email}</strong>
          {shop ? <> nebo poštou na adresu {shop}</> : null}. Můžete použít formulář níže, ale
          nemusíte — postačí jakékoli jednoznačné prohlášení.
        </p>
        <p>
          Peníze vrátíme do 14 dnů od odstoupení, nejdříve však po převzetí vráceného zboží nebo po
          prokázání, že jste ho odeslali. Podrobnosti jsou v{" "}
          <Link to="/obchodni-podminky" className="text-ink underline underline-offset-4">
            obchodních podmínkách
          </Link>{" "}
          (čl. 6).
        </p>
        <p>
          <strong className="text-ink">
            Odstoupit nelze od koupě golfových holí stavěných na míru podle hodnot z fittingu
          </strong>{" "}
          (§ 1837 písm. d) občanského zákoníku).
        </p>
      </Section>

      <section className="space-y-4 rounded-sm border border-border bg-card p-6 text-ink print:border-0 print:p-0">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-display text-[0.95rem] font-medium">
            Vzorový formulář pro odstoupení od smlouvy
          </h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
            className="print:hidden"
          >
            <Printer className="mr-2 h-4 w-4" /> Vytisknout
          </Button>
        </div>
        <p className="text-xs italic text-muted-foreground">
          (vyplňte tento formulář a pošlete jej zpět pouze v případě, že chcete odstoupit od
          smlouvy)
        </p>
        <p className="font-medium">Oznámení o odstoupení od smlouvy</p>
        <p className="text-sm">
          <span className="text-muted-foreground">Adresát:</span> {withdrawalAddressee()}
        </p>
        {WITHDRAWAL_FIELDS.map((f) => (
          <div key={f}>
            <p className="text-sm">{f}</p>
            <div className="mt-1 h-8 border-b border-dashed border-border" />
          </div>
        ))}
        <p className="text-xs text-muted-foreground">
          (*) Nehodící se škrtněte nebo údaje doplňte.
        </p>
      </section>
    </LegalPage>
  );
}
