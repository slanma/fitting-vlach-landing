/**
 * Jediný zdroj FAQ. Čte z toho jak sekce na stránce, tak JSON-LD (FAQPage).
 *
 * Google vyžaduje, aby se schéma doslova shodovalo s viditelným textem.
 * Proto se text mění TADY — nikdy jen v komponentě nebo jen ve schématu.
 */
export const faq = [
  {
    q: "Jak dlouho setkání trvá?",
    a: "Kompletní hloubkový fitting zabere zhruba tři hodiny. Nespěcháme — bez dostatku ran nejsou data spolehlivá.",
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
] as const;
