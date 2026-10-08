/**
 * GOLFOVÝ PROFIL — stromeček krátkých otázek. Klik a jde se dál.
 *
 * Každý uzel má otázku a 2–5 krátkých odpovědí. Odpověď určuje, kam se jde
 * dál (`next`), takže začátečník dostane jiné otázky než hráč, kterého štve
 * driver. Každý odklikne jen 4–5 otázek.
 *
 * Všechny texty, které zákazník vidí, jsou tady — Petr je může upravit.
 */

export type NodeId =
  | "frekvence"
  | "zac_hole"
  | "zac_nejhur"
  | "stve"
  | "driver_let"
  | "driver_bez"
  | "zeleza"
  | "kratka"
  | "pat"
  | "let"
  | "jde"
  | "hole";

export type TreeOption = { id: string; label: string; next: NodeId | "konec" };
export type TreeNode = { id: NodeId; title: string; options: TreeOption[] };

const toJde = "jde" as const;

export const TREE: Record<NodeId, TreeNode> = {
  frekvence: {
    id: "frekvence",
    title: "Jak často hrajete?",
    options: [
      { id: "tyden", label: "Každý týden", next: "stve" },
      { id: "mesic", label: "Párkrát měsíčně", next: "stve" },
      { id: "rok", label: "Párkrát ročně", next: "stve" },
      { id: "zacinam", label: "Začínám", next: "zac_hole" },
    ],
  },

  // --- Začátečník ---
  zac_hole: {
    id: "zac_hole",
    title: "Máte vlastní hole?",
    options: [
      { id: "ano", label: "Ano", next: "zac_nejhur" },
      { id: "pujcene", label: "Půjčené", next: "zac_nejhur" },
      { id: "ne", label: "Zatím ne", next: "zac_nejhur" },
    ],
  },
  zac_nejhur: {
    id: "zac_nejhur",
    title: "Co jde nejhůř?",
    options: [
      { id: "trefit", label: "Trefit míč", next: "konec" },
      { id: "vzduch", label: "Dostat ho do vzduchu", next: "konec" },
      { id: "smer", label: "Směr", next: "konec" },
      { id: "vse", label: "Všechno", next: "konec" },
    ],
  },

  // --- Hráč ---
  stve: {
    id: "stve",
    title: "Co vás nejvíc štve?",
    options: [
      { id: "odpaliste", label: "Odpaliště", next: "driver_let" },
      { id: "green", label: "Rány na green", next: "zeleza" },
      { id: "kolem", label: "Kolem greenu", next: "kratka" },
      { id: "pat", label: "Na greenu", next: "pat" },
      { id: "vse", label: "Všechno trochu", next: "let" },
    ],
  },
  driver_let: {
    id: "driver_let",
    title: "Kam letí driver?",
    options: [
      { id: "slice", label: "Doprava", next: "driver_bez" },
      { id: "hook", label: "Doleva", next: "driver_bez" },
      { id: "kratce", label: "Krátce", next: "driver_bez" },
      { id: "vsude", label: "Všude", next: "driver_bez" },
    ],
  },
  driver_bez: {
    id: "driver_bez",
    title: "Z týčka hrajete i něčím jiným?",
    options: [
      { id: "ano", label: "Jo, dřevo nebo hybrid", next: toJde },
      { id: "ne", label: "Ne, jen driver", next: toJde },
    ],
  },
  zeleza: {
    id: "zeleza",
    title: "Co dělají železa?",
    options: [
      { id: "hrabou", label: "Hrabou do země", next: toJde },
      { id: "bokem", label: "Utíkají bokem", next: toJde },
      { id: "nizko", label: "Letí nízko", next: toJde },
      { id: "stejne", label: "Všechna stejně daleko", next: toJde },
    ],
  },
  kratka: {
    id: "kratka",
    title: "Co je nejhorší?",
    options: [
      { id: "cip", label: "Čip", next: toJde },
      { id: "bunkr", label: "Bunkr", next: toJde },
      { id: "pitch", label: "Přes překážku", next: toJde },
    ],
  },
  pat: {
    id: "pat",
    title: "Kde ztrácíte?",
    options: [
      { id: "kratke", label: "Krátké putty", next: toJde },
      { id: "dlouhe", label: "Dlouhé putty", next: toJde },
      { id: "oboji", label: "Obojí", next: toJde },
    ],
  },
  let: {
    id: "let",
    title: "Kam letí míč?",
    options: [
      { id: "slice", label: "Doprava", next: toJde },
      { id: "hook", label: "Doleva", next: toJde },
      { id: "kratce", label: "Krátce", next: toJde },
      { id: "vsude", label: "Všude", next: toJde },
    ],
  },
  jde: {
    id: "jde",
    title: "A co vám jde?",
    options: [
      { id: "driver", label: "Driver", next: "hole" },
      { id: "zeleza", label: "Železa", next: "hole" },
      { id: "kratka", label: "Krátká hra", next: "hole" },
      { id: "pat", label: "Pat", next: "hole" },
      { id: "nic", label: "Nic moc", next: "hole" },
    ],
  },
  hole: {
    id: "hole",
    title: "Vaše hole?",
    options: [
      { id: "nove", label: "Nové", next: "konec" },
      { id: "stare", label: "Starší 6 let", next: "konec" },
      { id: "bazar", label: "Po někom", next: "konec" },
      { id: "fit", label: "Na míru", next: "konec" },
    ],
  },
};

export const START: NodeId = "frekvence";

export type ProfileAnswers = Partial<Record<NodeId, string>>;

export type AreaResult = {
  area: string;
  status: "silne" | "zlepsit";
  headline: string;
  tip: string;
};

export type ProfileResult = {
  persona: { name: string; text: string };
  areas: AreaResult[];
  fitScore: number;
  fitLabel: string;
  keyMessage: string;
  nextKind: "driver" | "dlouhe" | "zeleza" | "wedge" | "putter";
};

const lbl = (n: NodeId, a: ProfileAnswers) => TREE[n].options.find((o) => o.id === a[n])?.label;

/** Shrnutí odpovědí pro e-mail Petrovi (jen otázky, které zákazník viděl). */
export function profileSummary(a: ProfileAnswers): string {
  return (Object.keys(TREE) as NodeId[])
    .filter((n) => a[n])
    .map((n) => `${TREE[n].title} ${lbl(n, a)}`)
    .join("\n");
}

const FLIGHT_TIP: Record<string, { headline: string; tip: string }> = {
  slice: {
    headline: "Slice doprava",
    tip: "Slice zhoršuje hůl s otevřenou hlavou nebo nevhodným shaftem. Existují hole, které ho přímo korigují.",
  },
  hook: {
    headline: "Hook doleva",
    tip: "Hook často způsobí moc lehká nebo měkká hůl, případně špatný lie úhel. To se dá změřit.",
  },
  kratce: {
    headline: "Málo délky",
    tip: "Délka se často skrývá ve shaftu a loftu, ne v síle. Správná hůl ji vrátí.",
  },
  vsude: {
    headline: "Pokaždé jinam",
    tip: "Když hůl nesedí, tělo každou ránu kompenzuje jinak. Hůl na míru je první krok ke konzistenci.",
  },
};

export function evaluate(a: ProfileAnswers): ProfileResult {
  const areas: AreaResult[] = [];
  const begin = a.frekvence === "zacinam";

  if (begin) {
    if (a.zac_hole === "pujcene")
      areas.push({
        area: "Výbava",
        status: "zlepsit",
        headline: "Půjčené hole",
        tip: "Hole po někom jsou nastavené na jeho výšku a švih. Začátečník s nimi zbytečně bojuje.",
      });
    if (a.zac_hole === "ne")
      areas.push({
        area: "Výbava",
        status: "zlepsit",
        headline: "Ještě bez holí",
        tip: "Nekupujte celý set naslepo. Začněte jednou dvěma holemi na míru — ušetříte peníze i nervy.",
      });
    const hard: Record<string, AreaResult> = {
      trefit: {
        area: "Kontakt s míčem",
        status: "zlepsit",
        headline: "Netrefuju",
        tip: "Moc dlouhá nebo krátká hůl vás nutí hledat míč pokaždé jinak. Správná délka je půlka úspěchu.",
      },
      vzduch: {
        area: "Let míče",
        status: "zlepsit",
        headline: "Míč po zemi",
        tip: "Začátečníkovi pomůže víc loftu a lehčí shaft — míč se zvedne sám.",
      },
      smer: {
        area: "Směr",
        status: "zlepsit",
        headline: "Míč uhýbá",
        tip: "Špatný lie úhel posílá míč bokem, i když je švih v pořádku.",
      },
      vse: {
        area: "Začátky",
        status: "zlepsit",
        headline: "Všechno najednou",
        tip: "Normální. Se správnou holí se učíte švih, ne kompenzaci chyb vybavení.",
      },
    };
    if (a.zac_nejhur && hard[a.zac_nejhur]) areas.push(hard[a.zac_nejhur]!);
  } else {
    // Co štve
    if (a.stve === "odpaliste") {
      const f = FLIGHT_TIP[a.driver_let ?? ""];
      if (f) areas.push({ area: "Driver", status: "zlepsit", ...f });
      areas.push(
        a.driver_bez === "ano"
          ? {
              area: "Z týčka",
              status: "silne",
              headline: "Máte plán B",
              tip: "Dřevo nebo hybrid z týčka je chytrá volba. Na fittingu zjistíme, jestli driver jen nemá špatný loft nebo shaft.",
            }
          : {
              area: "Z týčka",
              status: "zlepsit",
              headline: "Jen driver",
              tip: "Když driver nesedí, není ostuda hrát z týčka hybrid nebo dřevo — často letí rovněji a skóre to pozná hned.",
            },
      );
    }
    if (a.stve === "green") {
      const t: Record<string, { headline: string; tip: string }> = {
        hrabou: {
          headline: "Hrabou do země",
          tip: "Často je za tím špatná délka nebo lie úhel. Jeden stupeň lie dělá na greenu metry.",
        },
        bokem: {
          headline: "Utíkají bokem",
          tip: "Když spodní hrana nesedí na zem rovně, míč odchází bokem. Fitting to měří jako první.",
        },
        nizko: { headline: "Letí nízko", tip: "Nízký let bývá otázka loftu a shaftu, ne síly." },
        stejne: {
          headline: "Stejně daleko",
          tip: "Mezi holemi chybí mezery. Lofty se dají nastavit tak, aby každá hůl měla svou práci.",
        },
      };
      if (a.zeleza && t[a.zeleza])
        areas.push({ area: "Železa", status: "zlepsit", ...t[a.zeleza]! });
    }
    if (a.stve === "kolem") {
      const t: Record<string, { headline: string; tip: string }> = {
        cip: { headline: "Čipy", tip: "Na čipy existuje čipr — hraje se skoro jako putter." },
        bunkr: {
          headline: "Bunkry",
          tip: "Wedge se správným bounce vás z písku dostane napoprvé.",
        },
        pitch: {
          headline: "Přes překážku",
          tip: "Vyšší loft a správný grind udělají z pitche jednoduchou ránu.",
        },
      };
      if (a.kratka && t[a.kratka])
        areas.push({ area: "Krátká hra", status: "zlepsit", ...t[a.kratka]! });
    }
    if (a.stve === "pat") {
      areas.push({
        area: "Pat",
        status: "zlepsit",
        headline:
          a.pat === "kratke"
            ? "Krátké putty"
            : a.pat === "dlouhe"
              ? "Dlouhé putty"
              : "Krátké i dlouhé",
        tip: "Putter má sedět k vašemu pohybu — délka, váha a tvar hlavy rozhodují víc, než se zdá.",
      });
    }
    if (a.stve === "vse") {
      const f = FLIGHT_TIP[a.let ?? ""];
      if (f) areas.push({ area: "Let míče", status: "zlepsit", ...f });
    }

    // Co jde — „umíte tohle, nemusíte umět tamto"
    const good: Record<string, { area: string; tip: string }> = {
      driver: {
        area: "Driver",
        tip: "Z odpaliště to umíte. Teď ještě dostat zbytek bagu na stejnou úroveň.",
      },
      zeleza: { area: "Železa", tip: "Železa vám jdou — to je základ dobrého skóre." },
      kratka: {
        area: "Krátká hra",
        tip: "Kolem greenu šetříte rány. Delší hole vám je zatím berou zpátky.",
      },
      pat: { area: "Pat", tip: "Na greenu to umíte — putter neměňte, jen ho zkontrolujeme." },
    };
    const g = a.jde ? good[a.jde] : undefined;
    if (g && !areas.some((x) => x.area === g.area)) {
      areas.unshift({ area: g.area, status: "silne", headline: "Silná stránka", tip: g.tip });
    }

    // Hole
    if (a.hole === "stare")
      areas.push({
        area: "Výbava",
        status: "zlepsit",
        headline: "Hole po letech",
        tip: "Za 6 let se hole i váš švih změnily. Hlavně gripy a shafty stojí za kontrolu.",
      });
    if (a.hole === "bazar")
      areas.push({
        area: "Výbava",
        status: "zlepsit",
        headline: "Hole po někom",
        tip: "Nastavené na cizí výšku a švih — nejčastější skrytý problém, který fitting najde.",
      });
    if (a.hole === "nove")
      areas.push({
        area: "Výbava",
        status: "zlepsit",
        headline: "Nové, ale z regálu",
        tip: "Nová hůl bez měření má průměrné parametry. Délku, lie i shaft jde doladit.",
      });
  }

  const weak = areas.filter((x) => x.status === "zlepsit");
  const strong = areas.filter((x) => x.status === "silne");
  let fitScore = Math.min(
    100,
    35 +
      weak.length * 15 +
      (begin ? 15 : 0) +
      (a.hole === "bazar" || a.zac_hole === "pujcene" ? 10 : 0),
  );
  if (a.hole === "fit") fitScore = Math.max(25, fitScore - 30);
  const fitLabel = fitScore >= 75 ? "Velmi vysoký" : fitScore >= 50 ? "Vysoký" : "Doladění";

  const persona = begin
    ? {
        name: "Začínající objevitel",
        text: "Teď je nejlepší chvíle — se správnou holí si nezafixujete chyby, které se pak roky odnaučují.",
      }
    : a.jde === "driver" && a.stve !== "odpaliste"
      ? {
          name: "Bombarďák z odpaliště",
          text: "Daleko to umíte. Teď ještě dostat míč z fairwaye na green.",
        }
      : a.jde === "zeleza" && a.stve === "odpaliste"
        ? {
            name: "Precizní železář",
            text: "Železa jdou, odpaliště je loterie. Klasika — a dobře řešitelná.",
          }
        : a.jde === "pat"
          ? {
              name: "Jistota na greenu",
              text: "Na greenu jste doma. Ostatní hole vám zatím rány berou zpátky.",
            }
          : a.jde === "kratka"
            ? {
                name: "Mistr krátké hry",
                text: "Kolem greenu šetříte rány. Delší hole vám je zatím berou zpátky.",
              }
            : a.jde === "nic"
              ? {
                  name: "Hráč na startu",
                  text: "Žádný strach — většina toho, co popisujete, nemusí být ve švihu, ale v holích.",
                }
              : a.frekvence === "rok"
                ? {
                    name: "Sváteční golfista",
                    text: "Když hrajete méně, je o to důležitější, aby vám hůl pomáhala, ne překážela.",
                  }
                : {
                    name: "Hráč na rozcestí",
                    text: "Pár věcí funguje, pár ne. Přesně tady fitting dělá největší rozdíl.",
                  };

  const keyMessage =
    strong.length && weak.length
      ? `${strong.map((x) => x.area).join(", ")} — to vám jde. ${weak[0]!.area} — tam je rezerva. To je typické: každá hůl má jinou délku, lie, loft i shaft, a stačí, aby jedna neseděla. Fitting nastaví každou zvlášť.`
      : begin
        ? "Začátek je ideální čas na fitting — naučíte se švih s holí, která vám pasuje, místo kompenzace chyb vybavení."
        : "Většina toho, co popisujete, nemusí být ve švihu, ale v holích. Na fittingu to během jednoho setkání změříme a ukážeme.";

  const nextKind: ProfileResult["nextKind"] =
    a.stve === "odpaliste"
      ? a.driver_bez === "ne"
        ? "dlouhe"
        : "driver"
      : a.stve === "green"
        ? "zeleza"
        : a.stve === "kolem"
          ? "wedge"
          : a.stve === "pat"
            ? "putter"
            : "zeleza";

  return { persona, areas, fitScore, fitLabel, keyMessage, nextKind };
}
