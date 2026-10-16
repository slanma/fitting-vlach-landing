/**
 * E-maily přes Resend (doména vlachfitting.cz ověřená v účtu Resend, region EU).
 *
 * Proměnné prostředí (Vercel → Environment Variables):
 *   RESEND_API_KEY      Resend → API Keys, oprávnění „Sending access" jen pro vlachfitting.cz.
 *   MAIL_FROM           odesílatel; výchozí „Vlach Fitting <info@vlachfitting.cz>".
 *                       Musí být na doméně ověřené v Resendu.
 *   ORDER_INBOX         kam chodí kopie objednávek a odpovědi zákazníků;
 *                       výchozí info@vapesport.cz.
 *   RESEND_AUDIENCE_ID  seznam pro obchodní sdělení (Resend → Audiences);
 *                       když chybí, kontakty se nezapisují.
 */

import { SITE_URL, ADDRESS } from "./site";
import { SELLER, sellerSeatText } from "./prodavajici";
import { PHONE_DISPLAY } from "./contact";
import { VAT_PAYER } from "./shop";
import type { OrderLine, OrderRow } from "./db";

const env = (k: string) => process.env[k];

const DEFAULT_FROM = "Vlach Fitting <info@vlachfitting.cz>";

export const emailConfigured = () => !!env("RESEND_API_KEY");
export const orderInbox = () => env("ORDER_INBOX") || SELLER.email;

/** content = base64 */
export type Attachment = { name: string; content: string };

/** „Jméno <adresa>" bez znaků, které by rozbily hlavičku. */
const addr = (email: string, name?: string) => {
  const clean = (name ?? "").replace(/["<>\r\n]/g, "").trim();
  return clean ? `${clean} <${email}>` : email;
};

async function resend(path: string, body: unknown): Promise<void> {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env("RESEND_API_KEY") ?? ""}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Resend ${res.status}: ${detail.slice(0, 200)}`);
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
  const reply = m.replyTo ?? { email: orderInbox(), name: "Vlach Fitting" };
  await resend("/emails", {
    from: env("MAIL_FROM") || DEFAULT_FROM,
    to: [addr(m.to, m.toName)],
    subject: m.subject,
    html: m.html,
    reply_to: addr(reply.email, reply.name),
    ...(m.attachments?.length
      ? { attachments: m.attachments.map((a) => ({ filename: a.name, content: a.content })) }
      : {}),
  });
}

/** Zápis do seznamu pro obchodní sdělení — jen když zákazník neodmítl. */
export async function addContact(c: { name: string; email: string }): Promise<void> {
  const audience = env("RESEND_AUDIENCE_ID");
  if (!audience) return;
  const parts = c.name.split(/\s+/);
  await resend(`/audiences/${encodeURIComponent(audience)}/contacts`, {
    email: c.email,
    first_name: parts.slice(0, -1).join(" ") || parts[0] || "",
    last_name: parts.length > 1 ? parts[parts.length - 1]! : "",
    unsubscribed: false,
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

// Barvy a písmo podle webu (styles.css → hex, protože e-maily neumí oklch).
const C = {
  page: "#f7f3eb", // sand
  card: "#fdfcf9",
  ink: "#1a1510",
  text: "#231e19",
  muted: "#68625a",
  gold: "#a87d40",
  goldSoft: "#e0cfac",
  border: "#e2ded5",
  alert: "#9b3a2e",
};
const SANS = `'DM Sans','Helvetica Neue',Helvetica,Arial,sans-serif`;
const DISPLAY = `'Space Grotesk','Helvetica Neue',Helvetica,Arial,sans-serif`;

const P_STYLE = `margin:0 0 14px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.text}`;
const H2_STYLE = `margin:0 0 16px;font-family:${DISPLAY};font-size:22px;font-weight:500;line-height:1.3;color:${C.ink}`;
const H3_STYLE = `margin:28px 0 10px;font-family:${DISPLAY};font-size:12px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${C.gold}`;

/**
 * Šablony píšou obyčejné <p>, <h2>, <h3> — tady dostanou jednotný vzhled,
 * ať se styl mění na jednom místě. Vlastní style="" u <p> se zachová a doplní.
 */
const styleTags = (html: string) =>
  html
    .replace(/<p>/g, `<p style="${P_STYLE}">`)
    .replace(/<p style="([^"]*)">/g, (m, extra: string) =>
      extra.startsWith("margin:0 0 14px") ? m : `<p style="${P_STYLE};${extra.replace(/#6b6b6b/g, C.muted)}">`,
    )
    .replace(/<h2>/g, `<h2 style="${H2_STYLE}">`)
    .replace(/<h3(?: style="[^"]*")?>/g, `<h3 style="${H3_STYLE}">`)
    .replace(/<a href=/g, `<a style="color:${C.gold};text-decoration:underline" href=`)
    .replace(/<ul>/g, `<ul style="margin:0 0 14px;padding-left:20px;font-family:${SANS};font-size:15px;line-height:1.7;color:${C.text}">`);

/** Zvýrazněný rámeček (číslo objednávky, upozornění). */
export const note = (inner: string, tone: "gold" | "alert" = "gold") =>
  `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-collapse:collapse">
    <tr><td style="background:${tone === "gold" ? C.page : "#fbf1ee"};border-left:3px solid ${tone === "gold" ? C.gold : C.alert};padding:14px 18px;font-family:${SANS};font-size:14px;line-height:1.6;color:${tone === "gold" ? C.text : C.alert}">${inner}</td></tr>
  </table>`;

export const wrap = (inner: string, preheader = "") => `<!doctype html>
<html lang="cs"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light only"><meta name="supported-color-schemes" content="light">
<title>Vlach Fitting</title></head>
<body style="margin:0;padding:0;background:${C.page}">
${preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent">${esc(preheader)}</div>` : ""}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.page};border-collapse:collapse">
  <tr><td align="center" style="padding:32px 12px">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;border-collapse:collapse">
      <tr><td style="padding:0 4px 18px">
        <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse"><tr>
          <td style="padding-right:14px;border-right:1px solid ${C.goldSoft};font-family:${DISPLAY};font-size:22px;font-weight:500;color:${C.ink};letter-spacing:1px">VF</td>
          <td style="padding-left:14px">
            <div style="font-family:${DISPLAY};font-size:13px;font-weight:600;letter-spacing:3px;color:${C.ink}">VLACH FITTING</div>
            <div style="font-family:${SANS};font-size:10px;letter-spacing:2.5px;color:${C.gold}">GOLF FITTING</div>
          </td>
        </tr></table>
      </td></tr>
      <tr><td style="background:${C.card};border:1px solid ${C.border};border-top:3px solid ${C.gold};padding:36px 32px 28px">
        ${styleTags(inner)}
      </td></tr>
      <tr><td style="padding:22px 8px 0">${foot()}</td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

const foot = () => `<p style="margin:0;font-family:${SANS};font-size:12px;line-height:1.7;color:${C.muted};text-align:center">
  <a href="${SITE_URL}" style="color:${C.gold};text-decoration:none;letter-spacing:1px">www.vlachfitting.cz</a> · ${esc(PHONE_DISPLAY)}<br>
  ${esc(SELLER.name)}, IČO ${SELLER.companyId}${VAT_PAYER ? `, DIČ ${SELLER.vatId}` : ""}<br>
  sídlo ${esc(sellerSeatText())} · ${esc(SELLER.email)}</p>`;

/** Provozovna — sem chodí zákazníci (odběr, vrácení, reklamace). */
const shopText = () =>
  ADDRESS ? `${ADDRESS.streetAddress}, ${ADDRESS.postalCode} ${ADDRESS.addressLocality}` : sellerSeatText();

export function linesTable(
  lines: OrderLine[],
  delivery: { label: string; price: number },
  payment: { label: string; fee: number },
  total: number,
) {
  const cell = `font-family:${SANS};font-size:14px;line-height:1.5;color:${C.text};padding:12px 0;border-bottom:1px solid ${C.border};vertical-align:top`;
  const row = (a: string, b: string) =>
    `<tr><td style="${cell}">${a}</td><td style="${cell};text-align:right;white-space:nowrap;padding-left:16px">${b}</td></tr>`;
  const items = lines
    .map((l) =>
      row(
        `<strong style="font-weight:500;color:${C.ink}">${esc(l.name)}</strong> × ${l.qty}${
          Object.keys(l.config).length
            ? `<br><span style="color:${C.muted};font-size:13px">${esc(cfgText(l.config))}</span>`
            : ""
        }`,
        czk(l.unit * l.qty),
      ),
    )
    .join("");
  const totalCell = `font-family:${DISPLAY};font-size:17px;font-weight:600;color:${C.ink};padding:16px 0 4px`;
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 20px;border-top:1px solid ${C.ink}">
    ${items}
    ${row(esc(delivery.label), delivery.price ? czk(delivery.price) : "zdarma")}
    ${payment.fee ? row(esc(payment.label), czk(payment.fee)) : ""}
    <tr><td style="${totalCell}">Celkem${VAT_PAYER ? ` <span style="font-family:${SANS};font-size:13px;font-weight:400;color:${C.muted}">včetně DPH</span>` : ""}</td>
        <td style="${totalCell};text-align:right;white-space:nowrap">${czk(total)}</td></tr>
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

type VoucherInfo = { code: string; value: number; valid_until: string; purpose?: string | null };

const voucherList = (vouchers: VoucherInfo[]) =>
  vouchers.length
    ? `<h3 style="font-size:15px;margin-top:20px">Vaše dárkové poukazy</h3>
       <p>Poukaz otevřete odkazem níže — můžete ho vytisknout nebo uložit jako PDF a darovat.</p>
       <ul>${vouchers
         .map(
           (v) =>
             `<li><a href="${voucherUrl(v.code)}">${esc(v.code)}</a> — ${czk(v.value)}${v.purpose && v.purpose !== "Cokoli z nabídky" ? ` na ${esc(v.purpose.toLowerCase())}` : ""}, platí do ${new Date(v.valid_until).toLocaleDateString("cs-CZ")}</li>`,
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
        <strong>${esc(shopText())}</strong>.</p>
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
