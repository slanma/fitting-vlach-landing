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
export const SITE_URL = "https://www.vlachfitting.cz";

export const SITE_NAME = "Vlach Fitting";
export const SITE_LOCALE = "cs_CZ";
export const SITE_LANG = "cs";

/**
 * Dřívější názvy téhož subjektu (stejné IČO, stejná provozovna, stejná osoba).
 *
 * Jdou do JSON-LD jako `alternateName`, aby vyhledávače a jazykové modely
 * spojily starší zmínky, recenze a odkazy s aktuální značkou. Za roky se
 * služba prezentovala pod několika jmény; sjednoceno je to na kombinaci
 * jméno + profese, protože ta se používala nejvíc.
 *
 * POZOR — co sem NEPATŘÍ:
 * - názvy obsahující cizí ochrannou známku (PING). Historicky se používaly,
 *   ale tvrzení „firma se jmenuje PING …" ve strukturovaných datech je spor
 *   o známku, ne SEO. Historie je popsaná slovy v public/llms.txt.
 * - Vapesport / VAPE. Je to sice stejný podnikatel, ale jiná činnost
 *   (cyklistické brašny). Spojením by modely slily dvě nesouvisející firmy
 *   do jedné — llms.txt to naopak explicitně rozlišuje.
 *
 * Až vazba doslouží (řádově roky), stačí pole vyprázdnit.
 */
export const FORMER_NAMES: string[] = ["FreeGolf", "Golf Fitting Centrum Ostrava", "GFCO"];

export const PERSON_NAME = "Petr Vlach";
export const PERSON_JOB_TITLE = "Golfový fitter";

/**
 * Titulek a popisek jsou jediné místo, kde se dá webu přidat lokalita
 * a obor bez zásahu do viditelných textů. Na stránce se nezobrazí —
 * čte je vyhledávač a jazykové modely. Proto tu je „golfový fitting
 * Ostrava" doslova: přesně v té podobě, v jaké se lidé ptají.
 */
export const SITE_TITLE = "Vlach Fitting — golfový fitting Ostrava s Petrem Vlachem";
export const SITE_DESCRIPTION =
  "Hloubkový golfový fitting v Ostravě-Hrabové s Petrem Vlachem. Přes 20 let praxe a 1000 fittingů. Nezávislé doporučení podle naměřených dat. Konzultace po domluvě.";

/** Náhledový obrázek pro sdílení (1200×630), leží v public/. */
export const OG_IMAGE = "/og-image.jpg";

export const CONTACT = {
  phone: PHONE_DISPLAY,
  email: EMAIL,
} as const;

/**
 * ---------------------------------------------------------------------------
 * Údaje o provozovně a subjektu
 * ---------------------------------------------------------------------------
 */

/**
 * ADRESA PROVOZOVNY — místo, kde fitting reálně probíhá.
 *
 * POZOR: tohle NENÍ sídlo podnikatele. U fyzické osoby je sídlo v rejstříku
 * zpravidla adresa bydliště a na web, do map ani do JSON-LD nepatří.
 * Sem patří výhradně provozovna, kam mají zákazníci přijít.
 */
export const ADDRESS: {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressRegion: string | null;
  addressCountry: string;
} | null = {
  streetAddress: "Paskovská 636/275",
  addressLocality: "Ostrava-Hrabová",
  postalCode: "720 00",
  addressRegion: "Moravskoslezský kraj",
  addressCountry: "CZ",
};

/**
 * Zeměpisné souřadnice provozovny.
 * DOPLNIT: na mapy.cz klikni pravým na vchod → „Co je zde?" → zkopíruj čísla.
 * Nechávám prázdné — odhadnuté souřadnice pošlou zákazníky na špatné místo.
 */
export const GEO: { latitude: number; longitude: number } | null = null;

/**
 * Otevírací doba se NEPUBLIKUJE ve strukturovaných datech záměrně.
 * Provoz je individuální: v zimě zhruba 8:00–14:00, v sezóně bývá fitter
 * na hřišti nebo drivingu a v provozovně nemusí být vůbec. Pevná doba
 * v JSON-LD by posílala lidi před zavřené dveře a Google by ji zobrazoval
 * jako závaznou. Místo toho komunikujeme „po předchozí domluvě".
 */
export const OPENING_HOURS: Array<{
  days: string[];
  opens: string;
  closes: string;
}> | null = null;

/** Viditelná i strojově čitelná formulace režimu provozu. */
export const BY_APPOINTMENT_NOTE =
  "Návštěva vždy po předchozí telefonické domluvě. Provozní doba se v průběhu roku mění — v sezóně bývám na hřišti nebo drivingu.";

/**
 * SÍDLO PODNIKATELE podle rejstříku — záměrně `null`.
 *
 * Nepoužívej ho v JSON-LD, v mapách ani v kontaktní sekci: `LocalBusiness.address`
 * znamená „kde firmu najdu", což je provozovna výše. Sídlo je potřeba jedině
 * v identifikačních údajích prodávajícího na právních stránkách e-shopu
 * (obchodní podmínky, reklamační řád). Až se e-shop bude spouštět, doplň ho
 * TAM — do vlastní proměnné a vlastní komponenty, nikdy ne do `ADDRESS`.
 */
export const REGISTERED_SEAT: {
  streetAddress: string;
  addressLocality: string;
  postalCode: string;
  addressCountry: string;
} | null = null;

/** IČO. */
export const COMPANY_ID: string | null = "46121706";

/** Název subjektu podle rejstříku. */
export const LEGAL_NAME: string | null = "Ing. Petr Vlach";

/**
 * DIČ se ve strukturovaných datech NEUVÁDÍ.
 * U fyzické osoby je odvozené od rodného čísla, takže by web zveřejnil
 * i datum narození. Na faktury a do patičky obchodních podmínek patří,
 * do JSON-LD pro roboty ne. Když ho tam přesto chceš, vyplň a doplní se.
 */
export const VAT_ID: string | null = null;

/** Cena fittingu se záměrně neuvádí — cíl je poptávka, ne filtrování cenou. */
export const PRICE_RANGE: string | null = null;

/** Sociální sítě — doplnit až budou profily hotové (Facebook, Instagram). */
export const SOCIAL_PROFILES: string[] = [];

/**
 * AUTORIZOVANÉ ZASTOUPENÍ ZNAČKY
 *
 * Vyjadřuje se jako VZTAH k výrobci, ne jako název firmy. Rozdíl je zásadní:
 * „jsme autorizované zastoupení PING pro fitting a prodej" je popis skutečného
 * obchodního vztahu, zatímco `alternateName: "PING Ostrava"` by bylo tvrzení,
 * že se tak firma jmenuje — a to je spor o ochrannou známku.
 *
 * `designation` naformuluj přesně tak, jak to připouští smlouva s výrobcem.
 * Výrobci mívají předepsané, jak se partner smí označovat (jiné znění platí
 * pro „authorized dealer" a jiné pro certifikovaného fittera). Nevymýšlej
 * stupeň certifikace, který Petr fakticky nemá.
 */
export const BRAND_PARTNERSHIP: {
  /** Značka, pro kterou zastoupení platí. */
  brand: string;
  /** Formulace vztahu — viz poznámka výše. */
  designation: string;
  /** Rok začátku spolupráce. DOPLNIT, pak se do schématu přidá `startDate`. */
  sinceYear: number | null;
} | null = {
  brand: "PING",
  designation:
    "Autorizované zastoupení značky PING pro fitting a prodej golfových holí. Spolupráce trvá nepřetržitě více než dvacet let.",
  sinceYear: null,
};

/**
 * Oblast působnosti.
 *
 * Kraj a města, kde služba reálně funguje. Obce jsou tu proto, že fitting
 * běžně probíhá přímo na hřišti hráče, ne jen v provozovně.
 */
export const AREA_SERVED: string[] = [
  "Ostrava",
  "Moravskoslezský kraj",
  "Česko",
  "Čeladná",
  "Ostravice",
  "Ropice",
  "Šilheřovice",
  "Karviná",
  "Lhotka",
  "Kravaře",
];

/**
 * Obce s golfovými hřišti, kde se běžně fituje v reálných podmínkách.
 *
 * Záměrně jen NÁZVY OBCÍ, ne názvy klubů a resortů. Uvést konkrétní klub ve
 * strukturovaných datech by naznačovalo smluvní vazbu na něj — a žádná
 * neexistuje, fitter jezdí tam, kde hraje zákazník. Do `llms.txt` to jde
 * slovně jako popis toho, kde se fituje.
 */
export const ON_COURSE_LOCATIONS: string[] = [
  "Čeladná",
  "Ostravice",
  "Ropice",
  "Šilheřovice",
  "Karviná",
  "Lhotka",
  "Kravaře",
];
