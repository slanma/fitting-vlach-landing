/**
 * Generátor QR kódů — bajtový režim, úroveň korekce M, verze 1–15.
 *
 * Napsané přímo tady schválně: web tak nepotřebuje žádnou knihovnu navíc,
 * takže nasazení nemůže spadnout na chybějící závislosti. Rozsah stačí
 * s velkou rezervou na platební řetězce SPAYD (ty mají kolem 130 znaků).
 *
 * Výstup ověřen proti knihovně `qrcode` — matice vycházejí shodně.
 */

/** [EC kódů na blok, bloků skupiny 1, dat/blok, bloků skupiny 2, dat/blok] */
const EC_M: Record<number, [number, number, number, number, number]> = {
  1: [10, 1, 16, 0, 0],
  2: [16, 1, 28, 0, 0],
  3: [26, 1, 44, 0, 0],
  4: [18, 2, 32, 0, 0],
  5: [24, 2, 43, 0, 0],
  6: [16, 4, 27, 0, 0],
  7: [18, 4, 31, 0, 0],
  8: [22, 2, 38, 2, 39],
  9: [22, 3, 36, 2, 37],
  10: [26, 4, 43, 1, 44],
  11: [30, 1, 50, 4, 51],
  12: [22, 6, 36, 2, 37],
  13: [22, 8, 37, 1, 38],
  14: [24, 4, 40, 5, 41],
  15: [24, 5, 41, 5, 42],
};

const ALIGN: Record<number, number[]> = {
  1: [],
  2: [6, 18],
  3: [6, 22],
  4: [6, 26],
  5: [6, 30],
  6: [6, 34],
  7: [6, 22, 38],
  8: [6, 24, 42],
  9: [6, 26, 46],
  10: [6, 28, 50],
  11: [6, 30, 54],
  12: [6, 32, 58],
  13: [6, 34, 62],
  14: [6, 26, 46, 66],
  15: [6, 26, 48, 70],
};

// --- aritmetika v Galoisově tělese GF(256) ---
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]!;
})();

const mul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a]! + LOG[b]!]!);

/**
 * Dělitel Reedova–Solomonova kódu. Pole má délku `degree`, vedoucí
 * koeficient 1 se neukládá.
 */
function rsDivisor(degree: number): number[] {
  const result = new Array<number>(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i++) {
    for (let j = 0; j < degree; j++) {
      result[j] = mul(result[j]!, root);
      if (j + 1 < degree) result[j] = result[j]! ^ result[j + 1]!;
    }
    root = mul(root, 0x02);
  }
  return result;
}

/** Korekční kódová slova = zbytek po dělení. */
function rsEncode(data: number[], ecLen: number): number[] {
  const divisor = rsDivisor(ecLen);
  const rest = new Array<number>(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ rest.shift()!;
    rest.push(0);
    for (let i = 0; i < ecLen; i++) rest[i] = rest[i]! ^ mul(divisor[i]!, factor);
  }
  return rest;
}

/** Kapacita dat v bajtech pro danou verzi při úrovni M. */
function capacity(version: number): number {
  const [ec, b1, d1, b2, d2] = EC_M[version]!;
  void ec;
  const dataCodewords = b1 * d1 + b2 * d2;
  const headerBits = 4 + (version >= 10 ? 16 : 8);
  return dataCodewords - Math.ceil(headerBits / 8);
}

function pickVersion(byteLen: number): number {
  for (let v = 1; v <= 15; v++) {
    if (byteLen <= capacity(v)) return v;
  }
  throw new Error("Text je na QR kód příliš dlouhý.");
}

/** 15bitová informace o formátu (úroveň M = 00) s BCH kódem. */
function formatBits(mask: number): number {
  let value = (0b00 << 3) | mask;
  let rest = value << 10;
  for (let i = 4; i >= 0; i--) {
    if (rest & (1 << (i + 10))) rest ^= 0b10100110111 << i;
  }
  value = ((value << 10) | rest) ^ 0b101010000010010;
  return value;
}

/** 18bitová informace o verzi (jen verze 7 a vyšší). */
function versionBits(version: number): number {
  let rest = version << 12;
  for (let i = 5; i >= 0; i--) {
    if (rest & (1 << (i + 12))) rest ^= 0b1111100100101 << i;
  }
  return (version << 12) | rest;
}

type Grid = { size: number; modules: (boolean | null)[][] };

function blankGrid(version: number): Grid {
  const size = version * 4 + 17;
  return {
    size,
    modules: Array.from({ length: size }, () => new Array<boolean | null>(size).fill(null)),
  };
}

function placeFinder(g: Grid, row: number, col: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = row + r;
      const cc = col + c;
      if (rr < 0 || rr >= g.size || cc < 0 || cc >= g.size) continue;
      const inRing =
        (r >= 0 && r <= 6 && (c === 0 || c === 6)) || (c >= 0 && c <= 6 && (r === 0 || r === 6));
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
      g.modules[rr]![cc] = inRing || inCore;
    }
  }
}

function placeFunctionPatterns(g: Grid, version: number) {
  placeFinder(g, 0, 0);
  placeFinder(g, 0, g.size - 7);
  placeFinder(g, g.size - 7, 0);

  // Časovací pruhy
  for (let i = 8; i < g.size - 8; i++) {
    const on = i % 2 === 0;
    g.modules[6]![i] = on;
    g.modules[i]![6] = on;
  }

  // Zarovnávací čtverce
  const centers = ALIGN[version]!;
  for (const r of centers) {
    for (const c of centers) {
      const nearFinder =
        (r <= 8 && c <= 8) || (r <= 8 && c >= g.size - 9) || (r >= g.size - 9 && c <= 8);
      if (nearFinder) continue;
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          g.modules[r + dr]![c + dc] = Math.max(Math.abs(dr), Math.abs(dc)) !== 1;
        }
      }
    }
  }

  // Tmavý modul
  g.modules[g.size - 8]![8] = true;

  // Rezervace míst pro informaci o formátu
  for (let i = 0; i < 9; i++) {
    if (g.modules[8]![i] === null) g.modules[8]![i] = false;
    if (g.modules[i]![8] === null) g.modules[i]![8] = false;
  }
  for (let i = 0; i < 8; i++) {
    if (g.modules[8]![g.size - 1 - i] === null) g.modules[8]![g.size - 1 - i] = false;
    if (g.modules[g.size - 1 - i]![8] === null) g.modules[g.size - 1 - i]![8] = false;
  }

  if (version >= 7) {
    const bits = versionBits(version);
    for (let i = 0; i < 18; i++) {
      const on = ((bits >> i) & 1) === 1;
      const a = Math.floor(i / 3);
      const b = (i % 3) + g.size - 11;
      g.modules[a]![b] = on;
      g.modules[b]![a] = on;
    }
  }
}

/** Pomocná maska označující, které moduly jsou funkční (nesmí se do nich psát). */
function functionMask(version: number): boolean[][] {
  const g = blankGrid(version);
  placeFunctionPatterns(g, version);
  return g.modules.map((row) => row.map((m) => m !== null));
}

function buildCodewords(text: string, version: number): number[] {
  const bytes = Array.from(new TextEncoder().encode(text));
  const [ecLen, b1, d1, b2, d2] = EC_M[version]!;
  const totalData = b1 * d1 + b2 * d2;

  const bits: number[] = [];
  const push = (value: number, len: number) => {
    for (let i = len - 1; i >= 0; i--) bits.push((value >> i) & 1);
  };

  push(0b0100, 4); // bajtový režim
  push(bytes.length, version >= 10 ? 16 : 8);
  for (const b of bytes) push(b, 8);

  // Ukončovací sekvence a zarovnání na celé bajty
  for (let i = 0; i < 4 && bits.length < totalData * 8; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j++) byte = (byte << 1) | bits[i + j]!;
    data.push(byte);
  }
  // Výplňové bajty
  const PAD = [0xec, 0x11];
  let padIndex = 0;
  while (data.length < totalData) data.push(PAD[padIndex++ % 2]!);

  // Rozdělení na bloky
  const blocks: number[][] = [];
  const ecBlocks: number[][] = [];
  let offset = 0;
  const layout = [...Array.from({ length: b1 }, () => d1), ...Array.from({ length: b2 }, () => d2)];
  for (const len of layout) {
    const chunk = data.slice(offset, offset + len);
    offset += len;
    blocks.push(chunk);
    ecBlocks.push(rsEncode(chunk, ecLen));
  }

  // Prokládání
  const result: number[] = [];
  const maxData = Math.max(...layout);
  for (let i = 0; i < maxData; i++) {
    for (const block of blocks) if (i < block.length) result.push(block[i]!);
  }
  for (let i = 0; i < ecLen; i++) {
    for (const block of ecBlocks) result.push(block[i]!);
  }
  return result;
}

const MASKS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
];

function penalty(m: boolean[][]): number {
  const n = m.length;
  let score = 0;

  // Pravidlo 1: pět a více stejných modulů v řadě
  for (let i = 0; i < n; i++) {
    for (const horizontal of [true, false]) {
      let run = 1;
      for (let j = 1; j < n; j++) {
        const prev = horizontal ? m[i]![j - 1]! : m[j - 1]![i]!;
        const cur = horizontal ? m[i]![j]! : m[j]![i]!;
        if (cur === prev) {
          run++;
        } else {
          if (run >= 5) score += run - 2;
          run = 1;
        }
      }
      if (run >= 5) score += run - 2;
    }
  }

  // Pravidlo 2: bloky 2×2
  for (let r = 0; r < n - 1; r++) {
    for (let c = 0; c < n - 1; c++) {
      const v = m[r]![c]!;
      if (v === m[r]![c + 1] && v === m[r + 1]![c] && v === m[r + 1]![c + 1]) score += 3;
    }
  }

  // Pravidlo 3: vzory připomínající hledáček
  const A = [true, false, true, true, true, false, true, false, false, false, false];
  const B = [false, false, false, false, true, false, true, true, true, false, true];
  const matches = (get: (k: number) => boolean, start: number, pat: boolean[]) => {
    for (let k = 0; k < 11; k++) if (get(start + k) !== pat[k]) return false;
    return true;
  };
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= n - 11; j++) {
      if (matches((k) => m[i]![k]!, j, A) || matches((k) => m[i]![k]!, j, B)) score += 40;
      if (matches((k) => m[k]![i]!, j, A) || matches((k) => m[k]![i]!, j, B)) score += 40;
    }
  }

  // Pravidlo 4: poměr tmavých modulů
  let dark = 0;
  for (const row of m) for (const v of row) if (v) dark++;
  const percent = (dark * 100) / (n * n);
  score += Math.abs(Math.ceil(percent / 5) - 10) * 10;

  return score;
}

/** Vrátí matici modulů: `true` = tmavý. */
export function qrMatrix(text: string): boolean[][] {
  const version = pickVersion(new TextEncoder().encode(text).length);
  const codewords = buildCodewords(text, version);
  const reserved = functionMask(version);
  const size = version * 4 + 17;

  // Rozmístění dat klikatě zprava doleva
  const base: boolean[][] = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );
  let bitIndex = 0;
  const totalBits = codewords.length * 8;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5; // svislý časovací pruh se přeskakuje celý
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const col = right - j;
        const upward = ((right + 1) & 2) === 0;
        const row = upward ? size - 1 - vert : vert;
        if (reserved[row]![col]) continue;
        if (bitIndex < totalBits) {
          const byte = codewords[bitIndex >> 3]!;
          base[row]![col] = ((byte >> (7 - (bitIndex & 7))) & 1) === 1;
          bitIndex++;
        }
      }
    }
  }

  // Výběr masky s nejnižším penalizačním skóre
  let best: boolean[][] | null = null;
  let bestScore = Infinity;
  let bestMask = 0;

  const fn = blankGrid(version);
  placeFunctionPatterns(fn, version);

  for (let mask = 0; mask < 8; mask++) {
    const m = base.map((row, r) =>
      row.map((v, c) => (reserved[r]![c] ? fn.modules[r]![c] === true : v !== MASKS[mask]!(r, c))),
    );
    applyFormat(m, mask, size);
    const s = penalty(m);
    if (s < bestScore) {
      bestScore = s;
      best = m;
      bestMask = mask;
    }
  }
  void bestMask;
  return best!;
}

function applyFormat(m: boolean[][], mask: number, size: number) {
  const bits = formatBits(mask);
  const on = (i: number) => ((bits >> i) & 1) === 1;

  // První kopie kolem levého horního hledáčku
  for (let i = 0; i <= 5; i++) m[i]![8] = on(i);
  m[7]![8] = on(6);
  m[8]![8] = on(7);
  m[8]![7] = on(8);
  for (let i = 9; i < 15; i++) m[8]![14 - i] = on(i);

  // Druhá kopie: bity 0–7 vodorovně vpravo, bity 8–14 svisle dole
  for (let i = 0; i < 8; i++) m[8]![size - 1 - i] = on(i);
  for (let i = 8; i < 15; i++) m[size - 15 + i]![8] = on(i);

  m[size - 8]![8] = true; // tmavý modul
}

/** Vykreslí kód jako samostatné SVG (bílé pozadí, černé moduly). */
export function qrSvg(text: string, pixelSize = 320, quiet = 4): string {
  const m = qrMatrix(text);
  const n = m.length;
  const total = n + quiet * 2;
  let path = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (m[r]![c]) path += `M${c + quiet} ${r + quiet}h1v1h-1z`;
    }
  }
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${pixelSize}" height="${pixelSize}" ` +
    `viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges">` +
    `<rect width="${total}" height="${total}" fill="#ffffff"/>` +
    `<path d="${path}" fill="#000000"/></svg>`
  );
}
