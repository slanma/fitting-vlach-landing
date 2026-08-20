import type { ReactNode } from "react";
import { Navbar } from "@/components/site/Navbar";
import { SiteFooter } from "@/components/site/SiteFooter";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-3xl px-5 py-14 md:px-10 lg:py-20">
        <h1 className="text-2xl font-medium leading-snug text-ink sm:text-3xl">{title}</h1>
        <span className="rule-gold mt-5" />
        <p className="mt-4 text-xs text-muted-foreground">Účinné od {updated}</p>
        <div className="legal mt-10 space-y-8 text-sm leading-relaxed text-muted-foreground">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-[0.95rem] font-medium text-ink">{heading}</h2>
      {children}
    </section>
  );
}
