import { PHONE_HREF, EMAIL } from "./contact";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_LANG,
  PERSON_NAME,
  PERSON_JOB_TITLE,
  OG_IMAGE,
  ADDRESS,
  GEO,
  OPENING_HOURS,
  COMPANY_ID,
  LEGAL_NAME,
  FORMER_NAME,
  PRICE_RANGE,
  VAT_ID,
  BY_APPOINTMENT_NOTE,
  SOCIAL_PROFILES,
  AREA_SERVED,
} from "./site";
import { faq } from "@/data/faq";

/** Vyhodí klíče s null/undefined/prázdným polem, ať schéma neobsahuje prázdná místa. */
function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => {
      if (v === null || v === undefined) return false;
      if (Array.isArray(v) && v.length === 0) return false;
      return true;
    }),
  );
}

const telephone = PHONE_HREF.replace("tel:", "");
const businessId = `${SITE_URL}/#business`;
const personId = `${SITE_URL}/#petr-vlach`;

/**
 * ProfessionalService — fitting je služba na objednávku, ne kamenný obchod.
 * Dědí z LocalBusiness, takže platí i pro lokální vyhledávání.
 */
export function businessSchema() {
  return clean({
    "@type": "ProfessionalService",
    "@id": businessId,
    name: SITE_NAME,
    alternateName: FORMER_NAME,
    legalName: LEGAL_NAME,
    description: `${SITE_DESCRIPTION} ${BY_APPOINTMENT_NOTE}`,
    url: SITE_URL,
    image: `${SITE_URL}${OG_IMAGE}`,
    telephone,
    email: EMAIL,
    priceRange: PRICE_RANGE,
    vatID: VAT_ID,
    identifier: COMPANY_ID ? { "@type": "PropertyValue", name: "IČO", value: COMPANY_ID } : null,
    address: ADDRESS ? clean({ "@type": "PostalAddress", ...ADDRESS }) : null,
    geo: GEO ? { "@type": "GeoCoordinates", ...GEO } : null,
    openingHoursSpecification: OPENING_HOURS
      ? OPENING_HOURS.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes,
        }))
      : null,
    areaServed: AREA_SERVED.map((a) => ({ "@type": "AdministrativeArea", name: a })),
    sameAs: SOCIAL_PROFILES,
    potentialAction: {
      "@type": "ReserveAction",
      name: "Domluvit osobní konzultaci",
      description: BY_APPOINTMENT_NOTE,
      target: [PHONE_HREF, `mailto:${EMAIL}`],
    },
    founder: { "@id": personId },
    employee: { "@id": personId },
    knowsLanguage: ["cs", "en"],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Hloubkový fitting",
          serviceType: "Golfový fitting",
          description:
            "Kompletní fitting na míru trvající zhruba tři hodiny. Vychází z herního kontextu, fyzické stránky a kinematiky hráče, měřených dat a testování v reálných podmínkách. Výstupem je nastavení délky, lie, loftu, shaftu i materiálu.",
          provider: { "@id": businessId },
        },
      },
    ],
  });
}

/** Petr Vlach jako osoba — kvůli entitnímu propojení a dotazům typu „kdo je…". */
export function personSchema() {
  return clean({
    "@type": "Person",
    "@id": personId,
    name: PERSON_NAME,
    jobTitle: PERSON_JOB_TITLE,
    description:
      "Golfový fitter s více než dvěma dekádami praxe. Realizoval přes 1000 fittingů hráčů všech výkonnostních kategorií, od rekreačních golfistů po profesionály.",
    worksFor: { "@id": businessId },
    url: SITE_URL,
    knowsAbout: [
      "golfový fitting",
      "nastavení golfových holí",
      "výběr shaftu",
      "lie úhel",
      "loft",
      "kinematika golfového švihu",
      "analýza letových dat míče",
    ],
  });
}

/** FAQPage — text se bere z téhož zdroje jako viditelná sekce na stránce. */
export function faqSchema() {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    inLanguage: SITE_LANG,
    publisher: { "@id": businessId },
  };
}

/** Vše v jednom grafu — čitelnější pro roboty než čtyři oddělené bloky. */
export function homepageJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [websiteSchema(), businessSchema(), personSchema(), faqSchema()],
  });
}
