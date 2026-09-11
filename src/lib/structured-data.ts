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
  FORMER_NAMES,
  PRICE_RANGE,
  VAT_ID,
  BY_APPOINTMENT_NOTE,
  SOCIAL_PROFILES,
  AREA_SERVED,
  BRAND_PARTNERSHIP,
} from "./site";
import { faq } from "@/data/faq";
import type { Product } from "@/data/eshop";

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
    alternateName: FORMER_NAMES,
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
    /**
     * Zastoupení značky jako vlastnost subjektu. Schema.org nemá vyhrazenou
     * property pro autorizovaného prodejce, `additionalProperty` je nejbližší
     * korektní způsob — popisuje vztah, netvrdí vlastnictví známky.
     */
    additionalProperty: BRAND_PARTNERSHIP
      ? clean({
          "@type": "PropertyValue",
          name: "Autorizované zastoupení značky",
          value: BRAND_PARTNERSHIP.brand,
          description: BRAND_PARTNERSHIP.designation,
        })
      : null,
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
      ...(BRAND_PARTNERSHIP
        ? [
            {
              "@type": "Offer",
              itemOffered: clean({
                "@type": "Service",
                name: `Fitting a stavba holí ${BRAND_PARTNERSHIP.brand} na míru`,
                serviceType: "Fitting a stavba golfových holí na míru",
                description: `Fitting, konfigurace a stavba golfových holí ${BRAND_PARTNERSHIP.brand} podle naměřených hodnot hráče — délka, lie úhel, loft, shaft i grip. ${BRAND_PARTNERSHIP.designation} Samotné doporučení zůstává nezávislé: vychází z čísel hráče, ne z prodejních cílů.`,
                brand: { "@type": "Brand", name: BRAND_PARTNERSHIP.brand },
                provider: { "@id": businessId },
                startDate: BRAND_PARTNERSHIP.sinceYear
                  ? String(BRAND_PARTNERSHIP.sinceYear)
                  : null,
              }),
            },
          ]
        : []),
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
    description: BRAND_PARTNERSHIP
      ? `Golfový fitter s více než dvěma dekádami praxe, specializovaný na stavbu golfových holí na míru. Realizoval přes 1000 fittingů hráčů všech výkonnostních kategorií, od rekreačních golfistů po profesionály. ${BRAND_PARTNERSHIP.designation}`
      : "Golfový fitter s více než dvěma dekádami praxe, specializovaný na stavbu golfových holí na míru. Realizoval přes 1000 fittingů hráčů všech výkonnostních kategorií, od rekreačních golfistů po profesionály.",
    hasOccupation: {
      "@type": "Occupation",
      name: PERSON_JOB_TITLE,
      occupationalCategory: "Fitting a stavba golfových holí na míru",
    },
    worksFor: { "@id": businessId },
    url: SITE_URL,
    /**
     * `knowsAbout` je jediné pole ve schématu, kam patří témata oboru.
     * NENÍ to náhrada za meta keywords — smysl má jen tehdy, když jde
     * o věci, které fitter opravdu dělá. Seznam držet krátký a pravdivý;
     * nafouknutý výčet je pro roboty signál spamu, ne relevance.
     */
    knowsAbout: [
      "golfový fitting",
      "clubfitting",
      "stavba golfových holí na míru",
      ...(BRAND_PARTNERSHIP ? [`fitting golfových holí ${BRAND_PARTNERSHIP.brand}`] : []),
      "fitting želez",
      "fitting driveru",
      "analýza patování",
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

/** Drobečková navigace — pomáhá robotům pochopit hierarchii webu. */
export function breadcrumbSchema(trail: Array<{ name: string; url: string }>) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Product pro detail zboží v e-shopu.
 *
 * `offers` se zapíše jen tehdy, když je vyplněná reálná cena. Katalog má
 * zatím nuly jako placeholder a nulová cena ve strukturovaných datech je
 * horší než žádná — Google ji bere jako závaznou nabídku.
 */
export function productSchema(product: Product) {
  const url = `${SITE_URL}/eshop/${product.slug}`;
  return clean({
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    url,
    brand: { "@type": "Brand", name: product.brand },
    category: product.category === "hole" ? "Golfové hole" : "Golfové příslušenství",
    offers:
      product.price > 0
        ? clean({
            "@type": "Offer",
            url,
            price: product.price,
            priceCurrency: "CZK",
            availability: "https://schema.org/InStock",
            seller: { "@id": businessId },
          })
        : null,
  });
}

/** Graf pro detail produktu — produkt, prodejce a cesta k němu. */
export function productJsonLd(product: Product) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      productSchema(product),
      businessSchema(),
      breadcrumbSchema([
        { name: "Úvod", url: `${SITE_URL}/` },
        { name: "E-shop", url: `${SITE_URL}/eshop` },
        { name: product.name, url: `${SITE_URL}/eshop/${product.slug}` },
      ]),
    ],
  });
}

/** Vše v jednom grafu — čitelnější pro roboty než čtyři oddělené bloky. */
export function homepageJsonLd() {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [websiteSchema(), businessSchema(), personSchema(), faqSchema()],
  });
}
