import { PHONE_DISPLAY, EMAIL } from "./contact";

/**
 * Fakta o firmě na jednom místě.
 *
 * Odsud se plní JSON-LD, meta tagy, sitemap i llms.txt. Když se něco změní,
 * mění se to TADY a nikde jinde.
 *
 * DŮLEŽITÉ: pole s hodnotou `null` se do strukturovaných dat vůbec nezapíšou.
 * Nevyplňuj je odhadem — nepřesná adresa nebo otevírací doba u Google
 * napáchá víc škody než jejich absence.
 */

/** Kanonická doména bez lomítka na konci. */
export const SITE_URL = "https://vlachfitting.cz";

export const SITE_NAME = "Fitting Vlach";
export const SITE_LOCALE = "cs_CZ";
export const SITE_LANG = "cs";

export const PERSON_NAME = "Petr Vlach";
export const PERSON_JOB_TITLE = "Golfový fitter";

export const SITE_TITLE = "Fitting Vlach — golfový Deep Fitting s Petrem Vlachem";
export const SITE_DESCRIPTION =
  "Prémiový golfový fitting na míru. Deep Fitting založený na datech, kinematice a testování v reálných podmínkách. Domluvte si osobní konzultaci.";

/** Náhledový obrázek pro sdílení (1200×630), leží v public/. */
export const OG_IMAGE = "/og-image.jpg";

export const CONTACT = {
  phone: PHONE_DISPLAY,
  email: EMAIL,
} as const;

/**
 * ---------------------------------------------------------------------------
 * NEVYPLNĚNO — doplnit reálné údaje, teprve pak se objeví ve strukturovaných datech
 * ---------------------------------------------------------------------------
 */

/** Adresa studia, kde fitting probíhá. */
export const ADDRESS: {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion: string | null;
  addressCountry: string;
} | null = null;

/** Zeměpisné souřadnice studia — pomáhají lokálnímu vyhledávání. */
export const GEO: { latitude: number; longitude: number } | null = null;

/**
 * Otevírací doba, např.:
 * [{ days: ["Monday", "Tuesday"], opens: "09:00", closes: "18:00" }]
 * U fittingu na objednávku klidně nech `null` a spoléhej na telefon.
 */
export const OPENING_HOURS: Array<{
  days: string[];
  opens: string;
  closes: string;
}> | null = null;

/** IČO — v JSON-LD jako identifikátor firmy. */
export const COMPANY_ID: string | null = null;

/** Oficiální název subjektu, pokud se liší od značky. */
export const LEGAL_NAME: string | null = null;

/** Cenové rozpětí ve tvaru "$$" až "$$$$", nebo `null`. */
export const PRICE_RANGE: string | null = null;

/** Profily na sociálních sítích a v katalozích (Facebook, Instagram, Google profil…). */
export const SOCIAL_PROFILES: string[] = [];

/** Oblast, kam se za klienty jezdí / odkud klienti jezdí. */
export const AREA_SERVED: string[] = ["Česko"];
