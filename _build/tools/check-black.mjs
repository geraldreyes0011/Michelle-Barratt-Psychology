// Usage: node check-black.mjs <projectRoot>
// Compares each enhanced image with its downloaded original: flags outputs that are (near) black
// or whose average brightness differs strongly from the original.
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.argv[2];
const report = JSON.parse(readFileSync(join(root, '_build/images/enhance-report.json'), 'utf8'));
const work = join(root, '_build/images');

// Mean brightness (0-255) and share of near-black pixels, on a small thumbnail, alpha-flattened to white.
async function stats(file) {
  const { data } = await sharp(file).flatten({ background: '#ffffff' }).resize(64, 64, { fit: 'fill' }).raw().toBuffer({ resolveWithObject: true });
  let sum = 0, dark = 0;
  for (let i = 0; i < data.length; i += 3) {
    const l = (data[i] + data[i + 1] + data[i + 2]) / 3;
    sum += l;
    if (l < 8) dark++;
  }
  return { mean: sum / (data.length / 3), dark: dark / (data.length / 3) };
}

const bad = [];
for (const [url, r] of Object.entries(report)) {
  if (r.status !== 'ok' || !r.local) {
    bad.push({ url, local: r.local ?? '(none)', method: `status=${r.status}: ${r.note ?? ''}`.slice(0, 120), outMean: '-', origMean: '-', dark: '-' });
    continue;
  }
  const local = join(root, 'public', r.local);
  let out;
  try { out = await stats(local); } catch { continue; }
  const origName = r.local.replace(/^\/images\//, '').replace(/\//g, '__').replace(/\.webp$/, '');
  const ext = r.fetched ? new URL(r.fetched).pathname.match(/\.\w+$/)[0] : '';
  let orig = null;
  try { orig = await stats(join(work, 'original', origName + ext)); } catch {}
  const isBad = out.dark > 0.9 || (orig && Math.abs(out.mean - orig.mean) > 25);
  if (isBad) bad.push({ url, local: r.local, method: r.method, outMean: out.mean.toFixed(1), origMean: orig?.mean.toFixed(1), dark: (out.dark * 100).toFixed(0) + '%' });
}
console.log(`${bad.length} problem images`);
for (const b of bad) console.log(`${b.local}  out=${b.outMean} orig=${b.origMean} dark=${b.dark}  [${b.method}]`);
