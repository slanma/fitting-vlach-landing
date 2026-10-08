import { getCookie } from "@tanstack/react-start/server";
import { SELLER } from "./prodavajici";

/**
 * Přihlášení admina — jen pro server. Soubor `.server.ts` se nikdy nedostane
 * do prohlížeče; používá se výhradně uvnitř serverových funkcí.
 */

export const COOKIE = "vf_admin";
export const SESSION_DAYS = 30;

const env = (k: string) => process.env[k];

export const allowedEmails = () =>
  (env("ADMIN_EMAILS") || SELLER.email)
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

/** Heslo do administrace z proměnné ADMIN_PASSWORD (min. 10 znaků). */
export const adminPassword = () => {
  const p = env("ADMIN_PASSWORD") ?? "";
  return p.length >= 10 ? p : null;
};

/**
 * Klíč pro podpis přihlášení. Když není nastavený ADMIN_SESSION_SECRET,
 * odvodí se z hesla — stačí tak jediná proměnná. Změnou hesla se zároveň
 * odhlásí všichni přihlášení.
 */
export const secret = () => {
  const s = env("ADMIN_SESSION_SECRET") ?? "";
  if (s.length >= 32) return s;
  const p = adminPassword();
  return p ? `vf-admin-session::${p}` : null;
};

export async function hmac(data: string, key: string): Promise<string> {
  const k = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/** Porovnání bez úniku informace přes čas odpovědi. */
export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

/** Vrátí e-mail přihlášeného admina, nebo null. Použij v každé admin funkci. */
export async function currentAdmin(): Promise<string | null> {
  const key = secret();
  const raw = getCookie(COOKIE);
  if (!key || !raw) return null;
  const [email64, exp, sig] = raw.split(".");
  if (!email64 || !exp || !sig) return null;
  if (Number(exp) < Date.now()) return null;
  const expected = await hmac(`${email64}.${exp}`, key);
  if (!safeEqual(sig, expected)) return null;
  const email = atob(email64);
  return allowedEmails().includes(email) ? email : null;
}

export async function requireAdmin(): Promise<string> {
  const who = await currentAdmin();
  if (!who) throw new Error("NEPRIHLASEN");
  return who;
}
