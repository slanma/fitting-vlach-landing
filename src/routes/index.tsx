import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { Authority } from "@/components/site/Authority";
import { ClientCards } from "@/components/site/ClientCards";
import { DeepFitting } from "@/components/site/DeepFitting";
import { Faq } from "@/components/site/Faq";
import { CtaFooter } from "@/components/site/CtaFooter";

const title = "Fitting Vlach — golfový Deep Fitting s Petrem Vlachem";
const description =
  "Prémiový golfový fitting na míru. Deep Fitting založený na datech, kinematice a testování v reálných podmínkách. Domluvte si osobní konzultaci.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Authority />
        <ClientCards />
        <DeepFitting />
        <Faq />
        <CtaFooter />
      </main>
    </div>
  );
}
