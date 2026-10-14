// Souhlas s cookies + Google Analytics 4 (Consent Mode v2, základní režim).
// gtag.js se načte AŽ po souhlasu s analytikou; bez souhlasu se do Googlu nic neposílá.

export const GA_ID = "G-ESR56KX22W";
export const CONSENT_KEY = "vf-cookie-consent";
export const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000; // po roce se zeptáme znovu
export const OPEN_SETTINGS_EVENT = "vf:open-cookie-settings";

export type Consent = { analytics: boolean; ts: number };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    __vfGaLoaded?: boolean;
  }
}

/** Inline skript do <head>: výchozí stav "bez souhlasu", při dřívějším souhlasu rovnou načte GA. */
export const GA_INIT_SCRIPT = `(function(){
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments);}
window.gtag=gtag;
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
gtag('js',new Date());
gtag('config','${GA_ID}');
var ok=false;
try{var c=JSON.parse(localStorage.getItem('${CONSENT_KEY}')||'null');
ok=!!(c&&c.analytics===true&&typeof c.ts==='number'&&Date.now()-c.ts<${CONSENT_MAX_AGE_MS});}catch(e){}
if(ok&&location.pathname.indexOf('/admin')!==0){
gtag('consent','update',{analytics_storage:'granted'});
var s=document.createElement('script');s.async=true;
s.src='https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
document.head.appendChild(s);window.__vfGaLoaded=true;}
})();`;

export function readConsent(): Consent | null {
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const c = JSON.parse(raw);
    if (typeof c?.analytics !== "boolean" || typeof c?.ts !== "number") return null;
    if (Date.now() - c.ts > CONSENT_MAX_AGE_MS) return null;
    return c as Consent;
  } catch {
    return null;
  }
}

export function saveConsent(analytics: boolean): Consent {
  const c: Consent = { analytics, ts: Date.now() };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(c));
  } catch {
    /* prohlížeč úložiště blokuje – volba platí jen do obnovení stránky */
  }
  if (analytics) {
    window.gtag?.("consent", "update", { analytics_storage: "granted" });
    loadGa();
  } else {
    window.gtag?.("consent", "update", { analytics_storage: "denied" });
    clearGaCookies();
  }
  return c;
}

function loadGa() {
  if (window.__vfGaLoaded) return;
  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
  window.__vfGaLoaded = true;
}

function clearGaCookies() {
  const host = location.hostname;
  const bare = host.replace(/^www\./, "");
  document.cookie
    .split(";")
    .map((p) => p.split("=")[0].trim())
    .filter((n) => n === "_ga" || n.startsWith("_ga_"))
    .forEach((n) => {
      for (const domain of ["", `; domain=${host}`, `; domain=.${bare}`]) {
        document.cookie = `${n}=; Max-Age=0; path=/${domain}`;
      }
    });
}

/** Otevře nastavení cookies (odkaz v patičce, tlačítko v Ochraně osobních údajů). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_SETTINGS_EVENT));
}

/** Událost pro GA – kliknutí na telefon nebo e-mail. Bez souhlasu se nic neodešle. */
export function trackContactClick(method: "phone" | "email") {
  window.gtag?.("event", "contact_click", { method, page_path: location.pathname });
}
