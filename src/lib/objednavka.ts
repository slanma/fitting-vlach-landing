import { createServerFn } from "@tanstack/react-start";
import { products, isPurchasable, unitPrice } from "@/data/eshop";
import { termsHtmlDocument, withdrawalHtmlDocument, TERMS_EFFECTIVE } from "@/data/pravni-texty";
import { ORDER_PREFIX, PAYMENT_DUE_DAYS, deliveryFor, paymentsFor } from "./shop";
import { SITE_URL } from "./site";
import { newOrderNumber } from "./qr-platba";
import { utf8Base64 } from "./qr-png";
import { db, dbConfigured, type OrderLine, type OrderRow } from "./db";
import {
  addContact,
  czk,
  emailConfigured,
  esc,
  linesTable,
  orderInbox,
  sendEmail,
  shippingBlock,
  wrap,
  type Attachment,
} from "./emails";

/**
 * Objednávka z košíku.
 *
 * Běží na serveru: ceny, doprava i platba se počítají z katalogu a nastavení
 * tady — z prohlížeče přijde jen slug, konfigurace, počet kusů a volby.
 * Objednávka se uloží do databáze (je-li nastavená) a odejdou dva e-maily:
 * kopie na info@vapesport.cz a potvrzení zákazníkovi s podmínkami.
 */

type Contact = { name: string; email: string; phone: string; note: string };

export type OrderRequest = Contact & {
  items: { slug: string; qty: number; config: Record<string, string> }[];
  delivery: string;
  payment: string;
  address?: { street: string; city: string; zip: string } | null;
  point?: { id: string; name: string } | null;
  agreedTerms: boolean;
  noMarketing: boolean;
};

export type SubmitResult =
  | { ok: true; order: string; customerNotified: boolean }
  | { ok: false; reason: "nenastaveno" | "neplatne" | "chyba"; message?: string | undefined };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function contact(data: Record<string, unknown>): Contact | null {
  const c = {
    name: str(data["name"], 120),
    email: str(data["email"], 200),
    phone: str(data["phone"], 40),
    note: str(data["note"], 2000),
  };
  if (!c.name || !c.phone || !EMAIL_RE.test(c.email)) return null;
  return c;
}

/** Konfigurace smí obsahovat jen volby a hodnoty, které produkt opravdu nabízí. */
function cleanConfig(slug: string, raw: unknown): Record<string, string> | null {
  const p = products.find((x) => x.slug === slug);
  if (!p || typeof raw !== "object" || raw === null) return null;
  const out: Record<string, string> = {};
  for (const o of p.options) {
    const v = (raw as Record<string, unknown>)[o.label];
    if (typeof v !== "string" || !o.values.includes(v)) return null;
    out[o.label] = v;
  }
  return out;
}

function priceOrder(req: OrderRequest) {
  if (!Array.isArray(req.items) || req.items.length === 0 || req.items.length > 30) return null;
  const lines: OrderLine[] = [];
  for (const it of req.items) {
    const p = products.find((x) => x.slug === it.slug);
    const qty = Math.floor(Number(it.qty));
    const config = cleanConfig(String(it.slug), it.config);
    if (!p || !isPurchasable(p) || !config || !(qty >= 1 && qty <= 20)) return null;
    const unit = unitPrice(p, config);
    if (unit === null) return null;
    lines.push({ slug: p.slug, name: p.name, qty, unit, config, digital: !!p.digital });
  }
  const allDigital = lines.every((l) => l.digital);
  const delivery = deliveryFor(allDigital).find((d) => d.id === req.delivery);
  if (!delivery) return null;
  const payment = paymentsFor(delivery).find((p) => p.id === req.payment);
  if (!payment) return null;

  let address: OrderRow["address"] = null;
  let point: OrderRow["pickup_point"] = null;
  if (delivery.kind === "address") {
    address = {
      street: str(req.address?.street, 160),
      city: str(req.address?.city, 100),
      zip: str(req.address?.zip, 10).replace(/\s/g, ""),
    };
    if (!address.street || !address.city || !/^\d{5}$/.test(address.zip)) return null;
  }
  if (delivery.kind === "point") {
    point = { id: str(req.point?.id, 40), name: str(req.point?.name, 300) };
    if (!point.name) return null;
  }

  const goods = lines.reduce((n, l) => n + l.unit * l.qty, 0);
  return {
    lines,
    delivery,
    payment,
    address,
    point,
    total: goods + delivery.price + payment.fee,
  };
}

export const submitOrder = createServerFn({ method: "POST" })
  .validator((data: OrderRequest) => data)
  .handler(async ({ data }): Promise<SubmitResult> => {
    const c = contact(data as unknown as Record<string, unknown>);
    const priced = priceOrder(data);
    if (!c || !priced || data.agreedTerms !== true) {
      return {
        ok: false,
        reason: "neplatne",
        message: "Objednávku se nepodařilo ověřit. Zkontrolujte prosím údaje a zkuste to znovu.",
      };
    }
    if (!emailConfigured()) return { ok: false, reason: "nenastaveno" };

    const { order, vs } = newOrderNumber(ORDER_PREFIX);
    const inbox = orderInbox();
    const table = linesTable(priced.lines, priced.delivery, priced.payment, priced.total);
    const hasVoucher = priced.lines.some((l) => l.digital);

    // 1) Uložit do databáze — chyba databáze objednávku nezastaví, e-mail je záloha.
    let savedId: string | null = null;
    if (dbConfigured()) {
      try {
        const row = await db.insert<OrderRow>("vf_orders", {
          number: order,
          vs,
          status: "nova",
          customer: c,
          address: priced.address,
          pickup_point: priced.point,
          delivery: {
            id: priced.delivery.id,
            label: priced.delivery.label,
            price: priced.delivery.price,
          },
          payment: { id: priced.payment.id, label: priced.payment.label, fee: priced.payment.fee },
          items: priced.lines,
          total: priced.total,
          no_marketing: !!data.noMarketing,
        });
        savedId = row.id;
      } catch (err) {
        console.error("vf_orders insert", err);
      }
    }

    // 2) Platební údaje se v potvrzení NEPOSÍLAJÍ — stejně jako na vapesport.cz
    //    je pošle obsluha z administrace tlačítkem „Odeslat výzvu k platbě".
    const attachments: Attachment[] = [
      {
        name: `obchodni-podminky-${TERMS_EFFECTIVE.replace(/\s/g, "")}.html`,
        content: utf8Base64(termsHtmlDocument()),
      },
      {
        name: "formular-odstoupeni-od-smlouvy.html",
        content: utf8Base64(withdrawalHtmlDocument(order)),
      },
    ];
    const next = hasVoucher
      ? "Dárkový poukaz vám pošleme e-mailem hned po připsání platby."
      : priced.delivery.kind === "pickup"
        ? "Jakmile bude zboží připravené, dáme vědět a domluvíme vyzvednutí."
        : "Zboží odešleme a pošleme vám číslo zásilky.";

    let payment = "";
    if (priced.payment.id === "prevod") {
      payment = `<h3 style="font-size:15px;margin-top:24px">Platba převodem</h3>
        <p>Objednávku zkontrolujeme a <strong>platební údaje včetně QR kódu vám pošleme v samostatném e-mailu</strong>.
        Splatnost je ${PAYMENT_DUE_DAYS} dní od jeho doručení. ${next}</p>`;
    } else if (priced.payment.id === "dobirka") {
      payment = `<p>Platíte <strong>dobírkou ${czk(priced.total)}</strong> při převzetí zásilky. ${next}</p>`;
    } else {
      payment = `<p>Platíte <strong>hotově ${czk(priced.total)}</strong> při osobním odběru. ${next}</p>`;
    }

    const customerHtml = wrap(`
      <p>Dobrý den, ${esc(c.name)},</p>
      <p>potvrzujeme přijetí vaší objednávky <strong>${order}</strong>. Tímto potvrzením je uzavřena kupní smlouva.</p>
      ${table}
      ${shippingBlock({ delivery: priced.delivery, address: priced.address, pickup_point: priced.point })}
      ${payment}
      <h3 style="font-size:15px;margin-top:24px">Důležité informace</h3>
      <p style="font-size:14px">V příloze najdete obchodní podmínky (účinné od ${TERMS_EFFECTIVE}) a formulář pro odstoupení od smlouvy.
      Od smlouvy můžete odstoupit do 14 dnů od převzetí zboží bez udání důvodu. Podmínky jsou také na
      <a href="${SITE_URL}/obchodni-podminky">${SITE_URL.replace("https://", "")}/obchodni-podminky</a>.</p>
      ${data.noMarketing ? "" : `<p style="font-size:13px;color:#6b6b6b">Občas vám můžeme poslat novinky o obdobném zboží a službách. Odhlásit se můžete kdykoli odkazem v každé zprávě nebo odpovědí na tento e-mail.</p>`}`);

    const adminLink = savedId ? `${SITE_URL}/admin?objednavka=${savedId}` : null;
    const ownerHtml = wrap(`
      <h2>Nová objednávka ${order}</h2>
      ${hasVoucher ? `<p style="background:#faf7ef;border:1px solid #d8c9a3;padding:10px">Obsahuje DÁRKOVÝ POUKAZ — po připsání platby klikni v administraci na „Platba přijata" a poukaz se zákazníkovi pošle sám.</p>` : ""}
      ${table}
      ${shippingBlock({ delivery: priced.delivery, address: priced.address, pickup_point: priced.point })}
      <p><strong>${esc(c.name)}</strong><br>${esc(c.email)}<br>${esc(c.phone)}</p>
      ${c.note ? `<p><strong>Poznámka:</strong> ${esc(c.note)}</p>` : ""}
      <p>Platba: ${esc(priced.payment.label)} · VS ${vs}${priced.payment.id === "prevod" ? " · <strong>Pošli zákazníkovi výzvu k platbě z administrace.</strong>" : ""}</p>
      ${adminLink ? `<p><a href="${adminLink}">Otevřít v administraci</a></p>` : `<p style="color:#a33">Objednávka NENÍ v administraci (databáze nenastavená nebo chyba) — vyřiď ji z tohoto e-mailu.</p>`}
      <p style="color:${data.noMarketing ? "#a33" : "#6b6b6b"}">${
        data.noMarketing
          ? "Zákazník ODMÍTL obchodní sdělení — nepřidávat do newsletteru."
          : "Obchodní sdělení neodmítnuto."
      }</p>`);

    try {
      await sendEmail({
        to: inbox,
        subject: `Nová objednávka ${order} — ${czk(priced.total)}`,
        html: ownerHtml,
        replyTo: { email: c.email, name: c.name },
      });
    } catch (err) {
      // Bez kopie pro obchod by objednávka mohla zapadnout — pokud není ani v DB, je to chyba.
      if (!savedId)
        return {
          ok: false,
          reason: "chyba",
          message: err instanceof Error ? err.message : undefined,
        };
    }

    if (!data.noMarketing) {
      try {
        await addContact(c);
      } catch {
        /* seznam počká, objednávka ne */
      }
    }

    try {
      await sendEmail({
        to: c.email,
        toName: c.name,
        subject: `Potvrzení objednávky ${order} — Vlach Fitting`,
        html: customerHtml,
        attachments,
      });
    } catch {
      return { ok: true, order, customerNotified: false };
    }
    return { ok: true, order, customerNotified: true };
  });
