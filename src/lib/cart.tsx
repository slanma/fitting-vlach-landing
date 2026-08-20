import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Product } from "@/data/eshop";

export type CartItem = {
  key: string;
  slug: string;
  name: string;
  price: number;
  priceFrom: boolean;
  madeToOrder: boolean;
  config: Record<string, string>;
  qty: number;
};

type CartApi = {
  items: CartItem[];
  count: number;
  total: number;
  hasMadeToOrder: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (p: Product, config: Record<string, string>, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartApi | null>(null);
const STORAGE_KEY = "fv-kosik-v1";

/** Klíč položky = produkt + konkrétní konfigurace, aby se různé varianty nesčítaly. */
const itemKey = (slug: string, config: Record<string, string>) =>
  slug +
  "|" +
  Object.entries(config)
    .sort()
    .map(([k, v]) => `${k}=${v}`)
    .join(",");

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  // Načtení až po připojení, jinak by se rozešel server a klient při SSR.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw) as CartItem[]);
    } catch {
      /* poškozený obsah ignorujeme, košík začne prázdný */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* privátní režim nebo plné úložiště — košík funguje dál v paměti */
    }
  }, [items]);

  const api = useMemo<CartApi>(() => {
    return {
      items,
      open,
      setOpen,
      count: items.reduce((n, i) => n + i.qty, 0),
      total: items.reduce((n, i) => n + i.price * i.qty, 0),
      hasMadeToOrder: items.some((i) => i.madeToOrder),
      add(product, config, qty = 1) {
        const key = itemKey(product.slug, config);
        setItems((prev) => {
          const found = prev.find((i) => i.key === key);
          if (found) {
            return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i));
          }
          return [
            ...prev,
            {
              key,
              slug: product.slug,
              name: product.name,
              price: product.price,
              priceFrom: product.priceFrom,
              madeToOrder: product.madeToOrder,
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
            : prev.map((i) => (i.key === key ? { ...i, qty } : i)),
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
