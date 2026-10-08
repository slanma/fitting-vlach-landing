import { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  Briefcase,
  CalendarDays,
  Clock,
  HelpCircle,
  PlusCircle,
  Sparkles,
  Sprout,
  Target,
} from "lucide-react";
import { ClubArt } from "@/components/site/eshop/Pruvodce";
import type { NodeId } from "@/data/profil";

/* -------------------------------------------------------------------------- */
/* Hrací jamka místo ukazatele postupu: míček jde od odpaliště k vlajce.       */
/* -------------------------------------------------------------------------- */

export function Fairway({
  progress,
  done,
  shot,
  par,
}: {
  progress: number;
  done: boolean;
  shot: number;
  par: number;
}) {
  const startX = 52;
  const holeX = 548;
  const p = Math.max(0, Math.min(1, progress / 100));
  const x = done ? holeX : startX + p * (holeX - 70 - startX);
  // Míček letí po oblouku — nahoře uprostřed cesty.
  const y = done ? 44 : 44 - Math.sin(p * Math.PI) * 10;

  return (
    <div className="relative">
      <svg viewBox="0 0 600 76" className="block h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="fv-rough" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--olive)" stopOpacity="0.16" />
            <stop offset="1" stopColor="var(--olive)" stopOpacity="0.26" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="600" height="76" fill="url(#fv-rough)" />
        {/* fairway */}
        <path
          d="M24 44 C 120 22, 230 62, 330 40 S 500 24, 590 44 L 590 60 C 480 70, 330 52, 220 66 S 70 62, 24 58 Z"
          fill="var(--olive)"
          opacity="0.32"
        />
        {/* green */}
        <ellipse cx={holeX} cy="46" rx="40" ry="17" fill="var(--olive)" opacity="0.55" />
        {/* bunkr */}
        <ellipse cx="420" cy="62" rx="26" ry="7" fill="var(--gold-soft)" />
        {/* odpaliště */}
        <rect x="30" y="38" width="30" height="14" rx="3" fill="var(--olive)" opacity="0.6" />
        {/* stopa míčku */}
        <line
          x1={startX}
          y1="44"
          x2={x}
          y2={y}
          stroke="var(--background)"
          strokeWidth="2"
          strokeDasharray="3 5"
          style={{ transition: "all 700ms ease" }}
        />
        {/* jamka a vlajka */}
        <ellipse cx={holeX} cy="46" rx="5" ry="2.5" fill="var(--ink)" opacity="0.8" />
        <line x1={holeX} y1="46" x2={holeX} y2="8" stroke="var(--ink)" strokeWidth="1.6" />
        <path
          d={`M${holeX} 8 L${holeX + 22} 13 L${holeX} 19 Z`}
          fill="var(--gold)"
          className={done ? "fv-flag-wave" : ""}
          style={{ transformOrigin: `${holeX}px 13px` }}
        />
        {/* míček */}
        <g
          style={{
            transform: `translate(${x}px, ${y}px)`,
            transition: "transform 700ms cubic-bezier(.34,1.4,.5,1)",
          }}
        >
          <circle
            r={done ? 0 : 6}
            fill="#fff"
            stroke="var(--ink)"
            strokeOpacity="0.35"
            strokeWidth="1"
            style={{ transition: "r 400ms ease 500ms" }}
          />
          <circle r={done ? 0 : 1} cx="-1.8" cy="-1.5" fill="var(--ink)" opacity="0.2" />
        </g>
      </svg>
      <div className="pointer-events-none absolute inset-x-3 top-1.5 flex justify-between font-display text-[0.62rem] uppercase tracking-[0.18em] text-ink/70">
        <span>{done ? "V jamce!" : `Rána ${shot}`}</span>
        <span className="pr-[13%]">Par {par}</span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Ikony k odpovědím                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Křivka letu míčku — při najetí na dlaždici se „nakreslí“.
 * Směr (rovně, slice, hook, krátce, všude) je pohled shora: přerušovaná čára
 * k cíli a míček z ní uhýbá. Výška (nízko, vysoko) je pohled z boku.
 */
function Flight({
  kind,
}: {
  kind: "slice" | "hook" | "rovne" | "kratce" | "vsude" | "nizko" | "vysoko";
}) {
  const side = kind === "nizko" || kind === "vysoko";
  const paths: Record<string, string[]> = {
    rovne: ["M40 54 L40 8"],
    slice: ["M40 54 C 40 32, 46 16, 68 8"],
    hook: ["M40 54 C 40 32, 34 16, 12 8"],
    kratce: ["M40 54 L40 34"],
    vsude: ["M40 54 C 38 34, 26 18, 8 12", "M40 54 L44 6", "M40 54 C 42 36, 58 22, 74 20"],
    nizko: ["M8 50 Q 40 36, 74 44"],
    vysoko: ["M10 52 Q 40 -14, 72 48"],
  };
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {side ? (
        <line
          x1="2"
          y1="56"
          x2="78"
          y2="56"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="2"
        />
      ) : (
        <>
          <line
            x1="40"
            y1="54"
            x2="40"
            y2="4"
            stroke="currentColor"
            strokeOpacity="0.3"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />
          <path
            d="M36 5 L40 1 L44 5"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
        </>
      )}
      {paths[kind]!.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="120"
          className="fv-draw"
        />
      ))}
      <circle
        cx={side ? 12 : 40}
        cy={side ? 52 : 54}
        r="4"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function Calendar({ dots }: { dots: number }) {
  return (
    <span className="relative flex h-full w-full items-center justify-center">
      <CalendarDays className="h-11 w-11" strokeWidth={1.6} />
      <span className="absolute bottom-[22%] flex gap-0.5">
        {Array.from({ length: dots }).map((_, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full bg-current" />
        ))}
      </span>
    </span>
  );
}

function Putt({ len }: { len: "kratke" | "dlouhe" | "oboji" }) {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <ellipse cx="40" cy="34" rx="36" ry="20" fill="currentColor" opacity="0.12" />
      <ellipse cx="66" cy="34" rx="5" ry="3" fill="currentColor" />
      {(len === "kratke" || len === "oboji") && (
        <path
          d="M48 34 L60 34"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="3 3"
          className="fv-march"
        />
      )}
      {(len === "dlouhe" || len === "oboji") && (
        <path
          d="M12 42 Q 36 22, 60 33"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray="3 3"
          className="fv-march"
        />
      )}
      <circle
        cx={len === "kratke" ? 46 : 12}
        cy={len === "kratke" ? 34 : 42}
        r="3.5"
        fill="#fff"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Bunker() {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <path
        d="M6 46 Q 40 22, 74 46 Z"
        fill="var(--gold-soft)"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="36" cy="40" r="4" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M36 36 Q 50 -2, 70 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="120"
        className="fv-draw"
      />
    </svg>
  );
}

function Bars() {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      {[14, 32, 50].map((x) => (
        <rect
          key={x}
          x={x}
          y="18"
          width="12"
          height="36"
          rx="2"
          fill="currentColor"
          opacity="0.7"
        />
      ))}
      <line
        x1="8"
        y1="16"
        x2="72"
        y2="16"
        stroke="currentColor"
        strokeDasharray="4 4"
        strokeWidth="2"
      />
    </svg>
  );
}

function Divot() {
  return (
    <svg viewBox="0 0 80 60" className="h-full w-full" aria-hidden="true">
      <path d="M2 44 H78" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      <path d="M22 44 Q 34 58, 48 44" fill="currentColor" opacity="0.35" />
      <path d="M50 40 l6 -8 l5 6 z" fill="currentColor" opacity="0.6" className="fv-pop" />
      <path d="M58 32 l5 -6 l3 5 z" fill="currentColor" opacity="0.45" className="fv-pop" />
      <circle cx="30" cy="40" r="4" fill="#fff" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const ICON = "h-full w-full";

export function OptionIcon({ node, opt }: { node: NodeId; opt: string }) {
  const k = `${node}:${opt}`;
  switch (k) {
    case "frekvence:tyden":
      return <Calendar dots={4} />;
    case "frekvence:mesic":
      return <Calendar dots={2} />;
    case "frekvence:rok":
      return <Calendar dots={1} />;
    case "frekvence:zacinam":
      return <Sprout className={ICON} strokeWidth={1.6} />;
    case "zac_hole:ano":
      return <Briefcase className={ICON} strokeWidth={1.6} />;
    case "zac_hole:pujcene":
      return <ArrowLeftRight className={ICON} strokeWidth={1.6} />;
    case "zac_hole:ne":
      return <PlusCircle className={ICON} strokeWidth={1.6} />;
    case "zac_nejhur:trefit":
      return <Target className={ICON} strokeWidth={1.6} />;
    case "zac_nejhur:vzduch":
      return <Flight kind="nizko" />;
    case "zac_nejhur:smer":
      return <Flight kind="slice" />;
    case "zac_nejhur:vse":
    case "stve:vse":
      return <Flight kind="vsude" />;
    case "stve:odpaliste":
    case "jde:driver":
    case "driver_bez:ne":
      return <ClubArt kind="driver" className={ICON} />;
    case "driver_bez:ano":
      return <ClubArt kind="dlouhe" className={ICON} />;
    case "stve:green":
    case "jde:zeleza":
      return <ClubArt kind="zeleza" className={ICON} />;
    case "stve:kolem":
    case "jde:kratka":
    case "kratka:cip":
      return <ClubArt kind="wedge" className={ICON} />;
    case "stve:pat":
    case "jde:pat":
      return <ClubArt kind="putter" className={ICON} />;
    case "jde:nic":
      return <HelpCircle className={ICON} strokeWidth={1.6} />;
    case "driver_let:slice":
    case "let:slice":
      return <Flight kind="slice" />;
    case "driver_let:hook":
    case "let:hook":
      return <Flight kind="hook" />;
    case "driver_let:kratce":
    case "let:kratce":
      return <Flight kind="kratce" />;
    case "driver_let:vsude":
    case "let:vsude":
      return <Flight kind="vsude" />;
    case "zeleza:hrabou":
      return <Divot />;
    case "zeleza:bokem":
      return <Flight kind="slice" />;
    case "zeleza:nizko":
      return <Flight kind="nizko" />;
    case "zeleza:stejne":
      return <Bars />;
    case "kratka:bunkr":
      return <Bunker />;
    case "kratka:pitch":
      return <Flight kind="vysoko" />;
    case "pat:kratke":
      return <Putt len="kratke" />;
    case "pat:dlouhe":
      return <Putt len="dlouhe" />;
    case "pat:oboji":
      return <Putt len="oboji" />;
    case "hole:nove":
      return <Sparkles className={ICON} strokeWidth={1.6} />;
    case "hole:stare":
      return <Clock className={ICON} strokeWidth={1.6} />;
    case "hole:bazar":
      return <ArrowLeftRight className={ICON} strokeWidth={1.6} />;
    case "hole:fit":
      return <Target className={ICON} strokeWidth={1.6} />;
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Kruhový ukazatel „jak moc pomůže fitting“                                  */
/* -------------------------------------------------------------------------- */

export function FitGauge({ value, label }: { value: number; label: string }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const t = window.setTimeout(() => setV(value), 150);
    return () => window.clearTimeout(t);
  }, [value]);
  const r = 46;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex shrink-0 flex-col items-center">
      <div className="relative h-32 w-32">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="var(--olive)"
            strokeOpacity="0.18"
            strokeWidth="12"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="var(--gold)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - v / 100)}
            style={{ transition: "stroke-dashoffset 1400ms cubic-bezier(.2,.8,.2,1)" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-3xl font-medium text-ink">
          {Math.round(v)}%
        </span>
      </div>
      <span className="mt-2 font-display text-[0.65rem] uppercase tracking-[0.16em] text-gold">
        {label}
      </span>
    </div>
  );
}
