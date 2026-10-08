import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Mail,
  Phone,
  RotateCcw,
  TrendingUp,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Fairway, FitGauge, OptionIcon } from "@/components/site/ProfilVisuals";
import {
  START,
  TREE,
  evaluate,
  profileSummary,
  type NodeId,
  type ProfileAnswers,
} from "@/data/profil";
import { EMAIL, PHONE_DISPLAY, PHONE_HREF } from "@/lib/contact";

const STORAGE_KEY = "fv-golf-profil-v2";

type Saved = { answers: ProfileAnswers; path: NodeId[]; done: boolean };

function load(): Saved | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Saved) : null;
  } catch {
    return null;
  }
}
function save(s: Saved | null) {
  try {
    if (s) window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(s));
    else window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* privátní režim — profil funguje dál, jen se neuloží */
  }
}

/**
 * Golfový profil: krátká „zpověď“ → osobní karta → fitting s Petrem.
 *
 * ANONYMNÍ: neptá se na jméno ani kontakt a nic neposílá na server.
 * Odpovědi drží jen sessionStorage prohlížeče — přežijí obnovení stránky,
 * ale po zavření okna se samy smažou. K Petrovi se dostanou jedině tehdy,
 * když je zákazník sám pošle e-mailem.
 */
export function GolfovyProfil({
  onPickClub,
}: {
  onPickClub?: (kind: ReturnType<typeof evaluate>["nextKind"]) => void;
}) {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<ProfileAnswers>({});
  const [path, setPath] = useState<NodeId[]>([START]);
  const [done, setDone] = useState(false);
  const [resume, setResume] = useState<Saved | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [chosen, setChosen] = useState<string | null>(null);
  const box = useRef<HTMLDivElement>(null);

  // Nabídnout pokračování, pokud je rozpracovaný nebo hotový profil.
  useEffect(() => {
    const s = load();
    if (s && Object.keys(s.answers).length > 0 && Array.isArray(s.path)) setResume(s);
  }, []);

  const node = TREE[path[path.length - 1]!];
  const result = useMemo(() => (done ? evaluate(answers) : null), [done, answers]);

  // Odhad délky větve pro ukazatel postupu (začátečník 3, odpaliště 6, jinak 5).
  const expected = answers.frekvence === "zacinam" ? 3 : answers.stve === "odpaliste" ? 6 : 5;
  const progress = done ? 100 : Math.round(((path.length - 1) / expected) * 100);

  useEffect(() => {
    if (!started) return;
    const el = box.current;
    if (el && el.getBoundingClientRect().top < 0)
      el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [path.length, done, started]);

  function pick(optId: string, next: NodeId | "konec") {
    // Odpovědi z jiné větve (po návratu zpět) zahodit, ať se nepletou.
    const kept: ProfileAnswers = {};
    for (const n of path.slice(0, -1)) if (answers[n]) kept[n] = answers[n];
    const nextAnswers = { ...kept, [node.id]: optId };
    const nextPath = next === "konec" ? path : [...path, next];
    const isDone = next === "konec";
    setAnswers(nextAnswers);
    setPath(nextPath);
    setDone(isDone);
    save({ answers: nextAnswers, path: nextPath, done: isDone });
    setSavedFlash(true);
    window.setTimeout(() => setSavedFlash(false), 1000);
  }

  function back() {
    if (done) return setDone(false);
    if (path.length > 1) setPath(path.slice(0, -1));
  }

  function restart() {
    save(null);
    setAnswers({});
    setPath([START]);
    setDone(false);
    setResume(null);
    setStarted(true);
  }

  return (
    <div ref={box} className="scroll-mt-32 border border-border bg-background">
      <Fairway progress={started ? progress : 0} done={done} shot={path.length} par={expected} />
      <div className="p-5 sm:p-8">
        {!started && (
          <section>
            <span className="label-tech">Golfový profil · 5 kliknutí</span>
            <h2 className="mt-2 text-xl font-medium text-ink sm:text-2xl">
              Pojďme se podívat na vaši hru
            </h2>
            <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed text-muted-foreground">
              Klik, klik, hotovo. Uvidíte, kde máte rezervu, co se dá vyřešit holí — a jestli vám
              pomůže fitting. Anonymně: na nic osobního se neptáme a nic se neukládá.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {resume ? (
                <>
                  <Button
                    size="lg"
                    onClick={() => {
                      setAnswers(resume.answers);
                      setPath(resume.path);
                      setDone(resume.done);
                      setStarted(true);
                    }}
                  >
                    {resume.done ? "Zobrazit můj profil" : "Pokračovat, kde jsem skončil(a)"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={restart}>
                    Začít znovu
                  </Button>
                </>
              ) : (
                <Button size="lg" onClick={() => setStarted(true)}>
                  Začít <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </section>
        )}

        {started && !done && (
          <section key={node.id} className="animate-in fade-in slide-in-from-right-6 duration-200">
            <div className="mb-4 flex h-6 items-center justify-between gap-3">
              {path.length > 1 ? (
                <button
                  type="button"
                  onClick={back}
                  className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink"
                >
                  <ArrowLeft className="h-4 w-4" /> Zpět
                </button>
              ) : (
                <span />
              )}
              <span
                className={`inline-flex items-center gap-1 text-xs text-muted-foreground transition-opacity ${savedFlash ? "opacity-100" : "opacity-0"}`}
              >
                <Save className="h-3.5 w-3.5" /> Uloženo
              </span>
            </div>
            <h2 className="text-2xl font-medium text-ink sm:text-3xl">{node.title}</h2>
            <div
              className={`mt-6 grid gap-3 ${node.options.length === 2 || node.options.length === 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3"}`}
            >
              {node.options.map((o) => {
                const isChosen = chosen === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={chosen !== null}
                    onClick={() => {
                      setChosen(o.id);
                      window.setTimeout(() => {
                        setChosen(null);
                        pick(o.id, o.next);
                      }, 280);
                    }}
                    className={`group relative flex min-h-32 flex-col items-center justify-center gap-3 border px-3 py-5 text-center shadow-soft transition-all duration-200 ${
                      isChosen
                        ? "fv-chosen border-gold bg-gold text-background shadow-card"
                        : `hover:-translate-y-1 hover:border-gold hover:bg-gold-soft/30 hover:shadow-card active:scale-[0.97] ${
                            answers[node.id] === o.id
                              ? "border-gold bg-gold-soft/30 text-ink"
                              : "border-border bg-card text-ink"
                          }`
                    }`}
                  >
                    <span
                      className={`flex h-14 w-16 items-center justify-center transition-colors ${isChosen ? "text-background" : "text-olive group-hover:text-gold"}`}
                    >
                      <OptionIcon node={node.id} opt={o.id} />
                    </span>
                    <span className="text-base font-medium leading-tight sm:text-lg">
                      {o.label}
                    </span>
                    {isChosen && <Check className="absolute right-2 top-2 h-5 w-5" />}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {result && (
          <section className="animate-in fade-in duration-500">
            <button
              type="button"
              onClick={back}
              className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Změnit odpověď
            </button>
            <div className="relative overflow-hidden bg-olive p-6 text-background sm:p-8">
              <svg
                viewBox="0 0 200 120"
                className="pointer-events-none absolute -right-6 -top-4 h-40 w-64 opacity-20"
                aria-hidden="true"
              >
                <path
                  d="M10 110 Q 100 -30, 190 90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray="6 8"
                />
                <circle cx="190" cy="92" r="7" fill="currentColor" />
              </svg>
              <span className="font-display text-[0.7rem] uppercase tracking-[0.2em] opacity-80">
                Váš golfový profil
              </span>
              <h2 className="mt-2 text-2xl font-medium sm:text-3xl">{result.persona.name}</h2>
              <p className="mt-3 max-w-xl text-[0.95rem] leading-relaxed opacity-90">
                {result.persona.text}
              </p>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {result.areas.map((ar) => (
                <div
                  key={ar.area}
                  className={`animate-in fade-in slide-in-from-bottom-2 border border-l-4 p-4 duration-500 ${ar.status === "silne" ? "border-olive/30 border-l-olive bg-olive/5" : "border-gold/40 border-l-gold bg-gold/5"}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="label-tech">{ar.area}</span>
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium ${ar.status === "silne" ? "text-olive" : "text-ink"}`}
                    >
                      {ar.status === "silne" ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <TrendingUp className="h-3.5 w-3.5 text-gold" />
                      )}
                      {ar.headline}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{ar.tip}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col items-center gap-6 border border-border bg-card p-5 sm:flex-row sm:p-6">
              <FitGauge value={result.fitScore} label={result.fitLabel} />
              <div>
                <p className="text-sm font-medium text-ink">Jak moc vám pomůže fitting</p>
                <p className="mt-2 text-sm leading-relaxed text-ink">{result.keyMessage}</p>
              </div>
            </div>

            <div className="mt-8 border border-gold/50 bg-gold/5 p-5 sm:p-7">
              <p className="text-lg font-medium text-ink">Domluvte si fitting s Petrem Vlachem</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Přes 20 let praxe a 1000 fittingů. Zavolejte, nebo pošlete svůj profil e-mailem —
                Petr se ozve s termínem.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href={PHONE_HREF}>
                    <Phone className="mr-2 h-4 w-4" /> {PHONE_DISPLAY}
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a
                    href={`mailto:${EMAIL}?subject=${encodeURIComponent(`Zájem o fitting — ${result.persona.name}`)}&body=${encodeURIComponent(
                      `Dobrý den,\n\nvyplnil(a) jsem golfový profil na webu a mám zájem o fitting.\n\n${profileSummary(answers)}\n\nTyp hráče: ${result.persona.name}\n\nJméno:\nTelefon:\nKdy se mi hodí:\n\nDěkuji.`,
                    )}`}
                  >
                    <Mail className="mr-2 h-4 w-4" /> Poslat profil e-mailem
                  </a>
                </Button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                E-mail se předvyplní vašimi odpověďmi, stačí doplnit jméno a odeslat. Jinak se
                odpovědi po zavření stránky smažou.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-5 text-sm">
              {onPickClub && (
                <button
                  type="button"
                  onClick={() => onPickClub(result.nextKind)}
                  className="inline-flex items-center gap-2 font-medium text-gold hover:opacity-75"
                >
                  Najít konkrétní hůl PING <ArrowRight className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={restart}
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-ink"
              >
                <RotateCcw className="h-4 w-4" /> Vyplnit znovu
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
