/**
 * QR kód jako PNG — kvůli e-mailu.
 *
 * Gmail ani Outlook nezobrazují SVG ani obrázky v data-URI, takže QR platba
 * jde do potvrzení jako PNG příloha. Kodér je minimální (šedotónový PNG,
 * 8 bitů) a kompresi dělá vestavěný CompressionStream, který je dostupný
 * v Node 18+ i v Cloudflare Workers — žádná knihovna navíc.
 */

import { qrMatrix } from "./qr-kod";

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (const b of bytes) c = CRC_TABLE[(c ^ b) & 0xff]! ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function u32(n: number): Uint8Array {
  return new Uint8Array([(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}

function chunk(type: string, data: Uint8Array): Uint8Array {
  const typeBytes = new TextEncoder().encode(type);
  const body = concat([typeBytes, data]);
  return concat([u32(data.length), body, u32(crc32(body))]);
}

/** zlib (formát „deflate" podle Compression Streams API = RFC 1950, jak chce PNG). */
async function zlib(data: Uint8Array): Promise<Uint8Array> {
  const stream = new Blob([data as BlobPart])
    .stream()
    .pipeThrough(new CompressionStream("deflate"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

/** Vrátí PNG s QR kódem; `scale` = pixely na modul, `quiet` = okraj v modulech. */
export async function qrPng(text: string, scale = 8, quiet = 4): Promise<Uint8Array> {
  const m = qrMatrix(text);
  const size = (m.length + quiet * 2) * scale;
  const raw = new Uint8Array(size * (size + 1));
  for (let y = 0; y < size; y++) {
    const row = y * (size + 1);
    raw[row] = 0; // filtr „None"
    const r = Math.floor(y / scale) - quiet;
    for (let x = 0; x < size; x++) {
      const c = Math.floor(x / scale) - quiet;
      const dark = r >= 0 && c >= 0 && r < m.length && c < m.length && m[r]![c]!;
      raw[row + 1 + x] = dark ? 0 : 255;
    }
  }
  const ihdr = concat([u32(size), u32(size), new Uint8Array([8, 0, 0, 0, 0])]); // 8 bit, šedá
  return concat([
    new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("IDAT", await zlib(raw)),
    chunk("IEND", new Uint8Array()),
  ]);
}

/** Base64 bez Bufferu (Workers ho nemusí mít). */
export function toBase64(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i += 0x8000) {
    s += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(s);
}

export function utf8Base64(text: string): string {
  return toBase64(new TextEncoder().encode(text));
}
