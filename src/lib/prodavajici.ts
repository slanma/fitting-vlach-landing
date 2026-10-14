/**
 * PRODÁVAJÍCÍ V E-SHOPU — jediné místo, kde se mění.
 *
 * E-shop na vlachfitting.cz provozuje a zboží prodává Ing. Petr Vlach,
 * fyzická osoba podnikající, plátce DPH (od října 2026; předtím
 * Vapesport Vlach s.r.o.). Fitting poskytuje tatáž osoba.
 *
 * Odsud se plní obchodní podmínky, formulář pro odstoupení, ochrana
 * osobních údajů, patička webu i e-mailů, QR platby a poukazy.
 *
 * SÍDLO vs. PROVOZOVNA: sídlo (místo podnikání) musí být v obchodních
 * podmínkách a GDPR. Osobní odběr, vrácení zboží a reklamace jsou na
 * provozovně — ta je v site.ts (ADDRESS). Zákazníky nikdy neposílej do sídla.
 *
 * DIČ fyzické osoby je odvozené od rodného čísla — patří do obchodních
 * podmínek, na doklady a do patičky e-mailů, ale NE do strukturovaných dat.
 */
export const SELLER = {
  name: "Ing. Petr Vlach",
  companyId: "46121706",
  vatId: "CZ6306141941",
  vatPayer: true,
  /** Sem chodí objednávky a odpovědi zákazníků, tímhle se přihlašuje admin. */
  email: "info@vapesport.cz",
  seat: {
    streetAddress: "Tichá 302",
    postalCode: "739 34",
    addressLocality: "Šenov",
  },
  register: "fyzická osoba podnikající",
} as const;

export const sellerSeatText = () =>
  `${SELLER.seat.streetAddress}, ${SELLER.seat.postalCode} ${SELLER.seat.addressLocality}`;
