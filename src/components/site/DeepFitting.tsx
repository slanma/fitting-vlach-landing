import { ArrowRight, MapPin, PersonStanding, Flag, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import studioAsset from "@/assets/green-podzim.jpg.asset.json";

const studio = studioAsset.url;

const items = [
  {
    icon: MapPin,
    title: "Kde hrajete nejčastěji?",
    lead: "Pro koho, jaký je účel, typ odpaliště — hrajeme tam, kde hrajete vy.",
    body: "Než začneme měřit, mluvíme o vaší hře. Kde hrajete, jak často, jaké máte cíle a co vás dnes nejvíc limituje. Bez toho jsou čísla jen čísla.",
  },
  {
    icon: PersonStanding,
    title: "Fyzická stránka a kinematika",
    lead: "Síla, flexibilita, rozsah pohybu — vše se, ne jen ruce v těle.",
    body: "Posoudíme rozsah pohybu, stabilitu a tempo švihu. Sestava musí odpovídat tělu, které s ní hraje, jinak se boj o konzistenci nedá vyhrát.",
  },
  {
    icon: Flag,
    title: "Na hřišti v praxi",
    lead: "Testujeme v reálných podmínkách, ne jen na rohožce.",
    body: "Kombinujeme přesná data z launch monitoru s testováním venku. Uvidíte, jak se sestava chová v travě, ve větru a pod tlakem reálné rány.",
  },
  {
    icon: CheckCircle2,
    title: "Výsledek na míru",
    lead: "Délka, lie, loft, shaft i materiál — vše pro váš potenciál.",
    body: "Na konci máte přesnou specifikaci sestavy: hlavy, shafty, gripy, délky, lie a lofty. Dostanete ji písemně — s daty, která rozhodnutí podpírají.",
  },
];

export function DeepFitting() {
  return (
    <section id="deep-fitting" className="bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:px-10 lg:grid-cols-[0.9fr_1.4fr_1fr] lg:items-start lg:gap-12 lg:py-24">
        <div>
          <h2 className="text-2xl font-medium leading-snug text-ink sm:text-3xl">
            Golf nehrajete v prodejně.
            <span className="mt-3 block text-muted-foreground">
              Proč byste tam měli vybírat hole?
            </span>
          </h2>
          <span className="rule-gold mt-6" />
          <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
            Hloubkový Fitting je proces, který jde za hranice standardních měření. Zakládám ho na tom, jak
            se hýbete, jaká jsou vaše čísla a jaký máte cíl.
          </p>
          <a
            href="#kontakt"
            className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-gold transition-opacity hover:opacity-75"
          >
            Zjistit více o Hloubkovém Fittingu
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-border">
          {items.map((it, i) => (
            <AccordionItem key={it.title} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="gap-4 py-5 text-left hover:no-underline">
                <span className="flex min-w-0 items-start gap-4">
                  <it.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
                  <span className="min-w-0">
                    <span className="block font-display text-[0.95rem] font-medium text-ink">
                      {it.title}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                      {it.lead}
                    </span>
                  </span>
                </span>
              </AccordionTrigger>
              <AccordionContent className="pl-9 text-sm leading-relaxed text-muted-foreground">
                {it.body}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <img
          src={studio}
          alt="Golfový green s vlajkou u vodní překážky na podzim"
          loading="lazy"
          width={1456}
          height={1941}
          className="h-64 w-full object-cover lg:h-[26rem]"
        />
      </div>
    </section>
  );
}
