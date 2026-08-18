import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faq = [
  {
    q: "Jak dlouho setkání trvá?",
    a: "Kompletní Deep Fitting zabere zhruba tři hodiny. Nespěcháme — bez dostatku ran nejsou data spolehlivá.",
  },
  {
    q: "Co si mám vzít s sebou?",
    a: "Své současné hole, golfové rukavice a obuv, ve které běžně hrajete. Vše ostatní je připraveno na místě.",
  },
  {
    q: "Jsem začátečník, má to pro mě smysl?",
    a: "Rozhodně ano. Správně nastavená hůl vás uchrání před kompenzací špatných návyků, usnadní učení a ušetří peníze za nákup nevhodného univerzálního setu.",
  },
  {
    q: "Musím si nechat postavit celý set najednou?",
    a: "Vůbec ne. Naším cílem je dávat vám hole postupně. Často začínáme jednou nebo dvěma holemi a další doplňujeme až ve chvíli, kdy roste vaše výkonnost a herní potřeba.",
  },
  {
    q: "Vyplatí se koupit univerzální set ve slevě nebo z bazaru?",
    a: "Z praxe víme, že až u 90 % hotových setů z e-shopů hráči narazí na špatnou délku, nevhodný shaft nebo lie úhel. To, co se jeví jako výhodná koupě, se v čase prodraží. Postupné skládání holí na míru vám ušetří zbytečné výměny a hůl vám spolehlivě vydrží minimálně 6 let.",
  },
  {
    q: "Jsem vázán na jednu značku?",
    a: "Ne. Fitting je nezávislý — doporučení vychází z vašich čísel, ne z prodejních cílů.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="surface-sand">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-16 md:px-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16 lg:py-24">
        <div>
          <h2 className="text-2xl font-medium text-ink sm:text-3xl">Časté otázky</h2>
          <span className="rule-gold mt-5" />
        </div>
        <Accordion type="single" collapsible className="border-t border-border bg-card px-5 sm:px-7">
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
