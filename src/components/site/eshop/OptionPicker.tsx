import { Check } from "lucide-react";

type Option = { label: string; values: string[] };

/** Silueta rukavice (levá); pravá je zrcadlově otočená. */
function Glove({ right }: { right?: boolean }) {
  return (
    <svg
      viewBox="0 0 48 60"
      className="h-12 w-10"
      aria-hidden="true"
      style={right ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M14 56V36L7 27c-2-3 2-6 4-4l5 5V10c0-3 4-3 4 0v14V6c0-3 4-3 4 0v18V8c0-3 4-3 4 0v17V13c0-3 4-3 4 0v25c0 9-4 18-8 18z"
        fill="currentColor"
        fillOpacity="0.15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M14 48h20" stroke="currentColor" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}

const GROUP_RE = /^(Pánská|Dámská) (.+)$/;

/**
 * Výběr varianty na detailu produktu.
 * - „Pánská …/Dámská …“ → přepínač řady + štítky velikostí jen té řady
 * - „Ruka“ → dvě dlaždice s rukavicí (levá pro praváky, pravá pro leváky)
 * - cokoli jiného → štítky
 * Hodnota zůstává celý text varianty (např. „Pánská ML“), takže košík i
 * objednávka fungují beze změny.
 */
export function OptionPicker({
  option,
  value,
  onChange,
}: {
  option: Option;
  value: string;
  onChange: (v: string) => void;
}) {
  // Ruka
  if (option.label === "Ruka") {
    return (
      <fieldset>
        <legend className="label-tech">{option.label}</legend>
        <div role="radiogroup" className="mt-3 grid grid-cols-2 gap-3">
          {option.values.map((v) => {
            const right = /prav/i.test(v.split("(")[0] ?? "");
            const on = v === value;
            const who = v.match(/\((.+)\)/)?.[1] ?? "";
            return (
              <button
                key={v}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange(v)}
                className={`relative flex items-center gap-3 border p-4 text-left transition-all ${
                  on
                    ? "border-gold bg-gold/10 shadow-soft"
                    : "border-border bg-card hover:border-gold/60"
                }`}
              >
                <span className={on ? "text-gold" : "text-muted-foreground"}>
                  <Glove right={right} />
                </span>
                <span>
                  <span className="block text-sm font-medium text-ink">
                    {right ? "Na pravou ruku" : "Na levou ruku"}
                  </span>
                  <span className="block text-xs text-muted-foreground">{who}</span>
                </span>
                {on && <Check className="absolute right-2 top-2 h-4 w-4 text-gold" />}
              </button>
            );
          })}
        </div>
        <details className="group mt-3 text-sm">
          <summary className="cursor-pointer list-none text-muted-foreground hover:text-ink">
            <span className="underline decoration-dotted underline-offset-4">
              Proč levá pro praváky?
            </span>
          </summary>
          <p className="mt-2 border-l-2 border-gold pl-3 leading-relaxed text-ink">
            Rukavici nosí ruka, která drží hůl nahoře a vede švih — u praváka je to levá. Druhá ruka
            je pod ní a rukavici většina hráčů nepotřebuje.
          </p>
        </details>
      </fieldset>
    );
  }

  // Pánská / Dámská + velikosti
  const grouped = option.values.every((v) => GROUP_RE.test(v));
  if (grouped) {
    const groups: Record<string, string[]> = {};
    for (const v of option.values) {
      const [, g, size] = v.match(GROUP_RE)!;
      (groups[g!] ??= []).push(size!);
    }
    const [, curGroup = Object.keys(groups)[0]!, curSize = ""] = value.match(GROUP_RE) ?? [];
    const pickGroup = (g: string) => {
      if (g === curGroup) return;
      const sizes = groups[g]!;
      onChange(`${g} ${sizes.includes(curSize) ? curSize : sizes[0]}`);
    };
    return (
      <fieldset>
        <legend className="label-tech">{option.label}</legend>
        <div
          className="mt-3 inline-flex rounded-full border border-border bg-card p-1"
          role="tablist"
        >
          {Object.keys(groups).map((g) => (
            <button
              key={g}
              type="button"
              role="tab"
              aria-selected={g === curGroup}
              onClick={() => pickGroup(g)}
              className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                g === curGroup ? "bg-ink text-background" : "text-muted-foreground hover:text-ink"
              }`}
            >
              {g === "Pánská" ? "Pánské" : "Dámské"}
            </button>
          ))}
        </div>
        <div role="radiogroup" className="mt-4 flex flex-wrap gap-2">
          {groups[curGroup]!.map((size) => {
            const on = size === curSize;
            return (
              <button
                key={size}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={`${curGroup} ${size}`}
                onClick={() => onChange(`${curGroup} ${size}`)}
                className={`min-w-14 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  on
                    ? "border-gold bg-gold text-background shadow-soft"
                    : "border-border bg-card text-ink hover:border-gold"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </fieldset>
    );
  }

  // Obecné štítky
  return (
    <fieldset>
      <legend className="label-tech">{option.label}</legend>
      <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
        {option.values.map((v) => {
          const on = v === value;
          return (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(v)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                on
                  ? "border-gold bg-gold text-background shadow-soft"
                  : "border-border bg-card text-ink hover:border-gold"
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
