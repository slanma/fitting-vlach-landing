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

## 2. E-maily (Resend)

Hotovo v říjnu 2026 — stejný účet Resend jako vapesport.cz, ale vlastní doména a klíč.

1. **Resend → Domains** → `vlachfitting.cz`, region Ireland (eu-west-1).
   DNS záznamy (DKIM `resend._domainkey`, CNAME `send` a `rsend`, DMARC `_dmarc`)
   jsou ve Vercel DNS domény vlachfitting.cz.
2. **Resend → API Keys** → klíč `vlachfitting`, oprávnění **Sending access**,
   doména jen `vlachfitting.cz` → `RESEND_API_KEY`.
3. Odesílatel je `info@vlachfitting.cz`, odpovědi zákazníků chodí na `info@vapesport.cz`
   (na vlachfitting.cz žádná schránka není).
4. Volitelně **Resend → Audiences** → nový seznam „Vlach Fitting zákazníci",
   jeho ID → `RESEND_AUDIENCE_ID`.

## 3. Proměnné na hostingu

Na Vercelu (**projekt fitting-vlach-landing → Environment Variables**) přidej:

| Název | Hodnota |
|---|---|
| `ADMIN_PASSWORD` | z bodu 0 |
| `SUPABASE_URL` | z bodu 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | z bodu 1 |
| `RESEND_API_KEY` | z bodu 2 |
| `RESEND_AUDIENCE_ID` | volitelně, z bodu 2 |

Volitelně: `MAIL_FROM` (výchozí `Vlach Fitting <info@vlachfitting.cz>`),
`ADMIN_EMAILS` (kdo se smí přihlásit, čárkou; výchozí `info@vapesport.cz`)
a `ORDER_INBOX` (kam chodí objednávky a odpovědi; výchozí `info@vapesport.cz`).
Po přidání proměnných vždy **Redeploy**.

Pozor: dokud není nastavený `RESEND_API_KEY`, e-shop objednávky nepřijme (zákazník musí
dostat potvrzení s obchodními podmínkami).

## 4. Údaje v kódu (`src/lib/shop.ts`)

- `PACKETA_WIDGET_KEY` — Klíč API Zásilkovny (nastaveno, stejný účet jako vapesport.cz)
- `COD_FEE` — příplatek za dobírku (nastaveno 50 Kč vč. DPH)

Cena rukavic HIRZL, hodnoty poukazů a fotky produktů jsou v `src/data/eshop.ts`
(fotky se nahrávají do `public/images/eshop/`, postup je v README v té složce).
Výchozí účet v kódu není — účet Ing. Petra Vlacha zadej v administraci (Nastavení → Bankovní účty).
QR a platební údaje se zákazníkovi posílají jen ručně tlačítkem „Odeslat výzvu k platbě“.

## Po prvním přihlášení

Nejdřív v **Nastavení → Bankovní účty** přidej účet Ing. Petra Vlacha (potřebuje připojenou databázi).
Dokud tam žádný účet není, výzvu k platbě nejde odeslat. První účet v seznamu je předvybraný.

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
5. Po převzetí **Doručena**. Fakturu vystavuj v účetnictví Ing. Petra Vlacha (ne Vapesportu).

E-mail zákazníkovi odchází při platbě, odeslání a zrušení — jde vypnout zaškrtávátkem v detailu.

Uplatnění poukazu: **Poukazy** → najdi kód → sniž „Zbývá" → Uložit.

Newslettery a Google Analytics doplníme na konci.
