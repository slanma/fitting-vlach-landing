import { Link } from "@tanstack/react-router";
import { SITE_NAME, ADDRESS, LEGAL_NAME, COMPANY_ID } from "@/lib/site";
import { EMAIL, EMAIL_HREF, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contact";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-3 md:px-10">
        <div>
          <span className="font-display text-lg text-ink">FV</span>
          <p className="mt-2 font-display text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {SITE_NAME}
          </p>
          {ADDRESS && (
            <address className="mt-4 not-italic text-xs leading-relaxed text-muted-foreground">
              {ADDRESS.streetAddress}
              <br />
              {ADDRESS.postalCode} {ADDRESS.addressLocality}
            </address>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {LEGAL_NAME}
            {COMPANY_ID ? `, IČO ${COMPANY_ID}` : ""}
          </p>
        </div>

        <div>
          <span className="label-tech">Kontakt</span>
          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li>
              <a href={PHONE_HREF} className="hover:text-ink">
                {PHONE_DISPLAY}
              </a>
            </li>
            <li>
              <a href={EMAIL_HREF} className="hover:text-ink">
                {EMAIL}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <span className="label-tech">Informace</span>
          <ul className="mt-4 space-y-2 text-xs text-muted-foreground">
            <li>
              <Link to="/eshop" className="hover:text-ink">
                E-shop
              </Link>
            </li>
            <li>
              <Link to="/obchodni-podminky" className="hover:text-ink">
                Obchodní podmínky
              </Link>
            </li>
            <li>
              <Link to="/ochrana-osobnich-udaju" className="hover:text-ink">
                Ochrana osobních údajů
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-5 md:px-10">
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}
          </span>
        </div>
      </div>
    </footer>
  );
}
