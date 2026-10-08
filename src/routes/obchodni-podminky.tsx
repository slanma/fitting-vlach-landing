import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/site/LegalPage";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { termsSections, TERMS_EFFECTIVE } from "@/data/pravni-texty";

export const Route = createFileRoute("/obchodni-podminky")({
  head: () => ({
    meta: [
      { title: `Obchodní podmínky — ${SITE_NAME}` },
      { name: "description", content: "Obchodní podmínky e-shopu Vlach Fitting." },
      { property: "og:url", content: `${SITE_URL}/obchodni-podminky` },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/obchodni-podminky` }],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage title="Obchodní podmínky" updated={TERMS_EFFECTIVE}>
      {termsSections().map((s) => (
        <Section key={s.heading} heading={s.heading}>
          {s.blocks.map((b, i) =>
            "ul" in b ? (
              <ul key={i} className="list-disc space-y-1 pl-5">
                {b.ul.map((li) => (
                  <li key={li}>{li}</li>
                ))}
              </ul>
            ) : (
              <p key={i}>{b.strong ? <strong className="text-ink">{b.p}</strong> : b.p}</p>
            ),
          )}
        </Section>
      ))}
    </LegalPage>
  );
}
