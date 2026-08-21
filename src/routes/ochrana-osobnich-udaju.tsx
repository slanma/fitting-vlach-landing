import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/site/LegalPage";
import { SITE_URL, SITE_NAME, LEGAL_NAME, COMPANY_ID, ADDRESS } from "@/lib/site";
import { EMAIL, PHONE_DISPLAY } from "@/lib/contact";

const UPDATED = "20. 8. 2026";

export const Route = createFileRoute("/ochrana-osobnich-udaju")({
  head: () => ({
    meta: [
      { title: `Ochrana osobních údajů — ${SITE_NAME}` },
      {
        name: "description",
        content: "Jak Vlach Fitting nakládá s osobními údaji zákazníků.",
      },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/ochrana-osobnich-udaju` }],
  }),
  component: Page,
});

function Page() {
  return (
    <LegalPage title="Ochrana osobních údajů" updated={UPDATED}>
      <Section heading="Kdo údaje zpracovává">
        <p>
          Správcem osobních údajů je {LEGAL_NAME}, IČO {COMPANY_ID}
          {ADDRESS
            ? `, provozovna ${ADDRESS.streetAddress}, ${ADDRESS.postalCode} ${ADDRESS.addressLocality}`
            : ""}
          . Kontakt: {EMAIL}, {PHONE_DISPLAY}.
        </p>
        <p>
          Prodávající nejmenoval pověřence pro ochranu osobních údajů — vzhledem k rozsahu
          zpracování to zákon nevyžaduje.
        </p>
      </Section>

      <Section heading="Jaké údaje a proč">
        <p>
          Při objednávce zpracováváme jméno a příjmení, e-mail, telefon a případnou poznámku, kterou
          sami vyplníte. Slouží k vyřízení objednávky, komunikaci o ní a ke splnění zákonných
          povinností — právním základem je plnění smlouvy podle čl. 6 odst. 1 písm. b) GDPR a plnění
          právní povinnosti podle písm. c).
        </p>
        <p>
          Objednávka se z e-shopu odesílá e-mailem.{" "}
          <strong className="text-ink">Web žádnou databázi zákazníků neprovozuje</strong> a vámi
          zadané údaje neukládá na server. Obsah košíku zůstává pouze ve vašem prohlížeči.
        </p>
        <p>
          Domluvíte-li si fitting telefonicky nebo e-mailem, zpracováváme údaje, které nám při tom
          sdělíte, za účelem jednání o smlouvě a jejího plnění.
        </p>
      </Section>

      <Section heading="Obchodní sdělení">
        <p>
          Pokud u nás nakoupíte, můžeme vám na e-mail, který jste uvedli u objednávky, posílat
          informace o vlastních obdobných výrobcích a službách. Právním základem je oprávněný zájem
          správce podle čl. 6 odst. 1 písm. f) GDPR ve spojení s § 7 odst. 3 zákona č. 480/2004 Sb.
        </p>
        <p>
          Odběr můžete kdykoli zdarma odmítnout — už při objednávce zaškrtnutím příslušného políčka,
          později odkazem pro odhlášení v patičce každé zprávy nebo zprávou na {EMAIL}. Odmítnutí
          nemá žádný vliv na vyřízení objednávky.
        </p>
        <p>
          Pokud jste u nás dosud nenakoupili, obchodní sdělení vám pošleme jedině s vaším předchozím
          souhlasem. E-mailovou adresu pro tento účel uchováváme, dokud odběr neodmítnete.
        </p>
      </Section>

      <Section heading="Jak dlouho je uchováváme">
        <p>
          Údaje z objednávek uchováváme po dobu trvání smlouvy a dále po dobu, kterou ukládají
          daňové a účetní předpisy — u daňových dokladů zpravidla 10 let. Korespondenci, ze které
          nevznikla objednávka, mažeme, jakmile pomine důvod, pro který vznikla.
        </p>
      </Section>

      <Section heading="Komu je předáváme">
        <p>
          Osobní údaje neprodáváme ani nepředáváme třetím stranám pro marketingové účely.
          Zpřístupněny mohou být pouze poskytovateli e-mailové služby, účetnímu a orgánům veřejné
          moci v rozsahu, který ukládá zákon.
        </p>
        <p>
          Webové stránky jsou provozovány na infrastruktuře poskytovatele hostingu, který zpracovává
          technické provozní údaje (například IP adresu) v rozsahu nezbytném pro provoz a
          zabezpečení webu.
        </p>
      </Section>

      <Section heading="Cookies">
        <p>
          Web nepoužívá analytické, marketingové ani profilovací cookies a nesleduje chování
          návštěvníků. Obsah košíku se ukládá do místního úložiště vašeho prohlížeče, aby vám při
          obnovení stránky nezmizel; jde o technicky nezbytnou funkci, kterou jste si vyžádali, a
          nevyžaduje souhlas. Smazat ji můžete kdykoli vymazáním dat webu v prohlížeči.
        </p>
      </Section>

      <Section heading="Vaše práva">
        <p>
          Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování a na
          přenositelnost. Uplatnit je můžete na {EMAIL}. Domníváte-li se, že zpracování probíhá v
          rozporu s předpisy, můžete podat stížnost u Úřadu pro ochranu osobních údajů, Pplk.
          Sochora 27, 170 00 Praha 7, www.uoou.gov.cz.
        </p>
      </Section>
    </LegalPage>
  );
}
