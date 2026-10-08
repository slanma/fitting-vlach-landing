import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { products, isPurchasable, unitPrice, type Product } from "@/data/eshop";

/**
 * Košík drží jen skladové zboží s pevnou cenou. Hole na míru mají „Cena
 * na dotaz" a kontakt, do košíku se nedají vložit.
 *
 * V localStorage se ukládá pouze slug, konfigurace a počet kusů. Název
 * a cena se při každém načtení berou z katalogu — jinak by zákazník mohl
 * objednat za cenu, která už neplatí.
 */

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  price: number;
  digital: boolean;
  config: Record<string, string>;
  qty: number;
};

type StoredItem = { slug: string; config: Record<string, string>; qty: number };

type CartApi = {
  items: CartItem[];
  count: number;
  total: number;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, config: Record<string, string>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartApi | null>(null);
const STORAGE_KEY = "fv-kosik-v2";
export const MAX_QTY = 20;

/** Klíč položky = produkt + konkrétní konfigurace, aby se různé varianty nesčítaly. */
const itemKey = (slug: string, config: Record<string, string>) =>
  slug +
  "|" +
  Object.entries(config)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join(",");

/** Spojí uložené položky s aktuálním katalogem; neprodejné zahodí. */
function hydrate(stored: StoredItem[]): CartItem[] {
  const out: CartItem[] = [];
  for (const s of stored) {
    const p = products.find((x) => x.slug === s.slug);
    if (!p || !isPurchasable(p)) continue;
    const qty = Math.min(Math.max(Math.floor(Number(s.qty) || 0), 0), MAX_QTY);
    const price = unitPrice(p, s.config ?? {});
    if (qty <= 0 || price === null) continue;
    out.push({
      key: itemKey(p.slug, s.config),
      slug: p.slug,
      name: p.name,
      price,
      digital: !!p.digital,
      config: s.config,
      qty,
    });
  }
  return out;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  // Načtení až po připojení, jinak by se rozešel server a klient při SSR.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(hydrate(JSON.parse(raw) as StoredItem[]));
      // Starý formát košíku (v1) mohl obsahovat hole na míru — zahodit.
      window.localStorage.removeItem("fv-kosik-v1");
    } catch {
      /* poškozený obsah ignorujeme, košík začne prázdný */
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      const stored: StoredItem[] = items.map(({ slug, config, qty }) => ({ slug, config, qty }));
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    } catch {
      /* privátní režim nebo plné úložiště — košík funguje dál v paměti */
    }
  }, [items, loaded]);

  const api = useMemo<CartApi>(() => {
    return {
      items,
      open,
      setOpen,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.price * i.qty, 0),
      add(product, config, qty = 1) {
        const price = unitPrice(product, config);
        if (!isPurchasable(product) || price === null) return;
        const key = itemKey(product.slug, config);
        setItems((prev) => {
          const found = prev.find((i) => i.key === key);
          if (found) {
            return prev.map((i) =>
              i.key === key ? { ...i, qty: Math.min(i.qty + qty, MAX_QTY) } : i,
            );
          }
          return [
            ...prev,
            {
              key,
              slug: product.slug,
              name: product.name,
              price,
              digital: !!product.digital,
              config,
              qty,
            },
          ];
        });
        setOpen(true);
      },
      setQty(key, qty) {
        setItems((prev) =>
          qty <= 0
            ? prev.filter((i) => i.key !== key)
            : prev.map((i) => (i.key === key ? { ...i, qty: Math.min(qty, MAX_QTY) } : i)),
        );
      },
      remove(key) {
        setItems((prev) => prev.filter((i) => i.key !== key));
      },
      clear() {
        setItems([]);
      },
    };
  }, [items, open]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCart(): CartApi {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCart musí být uvnitř <CartProvider>");
  return ctx;
}
