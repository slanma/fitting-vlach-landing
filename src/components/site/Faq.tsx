import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faq } from "@/data/faq";

export function Faq() {
  return (
    <section id="faq" className="surface-sand">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:py-24">
        <div>
          <h2 className="text-2xl font-medium text-ink sm:text-3xl">Časté otázky</h2>
          <span className="rule-gold mt-5" />
        </div>
        <Accordion
          type="single"
          collapsible
          className="border-t border-border bg-card px-5 sm:px-7"
        >
          {faq.map((f, i) => (
            <AccordionItem key={f.q} value={`faq-${i}`} className="border-border">
              <AccordionTrigger className="py-5 text-left font-display text-[0.95rem] font-medium text-ink hover:no-underline">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
