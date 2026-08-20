import { createFileRoute } from "@tanstack/react-router";
import { homepageJsonLd } from "@/lib/structured-data";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL, OG_IMAGE } from "@/lib/site";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Authority } from "@/components/site/Authority";
import { ClientCards } from "@/components/site/ClientCards";
import { BagPhilosophy } from "@/components/site/BagPhilosophy";
import { DeepFitting } from "@/components/site/DeepFitting";
import { Faq } from "@/components/site/Faq";
import { CtaFooter } from "@/components/site/CtaFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: SITE_TITLE },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: SITE_TITLE },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: `${SITE_URL}${OG_IMAGE}` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    // Strukturovaná data pro vyhledávače a AI agenty.
    scripts: [{ type: "application/ld+json", children: homepageJsonLd() }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <ClientCards />
        <BagPhilosophy />
        <Authority />
        <DeepFitting />
        <Faq />
        <CtaFooter />
      </main>
    </div>
  );
}
