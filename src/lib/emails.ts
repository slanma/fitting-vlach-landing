/**
 * E-maily přes Brevo (bezplatný tarif: 300 e-mailů denně).
 *
 * Proměnné prostředí:
 *   BREVO_API_KEY     Brevo → SMTP & API → API Keys (API klíč, NE SMTP klíč).
 *   BREVO_FROM_EMAIL  odesílatel; výchozí info@vapesport.cz. Doména musí být
 *                     v Brevo ověřená (Senders, Domains & Dedicated IPs → Domains),
 *                     jinak Brevo odesílatele přepíše na svou doménu.
 *   BREVO_FROM_NAME   jméno odesílatele, výchozí „Vlach Fitting".
 *   ORDER_INBOX       kam chodí kopie objednávek; výchozí info@vapesport.cz.
 *   BREVO_LIST_ID     seznam pro obchodní sdělení; když chybí, kontakty se nezapisují.
 */

import { SITE_URL } from "./site";
import { SELLER, sellerSeatText } from "./prodavajici";
import { PHONE_DISPLAY } from "./contact";
import { VAT_PAYER } from "./shop";
import type { OrderLine, OrderRow } from "./db";

const env = (k: string) => process.env[k];

export const emailConfigured = () => !!env("BREVO_API_KEY");
export const orderInbox = () => env("ORDER_INBOX") || SELLER.email;

export type Attachment = { name: string; content: string };

async function brevo(path: string, body: unknown): Promise<void> {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: {
      "api-key": env("BREVO_API_KEY") ?? "",
      "Content-Type": "application/json",
      accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Brevo ${res.status}: ${detail.slice(0, 200)}`);
  }
}

export async function sendEmail(m: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
  attachments?: Attachment[];
}): Promise<void> {
  await brevo("/smtp/email", {
    sender: {
      email: env("BREVO_FROM_EMAIL") || SELLER.email,
      name: env("BREVO_FROM_NAME") || "Vlach Fitting",
    },
    to: [{ email: m.to, ...(m.toName ? { name: m.toName } : {}) }],
    subject: m.subject,
    htmlContent: m.html,
    replyTo: m.replyTo ?? { email: orderInbox(), name: "Vlach Fitting" },
    ...(m.attachments?.length ? { attachment: m.attachments } : {}),
  });
}

/** Zápis do seznamu pro obchodní sdělení — jen když zákazník neodmítl. */
export async function addContact(c: { name: string; email: string }): Promise<void> {
  const listId = Number(env("BREVO_LIST_ID"));
  if (!Number.isFinite(listId) || listId <= 0) return;
  const parts = c.name.split(/\s+/);
  await brevo("/contacts", {
    email: c.email,
    attributes: {
      FIRSTNAME: parts.slice(0, -1).join(" ") || parts[0] || "",
      LASTNAME: parts.length > 1 ? parts[parts.length - 1]! : "",
    },
    listIds: [listId],
    updateEnabled: true,
  });
}

// ---------------------------------------------------------------------------
// Šablony
// ---------------------------------------------------------------------------

export const esc = (v: string) =>
  v.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const czk = (n: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK" }).format(n);

const cfgText = (c: Record<string, string>) =>
  Object.entries(c)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

export const wrap = (inner: string) =>
  `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1c1c1c;line-height:1.6;max-width:640px">${inner}${foot()}</div>`;

const foot = () => `<p style="color:#6b6b6b;font-size:13px;margin-top:24px">
  Vlach Fitting · ${esc(SELLER.name)}, IČO ${SELLER.companyId}, DIČ ${SELLER.vatId}<br>
  ${esc(sellerSeatText())} · ${esc(PHONE_DISPLAY)} · ${esc(SELLER.email)}</p>`;

export function linesTable(
  lines: OrderLine[],
  delivery: { label: string; price: number },
  payment: { label: string; fee: number },
  total: number,
) {
  const row = (a: string, b: string, bold = false) =>
    `<tr><td style="padding:6px 0;${bold ? "font-weight:600" : ""}">${a}</td><td style="padding:6px 0;text-align:right;white-space:nowrap;${bold ? "font-weight:600" : ""}">${b}</td></tr>`;
  const items = lines
    .map((l) =>
      row(
        `${esc(l.name)} × ${l.qty}${
          Object.keys(l.config).length
            ? `<br><span style="color:#6b6b6b;font-size:13px">${esc(cfgText(l.config))}</span>`
            : ""
        }`,
        czk(l.unit * l.qty),
      ),
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;border-top:1px solid #ddd;border-bottom:1px solid #ddd">
    ${items}
    ${row(esc(delivery.label), delivery.price ? czk(delivery.price) : "zdarma")}
    ${payment.fee ? row(esc(payment.label), czk(payment.fee)) : ""}
    ${row(`Celkem${VAT_PAYER ? " včetně DPH" : ""}`, czk(total), true)}
  </table>`;
}

export function shippingBlock(o: Pick<OrderRow, "delivery" | "address" | "pickup_point">) {
  if (o.address)
    return `<p><strong>Doručovací adresa:</strong> ${esc(o.address.street)}, ${esc(o.address.zip)} ${esc(o.address.city)}</p>`;
  if (o.pickup_point)
    return `<p><strong>Výdejní místo:</strong> ${esc(o.pickup_point.name)}${o.pickup_point.id ? ` (ID ${esc(o.pickup_point.id)})` : ""}</p>`;
  return "";
}

export const voucherUrl = (code: string) => `${SITE_URL}/poukaz/${encodeURIComponent(code)}`;

// ---------------------------------------------------------------------------
// E-maily z administrace
// ---------------------------------------------------------------------------

type VoucherInfo = { code: string; value: number; valid_until: string };

const voucherList = (vouchers: VoucherInfo[]) =>
  vouchers.length
    ? `<h3 style="font-size:15px;margin-top:20px">Vaše dárkové poukazy</h3>
       <p>Poukaz otevřete odkazem níže — můžete ho vytisknout nebo uložit jako PDF a darovat.</p>
       <ul>${vouchers
         .map(
           (v) =>
             `<li><a href="${voucherUrl(v.code)}">${esc(v.code)}</a> — ${czk(v.value)}, platí do ${new Date(v.valid_until).toLocaleDateString("cs-CZ")}</li>`,
         )
         .join("")}</ul>`
    : "";

/** Po označení „Platba přijata". */
export function paidEmail(o: OrderRow, vouchers: VoucherInfo[]) {
  const physical = o.items.some((i) => !i.digital);
  return {
    subject: `Platbu jsme přijali — objednávka ${o.number}`,
    html: wrap(`<p>Dobrý den, ${esc(o.customer.name)},</p>
      <p>děkujeme, platbu za objednávku <strong>${esc(o.number)}</strong> jsme přijali.</p>
      ${voucherList(vouchers)}
      ${physical ? `<p>Zboží připravujeme a dáme vědět, jakmile bude ${o.delivery.id === "osobni" ? "připravené k vyzvednutí" : "odeslané"}.</p>` : ""}
      <p style="font-size:13px;color:#6b6b6b">Daňový doklad vám pošleme samostatně e-mailem.</p>`),
  };
}

/** Výzva k platbě s QR kódem (stejně jako na vapesport.cz). */
export function paymentRequestEmail(
  o: OrderRow,
  account: { name: string; account: string; iban: string },
  due: Date,
) {
  return {
    subject: `Výzva k platbě — objednávka ${o.number}`,
    html: wrap(`<p>Dobrý den, ${esc(o.customer.name)},</p>
      <p>posíláme platební údaje k objednávce <strong>${esc(o.number)}</strong>.</p>
      <p>Účet: <strong>${esc(account.account)}</strong><br>
         IBAN: ${esc(account.iban)}<br>
         Variabilní symbol: <strong>${esc(o.vs)}</strong><br>
         Částka: <strong>${czk(Number(o.total))}</strong><br>
         Splatnost: ${due.toLocaleDateString("cs-CZ")}</p>
      <p style="font-size:13px;color:#6b6b6b">QR kód pro mobilní bankovnictví je v příloze.
      ${o.items.some((i) => i.digital) ? "Dárkový poukaz vám pošleme hned po připsání platby." : "Po připsání platby zboží připravíme."}</p>`),
  };
}

/** Při změně stavu na Odesláno / Zrušena. Ostatní stavy e-mail neposílají. */
export function statusEmail(
  o: OrderRow,
  status: "odeslano" | "zrusena",
): { subject: string; html: string } {
  const hello = `<p>Dobrý den, ${esc(o.customer.name)},</p>`;
  if (status === "odeslano" && o.delivery.id === "osobni") {
    return {
      subject: `Objednávka ${o.number} je připravená k vyzvednutí`,
      html: wrap(`${hello}
        <p>vaše objednávka <strong>${esc(o.number)}</strong> je připravená k vyzvednutí na adrese
        <strong>${esc(sellerSeatText())}</strong>.</p>
        <p>Než přijedete, zavolejte prosím na ${esc(PHONE_DISPLAY)} — domluvíme čas.
        ${o.payment.id === "hotove" ? `Zaplatíte na místě ${czk(Number(o.total))}.` : ""}</p>`),
    };
  }
  if (status === "odeslano") {
    const carrier = o.delivery.id === "ppl" ? "PPL" : "Zásilkovnou";
    const site = o.delivery.id === "ppl" ? "www.ppl.cz" : "www.zasilkovna.cz";
    return {
      subject: `Objednávka ${o.number} je na cestě`,
      html: wrap(`${hello}
        <p>vaši objednávku <strong>${esc(o.number)}</strong> jsme odeslali ${carrier}.</p>
        ${o.tracking ? `<p>Číslo zásilky: <strong>${esc(o.tracking)}</strong> — zásilku můžete sledovat na ${site}.</p>` : ""}
        ${o.payment.id === "dobirka" ? `<p>Při převzetí zaplatíte dobírkou <strong>${czk(Number(o.total))}</strong>.</p>` : ""}
        ${shippingBlock(o)}`),
    };
  }
  return {
    subject: `Objednávka ${o.number} byla zrušena`,
    html: wrap(`${hello}
      <p>objednávku <strong>${esc(o.number)}</strong> jsme zrušili.
      ${o.paid_at ? "Přijatou platbu vám vrátíme do 14 dnů na účet, ze kterého byla odeslána." : ""}</p>
      <p>Pokud jde o nedorozumění, odpovězte prosím na tento e-mail nebo zavolejte na ${esc(PHONE_DISPLAY)}.</p>`),
  };
}
