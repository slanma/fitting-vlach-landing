import { ChevronDown } from "lucide-react";

import { faq } from "@/data/faq";

/**
 * FAQ záměrně NEPOUŽÍVÁ Radix Accordion.
 *
 * Radix u zavřené položky children vůbec nevykreslí — ani `forceMount` to
 * nezmění, protože obsah je uvnitř podmínky `isOpen && children`. Odpovědi
 * tak nebyly v HTML a crawler ani jazykový model je nikdy neviděl, přestože
 * je FAQPage JSON-LD deklaruje. To je zároveň porušení pravidel Google pro
 * strukturovaná data: schéma musí odpovídat obsahu stránky.
 *
 * Nativní <details>/<summary> je v DOM vždy, funguje bez JavaScriptu
 * a Google sbalený obsah v accordionu indexuje standardně.
 */
export function Faq() {
  return (
    <section id="faq" className="surface-sand">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:py-24">
        <div>
          <h2 className="text-2xl font-medium text-ink sm:text-3xl">Časté otázky</h2>
          <span className="rule-gold mt-5" />
        </div>
        <div className="border-t border-border bg-card px-5 sm:px-7">
          {faq.map((f) => (
            <details key={f.q} className="group border-b border-border">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-display text-[0.95rem] font-medium text-ink [&::-webkit-details-marker]:hidden">
                {f.q}
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-180" />
              </summary>
              <div className="pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
