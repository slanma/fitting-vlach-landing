import { useState } from "react";
import { Ruler } from "lucide-react";

/**
 * Kalkulačka velikosti rukavic HIRZL podle tabulky výrobce (hirzl.one,
 * „Sizing chart“). Délka = od zápěstí po špičku prostředníčku,
 * obvod = kolem dlaně pod klouby prstů (bez palce).
 */
const CHART = {
  Pánská: [
    { size: "S", len: [17.5, 18.5], circ: [19.5, 21.0] },
    { size: "M", len: [18.5, 19.5], circ: [21.0, 22.5] },
    { size: "ML", len: [19.5, 20.5], circ: [22.5, 24.0] },
    { size: "L", len: [20.5, 21.5], circ: [24.0, 25.5] },
    { size: "XL", len: [21.5, 99], circ: [25.5, 99] },
  ],
  Dámská: [
    { size: "XS", len: [0, 16.0], circ: [0, 17.5] },
    { size: "S", len: [16.0, 16.5], circ: [17.5, 18.5] },
    { size: "M", len: [16.5, 17.0], circ: [18.5, 19.5] },
    { size: "L", len: [17.0, 17.5], circ: [19.5, 20.5] },
  ],
} as const;

type Group = keyof typeof CHART;

function idx(group: Group, cm: number, key: "len" | "circ") {
  const rows = CHART[group];
  const i = rows.findIndex((r) => cm < r[key][1]);
  return i === -1 ? rows.length - 1 : i;
}

/** Velikost z tabulky; mezi dvěma velikostmi bere větší (rukavice nesmí škrtit). */
function chartSize(group: Group, len: number, circ: number) {
  const i = Math.max(idx(group, len, "len"), idx(group, circ, "circ"));
  return CHART[group][i]!.size;
}

/** Najde variantu produktu, do které velikost z tabulky patří (např. „ML“ → „ML–XL“). */
function matchVariant(values: string[], group: Group, size: string): string | null {
  const order = CHART[group].map((r) => r.size as string);
  const pos = order.indexOf(size);
  for (const v of values) {
    if (!v.startsWith(group + " ")) continue;
    const s = v.slice(group.length + 1);
    if (s === size) return v;
    const [from, to] = s.split("–");
    if (from && to) {
      const a = order.indexOf(from);
      const b = order.indexOf(to);
      if (a !== -1 && b !== -1 && pos >= a && pos <= b) return v;
    }
  }
  return null;
}

function HandSketch() {
  return (
    <svg viewBox="0 0 120 150" className="h-36 w-28 shrink-0 text-gold" aria-hidden="true">
      <path
        d="M38 140V96L22 76c-4-6 3-12 8-8l10 10V30c0-6 9-6 9 0v34V18c0-6 9-6 9 0v44V22c0-6 9-6 9 0v40V34c0-6 9-6 9 0v60c0 22-10 46-22 46z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* B: délka */}
      <line
        x1="104"
        y1="14"
        x2="104"
        y2="140"
        stroke="var(--ink)"
        strokeWidth="1.5"
        strokeDasharray="3 3"
      />
      <circle cx="104" cy="78" r="8" fill="var(--ink)" />
      <text x="104" y="82" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
        B
      </text>
      {/* A: obvod */}
      <path d="M36 80 Q 57 92 80 80" fill="none" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="58" cy="100" r="8" fill="var(--ink)" />
      <text x="58" y="104" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="700">
        A
      </text>
    </svg>
  );
}

export function GloveSizeHelper({
  values,
  current,
  onPick,
}: {
  values: string[];
  current: string;
  onPick: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [len, setLen] = useState("");
  const [circ, setCirc] = useState("");
  const group: Group = current.startsWith("Dámská") ? "Dámská" : "Pánská";

  const L = parseFloat(len.replace(",", "."));
  const C = parseFloat(circ.replace(",", "."));
  const valid = L > 10 && L < 30 && C > 12 && C < 35;
  const size = valid ? chartSize(group, L, C) : null;
  const variant = size ? matchVariant(values, group, size) : null;

  return (
    <div className="border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm"
      >
        <Ruler className="h-4 w-4 text-gold" />
        <span className="flex-1 font-medium text-ink">Nevíte velikost? Změřte si ruku</span>
        <span className="text-muted-foreground">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-border p-4 sm:p-5">
          <div className="flex gap-5">
            <HandSketch />
            <div className="min-w-0 flex-1 space-y-3 text-sm">
              <p className="text-muted-foreground">
                Měřte ruku, na kterou rukavici nosíte ({group === "Pánská" ? "pánské" : "dámské"}{" "}
                velikosti).
              </p>
              <label className="block">
                <span className="text-ink">
                  <strong>A</strong> — obvod dlaně pod klouby, bez palce
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <input
                    inputMode="decimal"
                    value={circ}
                    onChange={(e) => setCirc(e.target.value)}
                    placeholder={group === "Pánská" ? "např. 22" : "např. 18,5"}
                    className="h-10 w-24 rounded-sm border border-border bg-background px-3"
                  />
                  cm
                </span>
              </label>
              <label className="block">
                <span className="text-ink">
                  <strong>B</strong> — délka od zápěstí po špičku prostředníčku
                </span>
                <span className="mt-1 flex items-center gap-2">
                  <input
                    inputMode="decimal"
                    value={len}
                    onChange={(e) => setLen(e.target.value)}
                    placeholder={group === "Pánská" ? "např. 19" : "např. 16,5"}
                    className="h-10 w-24 rounded-sm border border-border bg-background px-3"
                  />
                  cm
                </span>
              </label>
            </div>
          </div>

          {size && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border border-gold/50 bg-gold/5 p-3 text-sm">
              <span className="text-ink">
                Doporučujeme: <strong>{variant ? variant.replace(group + " ", "") : size}</strong>
                {variant && variant.replace(group + " ", "") !== size && (
                  <span className="text-muted-foreground"> (vaše velikost {size})</span>
                )}
              </span>
              {variant ? (
                variant === current ? (
                  <span className="text-xs text-muted-foreground">Už vybráno ✓</span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onPick(variant)}
                    className="rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-background"
                  >
                    Vybrat
                  </button>
                )
              ) : (
                <span className="text-xs text-muted-foreground">
                  Tuhle velikost u modelu nemáme — zavolejte, poradíme.
                </span>
              )}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Mezi dvěma velikostmi doporučujeme větší. Podle tabulky výrobce HIRZL; nejjistější je
            vyzkoušet rukavici u nás.
          </p>
        </div>
      )}
    </div>
  );
}
