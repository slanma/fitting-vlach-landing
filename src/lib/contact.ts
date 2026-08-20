/**
 * Kontaktní údaje — jediné místo, kde se mění.
 * Kdekoli v aplikaci importuj odsud, nikde nepiš číslo ani e-mail natvrdo.
 */

export const PHONE_DISPLAY = "+420 606 080 933";
export const PHONE_HREF = "tel:+420606080933";

export const EMAIL = "fitting.vlach@gmail.com";

/** mailto s předvyplněným předmětem — zvyšuje kvalitu poptávek */
export const EMAIL_HREF = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Zájem o osobní konzultaci — fitting",
)}&body=${encodeURIComponent(
  "Dobrý den,\n\nmám zájem o osobní konzultaci.\n\nJméno:\nTelefon:\nHrané hřiště / handicap:\nCo bych chtěl(a) řešit:\n\nDěkuji.",
)}`;
