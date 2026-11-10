// Usage: node enhance-images.mjs <projectRoot>
// Downloads every image in _build/images/manifest.json at its original upload size, enhances it,
// and writes it to public/images/... as WebP. Updates src/data/imageMap.json (remote URL -> local path)
// and _build/images/enhance-report.json. Resumable: finished outputs are skipped.
//
// Enhancement policy:
//   long edge < 1400px  -> Real-ESRGAN x4 (realesrgan-x4plus, photographic model), then downscaled
//                          to 2x the original (max 2400px long edge). Aspect ratio kept; never cropped.
//   long edge >= 1400px -> already high resolution: light unsharp mask + high-quality re-encode.
import sharp from 'sharp';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { join, dirname, basename, extname } from 'node:path';

// libvips' file cache keeps handles open; on Windows that blocks overwriting a file we just read.
sharp.cache(false);

const root = process.argv[2];
const work = join(root, '_build/images');
const esrgan = join(root, '_build/bin/realesrgan/realesrgan-ncnn-vulkan.exe');
const manifest = JSON.parse(readFileSync(join(work, 'manifest.json'), 'utf8'));
const mapPath = join(root, 'src/data/imageMap.json');
const reportPath = join(work, 'enhance-report.json');
const imageMap = existsSync(mapPath) ? JSON.parse(readFileSync(mapPath, 'utf8')) : {};
const report = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, 'utf8')) : {};
mkdirSync(join(work, 'original'), { recursive: true });
mkdirSync(join(work, 'tmp'), { recursive: true });

const AI_BELOW = 1400;
const MAX_EDGE = 2400;

function localPathFor(url) {
  const u = new URL(url);
  const name = basename(u.pathname, extname(u.pathname)).replace(/[^A-Za-z0-9._-]+/g, '-');
  const wp = u.pathname.match(/\/wp-content\/uploads\/(\d{4})\/(\d{2})\//);
  return wp ? `/images/wp/${wp[1]}/${wp[2]}/${name}.webp` : `/images/b44/${name}.webp`;
}

async function download(url) {
  // WordPress serves resized derivatives as name-WxH.ext; the original upload has no suffix.
  const candidates = [...new Set([url.replace(/-\d+x\d+(\.\w+)$/, '$1'), url])];
  for (const c of candidates) {
    const res = await fetch(c, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130 Safari/537.36' } });
    if (res.ok && /^image\//.test(res.headers.get('content-type') ?? '')) return { buf: Buffer.from(await res.arrayBuffer()), fetched: c };
  }
  return null;
}

async function enhance(input, outAbs) {
  const meta = await sharp(input).metadata();
  const long = Math.max(meta.width, meta.height);
  mkdirSync(dirname(outAbs), { recursive: true });
  const webp = { quality: 88, alphaQuality: 95, effort: 5, smartSubsample: true };
  if (long >= AI_BELOW) {
    await sharp(input).rotate().sharpen({ sigma: 0.6, m1: 0.5, m2: 1.2 }).webp(webp).toFile(outAbs);
    const o = await sharp(outAbs).metadata();
    return { method: 'sharpen+re-encode (already high resolution)', from: [meta.width, meta.height], to: [o.width, o.height] };
  }
  const tmpIn = join(work, 'tmp', 'in.png');
  const tmpOut = join(work, 'tmp', 'out.png');
  await sharp(input).rotate().png().toFile(tmpIn);
  // Small tiles: with the default (auto) tile size this Intel iGPU returns black or partly black tiles.
  try {
    execFileSync(esrgan, ['-i', tmpIn, '-o', tmpOut, '-n', 'realesrgan-x4plus', '-f', 'png', '-t', '64'], { stdio: 'ignore', cwd: dirname(esrgan) });
  } catch { /* checked below */ }
  const scale = Math.min(2, MAX_EDGE / long) > 1 ? Math.min(2, MAX_EDGE / long) : 1;
  const w = Math.round(meta.width * scale);
  const ok = existsSync(tmpOut) && (await matchesOriginal(input, tmpOut));
  if (ok) await sharp(tmpOut).resize({ width: w, kernel: 'lanczos3' }).webp(webp).toFile(outAbs);
  rmSync(tmpIn, { force: true }); rmSync(tmpOut, { force: true });
  if (!ok) {
    // AI output was black/corrupted: keep the original, lightly sharpened, rather than a broken image.
    await sharp(input).rotate().sharpen({ sigma: 0.6, m1: 0.5, m2: 1.2 }).webp(webp).toFile(outAbs);
    const o = await sharp(outAbs).metadata();
    return { method: 'sharpen+re-encode (Real-ESRGAN output failed validation)', from: [meta.width, meta.height], to: [o.width, o.height] };
  }
  const o = await sharp(outAbs).metadata();
  return { method: 'Real-ESRGAN x4plus, resampled to ~2x', from: [meta.width, meta.height], to: [o.width, o.height] };
}

// Thumbnail comparison: an enhanced image must have about the same brightness as its original
// in every region (catches all-black, partly black and blown-out outputs).
async function grid(file) {
  const { data } = await sharp(file).flatten({ background: '#ffffff' }).resize(8, 8, { fit: 'fill' }).greyscale().raw().toBuffer({ resolveWithObject: true });
  return [...data];
}
async function matchesOriginal(original, candidate) {
  const [a, b] = await Promise.all([grid(original), grid(candidate)]);
  return a.every((v, i) => Math.abs(v - b[i]) <= 40);
}

let n = 0;
for (const { url } of manifest) {
  n++;
  const out = localPathFor(url);
  const outAbs = join(root, 'public', out);
  if (existsSync(outAbs) && report[url]?.status === 'ok') {
    // Re-validate finished outputs against their originals; redo any that came out wrong.
    const orig = report[url].fetched && join(work, 'original', out.replace(/^\/images\//, '').replace(/\//g, '__').replace(/\.webp$/, extname(new URL(report[url].fetched).pathname)));
    if (!orig || !existsSync(orig) || (await matchesOriginal(orig, outAbs))) { imageMap[url] = out; continue; }
    console.log(`[${n}/${manifest.length}] redo (failed validation) ${out}`);
  }
  try {
    const got = await download(url);
    if (!got) { report[url] = { status: 'missing', note: 'Could not be downloaded (not an image or HTTP error).' }; console.log(`[${n}/${manifest.length}] MISSING ${url}`); continue; }
    const orig = join(work, 'original', out.replace(/^\/images\//, '').replace(/\//g, '__').replace(/\.webp$/, extname(new URL(got.fetched).pathname)));
    writeFileSync(orig, got.buf);
    const r = await enhance(orig, outAbs);
    report[url] = { status: 'ok', local: out, fetched: got.fetched, ...r };
    imageMap[url] = out;
    console.log(`[${n}/${manifest.length}] ${r.from.join('x')} -> ${r.to.join('x')}  ${out}`);
  } catch (e) {
    report[url] = { status: 'error', note: String(e.message ?? e).slice(0, 200) };
    console.log(`[${n}/${manifest.length}] ERROR ${url}: ${e.message}`);
  }
  // Save progress as we go so an interrupted run can resume.
  writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
  writeFileSync(reportPath, JSON.stringify(report, null, 2));
}

writeFileSync(mapPath, JSON.stringify(imageMap, null, 2));
writeFileSync(reportPath, JSON.stringify(report, null, 2));
const vals = Object.values(report);
console.log(`done: ${vals.filter((v) => v.status === 'ok').length} ok, ${vals.filter((v) => v.status !== 'ok').length} not ok`);
