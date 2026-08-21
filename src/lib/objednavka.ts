import { createServerFn } from "@tanstack/react-start";

/**
 * Odeslání objednávky přes Brevo.
 *
 * Běží na serveru, takže se API klíč nikdy nedostane do prohlížeče.
 * Brevo voláme obyčejným `fetch`, aby projekt nepotřeboval žádnou knihovnu
 * navíc — jedna závislost méně, o kterou se může rozbít nasazení.
 *
 * Nastavení na Vercelu (Settings → Environment Variables):
 *   BREVO_API_KEY     klíč z Brevo → SMTP & API → API Keys.
 *                     POZOR: API klíč, ne SMTP klíč — jsou to dvě různé věci.
 *   BREVO_FROM_EMAIL  odesílatel, např. objednavky@vlachfitting.cz.
 *                     Doména musí být v Brevo ověřená přes DKIM, jinak Brevo
 *                     odesílatele přepíše na vlastní doménu.
 *   BREVO_FROM_NAME   jméno odesílatele, výchozí „Vlach Fitting".
 *   ORDER_INBOX       kam chodí kopie objednávek; výchozí fitting.vlach@gmail.com.
 *   BREVO_LIST_ID     číslo seznamu kontaktů pro newsletter. Když chybí,
 *                     kontakty se nezapisují a objednávky fungují dál.
 */

export type OrderItemInput = {
  name: string;
  qty: number;
  config: Record<string, string>;
};

export type OrderInput = {
  order: string;
  name: string;
  email: string;
  phone: string;
  note: string;
  delivery: string;
  total: number;
  items: OrderItemInput[];
  madeToOrder: boolean;
  /** Zákazník si nepřeje obchodní sdělení. */
  noMarketing: boolean;
};

const FALLBACK_INBOX = "fitting.vlach@gmail.com";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function itemLines(items: OrderItemInput[]): string {
  return items
    .map((i) => {
      const cfg = Object.entries(i.config)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ");
      return `<li>${escapeHtml(i.name)} × ${i.qty}${cfg ? ` <span style="color:#6b6b6b">(${escapeHtml(cfg)})</span>` : ""}</li>`;
    })
    .join("");
}

function customerHtml(o: OrderInput): string {
  const promise = o.madeToOrder
    ? `<p style="background:#faf7ef;border:1px solid #d8c9a3;padding:12px;border-radius:2px">
         Objednávka obsahuje zboží stavěné na míru. Nejdřív spolu projdeme konfiguraci
         a potvrdíme konečnou cenu — <strong>teprve potom vám pošleme platební údaje</strong>.
         Zatím prosím nic neplaťte.
       </p>`
    : `<p>Platební údaje včetně QR kódu vám pošleme spolu s potvrzením dostupnosti.</p>`;

  return `<div style="font-family:system-ui,-apple-system,'Segoe UI',sans-serif;color:#1c1c1c;line-height:1.6">
    <p>Dobrý den, ${escapeHtml(o.name)},</p>
    <p>děkujeme za objednávku <strong>${escapeHtml(o.order)}</strong>. Ozveme se vám a potvrdíme dostupnost i termín.</p>
    <ul>${itemLines(o.items)}</ul>
    <p><strong>Doprava:</strong> ${escapeHtml(o.delivery)}<br>
       <strong>Celkem:</strong> ${o.total.toFixed(2)} Kč</p>
    ${promise}
    <p style="color:#6b6b6b;font-size:13px">
      Vlach Fitting · Paskovská 636/275, 720 00 Ostrava-Hrabová<br>
      +420 606 080 933 · ${FALLBACK_INBOX}
    </p>
  </div>`;
}

function ownerHtml(o: OrderInput): string {
  return `<div style="font-family:system-ui,sans-serif;color:#1c1c1c;line-height:1.6">
    <h2>Nová objednávka ${escapeHtml(o.order)}</h2>
    <ul>${itemLines(o.items)}</ul>
    <p><strong>Doprava:</strong> ${escapeHtml(o.delivery)}<br>
       <strong>Celkem:</strong> ${o.total.toFixed(2)} Kč</p>
    <hr>
    <p><strong>${escapeHtml(o.name)}</strong><br>
       ${escapeHtml(o.email)}<br>
       ${escapeHtml(o.phone)}</p>
    ${o.note ? `<p><strong>Poznámka:</strong> ${escapeHtml(o.note)}</p>` : ""}
    <p style="color:${o.noMarketing ? "#a33" : "#6b6b6b"}">
      ${o.noMarketing ? "Zákazník si NEPŘEJE obchodní sdělení — nedávat do newsletteru." : "Souhlas s obchodními sděleními neodmítnut."}
    </p>
  </div>`;
}

async function brevo(path: string, body: unknown): Promise<void> {
  const res = await fetch(`https://api.brevo.com/v3${path}`, {
    method: "POST",
    headers: {
      "api-key": process.env["BREVO_API_KEY"] ?? "",
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

async function sendEmail(payload: {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  replyTo?: { email: string; name?: string };
}): Promise<void> {
  await brevo("/smtp/email", {
    sender: {
      email: process.env["BREVO_FROM_EMAIL"],
      name: process.env["BREVO_FROM_NAME"] || "Vlach Fitting",
    },
    to: [{ email: payload.to, ...(payload.toName ? { name: payload.toName } : {}) }],
    subject: payload.subject,
    htmlContent: payload.html,
    ...(payload.replyTo ? { replyTo: payload.replyTo } : {}),
  });
}

/**
 * Zapíše zákazníka do seznamu pro newsletter. Volá se jedině tehdy,
 * když zákazník odběr neodmítl. Selhání se ignoruje — objednávka je důležitější
 * než marketingový seznam.
 */
async function addContact(o: OrderInput): Promise<void> {
  const listId = Number(process.env["BREVO_LIST_ID"]);
  if (!Number.isFinite(listId) || listId <= 0) return;

  const parts = o.name.trim().split(/\s+/);
  const first = parts.slice(0, -1).join(" ") || parts[0] || "";
  const last = parts.length > 1 ? parts[parts.length - 1]! : "";

  await brevo("/contacts", {
    email: o.email,
    attributes: { FIRSTNAME: first, LASTNAME: last, SMS: o.phone },
    listIds: [listId],
    updateEnabled: true,
  });
}

export const sendOrder = createServerFn({ method: "POST" })
  .validator((data: OrderInput) => data)
  .handler(async ({ data }): Promise<{ ok: boolean; reason?: string }> => {
    const apiKey = process.env["BREVO_API_KEY"];
    const from = process.env["BREVO_FROM_EMAIL"];
    const inbox = process.env["ORDER_INBOX"] || FALLBACK_INBOX;

    // Bez nastavení se nic neposílá — košík si pak poradí sám.
    if (!apiKey || !from) return { ok: false, reason: "nenastaveno" };

    try {
      // Nejdřív kopie pro obchod. Ta je důležitější — objednávka se nesmí ztratit.
      await sendEmail({
        to: inbox,
        subject: `Nová objednávka ${data.order}`,
        html: ownerHtml(data),
        replyTo: { email: data.email, name: data.name },
      });
    } catch (err) {
      return { ok: false, reason: err instanceof Error ? err.message : "chyba" };
    }

    // Zápis do seznamu jen se souhlasem; případná chyba objednávku neshodí.
    if (!data.noMarketing) {
      try {
        await addContact(data);
      } catch {
        /* seznam počká, objednávka ne */
      }
    }

    try {
      await sendEmail({
        to: data.email,
        toName: data.name,
        subject: `Potvrzení objednávky ${data.order}`,
        html: customerHtml(data),
        replyTo: { email: inbox },
      });
    } catch {
      // Zákazníkovi potvrzení nedorazilo, ale objednávku už máme.
      return { ok: true, reason: "potvrzeni-nedoruceno" };
    }

    return { ok: true };
  });
