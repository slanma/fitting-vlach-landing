import { createServerFn } from "@tanstack/react-start";
import { setCookie, deleteCookie } from "@tanstack/react-start/server";
import { dbConfigured } from "./db";
import { emailConfigured } from "./emails";
import {
  COOKIE,
  SESSION_DAYS,
  adminPassword,
  allowedEmails,
  currentAdmin,
  hmac,
  safeEqual,
  secret,
} from "./admin-session.server";

/**
 * Přihlášení do administrace: e-mail + heslo → přihlášení na 30 dní.
 *
 * Funguje hned po nastavení jediné proměnné na hostingu, bez databáze
 * i bez e-mailů:
 *   ADMIN_PASSWORD   heslo (min. 10 znaků), společné pro Martina i Petra
 *   ADMIN_EMAILS     kdo se smí přihlásit, čárkou; výchozí info@vapesport.cz
 * Volitelně ADMIN_SESSION_SECRET (min. 32 znaků) — jinak se klíč odvodí z hesla.
 */

export type AdminSetup = { canLogin: boolean; missing: { key: string; what: string }[] };

/** Co ještě chybí zapojit — administrace to ukáže místo nesrozumitelné chyby. */
export const adminSetup = createServerFn({ method: "GET" }).handler(
  async (): Promise<AdminSetup> => {
    const missing: { key: string; what: string }[] = [];
    if (!dbConfigured())
      missing.push({
        key: "SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY",
        what: "databáze — bez ní se objednávky neukládají do administrace",
      });
    if (!emailConfigured())
      missing.push({
        key: "BREVO_API_KEY",
        what: "e-maily — bez nich nechodí potvrzení zákazníkům ani objednávky na info@vapesport.cz",
      });
    return { canLogin: !!adminPassword(), missing };
  },
);

export const whoAmI = createServerFn({ method: "GET" }).handler(async () => ({
  email: await currentAdmin(),
}));

export const login = createServerFn({ method: "POST" })
  .validator((d: { email: string; password: string }) => d)
  .handler(async ({ data }): Promise<{ ok: boolean; message?: string }> => {
    const email = String(data.email ?? "")
      .trim()
      .toLowerCase();
    const password = String(data.password ?? "");
    const expected = adminPassword();
    const key = secret();
    if (!expected || !key) {
      return {
        ok: false,
        message: "Heslo do administrace ještě není nastavené (proměnná ADMIN_PASSWORD).",
      };
    }
    const ok =
      allowedEmails().includes(email) &&
      safeEqual(await hmac(password, key), await hmac(expected, key));
    if (!ok) {
      // Zpomalení zkoušení hesel.
      await new Promise((r) => setTimeout(r, 1200));
      return { ok: false, message: "Nesprávný e-mail nebo heslo." };
    }
    const exp = Date.now() + SESSION_DAYS * 86_400_000;
    const email64 = btoa(email);
    const sig = await hmac(`${email64}.${exp}`, key);
    setCookie(COOKIE, `${email64}.${exp}.${sig}`, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_DAYS * 86_400,
    });
    return { ok: true };
  });

export const logout = createServerFn({ method: "POST" }).handler(async () => {
  deleteCookie(COOKIE, { path: "/" });
  return { ok: true };
});
