import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/site/LegalPage";
import { SITE_URL, SITE_NAME, LEGAL_NAME, COMPANY_ID } from "@/lib/site";
import { PHONE_DISPLAY } from "@/lib/contact";
import { SELLER, sellerSeatText } from "@/lib/prodavajici";
import { openCookieSettings } from "@/lib/consent";

const UPDATED = "14. 10. 2026";

export const Route = createFileRoute("/ochrana-osobnich-udaju")({
  head: () => ({
    meta: [
      { title: `Ochrana osobních údajů — ${SITE_NAME}` },
      {
        name: "description",
        content: "Jak Vlach Fitting nakládá s osobními údaji zákazníků.",
      },
      { property: "og:url", content: `${SITE_URL}/ochrana-osobnich-udaju` },
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
          Správcem osobních údajů zpracovávaných prostřednictvím tohoto webu a e-shopu je{" "}
          {SELLER.name}, IČO {SELLER.companyId}, se sídlem {sellerSeatText()}. Kontakt:{" "}
          {SELLER.email}, {PHONE_DISPLAY}.
        </p>
        <p>
          Správce nejmenoval pověřence pro ochranu osobních údajů — vzhledem k rozsahu zpracování to
          zákon nevyžaduje.
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
          Objednávky z e-shopu se ukládají do databáze objednávek, ke které má přístup jen
          prodávající přes chráněnou administraci, a potvrzení odchází e-mailem přes službu Resend.
          Obsah košíku před odesláním objednávky zůstává pouze ve vašem prohlížeči. Pro přihlášení
          do administrace se používá technická cookie, kterou dostává jen obsluha e-shopu, ne
          zákazníci.
        </p>
        <p>
          Domluvíte-li si fitting telefonicky nebo e-mailem, zpracovává údaje, které při tom
          sdělíte, poskytovatel fittingu {LEGAL_NAME}, IČO {COMPANY_ID}, za účelem jednání o smlouvě
          a jejího plnění.
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
          později odkazem pro odhlášení v patičce každé zprávy nebo zprávou na {SELLER.email}.
          Odmítnutí nemá žádný vliv na vyřízení objednávky.
        </p>
        <p>
          Pokud jste u nás dosud nenakoupili, obchodní sdělení vám pošleme jedině s vaším předchozím
          souhlasem. Pro rozesílání vede služba Resend seznam odběratelů (jméno a e-mail); adresu v
          něm uchováváme, dokud odběr neodmítnete.
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
          Zpracovávat je za nás mohou tito zpracovatelé: provozovatel databáze objednávek Supabase
          (data uložená v EU), poskytovatel e-mailové služby Resend (Resend, Inc., USA; e-maily odcházejí přes servery v EU,
          případné předání do USA probíhá na základě standardních smluvních doložek EU),
          poskytovatel hostingu webu, účetní a – pouze s vaším souhlasem s měřením návštěvnosti – Google Ireland Limited (Google Analytics). Při doručení předáváme jméno, telefon, e-mail a
          adresu nebo výdejní místo zvolenému dopravci (PPL CZ s.r.o. nebo Packeta s.r.o. —
          Zásilkovna). Orgánům veřejné moci údaje předáváme jen v rozsahu, který ukládá zákon.
        </p>
        <p>
          Webové stránky jsou provozovány na infrastruktuře poskytovatele hostingu, který zpracovává
          technické provozní údaje (například IP adresu) v rozsahu nezbytném pro provoz a
          zabezpečení webu.
        </p>
      </Section>

      <Section heading="Cookies a měření návštěvnosti">
        <p>
          Obsah košíku, rozpracovaný golfový profil a vaše volba ohledně cookies se ukládají do
          místního úložiště vašeho prohlížeče (nikam se neodesílají). Jde o technicky nezbytnou
          funkci, která nevyžaduje souhlas. Smazat ji můžete kdykoli vymazáním dat webu v
          prohlížeči.
        </p>
        <p>
          Jen s vaším souhlasem používáme Google Analytics 4 k měření návštěvnosti – například kolik
          lidí web navštíví, odkud přišli, které stránky je zajímají a zda kliknuli na telefon nebo
          e-mail. Právním základem je váš souhlas podle čl. 6 odst. 1 písm. a) GDPR. Bez souhlasu se
          měřicí skript vůbec nenačte. Google Analytics ukládá cookies _ga a _ga_* a údaje uchovává
          14 měsíců. Zpracovatelem je Google Ireland Limited; případné předání do USA společnosti
          Google LLC probíhá na základě rámce EU–USA pro ochranu osobních údajů (Data Privacy
          Framework). Údaje nepoužíváme k reklamě ani k profilování.
        </p>
        <p>
          Souhlas můžete kdykoli změnit nebo odvolat:{" "}
          <button
            type="button"
            onClick={openCookieSettings}
            className="underline underline-offset-2 hover:text-foreground"
          >
            Nastavení cookies
          </button>
          . Odvolání nemá vliv na zákonnost měření před ním.
        </p>
        <p>
          Golfový profil a průvodce výběrem hole jsou anonymní — neptají se na jméno ani kontakt a
          nic neodesílají. Odpovědi drží jen váš prohlížeč po dobu návštěvy a po zavření okna se
          smažou. Pokud nám profil sami pošlete e-mailem, zpracujeme ho jako běžnou korespondenci o
          fittingu.
        </p>
      </Section>

      <Section heading="Vaše práva">
        <p>
          Máte právo na přístup k údajům, jejich opravu, výmaz, omezení zpracování a na
          přenositelnost. Uplatnit je můžete na {SELLER.email}. Domníváte-li se, že zpracování
          probíhá v rozporu s předpisy, můžete podat stížnost u Úřadu pro ochranu osobních údajů,
          Pplk. Sochora 27, 170 00 Praha 7, www.uoou.gov.cz.
        </p>
      </Section>
    </LegalPage>
  );
}
