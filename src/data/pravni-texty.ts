/**
 * Obchodní podmínky a vzorový formulář pro odstoupení — JEDINÝ ZDROJ.
 *
 * Z tohohle se vykresluje stránka /obchodni-podminky, stránka
 * /odstoupeni-od-smlouvy i přílohy potvrzovacího e-mailu. Potvrzení
 * objednávky musí obsahovat obchodní podmínky v textové podobě (§ 1824
 * občanského zákoníku), a díky jednomu zdroji se nemůže stát, že zákazník
 * dostane e-mailem jiné znění, než jaké viděl na webu.
 *
 * Při každé věcné změně podmínek posuň TERMS_EFFECTIVE.
 */

import { SITE_URL, LEGAL_NAME, COMPANY_ID, ADDRESS } from "@/lib/site";
import { SELLER, sellerSeatText } from "@/lib/prodavajici";
import { PHONE_DISPLAY } from "@/lib/contact";
import {
  DELIVERY,
  VAT_PAYER,
  VAT_ID_FOR_INVOICES,
  PAYMENT_DUE_DAYS,
  COD_FEE,
  VOUCHER_VALID_MONTHS,
} from "@/lib/shop";

export const TERMS_EFFECTIVE = "7. 10. 2026";

/** Odstavec; `strong` = zvýrazněný (upozornění, které nesmí zapadnout). */
export type Block = { p: string; strong?: boolean } | { ul: string[] };
export type LegalSection = { heading: string; blocks: Block[] };

const fmtCzk = (n: number) => (n === 0 ? "zdarma" : `${n.toLocaleString("cs-CZ")} Kč`);

export function shopAddress(): string | null {
  return ADDRESS
    ? `${ADDRESS.streetAddress}, ${ADDRESS.postalCode} ${ADDRESS.addressLocality}`
    : null;
}

const COI =
  "Česká obchodní inspekce, Ústřední inspektorát – oddělení ADR, Gorazdova 1969/24, 120 00 Praha 2, www.coi.gov.cz";

export function termsSections(): LegalSection[] {
  const shop = shopAddress();
  const vatId = VAT_PAYER && VAT_ID_FOR_INVOICES ? `, DIČ ${VAT_ID_FOR_INVOICES}` : "";

  return [
    {
      heading: "1. Prodávající",
      blocks: [
        {
          p: `${SELLER.name}, se sídlem ${sellerSeatText()}, IČO ${SELLER.companyId}${vatId}, ${SELLER.register}.`,
        },
        {
          p: `Golfový fitting jako samostatnou službu poskytuje ${LEGAL_NAME}, IČO ${COMPANY_ID}; tyto obchodní podmínky se vztahují na prodej zboží v e-shopu.`,
        },
        ...(shop ? [{ p: `Adresa pro osobní odběr, vrácení zboží a reklamace: ${shop}.` }] : []),
        { p: `Kontakt: ${PHONE_DISPLAY}, ${SELLER.email}.` },
        {
          p: `Tyto obchodní podmínky upravují prodej zboží spotřebitelům prostřednictvím e-shopu na adrese ${SITE_URL}. Prodej podnikatelům tento e-shop neumožňuje.`,
        },
      ],
    },
    {
      heading: "2. Skladové zboží a zboží na míru",
      blocks: [
        {
          p: "E-shop nabízí dva druhy zboží. Skladové zboží (příslušenství) má pevnou cenu a objednává se přes košík. Golfové hole stavěné na míru se přes košík neobjednávají a jejich cena se sděluje na dotaz: zákazník kontaktuje prodávajícího telefonicky nebo e-mailem, prodávající s ním projde fitting a konfiguraci a poté mu zašle individuální nabídku s konečnou konfigurací, cenou a dodací lhůtou.",
        },
        {
          p: "Prezentace holí na míru v e-shopu není nabídkou k uzavření smlouvy. Kupní smlouva na hůl stavěnou na míru vzniká až přijetím individuální nabídky zákazníkem.",
        },
      ],
    },
    {
      heading: "3. Objednávka a uzavření smlouvy",
      blocks: [
        {
          p: "Zákazník vloží skladové zboží do košíku, zvolí způsob dodání, vyplní kontaktní údaje a před odesláním si zkontroluje rekapitulaci objednávky včetně celkové ceny. Do okamžiku odeslání může údaje i obsah košíku libovolně měnit a opravovat chyby.",
        },
        {
          p: 'Objednávka se odesílá tlačítkem „Objednat s povinností platby". Odesláním objednávky činí zákazník návrh na uzavření kupní smlouvy. Přijetí objednávky prodávající neprodleně potvrdí e-mailem; kupní smlouva vzniká okamžikem doručení tohoto potvrzení. K potvrzení jsou přiloženy tyto obchodní podmínky a vzorový formulář pro odstoupení od smlouvy.',
        },
        {
          p: "Smlouvu lze uzavřít v českém jazyce. Uzavřená smlouva se archivuje u prodávajícího v elektronické podobě a není přístupná třetím osobám. Náklady na prostředky komunikace na dálku si zákazník hradí sám a neliší se od běžné sazby.",
        },
      ],
    },
    {
      heading: "4. Ceny a platba",
      blocks: [
        {
          p: `${VAT_PAYER ? "Všechny ceny v e-shopu jsou konečné, uvedené v Kč včetně DPH." : "Prodávající není plátcem DPH, ceny jsou konečné."} Cena zboží nezahrnuje cenu fittingu, pokud není výslovně uvedeno jinak. Případná cena dopravy je uvedena v košíku před odesláním objednávky.`,
        },
        {
          p: `Zákazník může zaplatit bankovním převodem nebo QR platbou na účet prodávajícího (platební údaje včetně QR kódu obdrží po kontrole objednávky samostatným e-mailem, splatnost ${PAYMENT_DUE_DAYS} dní od jeho doručení)${COD_FEE !== null ? `, dobírkou při převzetí zásilky od PPL nebo Zásilkovny s příplatkem ${fmtCzk(COD_FEE)}` : ""} nebo hotově při osobním odběru. Dostupné způsoby platby se mohou lišit podle zvoleného způsobu dopravy; aktuální možnosti a případný příplatek jsou vždy uvedeny v košíku. Nezaplatí-li zákazník při platbě převodem ani do ${PAYMENT_DUE_DAYS} dní po splatnosti, může prodávající od smlouvy odstoupit.`,
        },
        {
          p: "Po připsání platby vystaví prodávající daňový doklad a zašle jej zákazníkovi e-mailem.",
        },
        {
          p: "U holí na míru se s objednáním komponent a stavbou začíná až po připsání platby, protože takové zboží nelze nabídnout jinému zákazníkovi.",
        },
      ],
    },
    {
      heading: "5. Dodání",
      blocks: [
        { ul: DELIVERY.map((d) => `${d.label} — ${fmtCzk(d.price)}. ${d.note}`) },
        {
          p: "Skladové zboží odešleme nebo připravíme k vyzvednutí zpravidla do několika pracovních dnů, při platbě převodem od připsání platby; o odeslání nebo připravení zákazníka informujeme e-mailem. Zboží na míru má dodací lhůtu podle dostupnosti komponent, konkrétní termín je uveden v individuální nabídce.",
        },
        {
          p: "Nebezpečí škody na zboží přechází na zákazníka převzetím zboží. Nepřevezme-li zákazník řádně objednanou zásilku (např. na dobírku), kupní smlouva tím nezaniká a prodávající má nárok na náhradu skutečně vynaložených nákladů na doručení a vrácení zásilky; právo spotřebitele odstoupit od smlouvy tím není dotčeno.",
        },
        {
          p: "Vlastnické právo ke zboží přechází na zákazníka zaplacením kupní ceny a převzetím zboží.",
        },
      ],
    },
    {
      heading: "5a. Dárkové poukazy",
      blocks: [
        {
          p: `Dárkový poukaz je hodnotový poukaz vystavený prodávajícím. Lze jej uplatnit u prodávajícího na golfový fitting, stavbu holí na míru i na zboží, a to najednou nebo postupně až do výše jeho hodnoty. Poukaz platí ${VOUCHER_VALID_MONTHS} měsíců ode dne vystavení; datum platnosti je na poukazu uvedeno.`,
        },
        {
          p: "Poukaz zasíláme po připsání platby e-mailem jako odkaz, ze kterého jej lze vytisknout nebo uložit jako PDF. Poukaz není možné vyměnit za hotovost ani za něj vracet peníze při částečném uplatnění; vyšší cenu lze doplatit. Poukaz je přenosný — uplatnit ho může kdokoli, kdo jej předloží.",
        },
        {
          p: "Od koupě poukazu lze odstoupit do 14 dnů od jeho doručení, pokud dosud nebyl uplatněn.",
        },
      ],
    },
    {
      heading: "6. Odstoupení od smlouvy do 14 dnů",
      blocks: [
        {
          p: `Spotřebitel má právo odstoupit od smlouvy uzavřené prostřednictvím e-shopu do 14 dnů ode dne převzetí zboží, a to bez udání důvodu. K dodržení lhůty stačí v jejím průběhu odeslat oznámení o odstoupení na ${SELLER.email}${shop ? ` nebo na adresu provozovny ${shop}` : ""}. Lze využít vzorový formulář na ${SITE_URL}/odstoupeni-od-smlouvy, jeho použití ale není povinné.`,
        },
        {
          p: "Toto právo se nevztahuje na zboží upravené podle přání spotřebitele nebo pro jeho osobu (§ 1837 písm. d) občanského zákoníku) — tedy na golfové hole stavěné na míru podle hodnot z fittingu. Na tuto skutečnost je zákazník upozorněn u produktu a v individuální nabídce před uzavřením smlouvy.",
          strong: true,
        },
        {
          p: "Zboží je třeba vrátit do 14 dnů od odstoupení, nepoškozené a bez známek užívání nad rámec toho, co je nutné k seznámení se s jeho povahou a vlastnostmi. Zboží lze vrátit osobně na provozovně nebo zaslat; náklady na zaslání zboží zpět nese spotřebitel. Za snížení hodnoty zboží v důsledku nakládání nad tento rámec odpovídá spotřebitel.",
        },
        {
          p: "Prodávající vrátí všechny přijaté peněžní prostředky včetně nákladů na dodání ve výši nejlevnějšího nabízeného způsobu dodání do 14 dnů od odstoupení, a to bankovním převodem na účet, ze kterého byla platba provedena, nebo na účet, který spotřebitel uvede. Peníze není povinen vrátit dříve, než mu je zboží předáno nebo spotřebitel prokáže, že je odeslal.",
        },
      ],
    },
    {
      heading: "7. Práva z vadného plnění (reklamace)",
      blocks: [
        {
          p: "Prodávající odpovídá za to, že zboží při převzetí nemá vady. Vadu může spotřebitel vytknout do dvou let od převzetí zboží. Projeví-li se vada v průběhu jednoho roku od převzetí, má se za to, že zboží bylo vadné již při převzetí, ledaže to povaha zboží nebo vady vylučuje.",
        },
        {
          p: "Je-li zboží vadné, může spotřebitel požadovat odstranění vady opravou nebo dodáním nové věci; není-li to možné nebo to prodávající odmítne či neprovede včas, má právo na přiměřenou slevu nebo může od smlouvy odstoupit.",
        },
        {
          p: `Reklamaci lze uplatnit osobně na provozovně${shop ? ` (${shop})` : ""} nebo e-mailem na ${SELLER.email}. Prodávající vydá spotřebiteli při uplatnění reklamace potvrzení s datem uplatnění, obsahem reklamace a požadovaným způsobem vyřízení a po vyřízení potvrzení o datu a způsobu vyřízení, včetně případného odůvodnění zamítnutí.`,
        },
        {
          p: "Reklamaci včetně odstranění vady vyřídí prodávající nejpozději do 30 dnů od jejího uplatnění, pokud se se spotřebitelem nedohodne na delší lhůtě. U oprávněné reklamace nese prodávající i účelně vynaložené náklady spotřebitele spojené s uplatněním reklamace, včetně nákladů na zaslání zboží.",
        },
        {
          p: "Za vadu se nepovažuje běžné opotřebení (např. gripu nebo rukavice), poškození nevhodným užíváním ani změna vlastností způsobená úpravou hole provedenou třetí osobou.",
        },
      ],
    },
    {
      heading: "8. Mimosoudní řešení sporů a dozor",
      blocks: [
        {
          p: `K mimosoudnímu řešení spotřebitelských sporů z kupní smlouvy je příslušná ${COI}. Spotřebitel může návrh podat i elektronicky prostřednictvím webu ČOI.`,
        },
        {
          p: "Dozor nad dodržováním povinností na ochranu spotřebitele vykonává Česká obchodní inspekce, nad ochranou osobních údajů Úřad pro ochranu osobních údajů a nad živnostenským oprávněním příslušný živnostenský úřad.",
        },
      ],
    },
    {
      heading: "9. Obchodní sdělení",
      blocks: [
        {
          p: "Prodávající je oprávněn zasílat zákazníkovi, který u něj zakoupil zboží nebo služby, obchodní sdělení týkající se vlastních obdobných výrobků a služeb na e-mailovou adresu poskytnutou v souvislosti s nákupem, a to na základě § 7 odst. 3 zákona č. 480/2004 Sb., o některých službách informační společnosti.",
        },
        {
          p: `Zákazník může zasílání obchodních sdělení kdykoli bezplatně odmítnout — již při objednávce zaškrtnutím příslušného políčka, později odkazem pro odhlášení v každé zprávě nebo zprávou na ${SELLER.email}. Odmítnutí nemá vliv na vyřízení objednávky.`,
        },
        {
          p: "Osobám, které u prodávajícího dosud nenakoupily, jsou obchodní sdělení zasílána výhradně na základě předchozího souhlasu.",
        },
      ],
    },
    {
      heading: "10. Závěrečná ustanovení",
      blocks: [
        {
          p: "Vztahy neupravené těmito podmínkami se řídí českým právním řádem, zejména zákonem č. 89/2012 Sb., občanský zákoník, a zákonem č. 634/1992 Sb., o ochraně spotřebitele. Prodávající si vyhrazuje právo podmínky měnit; pro smlouvu platí znění účinné v okamžiku odeslání objednávky, které zákazník obdrží jako přílohu potvrzení.",
        },
        { p: `Tyto obchodní podmínky jsou účinné od ${TERMS_EFFECTIVE}.` },
      ],
    },
  ];
}

/**
 * Vzorový formulář podle přílohy nařízení vlády č. 363/2013 Sb.,
 * s předvyplněným adresátem.
 */
export function withdrawalAddressee(): string {
  const shop = shopAddress();
  const ret = shop && shop !== sellerSeatText() ? `; adresa pro vrácení zboží: ${shop}` : "";
  return `${SELLER.name}, IČO ${SELLER.companyId}, ${sellerSeatText()}${ret}; e-mail ${SELLER.email}`;
}

export const WITHDRAWAL_FIELDS = [
  "Oznamuji/oznamujeme (*), že tímto odstupuji/odstupujeme (*) od smlouvy o nákupu tohoto zboží (*)/o poskytnutí těchto služeb (*):",
  "Číslo objednávky:",
  "Datum objednání (*)/datum obdržení (*):",
  "Jméno a příjmení spotřebitele/spotřebitelů:",
  "Adresa spotřebitele/spotřebitelů:",
  "Číslo bankovního účtu pro vrácení peněz (nepovinné):",
  "Podpis spotřebitele/spotřebitelů (pouze pokud je tento formulář zasílán v listinné podobě):",
  "Datum:",
];

// ---------------------------------------------------------------------------
// Samostatné HTML dokumenty pro přílohy e-mailu
// ---------------------------------------------------------------------------

function esc(v: string): string {
  return v
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function doc(title: string, body: string): string {
  return `<!doctype html><html lang="cs"><head><meta charset="utf-8"><title>${esc(title)}</title>
<style>body{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1c1c1c;line-height:1.6;max-width:720px;margin:2rem auto;padding:0 1rem}h1{font-size:1.4rem}h2{font-size:1rem;margin-top:1.6rem}.f{border-bottom:1px solid #999;min-height:2.2rem;margin:.4rem 0 1rem}</style>
</head><body>${body}</body></html>`;
}

export function termsHtmlDocument(): string {
  const body = termsSections()
    .map(
      (s) =>
        `<h2>${esc(s.heading)}</h2>` +
        s.blocks
          .map((b) =>
            "ul" in b
              ? `<ul>${b.ul.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>`
              : `<p>${b.strong ? `<strong>${esc(b.p)}</strong>` : esc(b.p)}</p>`,
          )
          .join(""),
    )
    .join("");
  return doc(
    "Obchodní podmínky",
    `<h1>Obchodní podmínky e-shopu Vlach Fitting</h1><p>${esc(SELLER.name)}, IČO ${SELLER.companyId}</p><p>Účinné od ${TERMS_EFFECTIVE}</p>${body}`,
  );
}

export function withdrawalHtmlDocument(order?: string): string {
  const fields = WITHDRAWAL_FIELDS.map((f) =>
    f === "Číslo objednávky:" && order
      ? `<p>${esc(f)} <strong>${esc(order)}</strong></p>`
      : `<p>${esc(f)}</p><div class="f"></div>`,
  ).join("");
  return doc(
    "Formulář pro odstoupení od smlouvy",
    `<h1>Vzorový formulář pro odstoupení od smlouvy</h1>
<p><em>(vyplňte tento formulář a pošlete jej zpět pouze v případě, že chcete odstoupit od smlouvy)</em></p>
<h2>Oznámení o odstoupení od smlouvy</h2>
<p><strong>Adresát:</strong> ${esc(withdrawalAddressee())}</p>${fields}
<p><small>(*) Nehodící se škrtněte nebo údaje doplňte.</small></p>`,
  );
}
