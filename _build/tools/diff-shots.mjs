// Usage: node diff-shots.mjs <shotsDir>
// For each ref_*/local_* screenshot pair: page heights and the share of pixels that differ
// (per-channel delta > 24), computed over the common height. Writes a diff image per pair
// with differing pixels in magenta for review.
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2];
for (const f of readdirSync(dir).filter((f) => f.startsWith('ref_') && f.endsWith('.png'))) {
  const local = f.replace(/^ref_/, 'local_');
  const [a, b] = await Promise.all([f, local].map((n) => sharp(join(dir, n)).ensureAlpha().raw().toBuffer({ resolveWithObject: true })));
  const w = Math.min(a.info.width, b.info.width);
  const h = Math.min(a.info.height, b.info.height);
  const out = Buffer.alloc(w * h * 4);
  let diff = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const ia = (y * a.info.width + x) * 4;
      const ib = (y * b.info.width + x) * 4;
      const o = (y * w + x) * 4;
      const d = Math.max(Math.abs(a.data[ia] - b.data[ib]), Math.abs(a.data[ia + 1] - b.data[ib + 1]), Math.abs(a.data[ia + 2] - b.data[ib + 2]));
      if (d > 24) { diff++; out.set([255, 0, 255, 255], o); } else { const g = (a.data[ia] + a.data[ia + 1] + a.data[ia + 2]) / 3; out.set([g, g, g, 90], o); }
    }
  }
  await sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toFile(join(dir, f.replace(/^ref_/, 'diff_')));
  console.log(`${f.replace(/^ref_/, '').padEnd(48)} ref h=${a.info.height}  local h=${b.info.height}  differing=${((100 * diff) / (w * h)).toFixed(2)}%`);
}
