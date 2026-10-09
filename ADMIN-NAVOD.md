# Vlach Fitting — nastavení e-shopu a administrace

Všechno je v bezplatných tarifech. Dá se to zapojovat postupně — administrace
vždycky nahoře ukáže, co ještě chybí.

## 0. Nejdřív: přístup do administrace (5 minut)

Stačí jediná proměnná, bez databáze i bez e-mailů:

1. **Vercel → projekt vlachfitting → Settings → Environment Variables**
2. Přidej `ADMIN_PASSWORD` = heslo, které budete s Petrem používat (aspoň 10 znaků),
   Environment: Production (a klidně i Preview) → **Save**.
3. **Deployments → u posledního nasazení ⋯ → Redeploy** (proměnné se načtou až po novém nasazení).
4. Otevři **www.vlachfitting.cz/admin** → e-mail `info@vapesport.cz` + heslo → přihlášení platí 30 dní.

Změnou hesla na Vercelu (a Redeploy) se odhlásí všichni přihlášení.

## 1. Databáze (Supabase)

1. Na https://supabase.com se přihlas stejným účtem jako u vapesport.cz.
2. Buď použij projekt vapesport.cz (tabulky mají prefix `vf_`, nic se nepotká),
   nebo založ nový projekt — **region Frankfurt (EU)**.
3. **SQL Editor → New query** → vlož celý soubor `supabase/vlachfitting.sql` → **Run**.
4. **Project Settings → API** si opiš:
   - Project URL → `SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (tajný, nikam neposílat)

## 2. E-maily (Brevo)

1. Účet zdarma na https://www.brevo.com (300 e-mailů denně).
2. **Senders, Domains & Dedicated IPs → Domains → Add a domain** → `vapesport.cz`.
   Brevo ukáže 2–3 DNS záznamy (DKIM, Brevo code, DMARC) — přidej je u správce
   DNS domény vapesport.cz. Záznamy pro Resend tam nech, oba se snesou.
3. **Senders → Add a sender** → `info@vapesport.cz`, jméno „Vlach Fitting".
4. **SMTP & API → API Keys → Generate** → `BREVO_API_KEY`
   (pozor: API klíč, ne SMTP heslo).
5. Volitelně **Contacts → Lists** → nový seznam „Vlach Fitting zákazníci",
   jeho číslo → `BREVO_LIST_ID`.

## 3. Proměnné na hostingu

Na Vercelu (**Settings → Environment Variables**) přidej:

| Název | Hodnota |
|---|---|
| `SUPABASE_URL` | z bodu 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | z bodu 1 |
| `BREVO_API_KEY` | z bodu 2 |
| `BREVO_FROM_EMAIL` | `info@vapesport.cz` |
| `BREVO_LIST_ID` | volitelně, z bodu 2 |

Volitelně: `ADMIN_EMAILS` (kdo se smí přihlásit, čárkou; výchozí `info@vapesport.cz`)
a `ORDER_INBOX` (kam chodí objednávky; výchozí `info@vapesport.cz`).
Po přidání proměnných vždy **Redeploy**.

Pozor: dokud není zapojené Brevo, e-shop objednávky nepřijme (zákazník musí dostat
potvrzení s obchodními podmínkami). Proto Brevo zapoj dřív, než e-shop zveřejníš.

## 4. Údaje v kódu (`src/lib/shop.ts`)

- `PACKETA_WIDGET_KEY` — Klíč API Zásilkovny (nastaveno, stejný účet jako vapesport.cz)
- `COD_FEE` — příplatek za dobírku (nastaveno 50 Kč vč. DPH)

Cena rukavic HIRZL, hodnoty poukazů a fotky produktů jsou v `src/data/eshop.ts`
(fotky se nahrávají do `public/images/eshop/`, postup je v README v té složce).
Výchozí účet je Fio CZ32 2010 0000 0029 0117 4453 — v administraci ho jde kdykoli změnit.
QR a platební údaje se zákazníkovi posílají jen ručně tlačítkem „Odeslat výzvu k platbě“.

## Po prvním přihlášení

Účet Fio je nastavený rovnou v kódu, takže QR platby fungují hned. V **Nastavení → Bankovní účty**
ho můžeš změnit nebo přidat další; první účet v seznamu je předvybraný ve výzvě k platbě.

## Jak se vyřizuje objednávka

Stavy jsou stejné jako na vapesport.cz: **Nová → Zpracovává se → Odesláno → Doručena** (případně **Zrušena**).
Kliknutím na objednávku v seznamu se otevře detail.

1. Přijde e-mail „Nová objednávka" na info@vapesport.cz s odkazem do administrace.
2. **Převod:** zákazník v potvrzení objednávky platební údaje NEDOSTANE (stejně jako na vapesport.cz).
   Zkontroluj objednávku, vyber účet a klikni **Odeslat výzvu k platbě** → zákazníkovi přijde e-mail
   s účtem, VS, částkou, splatností a QR kódem v příloze. Po připsání platby klikni **Platba přijata** → stav se přepne na „Zpracovává se", zákazník dostane
   e-mail a u poukazu se poukaz vystaví a pošle sám.
3. **PPL / Zásilkovna:** vlož číslo zásilky → **Odesláno** → zákazník dostane e-mail se sledováním.
4. **Osobní odběr:** tlačítko se jmenuje **Připraveno k vyzvednutí** → zákazník dostane e-mail s adresou.
5. Po převzetí **Doručena**. Fakturu vystavuj jako dosud v účetnictví Vapesportu.

E-mail zákazníkovi odchází při platbě, odeslání a zrušení — jde vypnout zaškrtávátkem v detailu.

Uplatnění poukazu: **Poukazy** → najdi kód → sniž „Zbývá" → Uložit.

Newslettery a Google Analytics doplníme na konci.
