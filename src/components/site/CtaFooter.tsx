import { Phone, Mail, FileText, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import course from "@/assets/course-sunset.jpg";
import { PHONE_DISPLAY, PHONE_HREF, EMAIL, EMAIL_HREF } from "@/lib/contact";
import { ADDRESS, BY_APPOINTMENT_NOTE } from "@/lib/site";

const perks = [
  { icon: FileText, label: "Nezávislá konzultace" },
  { icon: Clock, label: "Individuální přístup" },
  { icon: CheckCircle2, label: "Vždy jen jeden hráč na místě" },
];

export function CtaFooter() {
  return (
    <section id="kontakt" className="bg-card">
      <div className="mx-auto grid max-w-7xl items-stretch lg:grid-cols-2">
        <img
          src={course}
          alt="Golfista na hřišti při západu slunce"
          loading="lazy"
          width={1600}
          height={1323}
          className="h-64 w-full object-cover sm:h-80 lg:h-full"
        />
        <div className="px-5 py-14 md:px-12 lg:self-center lg:py-20">
          <h2 className="text-2xl font-medium leading-snug text-ink sm:text-3xl">
            Výsledek neuvidíte na papíře.
            <span className="block">Uvidíte ho na hřišti.</span>
          </h2>
          <p className="mt-6 max-w-lg text-[0.95rem] leading-relaxed text-muted-foreground">
            Jestliže na prvním odpališti cítíte, že hůl sedí a míč letí tam, kam má — to je ten
            pocit, o který při fittingu běží.
          </p>
          <p className="mt-9 text-sm font-medium text-ink">Domluvte si osobní konzultaci</p>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full sm:w-auto">
              <a href={PHONE_HREF} aria-label={`Zavolat na ${PHONE_DISPLAY}`}>
                <Phone className="h-4 w-4" strokeWidth={1.75} />
                {PHONE_DISPLAY}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
              <a href={EMAIL_HREF} aria-label={`Napsat e-mail na ${EMAIL}`}>
                <Mail className="h-4 w-4" strokeWidth={1.75} />
                Napsat e-mail
              </a>
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            Nebo napište přímo na{" "}
            <a href={EMAIL_HREF} className="text-ink underline underline-offset-4">
              {EMAIL}
            </a>
          </p>

          {ADDRESS && (
            <address className="mt-6 not-italic text-xs leading-relaxed text-muted-foreground">
              <span className="block text-ink">{ADDRESS.streetAddress}</span>
              <span className="block">
                {ADDRESS.postalCode} {ADDRESS.addressLocality}
              </span>
              <span className="mt-2 block">{BY_APPOINTMENT_NOTE}</span>
            </address>
          )}

          <ul className="mt-10 grid gap-4 border-t border-border pt-7 sm:grid-cols-3">
            {perks.map((p) => (
              <li key={p.label} className="flex items-start gap-3">
                <p.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                <span className="min-w-0 text-xs leading-relaxed text-muted-foreground">
                  {p.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
