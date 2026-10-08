/**
 * PRODÁVAJÍCÍ V E-SHOPU — jediné místo, kde se mění.
 *
 * E-shop na vlachfitting.cz provozuje a zboží prodává společnost
 * Vapesport Vlach s.r.o. Fitting jako službu dál poskytuje Ing. Petr Vlach
 * (viz LEGAL_NAME / COMPANY_ID v site.ts — ty patří k fittingu a do
 * strukturovaných dat o fitteru, ne k e-shopu).
 *
 * Odsud se plní obchodní podmínky, formulář pro odstoupení, ochrana
 * osobních údajů, patička, e-maily k objednávkám i schéma produktů.
 * Údaje ověřeny podle obchodního rejstříku (říjen 2026).
 */
export const SELLER = {
  name: "Vapesport Vlach s.r.o.",
  companyId: "05819369",
  vatId: "CZ05819369",
  vatPayer: true,
  /** Sem chodí objednávky, odsud odchází pošta zákazníkům a tímhle se přihlašuje admin. */
  email: "info@vapesport.cz",
  seat: {
    streetAddress: "Paskovská 636/275",
    postalCode: "720 00",
    addressLocality: "Ostrava-Hrabová",
  },
  register:
    "zapsaná v obchodním rejstříku vedeném Krajským soudem v Ostravě, oddíl C, vložka 69479",
} as const;

export const sellerSeatText = () =>
  `${SELLER.seat.streetAddress}, ${SELLER.seat.postalCode} ${SELLER.seat.addressLocality}`;
