// Usage: node convert-chunks.mjs <chunksDir> <outDir>
// Each Base44 page-data chunk is a self-contained ES module: `export { x as default }`
// with { title, description, html }. Import it and write it out as plain JSON,
// named by its data key (hash suffix stripped).
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const [, , chunksDir, outDir] = process.argv;
let n = 0;
for (const f of readdirSync(chunksDir)) {
  if (!f.endsWith('.js')) continue;
  const src = readFileSync(join(chunksDir, f), 'utf8');
  if (!/\bhtml\b/.test(src) || src.length < 500 || /^import/.test(src)) continue; // route stubs / components
  const key = f.replace(/-[A-Za-z0-9_-]{8}\.js$/, '');
  const mod = await import(pathToFileURL(join(chunksDir, f)).href);
  const data = mod.default;
  if (!data?.html) { console.warn('skip (no html):', f); continue; }
  writeFileSync(join(outDir, `${key}.json`), JSON.stringify(data, null, 2));
  n++;
}
console.log(`wrote ${n} page files`);
