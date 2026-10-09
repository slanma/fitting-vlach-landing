import { useState } from "react";

type W = "sucho" | "vlhko" | "dest";

const DATA: Record<W, { label: string; normal: string; hirzl: string }> = {
  sucho: {
    label: "Sucho",
    normal: "Po pár jamkách se ruka zpotí a hladká kůže začne klouzat.",
    hirzl: "Klokaní kůže pot pohltí — dlaň zůstane suchá, grip stejný od 1. do 18. jamky.",
  },
  vlhko: {
    label: "Vlhko",
    normal: "Ranní rosa nebo vlhký vzduch a hůl se v ruce pootáčí.",
    hirzl: "Kůže upravená technologií GRIPPP drží, i když je vlhká.",
  },
  dest: {
    label: "Déšť",
    normal: "Mokrá kůže klouže — hráč hůl křečovitě svírá a švih se zkrátí.",
    hirzl: "Grip vydrží i za deště, takže můžete držet hůl volně a švihnout naplno.",
  },
};

function Icon({ w }: { w: W }) {
  const s = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
  };
  return (
    <svg viewBox="0 0 32 32" className="h-7 w-7" aria-hidden="true">
      {w === "sucho" && (
        <>
          <circle cx="16" cy="16" r="5" {...s} />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={16 + Math.cos((a * Math.PI) / 180) * 9}
              y1={16 + Math.sin((a * Math.PI) / 180) * 9}
              x2={16 + Math.cos((a * Math.PI) / 180) * 12}
              y2={16 + Math.sin((a * Math.PI) / 180) * 12}
              {...s}
            />
          ))}
        </>
      )}
      {w !== "sucho" && (
        <path d="M9 21h14a5 5 0 0 0 0-10 7 7 0 0 0-13.5 1.5A4.3 4.3 0 0 0 9 21z" {...s} />
      )}
      {w === "vlhko" && <path d="M8 26h4M15 26h4M22 26h3" {...s} opacity="0.6" />}
      {w === "dest" && <path d="M11 24l-1.5 4M16 24l-1.5 4M21 24l-1.5 4" {...s} />}
    </svg>
  );
}

/** „Grip za každého počasí“ — po ťuknutí na počasí srovná běžnou rukavici s HIRZL GRIPPP. */
export function WeatherGrip() {
  const [w, setW] = useState<W>("dest");
  const d = DATA[w];
  return (
    <div className="mt-8 border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-medium text-ink">Grip za každého počasí</p>
        <span className="rounded-full bg-olive px-3 py-1 font-display text-[0.6rem] uppercase tracking-[0.16em] text-background">
          HIRZL GRIPPP
        </span>
      </div>
      <div role="tablist" className="mt-4 grid grid-cols-3 gap-2">
        {(Object.keys(DATA) as W[]).map((k) => (
          <button
            key={k}
            type="button"
            role="tab"
            aria-selected={k === w}
            onClick={() => setW(k)}
            className={`flex flex-col items-center gap-1 border py-3 text-sm transition-all ${
              k === w
                ? "border-gold bg-gold/10 text-ink shadow-soft"
                : "border-border text-muted-foreground hover:border-gold/60"
            }`}
          >
            <span className={k === w ? "text-gold" : ""}>
              <Icon w={k} />
            </span>
            {DATA[k].label}
          </button>
        ))}
      </div>
      <div key={w} className="animate-in fade-in mt-4 grid gap-3 duration-300 sm:grid-cols-2">
        <div className="border-l-4 border-border bg-background p-3">
          <p className="label-tech">Běžná rukavice</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{d.normal}</p>
        </div>
        <div className="border-l-4 border-olive bg-olive/5 p-3">
          <p className="label-tech text-olive">HIRZL</p>
          <p className="mt-1 text-sm leading-relaxed text-ink">{d.hirzl}</p>
        </div>
      </div>
    </div>
  );
}
