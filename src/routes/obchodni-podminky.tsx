import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/site/LegalPage";
import { SITE_URL, SITE_NAME, LEGAL_NAME, COMPANY_ID, ADDRESS, REGISTERED_SEAT } from "@/lib/site";
import { EMAIL, PHONE_DISPLAY } from "@/lib/contact";
import { DELIVERY, VAT_PAYER, VAT_ID_FOR_INVOICES, PAYMENT_DUE_DAYS } from "@/lib/shop";

const UPDATED = "20. 8. 2026";

export const Route = createFileRoute("/obchodni-podminky")({
  head: () => ({
    meta: [
      { title: `Obchodní podmínky — ${SITE_NAME}` },
      { name: "description", content: "Obchodní podmínky e-shopu Vlach Fitting." },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/obchodni-podminky` }],
  }),
  component: Page,
});

function Page() {
  const seat = REGISTERED_SEAT;

  return (
    <LegalPage title="Obchodní podmínky" updated={UPDATED}>
      <Section heading="1. Prodávající">
        <p>
          {LEGAL_NAME}, IČO {COMPANY_ID}
          {VAT_PAYER && VAT_ID_FOR_INVOICES ? `, DIČ ${VAT_ID_FOR_INVOICES}` : ""}, podnikající
          fyzická osoba zapsaná v živnostenském rejstříku.
        </p>
        <p>
          Sídlo:{" "}
          {seat ? (
            `${seat.streetAddress}, ${seat.postalCode} ${seat.addressLocality}`
          ) : (
            <strong className="text-destructive">[DOPLNIT SÍDLO PODLE REJSTŘÍKU]</strong>
          )}
        </p>
        {ADDRESS && (
          <p>
            Provozovna a adresa pro vrácení zboží: {ADDRESS.streetAddress}, {ADDRESS.postalCode}{" "}
            {ADDRESS.addressLocality}
          </p>
        )}
        <p>
          Kontakt: {PHONE_DISPLAY}, {EMAIL}
        </p>
        <p>
          Tyto podmínky upravují prodej zboží spotřebitelům prostřednictvím e-shopu na adrese{" "}
          {SITE_URL}. Prodej podnikatelům (B2B) tento e-shop neumožňuje.
        </p>
      </Section>

      <Section heading="2. Objednávka a uzavření smlouvy">
        <p>
          Zboží si vyberete v e-shopu, vložíte do košíku a odešlete objednávku. Odesláním objednávky
          činíte návrh na uzavření kupní smlouvy. Smlouva vzniká až okamžikem, kdy vám prodávající
          objednávku potvrdí e-mailem nebo telefonicky.
        </p>
        <p>
          U holí stavěných na míru potvrzení obsahuje konečnou konfiguraci a konečnou cenu. Ceny
          uvedené u těchto položek jsou orientační („od") a vycházejí z hodnot naměřených při
          fittingu.
        </p>
        <p>Objednávku lze uzavřít pouze v českém jazyce. Smlouva se archivuje u prodávajícího.</p>
      </Section>

      <Section heading="3. Ceny a platba">
        <p>
          {VAT_PAYER
            ? "Všechny ceny v e-shopu jsou uvedeny včetně DPH."
            : "Prodávající není plátcem DPH, ceny jsou konečné."}{" "}
          Cena zboží nezahrnuje cenu fittingu, pokud není výslovně uvedeno jinak.
        </p>
        <p>
          Platba probíhá bankovním převodem na účet prodávajícího. Po potvrzení objednávky obdržíte
          platební údaje včetně QR kódu a variabilního symbolu. Splatnost je {PAYMENT_DUE_DAYS} dní
          od potvrzení objednávky.
        </p>
        <p>
          U zboží stavěného na míru se s výrobou začíná až po připsání platby, protože takové zboží
          nelze nabídnout jinému zákazníkovi.
        </p>
      </Section>

      <Section heading="4. Dodání">
        <ul className="list-disc space-y-1 pl-5">
          {DELIVERY.map((d) => (
            <li key={d.id}>
              {d.label} — {d.price === 0 ? "zdarma" : `${d.price} Kč`}. {d.note}
            </li>
          ))}
        </ul>
        <p>
          Skladové zboží je připraveno zpravidla do několika pracovních dnů. Zboží stavěné na míru
          má dodací lhůtu podle dostupnosti komponent; konkrétní termín sdělíme při potvrzení
          objednávky.
        </p>
      </Section>

      <Section heading="5. Odstoupení od smlouvy do 14 dnů">
        <p>
          Jako spotřebitel máte právo odstoupit od smlouvy uzavřené na dálku do 14 dnů ode dne
          převzetí zboží, a to bez udání důvodu. Odstoupení stačí v této lhůtě odeslat na {EMAIL}{" "}
          nebo na adresu provozovny.
        </p>
        <p>
          <strong className="text-ink">
            Toto právo se nevztahuje na zboží upravené podle vašeho přání nebo pro vaši osobu
          </strong>{" "}
          — tedy na hole stavěné na míru podle hodnot z fittingu (§ 1837 občanského zákoníku). Na
          tuto skutečnost jste upozorněni v košíku i u produktu ještě před odesláním objednávky.
        </p>
        <p>
          Zboží vraťte nepoškozené a bez známek užívání nad rámec vyzkoušení. Náklady na vrácení
          zboží nesete vy. Peníze vám vrátíme do 14 dnů od odstoupení, nejdříve však po obdržení
          zboží zpět nebo po prokázání, že jste je odeslali.
        </p>
      </Section>

      <Section heading="6. Práva z vadného plnění a reklamace">
        <p>
          Prodávající odpovídá za to, že zboží při převzetí nemá vady. U spotřebního zboží můžete
          vadu vytknout do dvou let od převzetí. Projeví-li se vada během prvního roku, má se za to,
          že zboží bylo vadné již při převzetí.
        </p>
        <p>
          Reklamaci uplatněte na {EMAIL} nebo osobně na provozovně. Prodávající ji vyřídí včetně
          odstranění vady do 30 dnů, pokud se nedohodnete na delší lhůtě.
        </p>
        <p>
          Za vadu se nepovažuje běžné opotřebení, poškození nevhodným užíváním ani změna vlastností
          způsobená úpravou hole provedenou třetí osobou.
        </p>
      </Section>

      <Section heading="7. Mimosoudní řešení sporů">
        <p>
          K mimosoudnímu řešení spotřebitelských sporů je příslušná Česká obchodní inspekce,
          Štěpánská 796/44, 110 00 Praha 1, www.coi.cz. Spotřebitel může využít rovněž platformu pro
          řešení sporů online provozovanou Evropskou komisí.
        </p>
      </Section>

      <Section heading="8. Obchodní sdělení">
        <p>
          Prodávající je oprávněn zasílat kupujícímu, který u něj zakoupil zboží nebo služby,
          obchodní sdělení týkající se vlastních obdobných výrobků a služeb na e-mailovou adresu
          poskytnutou v souvislosti s nákupem, a to na základě § 7 odst. 3 zákona č. 480/2004 Sb., o
          některých službách informační společnosti.
        </p>
        <p>
          Kupující má právo zasílání obchodních sdělení kdykoli bezplatně odmítnout, a to jak při
          uzavření smlouvy, tak při zaslání každé jednotlivé zprávy — prostřednictvím odkazu pro
          odhlášení v patičce e-mailu nebo zprávou na {EMAIL}.
        </p>
        <p>
          Osobám, které u prodávajícího dosud nenakoupily, jsou obchodní sdělení zasílána výhradně
          na základě předchozího souhlasu.
        </p>
      </Section>

      <Section heading="9. Závěrečná ustanovení">
        <p>
          Vztahy neupravené těmito podmínkami se řídí českým právním řádem, zejména zákonem č.
          89/2012 Sb., občanský zákoník, a zákonem č. 634/1992 Sb., o ochraně spotřebitele.
          Prodávající si vyhrazuje právo podmínky měnit; pro objednávku platí znění účinné v
          okamžiku jejího odeslání.
        </p>
      </Section>
    </LegalPage>
  );
}
