import { createFileRoute } from "@tanstack/react-router";
import { db, dbConfigured } from "@/lib/db";

/**
 * „Jsi vzhůru?" — jednou denně sem zaklepe GitHub (soubor
 * .github/workflows/databaze-nespi.yml).
 *
 * Databáze Supabase zdarma po týdnu bez provozu usne a pak nejdou
 * objednávky ani poukazy. Tahle adresa udělá malý dotaz do databáze,
 * takže nikdy neusne. Nic nevrací, nic neukládá.
 */
export const Route = createFileRoute("/api/zije")({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!dbConfigured()) throw new Error("databaze neni pripojena");
          await db.select("vf_orders", "select=id&limit=1");
          return new Response("ok", { status: 200, headers: { "Cache-Control": "no-store" } });
        } catch {
          return new Response("databaze neodpovida", { status: 503, headers: { "Cache-Control": "no-store" } });
        }
      },
    },
  },
});
