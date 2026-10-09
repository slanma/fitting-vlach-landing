import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ExternalLink, Mail, Phone, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FIT_STEPS,
  HANDS,
  mirror,
  type Hand,
  KINDS,
  LINES,
  QUESTIONS,
  recommend,
  type Answers,
  type ClubKind,
  type Line,
  type Model,
} from "@/data/pruvodce";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contact";

/** Stylizovaná kresba hole — zástupce, dokud nejsou fotky. */
export function ClubArt({ kind, className = "" }: { kind: ClubKind; className?: string }) {
  // Hlava hole podle typu; shaft jde šikmo jako u hole položené na míči.
  const heads: Record<ClubKind, string> = {
    driver: "M44 88c-6-14 6-30 30-32 22-2 38 8 36 24-2 14-24 22-44 22-12 0-20-4-22-14z",
    dlouhe: "M50 92c-3-11 7-22 25-23 17-1 29 6 27 17-2 10-17 15-33 15-10 0-17-3-19-9z",
    zeleza: "M54 64l42 10c5 1 8 5 7 10l-4 16c-1 4-5 6-9 6H58c-4 0-7-3-7-7l1-31c0-3 1-4 2-4z",
    wedge: "M52 58l48 14c4 1 6 5 5 9l-5 19c-1 4-4 6-8 6H58c-4 0-7-3-7-7V61c0-2 0-3 1-3z",
    putter: "M40 84h70c4 0 7 3 7 7v8c0 4-3 7-7 7H40c-4 0-7-3-7-7v-8c0-4 3-7 7-7z",
  };
  const shaftEnd = {
    driver: [66, 58],
    dlouhe: [68, 70],
    zeleza: [60, 66],
    wedge: [58, 60],
    putter: [76, 84],
  }[kind];
  return (
    <svg viewBox="26 0 116 112" className={className} aria-hidden="true">
      <line
        x1="96"
        y1="6"
        x2={shaftEnd[0]}
        y2={shaftEnd[1]}
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <line
        x1="96"
        y1="6"
        x2="90"
        y2="22"
        stroke="currentColor"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d={heads[kind]}
        fill="currentColor"
        fillOpacity="0.18"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <circle cx="128" cy="100" r="8" fill="#ffffff" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function Picture({ model, kind, className }: { model: Model; kind: ClubKind; className: string }) {
  return model.image ? (
    <img src={model.image} alt={model.name} className={`${className} object-contain`} />
  ) : (
    <div className={`${className} flex items-center justify-center bg-gold/10 text-gold`}>
      <ClubArt kind={kind} className="h-[85%] w-[85%]" />
    </div>
  );
}

function Tile({
  active,
  onClick,
  title,
  hint,
  icon,
}: {
  active?: boolean;
  onClick: () => void;
  title: string;
  hint?: string | undefined;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full items-center gap-4 border bg-card p-5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-card ${
        active ? "border-gold" : "border-border"
      }`}
    >
      {icon && (
        <span className="flex h-14 w-16 shrink-0 items-center justify-center text-gold">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-medium text-ink">{title}</span>
        {hint && <span className="mt-0.5 block text-sm text-muted-foreground">{hint}</span>}
      </span>
      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-gold" />
    </button>
  );
}

/**
 * Průvodce výběrem hole: co chci zlepšit → pro koho → pár otázek o hře →
 * doporučení s „cestou“ (žebříček holí od nejvíc odpouštějící po tourovou).
 */
export function Pruvodce({ initialKind }: { initialKind?: ClubKind | undefined }) {
  const [kind, setKind] = useState<ClubKind | null>(initialKind ?? null);
  const [line, setLine] = useState<Line | null>(null);
  const [hand, setHand] = useState<Hand | null>(null);
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0); // index otázky
  const [picked, setPicked] = useState<number | null>(null); // klik v žebříčku

  const questions = kind && line === "std" ? QUESTIONS[kind] : [];
  const done = !!kind && !!line && !!hand && (line !== "std" || step >= questions.length);
  const rec = useMemo(
    () => (done && kind && line ? recommend(kind, line, answers) : null),
    [done, kind, line, answers],
  );

  const totalSteps = 3 + (line === "std" || !line ? (kind ? QUESTIONS[kind].length : 3) : 0);
  const current = !kind ? 0 : !line ? 1 : !hand ? 2 : 3 + Math.min(step, questions.length);
  const progress = done ? 100 : Math.round((current / totalSteps) * 100);

  function reset(keepLine = false) {
    setKind(null);
    if (!keepLine) {
      setLine(null);
      setHand(null);
    }
    setAnswers({});
    setStep(0);
    setPicked(null);
  }

  function back() {
    setPicked(null);
    if (done && line !== "std") return setHand(null);
    if (line === "std" && hand && step > 0) return setStep(step - 1);
    if (hand) return setHand(null);
    if (line) return setLine(null);
    setKind(null);
  }

  const kindLabel = KINDS.find((k) => k.id === kind)?.label;

  // Po každém kroku posunout průvodce do zorného pole (hlavně na mobilu).
  const box = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = box.current;
    if (el && el.getBoundingClientRect().top < 0)
      el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [kind, line, step]);

  return (
    <div ref={box} className="scroll-mt-24 border border-border bg-background">
      <div className="h-1 bg-border">
        <div
          className="h-1 bg-gold transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="p-5 sm:p-8">
        {(kind || line) && (
          <button
            type="button"
            onClick={back}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" /> Zpět
          </button>
        )}

        {!kind && (
          <section>
            <span className="label-tech">Krok 1</span>
            <h2 className="mt-2 text-xl font-medium text-ink sm:text-2xl">
              Co chcete na hřišti zlepšit?
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {KINDS.map((k) => (
                <Tile
                  key={k.id}
                  title={k.label}
                  hint={k.hint}
                  icon={<ClubArt kind={k.id} className="h-full w-full" />}
                  onClick={() => setKind(k.id)}
                />
              ))}
            </div>
          </section>
        )}

        {kind && !line && (
          <section>
            <span className="label-tech">Krok 2 · {kindLabel}</span>
            <h2 className="mt-2 text-xl font-medium text-ink sm:text-2xl">Pro koho hůl hledáte?</h2>
            <div className="mt-6 grid gap-3">
              {LINES.map((l) => (
                <Tile
                  key={l.id}
                  title={l.label}
                  hint={l.hint}
                  onClick={() => setLine(l.id as Line)}
                />
              ))}
            </div>
          </section>
        )}

        {kind && line && !hand && (
          <section className="animate-in fade-in slide-in-from-right-4 duration-300">
            <span className="label-tech">Krok 3 · {kindLabel}</span>
            <h2 className="mt-2 text-xl font-medium text-ink sm:text-2xl">
              Hrajete jako pravák, nebo levák?
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {HANDS.map((h) => (
                <Tile key={h.id} title={h.label} hint={h.hint} onClick={() => setHand(h.id)} />
              ))}
            </div>
          </section>
        )}

        {kind && line === "std" && hand && !done && (
          <section
            key={questions[step]!.id}
            className="animate-in fade-in slide-in-from-right-4 duration-300"
          >
            <span className="label-tech">
              Otázka {step + 1} z {questions.length} · {kindLabel}
            </span>
            <h2 className="mt-2 text-xl font-medium text-ink sm:text-2xl">
              {mirror(questions[step]!.title, hand)}
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {questions[step]!.options.map((o) => (
                <Tile
                  key={o.id}
                  title={mirror(o.label, hand)}
                  hint={o.hint && mirror(o.hint, hand)}
                  active={answers[questions[step]!.id] === o.id}
                  onClick={() => {
                    setAnswers({ ...answers, [questions[step]!.id]: o.id });
                    setStep(step + 1);
                  }}
                />
              ))}
            </div>
          </section>
        )}

        {rec && kind && (
          <Result
            rec={rec}
            kind={kind}
            line={line!}
            hand={hand!}
            answers={answers}
            picked={picked}
            setPicked={setPicked}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}

/** „Co doladíme na fittingu“ — hlava je hotová, ostatní kroky se měří. */
function FitSteps({ kind }: { kind: ClubKind }) {
  const steps = FIT_STEPS[kind];
  const [open, setOpen] = useState(1);
  return (
    <div className="mt-8 border border-border bg-card p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-sm uppercase tracking-[0.16em] text-ink">
          Co doladíme na fittingu
        </h3>
        <span className="text-xs text-muted-foreground">
          Hotovo 1 z {steps.length} — zbytek změříme na vašem švihu
        </span>
      </div>
      <ol
        className="mt-5 grid gap-2"
        style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}
      >
        {steps.map((st, i) => {
          const done = i === 0;
          const on = open === i;
          return (
            <li key={st.label} className="relative">
              {i > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-1/2 top-4 h-0.5 w-full -translate-y-1/2 bg-border"
                />
              )}
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-expanded={on}
                className="relative flex w-full flex-col items-center gap-1.5 text-center"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium transition-all ${
                    done
                      ? "border-olive bg-olive text-background"
                      : on
                        ? "border-gold bg-gold text-background"
                        : "border-border bg-background text-muted-foreground hover:border-gold"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" /> : i + 1}
                </span>
                <span
                  className={`text-[0.7rem] leading-tight sm:text-xs ${on ? "font-medium text-ink" : "text-muted-foreground"}`}
                >
                  {st.label}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      <p
        key={open}
        className="animate-in fade-in mt-4 border-l-2 border-gold pl-3 text-sm leading-relaxed text-ink duration-300"
      >
        <strong className="font-medium">{steps[open]!.label}:</strong> {steps[open]!.text}
      </p>
    </div>
  );
}

function Result({
  rec,
  kind,
  line,
  hand,
  answers,
  picked,
  setPicked,
  onReset,
}: {
  rec: ReturnType<typeof recommend>;
  kind: ClubKind;
  line: Line;
  hand: Hand;
  answers: Answers;
  picked: number | null;
  setPicked: (i: number | null) => void;
  onReset: (keepLine?: boolean) => void;
}) {
  const shownIndex = picked ?? rec.index;
  // Žebříček posunout tak, aby byla doporučená hůl vidět (na mobilu je mimo obrazovku).
  const rail = useRef<HTMLOListElement>(null);
  useEffect(() => {
    const el = rail.current?.children[rec.index] as HTMLElement | undefined;
    if (el && rail.current)
      rail.current.scrollLeft = el.offsetLeft - rail.current.clientWidth / 2 + el.clientWidth / 2;
  }, [rec.index, rec.model.id]);
  const shown = rec.ladder[shownIndex]!;
  const isRecommended = shownIndex === rec.index;
  const next = rec.ladder[rec.index + 1];

  // Odpovědi do e-mailu — Petr hned ví, s kým mluví.
  const summary = [
    `Hledám: ${KINDS.find((k) => k.id === kind)?.label}`,
    `Pro: ${LINES.find((l) => l.id === line)?.label}`,
    `Hraji jako: ${hand === "L" ? "levák" : hand === "?" ? "zatím nevím" : "pravák"}`,
    ...(line === "std"
      ? QUESTIONS[kind].map((q) =>
          mirror(`${q.title} ${q.options.find((o) => o.id === answers[q.id])?.label ?? "—"}`, hand),
        )
      : []),
    `Výchozí model z průvodce: ${rec.model.name} (shaft, grip a další parametry doladíme na fittingu)`,
  ].join("\n");
  const mail = `mailto:${EMAIL}?subject=${encodeURIComponent(`Fitting — ${rec.model.name}`)}&body=${encodeURIComponent(
    `Dobrý den,\n\nprošel(a) jsem průvodce výběrem hole na webu:\n\n${summary}\n\nJméno:\nTelefon:\n\nDěkuji.`,
  )}`;

  return (
    <section className="animate-in fade-in duration-500">
      <span className="label-tech">
        {isRecommended ? "Váš výchozí model · 1. krok" : "Prohlížíte"}
      </span>

      <div className="mt-4 grid gap-6 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div className="relative aspect-[4/3] border border-border bg-card">
          <Picture model={shown} kind={kind} className="h-full w-full p-6" />
          {shown.badge && (
            <span className="absolute left-3 top-3 rounded-sm bg-gold px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-background">
              {shown.badge}
            </span>
          )}
        </div>
        <div>
          <p className="label-tech">PING</p>
          <h2 className="mt-1 text-2xl font-medium leading-snug text-ink sm:text-3xl">
            {shown.name}
          </h2>
          <span className="rule-gold mt-4" />
          <p className="mt-4 text-[0.95rem] leading-relaxed text-ink">
            {mirror(shown.tagline, hand)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">{mirror(shown.forWho, hand)}</p>
          {isRecommended && (
            <ul className="mt-4 space-y-2">
              {[
                ...rec.why,
                ...(hand === "L"
                  ? [
                      "PING vyrábí hole i v leváckém provedení — dostupnost tohoto modelu pro leváky ověříme.",
                    ]
                  : hand === "?"
                    ? [
                        "Jestli budete hrát jako pravák, nebo levák, vyzkoušíme na fittingu — hůl pak objednáme na správnou stranu.",
                      ]
                    : []),
              ].map((w) => (
                <li key={w} className="flex gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {mirror(w, hand)}
                </li>
              ))}
            </ul>
          )}
          <a
            href={shown.url}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm text-gold hover:opacity-75"
          >
            Technické údaje na ping.com <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <FitSteps kind={kind} />

      {rec.ladder.length > 1 && (
        <div className="mt-10">
          <h3 className="font-display text-sm uppercase tracking-[0.16em] text-ink">Vaše cesta</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Od nejvíc odpouštějící hole po tu, která chce nejvíc techniky. Klikněte na kteroukoli.
          </p>
          <ol ref={rail} className="relative mt-5 flex gap-3 overflow-x-auto scroll-smooth pb-2">
            {rec.ladder.map((m, i) => {
              const rcm = i === rec.index;
              const sel = i === shownIndex;
              return (
                <li key={m.id} className="w-36 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPicked(i === rec.index ? null : i)}
                    className={`w-full border p-2 text-left transition-all ${sel ? "border-ink bg-card shadow-card" : "border-border hover:border-gold"} ${
                      i > rec.index + 1 ? "opacity-60" : ""
                    }`}
                  >
                    <div className="relative aspect-[4/3] bg-card">
                      <Picture model={m} kind={kind} className="h-full w-full p-2" />
                    </div>
                    <span className="mt-2 block text-xs font-medium leading-tight text-ink">
                      {m.name}
                    </span>
                    <span
                      className={`mt-1 block text-[0.65rem] uppercase tracking-wider ${rcm ? "text-gold" : i === rec.index + 1 ? "text-ink" : "text-muted-foreground"}`}
                    >
                      {rcm
                        ? "● Pro vás teď"
                        : i === rec.index + 1
                          ? "→ Další krok"
                          : i < rec.index
                            ? "Snazší"
                            : "Později"}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
          {next && rec.model.nextWhen && (
            <p className="mt-4 border-l-2 border-gold pl-4 text-sm text-ink">
              <strong>Kdy přejít na {next.name}?</strong> {rec.model.nextWhen}
            </p>
          )}
        </div>
      )}

      {rec.alternative && (
        <div className="mt-8 flex items-center gap-4 border border-border bg-card p-4">
          <div className="h-16 w-20 shrink-0 bg-background">
            <Picture model={rec.alternative} kind={kind} className="h-full w-full p-1" />
          </div>
          <div className="min-w-0 text-sm">
            <p className="font-medium text-ink">Zvažte také: {rec.alternative.name}</p>
            <p className="text-muted-foreground">{mirror(rec.alternative.tagline, hand)}</p>
          </div>
        </div>
      )}

      <div className="mt-10 border border-gold/40 bg-gold/5 p-5 sm:p-6">
        <p className="text-base font-medium text-ink">Domluvte si fitting — doladíme zbytek</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Průvodce vybral výchozí hlavu. Shaft, grip a další parametry změříme na vašem švihu —
          teprve pak je hůl opravdu vaše. Cenu sdělíme na dotaz.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <a href={PHONE_HREF}>
              <Phone className="mr-2 h-4 w-4" /> {PHONE_DISPLAY}
            </a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={mail}>
              <Mail className="mr-2 h-4 w-4" /> Poslat výsledek e-mailem
            </a>
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">E-mail se předvyplní vašimi odpověďmi.</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <button
          type="button"
          onClick={() => onReset(true)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-ink"
        >
          <ArrowRight className="h-4 w-4" /> Vybrat jinou hůl
        </button>
        <button
          type="button"
          onClick={() => onReset(false)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-ink"
        >
          <RotateCcw className="h-4 w-4" /> Začít znovu
        </button>
      </div>
    </section>
  );
}
